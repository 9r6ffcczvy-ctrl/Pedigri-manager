# PEDIGRI Manager — versión básica 0.4

Aplicación Next.js para teléfonos y computadoras, conectable al proyecto Supabase existente.

Incluye inicio y cierre de sesión, registro y edición de ejemplares propios, búsqueda por nombre o registro, filtro de sexo y tarjeta imprimible con parentescos ya registrados y visibles.

## Ejecución

1. Ejecutar `npm ci` en esta carpeta.
2. Copiar `.env.example` a `.env.local` y configurar una clave publicable de Supabase. Nunca usar claves secretas ni `service_role`.
3. Ejecutar `npm run dev` para desarrollo o `npm run build` para generar la exportación estática en `out/`.
4. Publicar `out/` solo después de revisar y autorizar el despliegue.

## Verificación

Compilación de producción, validación de tipos y exportación estática completadas. Pendientes: inicio de sesión y guardado con una cuenta autorizada, pruebas de aislamiento entre usuarios y revisión visual en teléfonos e impresión. La autorización efectiva depende de las políticas RLS existentes.

Esta carga no modifica Supabase ni configura despliegues. Los archivos estáticos existentes en la raíz del repositorio corresponden a otra versión; esta fuente no los actualiza automáticamente.

Ver `ESTADO_VERSION.md` para limitaciones y comprobaciones anteriores del paquete original.
