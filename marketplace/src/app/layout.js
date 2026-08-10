import Navbar from '@/components/Navbar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen flex flex-col text-black">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}