'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as AuthUser } from 'firebase/auth';
import { auth, db } from '@/firebase/client';
import { doc, onSnapshot } from 'firebase/firestore';

// 1. Interfaz de Perfil de Usuario (Tipos Corregidos)
export interface UserProfile {
    uid: string;
    email: string | null;

    // Datos existentes
    nombre: string | null;
    edad?: number | null;
    peso?: number | null;
    altura?: number | null;
    diabetesRisk?: number | null;
    hypertensionRisk?: number | null;
    smartPlanProgress?: number | null;

    // --- CAMPOS NUEVOS CON TIPOS ESTRICTOS ---

    // Strings
    apellido?: string | null;
    rut?: string | null;
    genero?: string | null;

    // Booleans (los únicos 4)
    vegano?: boolean | null;
    vegetariano?: boolean | null;
    intoleranteLactosa?: boolean | null;
    celiaco?: boolean | null;

    // Todos los demás son 'number' (Enteros)
    frecuenciaAlcohol?: number | null; // <-- CAMBIO AQUÍ
    actividadFisicaSemanal?: number | null;
    caminatasSemanal?: number | null;
    horasSueño?: number | null;
    cigarrillosDiarios?: number | null;
    porcionesFrutaVerduraDiarias?: number | null;
    gaseosasSemana?: number | null;
    aguaDiariaMl?: number | null;
    azucaresDiarios?: number | null;
    sodioDiario?: number | null;
    kcalDiarias?: number | null;
    pesoPlato?: number | null;
    colesterolMg?: number | null;
    proteinasDiarias?: number | null;
    grasasTotalesDiarias?: number | null;
    grasasSaturadasDiarias?: number | null;
    carbohidratosDiarios?: number | null;

    // Enteros (1 o 0) que vienen de booleans
    colesterolAltoDiagnosticado?: number | null; // 1 o 0
    dificultadRespirar?: number | null; // 1 o 0
    dolorPecho?: number | null; // 1 o 0
}

type AuthContextType = {
    user: UserProfile | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (authUser: AuthUser | null) => {
            if (authUser) {
                setLoading(true);
                const userDocRef = doc(db, 'users', authUser.uid);

                const unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();

                        // Mapeo completo
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

                            apellido: data.apellido || null,
                            rut: data.rut || null,
                            genero: data.genero || null,
                            actividadFisicaSemanal: data.actividadFisicaSemanal || null,
                            caminatasSemanal: data.caminatasSemanal || null,
                            horasSueño: data.horasSueño || null,
                            vegano: data.vegano || null,
                            vegetariano: data.vegetariano || null,
                            intoleranteLactosa: data.intoleranteLactosa || null,
                            celiaco: data.celiaco || null,
                            cigarrillosDiarios: data.cigarrillosDiarios || null,
                            frecuenciaAlcohol: data.frecuenciaAlcohol || null, // <-- CAMBIO AQUÍ (lee el número)
                            porcionesFrutaVerduraDiarias: data.porcionesFrutaVerduraDiarias || null,
                            gaseosasSemana: data.gaseosasSemana || null,
                            aguaDiariaMl: data.aguaDiariaMl || null,
                            azucaresDiarios: data.azucaresDiarios || null,
                            sodioDiario: data.sodioDiario || null,
                            kcalDiarias: data.kcalDiarias || null,
                            pesoPlato: data.pesoPlato || null,
                            colesterolMg: data.colesterolMg || null,
                            proteinasDiarias: data.proteinasDiarias || null,
                            grasasTotalesDiarias: data.grasasTotalesDiarias || null,
                            grasasSaturadasDiarias: data.grasasSaturadasDiarias || null,
                            carbohidratosDiarios: data.carbohidratosDiarios || null,
                            colesterolAltoDiagnosticado: data.colesterolAltoDiagnosticado || null,
                            dificultadRespirar: data.dificultadRespirar || null,
                            dolorPecho: data.dolorPecho || null,
                        });
                    } else {
                        console.warn("Usuario autenticado pero sin documento en Firestore.");
                        setUser({ uid: authUser.uid, email: authUser.email, nombre: null });
                    }
                    setLoading(false);
                });

                return () => unsubscribeFirestore();
            } else {
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

export const useAuth = () => useContext(AuthContext);