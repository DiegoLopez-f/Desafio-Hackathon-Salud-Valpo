'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import AccordionItem from '@/components/AccordionItem';

export default function SaludDetallePage() {
    const { user } = useAuth(); // El layout ya protegió la página
    const router = useRouter();

    if (!user) {
        return null; // Renderizado previo
    }

    return (
        // ¡SIN EL <main>! El layout pone el fondo blanco.
        <>
            <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
                ← Volver al Dashboard
            </button>

            <div className={styles.header}>
                <h1>Centro de Salud</h1>
                <p>Toda tu información de salud, recomendaciones y planes en un solo lugar.</p>
            </div>

            {/* Quitamos el <div> de "content" que usaba este archivo
              y ponemos los acordeones directamente.
            */}
            <AccordionItem title="Resumen de Riesgos">
                <p>Aquí puedes ver el detalle de tus riesgos actuales.</p>
                <ul>
                    <li>
                        <strong>Riesgo de Diabetes:</strong> {user.diabetesRisk || 'N/A'}%
                    </li>
                    <li>
                        <strong>Riesgo de Hipertensión:</strong> {user.hypertensionRisk || 'N/A'}%
                    </li>
                </ul>
            </AccordionItem>

            <AccordionItem title="Plan SMART (2 Semanas)">
                <p>
                    <strong>Progreso General:</strong> {user.smartPlanProgress || 0}%
                </p>
                <p>Aquí irá el desglose completo de tus objetivos SMART, acciones diarias y recomendaciones para completarlo.</p>
            </AccordionItem>

            <AccordionItem title="Información Detallada de Hábitos">
                <p>Aquí irán los formularios y datos sobre tus hábitos (ej. fumador, dieta, ejercicio) que alimentan los cálculos de riesgo.</p>
            </AccordionItem>

            <AccordionItem title="Recomendaciones Personalizadas">
                <p>Basado en tus datos, aquí te daremos recomendaciones específicas para mejorar tu salud.</p>
            </AccordionItem>
        </>
    );
}