import { configureStore } from '@reduxjs/toolkit'
import ProductoReducer from '../slices/ProductoReducer'
import ModalReducer from '../slices/ModalReducer'
import ProductoDetalleReducer from '../slices/ProductoDetalleReducer'
// ...

export const store = configureStore({
  reducer: {
    producto: ProductoReducer,
    modal: ModalReducer,
    productoDetalle: ProductoDetalleReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch