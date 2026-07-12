# Guion — Exposición del Sistema en Vivo
## Levantar el sistema
Para mostrar el sistema en funcionamiento necesitamos dos procesos corriendo
al mismo tiempo: el backend y el frontend.

Primero levantamos el backend. Entramos a la carpeta del backend y ejecutamos
el comando de inicio de Strapi. Esto levanta el servidor en localhost:1337 y
desde ese momento la API REST y el panel de administración están disponibles.

//npm run develop

Mientras Strapi arranca, vemos en la terminal cómo se conecta a la base de datos
CocinaBD en MariaDB. Una vez que aparece el mensaje de que el servidor está listo,
Strapi está recibiendo peticiones.

Luego, en otra terminal, levantamos el frontend.

cd onlyfive-web
npm run dev

Vite compila la aplicación React en segundos y la levanta en localhost:5173.
Esos son los dos servicios que tiene que estar corriendo para que el sistema
funcione completo.

## Estructura del proyecto
El frontend vive en la carpeta onlyfive-web. Dentro de src hay dos carpetas
principales: paguinas y componentes.

Las páginas son los contenedores de cada ruta. Tenemos cuatro:
PaginaInicio para la ruta raíz, PaginaInicioSesion para /login,
PaginaDashboardEstudiante para /dashboard, y PaginaPortafolio para /portafolio.

Los componentes están organizados por página. Por ejemplo, todo lo que usa

la página de inicio vive en componentes/inicio: la Navbar, el Hero, el
CarruselPilares, la SeccionActividades, la SeccionChatbot y el Footer.
Cada uno tiene su propio archivo CSS Module con estilos encapsulados.

El archivo que conecta todo es App.jsx. Acá es donde se definen las cuatro
rutas del sistema usando react-router-dom:

```jsx
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/login" element={<PaginaInicioSesion />} />
        <Route path="/dashboard" element={<PaginaDashboard />} />
        <Route path="/portafolio" element={<PaginaPortafolio />} />
      </Routes>
    </BrowserRouter>
  )
}
```
BrowserRouter habilita la navegación sin recarga de página. Cuando el usuario cambia de ruta, React intercambia el contenido del DOM sin tocar el servidor.

## Página de Inicio — localhost:5173
Al abrir el navegador vemos la homepage pública. Esta página no requiere login y es lo que veria cualquier visitante.

Debajo aparece el Hero con el título del programa, una imagen y el slogan.
Todo el texto y las imágenes están definidos directamente en el componente.

La SeccionActividades muestra los trabajos publicados del programa.
Tiene dos filtros desplegables: uno para el ciclo formativo
y otro para el tipo de actividad: Proyectos, Talleres o Eventos.
## Chatbot — SeccionChatbo
Cuando el visitante escribe un mensaje y presiona Enter o el botón de enviar,
el componente hace una petición POST real al backend:
```jsx
const respuesta = await fetch('http://localhost:1337/api/chatbot/responder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ texto: consulta, conversacionId }),
})
```
Strapi recibe el mensaje, genera la respuesta automática y la devuelve.
El componente actualiza el estado de mensajes y la respuesta aparece en
la ventana de chat.

También hay cuatro botones de respuesta rápida para las consultas más
frecuentes: información de la carrera, próximas actividades, requisitos
de admisión, y horarios y talleres. Al hacer clic en cualquiera de esos
botones se llama directamente a la misma función enviarMensaje, evitando
que el usuario tenga que escribir.

El ID de la conversación se guarda en localStorage para que si el visitante
recarga la página, el historial de la sesión se mantenga.

## Login — localhost:5173/login
La página de login divide la pantalla en dos paneles. El panel izquierdo
es una imagen decorativa del programa. El panel derecho tiene el formulario.

El formulario maneja cuatro estados internos con useState: el correo,
la contraseña, si se muestra o no la contraseña en texto claro, y el
estado de carga.

Cuando el usuario envía el formulario, la función manejarEnvio previene
el comportamiento por defecto del navegador, valida que los campos no
estén vacíos, activa el estado de carga y llama a la función alEnviar
que recibe el componente padre.

## Dashboard — localhost:5173/dashboard
El dashboard es la página más importante técnicamente porque es la primera
que consume datos reales de Strapi.

Cuando la página carga, useEffect dispara automáticamente la función
cargarPublicaciones. Lo primero que hace es leer el JWT del localStorage.
Si no hay token, muestra un error. Si hay token, hace dos peticiones
encadenadas al backend.

La primera petición obtiene los datos del usuario autenticado:

```jsx
const respuestaUsuario = await fetch('http://localhost:1337/api/users/me', {
  headers: { Authorization: `Bearer ${jwt}` }
})
```

Con el ID del usuario que devuelve esa petición, hace la segunda:

```jsx
const respuesta = await fetch(
  `http://localhost:1337/api/publicacions?filters[autor][id][$eq]=${usuario.id}&populate=*`,
  { headers: { Authorization: `Bearer ${jwt}` } }
)
```

Strapi valida el JWT, identifica al usuario y devuelve solo sus publicaciones,
no las de todos los estudiantes.

Los datos que llegan de la API pasan por la función normalizarPublicacion
que los convierte al formato que necesitan los componentes:

```jsx
const normalizarPublicacion = (publicacion) => ({
  id: publicacion.id,
  titulo: publicacion.attributes?.titulo || '',
  estado: publicacion.attributes?.estado || 'borrador',
  categoria: publicacion.attributes?.categoria || 'Sin categoria',
  fecha_publicacion: publicacion.attributes?.fecha_publicacion || '',
})
```

Esos datos normalizados van a dos componentes.

TarjetasMetricas los recibe y calcula las métricas en tiempo real usando
filter sobre el array:

```jsx
const totalPublicaciones = publicaciones.length
const publicadas = publicaciones.filter((p) => p.estado === 'publicado').length
const borradores = publicaciones.filter((p) => p.estado === 'borrador').length
```

ListaPublicaciones los recibe y los muestra fila por fila. Tiene tres chips
de filtro internos: Todas, Publicadas y Borradores. Al hacer clic en uno,
el estado filtroActivo cambia y el array se filtra en el cliente sin
ninguna petición adicional al servidor. Las filas con estado borrador
tienen un fondo diferente para que el estudiante las identifique visualmente.

---

## Portafolio — localhost:5173/portafolio
La página de portafolio sigue exactamente la misma lógica que el dashboard
pero en vez de cargar publicaciones directas, carga las publicaciones
asignadas al portafolio del estudiante.

Primero obtiene el usuario con /api/users/me. Luego con ese ID consulta
el portafolio y sus publicaciones asociadas:

```jsx
const respuesta = await fetch(
  `http://localhost:1337/api/portafolios?filters[estudiante][id][$eq]=${usuario.id}&populate=publicaciones`,
  { headers: { Authorization: `Bearer ${jwt}` } }
)
```

El parámetro populate=publicaciones le dice a Strapi que incluya en la
respuesta las publicaciones relacionadas al portafolio, no solo el portafolio
en sí. Esto resuelve en una sola petición la relación N:M entre portafolios
y publicaciones que vimos en la base de datos.

Mientras los datos cargan aparece el texto "Cargando..." y si hay un error
de conexión aparece "Error al cargar portafolio". Una vez que los datos
llegan, se renderizan en una lista con el título, estado, categoría y fecha
de cada publicación.

---
