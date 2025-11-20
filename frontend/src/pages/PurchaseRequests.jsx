import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Plus, Mic, Filter, X } from 'lucide-react'
import { useVoice } from '../hooks/useVoice'

export default function PurchaseRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [items, setItems] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: '',
    unitPrice: '',
    notes: ''
  })

  const { start: startVoice, stop: stopVoice, listening } = useVoice(handleVoiceResult)

  useEffect(() => {
    loadData()
  }, [filter])

  async function loadData() {
    try {
      const endpoint = filter === 'ALL' 
        ? '/purchase-requests' 
        : `/purchase-requests?status=${filter}`
      
      const [requestsRes, itemsRes, suppliersRes] = await Promise.all([
        api.get(endpoint),
        api.get('/items'),
        api.get('/suppliers')
      ])
      
      setRequests(requestsRes.data)
      setItems(itemsRes.data)
      setSuppliers(suppliersRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await api.post('/purchase-requests', formData)
      setShowModal(false)
      setFormData({ itemId: '', quantity: '', unitPrice: '', notes: '' })
      loadData()
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao criar pedido')
    }
  }

  async function handleStatusChange(id, action, data = {}) {
    try {
      await api.post(`/purchase-requests/${id}/${action}`, data)
      loadData()
    } catch (error) {
      console.error(`Erro ao ${action}:`, error)
      alert(`Erro ao executar ação: ${error.response?.data?.error || 'Erro desconhecido'}`)
    }
  }

  function handleVoiceResult(text) {
    console.log('Voz capturada:', text)
    // Aqui você pode integrar com a API de IA
    api.post('/ai/parse-voice', { text })
      .then(res => {
        console.log('Sugestões:', res.data.suggestions)
        // Implementar lógica para preencher formulário com sugestões
      })
      .catch(err => console.error('Erro ao processar voz:', err))
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { class: 'badge-pending', label: 'Pendente' },
      ORDERED: { class: 'badge-ordered', label: 'Pedido' },
      PURCHASED: { class: 'badge-purchased', label: 'Comprado' },
      RECEIVED: { class: 'badge-received', label: 'Recebido' },
      CANCELLED: { class: 'badge-cancelled', label: 'Cancelado' },
    }
    const badge = badges[status]
    return <span className={`badge ${badge.class}`}>{badge.label}</span>
  }

  const canCreateRequest = user?.role === 'COLABORADOR' || user?.role === 'ADMIN'
  const canOrder = user?.role === 'COMPRADOR' || user?.role === 'ADMIN'
  const canReceive = user?.role === 'ESTOQUISTA' || user?.role === 'ADMIN'

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pedidos de Compra</h1>
        <div className="flex space-x-3">
          {canCreateRequest && (
            <>
              <button
                onClick={listening ? stopVoice : startVoice}
                className={`btn ${listening ? 'btn-danger' : 'btn-secondary'}`}
              >
                <Mic className="w-4 h-4 mr-2" />
                {listening ? 'Parar' : 'Voz'}
              </button>
              <button onClick={() => setShowModal(true)} className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Novo Pedido
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['ALL', 'PENDING', 'ORDERED', 'PURCHASED', 'RECEIVED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              filter === status ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {status === 'ALL' ? 'Todos' : status}
          </button>
        ))}
      </div>

      {/* Lista de Pedidos */}
      <div className="grid gap-4">
        {requests.map(request => (
          <div key={request.id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold">{request.item.name}</h3>
                <p className="text-gray-600">
                  {request.quantity} {request.item.unit}
                  {request.unitPrice && ` • R$ ${request.unitPrice.toFixed(2)}`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Por: {request.requester.name} • {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                </p>
                {request.notes && (
                  <p className="text-sm text-gray-600 mt-2 italic">{request.notes}</p>
                )}
              </div>
              <div className="flex flex-col items-end space-y-2">
                {getStatusBadge(request.status)}
                
                {/* Ações baseadas no status e role */}
                {request.status === 'PENDING' && canOrder && (
                  <button
                    onClick={() => {
                      const supplierId = request.item.preferredSupplierId || suppliers[0]?.id
                      if (supplierId) {
                        handleStatusChange(request.id, 'order', { supplierId })
                      } else {
                        alert('Selecione um fornecedor')
                      }
                    }}
                    className="btn btn-primary text-sm"
                  >
                    Fazer Pedido
                  </button>
                )}
                
                {request.status === 'ORDERED' && canOrder && (
                  <button
                    onClick={() => handleStatusChange(request.id, 'purchase')}
                    className="btn btn-success text-sm"
                  >
                    Marcar Comprado
                  </button>
                )}
                
                {request.status === 'PURCHASED' && canReceive && (
                  <button
                    onClick={() => handleStatusChange(request.id, 'receive')}
                    className="btn btn-success text-sm"
                  >
                    Confirmar Recebimento
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo Pedido */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Novo Pedido</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Item</label>
                <select
                  value={formData.itemId}
                  onChange={e => setFormData({...formData, itemId: e.target.value})}
                  className="input"
                  required
                >
                  <option value="">Selecione...</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label">Quantidade</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label className="label">Preço Unitário (opcional)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={e => setFormData({...formData, unitPrice: e.target.value})}
                  className="input"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="label">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="input"
                  rows="3"
                />
              </div>
              
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Criar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
