import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Plus, Edit, Trash, X, Eye, EyeOff, Shield } from 'lucide-react'

export default function Users() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'COLABORADOR'
  })

  const roles = [
    { value: 'ADMIN', label: 'Administrador', color: 'red' },
    { value: 'COLABORADOR', label: 'Colaborador', color: 'blue' },
    { value: 'COMPRADOR', label: 'Comprador', color: 'green' },
    { value: 'ESTOQUISTA', label: 'Estoquista', color: 'purple' }
  ]

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      alert('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  function handleOpenModal(user = null) {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      })
    } else {
      setEditingUser(null)
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'COLABORADOR'
      })
    }
    setShowModal(true)
    setShowPassword(false)
  }

  function handleCloseModal() {
    setShowModal(false)
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'COLABORADOR'
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      if (editingUser) {
        // Atualizar usuário
        const dataToUpdate = { ...formData }
        if (!dataToUpdate.password) {
          delete dataToUpdate.password // Não atualizar senha se estiver vazia
        }
        await api.put(`/users/${editingUser.id}`, dataToUpdate)
      } else {
        // Criar novo usuário
        await api.post('/users', formData)
      }
      
      handleCloseModal()
      loadUsers()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      alert(error.response?.data?.error || 'Erro ao salvar usuário')
    }
  }

  async function handleDelete(userId) {
    if (userId === currentUser.id) {
      alert('Você não pode deletar seu próprio usuário!')
      return
    }

    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
      return
    }

    try {
      await api.delete(`/users/${userId}`)
      loadUsers()
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      alert(error.response?.data?.error || 'Erro ao deletar usuário')
    }
  }

  function getRoleBadge(role) {
    const roleInfo = roles.find(r => r.value === role)
    const colors = {
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800'
    }
    
    return (
      <span className={`badge ${colors[roleInfo?.color || 'blue']}`}>
        {roleInfo?.label || role}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-gray-600 mt-1">Administre usuários e suas permissões de acesso</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {roles.map(role => {
          const count = users.filter(u => u.role === role.value).length
          const colors = {
            red: 'bg-red-50 border-red-200',
            blue: 'bg-blue-50 border-blue-200',
            green: 'bg-green-50 border-green-200',
            purple: 'bg-purple-50 border-purple-200'
          }
          return (
            <div key={role.value} className={`p-4 rounded-lg border-2 ${colors[role.color]}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{role.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                </div>
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Lista de Usuários */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {user.id === currentUser.id && (
                            <span className="ml-2 text-xs text-gray-500">(Você)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Deletar"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar/Editar Usuário */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nome Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                  placeholder="Ex: Maria Silva"
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  required
                  placeholder="usuario@exemplo.com"
                />
              </div>

              <div>
                <label className="label">
                  Senha {editingUser && '(deixe em branco para não alterar)'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="input pr-10"
                    required={!editingUser}
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {!editingUser && (
                  <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
                )}
              </div>

              <div>
                <label className="label">Permissão de Acesso</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="input"
                  required
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p><strong>Administrador:</strong> Acesso total ao sistema</p>
                  <p><strong>Colaborador:</strong> Criar pedidos de compra</p>
                  <p><strong>Comprador:</strong> Processar e comprar pedidos</p>
                  <p><strong>Estoquista:</strong> Confirmar recebimento</p>
                </div>
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
                  {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
