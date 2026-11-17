import { Capacitor } from '@capacitor/core'
import vbosLogo from './assets/VBoS_logo.png'
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
  Menu,
X,
} from 'lucide-react'

function App() {

  const isAndroidApp = Capacitor.getPlatform() === 'android'

  const [selectedCommodity, setSelectedCommodity] =
  useState<'all' | 'staple' | 'fruits' | 'vegetables'>('all')

  const [activePage, setActivePage] =
  useState<
    | 'overview'
    | 'staple'
    | 'fruits'
    | 'vegetables'
    | 'value'
    | 'tables'
    | 'methodology'
  >('overview')
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
const [selectedQuarter, setSelectedQuarter] =
  useState<'mar2026' | 'jun2026'>('jun2026')
const quarterConfig = {
  mar2026: {
    label: 'March Quarter 2026',
    shortLabel: 'March Quarter',
    releaseDate: '15 June 2026',
    reportUrl: `${import.meta.env.BASE_URL}reports/MS_MAR_26.pdf`,
    excelUrl: `${import.meta.env.BASE_URL}downloads/market-survey-march-2026.xlsx`,
    summary: {
      volumeIndex: 74,
      volumeChange: -37,
      priceIndex: 188,
      priceChange: 27,
      totalValue: 897,
      totalValueChange: -37,
      sellers: 183,
      sellersChange: -32,
    },
  },

  jun2026: {
    label: 'June Quarter 2026',
    shortLabel: 'June Quarter',
    releaseDate: '02 November 2026',
    reportUrl: `${import.meta.env.BASE_URL}reports/MS_JUN_26.pdf`,
    excelUrl: `${import.meta.env.BASE_URL}downloads/market-survey-june-2026.xlsx`,
    summary: {
      volumeIndex: 86,
      volumeChange: 17,
      priceIndex: 174,
      priceChange: -7,
      totalValue: 1169,
      totalValueChange: 30,
      sellers: 154,
      sellersChange: -16,
    },
  },
} as const

const currentQuarter = quarterConfig[selectedQuarter]
const selectedGroupName =
  selectedCommodity === 'staple'
    ? 'STAPLE PRODUCE'
    : selectedCommodity === 'fruits'
      ? 'FRUITS'
      : selectedCommodity === 'vegetables'
        ? 'VEGETABLE PRODUCE'
        : null

const selectedCommodityLabel =
  selectedCommodity === 'all'
    ? null
    : selectedCommodity === 'staple'
      ? 'Staple Produce'
      : selectedCommodity === 'fruits'
        ? 'Fruits'
        : 'Vegetables'
  const overviewGroupData = [
  {
    name: 'Staple Produce',
    key: 'STAPLE PRODUCE',
  },
  {
    name: 'Fruits',
    key: 'FRUITS',
  },
  {
    name: 'Vegetables',
    key: 'VEGETABLE PRODUCE',
  },
].map((group) => ({
  name: group.name,

  volume:
    volumeIndexData.find((item) => item.produce === group.key)?.[
      selectedQuarter
    ] ?? 0,

  price:
    priceIndexData.find((item) => item.produce === group.key)?.[
      selectedQuarter
    ] ?? 0,

  value:
    valueOfSupplies.find((item) => item.produce === group.key)?.[
      selectedQuarter
    ] ?? 0,

  sellers:
    sellersData.find((item) => item.produce === group.key)?.[
      selectedQuarter
    ] ?? 0,
}))

const largestValueContributor = overviewGroupData.reduce(
  (largest, group) =>
    group.value > largest.value ? group : largest,
  overviewGroupData[0]
)
const selectedVolumeRow = selectedGroupName
  ? volumeIndexData.find((item) => item.produce === selectedGroupName)
  : null

const selectedPriceRow = selectedGroupName
  ? priceIndexData.find((item) => item.produce === selectedGroupName)
  : null

const selectedValueRow = selectedGroupName
  ? valueOfSupplies.find((item) => item.produce === selectedGroupName)
  : null

const selectedSellersRow = selectedGroupName
  ? sellersData.find((item) => item.produce === selectedGroupName)
  : null

const calculateQuarterChange = (
  row:
    | {
        dec2025: number
        mar2026: number
        quarterChange: number
      }
    | null
    | undefined
) => {
  if (!row) return 0

  if (selectedQuarter === 'jun2026') {
    return row.quarterChange
  }

  if (row.dec2025 === 0) {
    return row.mar2026 === 0 ? 0 : 100
  }

  return Math.round(
    ((row.mar2026 - row.dec2025) / row.dec2025) * 100
  )
}

const currentVolumeIndex = selectedVolumeRow
  ? selectedVolumeRow[selectedQuarter]
  : currentQuarter.summary.volumeIndex

const currentVolumeChange = selectedVolumeRow
  ? calculateQuarterChange(selectedVolumeRow)
  : currentQuarter.summary.volumeChange

const currentPriceIndex = selectedPriceRow
  ? selectedPriceRow[selectedQuarter]
  : currentQuarter.summary.priceIndex

const currentPriceChange = selectedPriceRow
  ? calculateQuarterChange(selectedPriceRow)
  : currentQuarter.summary.priceChange

const currentTotalValue = selectedValueRow
  ? selectedValueRow[selectedQuarter]
  : currentQuarter.summary.totalValue

const currentTotalValueChange = selectedValueRow
  ? calculateQuarterChange(selectedValueRow)
  : currentQuarter.summary.totalValueChange

const currentSellers = selectedSellersRow
  ? selectedSellersRow[selectedQuarter]
  : currentQuarter.summary.sellers

const currentSellersChange = selectedSellersRow
  ? calculateQuarterChange(selectedSellersRow)
  : currentQuarter.summary.sellersChange
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
    const filteredTableData = (() => {
  if (!selectedGroupName) {
    return activeTableData
  }

  const startIndex = activeTableData.findIndex(
    (item) => item.produce === selectedGroupName
  )

  if (startIndex === -1) {
    return activeTableData
  }

  const nextGroupIndex = activeTableData.findIndex(
    (item, index) => index > startIndex && item.group
  )

  return nextGroupIndex === -1
    ? activeTableData.slice(startIndex)
    : activeTableData.slice(startIndex, nextGroupIndex)
})()

const selectedValueRows = (() => {
  if (!selectedGroupName) {
    return valueOfSupplies
  }

  const startIndex = valueOfSupplies.findIndex(
    (item) => item.produce === selectedGroupName
  )

  if (startIndex === -1) {
    return valueOfSupplies
  }

  const nextGroupIndex = valueOfSupplies.findIndex(
    (item, index) => index > startIndex && item.group
  )

  return nextGroupIndex === -1
    ? valueOfSupplies.slice(startIndex)
    : valueOfSupplies.slice(startIndex, nextGroupIndex)
})()

const sellerProductColors: Record<string, string> = {
  'Staple Produce': '#176b78',
  'STAPLE PRODUCE': '#176b78',
  Fruits: '#9a7424',
  FRUITS: '#9a7424',
  Vegetables: '#287860',
  'VEGETABLE PRODUCE': '#287860',

  'Island Cabbage': '#087f78',
  'Chinese Cabbage': '#15937d',
  Cucumber: '#167d93',
  Tomato: '#b94a3f',
  Pumpkin: '#b77722',
  Lettuce: '#367a63',
  Carrot: '#c26828',
  'Bowl Cabbage (white)': '#466f89',
  'Bowl Cabbage (purple)': '#665486',

    // Fruits
  'Banana, Ripe': '#B68418',   // deep banana gold
  'Pawpaw': '#C15A2E',         // dark pawpaw orange
  'Water Melon': '#8E3B55',    // muted watermelon red
  'Green coconut': '#36765B',  // deep coconut green
    // Staple Produce
  'Fiji Taro': '#5B4A7A',             // deep taro purple
  'Island Taro': '#4A3F6B',           // darker taro violet
  'Manioc': '#8A6634',                // earthy cassava brown
  'Sweet Potato (Kumala)': '#9A4F3B', // deep reddish-orange
  'Yam': '#6C5635',                   // dark earthy brown
  'Banana - green': '#4E742F',        // deep banana green
  'Dried coconut': '#7B5B42',         // coconut brown
}

const valueChartData = !selectedGroupName
  ? valueOfSupplies
      .filter((item) => item.group && item.produce)
      .map((item) => ({
        name:
          item.produce === 'STAPLE PRODUCE'
            ? 'Staple Produce'
            : item.produce === 'FRUITS'
              ? 'Fruits'
              : 'Vegetables',
        y: item[selectedQuarter],
        color: sellerProductColors[item.produce] ?? '#27899a',
      }))
  : selectedValueRows
      .filter((item) => item.produce && !item.group)
      .map((item) => ({
        name: item.produce,
        y: item[selectedQuarter],
        color: sellerProductColors[item.produce] ?? '#27899a',
      }))

const filteredTrendData = selectedGroupName
  ? [
      {
        period: 'Jun 2025',
        volumeIndex: selectedVolumeRow?.jun2025 ?? 0,
        priceIndex: selectedPriceRow?.jun2025 ?? 0,
      },
      {
        period: 'Sep 2025',
        volumeIndex: selectedVolumeRow?.sep2025 ?? 0,
        priceIndex: selectedPriceRow?.sep2025 ?? 0,
      },
      {
        period: 'Dec 2025',
        volumeIndex: selectedVolumeRow?.dec2025 ?? 0,
        priceIndex: selectedPriceRow?.dec2025 ?? 0,
      },
      {
        period: 'Mar 2026',
        volumeIndex: selectedVolumeRow?.mar2026 ?? 0,
        priceIndex: selectedPriceRow?.mar2026 ?? 0,
      },

      ...(selectedQuarter === 'jun2026'
        ? [
            {
              period: 'Jun 2026',
              volumeIndex: selectedVolumeRow?.jun2026 ?? 0,
              priceIndex: selectedPriceRow?.jun2026 ?? 0,
            },
          ]
        : []),
    ]
  : marketSurveyData.trend

const selectedSellerRows = (() => {
  if (!selectedGroupName) {
    return sellersData
  }

  const startIndex = sellersData.findIndex(
    (item) => item.produce === selectedGroupName
  )

  if (startIndex === -1) {
    return sellersData
  }

  const nextGroupIndex = sellersData.findIndex(
    (item, index) => index > startIndex && item.group
  )

  return nextGroupIndex === -1
    ? sellersData.slice(startIndex)
    : sellersData.slice(startIndex, nextGroupIndex)
})()

const sellerChartData = !selectedGroupName
  ? sellersData
      .filter((item) => item.group && item.produce)
      .map((item) => ({
        name:
          item.produce === 'STAPLE PRODUCE'
            ? 'Staple Produce'
            : item.produce === 'FRUITS'
              ? 'Fruits'
              : 'Vegetables',
        y: item[selectedQuarter],
      }))
  : selectedSellerRows
      .filter((item) => item.produce && !item.group)
      .map((item) => ({
        name: item.produce,
        y: item[selectedQuarter],
      }))

const sortedSellerChartData = [...sellerChartData].sort(
  (a, b) => b.y - a.y
)
    const trendOptions: Highcharts.Options = {
    
    chart: {
  backgroundColor: 'transparent',
  height: 315,
  spacingTop: 20,
  inverted: false,
},

    title: {
      text: undefined,
    },

    credits: {
      enabled: false,
    },

    xAxis: {
      categories: filteredTrendData.map((item) => item.period),
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
        data: filteredTrendData.map((item) => item.volumeIndex),
      },
      {
        type: 'spline',
        name: 'Price Index',
        color: '#efa51f',
        yAxis: 1,
        data: filteredTrendData.map((item) => item.priceIndex),
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
        data: valueChartData,
      },
    ],
  }
  
  const sellerOptions: Highcharts.Options = {
  chart: {
    type: 'bar',
    backgroundColor: 'transparent',
    height: Math.max(260, sortedSellerChartData.length * 34 + 80),
  },

  title: {
    text: undefined,
  },

  credits: {
    enabled: false,
  },

  xAxis: {
    categories: sortedSellerChartData.map((item) => item.name),
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
      data: sortedSellerChartData.map((item) => ({
  y: item.y,
  color: sellerProductColors[item.name] ?? '#27899a',
})),
      
    },
  ],
}
const overviewValueOptions: Highcharts.Options = {
  chart: {
    type: 'bar',
    backgroundColor: 'transparent',
    height: 230,
  },

  title: {
    text: undefined,
  },

  credits: {
    enabled: false,
  },

  xAxis: {
    categories: overviewGroupData.map((group) => group.name),
    lineWidth: 0,
    tickWidth: 0,
  },

  yAxis: {
  min: 0,
  title: {
    text: 'Value of supplies (VT)',
  },
  gridLineColor: '#e4edf1',

  labels: {
    formatter: function () {
      return Number(this.value).toLocaleString()
    },
  },
},

  legend: {
    enabled: false,
  },

  tooltip: {
    pointFormat: '<b>VT {point.y:,.0f}</b>',
  },

  plotOptions: {
    bar: {
      borderRadius: 6,
      pointWidth: 32,
      dataLabels: {
        enabled: true,
        format: 'VT {point.y:,.0f}',
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
      name: 'Value of supplies',
      data: overviewGroupData.map((group) => ({
        y: group.value * 1000,
        color: sellerProductColors[group.name] ?? '#27899a',
      })),
    },
  ],
}
const produceValueChartData = (
  selectedGroupName
    ? selectedValueRows.filter((item) => item.produce && !item.group)
    : valueOfSupplies.filter((item) => item.produce && !item.group)
).sort(
  (a, b) =>
    (b[selectedQuarter] ?? 0) -
    (a[selectedQuarter] ?? 0)
)

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
    categories: produceValueChartData.map((item) => item.produce),

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

    data: produceValueChartData.map((item) => ({
  y: ((item[selectedQuarter] ?? 0) / currentTotalValue) * 100,
  color: sellerProductColors[item.produce] ?? '#27899a',
  custom: {
    value: item[selectedQuarter] ?? 0,
  },
})),

     
    },
  ],
}
  return (
    <div className="app-shell">
      {/* HEADER */}
      <header className="hero">
        <div className="hero-brand">
         <div className="brand-logo">
  <img src={vbosLogo} alt="Vanuatu Bureau of Statistics" />
</div>

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
  <strong>{currentQuarter.label}</strong>
  <small>Release Date: {currentQuarter.releaseDate}</small>
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
        <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-title">MARKET SURVEY</div>

          <nav onClick={() => setMobileMenuOpen(false)}>
            <a
  className={`nav-item ${activePage === 'overview' ? 'active' : ''}`}
  href="#overview"
  onClick={(e) => {
  e.preventDefault()
  setActivePage('overview')
  setSelectedCommodity('all')
}}
>
  <Home size={18} />
  Overview
</a>

            <div className="nav-group">
              <div className="nav-item">
                <Layers3 size={18} />
                Commodity Groups
                <ChevronDown size={15} className="nav-arrow" />
              </div>

              <a
  className={`nav-subitem ${activePage === 'staple' ? 'active' : ''}`}
  href="#staple"
  onClick={(e) => {
    e.preventDefault()
    setActivePage('staple')
    setSelectedCommodity('staple')
  }}
>
  <Wheat size={15} />
  Staple Produce
</a>

              <a
  className={`nav-subitem ${activePage === 'fruits' ? 'active' : ''}`}
  href="#fruits"
  onClick={(e) => {
    e.preventDefault()
    setActivePage('fruits')
    setSelectedCommodity('fruits')
  }}
>
  <ShoppingBasket size={15} />
  Fruits
</a>

              <a
  className={`nav-subitem ${activePage === 'vegetables' ? 'active' : ''}`}
  href="#vegetables"
  onClick={(e) => {
    e.preventDefault()
    setActivePage('vegetables')
    setSelectedCommodity('vegetables')
  }}
>
  <Store size={15} />
  Vegetables
  </a>
</div>

   <a
  className={`nav-item ${activePage === 'value' ? 'active' : ''}`}
  href="#value-of-supplies"
  onClick={(e) => {
    e.preventDefault()
    setActivePage('value')
  }}
>
  <Tags size={18} />
  Value of Supplies
</a>

            <a
  className={`nav-item ${activePage === 'tables' ? 'active' : ''}`}
  href="#detailed-tables"
  onClick={(e) => {
    e.preventDefault()
    setActivePage('tables')
  }}
>
  <Table2 size={18} />
  Detailed Tables
</a>

            
            <a
  className={`nav-item ${activePage === 'methodology' ? 'active' : ''}`}
  href="#methodology"
  onClick={(e) => {
    e.preventDefault()
    setActivePage('methodology')
  }}
>
  <Info size={18} />
  About & Methodology
</a>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dashboard-main">

 {/* TOOLBAR */}
          <section className="toolbar">
            <button
  type="button"
  className="mobile-menu-button"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  aria-label="Open navigation menu"
>
  {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
</button>
            <div className="filter-control">
  <label>Quarter</label>
  <select
    value={selectedQuarter}
    onChange={(e) =>
      setSelectedQuarter(
        e.target.value as 'mar2026' | 'jun2026'
      )
    }
  >
    <option value="mar2026">March Quarter</option>
    <option value="jun2026">June Quarter</option>
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
              <select
                  value={selectedCommodity}
                  onChange={(e) =>
                    setSelectedCommodity(
                    e.target.value as 'all' | 'staple' | 'fruits' | 'vegetables'
                  )
                } 
              >
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

      {!isAndroidApp && (
        <>
              <a
  className="action-button primary"
  href={currentQuarter.reportUrl}
  target="_blank"
  rel="noreferrer"
>
  <FileText size={17} />
  View Full Report
</a>

              <a
  className="action-button success"
  href={currentQuarter.excelUrl}
  download
>
  <Download size={17} />
  Download Excel
</a>
<a
  href={`${import.meta.env.BASE_URL}downloads/VBoS-Market-Survey.apk`}
  download
  className="action-button android-button"
>
  <Download size={17} />
  Download Android App
</a>

             <button
  type="button"
  className="action-button icon-button"
  onClick={() => window.print()}
  title="Print dashboard"
>
  <Printer size={18} />
</button>
  </>
)}
            </div>
          </section>
{activePage === 'overview' && (
  <>
{/* KPI CARDS */}
          <section className="kpi-grid">
            <article className="kpi-card volume">
              <div className="kpi-icon">
                <BarChart3 size={24} />
              </div>
              <div>
                <span>
  {selectedCommodityLabel
    ? `${selectedCommodityLabel} Volume Index`
    : 'Overall Volume Index'}
</span>
                <strong>{currentVolumeIndex}</strong>
                <small className={currentVolumeChange >= 0 ? 'positive' : 'negative'}>
                    {currentVolumeChange >= 0 ? '▲' : '▼'} {currentVolumeChange > 0 ? '+' : ''}
                    {currentVolumeChange}% vs previous quarter
                </small>
              </div>
            </article>

            <article className="kpi-card price">
              <div className="kpi-icon">
                <Tags size={24} />
              </div>
              <div>
                <span>
  {selectedCommodityLabel
    ? `${selectedCommodityLabel} Price Index`
    : 'Overall Price Index'}
</span>
                  <strong>{currentPriceIndex}</strong>

                  <small className={currentPriceChange >= 0 ? 'positive' : 'negative'}>
                       {currentPriceChange >= 0 ? '▲' : '▼'} {currentPriceChange > 0 ? '+' : ''}
                        {currentPriceChange}% vs previous quarter
                     </small>
              </div>
            </article>

            <article className="kpi-card value">
              <div className="kpi-icon">
                <Boxes size={24} />
              </div>
              <div>
                <span>
  {selectedCommodityLabel
    ? `${selectedCommodityLabel} Value of Supplies`
    : 'Total Value of Supplies'}
</span>

<strong>
  VT {Math.round(currentTotalValue * 1000).toLocaleString()}
</strong>

                       <small className={currentTotalValueChange >= 0 ? 'positive' : 'negative'}>
                       {currentTotalValueChange >= 0 ? '▲' : '▼'}{' '}
                       {currentTotalValueChange > 0 ? '+' : ''}
                       {currentTotalValueChange}% vs previous quarter
                     </small>
              </div>
            </article>

            <article className="kpi-card sellers">
              <div className="kpi-icon">
                <Users size={24} />
              </div>
              <div>
                <span>
  {selectedCommodityLabel
    ? `${selectedCommodityLabel} Sellers`
    : 'Average Number of Sellers'}
</span>

                  <strong>{currentSellers}</strong>

                    <small className={currentSellersChange >= 0 ? 'positive' : 'negative'}>
                    {currentSellersChange >= 0 ? '▲' : '▼'}{' '}
                    {currentSellersChange > 0 ? '+' : ''}
                    {currentSellersChange}% vs previous quarter
                   </small>
              </div>
            </article>
            </section>

 <section className="overview-summary-grid">
  <article className="panel overview-snapshot">
    <div className="panel-heading">
      <div>
        <h2>Commodity Group Snapshot</h2>
        <p>{currentQuarter.label}</p>
      </div>
      <Layers3 size={22} />
    </div>

    <div className="overview-group-cards">
      {overviewGroupData.map((group) => (
        <div className="overview-group-card" key={group.name}>
          <h3>{group.name}</h3>

          <div className="overview-metric">
            <span>Volume Index</span>
            <strong>{group.volume}</strong>
          </div>

          <div className="overview-metric">
            <span>Price Index</span>
            <strong>{group.price}</strong>
          </div>

          <div className="overview-metric">
            <span>Value</span>
            <strong>VT {Math.round(group.value * 1000).toLocaleString()}</strong>
          </div>

          <div className="overview-metric">
            <span>Sellers</span>
            <strong>{group.sellers}</strong>
          </div>
        </div>
      ))}
    </div>
  </article>
  <article className="panel overview-highlights">
  <div className="panel-heading">
    <div>
      <h2>{currentQuarter.shortLabel} Highlights</h2>
      <p>Key market movements</p>
    </div>
    <BarChart3 size={22} />
  </div>

  <div className="highlight-list">
    <div className="highlight-item">
      <span>Overall market volume</span>
      <strong
        className={
          currentQuarter.summary.volumeChange >= 0
            ? 'positive'
            : 'negative'
        }
      >
        {currentQuarter.summary.volumeChange >= 0 ? '▲' : '▼'}{' '}
        {currentQuarter.summary.volumeChange > 0 ? '+' : ''}
        {currentQuarter.summary.volumeChange}%
      </strong>
    </div>

    <div className="highlight-item">
      <span>Overall price index</span>
      <strong
        className={
          currentQuarter.summary.priceChange >= 0
            ? 'positive'
            : 'negative'
        }
      >
        {currentQuarter.summary.priceChange >= 0 ? '▲' : '▼'}{' '}
        {currentQuarter.summary.priceChange > 0 ? '+' : ''}
        {currentQuarter.summary.priceChange}%
      </strong>
    </div>

    <div className="highlight-item">
      <span>Total value of supplies</span>
      <strong
        className={
          currentQuarter.summary.totalValueChange >= 0
            ? 'positive'
            : 'negative'
        }
      >
        {currentQuarter.summary.totalValueChange >= 0 ? '▲' : '▼'}{' '}
        {currentQuarter.summary.totalValueChange > 0 ? '+' : ''}
        {currentQuarter.summary.totalValueChange}%
      </strong>
    </div>

    <div className="highlight-item">
      <span>Average number of sellers</span>
      <strong
        className={
          currentQuarter.summary.sellersChange >= 0
            ? 'positive'
            : 'negative'
        }
      >
        {currentQuarter.summary.sellersChange >= 0 ? '▲' : '▼'}{' '}
        {currentQuarter.summary.sellersChange > 0 ? '+' : ''}
        {currentQuarter.summary.sellersChange}%
      </strong>
    </div>

    <div className="highlight-feature">
      <span>Largest value contributor</span>
      <strong>{largestValueContributor.name}</strong>
      <small>
        VT {Math.round(largestValueContributor.value * 1000).toLocaleString()}
      </small>
    </div>
  </div>
</article>
</section>
<section className="panel overview-comparison">
  <div className="panel-heading">
    <div>
      <h2>Quick Market Comparison</h2>
      <p>
  Value of supplies by commodity group, {currentQuarter.label}
</p>
    </div>
    <BarChart3 size={22} />
  </div>

  <div className="chart-box">
    <HighchartsReact
      highcharts={Highcharts}
      options={overviewValueOptions}
    />
  </div>
</section>
</>
)}

{/* SECOND ROW */}
          <section className="panel-grid commodity-page-grid">
            <article
  className="panel"
  style={{
    display:
      activePage === 'staple' ||
      activePage === 'fruits' ||
      activePage === 'vegetables'
        ? undefined
        : 'none',
  }}
>
              <div className="panel-heading">
                <div>
                  <h2>
                  {selectedCommodityLabel ?? 'Commodity Group'}
                  </h2>

                  <p>
                  {currentQuarter.label} · Commodity Group Performance
                  </p>
                </div>
                <Layers3 size={22} />
              </div>

   <div className="kpi-grid commodity-detail-kpis">

  <div className="kpi-card volume">
    <div className="kpi-icon">
      <BarChart3 size={24} />
    </div>

    <div>
      <span>Volume Index</span>
      <strong>{currentVolumeIndex}</strong>

      <small className={currentVolumeChange >= 0 ? 'positive' : 'negative'}>
        {currentVolumeChange >= 0 ? '▲' : '▼'}{' '}
        {currentVolumeChange > 0 ? '+' : ''}
        {currentVolumeChange}% vs previous quarter
      </small>
    </div>
  </div>

  <div className="kpi-card price">
    <div className="kpi-icon">
      <Tags size={24} />
    </div>

    <div>
      <span>Price Index</span>
      <strong>{currentPriceIndex}</strong>

      <small className={currentPriceChange >= 0 ? 'positive' : 'negative'}>
        {currentPriceChange >= 0 ? '▲' : '▼'}{' '}
        {currentPriceChange > 0 ? '+' : ''}
        {currentPriceChange}% vs previous quarter
      </small>
    </div>
  </div>

  <div className="kpi-card value">
    <div className="kpi-icon">
      <Boxes size={24} />
    </div>

    <div>
      <span>Value of Supplies</span>
      <strong>
        VT {Math.round(currentTotalValue * 1000).toLocaleString()}
      </strong>

      <small className={currentTotalValueChange >= 0 ? 'positive' : 'negative'}>
        {currentTotalValueChange >= 0 ? '▲' : '▼'}{' '}
        {currentTotalValueChange > 0 ? '+' : ''}
        {currentTotalValueChange}% vs previous quarter
      </small>
    </div>
  </div>

  <div className="kpi-card sellers">
    <div className="kpi-icon">
      <Users size={24} />
    </div>

    <div>
      <span>Average Sellers</span>
      <strong>{currentSellers}</strong>

      <small className={currentSellersChange >= 0 ? 'positive' : 'negative'}>
        {currentSellersChange >= 0 ? '▲' : '▼'}{' '}
        {currentSellersChange > 0 ? '+' : ''}
        {currentSellersChange}% vs previous quarter
      </small>
    </div>
  </div>

</div>
            </article>

</section>
{(activePage === 'staple' ||
  activePage === 'fruits' ||
  activePage === 'vegetables') && (
  <section className="panel-grid commodity-detail-charts">
    <article className="panel">
      <div className="panel-heading">
        <div>
          <h2>Value by Individual Produce</h2>
          <p>{selectedCommodityLabel} · {currentQuarter.label}</p>
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

    <article className="panel">
      <div className="panel-heading">
        <div>
          <h2>Sellers by Individual Produce</h2>
          <p>{selectedCommodityLabel} · {currentQuarter.label}</p>
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
)}
{(activePage === 'staple' ||
  activePage === 'fruits' ||
  activePage === 'vegetables') && (
  <section className="panel commodity-trend-panel">
    <div className="panel-heading">
      <div>
        <h2>Quarterly Volume and Price Trend</h2>
        <p>
  {selectedCommodityLabel} · June 2025 –{' '}
  {selectedQuarter === 'mar2026' ? 'March 2026' : 'June 2026'}
</p>
      </div>

      <BarChart3 size={22} />
    </div>

    <div className="chart-box">
      <HighchartsReact
        highcharts={Highcharts}
        options={trendOptions}
      />
    </div>
  </section>
)}
          {/* TABLE AREA */}
          <section
  className="panel"
  id="value"
  style={{
    display: activePage === 'value' ? undefined : 'none',
  }}
>
  <div className="panel-heading">
    <div>
      <span className="section-kicker">VALUE OF SUPPLIES</span>
      <h2>
  {selectedCommodity === 'all'
    ? 'Share of Value by Produce'
    : `Share of Value – ${selectedCommodityLabel}`}
</h2>

<p>
  {selectedCommodity === 'all'
    ? `${currentQuarter.label} — percentage of total market value`
    : `${currentQuarter.label} — percentage of ${selectedCommodityLabel} value`}
</p>
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
          <section
  className="panel"
  id="tables"
  style={{
    display: activePage === 'tables' ? undefined : 'none',
  }}
>
            <div className="panel-heading">
              <div>
                <h2>
  {selectedCommodity === 'all'
    ? 'Detailed Market Survey Tables'
    : `Detailed Tables – ${selectedCommodityLabel}`}
</h2>

<p>
  {selectedQuarter === 'mar2026'
    ? 'March 2025 – March 2026'
    : 'June 2025 – June 2026'}
  {' '}· Quarterly data by produce and commodity group
</p>
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

    {selectedQuarter === 'mar2026' && (
      <th>Mar 2025</th>
    )}

    <th>Jun 2025</th>
    <th>Sep 2025</th>
    <th>Dec 2025</th>
    <th>Mar 2026</th>

    {selectedQuarter === 'jun2026' && (
      <th>Jun 2026</th>
    )}

    <th>% Change Prev. Qtr</th>
    <th>% Change Same Qtr LY</th>
  </tr>
</thead>

    <tbody>
  {filteredTableData.map((item) => {
    const quarterChange =
      item.quarterChangeByPeriod?.[selectedQuarter] ??
      item.quarterChange

    const annualChange =
      item.annualChangeByPeriod?.[selectedQuarter] ??
      item.annualChange

    return (
      <tr
        key={item.produce}
        className={item.group ? 'group-row' : ''}
      >
        <td>
  {item.produce || (
    activeTable === 'value'
      ? 'Overall Value of Supplies'
      : activeTable === 'volume'
        ? 'Overall Volume Index'
        : activeTable === 'priceIndex'
          ? 'Overall Price Index'
          : activeTable === 'sellers'
            ? 'Overall Number of Sellers'
            : 'Overall Total'
  )}
</td>

        {selectedQuarter === 'mar2026' && (
          <td>{item.mar2025?.toLocaleString() ?? '-'}</td>
        )}

        <td>{item.jun2025?.toLocaleString() ?? '-'}</td>
        <td>{item.sep2025?.toLocaleString() ?? '-'}</td>
        <td>{item.dec2025?.toLocaleString() ?? '-'}</td>
        <td>{item.mar2026?.toLocaleString() ?? '-'}</td>

        {selectedQuarter === 'jun2026' && (
          <td>{item.jun2026?.toLocaleString() ?? '-'}</td>
        )}

        <td
          className={
            quarterChange > 0
              ? 'table-positive'
              : quarterChange < 0
                ? 'table-negative'
                : ''
          }
        >
          {quarterChange > 0 ? '+' : ''}
          {quarterChange ?? 0}%
        </td>

        <td
          className={
            annualChange > 0
              ? 'table-positive'
              : annualChange < 0
                ? 'table-negative'
                : ''
          }
        >
          {annualChange > 0 ? '+' : ''}
          {annualChange ?? 0}%
        </td>
      </tr>
    )
  })}
</tbody>
  </table>
</div>
          </section>
          <section
  className="methodology-panel"
  id="methodology"
  style={{
    display: activePage === 'methodology' ? undefined : 'none',
  }}
>
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
<div className="methodology-glance">
  <div className="glance-item">
    <span>Collection</span>
    <strong>Fortnightly</strong>
  </div>

  <div className="glance-item">
    <span>Reporting</span>
    <strong>Quarterly</strong>
  </div>

  <div className="glance-item">
    <span>Index Weights</span>
    <strong>2016</strong>
  </div>

  <div className="glance-item">
    <span>Market Coverage</span>
    <strong>Port Vila Central Market</strong>
  </div>
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
</section>

<div className="methodology-note">
    <strong>Vanuatu Bureau of Statistics</strong>
    <span>
      Official Statistics · Port Vila Central Market Survey
    </span>
  </div>

        </main>
      </div>
    </div>
  )
}

export default App