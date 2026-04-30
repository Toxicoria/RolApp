import ControlPildora from '../ui/ControlPildora';
import type { Atributos } from '../../types';

interface Props {
  datos: Atributos;
  alCambiar: (nombre: keyof Atributos, valor: number) => void;
}

const calcularModificador = (puntuacion: number) => Math.floor((puntuacion - 10) / 2);
const formatearModificador = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);

export default function AtributosPrincipales({ datos, alCambiar }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3">
      {Object.keys(datos).map((attr) => {
        const nombre = attr as keyof Atributos;
        const valor = datos[nombre];
        const mod = calcularModificador(valor);
        return (
          <div key={nombre} className="flex flex-col items-center w-full bg-white border border-slate-200 rounded-xl shadow-sm pb-2 pt-2 relative group hover:border-blue-300 transition-all">
            <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{nombre.substring(0, 3)}</span>
            <span className="text-lg md:text-2xl font-black text-slate-800 mb-1">{formatearModificador(mod)}</span>
            <ControlPildora valor={valor} alCambiar={(v) => alCambiar(nombre, v)} min={1} className="scale-75 origin-center" />
          </div>
        );
      })}
    </div>
  );
}
