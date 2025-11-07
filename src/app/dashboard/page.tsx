'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';
import styles from './page.module.css';
import CompletarPerfilForm from '@/components/CompletarPerfilForm';
import SidePanel from '@/components/SidePanel';
import IndicatorCard from '@/components/IndicatorCard';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Protección
    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    // Cerrar Sesión
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // --- Vistas ---

    if (loading) {
        return <p className={styles.loading}>Cargando...</p>;
    }

    if (!user) {
        return null; // Redirigiendo...
    }

    const profileInitial = user?.nombre ? user.nombre[0].toUpperCase() : '?';

    // --- ¡Lógica Principal! ---
    return (
        <>
            <main className={styles.dashboardContainer}>
                {/* Barra de Navegación (sin cambios) */}
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

                {/* Contenido Principal */}
                <div className={styles.content}>

                    {!user.nombre ? (

                        // --- VISTA FORMULARIO (sin cambios) ---
                        <CompletarPerfilForm user={user} />

                    ) : (

                        // --- VISTA DASHBOARD CON DATOS (MODIFICADA) ---
                        <>
                            {/* 2. NUEVA SECCIÓN DE INDICADORES */}
                            <h3 className={styles.sectionTitle}>Mis Indicadores Clave</h3>
                            <div className={styles.indicatorsGrid}>
                                <IndicatorCard
                                    title="Riesgo de Diabetes"
                                    // --- ¡CAMBIO AQUÍ! ---
                                    // Añadimos '|| null' para satisfacer a TypeScript
                                    value={user.diabetesRisk || null}
                                    type="risk"
                                />
                                <IndicatorCard
                                    title="Riesgo de Hipertensión"
                                    // --- ¡CAMBIO AQUÍ! ---
                                    value={user.hypertensionRisk || null}
                                    type="risk"
                                />
                                <IndicatorCard
                                    title="Plan 2 Semanas (SMART)"
                                    // --- ¡CAMBIO AQUÍ! ---
                                    value={user.smartPlanProgress || null}
                                    type="progress"
                                />
                            </div>

                            <hr />

                            {/* 3. DATOS PERSONALES (ahora con título) */}
                            <h3 className={styles.sectionTitle}>Mi Perfil</h3>
                            <p>Email: {user.email}</p>
                            <p>Edad: {user.edad} años</p>
                            <p>Peso: {user.peso} kg</p>
                            <p>Altura: {user.altura} cm</p>
                        </>

                    )}
                </div>
            </main>

            {/* Panel Lateral (sin cambios) */}
            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onLogout={handleLogout}
            />
        </>
    );
}