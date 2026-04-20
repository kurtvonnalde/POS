import { Routes, Route } from 'react-router-dom'
import Header from './component/Header'
import Footer from './component/Footer'
import Login from './app/Login'
import Register from './app/Registration'
import Products from './app/pages/products/Products'
import Sales from './app/pages/sales/Sales'
import Inventory from './app/pages/inventory/Inventory'
import Reports from './app/pages/reports/Reports'
import Settings from './app/pages/settings/Settings'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;

