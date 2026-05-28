import { useState } from 'react';
import type { ItemInventario } from '../../types';

interface Props {
  alCerrar: () => void;
  alGuardar: (item: Omit<ItemInventario, 'id' | 'contenido'>) => void;
}

export default function ModalAgregarItem({ alCerrar, alGuardar }: Props) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [peso, setPeso] = useState(0);
  const [esContenedor, setEsContenedor] = useState(false);
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alGuardar({ nombre, cantidad, peso, esContenedor, descripcion });
    alCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col scale-in-95 duration-200">
        <div className="px-4 py-3 border-b border-blue-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-blue-600 uppercase tracking-wide">Nuevo Objeto</h2>
          <button onClick={alCerrar} className="text-blue-600 hover:text-slate-600 transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Nombre del objeto</label>
            <input required autoFocus type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ej. Espada Larga" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Cantidad</label>
              <input type="number" min="1" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 text-sm text-slate-700 font-bold border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Peso (Total)</label>
              <input type="number" step="0.1" value={peso} onChange={e => setPeso(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ej. 3.5" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setEsContenedor(!esContenedor)}>
            <input type="checkbox" checked={esContenedor} onChange={() => { }} className="w-4 h-4 text-blue-500 rounded border-slate-300 pointer-events-none" />
            <div className="flex flex-col select-none">
              <span className="text-sm font-bold text-slate-700">Es un contenedor</span>
              <span className="text-[10px] text-slate-500">Mochila, saco o cofre (permite guardar cosas dentro).</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none" placeholder="Anota propiedades mágicas o detalles aquí..." />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={alCerrar} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer">Guardar Objeto</button>
          </div>
        </form>
      </div>
    </div>
  );
}
