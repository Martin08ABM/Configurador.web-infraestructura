import { type Servicio } from '@/lib/servicios'

export default function ServicioCard({servicio, seleccionado, onClick}: {
  servicio: Servicio
  seleccionado: boolean
  onClick: () => void
}){
  return (
    <div 
      onClick={onClick} 
      className={`
        relative cursor-pointer rounded-xl p-5 border-2 transition-all duration-200
        bg-[#111111] hover:bg-[#181818]
        ${seleccionado 
          ? 'border-[#4a7cf5] shadow-[0_0_20px_rgba(74,124,245,0.15)]' 
          : 'border-white/10 hover:border-white/20'
        }
      `}
    >
      {seleccionado && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#4a7cf5] flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}

      <h3 className="text-white font-semibold text-base mb-1" style={{fontFamily: 'var(--font-display)'}}>
        {servicio.nombre}
      </h3>

      <p className="text-[#6b7280] text-sm leading-relaxed mb-3">
        {servicio.descripcion}
      </p>

      <span className="inline-block font-mono text-xs text-[#6b7280] border border-white/10 px-2 py-0.5 rounded-full">
        Sustituye a: {servicio.alternativa}
      </span>
    </div>
  )
}