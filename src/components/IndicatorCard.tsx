'use client';
import styles from './IndicatorCard.module.css';

interface Props {
    title: string;
    value: number | null;
    type: 'risk' | 'progress';
}

export default function IndicatorCard({ title, value, type }: Props) {

    // --- CAMBIO AQUÍ ---
    // Esta función ahora devuelve un objeto con el texto y la clase
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

    // Función para mostrar el valor
    const renderValue = () => {
        // Si el valor es null, muestra N/A
        if (value === null || value === undefined) {
            return <span className={styles.valueNA}>N/A</span>;
        }

        // Lógica para 'risk'
        if (type === 'risk') {
            const riskValue = value as number;
            // Obtenemos el objeto completo (texto + clase)
            const riskInfo = getRiskInfo(riskValue);

            return (
                // Usamos un <div> para agrupar el número y el texto
                <div>
          <span className={`${styles.value} ${riskInfo.className}`}>
            {/* Mostramos el valor con un decimal y el símbolo % */}
              {riskValue.toFixed(1)}%
          </span>

                    {/* --- TEXTO ADICIONAL AÑADIDO --- */}
                    {/* Mostramos el texto (Bajo, Medio, Alto) */}
                    {/* Usamos la MISMA clase para que tenga el MISMO color */}
                    <p className={`${styles.subText} ${riskInfo.className}`}>
                        {riskInfo.text}
                    </p>
                </div>
            );
        }

        // Lógica para 'progress' (esta se mantiene igual)
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

    return (
        <div className={styles.card}>
            <h4 className={styles.title}>{title}</h4>
            {renderValue()}
        </div>
    );
}