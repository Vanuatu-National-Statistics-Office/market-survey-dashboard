from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

from openpyxl import load_workbook


MONTHS = {
    "JAN": (1, "January"),
    "FEB": (2, "February"),
    "MAR": (3, "March"),
    "APR": (4, "April"),
    "MAY": (5, "May"),
    "JUN": (6, "June"),
    "JUL": (7, "July"),
    "AUG": (8, "August"),
    "SEP": (9, "September"),
    "OCT": (10, "October"),
    "NOV": (11, "November"),
    "DEC": (12, "December"),
}

QUARTER_NAMES = {
    3: "March Quarter",
    6: "June Quarter",
    9: "September Quarter",
    12: "December Quarter",
}

GROUP_NAMES = {
    "STAPLE PRODUCE": "Staple Produce",
    "FRUITS": "Fruits",
    "VEGETABLE PRODUCE": "Vegetables",
}


def clean_text(value) -> str:
    if value is None:
        return ""
    return str(value).strip()


def number(value):
    if value is None or value == "":
        return None

    if isinstance(value, bool):
        return int(value)

    if isinstance(value, (int, float)):
        if isinstance(value, float) and value.is_integer():
            return int(value)
        return value

    try:
        result = float(str(value).replace(",", "").strip())
        if result.is_integer():
            return int(result)
        return result
    except Exception:
        return None


def parse_period(value):
    """
    Converts headers such as:
      JUN.25.AV
      DEC.25..AV
      MAR.26.AV

    into a structured period.
    """
    text = clean_text(value).upper().replace(" ", "")

    match = re.search(
        r"(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)"
        r"\.+(\d{2})\.*AV",
        text,
    )

    if not match:
        return None

    code = match.group(1)
    year = 2000 + int(match.group(2))
    month_number, month_name = MONTHS[code]

    return {
        "code": code,
        "month": month_name,
        "monthNumber": month_number,
        "year": year,
        "label": f"{month_name[:3]} {year}",
        "key": f"{month_name.lower()[:3]}{year}",
    }


def find_table_title_row(ws, table_number: int):
    pattern = re.compile(rf"Table\s*{table_number}\s*:", re.IGNORECASE)

    for row in ws.iter_rows():
        for cell in row:
            if isinstance(cell.value, str) and pattern.search(cell.value):
                return cell.row

    return None


def find_table_sheet(workbook, table_number: int):
    for ws in workbook.worksheets:
        row = find_table_title_row(ws, table_number)
        if row:
            return ws, row

    raise RuntimeError(f"Could not find Table {table_number} in workbook.")


def read_table(workbook, table_number: int):
    ws, title_row = find_table_sheet(workbook, table_number)

    header_row = title_row + 1

    headers = {}
    period_columns = []

    for col in range(1, ws.max_column + 1):
        value = ws.cell(header_row, col).value
        text = clean_text(value)

        if not text:
            continue

        headers[col] = text

        period = parse_period(value)
        if period:
            period_columns.append((col, period))

    produce_col = None
    quarter_change_col = None
    annual_change_col = None

    for col, text in headers.items():
        normalized = text.upper().replace("\n", " ")

        if "PRODUCE" == normalized.strip():
            produce_col = col

        if "PREV QTR" in normalized:
            quarter_change_col = col

        if "% CHNG FROM" in normalized and "PREV QTR" not in normalized:
            annual_change_col = col

    if produce_col is None:
        raise RuntimeError(
            f"Could not locate PRODUCE column for Table {table_number}."
        )

    if not period_columns:
        raise RuntimeError(
            f"Could not detect quarterly columns for Table {table_number}."
        )

    # Find where the next table starts on the same worksheet.
    next_title_row = ws.max_row + 1

    for other_table in range(table_number + 1, 7):
        other_row = find_table_title_row(ws, other_table)

        if other_row and other_row > title_row:
            next_title_row = other_row
            break

    rows = []

    for row_number in range(header_row + 1, next_title_row):
        produce = clean_text(ws.cell(row_number, produce_col).value)

        values = [
            number(ws.cell(row_number, col).value)
            for col, _period in period_columns
        ]

        quarter_change = (
            number(ws.cell(row_number, quarter_change_col).value)
            if quarter_change_col
            else None
        )

        annual_change = (
            number(ws.cell(row_number, annual_change_col).value)
            if annual_change_col
            else None
        )

        # Ignore empty/note rows.
        has_numeric_data = any(v is not None for v in values)

        if not produce and not has_numeric_data:
            continue

        # Ignore footnotes such as "*on the days surveyed".
        if produce.startswith("*") and not has_numeric_data:
            continue

        record = {
            "produce": produce,
            "values": values,
            "quarterChange": quarter_change,
            "annualChange": annual_change,
        }

        upper_produce = produce.upper()

        if upper_produce in GROUP_NAMES:
            record["group"] = True

        # Keep period-name properties too.
        # This means the current dashboard continues working
        # while we gradually convert it to fully dynamic periods.
        for index, (_col, period) in enumerate(period_columns):
            record[period["key"]] = values[index]

        rows.append(record)

    return {
        "tableNumber": table_number,
        "sheet": ws.title,
        "periods": [period for _col, period in period_columns],
        "rows": rows,
    }


def get_total_row(table):
    for row in reversed(table["rows"]):
        if not row["produce"] and any(v is not None for v in row["values"]):
            return row

    return None


def get_group_row(table, group_name: str):
    target = group_name.upper()

    for row in table["rows"]:
        if row["produce"].upper() == target:
            return row

    raise RuntimeError(
        f"Could not find commodity group '{group_name}' "
        f"in Table {table['tableNumber']}."
    )


def latest_period_key(workbook_path: Path):
    workbook = load_workbook(
        workbook_path,
        data_only=True,
        read_only=True,
    )

    try:
        table4 = read_table(workbook, 4)

        if not table4["periods"]:
            return (0, 0)

        latest = table4["periods"][-1]

        return (
            latest["year"],
            latest["monthNumber"],
        )
    finally:
        workbook.close()


def select_latest_workbook(source_dir: Path):
    workbooks = [
        path
        for path in source_dir.glob("*.xlsx")
        if not path.name.startswith("~$")
    ]

    if not workbooks:
        raise FileNotFoundError(
            f"No Excel workbook found in {source_dir}"
        )

    ranked = []

    for path in workbooks:
        try:
            ranked.append((latest_period_key(path), path))
        except Exception as error:
            print(f"Skipping {path.name}: {error}")

    if not ranked:
        raise RuntimeError(
            "No valid Market Survey Excel workbook could be detected."
        )

    ranked.sort(
        key=lambda item: (
            item[0][0],
            item[0][1],
            item[1].stat().st_mtime,
        )
    )

    return ranked[-1][1]


def find_report(
    reports_dir: Path,
    latest_period,
):
    if not reports_dir.exists():
        return None

    code = latest_period["code"]
    year2 = str(latest_period["year"])[-2:]

    pdfs = list(reports_dir.glob("*.pdf"))

    matching = [
        pdf
        for pdf in pdfs
        if code in pdf.stem.upper()
        and year2 in pdf.stem
    ]

    if matching:
        matching.sort(key=lambda path: path.stat().st_mtime)
        return matching[-1]

    if pdfs:
        pdfs.sort(key=lambda path: path.stat().st_mtime)
        return pdfs[-1]

    return None


def extract_release_date(pdf_path: Path | None):
    if not pdf_path:
        return ""

    try:
        from pypdf import PdfReader
    except ImportError:
        return ""

    try:
        reader = PdfReader(str(pdf_path))

        text = ""

        for page in reader.pages[:2]:
            text += "\n" + (page.extract_text() or "")

        match = re.search(
            r"Release\s*Date\s*:\s*"
            r"(\d{1,2}(?:st|nd|rd|th)?\s+"
            r"[A-Za-z]+\s+\d{4})",
            text,
            re.IGNORECASE,
        )

        if not match:
            return ""

        result = match.group(1)

        # 02nd November 2026 -> 02 November 2026
        result = re.sub(
            r"(\d{1,2})(st|nd|rd|th)",
            r"\1",
            result,
            flags=re.IGNORECASE,
        )

        return result
    except Exception:
        return ""


def build_dashboard_data(
    workbook_path: Path,
    reports_dir: Path,
    downloads_dir: Path,
):
    workbook = load_workbook(
        workbook_path,
        data_only=True,
        read_only=True,
    )

    try:
        tables = {
            number: read_table(workbook, number)
            for number in range(1, 7)
        }

        periods = tables[4]["periods"]

        if not periods:
            raise RuntimeError("No quarterly periods detected.")

        latest = periods[-1]

        table3_total = get_total_row(tables[3])
        table4_total = get_total_row(tables[4])
        table5_total = get_total_row(tables[5])
        table6_total = get_total_row(tables[6])

        if not all(
            [
                table3_total,
                table4_total,
                table5_total,
                table6_total,
            ]
        ):
            raise RuntimeError(
                "Could not detect one or more overall total rows."
            )

        latest_index = len(periods) - 1

        commodity_groups = []

        for workbook_group, display_name in GROUP_NAMES.items():
            value_row = get_group_row(
                tables[3],
                workbook_group,
            )

            volume_row = get_group_row(
                tables[4],
                workbook_group,
            )

            price_row = get_group_row(
                tables[5],
                workbook_group,
            )

            sellers_row = get_group_row(
                tables[6],
                workbook_group,
            )

            commodity_groups.append(
                {
                    "name": display_name,
                    "value": value_row["values"][latest_index],
                    "volumeIndex": volume_row["values"][latest_index],
                    "volumeChange": volume_row["quarterChange"],
                    "priceIndex": price_row["values"][latest_index],
                    "priceChange": price_row["quarterChange"],
                    "sellers": sellers_row["values"][latest_index],
                }
            )

        trend = []

        for index, period in enumerate(periods):
            trend.append(
                {
                    "period": period["label"],
                    "volumeIndex": table4_total["values"][index],
                    "priceIndex": table5_total["values"][index],
                }
            )

        report_path = find_report(
            reports_dir,
            latest,
        )

        downloads_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        excel_name = (
            f"market-survey-"
            f"{latest['month'].lower()}-"
            f"{latest['year']}.xlsx"
        )

        excel_destination = downloads_dir / excel_name

        shutil.copy2(
            workbook_path,
            excel_destination,
        )

        quarter_name = QUARTER_NAMES.get(
            latest["monthNumber"],
            f"{latest['month']} Quarter",
        )

        dashboard = {
            "year": latest["year"],
            "quarter": quarter_name,
            "month": latest["month"],
            "releaseDate": extract_release_date(report_path),
            "periods": [
                {
                    "label": period["label"],
                    "key": period["key"],
                }
                for period in periods
            ],
            "summary": {
                "volumeIndex": table4_total["values"][latest_index],
                "volumeChange": table4_total["quarterChange"],
                "priceIndex": table5_total["values"][latest_index],
                "priceChange": table5_total["quarterChange"],
                "totalValue": table3_total["values"][latest_index],
                "totalValueChange": table3_total["quarterChange"],
                "sellers": table6_total["values"][latest_index],
                "sellersChange": table6_total["quarterChange"],
            },
            "trend": trend,
            "commodityGroups": commodity_groups,
            "reportUrl": (
                f"reports/{report_path.name}"
                if report_path
                else ""
            ),
            "excelUrl": f"downloads/{excel_name}",
            "sourceWorkbook": workbook_path.name,
        }

        return dashboard, tables

    finally:
        workbook.close()


def write_typescript(
    output_path: Path,
    dashboard,
    tables,
):
    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    exports = [
        (
            "marketSurveyData",
            dashboard,
        ),
        (
            "quantitySupplied",
            tables[1]["rows"],
        ),
        (
            "averagePrice",
            tables[2]["rows"],
        ),
        (
            "valueOfSupplies",
            tables[3]["rows"],
        ),
        (
            "volumeIndexData",
            tables[4]["rows"],
        ),
        (
            "priceIndexData",
            tables[5]["rows"],
        ),
        (
            "sellersData",
            tables[6]["rows"],
        ),
    ]

    lines = [
        "// AUTO-GENERATED FILE",
        "// Generated by scripts/update_market_survey.py",
        "// Do not manually edit released data below.",
        "",
    ]

    for name, value in exports:
        json_text = json.dumps(
            value,
            indent=2,
            ensure_ascii=False,
        )

        lines.append(
            f"export const {name} = {json_text}"
        )

        lines.append("")

    output_path.write_text(
        "\n".join(lines),
        encoding="utf-8",
    )


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Generate the Port Vila Central Market Survey "
            "dashboard data from the latest Excel release."
        )
    )

    parser.add_argument(
        "--source-dir",
        default="source-data/2026",
    )

    parser.add_argument(
        "--output",
        default="src/data.ts",
    )

    parser.add_argument(
        "--reports-dir",
        default="public/reports",
    )

    parser.add_argument(
        "--downloads-dir",
        default="public/downloads",
    )

    args = parser.parse_args()

    source_dir = Path(args.source_dir)
    output_path = Path(args.output)
    reports_dir = Path(args.reports_dir)
    downloads_dir = Path(args.downloads_dir)

    selected_workbook = select_latest_workbook(
        source_dir
    )

    dashboard, tables = build_dashboard_data(
        selected_workbook,
        reports_dir,
        downloads_dir,
    )

    write_typescript(
        output_path,
        dashboard,
        tables,
    )

    print()
    print("Market Survey dashboard update complete.")
    print("----------------------------------------")
    print(f"Selected workbook: {selected_workbook}")
    print(
        f"Latest period: "
        f"{dashboard['quarter']} {dashboard['year']}"
    )
    print(
        f"Volume Index: "
        f"{dashboard['summary']['volumeIndex']}"
    )
    print(
        f"Price Index: "
        f"{dashboard['summary']['priceIndex']}"
    )
    print(
        f"Total Value: VT"
        f"{dashboard['summary']['totalValue']} thousand"
    )
    print(
        f"Average Sellers: "
        f"{dashboard['summary']['sellers']}"
    )
    print(
        f"Report: "
        f"{dashboard['reportUrl'] or 'Not found'}"
    )
    print(
        f"Excel download: "
        f"{dashboard['excelUrl']}"
    )
    print(f"Wrote: {output_path}")
    print()


if __name__ == "__main__":
    main()