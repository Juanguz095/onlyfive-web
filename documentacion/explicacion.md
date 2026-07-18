# Guion — Exposición del Producto

## Parte 1 — Lo que ve cualquier visitante

Al entrar al sitio lo primero que aparece es la barra de navegación con el
nombre del instituto y el botón de Iniciar Sesión. Esa barra es inteligente:
si alguien ya inició sesión antes, en vez del botón de login muestra el nombre
del usuario y sus iniciales como avatar, y al hacer clic lleva directo al
dashboard sin pasar por el login.

Debajo de la barra está el hero del programa: el título, el slogan
"Formamos Talento, Creamos Experiencias" y una imagen de los estudiantes
trabajando en cocina. Es la primera impresión del programa para cualquier
persona que entre desde Google o un enlace compartido.

Después viene el carrusel de pilares del programa. Muestra cuatro valores
del instituto: Formación de Calidad, Aprendizaje Práctico, Docentes
Especializados y Gastronomía que Inspira, cada uno con su imagen y descripción.
El visitante puede navegar entre las tarjetas con las flechas o los puntos
de abajo.

La sección más importante para un visitante es la de Actividades de Estudiantes.
Aquí aparecen los trabajos reales que los alumnos han publicado en el sistema.
No son datos de ejemplo — vienen directamente de la base de datos y se muestran
solo los que el docente aprobó.

Al costado izquierdo hay dos filtros desplegables. Uno para el ciclo formativo,
del Ciclo I al IV, y otro para el tipo de actividad: Proyectos, Talleres o
Eventos. Se pueden combinar los dos. Si no hay publicaciones para la combinación
elegida, aparece el mensaje "No hay actividades para los filtros seleccionados."

Cada tarjeta de publicación muestra el ciclo, el tipo de trabajo, el título,
la descripción, el taller, el docente, el estudiante que lo hizo y el año.
Y tiene un botón "Ver proyecto" que lleva al detalle de esa publicación.

Más abajo está el chatbot ChefBot IA. El visitante puede escribirle directamente
o usar los botones de respuesta rápida para las consultas más frecuentes:
información de la carrera, próximas actividades, requisitos de admisión,
y horarios y talleres. El chatbot responde automáticamente y guarda el historial
de la conversación.

Al final de la página está el footer con el nombre del programa, el correo
de contacto, el teléfono y el año.

## Parte 2 — El inicio de sesión

Cuando un estudiante quiere acceder a su área privada, hace clic en
Iniciar Sesión y llega a esta pantalla. Está dividida en dos: la mitad
izquierda es una imagen decorativa del programa, y la mitad derecha
tiene el formulario.

El formulario pide correo electrónico y contraseña. Tiene un botón de ojo
que permite ver la contraseña en texto claro si el estudiante quiere
verificar lo que está escribiendo. El botón de Ingresar dice "Ingresando..."
mientras procesa y se desactiva para que no se envíe dos veces.

Si las credenciales están mal, aparece el mensaje de error debajo del botón.
Si están bien, el sistema guarda la sesión automáticamente y lleva al
estudiante a su dashboard.

Debajo del formulario hay un separador y un aviso de que las cuentas son
creadas por el docente, no por el estudiante. Y al final un enlace para
volver a la página de inicio.

## Parte 3 — El Dashboard del Estudiante

Una vez dentro, el estudiante ve su panel personal. Tiene una barra superior
con su nombre, sus iniciales como avatar y sección de navegación que indica
en qué sección está.

A la izquierda hay un sidebar con el menú de navegación entre las secciones
de su panel.

En el área principal aparece primero el encabezado del portafolio con tres
botones: Ver vista pública, Copiar enlace y Exportar PDF. Esos botones
están diseñados y visibles pero todavía están en desarrollo.

Debajo están las métricas. Tres tarjetas que muestran en tiempo real cuántas
publicaciones tiene el estudiante en total, cuántas están publicadas y cuántas
están en borrador. Esos números son reales — vienen de la base de datos y
cambian solos si el docente aprueba o archiva algo.

Debajo de las métricas está la lista de publicaciones. Muestra todas las
publicaciones del estudiante con su estado, categoría y fecha. Hay tres chips
de filtro arriba: Todas, Publicadas y Borradores. Al hacer clic en uno, la
lista se filtra instantáneamente sin recargar nada. Cada fila tiene dos botones
al costado: uno para editar y uno para reordenar, que también están en desarrollo.

---

## Parte 4 — El Portafolio Digital

Desde el menú lateral el estudiante puede ir a su portafolio. Esta es la sección
más importante para él porque es su currículum gastronómico digital.

El portafolio muestra las publicaciones que el estudiante eligió incluir
en su presentación personal, con el título, el estado, la categoría y la fecha
de cada una.

Lo más valioso de esta sección es el enlace compartible. Cada portafolio tiene
una dirección única que el estudiante puede enviar por WhatsApp, correo o redes
sociales para que cualquier persona — sin tener cuenta — pueda ver sus trabajos.

---
Parte 5 — El Panel de Administración
Todo lo que el visitante y el estudiante ven en el sistema depende de lo que el docente gestiona desde acá. El panel de administración no es parte del sitio web — es una herramienta separada que corre en su propia dirección y a la que solo accede el docente con sus credenciales de administrador.
Al ingresar, Strapi muestra un panel limpio con un menú lateral que lista todos los tipos de contenido del sistema: Publicaciones, Portafolios, Conversaciones del chatbot y Mensajes.
Desde la sección de Publicaciones el docente puede ver todos los trabajos que los estudiantes han subido, sin importar su estado. Ve los borradores que están esperando revisión, los que ya están publicados y los que fueron archivados. Al hacer clic en cualquiera puede ver el contenido completo: el título, la descripción, el ciclo, el tipo, el taller y el docente responsable. Y con un solo campo — el estado — decide si ese trabajo se vuelve visible al público o no. Si lo cambia a publicado y guarda, en ese mismo momento aparece en la sección de Actividades del sitio web. Si lo archiva, desaparece.
Desde la sección de Portafolios puede revisar el portafolio de cada estudiante, ver qué publicaciones tiene asignadas y verificar si el enlace compartible está activo o no.
Desde la sección de Usuarios puede crear las cuentas de los estudiantes. El registro no es libre — el estudiante no puede crearse una cuenta solo. El docente ingresa el nombre, el correo institucional y una contraseña inicial, asigna el rol de estudiante, guarda, y desde ese momento esa persona puede iniciar sesión en el sistema.
Y desde las secciones de Conversaciones y Mensajes puede revisar todo el historial del chatbot: qué preguntaron los visitantes, cuándo, y qué respondió el sistema automáticamente. Eso le permite identificar qué consultas se repiten más y mejorar las respuestas con el tiempo.
En resumen, Strapi es el motor que mueve todo lo que se ve en el sitio. El estudiante sube, el visitante consume, pero el docente es quien aprueba, gestiona y controla desde acá.
