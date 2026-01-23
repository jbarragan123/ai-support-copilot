import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Ticket = {
  id: string;
  description: string;
  category: string;
  sentiment: string;
  processed: boolean;
};

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setTickets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
    const channel = supabase
      .channel("tickets-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, fetchTickets)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const total = tickets.length;
  const processed = tickets.filter(t => t.processed).length;
  const pending = total - processed;
  const negative = tickets.filter(t => t.sentiment === "Negative").length;

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Contenedor principal que centra vertical y horizontalmente */}
      <div className="container-fluid flex-grow-1 d-flex justify-content-center align-items-center py-5">
        {/* Contenedor interno más estrecho y centrado */}
        <div className="container-xl">
          {/* Header */}
          <header className="text-center mb-5 pb-4">
            <div className="d-inline-flex align-items-center justify-content-center gap-4 bg-white shadow-lg rounded-4 p-4 px-md-5 mx-auto">
              <div className="bg-primary text-white fs-1 p-4 rounded-3 shadow">
                <i className="bi bi-robot"></i>
              </div>
              <div className="text-start">
                <h1 className="display-4 fw-bold text-primary mb-1">AI Support Copilot</h1>
                <p className="lead text-muted fs-5 m-0">Clasificación inteligente en tiempo real</p>
                <small className="text-muted">Autor: Juan Barragan</small>
              </div>
            </div>
          </header>

          {/* Stats - centradas */}
          <div className="row g-4 justify-content-center mb-5">
            <div className="col-6 col-sm-6 col-md-3 col-lg-3">
              <div className="card shadow border-0 h-100 text-center">
                <div className="card-body">
                  <i className="bi bi-envelope-fill text-primary fs-1 mb-3 d-block"></i>
                  <h5 className="card-title text-muted mb-1">Total Tickets</h5>
                  <p className="display-5 fw-bold mb-0">{total}</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-sm-6 col-md-3 col-lg-3">
              <div className="card shadow border-0 h-100 text-center">
                <div className="card-body">
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>
                  <h5 className="card-title text-muted mb-1">Procesados</h5>
                  <p className="display-5 fw-bold mb-0">{processed}</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-sm-6 col-md-3 col-lg-3">
              <div className="card shadow border-0 h-100 text-center">
                <div className="card-body">
                  <i className="bi bi-hourglass-split text-warning fs-1 mb-3 d-block"></i>
                  <h5 className="card-title text-muted mb-1">Pendientes</h5>
                  <p className="display-5 fw-bold mb-0">{pending}</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-sm-6 col-md-3 col-lg-3">
              <div className="card shadow border-0 h-100 text-center">
                <div className="card-body">
                  <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
                  <h5 className="card-title text-muted mb-1">Negativos</h5>
                  <p className="display-5 fw-bold mb-0">{negative}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets */}
          {loading ? (
            <div className="row g-4 justify-content-center">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0 placeholder-glow">
                    <div className="card-body">
                      <p className="placeholder col-12 bg-secondary-subtle rounded" style={{ height: "100px" }}></p>
                      <div className="d-flex gap-2 mt-3">
                        <span className="placeholder col-5 bg-secondary-subtle rounded-pill"></span>
                        <span className="placeholder col-5 bg-secondary-subtle rounded-pill"></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-5 my-5">
              <i className="bi bi-inbox text-secondary" style={{ fontSize: "10rem" }}></i>
              <h3 className="mt-4 text-muted">No hay tickets aún</h3>
              <p className="lead text-muted">Aparecerán aquí en tiempo real</p>
            </div>
          ) : (
            <div className="row g-4 justify-content-center">
              {tickets.map(ticket => (
                <div key={ticket.id} className="col-md-6 col-lg-4">
                  <div className="card shadow border-0 h-100">
                    <div className="card-body d-flex flex-column">
                      <p className="card-text mb-4 flex-grow-1 lh-base">
                        {ticket.description}
                      </p>
                      <div className="d-flex flex-wrap gap-2 mt-auto">
                        <span className={`badge rounded-pill px-3 py-2 fs-6 ${
                          ticket.category === "Técnico" ? "bg-primary-subtle text-primary" :
                          ticket.category === "Facturación" ? "bg-purple-subtle text-purple" :
                          ticket.category === "Comercial" ? "bg-warning-subtle text-warning" :
                          "bg-secondary-subtle text-secondary"
                        }`}>
                          {ticket.category}
                        </span>
                        <span className={`badge rounded-pill px-3 py-2 fs-6 ${
                          ticket.sentiment === "Positivo" ? "bg-success-subtle text-success" :
                          ticket.sentiment === "Negativo" ? "bg-danger-subtle text-danger" :
                          "bg-secondary-subtle text-secondary"
                        }`}>
                          {ticket.sentiment}
                        </span>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center small text-muted">
                      <span className={ticket.processed ? "text-success fw-semibold" : "text-warning fw-semibold"}>
                        {ticket.processed ? <><i className="bi bi-check-circle me-1"></i>Procesado</> : <><i className="bi bi-hourglass me-1"></i>Pendiente</>}
                      </span>
                      <span className="font-monospace">#{ticket.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <footer className="text-center mt-5 pt-4 text-muted small border-top">
            Powered by FastAPI · Supabase · React · Bootstrap 5
          </footer>
        </div>
      </div>
    </div>
  );
}