"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User as AuthUser } from "firebase/auth";
import { auth, db } from "@/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";

// Define una interfaz para el perfil de tu usuario
export interface UserProfile {
  uid: string;
  email: string | null;
  nombre: string | null;
  edad?: number | null;
  peso?: number | null;
  altura?: number | null;

  diabetesRisk?: number | null;
  hypertensionRisk?: number | null;
  smartPlanProgress?: number | null;
}

// Define el tipo del Contexto
type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
};

// Crea el Contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Crea el Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (authUser: AuthUser | null) => {
        if (authUser) {
          setLoading(true);
          const userDocRef = doc(db, "users", authUser.uid);

          const unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();

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
              console.warn(
                "Usuario autenticado pero sin documento en Firestore."
              );
              setUser({
                uid: authUser.uid,
                email: authUser.email,
                nombre: null,
                diabetesRisk: null,
                hypertensionRisk: null,
                smartPlanProgress: null,
              });
            }
            setLoading(false);
          });

          return () => unsubscribeFirestore();
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Exporta el hook personalizado
export const useAuth = () => useContext(AuthContext);
