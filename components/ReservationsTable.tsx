import React from 'react';

interface Reservation {
  _id: string;
  email: string;
  date: string;
  cancha_id: string;
  state: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ReservationsTableProps {
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const ReservationsTable: React.FC<ReservationsTableProps> = ({
  reservations,
  isLoading,
  error,
  onRetry
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'ACCEPTED': return '#4CAF50';
      case 'PENDING': return '#FF9800';
      case 'REJECTED': return '#F44336';
      default: return '#757575';
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: '#666'
      }}>
        <div style={{ 
          width: '20px', 
          height: '20px', 
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        Cargando reservas...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        color: "#d32f2f", 
        backgroundColor: "#ffebee", 
        padding: "1rem", 
        borderRadius: "8px",
        margin: "1rem 0",
        border: "1px solid #ffcdd2"
      }}>
        <strong>Error al cargar reservas:</strong> {error}
        <br />
        <button 
          onClick={onRetry}
          style={{ 
            marginTop: "0.5rem",
            padding: "0.5rem 1rem", 
            backgroundColor: "#1976d2", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center',
        padding: '2rem',
        color: '#666',
        fontStyle: 'italic',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        📅 No hay reservas disponibles en este momento.
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        marginBottom: '1rem',
        padding: '0.75rem',
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        border: '1px solid #bbdefb'
      }}>
        📊 <strong>Total de reservas:</strong> {reservations.length}
      </div>
      
      <div style={{ 
        maxHeight: "500px", 
        overflowY: "auto", 
        border: "1px solid #ddd", 
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse",
          fontSize: "0.9rem"
        }}>
          <thead style={{ 
            backgroundColor: "#f5f5f5", 
            position: "sticky", 
            top: 0,
            zIndex: 1
          }}>
            <tr>
              <th style={{ 
                padding: "0.75rem", 
                textAlign: "left", 
                borderBottom: "2px solid #ddd",
                fontWeight: "600"
              }}>
                📧 Email
              </th>
              <th style={{ 
                padding: "0.75rem", 
                textAlign: "left", 
                borderBottom: "2px solid #ddd",
                fontWeight: "600"
              }}>
                🏟️ Cancha
              </th>
              <th style={{ 
                padding: "0.75rem", 
                textAlign: "left", 
                borderBottom: "2px solid #ddd",
                fontWeight: "600"
              }}>
                📅 Fecha
              </th>
              <th style={{ 
                padding: "0.75rem", 
                textAlign: "left", 
                borderBottom: "2px solid #ddd",
                fontWeight: "600"
              }}>
                📋 Estado
              </th>
              <th style={{ 
                padding: "0.75rem", 
                textAlign: "left", 
                borderBottom: "2px solid #ddd",
                fontWeight: "600"
              }}>
                ⏰ Creada
              </th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr 
                key={reservation._id} 
                style={{ 
                  borderBottom: "1px solid #eee",
                  backgroundColor: index % 2 === 0 ? '#fafafa' : 'white'
                }}
              >
                <td style={{ padding: "0.75rem" }}>{reservation.email}</td>
                <td style={{ 
                  padding: "0.75rem",
                  fontWeight: "500"
                }}>
                  {reservation.cancha_id}
                </td>
                <td style={{ padding: "0.75rem" }}>
                  {formatDate(reservation.date)}
                </td>
                <td style={{ padding: "0.75rem" }}>
                  <span style={{ 
                    color: getStateColor(reservation.state),
                    fontWeight: "bold",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "12px",
                    backgroundColor: `${getStateColor(reservation.state)}20`,
                    fontSize: "0.8rem"
                  }}>
                    {reservation.state}
                  </span>
                </td>
                <td style={{ 
                  padding: "0.75rem",
                  fontSize: "0.8rem",
                  color: "#666"
                }}>
                  {formatDate(reservation.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsTable;
