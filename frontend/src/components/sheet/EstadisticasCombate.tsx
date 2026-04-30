import { Heart, Shield, Swords, Package } from 'lucide-react';
import StatTarjeta from '../ui/StatTarjeta';
import ControlPildora from '../ui/ControlPildora';
import type { EstadisticasCombate as TipoCombate } from '../../types';

interface Props {
  datos: TipoCombate;
  alActualizarValor: (campo: keyof TipoCombate, valor: number) => void;
}

export default function EstadisticasCombate({ datos, alActualizarValor }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      {/* VIDA */}
      <StatTarjeta 
        etiqueta="Vida" icono={Heart} color="red"
        subContent={
          <div className="flex flex-col items-center w-full">
            <div className="flex items-baseline gap-1">
              <span className="text-xl md:text-2xl font-black text-red-600 leading-none">{datos.vidaActual}</span>
              <span className="text-[9px] md:text-[10px] font-bold text-slate-300">/</span>
              <input
                type="number" value={datos.vidaMaxima}
                onChange={(e) => alActualizarValor('vidaMaxima', parseInt(e.target.value) || 0)}
                className="w-6 md:w-8 text-[10px] md:text-xs font-bold text-slate-300 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-slate-400 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <ControlPildora
              valor={datos.vidaActual} alCambiar={(v) => alActualizarValor('vidaActual', v)}
              colorBtn="red" className="scale-90 md:scale-100 origin-center mt-1"
            />
          </div>
        }
      />
      {/* RESTO DE STATS */}
      <StatTarjeta etiqueta="Defensa" valor={datos.ca} alCambiar={(v) => alActualizarValor('ca', v)} icono={Shield} color="blue" />
      <StatTarjeta etiqueta="Inic." valor={datos.iniciativa} alCambiar={(v) => alActualizarValor('iniciativa', v)} icono={Swords} color="amber" />
      <StatTarjeta etiqueta="Veloc." valor={datos.velocidad} alCambiar={(v) => alActualizarValor('velocidad', v)} icono={Package} color="slate" />
    </div>
  );
}