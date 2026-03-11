import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CRM Taesmet',
  description: 'CRM para gestión comercial de ventas de productos industriales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
