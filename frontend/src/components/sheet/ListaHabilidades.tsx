import { useState } from 'react';
import { FormaArea } from '../../types';
import type { Habilidad, TipoFormaArea } from '../../types';

interface Props {
  habilidades: Habilidad[];
  alCambiar: (id: string, campo: keyof Habilidad, valor: string | number) => void;
  alAgregar: () => void;
  alEliminar: (id: string) => void;
}

export default function ListaHabilidades({ habilidades, alCambiar, alAgregar, alEliminar }: Props) {
  const [expandidaId, setExpandidaId] = useState<string | null>(null);

  const toggleExpandir = (id: string) => {
    setExpandidaId(expandidaId === id ? null : id);
  };

  return (
    <div className="sheet-card p-4">
      <div className="flex justify-between items-center mb-4 border-b-2 border-gray-100 pb-2">
        <h3 className="section-title">Habilidades y Conjuros</h3>
        <button onClick={alAgregar} className="btn-add" title="Agregar Habilidad">+</button>
      </div>

      <div className="space-y-3">
        {habilidades.map((hab) => (
          <div key={hab.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
            <div className="flex items-center gap-2 p-2 group">
              <input
                type="number"
                value={hab.valor}
                onChange={(e) => alCambiar(hab.id, 'valor', parseInt(e.target.value) || 0)}
                className="w-10 text-center font-bold text-blue-700 bg-gray-50 rounded h-8 outline-none"
              />
              <button 
                onClick={() => toggleExpandir(hab.id)}
                className="flex-1 text-left font-bold text-sm truncate hover:text-blue-600"
              >
                {hab.nombre || <span className="text-gray-300 italic">Sin nombre...</span>}
              </button>
              <button onClick={() => alEliminar(hab.id)} className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100">✕</button>
            </div>

            {expandidaId === hab.id && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={hab.nombre}
                  onChange={(e) => alCambiar(hab.id, 'nombre', e.target.value)}
                  className="w-full text-sm p-1 border rounded bg-white outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={hab.forma}
                    onChange={(e) => alCambiar(hab.id, 'forma', e.target.value as TipoFormaArea)}
                    className="text-xs p-1 border rounded bg-white h-8"
                  >
                    {Object.values(FormaArea).map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Alcance"
                    value={hab.alcance}
                    onChange={(e) => alCambiar(hab.id, 'alcance', e.target.value)}
                    className="text-xs p-1 border rounded bg-white h-8"
                  />
                </div>
                <textarea
                  value={hab.descripcion}
                  onChange={(e) => alCambiar(hab.id, 'descripcion', e.target.value)}
                  placeholder="Descripción..."
                  className="w-full text-xs p-2 border rounded bg-white resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}