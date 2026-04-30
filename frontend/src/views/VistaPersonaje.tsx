// src/views/VistaPersonaje.tsx
import { useState, type ChangeEvent } from 'react';
import CabeceraPersonaje from '../components/sheet/CabeceraPersonaje';
import AtributosPrincipales from '../components/sheet/AtributosPrincipales';
import type { DatosCabecera, Atributos } from '../types';

export default function VistaPersonaje() {
  // Estado de la Cabecera
  const [datosCabecera, setDatosCabecera] = useState<DatosCabecera>({
    nombre: '', trasfondo: '', clase: '', subclase: '', raza: '', nivel: 1, experiencia: 0,
  });

  // Estado de los Atributos
  const [atributos, setAtributos] = useState<Atributos>({
    fuerza: 10, destreza: 10, constitucion: 10, inteligencia: 10, sabiduria: 10, carisma: 10,
  });

  const manejarCambioCabecera = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosCabecera(prev => ({ 
      ...prev, [name]: name === 'nivel' || name === 'experiencia' ? Number(value) : value 
    }));
  };

  const manejarCambioAtributo = (nombre: keyof Atributos, valor: number) => {
    setAtributos(prev => ({ ...prev, [nombre]: valor }));
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Fila Superior: Cabecera */}
        <CabeceraPersonaje datos={datosCabecera} alCambiar={manejarCambioCabecera} />
        
        {/* Cuerpo Principal: Grid para separar columnas en PC */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Columna Izquierda: Atributos (Ocupa 2 de 12 columnas en PC) */}
          <div className="md:col-span-2 md:col-start-1 flex justify-center md:justify-start">
            <AtributosPrincipales datos={atributos} alCambiar={manejarCambioAtributo} />
          </div>

          {/* Columna Central/Derecha: Aquí irán el resto de cosas pronto */}
          <div className="md:col-span-10 bg-white p-6 rounded-md shadow-sm border border-gray-200 min-h-[500px]">
            <p className="text-gray-400 text-center mt-10">Aquí irán Puntos de Golpe, Habilidades, etc.</p>
          </div>

        </div>

      </div>
    </div>
  );
}