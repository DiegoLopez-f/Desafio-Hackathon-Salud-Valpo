'use client';

import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import CompletarPerfilForm from '@/components/CompletarPerfilForm';
import IndicatorCard from '@/components/IndicatorCard';

export default function DashboardPage() {
    // El layout ya se encargó de 'loading' y 'user' nulo
    const { user } = useAuth();

    if (!user) {
        return null; // Renderizado previo mientras el layout redirige
    }

    return (
        // ¡SIN CONTENEDOR! El layout pone el fondo blanco.
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

                    <hr />

                    <h3 className={styles.sectionTitle}>Mi Perfil</h3>
                    <p>Email: {user.email}</p>
                    <p>Edad: {user.edad} años</p>
                    <p>Peso: {user.peso} kg</p>
                    <p>Altura: {user.altura} cm</p>
                </>
            )}
        </>
    );
}