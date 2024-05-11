import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Box, Button, MenuItem, Select, FormControl } from '@mui/material';
import GenericModal from './GenericModal';
import ModalProductoDetalle from './ModalProductoDetalle';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import { Add } from '@mui/icons-material';
import ProductoService from '../../../services/ProductoService';
import IProducto from '../../../types/IProducto';
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import '../TextFieldValue/textFieldValue.css'
import ProductoPost from '../../../types/POST/ProductoPost';

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
    const unidadMedidaService = new UnidadMedidaService(); // Servicio para obtener las unidades de medida
    const URL = import.meta.env.VITE_API_URL;

    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [unidadMedidaOptions, setUnidadMedidaOptions] = useState<{ id: number; denominacion: string }[]>([]); // Estado para almacenar las opciones de unidad de medida
    const [unidadMedida, setUnidadMedida] = useState<number | null>(initialValues.unidadMedida || null); // Estado para almacenar la unidad de medida seleccionada

    useEffect(() => {
        // Obtener las unidades de medida disponibles
        const fetchUnidadesMedida = async () => {
            try {
                const unidadesMedida = await unidadMedidaService.getAll(URL + '/UnidadMedida');
                setUnidadMedidaOptions(unidadesMedida);
            } catch (error) {
                console.error('Error al obtener las unidades de medida:', error);
            }
        };

        fetchUnidadesMedida();
    }, []);

    const validationSchema = Yup.object().shape({
        descripcion: Yup.string().required('Campo requerido'),
        tiempoEstimadoMinutos: Yup.number().required('Campo requerido'),
        preparacion: Yup.string().required('Campo requerido'),
    });

    const handleProductoDetalle = () => {
        setShowDetalleModal(true);
    };

    const handleCloseDetalleModal = () => {
        setShowDetalleModal(false);
    };

    const handleSelectionSave = (selectedIds: number[]) => {
        return selectedIds;
    };

    const handleSubmit = async (values: IProducto) => {
        try {
            // Construir objeto ProductoPost
            const productoPost: ProductoPost = {
                ...values,
                unidadMedida: unidadMedida || 0, // Asignar el valor de unidadMedida seleccionada o 0 si es null
                idsArticuloManufacturadoDetalles: handleSelectionSave(values.idsArticuloManufacturadoDetalles),
            };

            if (isEditMode) {
                await productoService.put(`${URL}/ArticuloManufacturado`, productoPost.id, productoPost);
            } else {
                await productoService.post(`${URL}/ArticuloManufacturado`, productoPost);
            }
            getProductos();
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    if (!isEditMode) {
        initialValues = {
            descripcion: '',
            tiempoEstimadoMinutos: 0,
            preparacion: '',
            unidadMedida: '',
            idsArticuloManufacturadoDetalles: [],
        };
    }

    return (
        <>
            <GenericModal
                modalName={modalName}
                title={isEditMode ? 'Editar Producto' : 'Añadir Producto'}
                initialValues={productoAEditar || initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                isEditMode={isEditMode}
            >
                <TextFieldValue label="Descripción" name="descripcion" type="text" placeholder="Descripción" />
                <TextFieldValue label="Tiempo Estimado (minutos)" name="tiempoEstimadoMinutos" type="number" placeholder="Tiempo Estimado" />
                <TextFieldValue label="Preparación" name="preparacion" type="textarea" placeholder="" />
                <FormControl fullWidth>
                    <label className='label' style={{ marginTop: '16px' }}>Unidad de Medida</label>
                    <Select
                        labelId="unidadMedidaLabel"
                        id="unidadMedida"
                        value={unidadMedida}
                        onChange={(e) => setUnidadMedida(e.target.value as number)}
                        displayEmpty  // Permite que el select muestre el valor vacío
                    >
                        {/* Placeholder */}
                        <MenuItem disabled value="">
                            Seleccione una unidad de medida
                        </MenuItem>
                        {/* Resto de las opciones */}
                        {unidadMedidaOptions.map((unidad) => (
                            <MenuItem key={unidad.id} value={unidad.id}>
                                {unidad.denominacion}
                            </MenuItem>
                        ))}
                    </Select>


                </FormControl>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button sx={{ marginY: 2 }} startIcon={<Add />} variant="contained" color="primary" onClick={handleProductoDetalle}>
                        Detalles de producto
                    </Button>
                </Box>
            </GenericModal>
            {showDetalleModal && (
                <ModalProductoDetalle
                    handleCloseModal={handleCloseDetalleModal}
                    onSaveSelection={handleSelectionSave}
                />
            )}
        </>
    );
};

export default ModalProducto;
