import { useSession, signIn, signOut } from "next-auth/react";
import { mostPlayedSports } from "../data/mostPlayedSports";

export default function Home() {
  const { data: session, status } = useSession();

  console.log("Sesión actual:", session); 
  console.log("Roles del usuario:", session?.user?.roles); 

  if (status === "loading") {
    return <p>Cargando sesión...</p>;
  }

  if (session) {
    const isAdmin = session.user?.roles?.includes("Admin");

    return (
      <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Bienvenido, {session.user?.name} 👋</h1>

        {isAdmin ? (
          <>
            <p>Estos son los deportes más jugados del mundo ahora mismo:</p>
            <ul style={{ marginTop: "1rem" }}>
              {mostPlayedSports.map((sport, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>
                  <strong>{sport.name}</strong> – {sport.players} jugadores
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Tu rol es de usuario. No tienes acceso a la lista completa.</p>
        )}

        <button onClick={() => signOut()} style={{ marginTop: "2rem" }}>
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>App de Deportes 🌍</h1>
      <button onClick={() => signIn("keycloak")}>Iniciar sesión</button>
    </div>
  );
}
