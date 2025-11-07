'use client'; // Este layout DEBE ser un componente de cliente

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';
import SidePanel from '@/components/SidePanel';
// Importamos los estilos de la página principal del dashboard
import styles from './page.module.css';

export default function DashboardLayout({
                                            children,
                                        }: {
    children: ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Estado para el panel
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Lógica de protección
    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    // Lógica de Logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Vistas de carga/protección
    if (loading) {
        // Usamos el 'loading' del dashboard para la carga
        return <p className={styles.loading}>Cargando...</p>;
    }
    if (!user) {
        return null; // Redirigiendo...
    }

    const profileInitial = user?.nombre ? user.nombre[0].toUpperCase() : '?';

    // --- Renderizado del Layout ---
    return (
        <>
            {/* Fondo gris y contenedor principal */}
            <main className={styles.dashboardContainer}>

                {/* Barra de Navegación */}
                <nav className={styles.navbar}>
                    <h1>
                        ¡Bienvenido, {user.nombre ? user.nombre : 'Estimado(a)'}!
                    </h1>
                    <button
                        className={styles.profileButton}
                        onClick={() => setIsPanelOpen(true)}
                    >
                        {profileInitial}
                    </button>
                </nav>

                {/* ESTA ES LA CLAVE:
          El contenedor blanco (styles.content) VIVE EN EL LAYOUT
          y envuelve a todas las páginas hijas.
        */}
                <div className={styles.content}>
                    {children}
                </div>

            </main>

            {/* Panel Lateral */}
            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onLogout={handleLogout}
            />
        </>
    );
}