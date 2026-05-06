import { create } from "zustand"

interface DatosEmpresa {
    nombre: string
    cif: string
    email: string
    telefono: string
    direccion: string
    contacto: string
}

interface ConfiguradorStore {
    // Recoger los serivicios elegidos
    serviciosSeleccionados: string[]
    toggleServicio: (id: string) => void
    precioTotal: () => number

    // Recoger los datos de la empresa
    datosEmpresa: DatosEmpresa | null
    setDatosEmpresa: (datos: DatosEmpresa) => void

    // Reset
    reset: () => void
}

const PRECIO_BASE = 160
const PRECIO_EXTRA = 5
const SERVICIOS_INCLUIDOS = 5

export const useConfiguradorStore = create<ConfiguradorStore>((set, get) => ({
    serviciosSeleccionados: [],
    datosEmpresa: null,

    toggleServicio: (id) => {
        const { serviciosSeleccionados } = get()
        const yaSeleccionado = serviciosSeleccionados.includes(id)

        set({
            serviciosSeleccionados: yaSeleccionado
                ? serviciosSeleccionados.filter((s) => s !== id)
                : [...serviciosSeleccionados, id]
        })
    },

    precioTotal: () => {
        const { serviciosSeleccionados } = get()
        const extras = Math.max(0, serviciosSeleccionados.length - SERVICIOS_INCLUIDOS)
        return PRECIO_BASE + extras * PRECIO_EXTRA
    },

    setDatosEmpresa: (datos) => set({ datosEmpresa: datos }),

    reset: () => set({ serviciosSeleccionados: [], datosEmpresa: null })
}))