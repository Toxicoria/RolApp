import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  maxCantidad: number;
  nombreItem: string;
  alCerrar: () => void;
  alConfirmar: (cantidad: number) => void;
}

export default function ModalExtraerItem({ maxCantidad, nombreItem, alCerrar, alConfirmar }: Props) {
  const [cantidad, setCantidad] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cantidad > 0 && cantidad <= maxCantidad) {
      alConfirmar(cantidad);
      alCerrar();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[240px] overflow-hidden flex flex-col scale-in-95 duration-200 border border-slate-200">
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Extraer</h2>
          <button onClick={alCerrar} className="text-slate-400 hover:text-red-500 transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-3 space-y-3">
          <p className="text-xs text-slate-600 leading-tight">
            ¿Sacar <strong className="text-slate-800">{nombreItem}</strong>?
          </p>
          
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase">
              Cant.
            </label>
            <input 
              type="number" 
              autoFocus
              min={1} 
              max={maxCantidad}
              value={cantidad} 
              onChange={e => setCantidad(parseInt(e.target.value) || 1)} 
              className="flex-1 px-2 py-1 text-center text-sm font-bold text-slate-700 border border-slate-200 rounded outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all" 
            />
            <span className="text-[10px] text-slate-400">/ {maxCantidad}</span>
          </div>
          
          <div className="pt-1 flex justify-end gap-1.5">
            <button type="button" onClick={alCerrar} className="px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded transition-colors cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-3 py-1.5 text-[10px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded shadow-sm transition-colors cursor-pointer">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
