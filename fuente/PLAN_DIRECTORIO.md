# Modelo de datos para el directorio TRAVERO

Este documento describe la estructura implementada en Supabase para conectar el prototipo. Las tablas se crearon vacías el 9 de noviembre de 2026; no se copiaron ni publicaron registros de usuarios.

## Reglas de la página

- Cada traba tendrá su propia página y una dirección corta dentro de TRAVERO.
- Una página no reclamada, reclamada y verificada son estados distintos.
- El titular completa y autoriza la información pública de su página.
- La página puede mostrar publicaciones autorizadas, catálogo TRAVERO y productos o servicios ingresados manualmente.
- Las publicaciones importadas de redes requieren autorización del titular.

## Catálogo de ejemplares

- Cada tarjeta pública debe mostrar una foto y al menos el nombre o número de placa del ejemplar.
- En el menú de la página, el usuario abre **Catálogo TRAVERO** y desde la ficha selecciona **Ver collage y datos**.
- El collage puede mostrar foto principal, fotos adicionales, placa o nombre, peso, padre, madre y disponibilidad.
- Solo se publican los ejemplares que el titular seleccione y los datos que autorice.
- La base rechaza una ficha pública si falta la foto o tanto el nombre como el número de placa.

## Anuncios inteligentes del directorio

El plan de anuncios se integra desde esta etapa:

- El contenido y la sección actual dan el contexto principal: por ejemplo, placas y accesorios al consultar placas; alimento y vacunas al consultar pollitos.
- La ubicación del visitante limita los patrocinadores elegibles: país, estado/provincia y ciudad o demarcación cuando esté disponible. Solo aparecen proveedores que atiendan esa zona.
- Los anuncios se marcarán como patrocinados y solo se mostrarán campañas activas y aprobadas.
- El sistema usará categorías de la página o del módulo, no notas privadas de genealogía o cuido. No guardará la dirección IP en los registros de anuncios.
- Si no hay un patrocinador que cubra la zona, no se mostrará una oferta de otra demarcación.

La base actual todavía no incluye campañas publicitarias. Antes de conectarlas se añadirán campañas, creatividades, categorías, zonas atendidas y medición de impresiones/clics. Los espacios iniciales irán en el directorio y en las páginas de las trabas; después se adaptarán a los módulos relacionados.

## Tablas implementadas

### directory_pages

Una fila por página de traba: titular, nombre, slug, presentación, foto de perfil/portada, país/ciudad, enlaces sociales y estados de reclamación/publicación.

### directory_specimen_listings

Una fila por ejemplar que el titular decide mostrar. Se relaciona con su página y con el registro privado del ejemplar; guarda la foto y los datos públicos autorizados. La API pública no recibe el identificador interno del ejemplar ni del titular.

### page_offerings

Productos y servicios manuales de la traba: nombre, tipo, descripción, foto, precio opcional y estado de publicación. No se mezclan con genealogía ni con ejemplares.

### Publicaciones de redes

Quedan para una fase posterior. Se cargarán o enlazarán con autorización del titular.

## Privacidad y acceso

La tabla actual specimens conserva sus permisos privados por propietario, personal autorizado y administración. El directorio no permite consultas públicas directas a specimens: solo muestra los datos guardados en una ficha de catálogo publicada.

Las tres tablas nuevas tienen RLS. Las páginas empiezan en borrador; las fichas de ejemplares y productos empiezan sin publicar. El público puede leer las páginas y los elementos publicados. El titular puede administrar los suyos; los campos internos de titular y ejemplar no tienen permiso de lectura para la API pública.

El proyecto no permitía crear una rama de base de datos con su plan actual. Por eso las tablas se añadieron al proyecto activo, vacías y con RLS y permisos explícitos. Las migraciones remotas registradas son:
- `20261109090223_create_directory_pages_and_public_catalog`
- `20261109090328_index_directory_page_owner_foreign_keys`

El 9 de noviembre de 2026 se quitaron los permisos automáticos a `anon` y `authenticated` para tablas y secuencias nuevas en `public`. Esto no cambió las tablas existentes. Cada objeto nuevo requiere permisos explícitos junto con RLS.

Las columnas de foto están listas para recibir una URL; falta conectar la carga de imágenes a Supabase Storage. Ninguna clave secreta ni `service_role` se usa en el navegador.

## Próximos pasos

1. Conectar el directorio público a las columnas permitidas de `directory_pages`.
2. Conectar **Catálogo TRAVERO** a las fichas publicadas y abrir el collage con foto y datos.
3. Crear el flujo del dueño para preparar y publicar su página, fichas de ejemplares y productos/servicios.
4. Añadir carga de fotos con permisos de Storage.
5. Añadir campañas publicitarias por categoría y demarcación; medir impresiones/clics sin guardar IP.
6. Implementar publicaciones de redes cuando esté definida la autorización de importación.
