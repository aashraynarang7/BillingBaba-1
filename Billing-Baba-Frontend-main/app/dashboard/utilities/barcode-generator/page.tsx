import type { NextPage } from 'next';
import React from 'react';

// --- Iconos en formato de componentes de React para facilitar su uso ---

// Icono de información (círculo con 'i')
const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.055.396.118.45.283.05.15.015.305-.12.433-.134.137-.328.216-.534.216-.236 0-.447-.099-.614-.234-.16-.134-.248-.315-.248-.515 0-.223.102-.416.314-.543.22-.135.536-.25.876-.346l.205-.056c.326-.088.593-.18.785-.293.21-.12.375-.278.488-.477.112-.198.168-.43.168-.691 0-.335-.12-.614-.359-.843-.24-.23-.545-.345-.905-.345-.36 0-.67.115-.92.345-.25.225-.375.5-.375.825v.076c0 .224.04.416.12.588.08.173.21.305.39.395.18.09.39.135.63.135.235 0 .43-.05.59-.15.16-.1.28-.24.36-.42.08-.17.12-.354.12-.55 0-.21-.06-.39-.18-.54-.12-.15-.28-.225-.48-.225-.19 0-.34.05-.46.15-.12.1-.21.23-.27.39l-.07.22h-2.02c.03-.6.24-1.11.63-1.52.39-.41.89-.62 1.5-.62.61 0 1.11.2 1.51.6.4.4.6.89.6 1.48 0 .46-.12.86-.35 1.2-.24.34-.58.6-1.02.78zM8 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
  </svg>
);

// Icono de ojo para 'Preview'
const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.817 1.192-2.11 2.315-3.64 3.018C9.879 11.832 8.12 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
  </svg>
);

// Icono de código de barras
const BarcodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 100 50">
      <path fill="#A0AEC0" d="M0 5 H2 V45 H0 z M4 5 H6 V45 H4 z M8 5 H10 V45 H8 z M12 5 H14 V45 H12 z M18 5 H20 V45 H18 z M22 5 H24 V45 H22 z M26 5 H28 V45 H26 z M30 5 H34 V45 H30 z M36 5 H38 V45 H36 z M40 5 H42 V45 H40 z M46 5 H48 V45 H46 z M50 5 H52 V45 H50 z M54 5 H56 V45 H54 z M60 5 H62 V45 H60 z M64 5 H66 V45 H64 z M70 5 H72 V45 H70 z M74 5 H78 V45 H74 z M80 5 H82 V45 H80 z M86 5 H88 V45 H86 z M92 5 H94 V45 H92 z M96 5 H100 V45 H96 z"/>
    </svg>
);


const BarcodeGeneratorPage: NextPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        
        {/* Encabezado Principal */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Barcode Generator</h1>
          <InfoIcon className="text-gray-400" />
        </div>
        
        {/* Controles de Impresora y Tamaño */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label htmlFor="printer" className="text-sm font-medium text-gray-700">Printer:</label>
            <select id="printer" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Regular Printer</option>
              <option>Label Printer</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="size" className="text-sm font-medium text-gray-700">Size:</label>
            <select id="size" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>65 Labels (38 * 21mm)</option>
              <option>40 Labels (45 * 25mm)</option>
            </select>
          </div>
        </div>

        {/* Formulario de entrada y vista previa del código de barras */}
        <div className="border rounded-md p-4">
          <div className="flex flex-wrap gap-6 items-start">
            
            {/* Campos de entrada */}
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="w-full">
                <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">Item Name<span className="text-red-500">*</span></label>
                <input type="text" id="item-name" placeholder="Enter Item Name" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="w-full">
                <label htmlFor="item-code" className="block text-sm font-medium text-gray-700 mb-1">Item Code<span className="text-red-500">*</span></label>
                <button id="item-code" className="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded-md p-2 text-sm text-left">Assign Code</button>
              </div>
              <div className="w-full">
                <label htmlFor="no-of-labels" className="block text-sm font-medium text-gray-700 mb-1">No of Labels<span className="text-red-500">*</span></label>
                <input type="number" id="no-of-labels" defaultValue="0" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="w-full">
                <label htmlFor="header" className="block text-sm font-medium text-gray-700 mb-1">Header</label>
                <input type="text" id="header" placeholder="Enter Header" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="w-full">
                <label htmlFor="line1" className="block text-sm font-medium text-gray-700 mb-1">Line 1</label>
                <input type="text" id="line1" placeholder="Enter Line 1" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="w-full">
                <label htmlFor="line2" className="block text-sm font-medium text-gray-700 mb-1">Line 2</label>
                <input type="text" id="line2" placeholder="Enter Line 2" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            {/* Vista previa de la etiqueta */}
            <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                <div className="border rounded-lg p-4 flex flex-col items-center gap-2 text-center w-48 mx-auto">
                    <div className="font-semibold text-xs">Header</div>
                    <BarcodeIcon width="120" height="40" />
                    <div className="font-mono text-xs">Itemcode</div>
                    <div className="text-xs">Line1</div>
                    <div className="text-xs">Line2</div>
                </div>
                <button className="w-full mt-3 bg-slate-500 text-white rounded-md py-2 px-4 flex items-center justify-center gap-2 text-sm hover:bg-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    Add for Barcode
                </button>
            </div>
          </div>
        </div>

        {/* Tabla de ítems agregados */}
        <div className="mt-6">
          <div className="grid grid-cols-5 bg-blue-100 text-sm font-semibold text-gray-700 rounded-t-md">
            <div className="p-3">Item Name</div>
            <div className="p-3">No of Labels</div>
            <div className="p-3">Header</div>
            <div className="p-3">Line 1</div>
            <div className="p-3">Line 2</div>
          </div>
          <div className="border-l border-r border-b rounded-b-md min-h-[200px] flex flex-col justify-center items-center text-center p-4">
            <BarcodeIcon />
            <p className="mt-4 text-gray-500 text-sm">Added items for Barcode generation<br />will appear here.</p>
          </div>
        </div>

        {/* Botones de acción inferiores */}
        <div className="flex justify-end items-center gap-4 mt-8">
          <button className="flex items-center gap-2 border border-gray-300 text-gray-700 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50">
            <EyeIcon className="w-4 h-4" />
            Preview
          </button>
          <button className="bg-gray-400 text-white rounded-md py-2 px-6 text-sm font-medium cursor-not-allowed">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGeneratorPage;