import { useState } from 'react';
import { Upload, FileText, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { convertPdfToImages } from '../utils/pdfToImgHelpers';

export function PdfToImg() {
  const [file, setFile] = useState(null);
  const [extractedImages, setExtractedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setExtractedImages([]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const images = await convertPdfToImages(file);
      setExtractedImages(images);
    } catch (error) {
      console.error('Error al convertir PDF a imágenes:', error);
      alert('Ocurrió un error al procesar el archivo PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (dataUrl, pageNumber) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${file.name.replace('.pdf', '')}_pagina_${pageNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Convertir PDF a JPG</h2>
        <p className="text-sm text-gray-600 mt-1">
          Transforma las páginas de tu archivo PDF en imágenes JPG de alta calidad.
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
          <p className="text-xs text-gray-500 mt-1">Solo documentos en formato .pdf</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileText className="h-6 w-6 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setExtractedImages([]);
              }}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Cambiar archivo
            </button>
          </div>

          {extractedImages.length === 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Procesando páginas...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4" />
                    Convertir a JPG
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {extractedImages.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-base font-bold text-gray-800">
            Páginas convertidas ({extractedImages.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {extractedImages.map((img) => (
              <div
                key={img.pageNumber}
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-3"
              >
                <img
                  src={img.dataUrl}
                  alt={`Página ${img.pageNumber}`}
                  className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
                />
                <div className="w-full flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-gray-600">
                    Página {img.pageNumber}
                  </span>
                  <button
                    onClick={() => downloadImage(img.dataUrl, img.pageNumber)}
                    className="flex items-center gap-1 text-xs font-bold text-yellow-700 hover:text-yellow-800"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}