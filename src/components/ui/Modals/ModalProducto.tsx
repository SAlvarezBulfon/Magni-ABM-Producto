import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Box, MenuItem, Select, FormControl, TextField, Button, Typography, Grid } from '@mui/material';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import ProductoService from '../../../services/ProductoService';
import IProducto from '../../../types/IProducto';
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import ProductoPost from '../../../types/POST/ProductoPost';
import ProductoDetalleService from '../../../services/ProductoDetalle';
import InsumoService from '../../../services/InsumoService';
import IInsumo from '../../../types/IInsumo';
import Swal from 'sweetalert2';
import '../TextFieldValue/textFieldValue.css';
import TableComponent from '../TableComponent/TableComponent';
import Column from '../../../types/Column';
import IProductoDetalle from '../../../types/IProductoDetalle';
import '../../../utils/swal.css'


interface ModalProductoProps {
    modalName: string;
    initialValues: any;
    isEditMode: boolean;
    getProductos: Function;
    productoAEditar?: IProducto;
}

const ModalProducto: React.FC<ModalProductoProps> = ({
    modalName,
    initialValues,
    isEditMode,
    getProductos,
    productoAEditar,
}) => {
    const productoService = new ProductoService();
    const productoDetalleService = new ProductoDetalleService();
    const unidadMedidaService = new UnidadMedidaService();
    const insumoService = new InsumoService();
    const URL = import.meta.env.VITE_API_URL;

    const [unidadMedidaOptions, setUnidadMedidaOptions] = useState<{ id: number; denominacion: string }[]>([]);
    const [insumos, setInsumos] = useState<IInsumo[]>([]);
    const [dataIngredients, setDataIngredients] = useState<any[]>([]);
    const [selectedInsumoId, setSelectedInsumoId] = useState<number | null>(null);
    const [cantidadInsumo, setCantidadInsumo] = useState<number>(0);
    const [unidadMedidaInsumo, setUnidadMedidaInsumo] = useState<string>('N/A');
    const [unidadMedidaProducto, setUnidadMedidaProducto] = useState<number>(initialValues.idUnidadMedida || 0);

    const fetchUnidadesMedida = async () => {
        try {
            const unidadesMedida = await unidadMedidaService.getAll(`${URL}/UnidadMedida`);
            setUnidadMedidaOptions(unidadesMedida);
        } catch (error) {
            console.error('Error al obtener las unidades de medida:', error);
        }
    };

    const fetchProductoDetalle = async () => {
        if (productoAEditar) {
            try {
                const detalles = await productoDetalleService.getAll(`${URL}/ArticuloManufacturado/allDetalles/${productoAEditar.id}`);
                setDataIngredients(detalles);
            } catch (error) {
                console.error('Error al obtener los detalles del producto:', error);
            }
        }
    };

    const fetchInsumos = async () => {
        try {
            const insumos = await insumoService.getAll(`${URL}/ArticuloInsumo`);
            setInsumos(insumos);
        } catch (error) {
            console.error('Error al obtener los insumos:', error);
        }
    };

    const validationSchema = Yup.object().shape({
        denominacion: Yup.string().required('Campo requerido'),
        descripcion: Yup.string().required('Campo requerido'),
        tiempoEstimadoMinutos: Yup.number().required('Campo requerido'),
        preparacion: Yup.string().required('Campo requerido'),
        precioVenta: Yup.number().required('Campo requerido'),
    });


    const onDeleteProductoDetalle = async (productoDetalle: IProductoDetalle) => {
        try {

            //actualizamos el estado eliminando el detalle
            const updatedIngredients = dataIngredients.filter((ingredient) => ingredient.id !== productoDetalle.id);
            setDataIngredients(updatedIngredients);

            // Mostramos un mensaje de éxito
            Swal.fire({
                title: '¡Éxito!',
                text: 'Ingrediente eliminado correctamente',
                icon: 'success',
                customClass: {
                    container: 'my-swal',
                },
            });
        } catch (error) {
            console.error('Error al eliminar el ingrediente:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al eliminar el ingrediente',
                icon: 'error',
                customClass: {
                    container: 'my-swal',
                },
            });
        }
    };

    const handleNewIngredient = async () => {
        if (selectedInsumoId !== null && cantidadInsumo > 0) {
            const selectedInsumo = insumos.find((insumo) => insumo.id === selectedInsumoId);
            if (selectedInsumo) {
                try {
                    const newDetalle = {
                        cantidad: cantidadInsumo,
                        idArticuloInsumo: selectedInsumo.id,
                    };
                    const createdDetalle = await productoDetalleService.post(`${URL}/ArticuloManufacturadoDetalle`, newDetalle);

                    setDataIngredients([...dataIngredients, createdDetalle]); // Agrega el nuevo ingrediente al estado existente

                    setSelectedInsumoId(null);
                    setCantidadInsumo(0);
                    setUnidadMedidaInsumo('N/A');
                } catch (error) {
                    console.error('Error al crear el detalle:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Ha ocurrido un error al crear el detalle',
                        icon: 'error',
                        customClass: {
                            container: 'my-swal',
                        },
                    });
                }
            }
        }
    };



    const columns: Column[] = [
        {
            id: "ingrediente",
            label: "Ingrediente",
            renderCell: (element) => <>{element?.articuloInsumo?.denominacion || 'N/A'}</>
        },
        {
            id: "unidadMedida",
            label: "Unidad de Medida",
            renderCell: (element) => <>{element?.articuloInsumo?.unidadMedida?.denominacion || 'N/A'}</>
        },
        { id: "cantidad", label: "Cantidad", renderCell: (element) => <>{element?.cantidad || 'N/A'}</> },
    ];

    const handleSubmit = async (values: IProducto) => {
        try {
            const productoPost: ProductoPost = {
                denominacion: values.denominacion,
                descripcion: values.descripcion,
                tiempoEstimadoMinutos: values.tiempoEstimadoMinutos,
                precioVenta: values.precioVenta,
                preparacion: values.preparacion,
                idUnidadMedida: unidadMedidaProducto,
                idsArticuloManufacturadoDetalles: dataIngredients.map((detalle) => detalle.id),
            };

            let response;

            if (isEditMode && productoAEditar) {
                // Si estamos en modo de edición, primero actualizamos los detalles del producto
                // Luego actualizamos el producto con los detalles actualizados
                const updatedProduct = {
                    ...productoAEditar,
                    idsArticuloManufacturadoDetalles: dataIngredients.map((detalle) => detalle.id),
                };
                await productoService.put(`${URL}/ArticuloManufacturado`, productoAEditar.id, updatedProduct);
                response = await productoService.put(`${URL}/ArticuloManufacturado`, productoAEditar.id, productoPost);
            } else {
                // Si estamos en modo de añadir, creamos el producto con los detalles
                response = await productoService.post(`${URL}/ArticuloManufacturado`, productoPost);
            }

            if (response) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: isEditMode ? 'Producto editado correctamente' : 'Producto creado correctamente',
                    icon: 'success',
                    customClass: {
                        container: 'my-swal',
                    },
                });
                getProductos();
            } else {
                throw new Error('No se recibió una respuesta del servidor.');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al enviar los datos',
                icon: 'error',
                customClass: {
                    container: 'my-swal',
                },
            });

            if (!isEditMode) {
                try {
                    // Si ocurrió un error al enviar los datos en modo de añadir, eliminamos los detalles creados
                    await Promise.all(dataIngredients.map(async (detalle) => {
                        await productoDetalleService.delete(`${URL}/ArticuloManufacturadoDetalle`, detalle.id);
                    }));
                } catch (rollbackError) {
                    console.error('Error al realizar el rollback:', rollbackError);
                }
            }
        }
    };


    useEffect(() => {
        fetchUnidadesMedida();
        fetchInsumos();
        if (!isEditMode) {
            setDataIngredients([]);

        }
        if (isEditMode && productoAEditar) {
            fetchProductoDetalle();
            setUnidadMedidaProducto(productoAEditar.idUnidadMedida);
        }
    }, [isEditMode, productoAEditar]);


    useEffect(() => {
        if (selectedInsumoId !== null) {
            const selectedInsumo = insumos.find((insumo) => insumo.id === selectedInsumoId);
            if (selectedInsumo) {
                setUnidadMedidaInsumo(selectedInsumo.unidadMedida.denominacion);
            }
        } else {
            setUnidadMedidaInsumo('N/A');
        }
    }, [selectedInsumoId, insumos]);

    return (
        <GenericModal
            modalName={modalName}
            title={isEditMode ? 'Editar Producto' : 'Añadir Producto'}
            initialValues={productoAEditar || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
        >
            <TextFieldValue label="Nombre" name="denominacion" type="text" placeholder="Nombre" />
            <TextFieldValue label="Descripción" name="descripcion" type="text" placeholder="Descripción" />
            <TextFieldValue label="Precio de venta" name="precioVenta" type="number" placeholder="Precio" />
            <TextFieldValue label="Tiempo Estimado (minutos)" name="tiempoEstimadoMinutos" type="number" placeholder="Tiempo Estimado" />
            <TextFieldValue label="Preparación" name="preparacion" type="textarea" placeholder="Preparación" />

            <FormControl fullWidth>
                <label className='label' style={{ marginTop: '16px' }}>Unidad de Medida del Producto</label>
                <Select
                    labelId="unidadMedidaProductoLabel"
                    id="unidadMedidaProducto"
                    value={unidadMedidaProducto}
                    onChange={(e) => setUnidadMedidaProducto(e.target.value as number)}
                    displayEmpty
                >
                    <MenuItem disabled value="">
                        Seleccione una unidad de medida para el producto
                    </MenuItem>
                    {unidadMedidaOptions.map((unidad) => (
                        <MenuItem key={unidad.id} value={unidad.id}>
                            {unidad.denominacion}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Typography variant="h6" align="center" gutterBottom>
                Ingredientes
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2vh' }}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <Select
                                value={selectedInsumoId || ''}
                                onChange={(e) => setSelectedInsumoId(e.target.value as number)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Seleccione un ingrediente
                                </MenuItem>
                                {insumos.map((insumo) => (
                                    <MenuItem key={insumo.id} value={insumo.id}>
                                        {insumo.denominacion}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            type="text"
                            label="Unidad de Medida"
                            value={unidadMedidaInsumo}
                            variant="filled"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            type="number"
                            label="Cantidad"
                            value={cantidadInsumo}
                            onChange={(e) => setCantidadInsumo(parseFloat(e.target.value))}
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button onClick={handleNewIngredient} variant="contained" color="primary">
                            Añadir
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            {isEditMode &&
                <TableComponent
                    data={dataIngredients}
                    columns={columns}
                />}
            { !isEditMode && <TableComponent
            data={dataIngredients}
            columns={columns}
            onDelete={onDeleteProductoDetalle}
        />}
        </GenericModal>
    );
};

export default ModalProducto;