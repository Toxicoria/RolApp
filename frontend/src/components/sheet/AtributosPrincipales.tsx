// src/components/sheet/AtributosPrincipales.tsx
import type { Atributos } from '../../types';
import { calcularModificador, formatearModificador } from '../../utils/modificadores';

interface Props {
  datos: Atributos;
  alCambiar: (nombre: keyof Atributos, valor: number) => void;
}

// Componente para cada cajita individual
const CajaAtributo = ({ etiqueta, nombre, valor, alCambiar }: { etiqueta: string, nombre: keyof Atributos, valor: number, alCambiar: (n: keyof Atributos, v: number) => void }) => {
  const modificador = calcularModificador(valor);

  return (
    <div className="flex flex-col items-center w-24 bg-white border-2 border-gray-300 rounded-lg shadow-sm pb-2 pt-3 relative">
      <span className="text-[10px] font-bold text-gray-700 uppercase mb-1">{etiqueta}</span>
      
      {/* El modificador calculado (Número grande) */}
      <span className="text-3xl font-bold text-gray-800 mb-3">
        {formatearModificador(modificador)}
      </span>
      
      {/* Input de la puntuación base (El óvalo abajo) */}
      <div className="absolute -bottom-3 bg-white border-2 border-gray-300 rounded-full w-12 h-8 flex items-center justify-center overflow-hidden focus-within:border-blue-500 transition-colors">
        <input 
          type="number" 
          value={valor || ''} 
          onChange={(e) => alCambiar(nombre, parseInt(e.target.value) || 0)}
          className="w-full text-center text-sm font-bold outline-none bg-transparent"
        />
      </div>
    </div>
  );
};

export default function AtributosPrincipales({ datos, alCambiar }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-y-6 gap-x-4 md:flex-col md:w-fit py-4">
      <CajaAtributo etiqueta="Fuerza" nombre="fuerza" valor={datos.fuerza} alCambiar={alCambiar} />
      <CajaAtributo etiqueta="Destreza" nombre="destreza" valor={datos.destreza} alCambiar={alCambiar} />
      <CajaAtributo etiqueta="Constitución" nombre="constitucion" valor={datos.constitucion} alCambiar={alCambiar} />
      <CajaAtributo etiqueta="Inteligencia" nombre="inteligencia" valor={datos.inteligencia} alCambiar={alCambiar} />
      <CajaAtributo etiqueta="Sabiduría" nombre="sabiduria" valor={datos.sabiduria} alCambiar={alCambiar} />
      <CajaAtributo etiqueta="Carisma" nombre="carisma" valor={datos.carisma} alCambiar={alCambiar} />
    </div>
  );
}