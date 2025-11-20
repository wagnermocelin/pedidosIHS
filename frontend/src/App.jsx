import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PurchaseRequests from './pages/PurchaseRequests'
import Items from './pages/Items'
import Suppliers from './pages/Suppliers'
import History from './pages/History'
import Users from './pages/Users'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="pedidos" element={<PurchaseRequests />} />
            <Route path="itens" element={<Items />} />
            <Route path="fornecedores" element={<Suppliers />} />
            <Route path="usuarios" element={<Users />} />
            <Route path="historico" element={<History />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
