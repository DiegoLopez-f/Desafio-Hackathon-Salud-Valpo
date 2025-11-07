'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import EditableField from '@/components/EditableField';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';

export default function PerfilPage() {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) {
        return null;
    }

    const handleSaveField = async (field: string, value: string) => {
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);

        let processedValue: any = value;
        if (field === 'edad' || field === 'peso' || field === 'altura') {
            processedValue = parseFloat(value) || 0;
        }
        try {
            await updateDoc(userDocRef, { [field]: processedValue });
        } catch (error) {
            console.error("Error al actualizar el documento:", error);
            throw error;
        }
    };

    const profileInitial = user?.nombre ? user.nombre[0].toUpperCase() : '?';

    return (
        // Sin contenedor principal
        <>
            <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
                ← Volver al Dashboard
            </button>

            <div className={styles.header}>
                <h1>Mi Perfil</h1>
                <p>Aquí puedes actualizar tu información personal.</p>
            </div>

            <div className={styles.profileBody}>
                <div className={styles.profilePicture}>
                    {profileInitial}
                </div>

                <div className={styles.profileData}>
                    <EditableField
                        label="Nombre"
                        fieldName="nombre"
                        initialValue={user.nombre}
                        onSave={handleSaveField}
                    />
                    <EditableField
                        label="Edad"
                        fieldName="edad"
                        initialValue={user.edad}
                        onSave={handleSaveField}
                        inputType="number"
                    />
                    <EditableField
                        label="Peso"
                        fieldName="peso"
                        initialValue={user.peso}
                        onSave={handleSaveField}
                        inputType="number"
                    />
                    <EditableField
                        label="Altura (en cm)"
                        fieldName="altura"
                        initialValue={user.altura}
                        onSave={handleSaveField}
                        inputType="number"
                    />

                    <div className={styles.emailField}>
                        <label className={styles.label}>Email</label>
                        <span>{user.email}</span>
                    </div>
                </div>
            </div>
        </>
    );
}