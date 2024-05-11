import ICategoria from "./ICategoria";
import ISucursal from "./ISucursal";

export default interface ISucursalCategoria {
    sucursal: ISucursal;
    categoria: ICategoria;
}