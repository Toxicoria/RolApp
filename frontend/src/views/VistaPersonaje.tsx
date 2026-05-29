import { useState } from 'react';
import { ChevronDown, Plus, Pen, X } from 'lucide-react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';

import AtributosPrincipales from '../components/sheet/AtributosPrincipales';
import EstadisticasCombate from '../components/sheet/EstadisticasCombate';
import TiradasSalvacion from '../components/sheet/TiradasSalvacion';
import HabilidadesPersonaje from '../components/sheet/HabilidadesPersonaje';
import ListaHabilidades from '../components/sheet/ListaHabilidades';
import Inventario from '../components/sheet/Inventario';
import ModalAgregarHabilidad from '../components/sheet/ModalAgregarHabilidad';
import ModalAgregarItem from '../components/sheet/ModalAgregarItem';
import CabeceraPersonaje from '../components/sheet/CabeceraPersonaje';
import MapaCompartido from '../components/sheet/MapaCompartido';
import RecursosPersonaje from '../components/sheet/RecursosPersonaje';
import ModalConfigurarRecursos from '../components/sheet/ModalConfigurarRecursos';
import { usePersonaje } from '../hooks/usePersonaje';

// ── Tarjeta Unificada ──────────────
interface TarjetaProps {
  titulo: string;
  colapsada?: boolean;
  onToggleColapso?: () => void;
  onAgregar?: () => void;
  onConfig?: () => void;
  children: React.ReactNode;
}

function Tarjeta({ titulo, colapsada = false, onToggleColapso, onAgregar, onConfig, children }: TarjetaProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden shrink-0 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 flex-shrink-0 select-none bg-slate-50/30">
        {onToggleColapso ? (
          <button
            onClick={onToggleColapso}
            className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer group/titulo"
            title={colapsada ? 'Expandir' : 'Colapsar'}
          >
            <ChevronDown
              size={11}
              className={`flex-shrink-0 transition-transform duration-200 text-slate-300 group-hover/titulo:text-blue-400 ${colapsada ? '-rotate-90' : ''}`}
            />
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wide truncate transition-colors group-hover/titulo:text-slate-600">
              {titulo}
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wide truncate pl-1">
              {titulo}
            </span>
          </div>
        )}
        {onConfig && (
          <button
            onClick={onConfig}
            className="flex-shrink-0 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-0.5 rounded hover:bg-slate-100 mr-1"
            title="Configurar"
          >
            <Pen size={12} strokeWidth={2.5} />
          </button>
        )}
        {onAgregar && (
          <button
            onClick={onAgregar}
            className="flex-shrink-0 text-blue-400 hover:text-blue-600 transition-colors cursor-pointer p-0.5 rounded hover:bg-blue-50"
            title="Agregar"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        )}
      </div>
      {/* Contenido */}
      {!colapsada && (
        <div className="flex-1 overflow-visible">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Divisor (Gutter) Arrastrable ──────────────
const Gutter = () => (
  <PanelResizeHandle className="w-2 relative flex items-center justify-center group cursor-col-resize shrink-0 z-10 transition-all">
    <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-blue-400/10 transition-colors rounded" />
    <div className="w-0.5 h-8 bg-slate-200 group-hover:bg-blue-400 transition-colors rounded-full" />
  </PanelResizeHandle>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function VistaPersonaje() {
  const { states, actions } = usePersonaje();

  const [modalHabilidadAbierto, setModalHabilidadAbierto] = useState(false);
  const [modalInventarioAbierto, setModalInventarioAbierto] = useState(false);
  const [modalRecursosAbierto, setModalRecursosAbierto] = useState(false);

  // Estado de colapso por tarjeta
  const [collapsados, setCollapsados] = useState<Set<string>>(new Set(['conjuros', 'inventario', 'notas', 'mapa']));

  const toggleColapso = (id: string) => {
    setCollapsados(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const col = (id: string) => collapsados.has(id);

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10 shadow-sm relative">
        <div className="flex-1 min-w-0">
          <CabeceraPersonaje datos={states.datosCabecera} alCambiar={actions.manejarCambioCabecera} />
        </div>
      </div>

      {/* Main Layout con Paneles */}
      <div className="flex-1 overflow-hidden p-3 h-full">
        <PanelGroup orientation="horizontal" className="h-full w-full" id="rolapp_panels">
          
          {/* PANEL 1: Atributos, Tiradas, Habilidades */}
          <Panel defaultSize={30} minSize={20} className="flex flex-col gap-3 overflow-y-auto no-scrollbar pb-12 pr-1">
            <Tarjeta titulo="Atributos" colapsada={col('atributos')} onToggleColapso={() => toggleColapso('atributos')}>
              <AtributosPrincipales datos={states.atributos} alCambiar={actions.manejarCambioAtributo} />
            </Tarjeta>

            <Tarjeta titulo="Tiradas de Salvación" colapsada={col('tiradas')} onToggleColapso={() => toggleColapso('tiradas')} onAgregar={actions.agregarTirada}>
              <TiradasSalvacion
                tiradas={states.tiradas}
                atributos={states.atributos}
                nivel={states.datosCabecera.nivel}
                alCambiar={actions.cambiarTirada}
                alToggleCompetencia={actions.toggleCompetenciaTirada}
                alEliminar={actions.eliminarTirada}
              />
            </Tarjeta>

            <Tarjeta titulo="Habilidades" colapsada={col('habilidades')} onToggleColapso={() => toggleColapso('habilidades')} onAgregar={actions.agregarSkill}>
              <HabilidadesPersonaje
                habilidades={states.skillsPersonaje}
                atributos={states.atributos}
                nivel={states.datosCabecera.nivel}
                alCambiar={actions.cambiarSkill}
                alCiclarCompetencia={actions.ciclarCompetenciaSkill}
                alEliminar={actions.eliminarSkill}
                recursos={states.recursos}
                alCambiarRecurso={actions.cambiarRecurso}
              />
            </Tarjeta>
          </Panel>

          <Gutter />

          {/* PANEL 2: Combate, Mapa, Conjuros */}
          <Panel defaultSize={40} minSize={30} className="flex flex-col gap-3 overflow-y-auto no-scrollbar pb-12 px-1">
            <Tarjeta titulo="Combate" colapsada={col('combate')} onToggleColapso={() => toggleColapso('combate')}>
              <div className="p-2">
                <EstadisticasCombate datos={states.combate} alActualizarValor={actions.actualizarValorCombate} />
              </div>
            </Tarjeta>

            <Tarjeta titulo="Mapa Compartido" colapsada={col('mapa')} onToggleColapso={() => toggleColapso('mapa')}>
              <div className="p-2 h-[300px]">
                <MapaCompartido />
              </div>
            </Tarjeta>

            <Tarjeta titulo="Habilidades y Conjuros" colapsada={col('conjuros')} onToggleColapso={() => toggleColapso('conjuros')} onAgregar={() => setModalHabilidadAbierto(true)}>
              <ListaHabilidades
                habilidades={states.habilidades}
                alCambiar={actions.cambiarHabilidad}
                alEliminar={actions.eliminarHabilidad}
                recursos={states.recursos}
                alCambiarRecurso={actions.cambiarRecurso}
              />
            </Tarjeta>
          </Panel>

          <Gutter />

          {/* PANEL 3: Recursos, Inventario, Notas */}
          <Panel defaultSize={30} minSize={20} className="flex flex-col gap-3 overflow-y-auto no-scrollbar pb-12 pl-1">
            <Tarjeta 
              titulo="Recursos y Acciones" 
              colapsada={col('recursos')} 
              onToggleColapso={() => toggleColapso('recursos')}
              onConfig={() => setModalRecursosAbierto(true)}
            >
              <RecursosPersonaje 
                recursos={states.recursos} 
                alCambiar={actions.cambiarRecurso} 
                alReordenar={actions.reordenarRecursos}
              />
            </Tarjeta>

            <Tarjeta titulo="Inventario" colapsada={col('inventario')} onToggleColapso={() => toggleColapso('inventario')} onAgregar={() => setModalInventarioAbierto(true)}>
              <Inventario
                items={states.inventario}
                alCambiarItem={actions.cambiarItem}
                alEliminarItem={actions.eliminarItem}
                alCambiarSubItem={actions.cambiarSubItem}
                alEliminarSubItem={actions.eliminarSubItem}
                alMoverItemAContenedor={actions.moverItemAContenedor}
                alSacarSubItem={actions.sacarSubItem}
              />
            </Tarjeta>

            <Tarjeta titulo="Notas" colapsada={col('notas')} onToggleColapso={() => toggleColapso('notas')} onAgregar={actions.agregarZona}>
              <div className="flex flex-col gap-2 p-2">
                {states.zonas.length === 0 ? (
                  <div className="py-8 text-center opacity-70 border-2 border-dashed border-slate-200 rounded-lg">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest select-none">No hay nada aquí...</span>
                  </div>
                ) : (
                  states.zonas.map(zona => (
                    <div key={zona.id} className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col min-h-[160px] overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/50 flex-none">
                        <input
                          value={zona.titulo}
                          onChange={(e) => actions.cambiarZona(zona.id, 'titulo', e.target.value)}
                          placeholder="Título..."
                          className="text-[10px] font-black uppercase text-slate-500 tracking-tighter bg-transparent outline-none flex-1 min-w-0"
                        />
                        <button onClick={() => actions.eliminarZona(zona.id)} className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-slate-200 ml-2 shrink-0">
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                      <textarea
                        value={zona.contenido}
                        onChange={(e) => actions.cambiarZona(zona.id, 'contenido', e.target.value)}
                        placeholder="Escribe aquí..."
                        className="w-full p-3 text-sm text-slate-700 bg-transparent outline-none resize-none flex-1 min-h-[120px]"
                      />
                    </div>
                  ))
                )}
              </div>
            </Tarjeta>
          </Panel>
        </PanelGroup>
      </div>

      {/* Modales */}
      {modalHabilidadAbierto && (
        <ModalAgregarHabilidad
          recursos={states.recursos}
          alCerrar={() => setModalHabilidadAbierto(false)}
          alGuardar={actions.agregarHabilidad}
        />
      )}

      {modalInventarioAbierto && (
        <ModalAgregarItem
          alCerrar={() => setModalInventarioAbierto(false)}
          alGuardar={actions.agregarItem}
        />
      )}

      {modalRecursosAbierto && (
        <ModalConfigurarRecursos
          recursos={states.recursos}
          onClose={() => setModalRecursosAbierto(false)}
          onSave={actions.guardarRecurso}
          onRemove={actions.eliminarRecurso}
        />
      )}
    </div>
  );
}
