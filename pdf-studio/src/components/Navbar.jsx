import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link 
          to="/"
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="rounded-lg bg-red-600 p-2 text-white">
            <FileText className="h-6 w-6" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">
            PDF Studio
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <span className="text-xs font-semibold rounded-full bg-gray-100 px-3 py-1 text-gray-600">
            Local & Seguro
          </span>
        </nav>
      </div>
    </header>
  );
}