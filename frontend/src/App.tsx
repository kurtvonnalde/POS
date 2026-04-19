import { Routes, Route } from 'react-router-dom'
import Header from './component/Header'
import Footer from './component/Footer'
import Login from './app/Login'
import Register from './app/Registration'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;

