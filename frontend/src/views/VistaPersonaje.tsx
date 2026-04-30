import CabeceraPersonaje from '../components/sheet/CabeceraPersonaje';
import AtributosPrincipales from '../components/sheet/AtributosPrincipales';
import EstadisticasCombate from '../components/sheet/EstadisticasCombate';
import TiradasSalvacion from '../components/sheet/TiradasSalvacion';
import HabilidadesPersonaje from '../components/sheet/HabilidadesPersonaje';
import ListaHabilidades from '../components/sheet/ListaHabilidades';
import Inventario from '../components/sheet/Inventario';
import { usePersonaje } from '../hooks/usePersonaje';

export default function VistaPersonaje() {
  const { states, actions } = usePersonaje();

  return (
    <div className="h-screen flex flex-col bg-slate-100 p-2 md:p-4 gap-3 font-sans selection:bg-blue-100 overflow-hidden">

      {/* Cabecera */}
      <div className="flex-none">
        <CabeceraPersonaje datos={states.datosCabecera} alCambiar={actions.manejarCambioCabecera} />
      </div>

      {/* Cuerpo principal */}
      <div className="flex-1 flex flex-row gap-3 min-h-0">

        {/* Columna izquierda: Atributos + Tiradas + Habilidades de personaje */}
        <aside className="flex-none w-[120px] md:w-[172px] flex flex-col gap-3 overflow-y-auto overflow-x-hidden min-h-0 pr-0.5 no-scrollbar">
          <AtributosPrincipales datos={states.atributos} alCambiar={actions.manejarCambioAtributo} />
          <TiradasSalvacion
            tiradas={states.tiradas}
            alCambiar={actions.cambiarTirada}
            alAgregar={actions.agregarTirada}
            alEliminar={actions.eliminarTirada}
          />
          <HabilidadesPersonaje
            habilidades={states.skillsPersonaje}
            alCambiar={actions.cambiarSkill}
            alAgregar={actions.agregarSkill}
            alEliminar={actions.eliminarSkill}
          />
        </aside>

        {/* Columna central: Stats de combate + Zonas + Notas */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <div className="flex-none">
            <EstadisticasCombate datos={states.combate} alActualizarValor={actions.actualizarValorCombate} />
          </div>

          <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto no-scrollbar">
            {/* Separador de sección */}
            <div className="flex items-center gap-2 flex-none">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter whitespace-nowrap">Notas</span>
              <div className="flex-1 h-px bg-slate-200" />
              <button onClick={actions.agregarZona} className="btn-add" title="Añadir zona de texto">+</button>
            </div>

            {/* Zonas de texto */}
            {states.zonas.map(zona => (
              <div key={zona.id} className="sheet-card flex-none flex flex-col">
                <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100">
                  <input
                    value={zona.titulo}
                    onChange={(e) => actions.cambiarZona(zona.id, 'titulo', e.target.value)}
                    placeholder="Título..."
                    className="text-[10px] font-black uppercase text-slate-500 tracking-tighter bg-transparent outline-none flex-1 min-w-0"
                  />
                  <button
                    onClick={() => actions.eliminarZona(zona.id)}
                    className="text-slate-200 hover:text-red-400 transition-colors text-xs ml-2 shrink-0"
                  >✕</button>
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
        </div>

        {/* Columna derecha: Conjuros/Acciones + Inventario */}
        <div className="flex-none w-72 md:w-80 flex flex-col gap-3 overflow-y-auto min-h-0">
          <ListaHabilidades
            habilidades={states.habilidades}
            alCambiar={actions.cambiarHabilidad}
            alAgregar={actions.agregarHabilidad}
            alEliminar={actions.eliminarHabilidad}
          />
          <Inventario
            items={states.inventario}
            alCambiarItem={actions.cambiarItem}
            alAgregarItem={actions.agregarItem}
            alEliminarItem={actions.eliminarItem}
            alAgregarSubItem={actions.agregarSubItem}
            alCambiarSubItem={actions.cambiarSubItem}
            alEliminarSubItem={actions.eliminarSubItem}
          />
        </div>

      </div>
    </div>
  );
}
