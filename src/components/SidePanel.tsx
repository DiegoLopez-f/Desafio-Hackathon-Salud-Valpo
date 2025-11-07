'use client';
import Link from 'next/link';
import styles from './SidePanel.module.css';

interface Props {
    isOpen: boolean;        // Estado para saber si está abierto
    onClose: () => void;    // Función para cerrarlo
    onLogout: () => void; // Función para cerrar sesión
}

export default function SidePanel({ isOpen, onClose, onLogout }: Props) {
    // Agrega la clase 'open' solo si isOpen es true
    const panelClasses = `${styles.panel} ${isOpen ? styles.open : ''}`;
    const overlayClasses = `${styles.overlay} ${isOpen ? styles.open : ''}`;

    return (
        <>
            {/* El fondo oscuro que al clickearlo cierra el panel */}
            <div className={overlayClasses} onClick={onClose} />

            {/* El panel en sí */}
            <div className={panelClasses}>
                <div className={styles.header}>
                    <h3>Menú</h3>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </div>

                <nav className={styles.navLinks}>
                    <Link href="/dashboard" onClick={onClose}>Mi Salud</Link>
                    <Link href="/dashboard/perfil" onClick={onClose}>Mi Perfil</Link>
                    <Link href="/dashboard/configuracion" onClick={onClose}>Configuración</Link>
                    {/* Puedes añadir más links aquí */}
                </nav>

                <div className={styles.footer}>
                    {/* El botón de cerrar sesión, ahora al final */}
                    <button onClick={onLogout} className={styles.logoutButton}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
}