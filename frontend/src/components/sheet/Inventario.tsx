// src/components/sheet/Inventario.tsx
import type { ItemInventario, SubItem } from '../../types';

interface Props {
  items: ItemInventario[];
  // Definimos el tipo directamente en el argumento para evitar el "Cannot find name"
  alCambiarItem: (
    id: string, 
    campo: keyof ItemInventario, 
    valor: string | number | boolean
  ) => void;
  
  alAgregarItem: () => void;
  alEliminarItem: (id: string) => void;
  alAgregarSubItem: (parentId: string) => void;
  
  alCambiarSubItem: (
    parentId: string, 
    subId: string, 
    campo: keyof SubItem, 
    valor: string | number
  ) => void;
  
  alEliminarSubItem: (parentId: string, subId: string) => void;
}
export default function Inventario({ 
  items, alCambiarItem, alAgregarItem, alEliminarItem, 
  alAgregarSubItem, alCambiarSubItem, alEliminarSubItem 
}: Props) {
  return (
    <div className="bg-white p-4 rounded-md border border-gray-300 shadow-sm">
      <div className="flex justify-between items-center mb-4 border-b-2 border-gray-100 pb-2">
        <h3 className="font-black uppercase text-xs text-gray-500 tracking-tighter">Inventario</h3>
        <button onClick={alAgregarItem} className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-3 py-1 rounded-full transition-all">
          + ITEM
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50 shadow-inner">
            {/* Cabecera del Item */}
            <div className="flex items-center gap-2 mb-2">
              <input 
                type="number" 
                value={item.cantidad} 
                onChange={(e) => alCambiarItem(item.id, 'cantidad', parseInt(e.target.value) || 0)}
                className="w-8 text-center text-xs font-bold border rounded bg-white"
              />
              <input 
                type="text" 
                value={item.nombre} 
                placeholder="Nombre del objeto"
                onChange={(e) => alCambiarItem(item.id, 'nombre', e.target.value)}
                className="flex-1 font-bold text-sm bg-transparent outline-none focus:border-b border-blue-400"
              />
              <div className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded">
                 <input 
                  type="checkbox" 
                  checked={item.esContenedor} 
                  onChange={(e) => alCambiarItem(item.id, 'esContenedor', e.target.checked)}
                  className="cursor-pointer"
                 />
                 <span className="text-[9px] font-bold uppercase text-gray-500">Pack</span>
              </div>
              <button onClick={() => alEliminarItem(item.id)} className="text-gray-300 hover:text-red-500">✕</button>
            </div>

            {/* Si es contenedor, mostrar sub-items */}
            {item.esContenedor && (
              <div className="ml-6 mt-2 border-l-2 border-blue-200 pl-3 space-y-2">
                {item.contenido?.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2 group">
                    <input 
                      type="number" 
                      value={sub.cantidad} 
                      onChange={(e) => alCambiarSubItem(item.id, sub.id, 'cantidad', parseInt(e.target.value) || 0)}
                      className="w-6 text-[10px] text-center border rounded bg-white"
                    />
                    <input 
                      type="text" 
                      value={sub.nombre} 
                      placeholder="Sub-objeto"
                      onChange={(e) => alCambiarSubItem(item.id, sub.id, 'nombre', e.target.value)}
                      className="flex-1 text-xs bg-transparent outline-none border-b border-transparent group-hover:border-gray-200"
                    />
                    <button onClick={() => alEliminarSubItem(item.id, sub.id)} className="text-gray-300 hover:text-red-500 text-xs">✕</button>
                  </div>
                ))}
                <button 
                  onClick={() => alAgregarSubItem(item.id)}
                  className="text-[9px] font-bold text-blue-500 hover:text-blue-700 uppercase"
                >
                  + Agregar al pack
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}