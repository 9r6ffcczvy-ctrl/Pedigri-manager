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

## Anuncios inteligentes y plan para anunciantes

La publicidad se diseña como parte del directorio y de cada módulo:

1. **Relevancia por contenido:** la página, sección o búsqueda define primero las categorías del anuncio. Ejemplos: placas → placas y accesorios; pollitos → vacunas y alimento.
2. **Elegibilidad por localidad:** la IP de la solicitud puede estimar país, estado/provincia y ciudad. Esa zona sirve para filtrar proveedores que atiendan la demarcación. Solo se admite una cobertura más amplia si el anunciante la declaró expresamente.
3. **Campañas visibles:** únicamente campañas aprobadas, activas, dentro de su fecha y zona de servicio. Cada anuncio llevará la etiqueta **Publicidad** y podrá identificar al patrocinador.
4. **Sin cruzar datos privados:** se usa la categoría del módulo o el contenido público, nunca las notas privadas de genealogía o cuido.
5. **Sin anuncios fuera de zona:** si la ubicación es imprecisa y no se puede confirmar una cobertura válida, no se fuerza una coincidencia.

La geolocalización por IP es aproximada y puede fallar por VPN, red móvil o proveedor de internet. El visitante podrá corregir la zona manualmente. La IP se procesa en el borde/API solo para estimar la zona; no se guarda en la base de datos ni en las métricas, y no se pide ni se infiere una dirección física exacta. La página estática no decidirá la ubicación ni seleccionará campañas desde el navegador. La API recibirá contexto del módulo y metadatos geográficos confiables del servidor/proveedor, y devolverá únicamente campañas elegibles.

### Recorrido del anunciante

El directorio incluirá una entrada **Anúnciate en TRAVERO** con dos opciones:

- **Configurar y pagar ahora:** el anunciante crea su campaña, selecciona categorías temáticas y zonas donde sí ofrece servicio, carga el material (tarjeta/enlace y, cuando se admita, video), define duración y presupuesto, revisa una vista previa y paga mediante un checkout seguro. El estado será “pagada, pendiente de revisión” hasta que TRAVERO apruebe el contenido y la cobertura. Los datos de tarjeta se manejarán en el proveedor de pago; TRAVERO guardará el estado y la referencia de la transacción.
- **Solicitar ayuda a ventas:** el anunciante deja negocio, persona de contacto, teléfono/correo, producto o servicio, categorías y localidades que cubre, y un presupuesto o periodo tentativo. Esto crea una solicitud para el departamento comercial; no genera un cobro hasta que ventas acuerde y confirme la campaña. La bandeja comercial prevista es ventas@traveroapp.com, con copia y capacidad de intervención para Alex.

Ventas podrá ayudar a crear o ajustar campañas, pero la selección automática seguirá limitada por la categoría actual y la cobertura que el anunciante declaró. El flujo debe distinguir claramente entre solicitud, cotización, pago recibido, revisión/aprobación, campaña activa y finalizada/cancelada.

### Estado actual de la API publicitaria

Ya se crearon en Supabase las tablas vacías para cuentas de anunciantes, campañas, solicitudes a ventas y órdenes. La estructura contempla categorías temáticas, zonas atendidas, formato, periodo, presupuesto, revisión y estado de pago. No guarda números de tarjeta ni direcciones IP. Las solicitudes de ventas y las órdenes solo podrán gestionarse desde el backend.

Todavía faltan la función de entrega que use la geolocalización de Cloudflare, el formulario/API de solicitudes a ventas, el checkout y la pantalla del anunciante. No hay campañas ni solicitudes guardadas; el directorio no muestra anuncios hasta conectar esos componentes. Los precios, formatos, duración mínima, reembolsos y comisiones publicitarias siguen pendientes de definición comercial.
## Tablas implementadas

### directory_pages

Una fila por página de traba: titular, nombre, slug, presentación, foto de perfil/portada, país/ciudad, enlaces sociales y estados de reclamación/publicación.

### directory_specimen_listings

Una fila por ejemplar que el titular decide mostrar. Se relaciona con su página y con el registro privado del ejemplar; guarda la foto y los datos públicos autorizados. La API pública no recibe el identificador interno del ejemplar ni del titular.

### page_offerings

Productos y servicios manuales de la traba: nombre, tipo, descripción, foto, precio opcional y estado de publicación. No se mezclan con genealogía ni con ejemplares.

### Anunciantes, campañas, solicitudes y pagos

- directory_advertisers: cuenta comercial privada ligada al usuario que administra el negocio.
- directory_ad_campaigns: tema, cobertura geográfica, ubicación del anuncio, formato, fechas, presupuesto y estados de revisión/pago. Los anunciantes solo pueden crear y editar borradores propios; aprobar o marcar pagado queda fuera de sus permisos.
- directory_ad_sales_leads: solicitud privada para ventas con negocio, contacto, categorías, zonas de servicio y presupuesto tentativo.
- directory_ad_orders: estado y referencia de la orden. No almacena datos de tarjeta; la integración del proveedor de pago todavía no existe.

Las cuatro tablas están vacías. No hay anuncios activos ni solicitudes comerciales todavía.

### Publicaciones de redes

Quedan para una fase posterior. Se cargarán o enlazarán con autorización del titular.

## Privacidad y acceso

La tabla actual specimens conserva sus permisos privados por propietario, personal autorizado y administración. El directorio no permite consultas públicas directas a specimens: solo muestra los datos guardados en una ficha de catálogo publicada.

Las tablas del directorio y de publicidad tienen RLS. Las páginas empiezan en borrador; las fichas de ejemplares y productos empiezan sin publicar. Los propietarios administran sus propias páginas y borradores de anuncios. Las solicitudes a ventas y las órdenes no son accesibles desde la API pública; solo el backend con permisos de servidor podrá gestionarlas. Los campos internos de titular y ejemplar tampoco tienen permiso de lectura para la API pública.

El proyecto no permitía crear una rama de base de datos con su plan actual. Por eso las tablas se añadieron al proyecto activo, vacías y con RLS y permisos explícitos. Las migraciones remotas registradas son:
- `20261109090223_create_directory_pages_and_public_catalog`
- `20261109090328_index_directory_page_owner_foreign_keys`
- `20261109090700_add_gallery_photos_to_directory_specimens`
- `20261109091225_allow_owners_to_find_directory_page`
- `20261109094435_create_directory_advertising_accounts_campaigns_and_leads`
- `20261109094514_index_directory_advertising_tables_and_secure_sales_leads`

El 9 de noviembre de 2026 se quitaron los permisos automáticos a `anon` y `authenticated` para tablas y secuencias nuevas en `public`. Esto no cambió las tablas existentes. Cada objeto nuevo requiere permisos explícitos junto con RLS.

Las columnas de foto están listas para recibir una URL; falta conectar la carga de imágenes a Supabase Storage. Ninguna clave secreta ni `service_role` se usa en el navegador.

## Próximos pasos

1. Conectar el directorio público a las columnas permitidas de `directory_pages`.
2. Conectar **Catálogo TRAVERO** a las fichas publicadas y abrir el collage con foto y datos.
3. Crear el flujo del dueño para preparar y publicar su página, fichas de ejemplares y productos/servicios.
4. Añadir carga de fotos con permisos de Storage.
5. Confirmar que el proyecto de Cloudflare despliegue Pages Functions desde la carpeta de la aplicación y configurar sus variables/secretos.
6. Implementar la función de entrega con la geolocalización de Cloudflare y campañas elegibles de Supabase, sin almacenar IP.
7. Crear la pantalla del anunciante y el envío privado de solicitudes a ventas.
8. Seleccionar proveedor de cobro e integrar checkout cuando los precios, comisiones y condiciones estén aprobados.
9. Añadir espacios **Publicidad** al directorio y módulos; medir impresiones/clics de forma agregada y sin IP.
10. Implementar publicaciones de redes cuando esté definida la autorización de importación.
