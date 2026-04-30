import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import ControlPildora from './ControlPildora';

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
    <div className={`bg-white border border-slate-200 rounded-xl px-2 py-2 md:px-3 shadow-sm flex flex-row items-center gap-2 w-full shrink-0 transition-all ${style.border} group relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${style.accent} opacity-10 group-hover:opacity-100 transition-opacity`} />

      <div className={`${style.bgIcon} p-1.5 rounded-lg ${style.icon} shrink-0 transition-all group-hover:scale-105`}>
        <Icono size={26} />
      </div>

      <div className="flex flex-col items-center flex-1 min-w-0">
        <label className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 text-center leading-none tracking-tighter mb-1">
          {etiqueta}
        </label>
        {subContent ? subContent : (
          <>
            <span className={`text-lg md:text-xl font-black leading-none ${color === 'red' ? 'text-red-600' : 'text-slate-800'}`}>
              {valor}
            </span>
            {alCambiar && (
              <ControlPildora valor={valor || 0} alCambiar={alCambiar} colorBtn={color} className="mt-1" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
