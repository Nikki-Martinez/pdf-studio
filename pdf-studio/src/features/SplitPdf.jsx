import { useState } from 'react';
import { Upload, FileText, Download, RefreshCw, Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { extractPdfPages, splitAllPdfPages } from '../utils/splitHelpers';

export function SplitPdf() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState('range'); // 'range' o 'all'
  const [rangeInput, setRangeInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      try {
        const buffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        setPageCount(pdf.getPageCount());
        setFile(selectedFile);
        setRangeInput(`1-${pdf.getPageCount()}`);
      } catch (error) {
        console.error('Error al leer el archivo PDF:', error);
      }
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      if (mode === 'range') {
        const pdfBlob = await extractPdfPages(file, rangeInput);
        downloadFile(pdfBlob, `${file.name.replace('.pdf', '')}_extraido.pdf`);
      } else {
        const pdfList = await splitAllPdfPages(file);
        pdfList.forEach(({ pageNumber, blob }) => {
          downloadFile(blob, `${file.name.replace('.pdf', '')}_pagina_${pageNumber}.pdf`);
        });
      }
    } catch (error) {
      alert('Ocurrió un error al procesar el rango de páginas.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dividir o Extraer páginas de PDF</h2>
        <p className="text-sm text-gray-600 mt-1">
          Extrae páginas específicas o divide un archivo PDF en múltiples documentos individuales.
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative mb-6">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <p className="text-base font-semibold text-gray-700">
            Haz clic o arrastra tu archivo PDF aquí
          </p>
          <p className="text-xs text-gray-500 mt-1">Solo un documento por proceso</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileText className="h-6 w-6 text-orange-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">Total de páginas: {pageCount}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setPageCount(0);
              }}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Cambiar archivo
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
            <h3 className="text-sm font-bold text-gray-800">Modo de división:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setMode('range')}
                className={`p-4 rounded-lg border cursor-pointer flex flex-col gap-1 transition-colors ${
                  mode === 'range'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-bold text-gray-900">Extraer Rango</span>
                <span className="text-xs text-gray-500">
                  Guarda solo las páginas seleccionadas en un solo archivo.
                </span>
              </label>

              <label
                onClick={() => setMode('all')}
                className={`p-4 rounded-lg border cursor-pointer flex flex-col gap-1 transition-colors ${
                  mode === 'all'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-bold text-gray-900">Separar todas las páginas</span>
                <span className="text-xs text-gray-500">
                  Genera un archivo PDF independiente por cada página.
                </span>
              </label>
            </div>

            {mode === 'range' && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Rango de páginas (Ejemplo: 1-3, 5):
                </label>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ej: 1-3, 5"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleSplit}
          disabled={!file || isProcessing}
          className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Scissors className="h-4 w-4" />
              Procesar División
            </>
          )}
        </button>
      </div>
    </div>
  );
}