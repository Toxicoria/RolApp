import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sword, Backpack, ChevronDown, ChevronRight, Upload, X, Sparkles } from 'lucide-react';
import ModalExtraerItem from './ModalExtraerItem';
import type { ItemInventario, SubItem } from '../../types';

interface Props {
  items: ItemInventario[];
  alCambiarItem: (id: string, campo: keyof ItemInventario, valor: string | number | boolean) => void;
  alEliminarItem: (id: string) => void;
  alCambiarSubItem: (parentId: string, subId: string, campo: keyof SubItem, valor: string | number) => void;
  alEliminarSubItem: (parentId: string, subId: string) => void;
  alMoverItemAContenedor?: (itemId: string, contenedorId: string) => void;
  alSacarSubItem?: (contenedorId: string, subItemId: string, cantidad: number) => void;
}

export default function Inventario({ items, alCambiarItem, alEliminarItem, alCambiarSubItem, alEliminarSubItem, alMoverItemAContenedor, alSacarSubItem }: Props) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [contenedoresExpandidos, setContenedoresExpandidos] = useState<Set<string>>(new Set());
  const [hoveredItem, setHoveredItem] = useState<ItemInventario | SubItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Estado para el modal de extracción
  const [extractingSubItem, setExtractingSubItem] = useState<{ contenedorId: string, subItem: SubItem } | null>(null);

  // Estado visual para cuando arrastras sobre un contenedor
  const [dragOverContenedorId, setDragOverContenedorId] = useState<string | null>(null);

  const usarConsumible = (item: ItemInventario) => {
    const cantidadActual = item.cantidad || 0;
    if (cantidadActual > 0) {
      alCambiarItem(item.id, 'cantidad', cantidadActual - 1);
      setToastMsg(`Se ha consumido ${item.nombre || 'un objeto'}`);
      
      if (cantidadActual - 1 === 0) {
        setTimeout(() => {
          alEliminarItem(item.id);
        }, 4000);
      }
    } else {
      setToastMsg(`No quedan más ${item.nombre || 'objetos'}`);
    }
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToastMsg(null), 4000);
  };

  const toggleContenedor = (id: string) => {
    setContenedoresExpandidos(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleMouseMove = (e: React.MouseEvent, item: ItemInventario | SubItem) => {
    if ('esContenedor' in item && item.esContenedor) return; // Contenedores no muestran tooltip
    setHoveredItem(item);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // --- Manejadores Drag and Drop ---
  const handleDragStart = (e: React.DragEvent, item: ItemInventario) => {
    if (item.esContenedor) return;
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, contenedorId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverContenedorId !== contenedorId) {
      setDragOverContenedorId(contenedorId);
    }
  };

  const handleDragLeave = (_e: React.DragEvent, contenedorId: string) => {
    if (dragOverContenedorId === contenedorId) {
      setDragOverContenedorId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, contenedorId: string) => {
    e.preventDefault();
    setDragOverContenedorId(null);
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId && alMoverItemAContenedor) {
      alMoverItemAContenedor(itemId, contenedorId);
    }
  };

  return (
    <>
    <div className="overflow-y-auto no-scrollbar h-full p-3 flex flex-col">
      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center opacity-70">
          <span className="text-xs font-black text-slate-300 uppercase tracking-widest select-none">No hay nada aquí...</span>
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((item) => (
          <div 
            key={item.id} 
            className={`py-2 border-b border-slate-100 last:border-0 group relative transition-colors ${dragOverContenedorId === item.id ? 'bg-blue-50/50 rounded-lg px-2 -mx-2 ring-1 ring-blue-300 ring-inset' : ''}`}
            draggable={!item.esContenedor}
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={item.esContenedor ? (e) => handleDragOver(e, item.id) : undefined}
            onDragLeave={item.esContenedor ? (e) => handleDragLeave(e, item.id) : undefined}
            onDrop={item.esContenedor ? (e) => handleDrop(e, item.id) : undefined}
          >
            <div className="flex items-center gap-2 mb-1">
              
              {/* Cantidad solo si no es contenedor y no es arma */}
              {!item.esContenedor && item.tipo !== 'arma' && (
                <input
                  type="number" value={item.cantidad ?? ''}
                  onChange={(e) => alCambiarItem(item.id, 'cantidad', parseInt(e.target.value) || 0)}
                  className="w-8 text-center text-xs font-bold border rounded bg-white outline-none focus:ring-1 focus:ring-blue-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              )}
              
              {/* Iconos de Tipo */}
              {item.tipo === 'arma' && (
                <span title="Arma" className="text-red-500 cursor-grab active:cursor-grabbing px-1">
                  <Sword size={16} strokeWidth={2.5} />
                </span>
              )}
              {item.esContenedor && (
                <span title="Contenedor" className="text-blue-500 px-1">
                  <Backpack size={16} strokeWidth={2.5} />
                </span>
              )}

              {/* Nombre (Clickable si es contenedor, Tooltip si no) */}
              <div 
                className={`flex-1 font-bold text-sm truncate select-none transition-colors ${item.esContenedor ? 'cursor-pointer hover:text-blue-600' : 'cursor-help'} ${item.tipo === 'arma' ? 'text-red-900' : 'text-slate-700'} ${!item.esContenedor && 'cursor-grab active:cursor-grabbing'}`}
                onMouseMove={(e) => handleMouseMove(e, item)}
                onMouseLeave={handleMouseLeave}
                onClick={() => item.esContenedor && toggleContenedor(item.id)}
              >
                {item.nombre || <span className="text-gray-300 italic">Sin nombre...</span>}
                {item.esContenedor && (
                  <span className="text-slate-400 ml-1.5 inline-flex items-center">
                    {contenedoresExpandidos.has(item.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                )}
              </div>
              
              {/* Botón Usar Consumible */}
              {!item.esContenedor && item.tipo !== 'arma' && item.esConsumible && (
                <button
                  onClick={() => usarConsumible(item)}
                  className="px-2 py-0.5 bg-green-500 hover:bg-green-600 text-white text-[10px] font-black rounded uppercase shadow-sm transition-colors"
                >
                  Usar
                </button>
              )}
              
              <button onClick={() => alEliminarItem(item.id)} className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={14} strokeWidth={3} />
              </button>
            </div>
            
            {/* Contenedor Expandido */}
            {item.esContenedor && contenedoresExpandidos.has(item.id) && (
              <div className="ml-8 mt-2 border-l-2 border-blue-100 pl-3 space-y-2 pb-1">
                {item.descripcion && (
                  <p className="text-xs text-slate-500 italic mb-2 leading-relaxed">{item.descripcion}</p>
                )}
                
                {item.contenido?.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2 group/sub">
                    <input
                      type="number" value={sub.cantidad ?? ''}
                      onChange={(e) => alCambiarSubItem(item.id, sub.id, 'cantidad', parseInt(e.target.value) || 0)}
                      className="w-6 text-[10px] text-center border rounded bg-white outline-none focus:ring-1 focus:ring-blue-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    
                    {/* Nombre del SubItem (solo lectura para que funcione el tooltip como en el principal) */}
                    <div
                      className="flex-1 text-xs bg-transparent outline-none font-medium text-slate-600 truncate cursor-help"
                      onMouseMove={(e) => handleMouseMove(e, sub)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {sub.nombre || <span className="text-gray-300 italic">Sub-item...</span>}
                    </div>

                    <button 
                      onClick={() => {
                        if (sub.cantidad && sub.cantidad > 1) {
                          setExtractingSubItem({ contenedorId: item.id, subItem: sub });
                        } else if (alSacarSubItem) {
                          alSacarSubItem(item.id, sub.id, 1);
                        }
                      }} 
                      title="Sacar de la mochila"
                      className="text-slate-400 hover:text-blue-500 p-1 opacity-0 group-hover/sub:opacity-100 transition-opacity"
                    >
                      <Upload size={14} strokeWidth={2.5} />
                    </button>
                    <button onClick={() => alEliminarSubItem(item.id, sub.id)} className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
    
    {toastMsg && (
      <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-5 py-3 rounded-lg shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 z-[100] text-sm font-bold border border-slate-700 flex items-center gap-2">
        <Sparkles size={16} className="text-yellow-400" /> {toastMsg}
      </div>
    )}

    {hoveredItem && typeof document !== 'undefined' && createPortal(
      <div 
        className="fixed pointer-events-none z-[9999] bg-slate-900 text-slate-200 p-4 rounded-xl shadow-2xl border border-slate-700 w-72 backdrop-blur-sm bg-opacity-95"
        style={{ 
          top: mousePos.y > window.innerHeight - 250 ? mousePos.y - 200 : mousePos.y + 15,
          left: mousePos.x > window.innerWidth - 320 ? mousePos.x - 300 : mousePos.x + 15 
        }}
      >
        <div className="space-y-2 text-sm">
          {hoveredItem.tipo === 'arma' && hoveredItem.dano && (
            <div><span className="font-bold text-slate-400">Daño:</span> <span className="text-red-400 font-bold">{hoveredItem.dano}</span></div>
          )}
          {hoveredItem.valor && (
            <div><span className="font-bold text-slate-400">Valor:</span> <span className="text-yellow-400 font-bold">{hoveredItem.valor}</span></div>
          )}
          {hoveredItem.descripcion && (
            <div>
              <span className="font-bold text-slate-400">Descripción:</span>
              <p className="mt-1 text-slate-300 leading-relaxed whitespace-pre-wrap">{hoveredItem.descripcion}</p>
            </div>
          )}
          {!hoveredItem.descripcion && !hoveredItem.valor && (!hoveredItem.dano || hoveredItem.tipo !== 'arma') && (
            <p className="text-slate-500 italic text-xs">Sin detalles adicionales.</p>
          )}
        </div>
      </div>,
      document.body
    )}

    {extractingSubItem && alSacarSubItem && (
      <ModalExtraerItem 
        maxCantidad={extractingSubItem.subItem.cantidad || 1}
        nombreItem={extractingSubItem.subItem.nombre || 'Objeto'}
        alCerrar={() => setExtractingSubItem(null)}
        alConfirmar={(cantidad) => alSacarSubItem(extractingSubItem.contenedorId, extractingSubItem.subItem.id, cantidad)}
      />
    )}
    </>
  );
}
