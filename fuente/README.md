# PEDIGRI Manager — versión básica 0.4

Código editable recuperado de PEDIGRI_Manager_Basico_v0_4.zip. Incluye inicio de sesión, consulta, registro y edición de ejemplares propios, búsqueda y tarjeta genealógica imprimible. El acceso depende de las políticas RLS existentes.

## Ejecutar

1. Instalar Node.js compatible con Next.js 15.
2. Desde fuente/, ejecutar `npm ci`.
3. Copiar `.env.example` a `.env.local` y configurar la clave publicable. Nunca utilizar claves secretas ni service_role en variables NEXT_PUBLIC_.
4. Ejecutar `npm run dev`.
5. Ejecutar `npm run build` para exportar a out/.

Los archivos estáticos de la raíz corresponden a la versión 0.3. Añadir esta carpeta no los actualiza. Antes de publicar la versión 0.4, revisar ESTADO_VERSION.md y probar guardado y aislamiento con cuentas autorizadas.

Supabase: https://supabase.com/dashboard/project/ohtmstjrxgbtldwuoleh
