import type { Atributos, AtributoKey, EntradaHabilidad } from '../../types';
import { calcularModificador, formatearModificador, calcularBonoCompetencia } from '../../utils/modificadores';

const ABREV: Record<AtributoKey, string> = {
  fuerza: 'FUE', destreza: 'DES', constitucion: 'CON',
  inteligencia: 'INT', sabiduria: 'SAB', carisma: 'CAR',
};
const ATRIBUTOS: AtributoKey[] = ['fuerza', 'destreza', 'constitucion', 'inteligencia', 'sabiduria', 'carisma'];

interface Props {
  habilidades: EntradaHabilidad[];
  atributos: Atributos;
  nivel: number;
  alCambiar: (id: string, campo: 'nombre' | 'atributo', valor: string) => void;
  alCiclarCompetencia: (id: string) => void;
  alEliminar: (id: string) => void;
  recursos?: any[];
  alCambiarRecurso?: (id: string, campo: 'actual' | 'maximo', valor: string | number) => void;
}

export default function HabilidadesPersonaje({ habilidades, atributos, nivel, alCambiar, alCiclarCompetencia, alEliminar }: Props) {
  const bono = calcularBonoCompetencia(nivel);
  return (
    <div className="flex flex-col divide-y divide-slate-50 overflow-y-auto no-scrollbar h-full">
      {habilidades.map((h) => {
        const mod = calcularModificador(atributos[h.atributo]);
        const valor = mod + (h.competencia ? bono * (h.experiencia ? 2 : 1) : 0);
        const titulo = !h.competencia ? 'Añadir competencia' : !h.experiencia ? 'Añadir pericia (doble bono)' : 'Quitar competencia';
        return (
          <div key={h.id} className="flex items-center gap-1.5 px-2 py-1 group hover:bg-slate-50">
            <button
              onClick={() => alCiclarCompetencia(h.id)} title={titulo}
              className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-colors relative ${h.experiencia ? 'bg-amber-400 border-amber-400' : h.competencia ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}
            >
              {h.experiencia && <span className="absolute inset-[2px] rounded-full bg-white pointer-events-none" />}
            </button>
            <span className="w-6 text-center text-xs md:text-sm font-black text-blue-600 flex-shrink-0">
              {formatearModificador(valor)}
            </span>
            <select
              value={h.atributo}
              onChange={(e) => alCambiar(h.id, 'atributo', e.target.value)}
              className="text-[8px] font-bold text-slate-400 uppercase bg-transparent border-0 outline-none cursor-pointer w-7 flex-shrink-0 text-center"
            >
              {ATRIBUTOS.map(k => <option key={k} value={k}>{ABREV[k]}</option>)}
            </select>
            <input
              type="text" value={h.nombre} placeholder="Nombre..." title={h.nombre}
              onChange={(e) => alCambiar(h.id, 'nombre', e.target.value)}
              className="flex-1 text-[10px] md:text-xs font-bold text-slate-700 bg-transparent outline-none min-w-0 truncate"
            />
            <button
              onClick={() => alEliminar(h.id)}
              className="text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs shrink-0"
            >✕</button>
          </div>
        );
      })}
    </div>
  );
}
