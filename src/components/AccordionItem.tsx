'use client';
import { useState, ReactNode } from 'react';
import styles from './AccordionItem.module.css';

interface Props {
    title: string;
    children: ReactNode; // Acepta cualquier contenido JSX
}

export default function AccordionItem({ title, children }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    // Clases CSS dinámicas para la animación
    const contentClasses = `${styles.content} ${isOpen ? styles.contentOpen : ''}`;
    const iconClasses = `${styles.icon} ${isOpen ? styles.iconOpen : ''}`;

    return (
        <div className={styles.wrapper}>
            {/* El header es el botón que abre/cierra */}
            <button className={styles.header} onClick={() => setIsOpen(!isOpen)}>
                <span className={styles.title}>{title}</span>
                {/* Este es el ícono de flecha (un simple div) */}
                <div className={iconClasses}></div>
            </button>

            {/* El contenido que se despliega */}
            <div className={contentClasses}>
                <div className={styles.contentInner}>
                    {children}
                </div>
            </div>
        </div>
    );
}