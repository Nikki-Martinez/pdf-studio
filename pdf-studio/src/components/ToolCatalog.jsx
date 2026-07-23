import { ToolCard } from './ToolCard';
import { TOOLS } from '../utils/toolsData';

export function ToolCatalog() {
  return (
    <div>
      <div className="text-center my-10">
        <h1 className="text-3xl font-extrabold sm:text-4xl text-gray-900">
          Herramientas de PDF rápidas y privadas
        </h1>
        <p className="mt-3 text-base text-gray-600 sm:text-lg">
          Procesa tus archivos de trabajo directamente en tu navegador sin subirlos a ningún servidor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}