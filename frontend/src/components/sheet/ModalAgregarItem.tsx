import { useState } from 'react';
import type { ItemInventario, TipoItem } from '../../types';

interface Props {
  alCerrar: () => void;
  alGuardar: (item: Omit<ItemInventario, 'id' | 'contenido'>) => void;
}

export default function ModalAgregarItem({ alCerrar, alGuardar }: Props) {
  const [tipo, setTipo] = useState<TipoItem>('objeto');
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [peso, setPeso] = useState(0);
  const [valor, setValor] = useState('');
  const [esContenedor, setEsContenedor] = useState(false);
  const [esConsumible, setEsConsumible] = useState(false);
  const [dano, setDano] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipo === 'arma') {
      alGuardar({ tipo, nombre, peso, valor, esContenedor: false, descripcion, dano, esConsumible: false });
    } else {
      alGuardar({ tipo, nombre, cantidad, peso, valor, esContenedor, descripcion, esConsumible });
    }
    alCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col scale-in-95 duration-200">
        <div className="px-4 py-3 border-b border-blue-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-blue-600 uppercase tracking-wide">Nuevo Ítem</h2>
          <button onClick={alCerrar} className="text-blue-600 hover:text-slate-600 transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button type="button" onClick={() => setTipo('objeto')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${tipo === 'objeto' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
              Objeto
            </button>
            <button type="button" onClick={() => setTipo('arma')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${tipo === 'arma' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
              Arma
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Nombre</label>
            <input required autoFocus type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder={tipo === 'arma' ? "Ej. Espada Larga" : "Ej. Poción de curación"} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {tipo === 'objeto' && (
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Cantidad</label>
                <input type="number" min="1" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 text-sm text-slate-700 font-bold border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
            )}
            {tipo === 'arma' && (
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Daño</label>
                <input type="text" value={dano} onChange={e => setDano(e.target.value)} className="w-full px-3 py-2 text-sm font-bold text-red-600 border border-slate-200 rounded-lg outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all" placeholder="Ej. 1d8+2" required />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Valor</label>
              <input type="text" value={valor} onChange={e => setValor(e.target.value)} className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all" placeholder="Ej. 10 po" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Peso</label>
              <input type="number" step="0.1" value={peso} onChange={e => setPeso(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ej. 3.5" />
            </div>
          </div>

          {tipo === 'objeto' && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setEsContenedor(!esContenedor)}>
                <input type="checkbox" checked={esContenedor} onChange={() => { }} className="mt-0.5 w-3.5 h-3.5 text-blue-500 rounded border-slate-300 pointer-events-none" />
                <div className="flex flex-col select-none">
                  <span className="text-xs font-bold text-slate-700">Contenedor</span>
                  <span className="text-[9px] text-slate-500 leading-tight">Ej. Mochila, cofre</span>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setEsConsumible(!esConsumible)}>
                <input type="checkbox" checked={esConsumible} onChange={() => { }} className="mt-0.5 w-3.5 h-3.5 text-green-500 rounded border-slate-300 pointer-events-none" />
                <div className="flex flex-col select-none">
                  <span className="text-xs font-bold text-slate-700">Consumible</span>
                  <span className="text-[9px] text-slate-500 leading-tight">Ej. Poción, comida</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none" placeholder="Anota propiedades mágicas o detalles aquí..." />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={alCerrar} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
