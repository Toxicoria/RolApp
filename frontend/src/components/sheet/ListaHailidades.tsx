// src/components/sheet/ListaHabilidades.tsx
import { useState } from 'react';
import { FormaArea, type Habilidad, type TipoFormaArea } from '../../types';

interface Props {
  habilidades: Habilidad[];
  alCambiar: (id: string, campo: keyof Habilidad, valor: string | number) => void;
  alAgregar: () => void;
  alEliminar: (id: string) => void;
}

export default function ListaHabilidades({ habilidades, alCambiar, alAgregar, alEliminar }: Props) {
  // Estado local para saber qué habilidad está "expandida" para ver detalles
  const [expandidaId, setExpandidaId] = useState<string | null>(null);

  const toggleExpandir = (id: string) => {
    setExpandidaId(expandidaId === id ? null : id);
  };

  return (
    <div className="bg-white p-4 rounded-md border border-gray-300 shadow-sm">
      <div className="flex justify-between items-center mb-4 border-b-2 border-gray-100 pb-2">
        <h3 className="font-black uppercase text-xs text-gray-500 tracking-tighter">Habilidades y Conjuros</h3>
        <button 
          onClick={alAgregar}
          className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1 rounded-full transition-all active:scale-95"
        >
          + AÑADIR
        </button>
      </div>

      <div className="space-y-3">
        {habilidades.map((hab) => (
          <div key={hab.id} className="border border-gray-200 rounded-lg overflow-hidden transition-all shadow-sm">
            {/* Fila Principal (Siempre visible) */}
            <div className="flex items-center gap-2 p-2 bg-white group">
              <input
                type="number"
                value={hab.valor}
                onChange={(e) => alCambiar(hab.id, 'valor', parseInt(e.target.value) || 0)}
                className="w-10 text-center font-bold text-blue-700 bg-gray-50 rounded h-8 outline-none focus:ring-1 focus:ring-blue-400"
              />
              
              <button 
                onClick={() => toggleExpandir(hab.id)}
                className="flex-1 text-left font-bold text-sm truncate hover:text-blue-600 transition-colors"
              >
                {hab.nombre || <span className="text-gray-300 italic">Sin nombre...</span>}
              </button>

              <button 
                onClick={() => alEliminar(hab.id)}
                className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>

            {/* Panel de Detalles (Solo si está expandida) */}
            {expandidaId === hab.id && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-3 animate-in fade-in slide-in-from-top-1">
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-gray-400 uppercase mb-1">Nombre</label>
                  <input
                    type="text"
                    value={hab.nombre}
                    onChange={(e) => alCambiar(hab.id, 'nombre', e.target.value)}
                    className="text-sm p-1 border rounded bg-white outline-none focus:border-blue-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-[9px] font-bold text-gray-400 uppercase mb-1">Forma / Area</label>
                    <select
                      value={hab.forma}
                      onChange={(e) => alCambiar(hab.id, 'forma', e.target.value as TipoFormaArea)}
                      className="text-xs p-1 border rounded bg-white outline-none focus:border-blue-400 h-8"
                    >
                      {Object.values(FormaArea).map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[9px] font-bold text-gray-400 uppercase mb-1">Alcance</label>
                    <input
                      type="text"
                      value={hab.alcance}
                      onChange={(e) => alCambiar(hab.id, 'alcance', e.target.value)}
                      placeholder="Toque, 18m..."
                      className="text-xs p-1 border rounded bg-white outline-none focus:border-blue-400 h-8"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-gray-400 uppercase mb-1">Descripción</label>
                  <textarea
                    value={hab.descripcion}
                    onChange={(e) => alCambiar(hab.id, 'descripcion', e.target.value)}
                    rows={3}
                    className="text-xs p-2 border rounded bg-white outline-none focus:border-blue-400 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {habilidades.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-400 text-xs italic">Presiona "+ AÑADIR" para crear una técnica</p>
          </div>
        )}
      </div>
    </div>
  );
}