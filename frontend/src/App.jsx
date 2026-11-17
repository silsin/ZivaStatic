import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OrderPage from './pages/OrderPage'
import DashboardPage from './pages/DashboardPage'
import ServerDetailPage from './pages/ServerDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/servers/:id" element={<ProtectedRoute><ServerDetailPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
