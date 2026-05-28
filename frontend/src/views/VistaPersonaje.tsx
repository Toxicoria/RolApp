import { useState, useRef, useMemo } from 'react';
import { GridLayout, useContainerWidth, verticalCompactor } from 'react-grid-layout';
import type { LayoutItem, ResizeHandleAxis } from 'react-grid-layout';

const COLS = 12;
const ROW_H = 38, M_H = 8, HEADER_PX = 31;

// Converts content pixel height → minimum grid units needed to show it all
function pxToH(px: number): number {
  return Math.max(2, Math.ceil((px + M_H) / (ROW_H + M_H)));
}

import { ChevronDown } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import CabeceraPersonaje from '../components/sheet/CabeceraPersonaje';
import AtributosPrincipales from '../components/sheet/AtributosPrincipales';
import EstadisticasCombate from '../components/sheet/EstadisticasCombate';
import TiradasSalvacion from '../components/sheet/TiradasSalvacion';
import HabilidadesPersonaje from '../components/sheet/HabilidadesPersonaje';
import ListaHabilidades from '../components/sheet/ListaHabilidades';
import Inventario from '../components/sheet/Inventario';
import ModalAgregarHabilidad from '../components/sheet/ModalAgregarHabilidad';
import ModalAgregarItem from '../components/sheet/ModalAgregarItem';
import { usePersonaje } from '../hooks/usePersonaje';

// h inicial: justo para mostrar el contenido por defecto (6 tiradas, 16 skills)
const LAYOUT_INICIAL: LayoutItem[] = [
  { i: 'atributos',   x: 0, y: 0,  w: 2, h: 8,  minW: 1, minH: 1 },
  { i: 'tiradas',     x: 0, y: 8,  w: 2, h: 4,  minW: 1, minH: 1 },
  { i: 'habilidades', x: 0, y: 12, w: 2, h: 10, minW: 1, minH: 1 },
  { i: 'combate',     x: 2, y: 0,  w: 7, h: 4,  minW: 3, minH: 1 },
  { i: 'conjuros',    x: 9, y: 0,  w: 3, h: 5,  minW: 2, minH: 1 },
  { i: 'inventario',  x: 9, y: 5,  w: 3, h: 5,  minW: 2, minH: 1 },
  { i: 'notas',       x: 9, y: 10, w: 3, h: 5,  minW: 2, minH: 1 },
];

// ── Tarjeta con header unificado (drag + colapso + acciones) ──────────────
interface TarjetaGridProps {
  titulo: string;
  colapsada: boolean;
  onToggleColapso: () => void;
  onAgregar?: () => void;
  children: React.ReactNode;
}

function TarjetaGrid({ titulo, colapsada, onToggleColapso, onAgregar, children }: TarjetaGridProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      {/* Header: drag handle + colapso + título + acciones */}
      <div className="drag-handle flex items-center gap-1 px-3 py-2 border-b border-slate-100 flex-shrink-0 cursor-grab active:cursor-grabbing select-none">
        <button
          onClick={onToggleColapso}
          onPointerDown={e => e.stopPropagation()}
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
        {onAgregar && (
          <button
            onClick={onAgregar}
            onPointerDown={e => e.stopPropagation()}
            className="flex-shrink-0 text-[9px] font-black text-blue-400 hover:text-blue-600 transition-colors cursor-pointer leading-none px-0.5"
          >+</button>
        )}
      </div>
      {/* Contenido */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function VistaPersonaje() {
  const { states, actions } = usePersonaje();
  const [layout, setLayout] = useState<LayoutItem[]>(LAYOUT_INICIAL);
  const { width, containerRef } = useContainerWidth({ initialWidth: 1280 });

  const [modalHabilidadAbierto, setModalHabilidadAbierto] = useState(false);
  const [modalInventarioAbierto, setModalInventarioAbierto] = useState(false);

  // Estado de colapso por tarjeta
  const [collapsados, setCollapsados] = useState<Set<string>>(new Set());
  const alturasGuardadas = useRef<Map<string, number>>(new Map());
  const arrastrando = useRef(false);

  // maxH por tarjeta: px de contenido → unidades de grid
  const maxHMap = useMemo(() => {
    const n = (arr: unknown[]) => arr.length;
    const filaLista = 24; // py-1 + text-xs ~24px por fila
    const filaCon = 58;   // p-2 + h-8 + space-y-2 por item de lista
    const invItemH = (item: { esContenedor?: boolean; contenido?: unknown[] }) =>
      60 + (item.esContenedor ? 28 + (item.contenido?.length ?? 0) * 36 : 0);
    const invTotal = states.inventario.reduce((acc, it) => acc + invItemH(it) + 12, 0) - 12;
    return {
      atributos:   8,
      combate:     4,
      tiradas:     pxToH(HEADER_PX + n(states.tiradas)         * filaLista),
      habilidades: pxToH(HEADER_PX + n(states.skillsPersonaje) * filaLista),
      conjuros:    pxToH(HEADER_PX + 24 + Math.max(0, n(states.habilidades) * filaCon - 8)),
      inventario:  pxToH(HEADER_PX + 24 + Math.max(0, invTotal)),
    } as Record<string, number>;
  }, [states.tiradas, states.skillsPersonaje, states.habilidades, states.inventario]);

  // toggleColapso se define después de maxHMap para poder leerlo del closure
  const toggleColapso = (id: string) => {
    if (arrastrando.current) return;
    const item = layout.find(l => l.i === id);
    if (!item) return;
    if (collapsados.has(id)) {
      const raw = alturasGuardadas.current.get(id) ?? 5;
      const h = Math.min(raw, maxHMap[id] ?? raw);
      setLayout(prev => prev.map(l => l.i === id ? { ...l, h } : l));
      setCollapsados(prev => { const s = new Set(prev); s.delete(id); return s; });
    } else {
      alturasGuardadas.current.set(id, item.h);
      setLayout(prev => prev.map(l => l.i === id ? { ...l, h: 1 } : l));
      setCollapsados(prev => new Set([...prev, id]));
    }
  };

  const col = (id: string) => collapsados.has(id);

  const layoutConHandles = useMemo(() =>
    layout.map(item => {
      if (collapsados.has(item.i)) {
        return { ...item, isResizable: false, resizeHandles: [] as ResizeHandleAxis[] };
      }
      const handles: ResizeHandleAxis[] = ['s'];
      if (item.x > 0) handles.push('w', 'sw');
      if (item.x + item.w < COLS) handles.push('e', 'se');
      const maxH = maxHMap[item.i];
      const h = maxH !== undefined ? Math.min(item.h, maxH) : item.h;
      return { ...item, h, resizeHandles: handles, ...(maxH !== undefined ? { maxH } : {}) };
    }), [layout, collapsados, maxHMap]);

  return (
    <div className="h-screen flex flex-col bg-slate-100 pt-2 px-2 md:pt-4 md:px-4 gap-3 font-sans selection:bg-blue-100 overflow-hidden">

      <div className="flex-none">
        <CabeceraPersonaje datos={states.datosCabecera} alCambiar={actions.manejarCambioCabecera} />
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
        <GridLayout
          width={width}
          layout={layoutConHandles}
          onLayoutChange={(newLayout) => setLayout(newLayout.map(item => {
            const max = maxHMap[item.i];
            return max !== undefined && item.h > max ? { ...item, h: max } : { ...item };
          }))}
          gridConfig={{ cols: 12, rowHeight: 38, margin: [8, 8], containerPadding: [0, 0], maxRows: Infinity }}
          dragConfig={{ enabled: true, handle: '.drag-handle' }}
          resizeConfig={{ handles: ['s', 'e', 'se', 'w', 'sw'] }}
          compactor={verticalCompactor}
          onDragStart={() => { arrastrando.current = true; }}
          onDragStop={() => { setTimeout(() => { arrastrando.current = false; }, 0); }}
        >

          <div key="atributos">
            <TarjetaGrid titulo="Atributos" colapsada={col('atributos')} onToggleColapso={() => toggleColapso('atributos')}>
              <AtributosPrincipales datos={states.atributos} alCambiar={actions.manejarCambioAtributo} />
            </TarjetaGrid>
          </div>

          <div key="tiradas">
            <TarjetaGrid titulo="Tiradas de Salvación" colapsada={col('tiradas')} onToggleColapso={() => toggleColapso('tiradas')} onAgregar={actions.agregarTirada}>
              <TiradasSalvacion
                tiradas={states.tiradas}
                atributos={states.atributos}
                nivel={states.datosCabecera.nivel}
                alCambiar={actions.cambiarTirada}
                alToggleCompetencia={actions.toggleCompetenciaTirada}
                alEliminar={actions.eliminarTirada}
              />
            </TarjetaGrid>
          </div>

          <div key="habilidades">
            <TarjetaGrid titulo="Habilidades" colapsada={col('habilidades')} onToggleColapso={() => toggleColapso('habilidades')} onAgregar={actions.agregarSkill}>
              <HabilidadesPersonaje
                habilidades={states.skillsPersonaje}
                atributos={states.atributos}
                nivel={states.datosCabecera.nivel}
                alCambiar={actions.cambiarSkill}
                alCiclarCompetencia={actions.ciclarCompetenciaSkill}
                alEliminar={actions.eliminarSkill}
              />
            </TarjetaGrid>
          </div>

          <div key="combate">
            <TarjetaGrid titulo="Combate" colapsada={col('combate')} onToggleColapso={() => toggleColapso('combate')}>
              <div className="p-2 h-full overflow-hidden">
                <EstadisticasCombate datos={states.combate} alActualizarValor={actions.actualizarValorCombate} />
              </div>
            </TarjetaGrid>
          </div>

          <div key="notas">
            <TarjetaGrid titulo="Notas" colapsada={col('notas')} onToggleColapso={() => toggleColapso('notas')} onAgregar={actions.agregarZona}>
              <div className="flex-1 h-full overflow-y-auto no-scrollbar flex flex-col gap-2 p-2">
                {states.zonas.map(zona => (
                  <div key={zona.id} className="sheet-card flex-none flex flex-col">
                    <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100">
                      <input
                        value={zona.titulo}
                        onChange={(e) => actions.cambiarZona(zona.id, 'titulo', e.target.value)}
                        placeholder="Título..."
                        className="text-[10px] font-black uppercase text-slate-500 tracking-tighter bg-transparent outline-none flex-1 min-w-0"
                      />
                      <button onClick={() => actions.eliminarZona(zona.id)} className="text-slate-200 hover:text-red-400 transition-colors text-xs ml-2 shrink-0">✕</button>
                    </div>
                    <textarea
                      value={zona.contenido}
                      onChange={(e) => actions.cambiarZona(zona.id, 'contenido', e.target.value)}
                      placeholder="Escribe aquí..."
                      className="w-full p-4 text-sm text-slate-700 bg-transparent outline-none resize-none min-h-28"
                    />
                  </div>
                ))}
              </div>
            </TarjetaGrid>
          </div>

          <div key="conjuros">
            <TarjetaGrid titulo="Habilidades y Conjuros" colapsada={col('conjuros')} onToggleColapso={() => toggleColapso('conjuros')} onAgregar={() => setModalHabilidadAbierto(true)}>
              <ListaHabilidades
                habilidades={states.habilidades}
                alCambiar={actions.cambiarHabilidad}
                alEliminar={actions.eliminarHabilidad}
              />
            </TarjetaGrid>
          </div>

          <div key="inventario">
            <TarjetaGrid titulo="Inventario" colapsada={col('inventario')} onToggleColapso={() => toggleColapso('inventario')} onAgregar={() => setModalInventarioAbierto(true)}>
              <Inventario
                items={states.inventario}
                alCambiarItem={actions.cambiarItem}
                alEliminarItem={actions.eliminarItem}
                alAgregarSubItem={actions.agregarSubItem}
                alCambiarSubItem={actions.cambiarSubItem}
                alEliminarSubItem={actions.eliminarSubItem}
              />
            </TarjetaGrid>
          </div>

        </GridLayout>
      </div>

      {modalHabilidadAbierto && (
        <ModalAgregarHabilidad
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
    </div>
  );
}
