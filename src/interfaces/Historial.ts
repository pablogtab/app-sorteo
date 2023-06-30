import { Sorteo } from './Sorteo';
import { Usuario } from './Usuario';


export interface Historial {
    fecha: string
    sorteados: Sorteo[]
}