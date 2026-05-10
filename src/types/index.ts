export type DatosEmpresa = {
    nombreRazonSocial: string
    cifDni: string
    direccion: string
    email: string
    personaContacto: string
    telefono: string
}

export type Pedido = {
    id: string
    servicios: string[]
    datos: DatosEmpresa
    precioSetup: number
    precioMantenimiento: number
    estado: 'pendiente' | 'pagado' | 'cancelado'
    stripeSessionId: string
    creadoEn: string
}
