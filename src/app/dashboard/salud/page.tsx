'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
// Usamos los estilos de esta página (para el botón y header)
import styles from './page.module.css';
import AccordionItem from '@/components/AccordionItem';

export default function SaludDetallePage() {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) {
        return null;
    }

    return (
        // Sin contenedor principal.
        <>
            <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
                ← Volver al Dashboard
            </button>

            <div className={styles.header}>
                <h1>Centro de Salud</h1>
                <p>Toda tu información de salud, recomendaciones y planes en un solo lugar.</p>
            </div>

            <AccordionItem title="Resumen de Riesgos">
                {/* ... (contenido del acordeón) ... */}
                <ul>
                    <li><strong>Riesgo de Diabetes:</strong> {user.diabetesRisk || 'N/A'}%</li>
                    <li><strong>Riesgo de Hipertensión:</strong> {user.hypertensionRisk || 'N/A'}%</li>
                </ul>
            </AccordionItem>

            <AccordionItem title="Plan SMART (2 Semanas)">
                {/* ... (contenido del acordeón) ... */}
                <p><strong>Progreso General:</strong> {user.smartPlanProgress || 0}%</p>
            </AccordionItem>

            <AccordionItem title="Información Detallada de Hábitos">
                {/* ... (contenido del acordeón) ... */}
                <p>Aquí irán los formularios y datos sobre tus hábitos.</p>
            </AccordionItem>

            <AccordionItem title="Recomendaciones Personalizadas">
                {/* ... (contenido del acordeón) ... */}
                <p>Basado en tus datos, aquí te daremos recomendaciones.</p>
            </AccordionItem>
        </>
    );
}