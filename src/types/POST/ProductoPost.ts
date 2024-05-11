import DataModel from "../DataModel";

export default interface ProductoPost extends DataModel<ProductoPost> {
    descripcion: string;
    tiempoEstimadoMinutos: number;
    preparacion: string;
    unidadMedida: number;
    idsArticuloManufacturadoDetalles: number[];
  }
  