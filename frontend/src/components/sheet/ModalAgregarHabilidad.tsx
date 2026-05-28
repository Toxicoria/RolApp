import { useState } from 'react';
import { FormaArea } from '../../types';
import type { TipoFormaArea, Habilidad } from '../../types';

interface Props {
  alCerrar: () => void;
  alGuardar: (habilidad: Omit<Habilidad, 'id'>) => void;
}

export default function ModalAgregarHabilidad({ alCerrar, alGuardar }: Props) {
  const [nombre, setNombre] = useState('');
  const [valor, setValor] = useState(0);
  const [forma, setForma] = useState<TipoFormaArea>(FormaArea.UNICO);
  const [alcance, setAlcance] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alGuardar({ nombre, valor, forma, alcance, descripcion });
    alCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col scale-in-95 duration-200">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide">Nuevo Conjuro / Habilidad</h2>
          <button onClick={alCerrar} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Nombre</label>
            <input required autoFocus type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ej. Bola de Fuego" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Valor (Daño/Cura)</label>
              <input type="number" value={valor} onChange={e => setValor(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 text-sm text-slate-700 font-bold border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Alcance</label>
              <input type="text" value={alcance} onChange={e => setAlcance(e.target.value)} className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ej. 60 pies" />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Forma de Área</label>
            <select value={forma} onChange={e => setForma(e.target.value as TipoFormaArea)} className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
              {Object.values(FormaArea).map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none" placeholder="Escribe los detalles de la habilidad..." />
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={alCerrar} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer">Guardar Conjuro</button>
          </div>
        </form>
      </div>
    </div>
  );
}
