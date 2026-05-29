import { Heart, Shield, Swords, SportShoe, Dices, Skull, Minus, Plus } from 'lucide-react';
import StatTarjeta from '../ui/StatTarjeta';
import type { EstadisticasCombate as TipoCombate } from '../../types';

interface Props {
  datos: TipoCombate;
  alActualizarValor: (campo: keyof TipoCombate, valor: string | number) => void;
}

export default function EstadisticasCombate({ datos, alActualizarValor }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-full overflow-y-auto pr-1 custom-scrollbar">
      {/* VIDA */}
      <StatTarjeta
        etiqueta="Vida" icono={Heart} color="red"
        subContent={
          <div className="flex items-center justify-center w-full gap-1">
            <button 
              onClick={() => alActualizarValor('vidaActual', Math.max(0, datos.vidaActual - 1))} 
              className="flex-shrink-0 text-slate-300 hover:text-red-500 active:scale-90 transition-all"
            >
              <Minus size={14} strokeWidth={4} />
            </button>

            <div className="flex items-baseline gap-0.5">
              <input
                type="number" value={datos.vidaActual}
                onChange={(e) => alActualizarValor('vidaActual', parseInt(e.target.value) || 0)}
                className="w-7 md:w-8 text-xl md:text-2xl font-black text-red-600 leading-none bg-transparent outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-[9px] md:text-[10px] font-bold text-slate-300">/</span>
              <input
                type="number" value={datos.vidaMaxima}
                onChange={(e) => alActualizarValor('vidaMaxima', parseInt(e.target.value) || 0)}
                className="w-5 md:w-6 text-[10px] md:text-xs font-bold text-slate-300 bg-transparent outline-none text-center hover:bg-slate-100 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <button 
              onClick={() => alActualizarValor('vidaActual', datos.vidaActual + 1)} 
              className="flex-shrink-0 text-slate-300 hover:text-red-500 active:scale-90 transition-all"
            >
              <Plus size={14} strokeWidth={4} />
            </button>
          </div>
        }
      />
      {/* RESTO DE STATS BÁSICAS */}
      <StatTarjeta etiqueta="Clase de Armadura" valor={datos.ca} alCambiar={(v) => alActualizarValor('ca', v)} icono={Shield} color="blue" />
      <StatTarjeta etiqueta="Iniciativa" valor={datos.iniciativa} alCambiar={(v) => alActualizarValor('iniciativa', v)} icono={Swords} color="amber" />
      <StatTarjeta etiqueta="Velocidad" valor={datos.velocidad} alCambiar={(v) => alActualizarValor('velocidad', v)} icono={SportShoe} color="slate" />
      
      {/* DADOS DE GOLPE */}
      <StatTarjeta
        etiqueta="Dados de Golpe" icono={Dices} color="amber"
        subContent={
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex items-baseline gap-1">
              <input
                type="text" value={datos.dadosGolpeActual}
                onChange={(e) => alActualizarValor('dadosGolpeActual', e.target.value)}
                className="w-6 text-sm md:text-base font-black text-amber-600 bg-transparent outline-none border-b border-transparent hover:border-amber-200 focus:border-amber-400 text-center"
              />
              <span className="text-[9px] font-bold text-slate-300">/</span>
              <input
                type="text" value={datos.dadosGolpeTotal}
                onChange={(e) => alActualizarValor('dadosGolpeTotal', e.target.value)}
                className="w-8 text-[10px] md:text-xs font-bold text-slate-400 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-slate-400 text-center"
              />
            </div>
          </div>
        }
      />

      {/* SALVACIONES DE MUERTE */}
      <StatTarjeta
        etiqueta="Salvación (Muerte)" icono={Skull} color="slate"
        subContent={
          <div className="flex flex-col items-center justify-center w-full gap-1 h-full">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold text-slate-400 uppercase w-6 text-right">Éxito</span>
              <div className="flex gap-1">
                {[1,2,3].map(i => (
                  <div 
                    key={`exito-${i}`}
                    onClick={() => alActualizarValor('salvacionMuerteExitos', datos.salvacionMuerteExitos === i ? i - 1 : i)}
                    className={`w-3.5 h-3.5 rounded-full border cursor-pointer transition-colors ${i <= datos.salvacionMuerteExitos ? 'bg-slate-700 border-slate-700' : 'border-slate-300'}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold text-red-400 uppercase w-6 text-right">Fallo</span>
              <div className="flex gap-1">
                {[1,2,3].map(i => (
                  <div 
                    key={`fallo-${i}`}
                    onClick={() => alActualizarValor('salvacionMuerteFallos', datos.salvacionMuerteFallos === i ? i - 1 : i)}
                    className={`w-3.5 h-3.5 rounded-full border cursor-pointer transition-colors ${i <= datos.salvacionMuerteFallos ? 'bg-red-500 border-red-500' : 'border-slate-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}