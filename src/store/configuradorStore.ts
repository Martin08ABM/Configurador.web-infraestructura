import { create } from 'zustand'
import type { DatosEmpresa } from '@/types'
import type { PlanMantenimiento } from '@/lib/precio'

interface ConfiguradorStore {
    serviciosSeleccionados: string[]
    toggleServicio: (id: string) => void
    datosEmpresa: DatosEmpresa | null
    setDatosEmpresa: (datos: DatosEmpresa) => void
    planMantenimiento: PlanMantenimiento
    setPlanMantenimiento: (plan: PlanMantenimiento) => void
    reset: () => void
}

export const useConfiguradorStore = create<ConfiguradorStore>()((set, get) => ({
    serviciosSeleccionados: [],
    datosEmpresa: null,
    planMantenimiento: 'basico',

    toggleServicio: (id) => {
        const { serviciosSeleccionados } = get()
        set({
            serviciosSeleccionados: serviciosSeleccionados.includes(id)
                ? serviciosSeleccionados.filter(s => s !== id)
                : [...serviciosSeleccionados, id],
        })
    },

    setDatosEmpresa: (datos) => set({ datosEmpresa: datos }),

    setPlanMantenimiento: (plan) => set({ planMantenimiento: plan }),

    reset: () => set({ serviciosSeleccionados: [], datosEmpresa: null, planMantenimiento: 'basico' }),
}))
