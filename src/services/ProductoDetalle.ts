
import IProductoDetalle from "../types/IProductoDetalle";
import ProductoDetallePost from "../types/POST/ProductoDetallePost";
import  BackendClient  from "./BackendClient";


export default class ProductoDetalleService extends BackendClient<IProductoDetalle | ProductoDetallePost> {}