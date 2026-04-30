// src/components/sheet/CabeceraPersonaje.tsx
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
  return (
    <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6">
      
      {/* Bloque del Nombre */}
      <div className="flex-1 md:max-w-sm flex flex-col-reverse justify-end">
        <input 
          type="text" 
          name="nombre"
          value={datos.nombre}
          onChange={alCambiar}
          className="w-full text-3xl font-bold bg-transparent outline-none border-b-2 border-gray-400 focus:border-blue-500 pb-1 transition-colors"
          placeholder="Ej. Gandalf"
        />
        <label className="text-xs font-bold text-gray-500 uppercase group-focus-within:text-blue-500 mb-1">
          Nombre del Personaje
        </label>
      </div>

      {/* Bloque de Detalles */}
      <div className="flex-[2] grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 bg-gray-50 p-4 rounded border border-gray-100">
        <EntradaCabecera etiqueta="Clase" nombre="clase" valor={datos.clase} alCambiar={alCambiar} />
        <EntradaCabecera etiqueta="Subclase" nombre="subclase" valor={datos.subclase} alCambiar={alCambiar} />
        <EntradaCabecera etiqueta="Nivel" nombre="nivel" valor={datos.nivel} alCambiar={alCambiar} tipo="number" />
        <EntradaCabecera etiqueta="Raza" nombre="raza" valor={datos.raza} alCambiar={alCambiar} />
        <EntradaCabecera etiqueta="Trasfondo" nombre="trasfondo" valor={datos.trasfondo} alCambiar={alCambiar} />
        <EntradaCabecera etiqueta="Experiencia" nombre="experiencia" valor={datos.experiencia} alCambiar={alCambiar} tipo="number" />
      </div>

    </div>
  );
}