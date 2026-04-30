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

export interface EstadisticasCombate {
  ca: number;          // Clase de Armadura
  iniciativa: number;
  velocidad: number;
  vidaMaxima: number;
  vidaActual: number;
  vidaTemporal: number;
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
export interface Habilidad {
  id: string;
  nombre: string;
  valor: number;
  descripcion: string;
  forma: TipoFormaArea;
  alcance: string; 
}

export interface SubItem {
    id: string;
    nombre: string;
    cantidad: number;
}

export interface ItemInventario {
    id: string;
    nombre: string;
    cantidad: number;
    peso: number;
    esContenedor: boolean;
    contenido?: SubItem[]; // Solo presente si esContenedor = True
    descripcion: string;
}