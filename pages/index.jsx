import { useSession, signIn, signOut } from "next-auth/react";
import { mostPlayedSports } from "../data/mostPlayedSports";
import { useState, useEffect } from "react";
import ReservationsTable from "../components/ReservationsTable";

export default function Home() {
  const { data: session, status } = useSession();
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [reservationsError, setReservationsError] = useState(null);

  const isAdmin = session?.roles?.includes("admin");

  useEffect(() => {
    if (isAdmin) {
      fetchReservations();
    }
  }, [isAdmin]);

  const fetchReservations = async () => {
    setLoadingReservations(true);
    setReservationsError(null);
    try {
      const response = await fetch('/api/reservations');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data.reservations || []);
    } catch (error) {
      setReservationsError(error.message);
    } finally {
      setLoadingReservations(false);
    }
  };

  if (status === "loading") {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div style={{ 
        padding: "2rem", 
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <header style={{ 
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "2px solid #e0e0e0"
        }}>
          <h1 style={{ 
            color: "#1976d2",
            marginBottom: "0.5rem"
          }}>
            Bienvenido, {session.user?.name} 👋
          </h1>
          {isAdmin && (
            <div style={{ 
              backgroundColor: "#e8f5e8",
              color: "#2e7d32",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              display: "inline-block",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              🛡️ Administrador
            </div>
          )}
        </header>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#333", marginBottom: "1rem" }}>
            🌍 Deportes Más Jugados del Mundo
          </h2>
          <div style={{ 
            backgroundColor: "#f8f9fa",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e9ecef"
          }}>
            <ul style={{ 
              marginTop: "0",
              listStyle: "none",
              padding: 0
            }}>
              {mostPlayedSports.map((sport, index) => (
                <li key={index} style={{ 
                  marginBottom: "0.75rem",
                  padding: "0.5rem",
                  backgroundColor: "white",
                  borderRadius: "4px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                  <strong style={{ color: "#1976d2" }}>{sport.name}</strong> 
                  <span style={{ color: "#666" }}> – {sport.players} jugadores</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {isAdmin && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ 
              color: "#333", 
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              🛡️ Panel de Administrador - Reservas
            </h2>
            
            <ReservationsTable
              reservations={reservations}
              isLoading={loadingReservations}
              error={reservationsError}
              onRetry={fetchReservations}
            />
          </section>
        )}

        <footer style={{ 
          borderTop: "1px solid #e0e0e0",
          paddingTop: "1rem"
        }}>
          <button 
            onClick={() => signOut()} 
            style={{ 
              padding: "0.75rem 1.5rem",
              backgroundColor: "#d32f2f",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#b71c1c"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#d32f2f"}
            onFocus={(e) => e.target.style.backgroundColor = "#b71c1c"}
            onBlur={(e) => e.target.style.backgroundColor = "#d32f2f"}
          >
            🚪 Cerrar sesión
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "2rem", 
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white"
    }}>
      <div style={{
        backgroundColor: "white",
        color: "#333",
        padding: "3rem",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%"
      }}>
        <h1 style={{ 
          fontSize: "2.5rem",
          marginBottom: "0.5rem",
          color: "#1976d2"
        }}>
          🌍 Lista Deportiva
        </h1>
        <p style={{ 
          fontSize: "1.1rem",
          color: "#666",
          marginBottom: "2rem"
        }}>
          Descubre los deportes más jugados del mundo
        </p>
        <button 
          onClick={() => signIn("keycloak")}
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.3s ease",
            width: "100%"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#1565c0";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(25, 118, 210, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#1976d2";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
          onFocus={(e) => {
            e.target.style.backgroundColor = "#1565c0";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(25, 118, 210, 0.4)";
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = "#1976d2";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          🔐 Iniciar sesión con Keycloak
        </button>
        <p style={{ 
          fontSize: "0.9rem",
          color: "#999",
          marginTop: "1.5rem"
        }}>
          Inicia sesión para acceder a la aplicación
        </p>
      </div>
    </div>
  );
}
