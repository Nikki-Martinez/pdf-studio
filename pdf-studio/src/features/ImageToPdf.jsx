import { useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, ArrowUp, ArrowDown, Download, RefreshCw } from 'lucide-react';
import { convertImagesToPdf } from '../utils/imageHelpers';

export function ImageToPdf() {
  const [images, setImages] = useState([]);
  const [orientation, setOrientation] = useState('portrait');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) =>
      ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
    );
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMove = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setImages(updated);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfBlob = await convertImagesToPdf(images, orientation);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'imagenes_convertidas.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al convertir imágenes a PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Convertir JPG/PNG a PDF</h2>
        <p className="text-sm text-gray-600 mt-1">
          Sube tus imágenes, define la orientación de las páginas y genera un documento PDF.
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative mb-6">
        <input
          type="file"
          multiple
          accept="image/jpeg, image/png, image/jpg"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        <p className="text-base font-semibold text-gray-700">
          Haz clic o arrastra tus imágenes aquí
        </p>
        <p className="text-xs text-gray-500 mt-1">Formatos admitidos: JPG, PNG</p>
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="text-sm font-semibold text-gray-700">Orientación de página:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setOrientation('portrait')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  orientation === 'portrait'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Vertical (Retrato)
              </button>
              <button
                onClick={() => setOrientation('landscape')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  orientation === 'landscape'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Horizontal (Paisaje)
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              Imágenes seleccionadas ({images.length})
            </h3>
            <div className="space-y-2">
              {images.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <ImageIcon className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {file.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(index)}
                      className="p-1 text-red-600 hover:text-red-800 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setImages([])}
          disabled={images.length === 0 || isProcessing}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          Limpiar
        </button>
        <button
          onClick={handleConvert}
          disabled={images.length === 0 || isProcessing}
          className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Convertir a PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}