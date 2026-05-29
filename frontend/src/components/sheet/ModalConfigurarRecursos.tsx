import { useState } from 'react';
import { Circle, Square, Triangle, Trash2, Plus } from 'lucide-react';
import type { Recurso, FormaRecurso, ColorRecurso } from '../../types';

const FORMAS: { id: FormaRecurso; icon: any }[] = [
  { id: 'circulo', icon: Circle },
  { id: 'cuadrado', icon: Square },
  { id: 'triangulo', icon: Triangle },
];

const COLORES: { id: ColorRecurso; claseBg: string; claseRing: string }[] = [
  { id: 'verde', claseBg: 'bg-green-500', claseRing: 'ring-green-500' },
  { id: 'azul', claseBg: 'bg-blue-500', claseRing: 'ring-blue-500' },
  { id: 'rojo', claseBg: 'bg-red-500', claseRing: 'ring-red-500' },
  { id: 'naranja', claseBg: 'bg-orange-500', claseRing: 'ring-orange-500' },
  { id: 'amarillo', claseBg: 'bg-yellow-400', claseRing: 'ring-yellow-400' },
];

const MAP_SHAPE: Record<FormaRecurso, any> = {
  circulo: Circle,
  cuadrado: Square,
  triangulo: Triangle,
};

const MAP_COLOR: Record<ColorRecurso, string> = {
  verde: 'text-green-500 fill-current',
  azul: 'text-blue-500 fill-current',
  rojo: 'text-red-500 fill-current',
  naranja: 'text-orange-500 fill-current',
  amarillo: 'text-yellow-400 fill-current',
};

interface Props {
  recursos: Recurso[];
  onClose: () => void;
  onSave: (recurso: Recurso) => void;
  onRemove: (id: string) => void;
}

const NUEVO_RECURSO = (): Recurso => ({
  id: crypto.randomUUID(),
  nombre: '',
  maximo: 1,
  actual: 1,
  forma: 'circulo',
  color: 'azul'
});

export default function ModalConfigurarRecursos({ recursos, onClose, onSave, onRemove }: Props) {
  const [draft, setDraft] = useState<Recurso>(NUEVO_RECURSO());

  const handleSave = () => {
    if (!draft.nombre.trim()) return;
    onSave(draft);
    setDraft(NUEVO_RECURSO());
  };
  
  const handleRemove = (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el recurso "${nombre || 'Sin nombre'}"?`)) {
      onRemove(id);
      if (draft.id === id) setDraft(NUEVO_RECURSO());
    }
  };

  const isLimitReached = recursos.length >= 10;
  const isEditing = recursos.some(r => r.id === draft.id);
  const isFormDisabled = !isEditing && isLimitReached;

  const renderDotsPreview = (recurso: Recurso) => {
    const Icon = MAP_SHAPE[recurso.forma || 'circulo'];
    const colorClass = MAP_COLOR[recurso.color || 'azul'];
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: Math.min(3, recurso.maximo || 1) }).map((_, i) => (
          <Icon key={i} size={10} strokeWidth={0} className={colorClass} />
        ))}
        {(recurso.maximo || 1) > 3 && <span className="text-[9px] text-slate-400 ml-0.5 font-bold">+{recurso.maximo - 3}</span>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col scale-in-95 duration-200">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide">Configurar Recursos</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>

        {/* Body Split */}
        <div className="flex h-[400px]">
          {/* Panel Izquierdo: Lista de Recursos */}
          <div className="w-1/2 border-r border-slate-100 flex flex-col">
            <div className="px-3 py-2 border-b border-slate-50 bg-slate-50 flex justify-between items-center shrink-0">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">
                Mis Recursos ({recursos.length}/10)
              </span>
              <button 
                onClick={() => setDraft(NUEVO_RECURSO())} 
                disabled={isLimitReached}
                className={`p-1 rounded transition-colors ${isLimitReached ? 'text-slate-300' : 'text-blue-500 hover:bg-blue-50'}`}
                title="Nuevo Recurso"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {recursos.length === 0 ? (
                <div className="text-center py-8 opacity-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sin recursos</p>
                </div>
              ) : (
                recursos.map(r => (
                  <div 
                    key={r.id} 
                    onClick={() => setDraft({ ...r })}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer group transition-colors ${
                      draft.id === r.id ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-700 truncate pr-2">
                        {r.nombre || 'Sin nombre'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {renderDotsPreview(r)}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemove(r.id, r.nombre); }} 
                        className="text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all ml-1 p-0.5 rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel Derecho: Formulario */}
          <div className="w-1/2 flex flex-col bg-white relative">
            {isFormDisabled ? (
              <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Límite Alcanzado</p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Has alcanzado el máximo de 10 recursos. Elimina alguno de la lista para crear uno nuevo.</p>
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-slate-50 bg-slate-50 shrink-0">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-wide">
                    {isEditing ? 'Editar Recurso' : 'Nuevo Recurso'}
                  </span>
                </div>
                
                <div className="flex-1 overflow-hidden p-4 space-y-4 flex flex-col justify-center">
                  <div className="grid grid-cols-[1fr_80px] gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5">Nombre</label>
                      <input
                        type="text"
                        value={draft.nombre}
                        onChange={(e) => setDraft({ ...draft, nombre: e.target.value })}
                        placeholder="Ej: Ki"
                        className="w-full px-3 py-2 text-sm font-bold text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5 text-center">Máx.</label>
                      <input
                        type="number"
                        min="1"
                        value={draft.maximo || 1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          let newActual = draft.actual;
                          if (draft.actual > val) newActual = val;
                          if (!isEditing) newActual = val;
                          setDraft({ ...draft, maximo: val, actual: newActual });
                        }}
                        className="w-full text-center px-3 py-2 text-sm font-bold text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5">Forma del Icono</label>
                    <div className="flex gap-2">
                      {FORMAS.map(({ id, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setDraft({ ...draft, forma: id })}
                          className={`flex-1 p-2 flex justify-center items-center rounded-lg border-2 transition-colors ${
                            draft.forma === id 
                              ? 'border-blue-500 bg-blue-50 text-blue-500' 
                              : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                          }`}
                          title={id}
                        >
                          <Icon size={18} strokeWidth={0} fill="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5">Color</label>
                    <div className="flex justify-between">
                      {COLORES.map(({ id, claseBg, claseRing }) => (
                        <button
                          key={id}
                          onClick={() => setDraft({ ...draft, color: id })}
                          className={`w-7 h-7 rounded-full transition-all ${claseBg} ${
                            draft.color === id 
                              ? `ring-4 ring-offset-2 ${claseRing} scale-110` 
                              : 'opacity-50 hover:opacity-100 hover:scale-110'
                          }`}
                          title={id}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
                  <button
                    onClick={() => setDraft(NUEVO_RECURSO())}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!draft.nombre.trim()}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
                  >
                    {isEditing ? 'Guardar Cambios' : 'Agregar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
