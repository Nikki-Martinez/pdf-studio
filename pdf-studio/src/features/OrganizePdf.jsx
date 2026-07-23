import { useState } from 'react';
import { Upload, FileText, Download, RefreshCw, Trash2, ArrowLeft, ArrowRight, Grid } from 'lucide-react';
import { loadPdfPagesForOrganize, rebuildPdfDocument } from '../utils/organizeHelpers';

export function OrganizePdf() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setIsLoadingPages(true);
      try {
        const loadedPages = await loadPdfPagesForOrganize(selectedFile);
        setPages(loadedPages);
      } catch (error) {
        console.error('Error al cargar las páginas del PDF:', error);
        alert('Ocurrió un error al procesar el archivo PDF.');
      } finally {
        setIsLoadingPages(false);
      }
    }
  };

  const handleMovePage = (index, direction) => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const updatedPages = [...pages];
    const [movedPage] = updatedPages.splice(index, 1);
    updatedPages.splice(targetIndex, 0, movedPage);
    setPages(updatedPages);
  };

  const handleRemovePage = (index) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfBlob = await rebuildPdfDocument(file, pages);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace('.pdf', '')}_ordenado.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar el PDF:', error);
      alert('Error al generar el nuevo documento.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ordenar o Eliminar páginas de PDF</h2>
        <p className="text-sm text-gray-600 mt-1">
          Cambia la posición de las páginas o elimina las que no necesites antes de descargar.
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
              <FileText className="h-6 w-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">Páginas actuales: {pages.length}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setPages([]);
              }}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Cambiar archivo
            </button>
          </div>

          {isLoadingPages ? (
            <div className="flex flex-col items-center justify-py-12 py-12">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin mb-2" />
              <p className="text-sm font-medium text-gray-600">Cargando miniaturas...</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pages.map((page, index) => (
                  <div
                    key={page.id}
                    className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm flex flex-col items-center relative group"
                  >
                    <div className="absolute top-3 left-3 bg-gray-900/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      #{index + 1}
                    </div>

                    <img
                      src={page.thumbnail}
                      alt={`Página ${index + 1}`}
                      className="w-full h-auto rounded border border-gray-100 object-contain max-h-48"
                    />

                    <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleMovePage(index, 'left')}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-20"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleRemovePage(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleMovePage(index, 'right')}
                        disabled={index === pages.length - 1}
                        className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-20"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={handleSave}
                  disabled={pages.length === 0 || isProcessing}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Grid className="h-4 w-4" />
                      Guardar PDF Ordenado
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}