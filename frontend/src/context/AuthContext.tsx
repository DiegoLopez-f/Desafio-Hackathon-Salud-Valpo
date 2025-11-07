'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as AuthUser } from 'firebase/auth';
import { auth, db } from '../firebase/client';
import { doc, onSnapshot } from 'firebase/firestore';

// 1. Define una interfaz para el perfil de tu usuario
export interface UserProfile {
    uid: string;
    email: string | null;
    nombre: string | null;
    edad?: number | null;
    peso?: number | null;
    altura?: number | null;

    // --- ¡CAMBIO CRÍTICO AQUÍ! ---
    // Estos deben ser 'number' para que coincidan con IndicatorCard
    diabetesRisk?: number | null;
    hypertensionRisk?: number | null;
    smartPlanProgress?: number | null;
}

// 2. Define el tipo del Contexto
type AuthContextType = {
    user: UserProfile | null; // <-- Usa nuestra interfaz
    loading: boolean;
};

// 3. Crea el Contexto
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

// 4. Crea el Proveedor (Provider)
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (authUser: AuthUser | null) => {

            if (authUser) {
                // --- Usuario está logueado ---
                setLoading(true);
                const userDocRef = doc(db, 'users', authUser.uid);

                const unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();

                        // --- ¡CAMBIO CRÍTICO AQUÍ! ---
                        // Leemos los valores numéricos (o null) de Firestore
                        setUser({
                            uid: authUser.uid,
                            email: authUser.email,
                            nombre: data.nombre || null,
                            edad: data.edad || null,
                            peso: data.peso || null,
                            altura: data.altura || null,
                            diabetesRisk: data.diabetesRisk || null,
                            hypertensionRisk: data.hypertensionRisk || null,
                            smartPlanProgress: data.smartPlanProgress || null,
                        });
                    } else {
                        console.warn("Usuario autenticado pero sin documento en Firestore.");
                        setUser({
                            uid: authUser.uid,
                            email: authUser.email,
                            nombre: null,
                            // Aseguramos que los campos existan como null
                            diabetesRisk: null,
                            hypertensionRisk: null,
                            smartPlanProgress: null,
                        });
                    }
                    setLoading(false);
                });

                return () => unsubscribeFirestore();

            } else {
                // --- Usuario no está logueado ---
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

// 5. Exporta el hook personalizado
export const useAuth = () => useContext(AuthContext);