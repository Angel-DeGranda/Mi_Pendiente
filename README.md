# Mi Pendiente

> Aplicación web para gestión de tareas académicas con notificaciones por correo electrónico.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)

## 📌 Descripción

Mi Pendiente es una aplicación web personal diseñada para estudiantes que necesitan organizar sus tareas además de tareas las cuales no implican una asignación en la plataforma de su institución, con recordatorios automáticos por correo electrónico antes de las fechas de entrega.

## 📸 Capturas de pantalla

![Dashboard](ruta-o-url-de-la-imagen)
![Tareas](ruta-o-url-de-la-imagen)
![Configuración](ruta-o-url-de-la-imagen)

## 🚀 Demo

🔗 [Ver aplicación en vivo](url-del-deploy)

### Credenciales de prueba

| Campo | Valor |
|-------|-------|
| Correo | correo-de-prueba@gmail.com |
| Contraseña | contraseña-de-prueba |

## ✨ Funcionalidades

- **Autenticación** — Inicio y cierre de sesión seguro con cookies httpOnly
- **Materias** — Crear, editar y eliminar materias con días de clase
- **Tareas** — Crear, editar, completar y eliminar tareas por materia con prioridad y hora de entrega
- **Filtros** — Filtrar tareas por prioridad, estado y materia
- **Dashboard** — Resumen de tareas, estadísticas y calendario interactivo
- **Perfil** — Personalización de nombre y saludo
- **Preferencias** — Configuración de días de anticipación para notificaciones
- **Notificaciones** — Correo automático de recordatorio (8am) y aviso de vencimiento (9am)

## 🛠️ Tecnologías

| Tecnología | Uso |
|------------|-----|
| Node.js + Express | Servidor y API REST |
| Supabase | Base de datos y autenticación |
| Nodemailer | Envío de correos electrónicos |
| node-cron | Programación de tareas automáticas |
| FullCalendar | Calendario interactivo en el dashboard |
| HTML, CSS, JS | Frontend sin frameworks |

## ⚙️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Angel-DeGranda/Mi_Pendiente.git

# Entrar al directorio
cd Mi_Pendiente

# Instalar dependencias
npm install express @supabase/supabase-js cookie-parser dotenv node-cron nodemailer path

# Instalar dependencias de desarrollo
npm install -D nodemon

# Modo desarrollo
npm run dev

# Iniciar el servidor
npm start
```

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_anon_key
SUPABASE_SERVICE_KEY=tu_service_role_key
PORT=puerto_para_el_servidor
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
```

## 👨‍💻 Autor

**Ángel De Granda**

[![GitHub](https://img.shields.io/badge/GitHub-Angel__DeGranda-181717?logo=github)](https://github.com/Angel-DeGranda)

## 📄 Licencia

Este proyecto está bajo la licencia [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
Puedes usar y compartir este proyecto siempre que no sea con fines comerciales y se dé crédito al autor.
