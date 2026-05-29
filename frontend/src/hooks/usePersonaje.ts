import { useState } from 'react';
import type { ChangeEvent } from 'react';

import type {
  DatosCabecera,
  Atributos,
  AtributoKey,
  EstadisticasCombate,
  EntradaSalvacion,
  EntradaHabilidad,
  Habilidad,
  ItemInventario,
  SubItem,
  ZonaTexto,
  Recurso
} from '../types';

const nuevaTirada = (nombre: string, atributo: AtributoKey): EntradaSalvacion => ({
  id: crypto.randomUUID(), nombre, atributo, competencia: false,
});

const nuevaHabilidad = (nombre: string, atributo: AtributoKey): EntradaHabilidad => ({
  id: crypto.randomUUID(), nombre, atributo, competencia: false, experiencia: false,
});

const TIRADAS_DEFAULT: EntradaSalvacion[] = [
  nuevaTirada('Fuerza', 'fuerza'),
  nuevaTirada('Destreza', 'destreza'),
  nuevaTirada('Constitución', 'constitucion'),
  nuevaTirada('Inteligencia', 'inteligencia'),
  nuevaTirada('Sabiduría', 'sabiduria'),
  nuevaTirada('Carisma', 'carisma'),
];

const HABILIDADES_DEFAULT: EntradaHabilidad[] = [
  nuevaHabilidad('Acrobacias', 'destreza'),
  nuevaHabilidad('Adiestramiento', 'sabiduria'),
  nuevaHabilidad('Arcanos', 'inteligencia'),
  nuevaHabilidad('Atletismo', 'fuerza'),
  nuevaHabilidad('Engaño', 'carisma'),
  nuevaHabilidad('Historia', 'inteligencia'),
  nuevaHabilidad('Intimidación', 'carisma'),
  nuevaHabilidad('Juego de Manos', 'destreza'),
  nuevaHabilidad('Medicina', 'sabiduria'),
  nuevaHabilidad('Naturaleza', 'inteligencia'),
  nuevaHabilidad('Percepción', 'sabiduria'),
  nuevaHabilidad('Perspicacia', 'sabiduria'),
  nuevaHabilidad('Persuasión', 'carisma'),
  nuevaHabilidad('Religión', 'inteligencia'),
  nuevaHabilidad('Sigilo', 'destreza'),
  nuevaHabilidad('Supervivencia', 'sabiduria'),
];

const RECURSOS_DEFAULT: Recurso[] = [
  { id: crypto.randomUUID(), nombre: 'Acción', maximo: 1, actual: 1, forma: 'circulo', color: 'azul' },
  { id: crypto.randomUUID(), nombre: 'Acción Adicional', maximo: 1, actual: 1, forma: 'triangulo', color: 'naranja' },
];

export const usePersonaje = () => {
  const [datosCabecera, setDatosCabecera] = useState<DatosCabecera>({
    nombre: '', trasfondo: '', clase: '', subclase: '', raza: '', nivel: 1, experiencia: 0,
  });

  const [atributos, setAtributos] = useState<Atributos>({
    fuerza: 10, destreza: 10, constitucion: 10, inteligencia: 10, sabiduria: 10, carisma: 10,
  });

  const [combate, setCombate] = useState<EstadisticasCombate>({
    ca: 10, iniciativa: 0, velocidad: 9, vidaMaxima: 10, vidaActual: 10, vidaTemporal: 0,
    dadosGolpeTotal: '1d8', dadosGolpeActual: '1', salvacionMuerteExitos: 0, salvacionMuerteFallos: 0
  });

  const [tiradas, setTiradas] = useState<EntradaSalvacion[]>(TIRADAS_DEFAULT);
  const [skillsPersonaje, setSkillsPersonaje] = useState<EntradaHabilidad[]>(HABILIDADES_DEFAULT);
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [inventario, setInventario] = useState<ItemInventario[]>([]);
  const [zonas, setZonas] = useState<ZonaTexto[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>(RECURSOS_DEFAULT);

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

  const actualizarValorCombate = (campo: keyof EstadisticasCombate, valor: any) => {
    setCombate(prev => ({ ...prev, [campo]: valor }));
  };

  // --- TIRADAS DE SALVACIÓN ---
  const agregarTirada = () =>
    setTiradas(prev => [...prev, nuevaTirada('', 'fuerza')]);

  const eliminarTirada = (id: string) =>
    setTiradas(prev => prev.filter(t => t.id !== id));

  const cambiarTirada = (id: string, campo: 'nombre' | 'atributo', valor: string) =>
    setTiradas(prev => prev.map(t => t.id === id ? { ...t, [campo]: valor } : t));

  const toggleCompetenciaTirada = (id: string) =>
    setTiradas(prev => prev.map(t => t.id === id ? { ...t, competencia: !t.competencia } : t));

  // --- SKILLS / HABILIDADES DE PERSONAJE ---
  const agregarSkill = () =>
    setSkillsPersonaje(prev => [...prev, nuevaHabilidad('', 'fuerza')]);

  const eliminarSkill = (id: string) =>
    setSkillsPersonaje(prev => prev.filter(s => s.id !== id));

  const cambiarSkill = (id: string, campo: 'nombre' | 'atributo', valor: string) =>
    setSkillsPersonaje(prev => prev.map(s => s.id === id ? { ...s, [campo]: valor } : s));

  const ciclarCompetenciaSkill = (id: string) =>
    setSkillsPersonaje(prev => prev.map(s => {
      if (s.id !== id) return s;
      if (!s.competencia) return { ...s, competencia: true, experiencia: false };
      if (!s.experiencia) return { ...s, experiencia: true };
      return { ...s, competencia: false, experiencia: false };
    }));

  const agregarHabilidad = (nueva: Omit<Habilidad, 'id'>) => {
    setHabilidades([...habilidades, {
      id: crypto.randomUUID(), ...nueva
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

  // --- RECURSOS Y ACCIONES ---
  const agregarRecurso = () => setRecursos(prev => [...prev, { id: crypto.randomUUID(), nombre: '', maximo: 1, actual: 1, forma: 'circulo', color: 'azul' }]);
  const guardarRecurso = (recurso: Recurso) => setRecursos(prev => {
    const idx = prev.findIndex(r => r.id === recurso.id);
    if (idx !== -1) {
      const nuevo = [...prev];
      nuevo[idx] = recurso;
      return nuevo;
    }
    return [...prev, recurso];
  });
  const eliminarRecurso = (id: string) => setRecursos(prev => prev.filter(r => r.id !== id));
  const cambiarRecurso = (id: string, campo: keyof Recurso, valor: string | number) =>
    setRecursos(prev => prev.map(r => r.id === id ? { ...r, [campo]: valor } : r));
  const reordenarRecursos = (idOrigen: string, idDestino: string) => {
    setRecursos(prev => {
      const idxOrigen = prev.findIndex(r => r.id === idOrigen);
      const idxDestino = prev.findIndex(r => r.id === idDestino);
      if (idxOrigen === -1 || idxDestino === -1 || idxOrigen === idxDestino) return prev;
      const nuevo = [...prev];
      const [movido] = nuevo.splice(idxOrigen, 1);
      nuevo.splice(idxDestino, 0, movido);
      return nuevo;
    });
  };

  // --- ACCIONES DE INVENTARIO ---
  const agregarItem = (nuevo: Omit<ItemInventario, 'id' | 'contenido'>) => {
    setInventario([...inventario, {
      id: crypto.randomUUID(),
      contenido: nuevo.esContenedor ? [] : undefined,
      ...nuevo
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

  const moverItemAContenedor = (itemId: string, contenedorId: string) => {
    setInventario(prev => {
      const itemToMove = prev.find(i => i.id === itemId);
      if (!itemToMove || itemToMove.esContenedor || itemId === contenedorId) return prev;
      
      const targetContainer = prev.find(i => i.id === contenedorId);
      if (!targetContainer || !targetContainer.esContenedor) return prev;

      const subItemNombre = itemToMove.tipo === 'arma' && itemToMove.dano 
        ? `${itemToMove.nombre} (${itemToMove.dano})` 
        : itemToMove.nombre;
        
      // Buscar si ya existe un SubItem con mismo nombre y descripción
      const existingSubIndex = (targetContainer.contenido || []).findIndex(s => 
        s.nombre === subItemNombre && s.descripcion === itemToMove.descripcion
      );

      const cantidadAMover = itemToMove.cantidad || 1;

      return prev
        .filter(item => item.id !== itemId)
        .map(item => {
          if (item.id === contenedorId) {
            const nuevoContenido = [...(item.contenido || [])];
            
            if (existingSubIndex >= 0) {
              nuevoContenido[existingSubIndex] = {
                ...nuevoContenido[existingSubIndex],
                cantidad: (nuevoContenido[existingSubIndex].cantidad || 1) + cantidadAMover
              };
            } else {
              nuevoContenido.push({
                id: crypto.randomUUID(),
                nombre: subItemNombre,
                cantidad: cantidadAMover,
                descripcion: itemToMove.descripcion,
                tipo: itemToMove.tipo,
                valor: itemToMove.valor,
                dano: itemToMove.dano
              });
            }
            return { ...item, contenido: nuevoContenido };
          }
          return item;
        });
    });
  };

  const sacarSubItem = (contenedorId: string, subItemId: string, cantidadASacar: number) => {
    setInventario(prev => {
      const targetContainer = prev.find(i => i.id === contenedorId);
      if (!targetContainer || !targetContainer.esContenedor) return prev;

      const subItem = targetContainer.contenido?.find(s => s.id === subItemId);
      if (!subItem) return prev;

      const cantidadActual = subItem.cantidad || 1;
      const cantEfectiva = Math.min(cantidadActual, Math.max(1, cantidadASacar));
      const remainingQty = cantidadActual - cantEfectiva;

      // Buscar si existe un item principal con el mismo nombre y descripción (y no es contenedor)
      const existingItemIndex = prev.findIndex(i => 
        !i.esContenedor && 
        i.nombre === subItem.nombre && 
        i.descripcion === (subItem.descripcion || '')
      );

      let nuevoInventario = [...prev];

      // Actualizar contenedor origen
      const contenedorIndex = nuevoInventario.findIndex(i => i.id === contenedorId);
      if (contenedorIndex >= 0) {
        const itemActual = nuevoInventario[contenedorIndex];
        nuevoInventario[contenedorIndex] = {
          ...itemActual,
          contenido: remainingQty <= 0 
            ? itemActual.contenido?.filter(s => s.id !== subItemId)
            : itemActual.contenido?.map(s => s.id === subItemId ? { ...s, cantidad: remainingQty } : s)
        };
      }

      // Añadir al inventario principal
      if (existingItemIndex >= 0) {
        // Agrupar con el existente
        const itemExistente = nuevoInventario[existingItemIndex];
        nuevoInventario[existingItemIndex] = {
          ...itemExistente,
          cantidad: (itemExistente.cantidad || 1) + cantEfectiva
        };
      } else {
        // Crear nuevo
        const newItem: ItemInventario = {
          id: crypto.randomUUID(),
          tipo: subItem.tipo || 'objeto',
          nombre: subItem.nombre,
          cantidad: cantEfectiva,
          peso: 0,
          valor: subItem.valor || '',
          esContenedor: false,
          descripcion: subItem.descripcion || '',
          dano: subItem.dano
        };
        nuevoInventario.push(newItem);
      }

      return nuevoInventario;
    });
  };

  return {
    states: { datosCabecera, atributos, combate, tiradas, skillsPersonaje, habilidades, inventario, zonas, recursos },
    actions: {
      manejarCambioCabecera, manejarCambioAtributo, actualizarValorCombate,
      agregarTirada, eliminarTirada, cambiarTirada, toggleCompetenciaTirada,
      agregarSkill, eliminarSkill, cambiarSkill, ciclarCompetenciaSkill,
      agregarHabilidad, eliminarHabilidad, cambiarHabilidad,
      agregarItem, eliminarItem, cambiarItem, moverItemAContenedor,
      agregarSubItem, cambiarSubItem, eliminarSubItem, sacarSubItem,
      agregarZona, eliminarZona, cambiarZona,
      agregarRecurso, guardarRecurso, eliminarRecurso, cambiarRecurso, reordenarRecursos
    }
  };
};