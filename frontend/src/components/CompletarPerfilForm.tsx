'use client';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { UserProfile } from '@/context/AuthContext';
import styles from './CompletarPerfilForm.module.css';

interface Props {
    user: UserProfile;
}

// Función helper para parsear a Entero
const toIntOrNull = (value: any) => {
    const parsed = parseInt(value.toString(), 10);
    return isNaN(parsed) ? null : parsed;
};

export default function CompletarPerfilForm({ user }: Props) {

    // --- Estados (pre-llenados) ---
    const [nombre, setNombre] = useState(user.nombre || '');
    const [apellido, setApellido] = useState(user.apellido || '');
    const [rut, setRut] = useState(user.rut || '');
    const [genero, setGenero] = useState(user.genero || '');
    const [edad, setEdad] = useState(user.edad || '');
    const [peso, setPeso] = useState(user.peso || '');
    const [altura, setAltura] = useState(user.altura || '');

    const [actividadFisicaSemanal, setActividadFisicaSemanal] = useState(user.actividadFisicaSemanal || '');
    const [caminatasSemanal, setCaminatasSemanal] = useState(user.caminatasSemanal || '');
    const [horasSueño, setHorasSueño] = useState(user.horasSueño || '');

    const [vegano, setVegano] = useState(user.vegano || false);
    const [vegetariano, setVegetariano] = useState(user.vegetariano || false);
    const [intoleranteLactosa, setIntoleranteLactosa] = useState(user.intoleranteLactosa || false);
    const [celiaco, setCeliaco] = useState(user.celiaco || false);

    const [cigarrillosDiarios, setCigarrillosDiarios] = useState(user.cigarrillosDiarios || '');
    // <-- CAMBIO AQUÍ: El estado usa el número como string, o un string vacío
    const [frecuenciaAlcohol, setFrecuenciaAlcohol] = useState(user.frecuenciaAlcohol?.toString() || '');
    const [porcionesFrutaVerduraDiarias, setPorcionesFrutaVerduraDiarias] = useState(user.porcionesFrutaVerduraDiarias || '');
    const [gaseosasSemana, setGaseosasSemana] = useState(user.gaseosasSemana || '');
    const [aguaDiariaMl, setAguaDiariaMl] = useState(user.aguaDiariaMl || '');

    const [azucaresDiarios, setAzucaresDiarios] = useState(user.azucaresDiarios || '');
    const [sodioDiario, setSodioDiario] = useState(user.sodioDiario || '');
    const [kcalDiarias, setKcalDiarias] = useState(user.kcalDiarias || '');
    const [pesoPlato, setPesoPlato] = useState(user.pesoPlato || '');
    const [colesterolMg, setColesterolMg] = useState(user.colesterolMg || '');
    const [proteinasDiarias, setProteinasDiarias] = useState(user.proteinasDiarias || '');
    const [grasasTotalesDiarias, setGrasasTotalesDiarias] = useState(user.grasasTotalesDiarias || '');
    const [grasasSaturadasDiarias, setGrasasSaturadasDiarias] = useState(user.grasasSaturadasDiarias || '');
    const [carbohidratosDiarios, setCarbohidratosDiarios] = useState(user.carbohidratosDiarios || '');

    const [colesterolAltoDiagnosticado, setColesterolAltoDiagnosticado] = useState(user.colesterolAltoDiagnosticado === 1);
    const [dificultadRespirar, setDificultadRespirar] = useState(user.dificultadRespirar === 1);
    const [dolorPecho, setDolorPecho] = useState(user.dolorPecho === 1);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (!nombre || !apellido || !edad || !peso || !altura || !genero || !rut) {
            setError('Por favor, completa al menos los datos personales.');
            setIsLoading(false);
            return;
        }

        try {
            const userDocRef = doc(db, 'users', user.uid);

            const userData = {
                // Strings (Texto)
                nombre: nombre,
                apellido: apellido,
                rut: rut,
                genero: genero,

                // Booleans (true/false)
                vegano: vegano,
                vegetariano: vegetariano,
                intoleranteLactosa: intoleranteLactosa,
                celiaco: celiaco,

                // Booleans convertidos a Entero (1 o 0)
                colesterolAltoDiagnosticado: colesterolAltoDiagnosticado ? 1 : 0,
                dificultadRespirar: dificultadRespirar ? 1 : 0,
                dolorPecho: dolorPecho ? 1 : 0,

                // Todos los demás parseados a Entero (o null)
                frecuenciaAlcohol: toIntOrNull(frecuenciaAlcohol), // <-- CAMBIO AQUÍ
                edad: toIntOrNull(edad),
                peso: toIntOrNull(peso),
                altura: toIntOrNull(altura),
                actividadFisicaSemanal: toIntOrNull(actividadFisicaSemanal),
                caminatasSemanal: toIntOrNull(caminatasSemanal),
                horasSueño: toIntOrNull(horasSueño),
                cigarrillosDiarios: toIntOrNull(cigarrillosDiarios),
                porcionesFrutaVerduraDiarias: toIntOrNull(porcionesFrutaVerduraDiarias),
                gaseosasSemana: toIntOrNull(gaseosasSemana),
                aguaDiariaMl: toIntOrNull(aguaDiariaMl),
                sodioDiario: toIntOrNull(sodioDiario),
                kcalDiarias: toIntOrNull(kcalDiarias),
                colesterolMg: toIntOrNull(colesterolMg),
                azucaresDiarios: toIntOrNull(azucaresDiarios),
                pesoPlato: toIntOrNull(pesoPlato),
                proteinasDiarias: toIntOrNull(proteinasDiarias),
                grasasTotalesDiarias: toIntOrNull(grasasTotalesDiarias),
                grasasSaturadasDiarias: toIntOrNull(grasasSaturadasDiarias),
                carbohidratosDiarios: toIntOrNull(carbohidratosDiarios),
            };

            await setDoc(userDocRef, userData, { merge: true });
            setSuccess('¡Perfil guardado con éxito!');

        } catch (err) {
            console.error(err);
            setError('Error al guardar. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>

                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Datos Personales</legend>
                    {/* ... inputs de nombre, apellido, rut, genero, edad, peso, altura ... */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="nombre">Nombre</label>
                        <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="apellido">Apellido</label>
                        <input id="apellido" type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="rut">RUT (sin puntos, con guión)</label>
                        <input id="rut" type="text" value={rut} onChange={(e) => setRut(e.target.value)} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="genero">Género</label>
                        <select id="genero" value={genero} onChange={(e) => setGenero(e.target.value)} required>
                            <option value="">Selecciona...</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                            <option value="Prefiero no decir">Prefiero no decir</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="edad">Edad</label>
                        <input id="edad" type="number" step="1" value={edad} onChange={(e) => setEdad(e.target.value)} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="peso">Peso (en kg, ej: 70)</label>
                        <input id="peso" type="number" step="1" value={peso} onChange={(e) => setPeso(e.target.value)} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="altura">Altura (en cm, ej: 175)</label>
                        <input id="altura" type="number" step="1" value={altura} onChange={(e) => setAltura(e.target.value)} required />
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Actividad Física y Descanso</legend>
                    {/* ... inputs de actividadFisicaSemanal, caminatasSemanal, horasSueño ... */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="actividadFisicaSemanal">Actividad física/semana (veces)</label>
                        <input id="actividadFisicaSemanal" type="number" step="1" value={actividadFisicaSemanal} onChange={(e) => setActividadFisicaSemanal(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="caminatasSemanal">Caminatas (+10 min) /semana (veces)</label>
                        <input id="caminatasSemanal" type="number" step="1" value={caminatasSemanal} onChange={(e) => setCaminatasSemanal(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="horasSueño">Horas de sueño (promedio, ej: 7)</label>
                        <input id="horasSueño" type="number" step="1" value={horasSueño} onChange={(e) => setHorasSueño(e.target.value)} />
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Dieta y Hábitos</legend>
                    {/* ... inputs de porciones, gaseosas, agua, cigarrillos ... */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="porcionesFrutaVerduraDiarias">Porciones Fruta/Verdura (diarias)</label>
                        <input id="porcionesFrutaVerduraDiarias" type="number" step="1" value={porcionesFrutaVerduraDiarias} onChange={(e) => setPorcionesFrutaVerduraDiarias(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="gaseosasSemana">Bebidas gaseosas (semanal)</label>
                        <input id="gaseosasSemana" type="number" step="1" value={gaseosasSemana} onChange={(e) => setGaseosasSemana(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="aguaDiariaMl">Ingesta de agua (ml diarios)</label>
                        <input id="aguaDiariaMl" type="number" step="1" value={aguaDiariaMl} onChange={(e) => setAguaDiariaMl(e.target.value)} />
                    </div>

                    {/* --- CAMBIO AQUÍ: El select ahora usa 'value' numéricos --- */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="frecuenciaAlcohol">Frecuencia de alcohol (últimos 12 meses)</label>
                        <select id="frecuenciaAlcohol" value={frecuenciaAlcohol} onChange={(e) => setFrecuenciaAlcohol(e.target.value)}>
                            <option value="">Selecciona...</option>
                            <option value="0">Nunca</option>
                            <option value="1">Mensual o menos</option>
                            <option value="2">2-4 veces al mes</option>
                            <option value="3">2-3 veces por semana</option>
                            <option value="4">4 o más veces por semana</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="cigarrillosDiarios">Cigarrillos (diarios)</label>
                        <input id="cigarrillosDiarios" type="number" step="1" value={cigarrillosDiarios} onChange={(e) => setCigarrillosDiarios(e.target.value)} />
                    </div>
                </fieldset>

                <fieldset className={`${styles.fieldset} ${styles.checkboxGroup}`}>
                    <legend className={styles.legend}>Restricciones Alimentarias (Boolean)</legend>
                    {/* ... checkboxes para vegano, vegetariano, intoleranteLactosa, celiaco ... */}
                    <div className={styles.inputGroupCheckbox}>
                        <input id="vegano" type="checkbox" checked={vegano} onChange={(e) => setVegano(e.target.checked)} />
                        <label htmlFor="vegano">¿Vegano?</label>
                    </div>
                    <div className={styles.inputGroupCheckbox}>
                        <input id="vegetariano" type="checkbox" checked={vegetariano} onChange={(e) => setVegetariano(e.target.checked)} />
                        <label htmlFor="vegetariano">¿Vegetariano?</label>
                    </div>
                    <div className={styles.inputGroupCheckbox}>
                        <input id="intoleranteLactosa" type="checkbox" checked={intoleranteLactosa} onChange={(e) => setIntoleranteLactosa(e.target.checked)} />
                        <label htmlFor="intoleranteLactosa">¿Intolerante a la lactosa?</label>
                    </div>
                    <div className={styles.inputGroupCheckbox}>
                        <input id="celiaco" type="checkbox" checked={celiaco} onChange={(e) => setCeliaco(e.target.checked)} />
                        <label htmlFor="celiaco">¿Celíaco?</label>
                    </div>
                </fieldset>

                <fieldset className={`${styles.fieldset} ${styles.checkboxGroup}`}>
                    <legend className={styles.legend}>Historial Médico (Sí/No)</legend>
                    {/* ... checkboxes para colesterolAltoDiagnosticado, dificultadRespirar, dolorPecho ... */}
                    <div className={styles.inputGroupCheckbox}>
                        <input id="colesterolAltoDiagnosticado" type="checkbox" checked={colesterolAltoDiagnosticado} onChange={(e) => setColesterolAltoDiagnosticado(e.target.checked)} />
                        <label htmlFor="colesterolAltoDiagnosticado">¿Colesterol alto (diagnosticado)?</label>
                    </div>
                    <div className={styles.inputGroupCheckbox}>
                        <input id="dificultadRespirar" type="checkbox" checked={dificultadRespirar} onChange={(e) => setDificultadRespirar(e.target.checked)} />
                        <label htmlFor="dificultadRespirar">¿Dificultad para respirar en escaleras?</label>
                    </div>
                    <div className={styles.inputGroupCheckbox}>
                        <input id="dolorPecho" type="checkbox" checked={dolorPecho} onChange={(e) => setDolorPecho(e.target.checked)} />
                        <label htmlFor="dolorPecho">¿Dolor o molestias en el pecho?</label>
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Detalle Nutricional (Opcional)</legend>
                    {/* ... inputs para kcalDiarias, proteinasDiarias, etc ... */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="kcalDiarias">Kcal diarias (promedio)</label>
                        <input id="kcalDiarias" type="number" step="1" value={kcalDiarias} onChange={(e) => setKcalDiarias(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="proteinasDiarias">Proteínas diarias (g)</label>
                        <input id="proteinasDiarias" type="number" step="1" value={proteinasDiarias} onChange={(e) => setProteinasDiarias(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="grasasTotalesDiarias">Grasas totales diarias (g)</label>
                        <input id="grasasTotalesDiarias" type="number" step="1" value={grasasTotalesDiarias} onChange={(e) => setGrasasTotalesDiarias(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="grasasSaturadasDiarias">Grasas saturadas diarias (g)</label>
                        <input id="grasasSaturadasDiarias" type="number" step="1" value={grasasSaturadasDiarias} onChange={(e) => setGrasasSaturadasDiarias(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="carbohidratosDiarios">Carbohidratos diarios (g)</label>
                        <input id="carbohidratosDiarios" type="number" step="1" value={carbohidratosDiarios} onChange={(e) => setCarbohidratosDiarios(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="azucaresDiarios">Azúcares totales diarios (mg)</label>
                        <input id="azucaresDiarios" type="number" step="1" value={azucaresDiarios} onChange={(e) => setAzucaresDiarios(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="sodioDiario">Sodio diario (mg)</label>
                        <input id="sodioDiario" type="number" step="1" value={sodioDiario} onChange={(e) => setSodioDiario(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="colesterolMg">Colesterol (mg)</label>
                        <input id="colesterolMg" type="number" step="1" value={colesterolMg} onChange={(e) => setColesterolMg(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="pesoPlato">Peso del plato (g)</label>
                        <input id="pesoPlato" type="number" step="1" value={pesoPlato} onChange={(e) => setPesoPlato(e.target.value)} />
                    </div>
                </fieldset>

                {error && <p className={styles.errorText}>{error}</p>}
                {success && <p className={styles.successText}>{success}</p>}

                <button type="submit" className={styles.saveButton} disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar Perfil'}
                </button>
            </form>
        </div>
    );
}