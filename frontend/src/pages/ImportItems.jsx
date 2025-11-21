import { useState } from 'react'
import { Upload, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'

export default function ImportItems() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validar tipo de arquivo
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      if (!validTypes.includes(selectedFile.type)) {
        setError('Por favor, selecione um arquivo Excel (.xls ou .xlsx)')
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError('')
      setResult(null)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get('/import/template', {
        responseType: 'blob'
      })
      
      // Criar link para download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'template_importacao_itens.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Erro ao baixar template:', error)
      setError('Erro ao baixar template')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/import/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setResult(response.data)
      setFile(null)
      // Limpar input
      document.getElementById('file-input').value = ''
    } catch (error) {
      console.error('Erro ao importar:', error)
      setError(error.response?.data?.error || 'Erro ao importar arquivo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Importar Itens</h1>
      </div>

      {/* Card de instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900">Como importar itens</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ol className="list-decimal list-inside space-y-1">
                <li>Baixe o template de planilha Excel</li>
                <li>Preencha: <strong>nome</strong> (obrigatório), <strong>unidade</strong> (obrigatório) e <strong>fornecedor</strong> (opcional)</li>
                <li>Salve o arquivo e faça o upload abaixo</li>
                <li>Aguarde o processamento e verifique o resultado</li>
              </ol>
              <p className="mt-2 text-xs">
                <strong>Dica:</strong> O fornecedor será buscado automaticamente pelo nome. Se não encontrado, o item será criado sem fornecedor preferencial.
              </p>
            </div>
            <div className="mt-3">
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card de upload */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload de Arquivo</h2>
        
        <div className="space-y-4">
          {/* Input de arquivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o arquivo Excel
            </label>
            <input
              id="file-input"
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Arquivo selecionado: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Botão de upload */}
          <div>
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Importar Arquivo
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Resultado da importação */}
      {result && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Resultado da Importação</h2>
          
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total de Linhas</p>
              <p className="text-2xl font-bold text-gray-900">{result.summary.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">Sucesso</p>
              <p className="text-2xl font-bold text-green-900">{result.summary.success}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600">Erros</p>
              <p className="text-2xl font-bold text-red-900">{result.summary.errors}</p>
            </div>
          </div>

          {/* Lista de sucessos */}
          {result.results.success.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Itens Importados com Sucesso ({result.results.success.length})
              </h3>
              <div className="bg-green-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <ul className="space-y-2">
                  {result.results.success.map((item, index) => (
                    <li key={index} className="text-sm text-green-800">
                      <span className="font-medium">Linha {item.row}:</span> {item.item.name} 
                      <span className="ml-2 text-xs bg-green-200 px-2 py-0.5 rounded">
                        {item.action === 'created' ? 'Criado' : 'Atualizado'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Lista de erros */}
          {result.results.errors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                Erros Encontrados ({result.results.errors.length})
              </h3>
              <div className="bg-red-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <ul className="space-y-2">
                  {result.results.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-800">
                      <span className="font-medium">Linha {error.row}:</span> {error.error}
                      {error.data && (
                        <div className="ml-4 mt-1 text-xs text-red-600">
                          Dados: {JSON.stringify(error.data)}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
