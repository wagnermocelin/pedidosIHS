import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { 
  ShoppingCart, 
  Package, 
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentRequests, setRecentRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      const [statsRes, requestsRes] = await Promise.all([
        api.get('/history/stats'),
        api.get('/purchase-requests?limit=5')
      ])
      setStats(statsRes.data)
      setRecentRequests(requestsRes.data.slice(0, 5))
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = stats ? [
    {
      name: 'Pendentes',
      value: stats.byStatus.PENDING,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Pedidos',
      value: stats.byStatus.ORDERED,
      icon: ShoppingCart,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      name: 'Comprados',
      value: stats.byStatus.PURCHASED,
      icon: Package,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      name: 'Recebidos',
      value: stats.byStatus.RECEIVED,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
  ] : []

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'badge-pending',
      ORDERED: 'badge-ordered',
      PURCHASED: 'badge-purchased',
      RECEIVED: 'badge-received',
      CANCELLED: 'badge-cancelled',
    }
    const labels = {
      PENDING: 'Pendente',
      ORDERED: 'Pedido',
      PURCHASED: 'Comprado',
      RECEIVED: 'Recebido',
      CANCELLED: 'Cancelado',
    }
    return (
      <span className={`badge ${badges[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Visão geral do sistema de pedidos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Requests */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Pedidos Recentes</h2>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>

        {recentRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhum pedido encontrado
          </p>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {request.item.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {request.quantity} {request.item.unit} • 
                    Solicitado por {request.requester.name}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(request.status)}
                  <span className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {user?.role === 'COLABORADOR' && (
        <div className="card bg-primary-50 border-2 border-primary-200">
          <h3 className="font-medium text-primary-900 mb-2">Ação Rápida</h3>
          <p className="text-sm text-primary-700 mb-4">
            Crie um novo pedido de compra rapidamente
          </p>
          <a
            href="/pedidos"
            className="btn btn-primary inline-block"
          >
            Novo Pedido
          </a>
        </div>
      )}
    </div>
  )
}
