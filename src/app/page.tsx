"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import styles from "./page.module.css";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Usuario autenticado:", userCredential.user.uid);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err.code, err.message);
      let friendlyMessage = "Ocurrió un error. Intenta de nuevo.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        friendlyMessage = "El email o la contraseña son incorrectos.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "El formato del email no es válido.";
      }
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.loginContainer}>
        <form onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>

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

          {error && <p className={styles.errorText}>{error}</p>}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>

          <p className={styles.registerLink}>
            ¿No tienes una cuenta? <Link href="/registro">Regístrate</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
