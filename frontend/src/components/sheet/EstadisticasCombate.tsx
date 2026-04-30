// src/components/sheet/EstadisticasCombate.tsx
import type { ChangeEvent } from 'react';
import type { EstadisticasCombate as TipoCombate } from '../../types';

interface Props {
  datos: TipoCombate;
  alCambiar: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Sub-componente para las cajas pequeñas (CA, Iniciativa, Velocidad)
const CajaInfo = ({ etiqueta, nombre, valor, alCambiar }: { etiqueta: string, nombre: string, valor: number, alCambiar: (e: ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="flex flex-col items-center border-2 border-gray-300 rounded-md p-2 bg-white w-20 shadow-sm">
    <label className="text-[9px] font-black uppercase text-gray-500 mb-1">{etiqueta}</label>
    <input
      type="number"
      name={nombre}
      value={valor}
      onChange={alCambiar}
      className="text-2xl font-bold w-full text-center outline-none bg-transparent"
    />
  </div>
);

export default function EstadisticasCombate({ datos, alCambiar }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Fila Superior: CA, Iniciativa y Velocidad */}
      <div className="flex justify-between items-center gap-2">
        <CajaInfo etiqueta="CA" nombre="ca" valor={datos.ca} alCambiar={alCambiar} />
        <CajaInfo etiqueta="Inic." nombre="iniciativa" valor={datos.iniciativa} alCambiar={alCambiar} />
        <CajaInfo etiqueta="Veloc." nombre="velocidad" valor={datos.velocidad} alCambiar={alCambiar} />
      </div>

      {/* Bloque de Vida (Puntos de Golpe) */}
      <div className="border-2 border-gray-300 rounded-md p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <label className="text-[10px] font-black uppercase text-gray-500">Puntos de Golpe</label>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400">Máx:</span>
            <input
              type="number"
              name="vidaMaxima"
              value={datos.vidaMaxima}
              onChange={alCambiar}
              className="w-12 text-sm font-bold border-b border-gray-300 outline-none text-center"
            />
          </div>
        </div>
        
        <input
          type="number"
          name="vidaActual"
          value={datos.vidaActual}
          onChange={alCambiar}
          className="text-4xl font-black w-full text-center outline-none py-2 text-red-600"
          placeholder="0"
        />
        
        <div className="text-center border-t border-gray-100 pt-2 mt-2">
          <label className="text-[9px] font-bold uppercase text-gray-400">Actuales</label>
        </div>
      </div>
    </div>
  );
}