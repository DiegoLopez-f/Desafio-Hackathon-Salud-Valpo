'use client';
import styles from './IndicatorCard.module.css';
import Link from 'next/link'; // 1. IMPORTAR LINK

interface Props {
    title: string;
    value: number | null;
    type: 'risk' | 'progress';
    href: string; // 2. AÑADIR LA PROP 'href' A LA INTERFAZ
}

export default function IndicatorCard({ title, value, type, href }: Props) {

    // Función para obtener texto y clase (sin cambios)
    const getRiskInfo = (riskValue: number) => {
        // **Ajusta estos rangos (15 y 30) según tu lógica médica**
        if (riskValue < 15) {
            return { text: 'Bajo', className: styles.riskBajo };
        }
        if (riskValue < 30) {
            return { text: 'Medio', className: styles.riskMedio };
        }
        return { text: 'Alto', className: styles.riskAlto };
    };

    // Función para renderizar el valor (sin cambios)
    const renderValue = () => {
        if (value === null || value === undefined) {
            return <span className={styles.valueNA}>N/A</span>;
        }

        if (type === 'risk') {
            const riskValue = value as number;
            const riskInfo = getRiskInfo(riskValue);

            return (
                <div>
          <span className={`${styles.value} ${riskInfo.className}`}>
            {riskValue.toFixed(1)}%
          </span>
                    <p className={`${styles.subText} ${riskInfo.className}`}>
                        {riskInfo.text}
                    </p>
                </div>
            );
        }

        if (type === 'progress') {
            const progressValue = value as number;
            return (
                <div className={styles.progressContainer}>
          <span className={`${styles.value} ${styles.valueProgress}`}>
            {progressValue}%
          </span>
                    <div className={styles.progressBarWrapper}>
                        <div
                            className={styles.progressBar}
                            style={{ width: `${progressValue}%` }}
                        />
                    </div>
                </div>
            );
        }
    };

    // 3. ENVOLVER TODA LA LÓGICA EN EL COMPONENTE <Link>
    return (
        <Link href={href} className={styles.cardLink}>
            <div className={styles.card}>
                <h4 className={styles.title}>{title}</h4>
                {renderValue()}
            </div>
        </Link>
    );
}