"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../page.module.css";
import { Briefcase } from "lucide-react";
import Modal from "@/components/Modal";
import DealForm from "@/components/forms/DealForm";
import { createClient } from "@/utils/supabase/client";
import { useUserRole } from "@/utils/useUserRole";

interface Oportunidad {
  idoportunidad: number;
  titulonegocio: string | null;
  etapa: string | null;
  nivelinteres: string | null;
  montoestimado: number | null;
  fechacreacionoportunidad: string | null;
  clientes: { razonsocial: string | null } | null;
}

const ETAPA_COLORS: Record<string, { bg: string; text: string }> = {
  "1. Prospección": { bg: "#ede9fe", text: "#5b21b6" },
  "2. Negociación": { bg: "#dbeafe", text: "#1e40af" },
  "3. Cotización": { bg: "#fef3c7", text: "#92400e" },
  "4. Cierre Ganado": { bg: "#d1fae5", text: "#065f46" },
  "5. Cierre Perdido": { bg: "#fee2e2", text: "#991b1b" },
};

const INTERES_COLORS: Record<string, { bg: string; text: string }> = {
  Alto: { bg: "#d1fae5", text: "#065f46" },
  Medio: { bg: "#fef3c7", text: "#92400e" },
  Bajo: { bg: "#fee2e2", text: "#991b1b" },
};

export default function DealsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oportunidades, setOportunidades] = useState<Oportunidad[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, isLeader, loading: roleLoading } = useUserRole();

  const fetchOportunidades = useCallback(async () => {
    if (roleLoading || !userId) return;
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("oportunidades")
      .select("idoportunidad, titulonegocio, etapa, nivelinteres, montoestimado, fechacreacionoportunidad, clientes(razonsocial)")
      .order("fechacreacionoportunidad", { ascending: false });

    if (!isLeader) {
      query = query.eq("propietariocuenta", userId);
    }

    const { data, error } = await query;
    if (error) console.error("Error cargando oportunidades:", error);
    else setOportunidades((data as unknown as Oportunidad[]) || []);
    setLoading(false);
  }, [userId, isLeader, roleLoading]);

  useEffect(() => {
    fetchOportunidades();
  }, [fetchOportunidades]);

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchOportunidades();
  };

  const formatCOP = (value: number | null) => {
    if (value == null) return "—";
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Oportunidades de Negocio</h1>
          <p className={styles.subtitle}>
            {isLeader ? "Todas las oportunidades del equipo" : "Tus oportunidades activas"}
          </p>
        </div>
        <button
          className={styles.primaryButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Nueva Oportunidad
        </button>
      </header>

      <div className={styles.tableCard}>
        {loading || roleLoading ? (
          <div className={styles.emptyState}>
            <p>Cargando oportunidades...</p>
          </div>
        ) : oportunidades.length === 0 ? (
          <div className={styles.emptyState}>
            <Briefcase size={48} color="#9ca3af" style={{ margin: "0 auto 1rem" }} />
            <h3>No hay negocios en curso</h3>
            <p>Crea una oportunidad para rastrear su ciclo de venta.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Oportunidad</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Cliente</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Etapa</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Interés</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Monto Estimado</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {oportunidades.map((op, i) => {
                  const etapaColor = ETAPA_COLORS[op.etapa || ""] || { bg: "#f3f4f6", text: "#374151" };
                  const interesColor = INTERES_COLORS[op.nivelinteres || ""] || { bg: "#f3f4f6", text: "#374151" };
                  return (
                    <tr
                      key={op.idoportunidad}
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                        backgroundColor: i % 2 === 0 ? "white" : "#fafafa",
                      }}
                    >
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 600, color: "#121e46" }}>
                        {op.titulonegocio || "—"}
                      </td>
                      <td style={{ padding: "0.875rem 1rem", color: "#374151" }}>
                        {op.clientes?.razonsocial || "—"}
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span style={{
                          backgroundColor: etapaColor.bg,
                          color: etapaColor.text,
                          padding: "0.2rem 0.65rem",
                          borderRadius: "999px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}>
                          {op.etapa || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span style={{
                          backgroundColor: interesColor.bg,
                          color: interesColor.text,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "999px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}>
                          {op.nivelinteres || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", color: "#374151", fontWeight: 500 }}>
                        {formatCOP(op.montoestimado)}
                      </td>
                      <td style={{ padding: "0.875rem 1rem", color: "#9ca3af", fontSize: "0.82rem" }}>
                        {op.fechacreacionoportunidad
                          ? new Date(op.fechacreacionoportunidad).toLocaleDateString("es-CO")
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Oportunidad"
      >
        <DealForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
}
