import DataModel from "./DataModel";
import IArticulo from "./IArticulo";

export default interface IImagenArticulo extends DataModel<IImagenArticulo>{
    url:string
    insumo:IArticulo
}