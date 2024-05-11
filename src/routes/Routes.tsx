import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Producto from "../components/screens/Producto/Producto"



const Rutas = () => {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<Producto />} />
     
          </Routes>
    </Router>
  )
}

export default Rutas;