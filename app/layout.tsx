import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Organizational Chart Viewer',
  description: 'Organizational Chart Viewer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
