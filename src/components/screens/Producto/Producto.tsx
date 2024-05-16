import { useEffect, useState } from "react";
import { Box, Typography, Button, Container} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setProducto } from "../../../redux/slices/ProductoReducer";
import ProductoService from "../../../services/ProductoService";
import { handleSearch, onDelete } from "../../../utils/utils";
import Row from "../../../types/Row";
import Column from "../../../types/Column";

import ModalProducto from "../../ui/Modals/ModalProducto";
import IProducto from "../../../types/IProducto";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import SearchBar from "../../ui/Common/SearchBar/SearchBar";
import TableComponent from "../../ui/TableComponent/TableComponent";

const Producto = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const productoService = new ProductoService();
  const globalProductos = useAppSelector(
    (state) => state.producto.data
  );

  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [productoEditar, setProductoEditar] = useState<IProducto | undefined>();

  const fetchProductos = async () => {
    try {
      const productos = await productoService.getAll(url + '/ArticuloManufacturado');
      dispatch(setProducto(productos));
      setFilteredData(productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [dispatch]);

  const onSearch = (query: string) => {
    handleSearch(query, globalProductos, 'descripcion', setFilteredData);
  };

  const onDeleteProducto = async (producto: IProducto) => {
    try {
      await onDelete(
        producto,
        async (productoToDelete: IProducto) => {
          await productoService.delete(url + '/ArticuloManufacturado', productoToDelete.id);
        },
        fetchProductos,
        () => {
        },
        (error: any) => {
          console.error("Error al eliminar producto:", error);
        }
      );
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const handleEdit = (producto: IProducto) => {
    setIsEditing(true);
    setProductoEditar(producto)
    dispatch(toggleModal({ modalName: "modalProducto" }));
  };

  const handleAddProducto = () => {
    setIsEditing(false);
    setProductoEditar(undefined); // Resetea el producto a editar al añadir uno nuevo
    dispatch(toggleModal({ modalName: "modalProducto" }));
  };

  const columns: Column[] = [
    { id: "denominacion", label: "Nombre", renderCell: (producto) => <>{producto.denominacion}</> },
    { id: "descripcion", label: "Descripción", renderCell: (producto) => <>{producto.descripcion}</> },
    { id: "precioVenta", label: "Precio de Venta", renderCell: (producto) => <>{producto.precioVenta}</> },
    { id: "preparacion", label: "Preparación", renderCell: (producto) => <>{producto.preparacion}</> },
    { id: "unidadMedida", label: "Unidad de Medida", renderCell: (producto) => <>{producto.unidadMedida.denominacion}</> },
    {
      id: "tiempoEstimadoMinutos",
      label: "Tiempo estimado en minutos",
      renderCell: (producto) => <>{producto.tiempoEstimadoMinutos}</>,
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Productos
          </Typography>
          <Button
            onClick={handleAddProducto}
            variant="contained"
            startIcon={<Add />}
          >
            Producto
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDeleteProducto} onEdit={handleEdit}/>
        <ModalProducto
          modalName="modalProducto"
          initialValues={{
            id: 0,
            descripcion: "",
            tiempoEstimadoMinutos: 0,
            preparacion: "",
            precioVenta: 0,
            unidadMedida: 0,
            idsArticuloManufacturadoDetalles: []
          }}
          isEditMode={isEditing}
          getProductos={fetchProductos}
          productoAEditar={productoEditar} // Pasar el producto a editar aquí
        />
      </Container>
    </Box>
  );
};

export default Producto;
