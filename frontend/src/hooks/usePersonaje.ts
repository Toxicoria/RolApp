import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { FormaArea } from '../types';
import type {
  DatosCabecera,
  Atributos,
  EstadisticasCombate,
  EntradaStat,
  Habilidad,
  ItemInventario,
  SubItem,
  ZonaTexto
} from '../types';

const nuevaEntrada = (nombre = ''): EntradaStat => ({
  id: crypto.randomUUID(), nombre, valor: 0
});

const TIRADAS_DEFAULT: EntradaStat[] = [
  'Fuerza', 'Destreza', 'Constitución', 'Inteligencia', 'Sabiduría', 'Carisma'
].map(n => nuevaEntrada(n));

const HABILIDADES_DEFAULT: EntradaStat[] = [
  'Acrobacias', 'Adiestramiento', 'Arcanos', 'Atletismo', 'Engaño',
  'Historia', 'Intimidación', 'Juego de Manos', 'Medicina', 'Naturaleza',
  'Percepción', 'Perspicacia', 'Persuasión', 'Religión', 'Sigilo', 'Supervivencia'
].map(n => nuevaEntrada(n));

export const usePersonaje = () => {
  const [datosCabecera, setDatosCabecera] = useState<DatosCabecera>({
    nombre: '', trasfondo: '', clase: '', subclase: '', raza: '', nivel: 1, experiencia: 0,
  });

  const [atributos, setAtributos] = useState<Atributos>({
    fuerza: 10, destreza: 10, constitucion: 10, inteligencia: 10, sabiduria: 10, carisma: 10,
  });

  const [combate, setCombate] = useState<EstadisticasCombate>({
    ca: 10, iniciativa: 0, velocidad: 9, vidaMaxima: 10, vidaActual: 10, vidaTemporal: 0
  });

  const [tiradas, setTiradas] = useState<EntradaStat[]>(TIRADAS_DEFAULT);
  const [skillsPersonaje, setSkillsPersonaje] = useState<EntradaStat[]>(HABILIDADES_DEFAULT);
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [inventario, setInventario] = useState<ItemInventario[]>([]);
  const [zonas, setZonas] = useState<ZonaTexto[]>([]);

  // --- HANDLERS GENERALES ---
  const manejarCambioCabecera = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosCabecera(prev => ({
      ...prev, [name]: name === 'nivel' || name === 'experiencia' ? Number(value) : value
    }));
  };

  const manejarCambioAtributo = (nombre: keyof Atributos, valor: number) => {
    setAtributos(prev => ({ ...prev, [nombre]: valor }));
  };

  const actualizarValorCombate = (campo: keyof EstadisticasCombate, valor: number) => {
    setCombate(prev => ({ ...prev, [campo]: valor }));
  };

  // --- TIRADAS DE SALVACIÓN ---
  const agregarTirada = () => setTiradas(prev => [...prev, nuevaEntrada()]);
  const eliminarTirada = (id: string) => setTiradas(prev => prev.filter(t => t.id !== id));
  const cambiarTirada = (id: string, campo: keyof EntradaStat, valor: string | number) =>
    setTiradas(prev => prev.map(t => t.id === id ? { ...t, [campo]: valor } : t));

  // --- SKILLS / HABILIDADES DE PERSONAJE ---
  const agregarSkill = () => setSkillsPersonaje(prev => [...prev, nuevaEntrada()]);
  const eliminarSkill = (id: string) => setSkillsPersonaje(prev => prev.filter(s => s.id !== id));
  const cambiarSkill = (id: string, campo: keyof EntradaStat, valor: string | number) =>
    setSkillsPersonaje(prev => prev.map(s => s.id === id ? { ...s, [campo]: valor } : s));

  // --- ACCIONES DE HABILIDADES (conjuros/acciones) ---
  const agregarHabilidad = () => {
    setHabilidades([...habilidades, {
      id: crypto.randomUUID(), nombre: '', valor: 0, descripcion: '',
      forma: FormaArea.UNICO, alcance: ''
    }]);
  };

  const eliminarHabilidad = (id: string) => setHabilidades(habilidades.filter(h => h.id !== id));

  const cambiarHabilidad = (id: string, campo: keyof Habilidad, valor: string | number) => {
    setHabilidades(habilidades.map(h => h.id === id ? { ...h, [campo]: valor } : h));
  };

  // --- ZONAS DE TEXTO ---
  const agregarZona = () => setZonas(prev => [...prev, { id: crypto.randomUUID(), titulo: '', contenido: '' }]);
  const eliminarZona = (id: string) => setZonas(prev => prev.filter(z => z.id !== id));
  const cambiarZona = (id: string, campo: keyof ZonaTexto, valor: string) =>
    setZonas(prev => prev.map(z => z.id === id ? { ...z, [campo]: valor } : z));

  // --- ACCIONES DE INVENTARIO ---
  const agregarItem = () => {
    setInventario([...inventario, {
      id: crypto.randomUUID(), nombre: '', cantidad: 1, peso: 0,
      esContenedor: false, contenido: [], descripcion: ''
    }]);
  };

  const eliminarItem = (id: string) => setInventario(inventario.filter(i => i.id !== id));

  const cambiarItem = (id: string, campo: keyof ItemInventario, valor: string | number | boolean) => {
    setInventario(prev => prev.map(item => item.id === id ? { ...item, [campo]: valor } : item));
  };

  const agregarSubItem = (parentId: string) => {
    setInventario(prev => prev.map(item => {
      if (item.id === parentId) {
        const nuevoSub: SubItem = { id: crypto.randomUUID(), nombre: '', cantidad: 1 };
        return { ...item, contenido: [...(item.contenido || []), nuevoSub] };
      }
      return item;
    }));
  };

  const cambiarSubItem = (parentId: string, subId: string, campo: keyof SubItem, valor: string | number) => {
    setInventario(prev => prev.map(item => {
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
    setInventario(prev => prev.map(item => {
      if (item.id === parentId) {
        return { ...item, contenido: item.contenido?.filter(sub => sub.id !== subId) };
      }
      return item;
    }));
  };

  return {
    states: { datosCabecera, atributos, combate, tiradas, skillsPersonaje, habilidades, inventario, zonas },
    actions: {
      manejarCambioCabecera, manejarCambioAtributo, actualizarValorCombate,
      agregarTirada, eliminarTirada, cambiarTirada,
      agregarSkill, eliminarSkill, cambiarSkill,
      agregarHabilidad, eliminarHabilidad, cambiarHabilidad,
      agregarItem, eliminarItem, cambiarItem,
      agregarSubItem, cambiarSubItem, eliminarSubItem,
      agregarZona, eliminarZona, cambiarZona
    }
  };
};
