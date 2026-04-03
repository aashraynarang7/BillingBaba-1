'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchItems, fetchCompany } from '@/lib/api'
import { Trash2, Settings2, Info, ChevronDown, X, Smartphone, Copy, CheckCheck, Loader2 } from 'lucide-react'

// ─── Code128B barcode SVG ─────────────────────────────────────────────────────
const C128 = [
  '11011001100','11001101100','11001100110','10010011000','10010001100','10001001100',
  '10011001000','10011000100','10001100100','11001001000','11000100100','10110011100',
  '10011011100','10011001110','10111001100','10011101100','10011100110','11001110010',
  '11001011100','11001001110','11011100100','11001110100','11101101110','11101001100',
  '11100101100','11100100110','11101100100','11100110100','11100110010','11011011000',
  '11011000110','11000110110','10100011000','10001011000','10001000110','10110001000',
  '10001101000','10001100010','11010001000','11000101000','11000100010','10110111000',
  '10110001110','10001101110','10111011000','10111000110','10001110110','11101110110',
  '11010001110','11000101110','11011101000','11011100010','11011101110','11101011000',
  '11101000110','11100010110','11101101000','11101100010','11100011010','11101111010',
  '11001000010','11110001010','10100110000','10100001100','10010110000','10010000110',
  '10000101100','10000100110','10110010000','10110000100','10011010000','10011000010',
  '10000110100','10000110010','11000010010','11001010000','11110111010','11000010100',
  '10001111010','10100111100','10010111100','10010011110','10111100100','10011110100',
  '10011110010','11110100100','11110010100','11110010010','11011011110','11011110110',
  '11110110110','10101111000','10100011110','10001011110','10111101000','10111100010',
  '11110101000','11110100010','10111011110','10111101110','11101011110','11110101110',
  '11010000100','11010010000','11010011100',
]

function encodeCode128(text: string): string {
  const safe = text.replace(/[^\x20-\x7E]/g, '')
  let checksum = 104
  const codes: number[] = [104]
  for (let i = 0; i < safe.length; i++) {
    const v = safe.charCodeAt(i) - 32
    codes.push(v)
    checksum += (i + 1) * v
  }
  codes.push(checksum % 103)
  return codes.map(c => C128[c] || '').join('') + '1100011101011' + '11'
}

function BarcodeSVG({ code, barHeight = 40 }: { code: string; barHeight?: number }) {
  if (!code) {
    return (
      <svg width="140" height={barHeight} viewBox={`0 0 140 ${barHeight}`}>
        {[0,4,9,13,18,22,26,30,35,39,43,47,51,56,60,64,68,73,77,81,85,90,94,98,102,107,111,115,119,123,127,132,136].map((x, i) => (
          <rect key={i} x={x} y={0} width={i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1} height={barHeight} fill="#999" />
        ))}
      </svg>
    )
  }
  const bits = encodeCode128(code)
  const bw = 1.4
  const qz = 6
  const rects: React.ReactElement[] = []
  let x = qz
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') rects.push(<rect key={i} x={x} y={0} width={bw} height={barHeight} fill="black" />)
    x += bw
  }
  const totalW = x + qz
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={totalW} height={barHeight} viewBox={`0 0 ${totalW} ${barHeight}`} style={{ maxWidth: '100%' }}>
      {rects}
    </svg>
  )
}

// ─── Label sizes ──────────────────────────────────────────────────────────────
type SizeKey = '65x38x21' | '40x45x25'
const SIZES: Record<SizeKey, { label: string; cols: number; perPage: number }> = {
  '65x38x21': { label: '65 Labels (38×21mm)', cols: 3, perPage: 65 },
  '40x45x25': { label: '40 Labels (45×25mm)', cols: 4, perPage: 40 },
}

// ─── Line placeholder options ─────────────────────────────────────────────────
const LINE_OPTIONS = ['Company Name', 'Item Name', 'Sale Price', 'Discount']

// ─── Types ────────────────────────────────────────────────────────────────────
interface ItemRow {
  id: string
  itemName: string
  itemCode: string
  numLabels: number
  header: string
  line1: string
  line2: string
  line3: string
  // Resolved display values
  line1Display: string
  line2Display: string
  line3Display: string
  checked: boolean
}

interface ItemData {
  _id: string
  name: string
  itemCode?: string
  salePrice?: { amount?: number }
  discount?: number
}

// ─── Settings Modal ───────────────────────────────────────────────────────────
function SettingsModal({ printerType, setPrinterType, sizeKey, setSizeKey, onClose }: {
  printerType: string; setPrinterType: (v: string) => void
  sizeKey: SizeKey; setSizeKey: (v: SizeKey) => void; onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-80 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Barcode Settings</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Printer Type</p>
          {['Regular Printer', 'Label Printer'].map(pt => (
            <label key={pt} className="flex items-center gap-2 text-sm text-gray-700 mb-1.5 cursor-pointer">
              <input type="radio" name="pt" checked={printerType === pt} onChange={() => setPrinterType(pt)} className="accent-blue-600" />
              {pt}
            </label>
          ))}
        </div>
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">Label Size</p>
          {(Object.keys(SIZES) as SizeKey[]).map(k => (
            <label key={k} className="flex items-center gap-2 text-sm text-gray-700 mb-1.5 cursor-pointer">
              <input type="radio" name="sk" checked={sizeKey === k} onChange={() => setSizeKey(k)} className="accent-blue-600" />
              {SIZES[k].label}
            </label>
          ))}
        </div>
        <button onClick={onClose} className="w-full bg-blue-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-blue-700">Done</button>
      </div>
    </div>
  )
}

// ─── Inline label preview card ────────────────────────────────────────────────
function LabelPreview({ itemCode, header, line1D, line2D, line3D }: {
  itemCode: string; header: string; line1D: string; line2D: string; line3D: string
}) {
  return (
    <div className="border border-gray-300 rounded bg-white px-3 py-2 flex flex-col items-center gap-0.5 min-w-[160px]" style={{ fontFamily: 'serif' }}>
      {header && <div className="text-[9px] font-bold text-gray-700 italic">{header}</div>}
      <div className="w-full flex justify-center my-0.5">
        <BarcodeSVG code={itemCode || 'PREVIEW'} barHeight={30} />
      </div>
      <div className="text-[8px] font-mono text-gray-800">{itemCode || 'Item Code'}</div>
      {line1D && <div className="text-[8px] text-gray-600 italic">{line1D}</div>}
      {line2D && <div className="text-[8px] text-gray-600 font-semibold">{line2D}</div>}
      {line3D && <div className="text-[8px] text-gray-500 italic">{line3D}</div>}
    </div>
  )
}

// ─── Line dropdown input ──────────────────────────────────────────────────────
function LineInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className="relative">
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder || `Enter ${label}`}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-0"
        />
      </div>
      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-0.5 bg-white border border-gray-200 rounded-md shadow-lg">
          {LINE_OPTIONS.map(opt => (
            <button
              key={opt}
              onMouseDown={() => { onChange(opt); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BarcodeGeneratorPage() {
  const [printerType, setPrinterType] = useState('Regular Printer')
  const [sizeKey, setSizeKey] = useState<SizeKey>('65x38x21')
  const [showSettings, setShowSettings] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const [allItems, setAllItems] = useState<ItemData[]>([])
  const [companyName, setCompanyName] = useState('')
  const [itemSearch, setItemSearch] = useState('')
  const [showItemDd, setShowItemDd] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null)
  const itemRef = useRef<HTMLDivElement>(null)

  const [itemCode, setItemCode] = useState('')
  const [numLabels, setNumLabels] = useState('')
  const [header, setHeader] = useState('')
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [line3, setLine3] = useState('')

  const [rows, setRows] = useState<ItemRow[]>([])
  const [allChecked, setAllChecked] = useState(true)

  // ── Mobile scan session ──
  const [showMobileScan, setShowMobileScan] = useState(false)
  const [scanSessionId, setScanSessionId] = useState<string | null>(null)
  const [scanUrl, setScanUrl] = useState('')
  const [scanQrDataUrl, setScanQrDataUrl] = useState('')
  const [scanStarting, setScanStarting] = useState(false)
  const [copied, setCopied] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const seenBarcodesRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    fetchItems().then(setAllItems).catch(() => {})
    fetchCompany().then(c => setCompanyName(c?.name || c?.companyName || '')).catch(() => {})
  }, [])

  useEffect(() => {
    function h(e: MouseEvent) { if (itemRef.current && !itemRef.current.contains(e.target as Node)) setShowItemDd(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const filteredItems = allItems.filter(it =>
    it.name?.toLowerCase().includes(itemSearch.toLowerCase()) ||
    (it.itemCode || '').toLowerCase().includes(itemSearch.toLowerCase())
  )

  function resolveLineValue(opt: string, item: ItemData | null): string {
    if (!item) return opt
    if (opt === 'Company Name') return companyName
    if (opt === 'Item Name') return item.name
    if (opt === 'Sale Price') return item.salePrice?.amount != null ? `Sale Price: ${item.salePrice.amount}` : 'Sale Price'
    if (opt === 'Discount') return item.discount != null ? `Discount: ${item.discount}%` : 'Discount'
    return opt
  }

  function selectItem(item: ItemData) {
    setSelectedItem(item)
    setItemSearch(item.name)
    setItemCode(item.itemCode || '')
    setShowItemDd(false)
  }

  function assignCode() {
    const code = 'ITM-' + Math.random().toString(36).slice(2, 7).toUpperCase()
    setItemCode(code)
  }

  function handleAdd() {
    if (!itemSearch.trim() || !itemCode.trim() || !numLabels) return
    const n = parseInt(numLabels) || 1
    const row: ItemRow = {
      id: Date.now().toString(),
      itemName: itemSearch.trim(),
      itemCode: itemCode.trim(),
      numLabels: n,
      header,
      line1, line2, line3,
      line1Display: resolveLineValue(line1, selectedItem),
      line2Display: resolveLineValue(line2, selectedItem),
      line3Display: resolveLineValue(line3, selectedItem),
      checked: true,
    }
    setRows(prev => [...prev, row])
    // Reset
    setItemSearch(''); setSelectedItem(null); setItemCode('')
    setNumLabels(''); setHeader(''); setLine1(''); setLine2(''); setLine3('')
  }

  function deleteRow(id: string) { setRows(prev => prev.filter(r => r.id !== id)) }
  function toggleRow(id: string) { setRows(prev => prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r)) }
  function toggleAll() {
    const next = !allChecked
    setAllChecked(next)
    setRows(prev => prev.map(r => ({ ...r, checked: next })))
  }

  const selectedRows = rows.filter(r => r.checked)
  const totalLabels = selectedRows.reduce((s, r) => s + r.numLabels, 0)
  const pagesNeeded = Math.ceil(totalLabels / SIZES[sizeKey].perPage)

  // ── Live preview values ──
  const previewLine1D = resolveLineValue(line1, selectedItem)
  const previewLine2D = resolveLineValue(line2, selectedItem)
  const previewLine3D = resolveLineValue(line3, selectedItem)

  function buildPrintHtml() {
    const labelCells = selectedRows.flatMap(row =>
      Array.from({ length: row.numLabels }, (_, i) => {
        const bits = row.itemCode ? encodeCode128(row.itemCode) : ''
        let barcodeEl = ''
        if (bits) {
          const bw = 1.4, qz = 6, bh = 28
          let rects = ''; let x = qz
          for (const b of bits) { if (b === '1') rects += `<rect x="${x}" y="0" width="${bw}" height="${bh}" fill="black"/>`; x += bw }
          const sw = x + qz
          barcodeEl = `<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${bh}" viewBox="0 0 ${sw} ${bh}" style="max-width:100%">${rects}</svg>`
        }
        return `<div class="label">
          ${row.header ? `<div class="header">${row.header}</div>` : ''}
          <div class="barcode">${barcodeEl}</div>
          <div class="code">${row.itemCode}</div>
          ${row.line1Display ? `<div class="line">${row.line1Display}</div>` : ''}
          ${row.line2Display ? `<div class="line b">${row.line2Display}</div>` : ''}
          ${row.line3Display ? `<div class="line">${row.line3Display}</div>` : ''}
        </div>`
      })
    ).join('')

    return `<!DOCTYPE html><html><head><title>Barcode Labels</title><style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:serif;background:#fff}
      .grid{display:flex;flex-wrap:wrap;padding:4mm}
      .label{width:38mm;height:21mm;border:0.5px solid #ddd;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1mm;overflow:hidden;gap:0.5px}
      .header{font-size:6pt;font-weight:bold;font-style:italic;text-align:center}
      .barcode{display:flex;justify-content:center;width:100%}
      .code{font-size:5.5pt;font-family:monospace;text-align:center}
      .line{font-size:5.5pt;text-align:center;font-style:italic}
      .b{font-weight:bold;font-style:normal}
      @media print{.grid{padding:0}.label{border-color:transparent}}
    </style></head><body>
    <div class="grid">${labelCells}</div>
    <script>window.onload=()=>{window.print()}<\/script>
    </body></html>`
  }

  function handlePrint() {
    const w = window.open('', '_blank')
    if (w) { w.document.write(buildPrintHtml()); w.document.close() }
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-gray-900">Barcode Generator</h1>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Printer <span className="font-medium text-gray-900">{printerType}</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">
            Size <span className="font-medium text-gray-900">{SIZES[sizeKey].label}</span>
          </span>
          <button
            onClick={() => setShowSettings(true)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Form */}
          <div className="bg-white border-b border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-700 mb-4">Enter item details to add for barcode</p>
            <div className="grid grid-cols-3 gap-4">

              {/* Item Name */}
              <div ref={itemRef} className="relative">
                <label className="block text-xs text-gray-500 mb-1">Item Name <span className="text-red-500">*</span></label>
                <div
                  className="flex items-center border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer bg-white gap-2"
                  onClick={() => setShowItemDd(v => !v)}
                >
                  <input
                    value={itemSearch}
                    onChange={e => { setItemSearch(e.target.value); setShowItemDd(true) }}
                    placeholder="Enter Item Name"
                    className="flex-1 outline-none text-sm bg-transparent"
                    onClick={e => e.stopPropagation()}
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
                {showItemDd && (
                  <div className="absolute z-30 top-full left-0 right-0 mt-0.5 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
                    {filteredItems.length === 0
                      ? <div className="px-3 py-2 text-sm text-gray-400">No items found</div>
                      : filteredItems.slice(0, 25).map(it => (
                        <button key={it._id} onMouseDown={() => selectItem(it)} className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between">
                          <span>{it.name}</span>
                          {it.itemCode && <span className="text-xs text-gray-400">{it.itemCode}</span>}
                        </button>
                      ))
                    }
                  </div>
                )}
              </div>

              {/* Item Code */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Item Code <span className="text-red-500">*</span></label>
                <div className="flex gap-0">
                  <input
                    value={itemCode}
                    onChange={e => setItemCode(e.target.value)}
                    placeholder="Enter Item Code"
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono"
                  />
                  <button
                    onClick={assignCode}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-medium px-3 rounded-r-md border border-l-0 border-gray-300 whitespace-nowrap"
                  >
                    Assign Code
                  </button>
                </div>
              </div>

              {/* No of Labels */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">No of Labels <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={1}
                  value={numLabels}
                  onChange={e => setNumLabels(e.target.value)}
                  placeholder="Enter No of Labels"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              {/* Header */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Header</label>
                <input
                  value={header}
                  onChange={e => setHeader(e.target.value)}
                  placeholder="Enter Header"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <LineInput label="Line 1" value={line1} onChange={setLine1} />
              <LineInput label="Line 2" value={line2} onChange={setLine2} />
              <LineInput label="Line 3" value={line3} onChange={setLine3} />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="w-10 px-4 py-3 text-left">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-blue-600 w-4 h-4" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Item Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">No of Labels</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Header</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Line 1</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Line 2</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Line 3</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Line 4</th>
                  <th className="w-10 px-2 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-20 text-gray-400 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <svg width="60" height="36" viewBox="0 0 60 36" className="opacity-25">
                          {[0,4,8,13,17,22,26,30,35,39,44,48,52,57].map((x, i) => (
                            <rect key={i} x={x} y={0} width={i % 4 === 0 ? 3 : i % 4 === 1 ? 2 : 1} height={36} fill="#555" />
                          ))}
                        </svg>
                        Added items for Barcode generation will appear here.
                      </div>
                    </td>
                  </tr>
                ) : rows.map(row => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={row.checked} onChange={() => toggleRow(row.id)} className="accent-blue-600 w-4 h-4" />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{row.itemName}</td>
                    <td className="px-4 py-3 text-gray-700 text-center">{row.numLabels}</td>
                    <td className="px-4 py-3 text-gray-700">{row.header || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-gray-700">{row.line1Display || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-gray-700">{row.line2Display || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-gray-700">{row.line3Display || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-gray-400">—</td>
                    <td className="px-2 py-3">
                      <button onClick={() => deleteRow(row.id)} className="p-1 text-gray-400 hover:text-red-500 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom bar */}
          <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Info className="w-4 h-4" />
              {rows.length > 0
                ? `You will need ${pagesNeeded} page${pagesNeeded !== 1 ? 's' : ''} (A4 size) for printing.`
                : 'Add items to see page count.'}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(true)}
                disabled={selectedRows.length === 0}
                className="px-5 py-2 text-sm font-semibold border border-red-400 text-red-500 rounded-full hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Preview
              </button>
              <button
                onClick={handlePrint}
                disabled={selectedRows.length === 0}
                className="px-6 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* ── Right preview panel ── */}
        <div className="w-56 bg-white border-l border-gray-200 flex flex-col items-center p-4 gap-4">
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 self-start">
            Preview <Info className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <LabelPreview
            itemCode={itemCode}
            header={header}
            line1D={previewLine1D}
            line2D={previewLine2D}
            line3D={previewLine3D}
          />
          <button
            onClick={handleAdd}
            disabled={!itemSearch.trim() || !itemCode.trim() || !numLabels}
            className="w-full py-2 text-sm font-semibold rounded-full border-2 border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add for Barcode
          </button>
        </div>
      </div>

      {/* ── Settings modal ── */}
      {showSettings && (
        <SettingsModal
          printerType={printerType} setPrinterType={setPrinterType}
          sizeKey={sizeKey} setSizeKey={setSizeKey}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* ── Preview modal ── */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-base font-bold text-gray-800">Print Preview</h2>
                <p className="text-xs text-gray-500">{totalLabels} labels · {pagesNeeded} page(s) · {SIZES[sizeKey].label}</p>
              </div>
              <button onClick={() => setShowPreview(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-6">
              <div className="bg-white rounded shadow-sm p-3 flex flex-wrap gap-px">
                {selectedRows.flatMap(row =>
                  Array.from({ length: row.numLabels }, (_, i) => (
                    <div key={`${row.id}-${i}`} className="border border-gray-200 flex flex-col items-center justify-center p-1 gap-0.5" style={{ width: 108, height: 60 }}>
                      {row.header && <div className="text-[6px] font-bold italic text-gray-700">{row.header}</div>}
                      <div className="w-full flex justify-center">
                        <BarcodeSVG code={row.itemCode} barHeight={22} />
                      </div>
                      <div className="text-[5px] font-mono text-gray-700">{row.itemCode}</div>
                      {row.line1Display && <div className="text-[5px] text-gray-500 italic">{row.line1Display}</div>}
                      {row.line2Display && <div className="text-[5px] text-gray-600 font-semibold">{row.line2Display}</div>}
                      {row.line3Display && <div className="text-[5px] text-gray-500">{row.line3Display}</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50">Close</button>
              <button onClick={() => { setShowPreview(false); handlePrint() }} className="px-5 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold">
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
