import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Scan from '../pages/Scan'
import Assets from '../pages/Assets'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/assets" element={<Assets />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes