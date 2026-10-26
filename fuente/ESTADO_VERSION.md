# PEDIGRI Manager — versión básica 0.4 preparada

## Incluido
- Inicio y cierre de sesión con la cuenta existente.
- Registro y edición de ejemplares propios: nombre o identificador provisional, número de registro/anillo, sexo, nacimiento conocido y notas.
- Búsqueda por nombre y número, tolerando diferencias de acentos, espacios y guiones sin perder ceros iniciales. Filtro de sexo.
- Consulta de ejemplares visibles según las políticas actuales; paginación al cargar, sin el límite anterior de 100 registros.
- Ficha con padres y abuelos que ya estén vinculados en la base de datos y sean accesibles al usuario.
- Hoja de estilo de impresión para tarjeta de 4.25 × 5.5 pulgadas. Información declarada, sin certificación.

## Comprobado
Compilación de producción, comprobación de tipos y exportación estática completadas. La exportación incluye inicio, login y panel. Inspección de las políticas existentes mediante consultas de solo lectura.

## Límites de verificación
No se inició sesión como el propietario ni se crearon o editaron datos reales. No se modificó Supabase. Pendientes: prueba autenticada de registro/edición y aislamiento con cuentas de prueba autorizadas, comprobación visual en teléfonos e impresión. No está publicado.

## Limitaciones funcionales actuales
No incluye alta ni recuperación de cuentas, carga de fotos, campos separados de placa/anillo, marcaje ampliado, alta de progenitores, validación genealógica en servidor, historial de cambios ni certificaciones. No sustituir antecedentes desconocidos por supuestos. El administrador consulta todos los registros autorizados; la edición actual se limita a sus propios ejemplares conforme a las políticas existentes. La interfaz respeta ese límite.

## Antes de publicar
Revisar el acceso RPC a rls_auto_enable y la función is_admin con su definición; no cambiar indiscriminadamente sus permisos porque is_admin participa en RLS. Revisar advertencia de contraseñas filtradas y disponibilidad del servicio en el plan actual. Confirmar recuperación de acceso y URL de redirección de autenticación.

## Contenido del paquete
- fuente/: código editable y lockfile. Configurar .env.local usando .env.example, instalar con npm ci y compilar con npm run build. Usar solo clave publicable en el navegador.
- publicacion/: exportación compilada vinculada al mismo Supabase de la versión 0.3. No contiene claves secretas ni de service_role. Es material preparado, no una publicación realizada.

Los módulos avanzados acordados quedan pendientes para fases posteriores. Su definición en la conversación se conserva; no se activan ni condicionan este paquete básico.
