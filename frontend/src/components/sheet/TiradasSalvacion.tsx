import type { EntradaStat } from '../../types';

interface Props {
  tiradas: EntradaStat[];
  alCambiar: (id: string, campo: keyof EntradaStat, valor: string | number) => void;
  alAgregar: () => void;
  alEliminar: (id: string) => void;
}

export default function TiradasSalvacion({ tiradas, alCambiar, alAgregar, alEliminar }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wide truncate min-w-0" title="Tiradas de Salvación">Tiradas de Salvación</span>
        <button onClick={alAgregar} className="btn-add" title="Añadir tirada">+</button>
      </div>

      <div className="flex flex-col divide-y divide-slate-50">
        {tiradas.map((t) => (
          <div key={t.id} className="flex items-center gap-1.5 px-2 py-1 group hover:bg-slate-50">
            <input
              type="number"
              value={t.valor}
              onChange={(e) => alCambiar(t.id, 'valor', parseInt(e.target.value) || 0)}
              className="w-8 text-center text-xs font-bold text-blue-600 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <input
              type="text"
              value={t.nombre}
              placeholder="Nombre..."
              title={t.nombre}
              onChange={(e) => alCambiar(t.id, 'nombre', e.target.value)}
              className="flex-1 text-xs text-slate-700 bg-transparent outline-none min-w-0 truncate"
            />
            <button
              onClick={() => alEliminar(t.id)}
              className="text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs shrink-0"
            >✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
