"use client";
import Link from "next/link";
import styles from "./SidePanel.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function SidePanel({ isOpen, onClose, onLogout }: Props) {
  const panelClasses = `${styles.panel} ${isOpen ? styles.open : ""}`;
  const overlayClasses = `${styles.overlay} ${isOpen ? styles.open : ""}`;

  return (
    <>
      <div className={overlayClasses} onClick={onClose} />
      <div className={panelClasses}>
        <div className={styles.header}>
          <h3>Menú</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <nav className={styles.navLinks}>
          <Link href="/dashboard/salud" onClick={onClose}>
            Centro de Salud
          </Link>
          <Link href="/dashboard/perfil" onClick={onClose}>
            Mi Perfil
          </Link>
          <Link href="/dashboard/configuracion" onClick={onClose}>
            Configuración
          </Link>
        </nav>

        <div className={styles.footer}>
          <button onClick={onLogout} className={styles.logoutButton}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
}
