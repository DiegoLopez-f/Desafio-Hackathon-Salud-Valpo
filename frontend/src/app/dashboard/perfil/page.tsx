'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
// 1. Importa el formulario
import CompletarPerfilForm from '@/components/CompletarPerfilForm';

export default function PerfilPage() {
    const { user } = useAuth(); // El layout ya protegió la página
    const router = useRouter();

    if (!user) {
        return null; // Renderizado previo
    }

    return (
        // El layout padre provee el fondo blanco
        <>
            <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
                ← Volver al Dashboard
            </button>

            <div className={styles.header}>
                <h1>Mi Perfil</h1>
                <p>Actualiza tu información personal y de salud.</p>
            </div>

            {/* 2. Renderiza el formulario, pasándole el usuario.
              El formulario se pre-llenará automáticamente.
            */}
            <CompletarPerfilForm user={user} />
        </>
    );
}