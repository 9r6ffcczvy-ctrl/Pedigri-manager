# Modelo de datos para el directorio TRAVERO

Este documento prepara la conexión del prototipo con Supabase. Es una propuesta de trabajo; todavía no crea ni modifica tablas.

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
- Un ejemplar sin foto o sin nombre/placa no se publica en el catálogo.

## Tablas propuestas

### traba_pages

Una fila por página de traba. Incluye titular, nombre, slug, presentación, foto de perfil/portada, país/ciudad, enlaces sociales y estado de reclamación/publicación.

### directory_specimen_listings

Una fila por ejemplar que el titular decide mostrar. Relaciona la página con el ejemplar interno e incluye los datos públicos autorizados: foto, nombre o placa, peso, datos de padres, precio y disponibilidad.

### page_offerings

Productos y servicios manuales de la traba: nombre, tipo, descripción, fotos, precio opcional y estado de publicación. No se mezclan con genealogía ni con ejemplares.

### directory_posts (fase posterior)

Publicaciones importadas o enlazadas desde redes, con origen, fecha, material autorizado y estado de publicación.

## Privacidad y acceso

La tabla actual specimens mantiene su acceso privado por propietario, personal autorizado y administración. El directorio no consulta esa tabla como visitante público.

Todas las nuevas tablas tendrán Row Level Security. El público solo podrá consultar páginas, fichas de catálogo, productos y publicaciones marcadas expresamente como publicadas. Las cuentas propietarias solo podrán administrar sus propias páginas y elementos. Las publicaciones empiezan en borrador/privadas.

Las fotos públicas se guardarán con una política de almacenamiento que solo permita mostrar medios autorizados. Ninguna clave secreta ni service_role se usará en el navegador.

Las tablas nuevas necesitarán permisos explícitos para la Supabase Data API. El 9 de noviembre de 2026 se revocaron los permisos automáticos de tablas y secuencias nuevas para anon y authenticated en public. Esto no cambia los permisos de las tablas existentes; service_role conserva sus permisos. Cada tabla nueva recibirá solo los GRANT necesarios, junto con RLS.

## Orden de implementación

1. Revisar y aprobar este modelo.
2. Crear las tablas y políticas en un entorno de desarrollo cuando esté disponible.
3. Conectar el directorio y las páginas a esos datos.
4. Verificar con cuentas de prueba que un propietario no pueda editar datos de otra traba y que el público solo vea elementos publicados.
5. Llevar la migración revisada al entorno activo.
