import { useEffect, useState } from 'react'
import Highcharts from 'highcharts'
import { HighchartsReact } from 'highcharts-react-official'
import {
  marketSurveyData,
  quantitySupplied,
  averagePrice,
  valueOfSupplies,
  volumeIndexData,
  priceIndexData,
  sellersData,
} from './data'
import {
  BarChart3,
  Boxes,
  ChevronDown,
  Download,
  FileText,
  Home,
  Info,
  Layers3,
  Moon,
  PackageSearch,
  Printer,
  ShoppingBasket,
  Store,
  Sun,
  Table2,
  Tags,
  Users,
  Wheat,
} from 'lucide-react'

function App() {
    const [activeTable, setActiveTable] =
  useState<
    'quantity' | 'price' | 'value' | 'volume' | 'priceIndex' | 'sellers'
  >('quantity')
  useEffect(() => {
  const savedTheme = localStorage.getItem('market-survey-theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
}, [])
    const activeTableData =
  activeTable === 'price'
    ? averagePrice
    : activeTable === 'value'
      ? valueOfSupplies
      : activeTable === 'volume'
        ? volumeIndexData
        : activeTable === 'priceIndex'
          ? priceIndexData
          : activeTable === 'sellers'
            ? sellersData
            : quantitySupplied
    const trendOptions: Highcharts.Options = {
    
    chart: {
      backgroundColor: 'transparent',
      height: 315,
      spacingTop: 20,
    },

    title: {
      text: undefined,
    },

    credits: {
      enabled: false,
    },

    xAxis: {
      categories: marketSurveyData.trend.map((item) => item.period),
      lineColor: '#b9cbd4',
      tickColor: '#b9cbd4',
      labels: {
        style: {
          color: '#607989',
        },
      },
    },

    yAxis: [
      {
        title: {
          text: 'Volume Index',
          style: {
            color: '#607989',
          },
        },
        min: 0,
        gridLineColor: '#e4edf1',
        labels: {
          style: {
            color: '#607989',
          },
        },
      },
      {
        title: {
          text: 'Price Index',
          style: {
            color: '#607989',
          },
        },
        min: 0,
        opposite: true,
        gridLineWidth: 0,
        labels: {
          style: {
            color: '#607989',
          },
        },
      },
    ],

    tooltip: {
      shared: true,
    },

    legend: {
      align: 'center',
      verticalAlign: 'bottom',
    },

    plotOptions: {
      column: {
        borderRadius: 5,
        pointPadding: 0.12,
        groupPadding: 0.15,
      },
      spline: {
        lineWidth: 3,
        marker: {
          enabled: true,
          radius: 5,
        },
      },
    },

    series: [
      {
        type: 'column',
        name: 'Volume Index',
        color: '#2f8ed6',
        data: marketSurveyData.trend.map((item) => item.volumeIndex),
      },
      {
        type: 'spline',
        name: 'Price Index',
        color: '#efa51f',
        yAxis: 1,
        data: marketSurveyData.trend.map((item) => item.priceIndex),
      },
    ],
  }
    const valueShareOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 315,
    },

    title: {
      text: undefined,
    },

    credits: {
      enabled: false,
    },

    tooltip: {
      pointFormat: '<b>VT{point.y:,.0f} thousand</b><br>{point.percentage:.1f}%',
    },

    legend: {
      enabled: true,
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
    },

    plotOptions: {
      pie: {
        innerSize: '62%',
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.0f}%',
          style: {
            fontWeight: '700',
            textOutline: 'none',
          },
        },
        showInLegend: true,
      },
    },

    series: [
      {
        type: 'pie',
        name: 'Value of supplies',
        data: marketSurveyData.commodityGroups.map((item) => ({
          name: item.name,
          y: item.value,
        })),
      },
    ],
  }
  const sellerOptions: Highcharts.Options = {
  chart: {
    type: 'bar',
    backgroundColor: 'transparent',
    height: 260,
  },

  title: {
    text: undefined,
  },

  credits: {
    enabled: false,
  },

  xAxis: {
    categories: marketSurveyData.commodityGroups.map((item) => item.name),
    lineWidth: 0,
    tickWidth: 0,
    labels: {
      style: {
        color: '#536f7e',
        fontSize: '12px',
      },
    },
  },

  yAxis: {
    min: 0,
    title: {
      text: 'Number of sellers',
    },
    gridLineColor: '#e4edf1',
  },

  legend: {
    enabled: false,
  },

  tooltip: {
    pointFormat: '<b>{point.y} sellers</b>',
  },

  plotOptions: {
    bar: {
      borderRadius: 5,
      pointWidth: 28,
      dataLabels: {
        enabled: true,
        format: '{point.y}',
        style: {
          fontWeight: '700',
          textOutline: 'none',
        },
      },
    },
  },

  series: [
    {
      type: 'bar',
      name: 'Sellers',
      data: marketSurveyData.commodityGroups.map((item) => item.sellers),
      color: '#27899a',
    },
  ],
}
const produceValueOptions: Highcharts.Options = {
  chart: {
    type: 'bar',
    backgroundColor: 'transparent',
    height: 520,
  },

  title: {
    text: undefined,
  },

  credits: {
    enabled: false,
  },

  xAxis: {
    categories: valueOfSupplies
      .filter((item) => item.produce && !item.group)
      .sort((a, b) => b.jun2026 - a.jun2026)
      .map((item) => item.produce),

    lineWidth: 0,
    tickWidth: 0,

    labels: {
      style: {
        color: '#536f7e',
        fontSize: '11px',
      },
    },
  },

  yAxis: {
    min: 0,
    title: {
      text: 'Share of total value (%)',
    },
    gridLineColor: '#e4edf1',
  },

  legend: {
    enabled: false,
  },

  tooltip: {
    pointFormat:
      '<b>{point.y:.1f}%</b><br>VT{point.custom.value:,.0f} thousand',
  },

  plotOptions: {
    bar: {
      borderRadius: 4,
      pointPadding: 0.08,
      groupPadding: 0.08,

      dataLabels: {
        enabled: true,
        format: '{point.y:.1f}%',
        style: {
          fontWeight: '700',
          textOutline: 'none',
        },
      },
    },
  },

  series: [
    {
      type: 'bar',
      name: 'Share of value',

      data: valueOfSupplies
        .filter((item) => item.produce && !item.group)
        .sort((a, b) => b.jun2026 - a.jun2026)
        .map((item) => ({
          y: (item.jun2026 / 1169) * 100,
          custom: {
            value: item.jun2026,
          },
        })),

      color: '#27899a',
    },
  ],
}
  return (
    <div className="app-shell">
      {/* HEADER */}
      <header className="hero">
        <div className="hero-brand">
          <div className="brand-logo">VBoS</div>

          <div>
            <span className="eyebrow">VANUATU BUREAU OF STATISTICS</span>
            <h1>
              Port Vila Central Market Survey <span>Dashboard</span>
            </h1>
            <p>
              Supply, prices and value of selected agricultural produce at the
              Port Vila Central Market
            </p>
          </div>
        </div>

        <div className="period-card">
          <span>Reporting period</span>
          <strong>June Quarter 2026</strong>
          <small>Release Date: 02 November 2026</small>
        </div>
      </header>

      <div className="vbos-strip">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-title">MARKET SURVEY</div>

          <nav>
            <a className="nav-item active" href="#overview">
              <Home size={18} />
              Overview
            </a>

            <a className="nav-item" href="#market-movement">
              <BarChart3 size={18} />
              Market Movement
            </a>

            <div className="nav-group">
              <div className="nav-item">
                <Layers3 size={18} />
                Commodity Groups
                <ChevronDown size={15} className="nav-arrow" />
              </div>

              <a className="nav-subitem" href="#staple">
                <Wheat size={15} />
                Staple Produce
              </a>

              <a className="nav-subitem" href="#fruits">
                <ShoppingBasket size={15} />
                Fruits
              </a>

              <a className="nav-subitem" href="#vegetables">
                <Store size={15} />
                Vegetables
              </a>
            </div>

            <a className="nav-item" href="#sellers">
              <Users size={18} />
              Sellers
            </a>

            <a className="nav-item" href="#value">
              <Tags size={18} />
              Value of Supplies
            </a>

            <a className="nav-item" href="#tables">
              <Table2 size={18} />
              Detailed Tables
            </a>

            <a className="nav-item" href="#downloads">
              <Download size={18} />
              Downloads
            </a>

            <a className="nav-item" href="#methodology">
              <Info size={18} />
              About & Methodology
            </a>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dashboard-main" id="overview">
          {/* TOOLBAR */}
          <section className="toolbar">
            <div className="filter-control">
              <label>Quarter</label>
              <select defaultValue="June">
                <option value="June">June Quarter</option>
              </select>
            </div>

            <div className="filter-control">
              <label>Year</label>
              <select defaultValue="2026">
                <option value="2026">2026</option>
              </select>
            </div>

            <div className="filter-control commodity-filter">
              <label>Commodity Group</label>
              <select defaultValue="all">
                <option value="all">All Commodities</option>
                <option value="staple">Staple Produce</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
              </select>
            </div>
  <div className="toolbar-actions">
  <button
            
  type="button"
  className="action-button secondary"
  onClick={() => {
  document.documentElement.setAttribute('data-theme', 'light')
  localStorage.setItem('market-survey-theme', 'light')
}}
>
  <Sun size={17} />
  Light
</button>

<button
  type="button"
  className="action-button secondary"
  onClick={() => {
  document.documentElement.setAttribute('data-theme', 'dark')
  localStorage.setItem('market-survey-theme', 'dark')
}}
>
  <Moon size={17} />
  Dark
</button>

              <a
  className="action-button primary"
  href={marketSurveyData.reportUrl}
  target="_blank"
  rel="noreferrer"
>
  <FileText size={17} />
  View Full Report
</a>

              <a
  className="action-button success"
  href={marketSurveyData.excelUrl}
  download
>
  <Download size={17} />
  Download Excel
</a>

             <button
  type="button"
  className="action-button icon-button"
  onClick={() => window.print()}
  title="Print dashboard"
>
  <Printer size={18} />
</button>
            </div>
          </section>

          {/* KPI CARDS */}
          <section className="kpi-grid">
            <article className="kpi-card volume">
              <div className="kpi-icon">
                <BarChart3 size={24} />
              </div>
              <div>
                <span>Overall Volume Index</span>
                <strong>86</strong>
                <small className="positive">▲ +17% vs previous quarter</small>
              </div>
            </article>

            <article className="kpi-card price">
              <div className="kpi-icon">
                <Tags size={24} />
              </div>
              <div>
                <span>Overall Price Index</span>
                <strong>174</strong>
                <small className="negative">▼ -7% vs previous quarter</small>
              </div>
            </article>

            <article className="kpi-card value">
              <div className="kpi-icon">
                <Boxes size={24} />
              </div>
              <div>
                <span>Total Value of Supplies</span>
                <strong>VT1.169 million</strong>
                <small className="positive">▲ +30% vs previous quarter</small>
              </div>
            </article>

            <article className="kpi-card sellers">
              <div className="kpi-icon">
                <Users size={24} />
              </div>
              <div>
                <span>Average Number of Sellers</span>
                <strong>154</strong>
                <small className="negative">▼ -16% vs previous quarter</small>
              </div>
            </article>
          </section>

          {/* FIRST CHART ROW */}
          <section className="panel-grid">
            <article className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Value of Supplies by Commodity Group</h2>
                  <p>Share of total value, June Quarter 2026</p>
                </div>
                <PackageSearch size={22} />
              </div>

              <div className="chart-box">
  <HighchartsReact
    highcharts={Highcharts}
    options={valueShareOptions}
  />
</div>
            </article>

            <article className="panel wide-panel" id="market-movement">
              <div className="panel-heading">
                <div>
                  <h2>Quarterly Volume and Price Indices</h2>
                  <p>All commodities, June 2025 – June 2026</p>
                </div>
                <BarChart3 size={22} />
              </div>

              <div className="chart-box">
  <HighchartsReact
    highcharts={Highcharts}
    options={trendOptions}
  />
</div>
            </article>
          </section>

          {/* SECOND ROW */}
          <section className="panel-grid">
            <article className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Commodity Group Performance</h2>
                  <p>Change from previous quarter</p>
                </div>
                <Layers3 size={22} />
              </div>

              <div className="commodity-cards">
  {marketSurveyData.commodityGroups.map((item) => {
    const sectionId =
      item.name === 'Staple Produce'
        ? 'staple'
        : item.name === 'Fruits'
          ? 'fruits'
          : 'vegetables'

    const Icon =
      item.name === 'Staple Produce'
        ? Wheat
        : item.name === 'Fruits'
          ? ShoppingBasket
          : Store

    return (
      <div
        key={item.name}
        id={sectionId}
        className={`commodity-card ${sectionId}`}
      >
        <div className="commodity-card-header">
          <div className="commodity-icon">
            <Icon size={25} />
          </div>

          <strong>{item.name}</strong>
        </div>

        <div className="commodity-stat">
          <span>Volume Index</span>

          <strong>{item.volumeIndex}</strong>

          <small
            className={
              item.volumeChange >= 0
                ? 'change-badge positive'
                : 'change-badge negative'
            }
          >
            {item.volumeChange >= 0 ? '▲' : '▼'}{' '}
            {item.volumeChange >= 0 ? '+' : ''}
            {item.volumeChange}%
          </small>
        </div>

        <div className="commodity-stat">
          <span>Price Index</span>

          <strong>{item.priceIndex}</strong>

          <small
            className={
              item.priceChange >= 0
                ? 'change-badge positive'
                : 'change-badge negative'
            }
          >
            {item.priceChange >= 0 ? '▲' : '▼'}{' '}
            {item.priceChange >= 0 ? '+' : ''}
            {item.priceChange}%
          </small>
        </div>
      </div>
    )
  })}
</div>
            </article>

            <article className="panel" id="sellers">
              <div className="panel-heading">
                <div>
                  <h2>Sellers by Commodity Group</h2>
                  <p>June Quarter 2026</p>
                </div>
                <Users size={22} />
              </div>

              <div className="chart-box">
  <HighchartsReact
    highcharts={Highcharts}
    options={sellerOptions}
  />
</div>
            </article>
          </section>

          {/* TABLE AREA */}
          <section className="panel" id="value">
  <div className="panel-heading">
    <div>
      <span className="section-kicker">VALUE OF SUPPLIES</span>
      <h2>Share of Value by Produce</h2>
      <p>June Quarter 2026 — percentage of total market value</p>
    </div>

    <Tags size={22} />
  </div>

  <div className="chart-box">
    <HighchartsReact
      highcharts={Highcharts}
      options={produceValueOptions}
    />
  </div>
</section>
          <section className="panel data-panel" id="tables">
            <div className="panel-heading">
              <div>
                <h2>Detailed Data Tables</h2>
                <p>Quarterly data by commodity and commodity group</p>
              </div>
              <Table2 size={22} />
            </div>

            <div className="table-tabs">
              <button
  className={activeTable === 'quantity' ? 'active' : ''}
  onClick={() => setActiveTable('quantity')}
>
  Table 1: Quantity Supplied
</button>

<button
  className={activeTable === 'price' ? 'active' : ''}
  onClick={() => setActiveTable('price')}
>
  Table 2: Average Price
</button>
              <button
               className={activeTable === 'value' ? 'active' : ''}
               onClick={() => setActiveTable('value')}
>
  Table 3: Value of Supplies
</button>
              <button
              className={activeTable === 'volume' ? 'active' : ''}
              onClick={() => setActiveTable('volume')}
>
  Table 4: Volume Index
</button>
             <button
               className={activeTable === 'priceIndex' ? 'active' : ''}
               onClick={() => setActiveTable('priceIndex')}
>
  Table 5: Price Index
</button>
              <button
                className={activeTable === 'sellers' ? 'active' : ''}
                onClick={() => setActiveTable('sellers')}
>
  Table 6: Number of Sellers
</button>
            </div>

            <div className="data-table-wrap">
  <table className="market-table">
    <thead>
      <tr>
        <th>Produce</th>
        <th>Jun 2025</th>
        <th>Sep 2025</th>
        <th>Dec 2025</th>
        <th>Mar 2026</th>
        <th>Jun 2026</th>
        <th>% Change Prev. Qtr</th>
        <th>% Change Same Qtr LY</th>
      </tr>
    </thead>

    <tbody>
      {activeTableData.map((item) => (
        <tr
          key={item.produce}
          className={item.group ? 'group-row' : ''}
        >
          <td>{item.produce}</td>
          <td>{item.jun2025.toLocaleString()}</td>
          <td>{item.sep2025.toLocaleString()}</td>
          <td>{item.dec2025.toLocaleString()}</td>
          <td>{item.mar2026.toLocaleString()}</td>
          <td>{item.jun2026.toLocaleString()}</td>

          <td
            className={
              item.quarterChange > 0
                ? 'table-positive'
                : item.quarterChange < 0
                  ? 'table-negative'
                  : ''
            }
          >
            {item.quarterChange > 0 ? '+' : ''}
            {item.quarterChange}%
          </td>

          <td
            className={
              item.annualChange > 0
                ? 'table-positive'
                : item.annualChange < 0
                  ? 'table-negative'
                  : ''
            }
          >
            {item.annualChange > 0 ? '+' : ''}
            {item.annualChange}%
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          </section>
          <section className="methodology-panel" id="methodology">
  <div className="panel-heading">
    <div>
      <span className="section-kicker">ABOUT THE SURVEY</span>
      <h2>About & Methodology</h2>
      <p>
        Port Vila Central Market Survey — June Quarter 2026
      </p>
    </div>

    <Info size={22} />
  </div>

  <div className="methodology-grid">
    <div className="methodology-card">
      <strong>Survey Purpose</strong>
      <p>
        The Port Vila Market Survey measures the price and volume of
        selected agricultural produce sold at the main market.
      </p>
    </div>

    <div className="methodology-card">
      <strong>Collection Frequency</strong>
      <p>
        Market information is collected on a fortnightly basis.
      </p>
    </div>

    <div className="methodology-card">
      <strong>Reporting</strong>
      <p>
        The data presented in the survey shows quarterly average
        supply and prices for the commodities under study.
      </p>
    </div>

    <div className="methodology-card">
      <strong>Index Weights</strong>
      <p>
        Weights are based on 2016 using the Household Income and
        Expenditure Survey 2010 and Agriculture Census 2007.
      </p>
    </div>
  </div>

  <div className="methodology-note">
    <strong>Vanuatu Bureau of Statistics</strong>
    <span>
      Official Statistics · Port Vila Central Market Survey
    </span>
  </div>
</section>
        </main>
      </div>
    </div>
  )
}

export default App