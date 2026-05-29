export interface DatosCabecera{
    nombre: string;
    trasfondo: string;
    clase: string;
    subclase: string;
    raza: string;
    nivel: number;
    experiencia: number;
}

export interface Atributos{
    fuerza: number;
    destreza: number;
    constitucion: number;
    inteligencia: number;
    sabiduria: number;
    carisma: number;
}

export type FormaRecurso = 'circulo' | 'cuadrado' | 'triangulo';
export type ColorRecurso = 'verde' | 'azul' | 'rojo' | 'naranja' | 'amarillo';

export interface Recurso {
  id: string;
  nombre: string;
  maximo: number;
  actual: number;
  forma?: FormaRecurso;
  color?: ColorRecurso;
}

export type AtributoKey = keyof Atributos;

export interface EntradaSalvacion {
  id: string;
  nombre: string;
  atributo: AtributoKey;
  competencia: boolean;
}

export interface EntradaHabilidad {
  id: string;
  nombre: string;
  atributo: AtributoKey;
  competencia: boolean;
  experiencia: boolean;
}

export interface EstadisticasCombate {
  ca: number;          // Clase de Armadura
  iniciativa: number;
  velocidad: number;
  vidaMaxima: number;
  vidaActual: number;
  vidaTemporal: number;
  dadosGolpeTotal: string;
  dadosGolpeActual: string;
  salvacionMuerteExitos: number;
  salvacionMuerteFallos: number;
}


export const FormaArea = {
  CILINDRO: "Cilindro",
  CONO: "Cono",
  CUBO: "Cubo",
  ESFERA: "Esfera",
  LINEA: "Linea",
  UNICO: "Objetivo Unico"
} as const;

export type TipoFormaArea = typeof FormaArea[keyof typeof FormaArea];
export interface UsoRecurso {
  recursoId: string;
  danoEspecifico?: string;
  accion?: 'consume' | 'regenera';
}

export interface Habilidad {
  id: string;
  nombre: string;
  valor: number;
  descripcion: string;
  forma: TipoFormaArea;
  alcance: string; 
  dano?: string;
  usosRecursos?: UsoRecurso[];
  esRegeneradorAbierto?: boolean;
  usosMaximosPropios?: number;
  usosActualesPropios?: number;
  costoRecursoId?: string;
}

export interface EntradaStat {
  id: string;
  nombre: string;
  valor: number;
}

export interface SubItem {
    id: string;
    nombre: string;
    cantidad: number;
    descripcion?: string;
    tipo?: TipoItem;
    valor?: string;
    dano?: string;
}

export interface ZonaTexto {
  id: string;
  titulo: string;
  contenido: string;
}

export type TipoItem = 'objeto' | 'arma';

export interface ItemInventario {
    id: string;
    tipo: TipoItem;
    nombre: string;
    cantidad?: number;
    peso: number;
    valor: string;
    esContenedor: boolean;
    esConsumible?: boolean;
    contenido?: SubItem[]; // Solo presente si esContenedor = True
    descripcion: string;
    dano?: string;
}