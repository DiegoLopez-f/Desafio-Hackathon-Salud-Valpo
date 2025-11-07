'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
// 1. Importa el nuevo componente
import EditableField from '@/components/EditableField';
// 2. Importa las funciones de Firestore
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';

export default function PerfilPage() {
    const { user } = useAuth(); // El layout ya protegió la página
    const router = useRouter();

    if (!user) {
        return null; // Renderizado previo
    }

    // 3. Lógica para guardar un campo en Firestore
    const handleSaveField = async (field: string, value: string) => {
        if (!user) return; // Doble chequeo

        const userDocRef = doc(db, 'users', user.uid);

        // Convierte el valor a número si es necesario
        let processedValue: any = value;
        if (field === 'edad' || field === 'peso' || field === 'altura') {
            processedValue = parseFloat(value) || 0; // Convierte a número
        }

        try {
            // Actualiza solo el campo que cambió
            await updateDoc(userDocRef, {
                [field]: processedValue
            });
            // ¡No necesitas hacer nada más!
            // AuthContext (onSnapshot) detectará el cambio y
            // actualizará la UI automáticamente.
        } catch (error) {
            console.error("Error al actualizar el documento:", error);
            // Lanza el error para que el componente hijo lo maneje
            throw error;
        }
    };

    // 4. Lógica para la foto de perfil (grande)
    const profileInitial = user?.nombre ? user.nombre[0].toUpperCase() : '?';

    return (
        <div className={styles.profileContainer}>
            <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
                ← Volver al Dashboard
            </button>

            <div className={styles.header}>
                <h1>Mi Perfil</h1>
                <p>Aquí puedes actualizar tu información personal.</p>
            </div>

            {/* --- CUERPO DEL PERFIL --- */}
            <div className={styles.profileBody}>

                {/* 5. Foto de Perfil (grande) */}
                <div className={styles.profilePicture}>
                    {profileInitial}
                </div>

                {/* 6. Lista de Datos Editables */}
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

                    {/* El email no es editable de esta forma */}
                    <div className={styles.emailField}>
                        <label className={styles.label}>Email</label>
                        <span>{user.email}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}