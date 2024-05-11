import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, List, ListItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import IProductoDetalle from '../../../types/IProductoDetalle';
import ProductoDetalleService from '../../../services/ProductoDetalle';


interface ModalProductoDetalleProps {
    handleCloseModal: () => void;
    onSaveSelection: (selectedIds: number[]) => void; // Función de devolución de llamada para guardar las selecciones
  }

const ModalProductoDetalle: React.FC<ModalProductoDetalleProps> = ({ handleCloseModal, onSaveSelection }) => {
  const [detalleItems, setDetalleItems] = useState<IProductoDetalle[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [open, setOpen] = useState<boolean>(true); // Estado para controlar la apertura y cierre del modal
  const productoDetalleService = new ProductoDetalleService(); 
  const url = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchProductoDetalles = async () => {
      try {
        const detalles = await productoDetalleService.getAll(url + '/ArticuloManufacturadoDetalle');
        setDetalleItems(detalles);
      } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
      }
    };

    fetchProductoDetalles(); 
  }, []); 

  const handleToggle = (id: number) => {
    const currentIndex = selectedItems.indexOf(id);
    const newSelectedItems = [...selectedItems];

    if (currentIndex === -1) {
      newSelectedItems.push(id);
    } else {
      newSelectedItems.splice(currentIndex, 1);
    }

    setSelectedItems(newSelectedItems);
  };


  const handleGuardarSeleccion = () => {
    onSaveSelection(selectedItems); // Llama a la función de devolución de llamada con los IDs seleccionados
    handleCloseModal();
  };

  const handleClose = () => {
    setOpen(false); // Cambiamos el estado para cerrar el modal
    handleCloseModal(); // Llamamos a la función para cerrar el modal
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Detalle del Producto</DialogTitle>
      <DialogContent>
        <List>
          {detalleItems.map((item) => (
            <ListItem key={item.id} button onClick={() => handleToggle(item.id)}>
              <FormControlLabel
                control={<Checkbox checked={selectedItems.includes(item.id)} />}
                label={`${item.articuloInsumo.denominacion} - ${item.cantidad} -  ${item.articuloInsumo.unidadMedida.denominacion}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
                  Cerrar
        </Button>
        <Button variant="contained" color="primary" onClick={handleGuardarSeleccion}>
          Guardar Selección
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalProductoDetalle;
