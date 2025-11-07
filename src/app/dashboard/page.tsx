'use client';

import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import CompletarPerfilForm from '@/components/CompletarPerfilForm';
import IndicatorCard from '@/components/IndicatorCard';
// 1. IMPORTAR LA NUEVA TARJETA
import RecommendationCard from '@/components/RecommendationCard';

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        // El layout provee este contenedor blanco
        <div className={styles.content}>
            {!user.nombre ? (

                // --- VISTA FORMULARIO (Sin cambios) ---
                <CompletarPerfilForm user={user} />

            ) : (

                // --- VISTA DASHBOARD (Modificada) ---
                <>
                    {/* Sección de Indicadores (Sin cambios) */}
                    <h3 className={styles.sectionTitle}>Mis Indicadores Clave</h3>
                    <div className={styles.indicatorsGrid}>
                        <IndicatorCard
                            title="Riesgo de Diabetes"
                            value={user.diabetesRisk || null}
                            type="risk"
                            href="/dashboard/salud"
                        />
                        <IndicatorCard
                            title="Riesgo de Hipertensión"
                            value={user.hypertensionRisk || null}
                            type="risk"
                            href="/dashboard/salud"
                        />
                        <IndicatorCard
                            title="Plan 2 Semanas (SMART)"
                            value={user.smartPlanProgress || null}
                            type="progress"
                            href="/dashboard/salud"
                        />
                    </div>

                    {/* --- MODIFICACIÓN AQUÍ --- */}

                    {/* 2. ELIMINAMOS EL <hr /> Y LA SECCIÓN DE PERFIL */}
                    {/* <hr /> */}
                    {/* <h3 className={styles.sectionTitle}>Mi Perfil</h3> ... etc */}

                    {/* 3. AÑADIMOS LA NUEVA SECCIÓN DE RECOMENDACIONES */}
                    {/* (Reutilizamos la clase de título que ya teníamos) */}
                    <h3 className={styles.sectionTitle}>Recomendaciones</h3>
                    <RecommendationCard />
                </>
            )}
        </div>
    );
}