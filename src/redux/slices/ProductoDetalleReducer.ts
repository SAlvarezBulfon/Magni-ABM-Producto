import ProductoDetalle from '../../types/IProductoDetalle';
import { createGenericSlice } from './GenericReducer';

const productoDetalleSlice = createGenericSlice<ProductoDetalle[]>('productoDetalleState', { data: [] });

export const { setData: setProductoDetalle, resetData: resetProductoDetalle } = productoDetalleSlice.actions;

export default productoDetalleSlice.reducer;