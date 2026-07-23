import { Link } from 'react-router-dom';

export function ToolCard({ tool }) {
  const Icon = tool.icon;

  return (
    <Link
      to={`/${tool.id}`}
      className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
    >
      <div>
        <div className={`mb-4 inline-flex rounded-lg p-3 ${tool.color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
          {tool.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}