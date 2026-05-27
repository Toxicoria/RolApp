import { BicepsFlexed, Zap, Heart, Brain, Eye, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ControlPildora from '../ui/ControlPildora';
import type { Atributos } from '../../types';

interface Props {
  datos: Atributos;
  alCambiar: (nombre: keyof Atributos, valor: number) => void;
}

type AtribKey = keyof Atributos;

const CONF: Record<AtribKey, { label: string; icon: LucideIcon; color: string }> = {
  fuerza:       { label: 'Fuerza',        icon: BicepsFlexed, color: 'text-red-400'    },
  destreza:     { label: 'Destreza',      icon: Zap,          color: 'text-yellow-400' },
  constitucion: { label: 'Constitución',  icon: Heart,        color: 'text-pink-400'   },
  inteligencia: { label: 'Inteligencia',  icon: Brain,        color: 'text-blue-400'   },
  sabiduria:    { label: 'Sabiduría',     icon: Eye,          color: 'text-purple-400' },
  carisma:      { label: 'Carisma',       icon: Sparkles,     color: 'text-amber-400'  },
};

const calcularModificador = (v: number) => Math.floor((v - 10) / 2);
const formatMod = (m: number) => (m >= 0 ? `+${m}` : `${m}`);

export default function AtributosPrincipales({ datos, alCambiar }: Props) {
  return (
    <div className="flex flex-col divide-y divide-slate-50 h-full overflow-y-auto no-scrollbar">
      {(Object.keys(datos) as AtribKey[]).map(attr => {
        const { label, icon: Icon, color } = CONF[attr];
        const valor = datos[attr];
        const mod = calcularModificador(valor);
        return (
          <div key={attr} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-50 group">
            <Icon size={12} className={`flex-shrink-0 ${color}`} />
            <span className="flex-1 text-[9px] font-semibold text-slate-600 min-w-0">{label}</span>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <ControlPildora valor={valor} alCambiar={v => alCambiar(attr, v)} min={1} />
              <span className="text-[11px] font-black text-blue-600 w-6 text-right">
                {formatMod(mod)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
