import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Blog from "./pages/Blog";
import Contacto from "./pages/Contacto";
import Nosotros from "./pages/Nosotros";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Detalle from "./pages/Detalle";
import Carrito from "./pages/Carrito";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout.tsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.tsx";
import CheckoutFail from "./pages/CheckoutFail.tsx";
import Ofertas from "./pages/Ofertas.tsx";
import Perfil from "./pages/Perfil.tsx";
import BoletaDetalle from "./pages/BoletaDetalle";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/detalle/:id" element={<Detalle />} />
  <Route path="/ofertas" element={<Ofertas />} />
  <Route path="/boleta/:id" element={<BoletaDetalle />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/checkout/success" element={<CheckoutSuccess />} />
  <Route path="/checkout/fail" element={<CheckoutFail />} />
    <Route path="/perfil" element={<Perfil />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/carrito" element={<Carrito />} />
  <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
