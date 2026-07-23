import { 
  Combine, 
  Scissors, 
  Image, 
  FileImage, 
  Grid, 
  RotateCw, 
  Stamp, 
  Hash, 
  Lock, 
  PenTool 
} from 'lucide-react';

export const TOOLS = [
  {
    id: 'merge',
    title: 'Unir PDF',
    description: 'Une PDFs y ponlos en el orden que prefieras. ¡Rápido y fácil!',
    icon: Combine,
    color: 'bg-red-50 text-red-600 border-red-200'
  },
  {
    id: 'split',
    title: 'Dividir PDF',
    description: 'Extrae una o varias páginas de tu PDF o convierte cada página en un archivo independiente.',
    icon: Scissors,
    color: 'bg-orange-50 text-orange-600 border-orange-200'
  },
  {
    id: 'img-to-pdf',
    title: 'JPG a PDF',
    description: 'Convierte tus imágenes JPG o PNG a PDF. Ajusta la orientación y los márgenes.',
    icon: Image,
    color: 'bg-amber-50 text-amber-600 border-amber-200'
  },
  {
    id: 'pdf-to-img',
    title: 'PDF a JPG',
    description: 'Extrae todas las imágenes que están dentro de un PDF o convierte cada página en una imagen.',
    icon: FileImage,
    color: 'bg-yellow-50 text-yellow-600 border-yellow-200'
  },
  {
    id: 'organize',
    title: 'Ordenar PDF',
    description: 'Ordena las páginas de tu PDF como quieras. Elimina o añade páginas según necesites.',
    icon: Grid,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  {
    id: 'rotate',
    title: 'Rotar PDF',
    description: 'Rota tus PDF como quieras. Rota muchos documentos o páginas a la vez.',
    icon: RotateCw,
    color: 'bg-teal-50 text-teal-600 border-teal-200'
  },
  {
    id: 'watermark',
    title: 'Marca de agua',
    description: 'Elige una imagen o texto para insertarlo encima de un PDF. Configura posición y opacidad.',
    icon: Stamp,
    color: 'bg-sky-50 text-sky-600 border-sky-200'
  },
  {
    id: 'page-numbers',
    title: 'Números de página',
    description: 'Añade números de página a un PDF. Escoge posición, formato y tipografía.',
    icon: Hash,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  },
  {
    id: 'protect',
    title: 'Proteger / Desbloquear',
    description: 'Protege tu PDF con contraseña o quita la clave para trabajar libremente.',
    icon: Lock,
    color: 'bg-purple-50 text-purple-600 border-purple-200'
  },
  {
    id: 'sign',
    title: 'Firmar PDF',
    description: 'Firma tú mismo dibujando o insertando la imagen de tu firma en la hoja deseada.',
    icon: PenTool,
    color: 'bg-pink-50 text-pink-600 border-pink-200'
  }
];