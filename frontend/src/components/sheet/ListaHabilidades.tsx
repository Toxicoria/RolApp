import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Circle, Square, Triangle } from 'lucide-react';
import type { Habilidad, Recurso } from '../../types';

const MAP_SHAPE: Record<string, any> = { circulo: Circle, cuadrado: Square, triangulo: Triangle };
const MAP_COLOR: Record<string, string> = { 
  verde: 'text-green-500 fill-current', 
  azul: 'text-blue-500 fill-current', 
  rojo: 'text-red-500 fill-current', 
  naranja: 'text-orange-500 fill-current', 
  amarillo: 'text-yellow-400 fill-current' 
};

interface Props {
  habilidades: Habilidad[];
  alCambiar: (id: string, campo: keyof Habilidad, valor: string | number) => void;
  alEliminar: (id: string) => void;
  recursos?: Recurso[];
  alCambiarRecurso?: (id: string, campo: keyof Recurso, valor: number | string) => void;
}

type MenuMode = 'consume' | 'regenera_especifico' | 'regenera_abierto';

export default function ListaHabilidades({ habilidades, alEliminar, alCambiar, recursos, alCambiarRecurso }: Props) {
  const [toastMsg, setToastMsg] = useState<{ msg: string; err?: boolean } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hoveredHab, setHoveredHab] = useState<Habilidad | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [menuUsar, setMenuUsar] = useState<{ hab: Habilidad, x: number, y: number, modo: MenuMode } | null>(null);

  const mostrarMensaje = (msg: string, err: boolean = false) => {
    setToastMsg({ msg, err });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToastMsg(null), 4000);
  };

  const descontarUsoPropio = (hab: Habilidad) => {
    if (hab.usosMaximosPropios !== undefined && hab.usosActualesPropios !== undefined) {
      alCambiar(hab.id, 'usosActualesPropios', hab.usosActualesPropios - 1);
    }
  };

  const usarSimple = (hab: Habilidad, danoEsp?: string) => {
    descontarUsoPropio(hab);
    mostrarMensaje(`Has utilizado ${hab.nombre || 'una habilidad'}${danoEsp ? ` (${danoEsp})` : ''}`);
    setMenuUsar(null);
  };

  const usarRegenerando = (hab: Habilidad, recursoId: string) => {
    if (!recursos || !alCambiarRecurso) return usarSimple(hab);
    const r = recursos.find(rec => rec.id === recursoId);
    if (!r) return usarSimple(hab);

    if (r.actual >= r.maximo) {
      mostrarMensaje(`¡${r.nombre} ya está al máximo!`, true);
      return; // No descuenta uso propio si falla
    }
    
    let costo: Recurso | undefined;
    if (hab.costoRecursoId) {
      costo = recursos.find(rec => rec.id === hab.costoRecursoId);
      if (costo && costo.actual <= 0) {
        mostrarMensaje(`¡No te quedan usos de ${costo.nombre}!`, true);
        return;
      }
    }

    if (costo) {
      alCambiarRecurso(costo.id, 'actual', costo.actual - 1);
    }
    
    alCambiarRecurso(r.id, 'actual', r.actual + 1);
    descontarUsoPropio(hab);
    mostrarMensaje(`¡Recuperaste 1 ${r.nombre}!${costo ? ` (Costó 1 ${costo.nombre})` : ''}`);
    setMenuUsar(null);
  };

  const usarConRecurso = (hab: Habilidad, recursoId: string, danoEsp?: string) => {
    if (!recursos || !alCambiarRecurso) return usarSimple(hab, danoEsp);
    
    const r = recursos.find(rec => rec.id === recursoId);
    if (!r) return usarSimple(hab, danoEsp);

    if (r.actual <= 0) {
      mostrarMensaje(`¡No te quedan usos de ${r.nombre}!`, true);
      return; // No descuenta uso propio
    } 
    
    alCambiarRecurso(r.id, 'actual', r.actual - 1);
    descontarUsoPropio(hab);
    mostrarMensaje(`Gastaste 1 ${r.nombre} para usar ${hab.nombre}${danoEsp ? ` (${danoEsp})` : ''}`);
    setMenuUsar(null);
  };

  const handleUsarClick = (e: React.MouseEvent, hab: Habilidad) => {
    if (hab.usosMaximosPropios !== undefined && hab.usosActualesPropios !== undefined && hab.usosActualesPropios <= 0) {
      mostrarMensaje(`¡No te quedan usos de ${hab.nombre}!`, true);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    if (hab.esRegeneradorAbierto) {
      setMenuUsar({ hab, x: rect.left, y: rect.bottom + 5, modo: 'regenera_abierto' });
      return;
    }

    if (!hab.usosRecursos || hab.usosRecursos.length === 0) {
      usarSimple(hab);
      return;
    }

    const isRegenera = hab.usosRecursos[0].accion === 'regenera';

    if (hab.usosRecursos.length === 1) {
      if (isRegenera) usarRegenerando(hab, hab.usosRecursos[0].recursoId);
      else usarConRecurso(hab, hab.usosRecursos[0].recursoId, hab.usosRecursos[0].danoEspecifico);
      return;
    }

    setMenuUsar({ 
      hab, 
      x: rect.left, 
      y: rect.bottom + 5, 
      modo: isRegenera ? 'regenera_especifico' : 'consume' 
    });
  };

  return (
    <>
    <div className="overflow-y-auto no-scrollbar h-full p-3 flex flex-col relative">
      {habilidades.length === 0 ? (
        <div className="flex-1 flex items-center justify-center opacity-70">
          <span className="text-xs font-black text-slate-300 uppercase tracking-widest select-none">No hay nada aquí...</span>
        </div>
      ) : (
        <div className="space-y-1">
          {habilidades.map((hab) => {
            const usosIconos = hab.usosRecursos?.map(u => {
              const r = recursos?.find(rec => rec.id === u.recursoId);
              if (!r) return null;
              const Icon = MAP_SHAPE[r.forma || 'circulo'];
              return (
                <div key={r.id} className="relative group/pill">
                  <Icon size={10} className={MAP_COLOR[r.color || 'azul']} strokeWidth={0} fill="currentColor" />
                  {u.accion === 'regenera' && <span className="absolute -top-1 -right-1 text-[7px] text-emerald-500 font-black">+</span>}
                </div>
              );
            }).filter(Boolean);

            const usosPropiosVisual = hab.usosMaximosPropios !== undefined ? (
              <div className="flex gap-0.5 ml-2">
                {Array.from({ length: hab.usosMaximosPropios }).map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < (hab.usosActualesPropios || 0) ? 'bg-indigo-500 shadow-[0_0_2px_rgba(99,102,241,0.5)]' : 'bg-slate-200'}`} />
                ))}
              </div>
            ) : null;

            return (
              <div key={hab.id} className="py-2 border-b border-slate-100 last:border-0 group relative">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="flex-1 text-left font-bold text-sm truncate text-slate-700 cursor-help flex items-center gap-1.5"
                    onMouseMove={(e) => { setHoveredHab(hab); setMousePos({ x: e.clientX, y: e.clientY }); }}
                    onMouseLeave={() => setHoveredHab(null)}
                  >
                    {hab.nombre || <span className="text-gray-300 italic">Sin nombre...</span>}
                    {usosIconos && usosIconos.length > 0 && (
                      <div className="flex items-center gap-0.5 ml-1 opacity-60">
                        {usosIconos}
                      </div>
                    )}
                    {hab.esRegeneradorAbierto && (
                      <span className="text-[9px] font-black text-emerald-500 uppercase ml-1 px-1 py-0.5 bg-emerald-50 rounded">Regenera</span>
                    )}
                    {usosPropiosVisual}
                  </div>
                  
                  <button
                    onClick={(e) => handleUsarClick(e, hab)}
                    className={`px-2 py-0.5 text-[10px] font-black rounded uppercase shadow-sm transition-colors relative text-white ${
                      hab.usosMaximosPropios !== undefined && (hab.usosActualesPropios || 0) <= 0
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Usar
                  </button>
                  
                  <button onClick={() => alEliminar(hab.id)} className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>

    {/* Toast Message */}
    {toastMsg && typeof document !== 'undefined' && createPortal(
      <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 z-[100] text-sm font-bold border flex items-center gap-2 ${
        toastMsg.err ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-800 text-white border-slate-700'
      }`}>
        {!toastMsg.err && <Sparkles size={16} className={toastMsg.err ? 'text-red-500' : 'text-yellow-400'} />}
        {toastMsg.msg}
      </div>,
      document.body
    )}

    {/* Floating Menu */}
    {menuUsar && typeof document !== 'undefined' && createPortal(
      <>
        <div className="fixed inset-0 z-[9998]" onClick={() => setMenuUsar(null)} />
        <div 
          className="fixed z-[9999] bg-white border border-slate-200 p-1.5 rounded-xl shadow-xl flex flex-col gap-1 min-w-[140px] animate-in zoom-in-95 duration-150"
          style={{ top: menuUsar.y, left: Math.max(10, menuUsar.x - 100) }}
        >
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-wide px-2 py-1 text-center">
            {menuUsar.modo === 'consume' ? '¿Qué recurso gastar?' : '¿Qué recurso regenerar?'}
          </div>
          
          {menuUsar.modo === 'regenera_abierto' ? (
            // Modo abierto: Muestra todos los recursos
            recursos?.map(r => {
              const Icon = MAP_SHAPE[r.forma || 'circulo'];
              const colorClass = MAP_COLOR[r.color || 'azul'];
              const lleno = r.actual >= r.maximo;
              return (
                <button
                  key={r.id}
                  onClick={() => usarRegenerando(menuUsar.hab, r.id)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors border ${
                    lleno ? 'opacity-40 cursor-not-allowed bg-slate-50 border-transparent' : 'hover:bg-emerald-50 border-emerald-100 hover:border-emerald-200 cursor-pointer'
                  }`}
                >
                  <Icon size={12} fill="currentColor" className={colorClass} />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[11px] font-bold text-slate-700">{r.nombre}</span>
                    <span className="text-[9px] text-emerald-500 font-bold">+1 Uso</span>
                  </div>
                </button>
              );
            })
          ) : (
            // Modos específicos (consume o regenera)
            menuUsar.hab.usosRecursos?.map(uso => {
              const r = recursos?.find(rec => rec.id === uso.recursoId);
              if (!r) return null;
              const Icon = MAP_SHAPE[r.forma || 'circulo'];
              const colorClass = MAP_COLOR[r.color || 'azul'];
              
              const isConsume = menuUsar.modo === 'consume';
              const invalido = isConsume ? r.actual <= 0 : r.actual >= r.maximo;
              const hoverBg = isConsume ? 'hover:bg-slate-50' : 'hover:bg-emerald-50';
              const hoverBorder = isConsume ? 'hover:border-slate-200 border-slate-100' : 'hover:border-emerald-200 border-emerald-100';

              return (
                <button
                  key={uso.recursoId}
                  onClick={() => {
                    if (isConsume) usarConRecurso(menuUsar.hab, uso.recursoId, uso.danoEspecifico);
                    else usarRegenerando(menuUsar.hab, uso.recursoId);
                  }}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors border ${
                    invalido ? 'opacity-40 cursor-not-allowed bg-slate-50 border-transparent' : `${hoverBg} ${hoverBorder} cursor-pointer`
                  }`}
                >
                  <Icon size={12} fill="currentColor" className={colorClass} />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[11px] font-bold text-slate-700">{r.nombre}</span>
                    {isConsume && uso.danoEspecifico && <span className="text-[9px] text-red-500 font-bold">{uso.danoEspecifico}</span>}
                    {!isConsume && <span className="text-[9px] text-emerald-500 font-bold">+1 Uso</span>}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </>,
      document.body
    )}

    {/* Tooltip Hover */}
    {hoveredHab && !menuUsar && typeof document !== 'undefined' && createPortal(
      <div 
        className="fixed pointer-events-none z-[9999] bg-slate-900 text-slate-200 p-4 rounded-xl shadow-2xl border border-slate-700 w-72 backdrop-blur-sm bg-opacity-95"
        style={{ 
          top: mousePos.y > window.innerHeight - 250 ? mousePos.y - 200 : mousePos.y + 15,
          left: mousePos.x > window.innerWidth - 320 ? mousePos.x - 300 : mousePos.x + 15 
        }}
      >
        <div className="space-y-2 text-sm">
          {(hoveredHab.forma || hoveredHab.alcance) && (
            <div><span className="font-bold text-slate-400">Área:</span> {hoveredHab.forma ? hoveredHab.forma : ''} {hoveredHab.alcance ? `(${hoveredHab.alcance})` : ''}</div>
          )}
          {hoveredHab.dano && (
            <div><span className="font-bold text-slate-400">Daño Base:</span> <span className="text-red-400 font-bold">{hoveredHab.dano}</span></div>
          )}
          {hoveredHab.descripcion && (
            <div>
              <span className="font-bold text-slate-400">Descripción:</span>
              <p className="mt-1 text-slate-300 leading-relaxed whitespace-pre-wrap">{hoveredHab.descripcion}</p>
            </div>
          )}
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
