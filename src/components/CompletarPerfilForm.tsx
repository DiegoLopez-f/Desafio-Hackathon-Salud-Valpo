'use client';
import { useState } from 'react';
// 1. CAMBIO AQUÍ: Importamos setDoc en lugar de updateDoc
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { UserProfile } from '@/context/AuthContext';
import styles from './CompletarPerfilForm.module.css';

interface Props {
    user: UserProfile;
}

export default function CompletarPerfilForm({ user }: Props) {
    // Estados para el formulario
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!nombre || !edad || !peso || !altura) {
            setError('Todos los campos son obligatorios.');
            setIsLoading(false);
            return;
        }

        try {
            const userDocRef = doc(db, 'users', user.uid);

            // 2. CAMBIO AQUÍ: Usamos setDoc con { merge: true }
            // Esto CREARÁ el documento si no existe, o lo ACTUALIZARÁ si ya existe.
            await setDoc(userDocRef, {
                nombre: nombre,
                edad: parseInt(edad, 10),
                peso: parseFloat(peso),
                altura: parseFloat(altura),
            }, { merge: true }); // La opción "merge" es clave

        } catch (err) {
            console.error(err);
            setError('Error al guardar. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2>Completa tu Perfil</h2>
            <p>Necesitamos algunos datos para empezar a ayudarte.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="edad">Edad</label>
                    <input id="edad" type="number" value={edad} onChange={(e) => setEdad(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="peso">Peso (en kg, ej: 70.5)</label>
                    <input id="peso" type="number" step="0.1" value={peso} onChange={(e) => setPeso(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="altura">Altura (en cm, ej: 175)</label>
                    <input id="altura" type="number" value={altura} onChange={(e) => setAltura(e.target.value)} />
                </div>

                {error && <p className={styles.errorText}>{error}</p>}

                <button type="submit" className={styles.saveButton} disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar y Continuar'}
                </button>
            </form>
        </div>
    );
}