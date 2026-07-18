# Guion — Diagramas de Flujo y Base de Datos


### Inicio de Sesión

Este es el punto de entrada al área privada del sistema.

El proceso arranca cuando el estudiante ingresa al sistema y accede a la pantalla
de login. Ahí escribe su correo electrónico institucional y su contraseña, y presiona
el botón de ingresar.

En ese momento el sistema evalúa si las credenciales son correctas comparándolas
contra los datos registrados en la base de datos a través de Strapi.

Si las credenciales son incorrectas, el sistema muestra un mensaje de error y
el estudiante puede volver a intentarlo.

Si son correctas, el sistema le da acceso al Dashboard, donde puede ver sus
publicaciones y métricas personales.

### Gestión de Publicaciones

Este flujo representa el ciclo de vida completo de un trabajo académico dentro
del sistema.

Todo empieza cuando el estudiante crea una publicación desde su panel.
Al guardarla, el sistema la registra automáticamente con el estado "borrador",
lo que significa que todavía no es visible al público.

Desde ahí, el docente entra al panel de administración de Strapi, revisa el
contenido y toma una decisión.

Si lo aprueba, cambia el estado a "publicado" y la publicación aparece
inmediatamente en la sección de Actividades del sitio web, visible para cualquier
visitante.

Si no lo aprueba, cambia el estado a "archivado". La publicación no se elimina
pero deja de estar en revisión. El estudiante puede editarla y volver a enviarla
cuando la corrija.

En ambos casos el flujo termina, pero solo el camino de aprobación hace el
trabajo visible al público.

### Gestión de Portafolios

Este flujo describe cómo un estudiante construye y comparte su portafolio digital.

El estudiante ingresa a su sección de portafolio y empieza a agregar
publicaciones. Puede elegir cuáles de sus trabajos quiere mostrar y en qué orden
aparecen.

Una vez que tiene el contenido que quiere, guarda los cambios.

Después viene la decisión clave: ¿el portafolio es público?

Si el estudiante lo marca como público, el sistema genera un enlace compartible
usando el campo slug_compartible, y ese portafolio es visible para cualquier persona
que tenga el enlace, sin necesidad de tener una cuenta.

Si lo deja como privado, el portafolio existe en el sistema pero solo él puede verlo.

Ese enlace compartible es lo que funciona como el currículum gastronómico digital
del estudiante.

### Funcionamiento del Chatbot

Este flujo muestra cómo el chatbot ChefBot IA atiende las consultas de los visitantes.

Cuando un visitante tiene una pregunta sobre el programa, hace clic en el ícono
del chatbot y escribe su mensaje en el campo de texto.

Al enviar el mensaje, el sistema lo recibe y lo procesa a través de la API.
El endpoint /api/chatbot/responder toma el texto, lo evalúa y genera una respuesta
automática.

Esa respuesta aparece en la ventana de conversación en menos de cinco segundos.

Todo el intercambio queda registrado en la base de datos: la conversación en la
tabla conversacion_chats y cada mensaje individual en la tabla mensaje_chats,
con el campo "emisor" indicando si fue el usuario o el bot quien lo escribió.

Esto permite que el docente pueda revisar después qué preguntas se hacen más
y mejorar las respuestas del chatbot con el tiempo.

## Base de Datos

La base de datos del sistema se llama CocinaBD y corre en MariaDB 10.4,
Fue generada automáticamente por Strapi v4 que es un framework de backend para Node.js que nos permite crear APIs y gestionar la base de datos de manera sencilla.
Algo importante de aclarar antes de hablar de las tablas: en este proyecto no creamos la base de datos escribiendo SQL manualmente. En cambio, usamos Strapi, que es el backend del sistema. Cuando nosotros definimos desde el panel de Strapi qué información iba a manejar el sistema — publicaciones, portafolios, usuarios, chatbot — Strapi tradujo esas definiciones automáticamente en tablas reales dentro de MariaDB.
Pero Strapi no solo crea las tablas del negocio. También genera automáticamente un conjunto grande de tablas propias para su funcionamiento interno: tablas para gestionar los administradores del panel, los roles y permisos, los tokens de acceso a la API, la configuración del sistema, los archivos subidos, entre otras. Si uno abre phpMyAdmin y ve la base de datos completa, va a encontrar muchas más tablas de las que diseñamos nosotros.

### Las cinco tablas principales

**UP_USERS** es la tabla que almacena a todos los usuarios registrados en el sistema.
Guarda el nombre de usuario, el correo que usan para el login, y la contraseña
encriptada con bcrypt, lo que significa que ni el administrador puede ver la
contraseña real. También tiene campos para saber si la cuenta está confirmada
o bloqueada.

**PUBLICACIONS** es la tabla central del sistema. Aquí se guarda cada trabajo
académico que sube un estudiante: su título, descripción, el estado en que se
encuentra, la categoría, el ciclo formativo del autor, el tipo de actividad, el taller
y el docente responsable. El estado puede ser borrador, publicado o archivado,
y ese campo es el que controla si el trabajo es visible al público o no.

**PORTAFOLIOS** almacena el portafolio digital de cada estudiante. Tiene un campo
llamado slug_compartible que genera el enlace único del portafolio, y el campo
es_publico que controla si ese enlace es accesible sin login.

**CONVERSACION_CHATS** registra cada sesión de conversación que se inicia con el
chatbot. 
Guarda un identificador único de la sesión y el nombre del visitante que
inició el chat.

**MENSAJE_CHATS** almacena cada mensaje individual dentro de una conversación.
Guarda el texto del mensaje y el campo emisor que indica si lo escribió el usuario
o lo generó el bot automáticamente.

### Las tablas de relación

Strapi gestiona las relaciones entre tablas usando tablas intermedias con el sufijo
_links. Estas no se editan directamente sino a través del panel o la API.

**publicacions_autor_links** conecta cada publicación con su autor. Un usuario puede
tener muchas publicaciones, pero cada publicación tiene un único autor.

**portafolios_estudiante_links** conecta cada portafolio con el estudiante al que
pertenece. Por lógica del sistema, un estudiante tiene un solo portafolio.

**portafolios_publicaciones_links** resuelve la relación entre el portafolio y las
publicaciones. Es una relación de muchos a muchos: un portafolio puede agrupar
muchas publicaciones, y el estudiante decide el orden en que aparecen.

**mensaje_chats_conversacion_links** conecta cada mensaje con su conversación.
Una conversación puede tener muchos mensajes, pero cada mensaje pertenece
a una sola conversación.

### El diagrama entidad-relación

El diagrama resume visualmente todo lo que acabamos de explicar.

UP_USERS está en el centro porque es la tabla que conecta todo. Hacia abajo
se relaciona con PORTAFOLIOS en una relación uno a uno: un estudiante, un
portafolio. Y también se relaciona con PUBLICACIONS en una relación uno a muchos:
un usuario puede tener muchas publicaciones.

PORTAFOLIOS y PUBLICACIONS se relacionan entre sí en muchos a muchos:
un portafolio agrupa varias publicaciones y esa relación la maneja la tabla
portafolios_publicaciones_links.

Y por otro lado, completamente independiente de los usuarios, están
CONVERSACION_CHATS y MENSAJE_CHATS vinculadas en una relación uno a muchos:
una conversación contiene muchos mensajes.
