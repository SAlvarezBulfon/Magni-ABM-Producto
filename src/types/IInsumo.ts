import IArticulo from "./IArticulo";
import IUnidadMedida from "./IUnidadMedida";

export default interface IInsumo extends IArticulo{
    unidadMedida: IUnidadMedida;
    precioCompra: number;
    stockActual: number;
    stockMaximo: number;
    esParaElaborar: boolean;
}