'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/client';
import SidePanel from '../../components/SidePanel';
import styles from './page.module.css'; // Usa los estilos de la página principal

export default function DashboardLayout({
                                            children,
                                        }: {
    children: ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    if (loading) {
        return <p className={styles.loading}>Cargando...</p>;
    }
    if (!user) {
        return null; // Redirigiendo...
    }

    const profileInitial = user?.nombre ? user.nombre[0].toUpperCase() : '?';

    return (
        <>
            {/* El <main> solo da el fondo gris */}
            <main className={styles.dashboardContainer}>

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

                {/* El contenedor blanco. Envuelve a TODAS las páginas hijas. */}
                <div className={styles.content}>
                    {children}
                </div>

            </main>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onLogout={handleLogout}
            />
        </>
    );
}