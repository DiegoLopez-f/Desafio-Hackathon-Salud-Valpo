import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Importa el proveedor
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Prototipo de Salud",
    description: "App de recomendaciones de salud",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
        <body className={inter.className}>
        {/* 2. Envuelve {children} con el AuthProvider */}
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}