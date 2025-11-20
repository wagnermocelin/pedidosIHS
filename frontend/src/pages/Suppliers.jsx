import { useState, useEffect } from 'react'
import api from '../services/api'
import { Plus, Edit, Trash, Phone, Mail, X } from 'lucide-react'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  })

  useEffect(() => {
    loadSuppliers()
  }, [])

  async function loadSuppliers() {
    try {
      const response = await api.get('/suppliers')
      setSuppliers(response.data)
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleOpenModal(supplier = null) {
    if (supplier) {
      setEditingSupplier(supplier)
      setFormData({
        name: supplier.name,
        phone: supplier.phone || '',
        email: supplier.email || '',
        notes: supplier.notes || ''
      })
    } else {
      setEditingSupplier(null)
      setFormData({
        name: '',
        phone: '',
        email: '',
        notes: ''
      })
    }
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setEditingSupplier(null)
    setFormData({
      name: '',
      phone: '',
      email: '',
      notes: ''
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      const dataToSend = {
        ...formData,
        phone: formData.phone || null,
        email: formData.email || null,
        notes: formData.notes || null
      }

      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.id}`, dataToSend)
      } else {
        await api.post('/suppliers', dataToSend)
      }
      
      handleCloseModal()
      loadSuppliers()
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error)
      alert(error.response?.data?.error || 'Erro ao salvar fornecedor')
    }
  }

  async function handleDelete(supplierId) {
    if (!confirm('Tem certeza que deseja deletar este fornecedor?')) return
    
    try {
      await api.delete(`/suppliers/${supplierId}`)
      loadSuppliers()
    } catch (error) {
      console.error('Erro ao deletar fornecedor:', error)
      alert(error.response?.data?.error || 'Erro ao deletar fornecedor')
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fornecedores</h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Fornecedor
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{supplier.name}</h3>
              <div className="flex space-x-2">
                <button onClick={() => handleOpenModal(supplier)} className="btn btn-secondary text-sm p-2">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(supplier.id)} className="btn btn-danger text-sm p-2">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {supplier.phone && (
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Phone className="w-4 h-4 mr-2" />
                {supplier.phone}
              </div>
            )}
            
            {supplier.email && (
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Mail className="w-4 h-4 mr-2" />
                {supplier.email}
              </div>
            )}
            
            {supplier.notes && (
              <p className="text-sm text-gray-500 mt-2 italic">{supplier.notes}</p>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Ex: Hortifruti Verdão"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input"
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  placeholder="contato@fornecedor.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="Informações adicionais sobre o fornecedor..."
                />
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
                  {editingSupplier ? 'Salvar Alterações' : 'Criar Fornecedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
