"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../page.module.css";
import { Calendar as CalendarIcon, Clock, CheckCircle, FileText } from "lucide-react";
import Modal from "@/components/Modal";
import TaskForm from "@/components/forms/TaskForm";
import { createClient } from "@/utils/supabase/client";
import { useUserRole } from "@/utils/useUserRole";

interface Actividad {
  idactividad: number;
  tipointeraccion: string | null;
  fechahora: string | null;
  notas: string | null;
  fechaproximoseguimiento: string | null;
  oportunidades: {
    titulonegocio: string | null;
    propietariocuenta: string | null;
    clientes: { razonsocial: string | null } | null;
  } | null;
}

const TIPO_COLORS: Record<string, string> = {
  Llamada: "#3b82f6",
  Correo: "#8b5cf6",
  "Reunión Presencial": "#10b981",
  Videollamada: "#f59e0b",
  WhatsApp: "#22c55e",
};

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, isLeader, loading: roleLoading } = useUserRole();

  const fetchActividades = useCallback(async () => {
    if (roleLoading || !userId) return;
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("registroactividades")
      .select(`
        idactividad,
        tipointeraccion,
        fechahora,
        notas,
        fechaproximoseguimiento,
        oportunidades(titulonegocio, propietariocuenta, clientes(razonsocial))
      `)
      .order("fechahora", { ascending: false });

    if (error) {
      console.error("Error cargando actividades:", error);
      setLoading(false);
      return;
    }

    const filtered = isLeader
      ? data || []
      : (data || []).filter((a: any) => a.oportunidades?.propietariocuenta === userId);

    setActividades(filtered as unknown as Actividad[]);
    setLoading(false);
  }, [userId, isLeader, roleLoading]);

  useEffect(() => {
    fetchActividades();
  }, [fetchActividades]);

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchActividades();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("es-CO", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Tareas y Actividades</h1>
          <p className={styles.subtitle}>
            {isLeader ? "Todas las actividades del equipo" : "Tus actividades registradas"}
          </p>
        </div>
        <button
          className={styles.primaryButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Programar Tarea
        </button>
      </header>

      <div className={styles.mainGrid}>
        {/* Activity List */}
        <div className={styles.activitiesColumn}>
          <div className={styles.activitiesCard}>
            <h3 className={styles.activitiesTitle}>Actividades Registradas</h3>

            {loading || roleLoading ? (
              <p style={{ padding: "1rem", color: "#9ca3af" }}>Cargando actividades...</p>
            ) : actividades.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
                <CalendarIcon size={40} style={{ margin: "0 auto 0.75rem" }} />
                <p>No hay actividades registradas</p>
              </div>
            ) : (
              <div className={styles.activitiesList}>
                {actividades.map((act) => {
                  const color = TIPO_COLORS[act.tipointeraccion || ""] || "#6b7280";
                  return (
                    <div key={act.idactividad} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <Clock size={20} style={{ color }} />
                      </div>
                      <div className={styles.activityInfo}>
                        <h4 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>{act.tipointeraccion || "Actividad"}</span>
                          <span style={{
                            fontSize: "0.75rem",
                            backgroundColor: color + "20",
                            color,
                            padding: "0.15rem 0.5rem",
                            borderRadius: "999px",
                            fontWeight: 600,
                          }}>
                            {act.oportunidades?.clientes?.razonsocial || "Sin cliente"}
                          </span>
                        </h4>
                        <p style={{ color: "#374151", fontWeight: 500 }}>
                          {act.oportunidades?.titulonegocio || "Sin oportunidad"}
                        </p>
                        {act.notas && (
                          <p style={{ color: "#6b7280", fontSize: "0.82rem", marginTop: "0.25rem", fontStyle: "italic" }}>
                            {act.notas.length > 100 ? act.notas.substring(0, 100) + "..." : act.notas}
                          </p>
                        )}
                        <p style={{ color, fontWeight: 500, fontSize: "0.78rem", marginTop: "0.4rem" }}>
                          {formatDate(act.fechahora)}
                        </p>
                        {act.fechaproximoseguimiento && (
                          <p style={{ color: "#f59e0b", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                            📅 Próximo seguimiento: {formatDate(act.fechaproximoseguimiento)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className={styles.chartsColumn}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={20} />
              Resumen de Actividades
            </h3>
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {Object.entries(
                actividades.reduce((acc: Record<string, number>, a) => {
                  const tipo = a.tipointeraccion || "Otro";
                  acc[tipo] = (acc[tipo] || 0) + 1;
                  return acc;
                }, {})
              ).map(([tipo, count]) => (
                <div key={tipo} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    backgroundColor: TIPO_COLORS[tipo] || "#6b7280", flexShrink: 0,
                  }} />
                  <span style={{ flex: 1, color: "#374151", fontSize: "0.9rem" }}>{tipo}</span>
                  <span style={{
                    backgroundColor: "#f3f4f6", color: "#374151",
                    padding: "0.1rem 0.6rem", borderRadius: "999px",
                    fontSize: "0.82rem", fontWeight: 600,
                  }}>{count}</span>
                </div>
              ))}
              {actividades.length === 0 && (
                <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Sin datos aún</p>
              )}
            </div>
            <div style={{
              marginTop: "2rem", padding: "1rem",
              backgroundColor: "#f0f9ff", borderRadius: "10px", border: "1px solid #bae6fd"
            }}>
              <p style={{ color: "#0369a1", fontSize: "0.9rem", fontWeight: 600 }}>
                Total de actividades
              </p>
              <p style={{ color: "#0369a1", fontSize: "2rem", fontWeight: 700, marginTop: "0.25rem" }}>
                {actividades.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Programar Nueva Tarea"
      >
        <TaskForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
}
