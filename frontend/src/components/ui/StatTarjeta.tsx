import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Minus, Plus } from 'lucide-react';

interface Props {
  etiqueta: string;
  valor?: number;
  alCambiar?: (valor: number) => void;
  icono: LucideIcon;
  color?: 'blue' | 'red' | 'amber' | 'slate';
  subContent?: ReactNode;
}

export default function StatTarjeta({ etiqueta, valor, alCambiar, icono: Icono, color = "blue", subContent = null }: Props) {
  const colorMap = {
    blue:  { icon: "text-blue-500",  bgIcon: "bg-blue-50",   border: "hover:border-blue-300",  accent: "bg-blue-500"  },
    red:   { icon: "text-red-500",   bgIcon: "bg-red-50",    border: "hover:border-red-300",   accent: "bg-red-500"   },
    amber: { icon: "text-amber-500", bgIcon: "bg-amber-50",  border: "hover:border-amber-300", accent: "bg-amber-500" },
    slate: { icon: "text-slate-500", bgIcon: "bg-slate-100", border: "hover:border-slate-400", accent: "bg-slate-500" }
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex flex-row items-stretch gap-2 w-full h-full transition-all ${style.border} group relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${style.accent} opacity-10 group-hover:opacity-100 transition-opacity`} />

      {/* IZQUIERDA: Logo y Etiqueta */}
      <div className="flex flex-col items-center justify-center shrink-0 w-[35%] min-w-[65px] gap-1 border-r border-slate-100 pr-1">
        <div className={`${style.bgIcon} p-1.5 rounded-lg ${style.icon} transition-all group-hover:scale-105`}>
          <Icono size={22} />
        </div>
        <label className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 text-center leading-tight break-words w-full">
          {etiqueta}
        </label>
      </div>

      {/* DERECHA: Valor / Contenido */}
      <div className="flex flex-col items-center justify-center flex-1 min-w-0">
        {subContent ? subContent : (
          <div className="flex items-center justify-center w-full gap-1.5">
            {alCambiar && (
              <button 
                onClick={() => alCambiar((valor || 0) - 1)} 
                className="flex-shrink-0 text-slate-300 hover:text-slate-600 active:scale-90 transition-all"
              >
                <Minus size={14} strokeWidth={4} />
              </button>
            )}
            
            <input 
              type="number" 
              value={valor} 
              onChange={(e) => alCambiar ? alCambiar(parseInt(e.target.value) || 0) : undefined} 
              readOnly={!alCambiar}
              className={`w-8 text-center text-xl md:text-2xl font-black leading-none bg-transparent outline-none ${color === 'red' ? 'text-red-600' : 'text-slate-800'} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
            />

            {alCambiar && (
              <button 
                onClick={() => alCambiar((valor || 0) + 1)} 
                className="flex-shrink-0 text-slate-300 hover:text-slate-600 active:scale-90 transition-all"
              >
                <Plus size={14} strokeWidth={4} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
