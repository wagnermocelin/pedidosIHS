export default function BackgroundLogo() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Logo central com opacidade baixa */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/logo.png" 
          alt="Logo IHS" 
          className="w-96 h-96 object-contain opacity-5"
          onError={(e) => {
            // Se a imagem não carregar, esconder o elemento
            e.target.style.display = 'none'
          }}
        />
      </div>
      
      {/* Logo no canto superior direito (menor) */}
      <div className="absolute top-4 right-4 opacity-3">
        <img 
          src="/logo.png" 
          alt="Logo IHS" 
          className="w-32 h-32 object-contain"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>
      
      {/* Logo no canto inferior esquerdo (menor) */}
      <div className="absolute bottom-4 left-4 opacity-3">
        <img 
          src="/logo.png" 
          alt="Logo IHS" 
          className="w-32 h-32 object-contain"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>
    </div>
  )
}
