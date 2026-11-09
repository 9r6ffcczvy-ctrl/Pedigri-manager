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

La publicidad se diseña como parte del directorio y de cada módulo:

1. **Relevancia por contenido:** la página, sección o búsqueda define primero las categorías del anuncio. Ejemplos: placas → placas y accesorios; pollitos → vacunas y alimento.
2. **Elegibilidad por localidad:** la IP de la solicitud puede estimar país, estado/provincia y ciudad. Esa zona sirve para filtrar los proveedores que atienden la demarcación; el contenido nunca debe mostrar un suplidor de otra zona solo por falta de inventario local.
3. **Campañas visibles:** solo anuncios aprobados, activos, dentro de su fecha y zona de servicio; siempre identificados como **Patrocinado**.
4. **Sin cruzar datos privados:** se usa la categoría del módulo o contenido público, no las notas privadas de genealogía o cuido.
5. **Sin anuncios fuera de zona:** si la ubicación es demasiado imprecisa, no se fuerza una coincidencia local. Solo se admitirá una cobertura más amplia si el anunciante la declara expresamente.

La geolocalización por IP es aproximada y puede señalar otra ciudad por VPN, red móvil o proveedor de internet. El visitante debe poder corregir la zona manualmente. La IP se procesa en el borde/API para obtener una zona aproximada y no se guarda en la base de datos ni en métricas. No se pide ni se infiere una dirección física exacta. Si la persona elige y guarda una zona manualmente, esa preferencia podrá usarse en visitas posteriores.

La página estática no debe decidir la ubicación ni seleccionar campañas directamente desde el navegador. La API/función de anuncios recibirá el contexto del módulo y utilizará metadatos de geolocalización confiables del servidor o proveedor; devolverá solamente campañas elegibles y registrará métricas agregadas sin IP. El modelo de campañas necesitará categorías de contenido, zonas atendidas, fechas, estado de aprobación, creatividad y enlace de destino.

Todavía no hay campañas, geolocalización conectada ni una API de anuncios en la base. Los espacios y la selección reales se activarán cuando se cree ese modelo y su endpoint; mientras tanto no se mostrarán anuncios ficticios.

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
- `20261109090700_add_gallery_photos_to_directory_specimens`
- `20261109091225_allow_owners_to_find_directory_page`

El 9 de noviembre de 2026 se quitaron los permisos automáticos a `anon` y `authenticated` para tablas y secuencias nuevas en `public`. Esto no cambió las tablas existentes. Cada objeto nuevo requiere permisos explícitos junto con RLS.

Las columnas de foto están listas para recibir una URL; falta conectar la carga de imágenes a Supabase Storage. Ninguna clave secreta ni `service_role` se usa en el navegador.

## Próximos pasos

1. Conectar el directorio público a las columnas permitidas de `directory_pages`.
2. Conectar **Catálogo TRAVERO** a las fichas publicadas y abrir el collage con foto y datos.
3. Crear el flujo del dueño para preparar y publicar su página, fichas de ejemplares y productos/servicios.
4. Añadir carga de fotos con permisos de Storage.
5. Elegir la fuente confiable de geolocalización del hosting/API y confirmar qué precisión entrega sin guardar IP.
6. Crear el modelo de campañas y la API que cruce contexto del módulo, categorías y zona atendida; admitir corrección manual de zona.
7. Añadir espacios patrocinados al directorio y módulos; medir impresiones/clics de forma agregada y sin IP.
8. Implementar publicaciones de redes cuando esté definida la autorización de importación.
