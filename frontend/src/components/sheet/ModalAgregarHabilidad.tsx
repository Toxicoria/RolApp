import { useState } from 'react';
import { FormaArea } from '../../types';
import type { TipoFormaArea, Habilidad, Recurso, UsoRecurso, FormaRecurso, ColorRecurso } from '../../types';
import { Circle, Square, Triangle } from 'lucide-react';

const MAP_SHAPE: Record<FormaRecurso, any> = { circulo: Circle, cuadrado: Square, triangulo: Triangle };
const MAP_COLOR: Record<ColorRecurso, string> = { 
  verde: 'text-green-500 fill-current', 
  azul: 'text-blue-500 fill-current', 
  rojo: 'text-red-500 fill-current', 
  naranja: 'text-orange-500 fill-current', 
  amarillo: 'text-yellow-400 fill-current' 
};

interface Props {
  recursos?: Recurso[];
  alCerrar: () => void;
  alGuardar: (habilidad: Omit<Habilidad, 'id'>) => void;
}

export default function ModalAgregarHabilidad({ recursos, alCerrar, alGuardar }: Props) {
  const [nombre, setNombre] = useState('');
  const [dano, setDano] = useState('');
  const [forma, setForma] = useState<TipoFormaArea>(FormaArea.UNICO);
  const [alcance, setAlcance] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [usosRecursos, setUsosRecursos] = useState<UsoRecurso[]>([]);
  const [tipoHabilidad, setTipoHabilidad] = useState<'consume' | 'regenera'>('consume');
  const [usosPropios, setUsosPropios] = useState<number>(0);
  const [costoRecursoId, setCostoRecursoId] = useState<string>('');

  const handleToggleRecurso = (recursoId: string) => {
    setUsosRecursos(prev => {
      const exists = prev.find(u => u.recursoId === recursoId);
      if (exists) return prev.filter(u => u.recursoId !== recursoId);
      return [...prev, { recursoId }];
    });
  };

  const handleCambiarDanoRecurso = (recursoId: string, danoEsp: string) => {
    setUsosRecursos(prev => prev.map(u => u.recursoId === recursoId ? { ...u, danoEspecifico: danoEsp } : u));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usos = usosRecursos.map(u => ({ ...u, accion: tipoHabilidad }));
    const esRegeneradorAbierto = tipoHabilidad === 'regenera' && usos.length === 0;

    alGuardar({ 
      nombre, 
      valor: 0, 
      dano, 
      forma, 
      alcance, 
      descripcion, 
      usosRecursos: usos,
      esRegeneradorAbierto,
      usosMaximosPropios: usosPropios > 0 ? usosPropios : undefined,
      usosActualesPropios: usosPropios > 0 ? usosPropios : undefined,
      costoRecursoId: tipoHabilidad === 'regenera' && costoRecursoId ? costoRecursoId : undefined
    });
    alCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col scale-in-95 duration-200 max-h-[90vh]">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide">Nuevo Conjuro / Habilidad</h2>
          <button onClick={alCerrar} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>
        
        <div className="overflow-hidden flex-1 flex flex-col">
          <form id="hab-form" onSubmit={handleSubmit} className="flex flex-1 overflow-hidden h-[450px]">
            {/* Panel Izquierdo: Configuración Básica */}
            <div className="w-1/2 p-4 space-y-4 overflow-y-auto border-r border-slate-100 bg-white">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Nombre</label>
                <input required autoFocus type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-3 py-2 text-sm font-bold text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ej. Bola de Fuego" />
              </div>
              
              {tipoHabilidad === 'consume' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Daño / Cura (Base)</label>
                      <input type="text" value={dano} onChange={e => setDano(e.target.value)} className="w-full px-3 py-2 text-sm font-bold text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ej. 8d6 Fuego" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Alcance</label>
                      <input type="text" value={alcance} onChange={e => setAlcance(e.target.value)} className="w-full px-3 py-2 text-sm font-bold text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Ej. 60 pies" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Forma de Área</label>
                    <select value={forma} onChange={e => setForma(e.target.value as TipoFormaArea)} className="w-full px-3 py-2 text-sm font-bold text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
                      {Object.values(FormaArea).map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {tipoHabilidad === 'regenera' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-wide mb-1.5">Límite de usos propios (0 = infinito)</label>
                  <input type="number" min="0" value={usosPropios} onChange={e => setUsosPropios(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 text-sm font-bold text-slate-700 border border-emerald-200 bg-emerald-50/20 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                  <p className="text-[9px] text-slate-400 mt-1.5 font-medium leading-tight">Limita cuántas veces puedes usar esta habilidad para regenerar recursos.</p>
                </div>
              )}

              {tipoHabilidad === 'regenera' && recursos && recursos.length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide">Coste de Activación (Opcional)</label>
                  <p className="text-[9px] text-slate-400 mb-4 font-medium leading-tight mt-0.5">Selecciona si regenerar consume alguna acción.</p>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setCostoRecursoId('')}>
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${costoRecursoId === '' ? 'border-blue-500' : 'border-slate-300 group-hover:border-slate-400'}`}>
                        {costoRecursoId === '' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                      </div>
                      <span className="text-xs font-bold text-slate-700 flex-1">Ninguno</span>
                    </label>
                    {(() => {
                      const opcionesAccion = recursos.filter(r => r.nombre.toLowerCase().includes('accion') || r.nombre.toLowerCase().includes('acción'));
                      const aMostrar = opcionesAccion.length > 0 ? opcionesAccion : recursos;
                      return aMostrar.map(r => {
                        const Icon = MAP_SHAPE[r.forma || 'circulo'];
                        const colorClass = MAP_COLOR[r.color || 'azul'];
                        return (
                          <label key={r.id} className="flex items-center gap-2 cursor-pointer group" onClick={() => setCostoRecursoId(r.id)}>
                            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${costoRecursoId === r.id ? 'border-blue-500' : 'border-slate-300 group-hover:border-slate-400'}`}>
                              {costoRecursoId === r.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                            </div>
                            <span className="text-xs font-bold text-slate-700 flex-1">{r.nombre}</span>
                            <Icon size={14} fill="currentColor" className={colorClass} />
                          </label>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Descripción</label>
                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={4} className="w-full px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none" placeholder="Escribe los detalles de la habilidad..." />
              </div>
            </div>

            {/* Panel Derecho: Selección de Recursos */}
            <div className="w-1/2 p-4 bg-slate-50 overflow-y-auto flex flex-col">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-2">Interacción con Recursos</label>
              
              {/* Toggle Consume / Regenera */}
              <div className="flex bg-slate-200/50 p-1 rounded-lg mb-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setTipoHabilidad('consume')}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${tipoHabilidad === 'consume' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Gasta
                </button>
                <button
                  type="button"
                  onClick={() => setTipoHabilidad('regenera')}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${tipoHabilidad === 'regenera' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Regenera
                </button>
              </div>

              <p className="text-[10px] font-medium text-slate-400 mb-3 leading-relaxed">
                {tipoHabilidad === 'consume' 
                  ? 'Selecciona qué recursos se gastan al usar esta habilidad.'
                  : 'Selecciona qué recursos regenera. Si lo dejas vacío, te preguntará cuál regenerar al usarla.'}
              </p>
              
              {(!recursos || recursos.length === 0) ? (
                <div className="text-center py-8 opacity-50 border-2 border-dashed border-slate-300 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sin recursos</p>
                  <p className="text-xs text-slate-400 mt-1">Crea recursos primero.</p>
                </div>
              ) : (
                <div className="space-y-2 flex-1">
                  {recursos.map(r => {
                    const uso = usosRecursos.find(u => u.recursoId === r.id);
                    const isSelected = !!uso;
                    const Icon = MAP_SHAPE[r.forma || 'circulo'];
                    const colorClass = MAP_COLOR[r.color || 'azul'];
                    
                    const borderFocus = tipoHabilidad === 'consume' ? 'border-blue-400 ring-blue-50' : 'border-emerald-400 ring-emerald-50';
                    const bgFocus = tipoHabilidad === 'consume' ? 'bg-blue-500 border-blue-500' : 'bg-emerald-500 border-emerald-500';
                    
                    return (
                      <div key={r.id} className={`flex flex-col gap-2 p-2.5 rounded-xl border-2 transition-all duration-200 ${isSelected ? `${borderFocus} bg-white shadow-sm ring-4` : 'border-transparent hover:border-slate-200 hover:bg-slate-100 bg-white/50'}`}>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleToggleRecurso(r.id)}>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? `${bgFocus} text-white` : 'border-slate-300 bg-white'}`}>
                            {isSelected && <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                          </div>
                          <Icon size={16} strokeWidth={0} fill="currentColor" className={colorClass} />
                          <span className="text-sm font-bold text-slate-700 flex-1">{r.nombre || 'Sin nombre'}</span>
                        </div>
                        {isSelected && tipoHabilidad === 'consume' && (
                          <div className="pl-6 animate-in slide-in-from-top-2 fade-in duration-200">
                            <input 
                              type="text" 
                              value={uso.danoEspecifico || ''} 
                              onChange={e => handleCambiarDanoRecurso(r.id, e.target.value)} 
                              placeholder={`Daño con este recurso (Ej: ${dano || '8d6'})`} 
                              className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-700 border border-blue-200 bg-blue-50/50 rounded-lg outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:font-medium"
                            />
                          </div>
                        )}
                        {isSelected && tipoHabilidad === 'regenera' && (
                          <div className="pl-6 animate-in slide-in-from-top-2 fade-in duration-200">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+1 Uso al lanzar</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </form>
        </div>
        
        <div className="px-4 py-3 border-t border-slate-100 bg-white flex justify-end gap-2 shrink-0">
          <button type="button" onClick={alCerrar} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
          <button type="submit" form="hab-form" className="px-4 py-2 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-sm rounded-lg transition-colors cursor-pointer">Guardar Conjuro</button>
        </div>
      </div>
    </div>
  );
}
