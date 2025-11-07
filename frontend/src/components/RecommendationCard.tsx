'use client';
import styles from './RecommendationCard.module.css';

export default function RecommendationCard() {
    // Este es el texto de ejemplo que querías
    const placeholderText = "Basado en tu perfil actual, te recomendamos incorporar 30 minutos de caminata diaria y revisar tu consumo de azúcares procesados esta semana.";

    return (
        <div className={styles.card}>
            {/* Usamos un emoji para darle un toque visual rápido */}
            <h4 className={styles.title}>💡 Recomendación Personalizada</h4>
            <p className={styles.text}>
                {placeholderText}
            </p>
            {/* Más adelante, podríamos añadir un link a un plan de acción */}
            {/* <a href="#" className={styles.link}>Ver plan de acción</a> */}
        </div>
    );
}