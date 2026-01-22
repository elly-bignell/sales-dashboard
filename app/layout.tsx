import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sales Team Dashboard',
  description: 'Track team performance and progress',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
