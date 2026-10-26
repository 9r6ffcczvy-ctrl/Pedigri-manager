import type { ReactNode } from 'react'
import './style.css'
export const metadata = { title: 'PEDIGRI Manager', description: 'Administración de ejemplares y genealogía' }
export default function RootLayout({children}:{children:ReactNode}) {return <html lang="es"><body><main className="container">{children}</main></body></html>}
