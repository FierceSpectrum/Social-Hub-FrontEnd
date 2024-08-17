# Social Hub - Frontend

Este repositorio contiene el frontend de la aplicación **Social Hub**, una plataforma para gestionar publicaciones en múltiples redes sociales. El frontend está desarrollado con React y utiliza SCSS para el diseño.

## Estructura del Proyecto

El frontend de Social Hub se organiza en varios componentes que gestionan diferentes aspectos de la aplicación, desde la autenticación hasta la gestión de posts. A continuación se describe cada componente clave y su funcionalidad:

### Componentes Principales

- **User**: Muestra la información del usuario y un menú desplegable para acciones como cerrar sesión, configurar redes sociales y activar el segundo factor de autenticación (2FA). Este componente se encuentra dentro del `Navigation`.

- **Navigation**: Incluye dos subcomponentes:
  - **Hamburger Menu**: Un menú desplegable para dispositivos móviles.
  - **Navigation**: Barra de navegación principal para las páginas del sitio (Home, Create Post, Cronograma).

- **Header**: Une los componentes `User` y `Navigation`, y es la cabecera de la aplicación.

- **SocialMediaPage**: Maneja la visualización de las redes sociales vinculadas por el usuario. Permite al usuario ver qué redes sociales tiene vinculadas y gestionar la vinculación de nuevas redes.

- **SecondFactor**: Componente que maneja la activación y desactivación del segundo factor de autenticación (2FA). Este componente es invocado por `User` y presenta una interfaz con un checkbox para habilitar o deshabilitar el 2FA, mostrando un código QR y un campo para introducir el PIN.

- **ScheduleTable**: Muestra el cronograma del usuario en forma de tabla, permitiendo la edición, creación y eliminación de horarios específicos, pero no de la tabla completa.

- **RoutesHandle**: Maneja las rutas para la vinculación de redes sociales. Este componente redirige a `SocialMediaPage` con los parámetros necesarios para realizar la vinculación del usuario con un servicio específico (por ejemplo, Twitter, Mastodon).

- **Register**: Componente para el registro de nuevos usuarios.

- **Post**: Muestra una lista de publicaciones del usuario. Este componente maneja la visualización de los posts cargados desde el backend.

- **Pagination**: Componente de paginación para manejar la navegación entre diferentes páginas de posts en la `Home`.

- **PagePost**: Página para la creación de nuevos posts. Muestra un formulario donde el usuario puede crear un post, seleccionar las redes sociales a las que se enviará, establecer el estado (en cola, pendiente, programado, etc.), y definir la fecha y el título.

- **PagePostEdit**: Similar a `PagePost`, pero para editar posts existentes que aún no se han publicado. Los posts ya publicados no pueden ser editados.

- **Modal**: Componente para mostrar modales. Utiliza un `div` con el ID `root-modal` en el HTML para renderizarse en el centro de la pantalla.

- **Login**: Componente para el inicio de sesión de los usuarios.

- **Home**: Página principal de la aplicación. Carga todos los posts del usuario y los muestra utilizando los componentes `Post` y `Pagination`.

- **Forms**: Carpeta que contiene varios componentes de formulario reutilizables como `Pin`, `Phone`, `Password`, `Name`, `VerifCode`, `VerifPin`, `Country`, entre otros.

### Estilos

Los estilos de la aplicación se organizan de la siguiente manera:

- **Mixes**: Contiene mixins de CSS.
- **Variables**: Define variables de CSS para colores y puntos de ruptura (`breakpoints`).

### Assets

- **Iconos y Imágenes**: Contiene imágenes como un lápiz para editar posts, una lupa para el buscador, y un perfil de usuario predeterminado (`user-profile.svg`) para cuando no hay imagen de usuario disponible.

## Dependencias

El proyecto utiliza las siguientes dependencias:

- `@arc-view/react`
- `@class-variance-authority/cls`
- `@framermotion`
- `@lucid/react`
- `@path-browserify`
- `react`
- `react-dom`
- `react-modal`
- `react-scripts`
- `react-tooltip`
- `sass`
- `styled-system`
- `web-vitals`
- `react-router-dom` (para manejo de rutas)

## Instalación

1. Clona el repositorio: `git clone https://github.com/FierceSpectrum/Social-Hub-FrontEnd`
2. Navega al directorio del proyecto: `cd Social-Hub-FrontEnd`
3. Instala las dependencias: `npm install`
4. Inicia la aplicación: `npm start`

## Licencia

Este proyecto no tiene una licencia formal y fue creado con fines educativos. No está destinado para uso comercial.


