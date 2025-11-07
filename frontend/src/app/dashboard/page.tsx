'use client';

import { useAuth } from '../../context/AuthContext';
import styles from './page.module.css';
import CompletarPerfilForm from '../../components/CompletarPerfilForm';
import IndicatorCard from '../../components/IndicatorCard';
import RecommendationCard from '../../components/RecommendationCard';

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        // Sin contenedor. El layout ya lo proveyó.
        <>
            {!user.nombre ? (

                <CompletarPerfilForm user={user} />

            ) : (

                <>
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

                    <h3 className={styles.sectionTitle}>Recomendaciones</h3>
                    <RecommendationCard />
                </>
            )}
        </>
    );
}