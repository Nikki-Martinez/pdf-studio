import { Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ToolCatalog } from './components/ToolCatalog';
import { MergePdf } from './features/MergePdf';
import { ImageToPdf } from './features/ImageToPdf';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <Routes>
          {/* Catálogo principal */}
          <Route path="/" element={<ToolCatalog />} />

          {/* Módulo 1: Unir PDF */}
          <Route
            path="/merge"
            element={
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <Link
                  to="/"
                  className="mb-6 text-sm font-semibold text-red-600 hover:underline inline-flex items-center gap-1"
                >
                  ← Volver al catálogo
                </Link>
                <MergePdf />
              </div>
            }
          />

          {/* Módulo 2: JPG/PNG a PDF */}
          <Route
            path="/img-to-pdf"
            element={
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <Link
                  to="/"
                  className="mb-6 text-sm font-semibold text-red-600 hover:underline inline-flex items-center gap-1"
                >
                  ← Volver al catálogo
                </Link>
                <ImageToPdf />
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}