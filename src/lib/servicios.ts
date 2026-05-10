export type Servicio = {
    id: string,
    nombre: string,
    descripcion: string,
    alternativa: string,
    categoria: string
}

export const servicios: Servicio[] = [
    {
        id: "nextcloud",
        nombre: "Nextcloud",
        descripcion: "Almacenamiento y colaboración privada en la nube",
        alternativa: "Google Workspace",
        categoria: "general"
    },
    {
        id: "vaultwarden",
        nombre: "Vaultwarden",
        descripcion: "Generador y gestor de contraseñas de código abierto y autoalojado",
        alternativa: "Bitwarden",
        categoria: "general"
    },
    {
        id: "listmonk",
        nombre: "Listmonk",
        descripcion: "Envío de newsletters y emails masivo",
        alternativa: "Mailchimp",
        categoria: "general"
    },
    {
        id: "appflowy",
        nombre: "AppFlowy",
        descripcion: "Creación de documentos, bases de datos y notas con actualizaciones frecuentes",
        alternativa: "Notion",
        categoria: "general"
    },
    {
        id: "supabase",
        nombre: "Supabase (autoalojado)",
        descripcion: "De las plataformas más populares para crear bases de datos, potenciada con PostgreSQL, con autenticación y más",
        alternativa: "Supabase (Cloud)",
        categoria: "desarrollo"
    },
    {
        id: "gitea",
        nombre: "Gitea",
        descripcion: "Guarda todos tus proyectos como en Github, pero controlado por tí",
        alternativa: "Github",
        categoria: "desarrollo"
    },
    {
        id: "n8n",
        nombre: "n8n",
        descripcion: "Automatización de flujos de trabajo",
        alternativa: "n8n alojado en servicios de terceros",
        categoria: "desarrollo"
    },
    {
        id: "plausible",
        nombre: "Plausible",
        descripcion: "Aquí puedes ver las estadísticas de cuantos usuarios visitan tu web, con filtros para organizarlos por país, dispositivo y más",
        alternativa: "Google Analytics",
        categoria: "desarrollo"
    },
    {
        id: "mattermost",
        nombre: "Mattermost",
        descripcion: "Chat de equipo con posibilidad de crear canales, enviar mensajes directos y archivos",
        alternativa: "Slack",
        categoria: "productividad"
    },
    {
        id: "element",
        nombre: "Element",
        descripcion: "Con este servicio podrás tener llamadas y chats directos con tu equipo de trabajo o con quien tu quieras",
        alternativa: "Google Meet/Zoom",
        categoria: "productividad"
    },
    {
        id: "paperless-ngx",
        nombre: "Paperless-ngx",
        descripcion: "Podrás gestionar documentos físicos que hayas escaneado. Si escaneas un recibo o factura, se sube automáticamente y se clasifica",
        alternativa: "Gestión manual de documentos",
        categoria: "productividad"
    },
    {
        id: "kimai",
        nombre: "Kimai",
        descripcion: "Control de horas dedicadas a un proyecto o cliente",
        alternativa: "Toggl / Clockify",
        categoria: "productividad"
    },
]
    