'use client'; // <-- Componente de Cliente, igual que el login

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importa el componente Link para navegación
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/client'; // Importamos la misma config de auth
import styles from './page.module.css'; // Usaremos estilos específicos

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Campo extra
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validación de contraseña
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        try {
            // Usa la función de Firebase para CREAR un usuario
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            console.log('Usuario registrado:', userCredential.user.uid);

            // ¡Éxito!
            // Aquí es donde, en el futuro, crearías el documento del usuario en Firestore.

            // Redirige al dashboard
            router.push('/dashboard');

        } catch (err: any) {
            // Manejo de errores de Firebase
            console.error(err.code, err.message);

            let friendlyMessage = 'Ocurrió un error. Intenta de nuevo.';
            if (err.code === 'auth/email-already-in-use') {
                friendlyMessage = 'Este email ya está registrado.';
            } else if (err.code === 'auth/weak-password') {
                friendlyMessage = 'La contraseña es muy débil (debe tener al menos 6 caracteres).';
            }

            setError(friendlyMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.mainContainer}>
            <div className={styles.registerContainer}> {/* Cambiamos el nombre de la clase */}
                <form onSubmit={handleRegister}>
                    <h2>Crear Cuenta</h2>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className={styles.errorText}>{error}</p>
                    )}

                    <button
                        type="submit"
                        className={styles.registerButton} // Cambiamos el nombre
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creando...' : 'Crear Cuenta'}
                    </button>

                    <p className={styles.loginLink}>
                        ¿Ya tienes una cuenta?{' '}
                        {/* Link para volver a la página de inicio (login) */}
                        <Link href="/">Iniciar Sesión</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}