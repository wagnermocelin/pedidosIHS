import { useState, useEffect } from 'react'
import api from '../services/api'
import { Plus, Edit, Trash, X } from 'lucide-react'

export default function Items() {
  const [items, setItems] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    preferredSupplierId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [itemsRes, suppliersRes] = await Promise.all([
        api.get('/items'),
        api.get('/suppliers')
      ])
      setItems(itemsRes.data)
      setSuppliers(suppliersRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleOpenModal(item = null) {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        unit: item.unit,
        preferredSupplierId: item.preferredSupplierId || ''
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: '',
        unit: '',
        preferredSupplierId: ''
      })
    }
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setEditingItem(null)
    setFormData({
      name: '',
      unit: '',
      preferredSupplierId: ''
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      const dataToSend = {
        ...formData,
        preferredSupplierId: formData.preferredSupplierId ? parseInt(formData.preferredSupplierId) : null
      }

      if (editingItem) {
        await api.put(`/items/${editingItem.id}`, dataToSend)
      } else {
        await api.post('/items', dataToSend)
      }
      
      handleCloseModal()
      loadData()
    } catch (error) {
      console.error('Erro ao salvar item:', error)
      alert(error.response?.data?.error || 'Erro ao salvar item')
    }
  }

  async function handleDelete(itemId) {
    if (!confirm('Tem certeza que deseja deletar este item?')) return
    
    try {
      await api.delete(`/items/${itemId}`)
      loadData()
    } catch (error) {
      console.error('Erro ao deletar item:', error)
      alert(error.response?.data?.error || 'Erro ao deletar item')
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Itens</h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </button>
      </div>

      <div className="grid gap-4">
        {items.map(item => (
          <div key={item.id} className="card flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-gray-600">Unidade: {item.unit}</p>
              {item.preferredSupplier && (
                <p className="text-sm text-gray-500">
                  Fornecedor preferencial: {item.preferredSupplier.name}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleOpenModal(item)} className="btn btn-secondary text-sm">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="btn btn-danger text-sm">
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Editar Item' : 'Novo Item'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Item *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Ex: Tomate"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidade *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="kg">Quilograma (kg)</option>
                  <option value="g">Grama (g)</option>
                  <option value="l">Litro (l)</option>
                  <option value="ml">Mililitro (ml)</option>
                  <option value="unidade">Unidade</option>
                  <option value="caixa">Caixa</option>
                  <option value="pacote">Pacote</option>
                  <option value="saco">Saco</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fornecedor Preferencial
                </label>
                <select
                  value={formData.preferredSupplierId}
                  onChange={(e) => setFormData({ ...formData, preferredSupplierId: e.target.value })}
                  className="input"
                >
                  <option value="">Nenhum</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingItem ? 'Salvar Alterações' : 'Criar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
