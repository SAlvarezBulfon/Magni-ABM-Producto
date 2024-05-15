

export default interface ProductoPost {
    denominacion: string;
    descripcion: string;
    tiempoEstimadoMinutos: number;
    precioVenta: number
    preparacion: string;
    idUnidadMedida: number;
    idsArticuloManufacturadoDetalles: number[];
  }
  