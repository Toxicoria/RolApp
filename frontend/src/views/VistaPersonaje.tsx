// src/views/VistaPersonaje.tsx
import { useState, type ChangeEvent } from 'react';
import CabeceraPersonaje from '../components/sheet/CabeceraPersonaje';
import AtributosPrincipales from '../components/sheet/AtributosPrincipales';
import EstadisticasCombate from '../components/sheet/EstadisticasCombate';
import ListaHabilidades from '../components/sheet/ListaHailidades';
import Inventario from '../components/sheet/Inventario';
import { 
  type DatosCabecera, 
  type Atributos, 
  type EstadisticasCombate as TipoCombate, 
  type Habilidad, 
  type ItemInventario,
  type SubItem,
  FormaArea 
} from '../types';

export default function VistaPersonaje() {
  // --- ESTADOS ---

  const [datosCabecera, setDatosCabecera] = useState<DatosCabecera>({
    nombre: '', trasfondo: '', clase: '', subclase: '', raza: '', nivel: 1, experiencia: 0,
  });

  const [atributos, setAtributos] = useState<Atributos>({
    fuerza: 10, destreza: 10, constitucion: 10, inteligencia: 10, sabiduria: 10, carisma: 10,
  });

  const [combate, setCombate] = useState<TipoCombate>({
    ca: 10, iniciativa: 0, velocidad: 9, vidaMaxima: 10, vidaActual: 10, vidaTemporal: 0
  });

  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  
  const [inventario, setInventario] = useState<ItemInventario[]>([]);

  // --- MANEJADORES DE CABECERA, ATRIBUTOS Y COMBATE ---

  const manejarCambioCabecera = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosCabecera((prev: DatosCabecera) => ({ 
      ...prev, [name]: name === 'nivel' || name === 'experiencia' ? Number(value) : value 
    }));
  };

  const manejarCambioAtributo = (nombre: keyof Atributos, valor: number) => {
    setAtributos((prev: Atributos) => ({ ...prev, [nombre]: valor }));
  };

  const manejarCambioCombate = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCombate((prev: TipoCombate) => ({ ...prev, [name]: Number(value) }));
  };

  // --- MANEJADORES DE HABILIDADES ---

  const agregarHabilidad = () => {
    const nueva: Habilidad = { 
      id: crypto.randomUUID(), 
      nombre: '', 
      valor: 0, 
      descripcion: '', 
      forma: FormaArea.UNICO, 
      alcance: '' 
    };
    setHabilidades([...habilidades, nueva]);
  };

  const eliminarHabilidad = (id: string) => {
    setHabilidades(habilidades.filter(h => h.id !== id));
  };

  const cambiarHabilidad = (id: string, campo: keyof Habilidad, valor: string | number) => {
    setHabilidades(habilidades.map(h => h.id === id ? { ...h, [campo]: valor } : h));
  };

  // --- MANEJADORES DE INVENTARIO ---

  const agregarItem = () => {
    const nuevo: ItemInventario = {
      id: crypto.randomUUID(),
      nombre: '',
      cantidad: 1,
      peso: 0,
      esContenedor: false,
      contenido: [],
      descripcion: ''
    };
    setInventario([...inventario, nuevo]);
  };

  const eliminarItem = (id: string) => setInventario(inventario.filter(i => i.id !== id));

  const cambiarItem = (id: string, campo: keyof ItemInventario, valor: string | number | boolean) => {
    setInventario((prev: ItemInventario[]) => prev.map(item => 
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  const agregarSubItem = (parentId: string) => {
    setInventario((prev: ItemInventario[]) => prev.map(item => {
      if (item.id === parentId) {
        const nuevoSub: SubItem = { id: crypto.randomUUID(), nombre: '', cantidad: 1 };
        return { ...item, contenido: [...(item.contenido || []), nuevoSub] };
      }
      return item;
    }));
  };

  const cambiarSubItem = (parentId: string, subId: string, campo: keyof SubItem, valor: string | number) => {
    setInventario((prev: ItemInventario[]) => prev.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          contenido: item.contenido?.map(sub => sub.id === subId ? { ...sub, [campo]: valor } : sub)
        };
      }
      return item;
    }));
  };

  const eliminarSubItem = (parentId: string, subId: string) => {
    setInventario((prev: ItemInventario[]) => prev.map(item => {
      if (item.id === parentId) {
        return { ...item, contenido: item.contenido?.filter(sub => sub.id !== subId) };
      }
      return item;
    }));
  };

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* FILA 1: DATOS GENERALES */}
        <CabeceraPersonaje datos={datosCabecera} alCambiar={manejarCambioCabecera} />
        
        {/* FILA 2: CUERPO DE LA FICHA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: ATRIBUTOS (2/12) */}
          <div className="md:col-span-2 flex justify-center md:justify-start">
            <AtributosPrincipales datos={atributos} alCambiar={manejarCambioAtributo} />
          </div>

          {/* COLUMNA CENTRAL: COMBATE Y HABILIDADES (5/12) */}
          <div className="md:col-span-5 space-y-6">
            <EstadisticasCombate datos={combate} alCambiar={manejarCambioCombate} />
            <ListaHabilidades 
              habilidades={habilidades} 
              alAgregar={agregarHabilidad} 
              alEliminar={eliminarHabilidad} 
              alCambiar={cambiarHabilidad} 
            />
          </div>

          {/* COLUMNA DERECHA: INVENTARIO (5/12) */}
          <div className="md:col-span-5">
            <Inventario 
              items={inventario}
              alAgregarItem={agregarItem}
              alEliminarItem={eliminarItem}
              alCambiarItem={cambiarItem}
              alAgregarSubItem={agregarSubItem}
              alCambiarSubItem={cambiarSubItem}
              alEliminarSubItem={eliminarSubItem}
            />
          </div>

        </div>
      </div>
    </div>
  );
}