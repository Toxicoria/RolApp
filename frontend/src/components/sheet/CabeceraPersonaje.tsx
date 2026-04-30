import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { DatosCabecera } from '../../types';

interface Props {
  datos: DatosCabecera;
  alCambiar: (e: ChangeEvent<HTMLInputElement>) => void;
}

const EntradaCabecera = ({ etiqueta, nombre, valor, alCambiar, tipo = "text" }: { etiqueta: string, nombre: string, valor: string | number, alCambiar: (e: ChangeEvent<HTMLInputElement>) => void, tipo?: string }) => (
  <div className="flex flex-col-reverse group">
    <input
      type={tipo}
      name={nombre}
      value={valor}
      onChange={alCambiar}
      className="bg-transparent outline-none font-semibold text-gray-800 border-b border-gray-300 focus:border-blue-500 pb-1 w-full transition-colors"
    />
    <label className="text-[10px] font-bold text-gray-500 uppercase group-focus-within:text-blue-500 transition-colors">
      {etiqueta}
    </label>
  </div>
);

export default function CabeceraPersonaje({ datos, alCambiar }: Props) {
  const [expandida, setExpandida] = useState(false);

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">

      {/* Barra siempre visible */}
      <div
        className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpandida(!expandida)}
      >
        <input
          type="text"
          name="nombre"
          value={datos.nombre}
          onChange={alCambiar}
          onClick={(e) => e.stopPropagation()}
          placeholder="Nombre del personaje..."
          className="flex-1 text-lg font-bold bg-transparent outline-none text-gray-800 placeholder:text-gray-300 min-w-0"
        />

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Niv.</span>
            <input
              type="number"
              name="nivel"
              value={datos.nivel}
              onChange={alCambiar}
              onClick={(e) => e.stopPropagation()}
              className="w-8 text-center font-bold text-gray-700 bg-transparent outline-none border-b border-gray-200 focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">XP</span>
            <input
              type="number"
              name="experiencia"
              value={datos.experiencia}
              onChange={alCambiar}
              onClick={(e) => e.stopPropagation()}
              className="w-16 text-center font-bold text-gray-700 bg-transparent outline-none border-b border-gray-200 focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 shrink-0 ${expandida ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Detalles desplegables */}
      {expandida && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 bg-gray-50 p-4 rounded border border-gray-100">
            <EntradaCabecera etiqueta="Clase"      nombre="clase"      valor={datos.clase}      alCambiar={alCambiar} />
            <EntradaCabecera etiqueta="Subclase"   nombre="subclase"   valor={datos.subclase}   alCambiar={alCambiar} />
            <EntradaCabecera etiqueta="Raza"       nombre="raza"       valor={datos.raza}       alCambiar={alCambiar} />
            <EntradaCabecera etiqueta="Trasfondo"  nombre="trasfondo"  valor={datos.trasfondo}  alCambiar={alCambiar} />
          </div>
        </div>
      )}

    </div>
  );
}
