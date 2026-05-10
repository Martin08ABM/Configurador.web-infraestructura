import { create } from 'zustand'
import type { DatosEmpresa } from '@/types'

interface ConfiguradorStore {
    serviciosSeleccionados: string[]
    toggleServicio: (id: string) => void
    datosEmpresa: DatosEmpresa | null
    setDatosEmpresa: (datos: DatosEmpresa) => void
    reset: () => void
}

export const useConfiguradorStore = create<ConfiguradorStore>()((set, get) => ({
    serviciosSeleccionados: [],
    datosEmpresa: null,

    toggleServicio: (id) => {
        const { serviciosSeleccionados } = get()
        set({
            serviciosSeleccionados: serviciosSeleccionados.includes(id)
                ? serviciosSeleccionados.filter(s => s !== id)
                : [...serviciosSeleccionados, id],
        })
    },

    setDatosEmpresa: (datos) => set({ datosEmpresa: datos }),

    reset: () => set({ serviciosSeleccionados: [], datosEmpresa: null }),
}))
