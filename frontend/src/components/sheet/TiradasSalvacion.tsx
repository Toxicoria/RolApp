import type { Atributos, AtributoKey, EntradaSalvacion } from '../../types';
import { calcularModificador, formatearModificador, calcularBonoCompetencia } from '../../utils/modificadores';

const ABREV: Record<AtributoKey, string> = {
  fuerza: 'FUE', destreza: 'DES', constitucion: 'CON',
  inteligencia: 'INT', sabiduria: 'SAB', carisma: 'CAR',
};
const ATRIBUTOS: AtributoKey[] = ['fuerza', 'destreza', 'constitucion', 'inteligencia', 'sabiduria', 'carisma'];

interface Props {
  tiradas: EntradaSalvacion[];
  atributos: Atributos;
  nivel: number;
  alCambiar: (id: string, campo: 'nombre' | 'atributo', valor: string) => void;
  alToggleCompetencia: (id: string) => void;
  alEliminar: (id: string) => void;
}

export default function TiradasSalvacion({ tiradas, atributos, nivel, alCambiar, alToggleCompetencia, alEliminar }: Props) {
  const bono = calcularBonoCompetencia(nivel);
  return (
    <div className="flex flex-col divide-y divide-slate-50 overflow-y-auto no-scrollbar h-full">
      {tiradas.map((t) => {
        const mod = calcularModificador(atributos[t.atributo]);
        const valor = mod + (t.competencia ? bono : 0);
        return (
          <div key={t.id} className="flex items-center gap-1.5 px-2 py-1 group hover:bg-slate-50">
            <button
              onClick={() => alToggleCompetencia(t.id)}
              title={t.competencia ? 'Quitar competencia' : 'Añadir competencia'}
              className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-colors ${t.competencia ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}
            />
            <span className="w-6 text-center text-xs md:text-sm font-black text-blue-600 flex-shrink-0">
              {formatearModificador(valor)}
            </span>
            <select
              value={t.atributo}
              onChange={(e) => alCambiar(t.id, 'atributo', e.target.value)}
              className="text-[8px] font-bold text-slate-400 uppercase bg-transparent border-0 outline-none cursor-pointer w-7 flex-shrink-0 text-center"
            >
              {ATRIBUTOS.map(k => <option key={k} value={k}>{ABREV[k]}</option>)}
            </select>
            <input
              type="text" value={t.nombre} placeholder="Nombre..." title={t.nombre}
              onChange={(e) => alCambiar(t.id, 'nombre', e.target.value)}
              className="flex-1 text-[10px] md:text-xs font-bold text-slate-700 bg-transparent outline-none min-w-0 truncate"
            />
            <button
              onClick={() => alEliminar(t.id)}
              className="text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs shrink-0"
            >✕</button>
          </div>
        );
      })}
    </div>
  );
}
