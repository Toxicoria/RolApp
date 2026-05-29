import { useState } from 'react';
import { Circle, Square, Triangle, GripVertical } from 'lucide-react';
import type { Recurso, FormaRecurso, ColorRecurso } from '../../types';

const MAP_SHAPE: Record<FormaRecurso, any> = {
  circulo: Circle,
  cuadrado: Square,
  triangulo: Triangle,
};

const MAP_COLOR: Record<ColorRecurso, { filled: string; empty: string; hover: string }> = {
  verde: { filled: 'text-green-500 fill-current drop-shadow-sm', empty: 'text-green-500/20 fill-current', hover: 'hover:text-green-500/40' },
  azul: { filled: 'text-blue-500 fill-current drop-shadow-sm', empty: 'text-blue-500/20 fill-current', hover: 'hover:text-blue-500/40' },
  rojo: { filled: 'text-red-500 fill-current drop-shadow-sm', empty: 'text-red-500/20 fill-current', hover: 'hover:text-red-500/40' },
  naranja: { filled: 'text-orange-500 fill-current drop-shadow-sm', empty: 'text-orange-500/20 fill-current', hover: 'hover:text-orange-500/40' },
  amarillo: { filled: 'text-yellow-400 fill-current drop-shadow-sm', empty: 'text-yellow-400/30 fill-current', hover: 'hover:text-yellow-400/50' },
};

interface Props {
  recursos: Recurso[];
  alCambiar: (id: string, campo: keyof Recurso, valor: number | string) => void;
  alReordenar?: (idOrigen: string, idDestino: string) => void;
}

export default function RecursosPersonaje({ recursos, alCambiar, alReordenar }: Props) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    // Un pequeño delay para que la clase opacity-50 se aplique después de que el navegador tome el snapshot
    setTimeout(() => {
      const el = e.target as HTMLElement;
      el.classList.add('opacity-40');
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId && sourceId !== targetId && alReordenar) {
      alReordenar(sourceId, targetId);
    }
    setDraggedId(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null);
    const el = e.target as HTMLElement;
    el.classList.remove('opacity-40');
  };
  
  const renderInteractiveDots = (recurso: Recurso) => {
    // Si el máximo es muy alto (por ej. > 10), mostramos un control numérico en su lugar
    if (recurso.maximo > 10) {
      return (
        <div className="flex items-center gap-1.5">
          <button 
            onClick={(e) => { e.stopPropagation(); alCambiar(recurso.id, 'actual', Math.max(0, recurso.actual - 1)); }}
            className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold"
          >
            -
          </button>
          <span className="font-mono text-xs font-bold text-slate-700 w-10 text-center">
            {recurso.actual} / {recurso.maximo}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); alCambiar(recurso.id, 'actual', Math.min(recurso.maximo, recurso.actual + 1)); }}
            className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold"
          >
            +
          </button>
        </div>
      );
    }

    const forma = recurso.forma || 'circulo';
    const color = recurso.color || 'azul';
    const Icon = MAP_SHAPE[forma];
    const colors = MAP_COLOR[color];

    // De lo contrario, mostramos las burbujas
    return (
      <div className="flex flex-wrap gap-1 items-center justify-end">
        {Array.from({ length: recurso.maximo || 1 }).map((_, idx) => {
          const isFilled = idx < recurso.actual;
          return (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                if (isFilled && recurso.actual === idx + 1) {
                  alCambiar(recurso.id, 'actual', idx);
                } else {
                  alCambiar(recurso.id, 'actual', idx + 1);
                }
              }}
              className={`transition-all p-0.5 rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                isFilled ? colors.filled : `${colors.empty} ${colors.hover}`
              }`}
            >
              <Icon size={14} strokeWidth={0} fill="currentColor" className={isFilled ? 'scale-110' : ''} />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar divide-y divide-slate-50">
      {recursos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-60 text-center p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sin recursos</p>
          <p className="text-[9px] text-slate-400">Usa el ícono del lápiz arriba para configurarlos.</p>
        </div>
      ) : (
        recursos.map(recurso => (
          <div 
            key={recurso.id} 
            draggable={!!alReordenar}
            onDragStart={(e) => handleDragStart(e, recurso.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, recurso.id)}
            onDragEnd={handleDragEnd}
            onClick={() => {
              if (recurso.actual === 0) {
                alCambiar(recurso.id, 'actual', recurso.maximo);
              } else {
                alCambiar(recurso.id, 'actual', recurso.actual - 1);
              }
            }}
            className={`flex items-center justify-between gap-2 px-2 py-1.5 hover:bg-slate-100 active:bg-slate-200 group cursor-pointer transition-colors ${
              draggedId === recurso.id ? 'opacity-40' : ''
            }`}
          >
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {alReordenar && (
                <GripVertical size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-grab active:cursor-grabbing" />
              )}
              <span className="text-[10px] md:text-xs font-bold text-slate-700 truncate select-none" title={recurso.nombre}>
                {recurso.nombre || 'Sin nombre'}
              </span>
            </div>
            <div className="flex-shrink-0 flex items-center">
              {renderInteractiveDots(recurso)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
