export const calcularModificador = (puntuacion: number): number => {
    return Math.floor((puntuacion -10 ) / 2)
}

export const formatearModificador = (modificador: number): string  => {
    return modificador > 0 ? `+${modificador}` : `${modificador}` ;
}