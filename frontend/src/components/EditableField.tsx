'use client';
import { useState } from 'react';
import styles from './EditableField.module.css';

interface Props {
    label: string;
    // El valor inicial que viene de la base de datos
    initialValue: string | number | null | undefined;
    // La función que se llama para guardar en Firestore
    // Recibe el nombre del campo (ej: 'nombre') y el nuevo valor
    onSave: (field: string, newValue: string) => Promise<void>;
    // El nombre del campo en la base de datos
    fieldName: string;
    // Opcional: el tipo de input (ej: 'text', 'number')
    inputType?: string;
}

export default function EditableField({
                                          label,
                                          initialValue,
                                          onSave,
                                          fieldName,
                                          inputType = 'text'
                                      }: Props) {

    // Estado para saber si estamos en modo edición
    const [isEditing, setIsEditing] = useState(false);
    // Estado para guardar el valor del input mientras se edita
    const [value, setValue] = useState(initialValue?.toString() || '');
    // Estado para mostrar 'Guardando...'
    const [isSaving, setIsSaving] = useState(false);

    // Se llama al hacer clic en el check (✔️)
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Llama a la función (del padre) para guardar en Firestore
            await onSave(fieldName, value);
        } catch (error) {
            console.error("Error al guardar:", error);
            // Si falla, revierte al valor original
            setValue(initialValue?.toString() || '');
        }
        setIsSaving(false);
        setIsEditing(false); // Sale del modo edición
    };

    // Se llama al hacer clic en la X (❌)
    const handleCancel = () => {
        // Revierte al valor original y sale del modo edición
        setValue(initialValue?.toString() || '');
        setIsEditing(false);
    };

    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>{label}</label>

            {isEditing ? (
                // --- VISTA DE EDICIÓN ---
                <div className={styles.editContainer}>
                    <input
                        type={inputType}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className={styles.input}
                        // Hace 'step' para permitir decimales si es 'number'
                        step={inputType === 'number' ? '0.1' : undefined}
                    />
                    <button onClick={handleSave} className={styles.iconButton} disabled={isSaving}>
                        {isSaving ? '...' : '✔️'}
                    </button>
                    <button onClick={handleCancel} className={styles.iconButton} disabled={isSaving}>
                        ❌
                    </button>
                </div>
            ) : (
                // --- VISTA DE LECTURA ---
                <div className={styles.displayContainer}>
          <span className={styles.value}>
            {initialValue || 'No especificado'}
              {/* Añade 'kg' o 'cm' si es relevante (opcional) */}
              {fieldName === 'peso' && initialValue ? ' kg' : ''}
              {fieldName === 'altura' && initialValue ? ' cm' : ''}
          </span>
                    <button onClick={() => setIsEditing(true)} className={styles.iconButton}>
                        ✏️
                    </button>
                </div>
            )}
        </div>
    );
}