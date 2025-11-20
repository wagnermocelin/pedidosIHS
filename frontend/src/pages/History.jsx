import { useState, useEffect } from 'react'
import api from '../services/api'
import { Clock, User } from 'lucide-react'

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  async function loadHistory() {
    try {
      const response = await api.get('/history')
      setHistory(response.data)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionLabel = (action) => {
    const labels = {
      CREATED: 'Criado',
      ORDERED: 'Pedido Enviado',
      PURCHASED: 'Comprado',
      RECEIVED: 'Recebido',
      CANCELLED: 'Cancelado',
    }
    return labels[action] || action
  }

  const getActionColor = (action) => {
    const colors = {
      CREATED: 'text-blue-600',
      ORDERED: 'text-purple-600',
      PURCHASED: 'text-green-600',
      RECEIVED: 'text-green-700',
      CANCELLED: 'text-red-600',
    }
    return colors[action] || 'text-gray-600'
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Histórico de Ações</h1>

      <div className="space-y-3">
        {history.map(entry => (
          <div key={entry.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`font-bold ${getActionColor(entry.action)}`}>
                    {getActionLabel(entry.action)}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium">{entry.pr.item.name}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {entry.user.name}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(entry.createdAt).toLocaleString('pt-BR')}
                  </div>
                </div>
                
                {entry.notes && (
                  <p className="text-sm text-gray-500 mt-2 italic">{entry.notes}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
