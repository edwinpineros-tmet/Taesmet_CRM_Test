"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../page.module.css";
import { Users } from "lucide-react";
import Modal from "@/components/Modal";
import ClientForm from "@/components/forms/ClientForm";
import { createClient } from "@/utils/supabase/client";
import { useUserRole } from "@/utils/useUserRole";

interface Cliente {
  nit: number;
  razonsocial: string | null;
  tipocliente: string | null;
  emailcontactocuenta: string | null;
  fechacreacioncliente: string | null;
}

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, isLeader, loading: roleLoading } = useUserRole();

  const fetchClientes = useCallback(async () => {
    if (roleLoading || !userId) return;
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("clientes")
      .select("nit, razonsocial, tipocliente, emailcontactocuenta, fechacreacioncliente")
      .order("razonsocial");

    if (!isLeader) {
      query = query.eq("propietariocuenta", userId);
    }

    const { data, error } = await query;
    if (error) console.error("Error cargando clientes:", error);
    else setClientes((data as Cliente[]) || []);
    setLoading(false);
  }, [userId, isLeader, roleLoading]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchClientes();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Directorio de Clientes</h1>
          <p className={styles.subtitle}>
            {isLeader ? "Todos los clientes del equipo" : "Tus clientes asignados"}
          </p>
        </div>
        <button
          className={styles.primaryButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Nuevo Cliente
        </button>
      </header>

      <div className={styles.tableCard}>
        {loading || roleLoading ? (
          <div className={styles.emptyState}>
            <p>Cargando clientes...</p>
          </div>
        ) : clientes.length === 0 ? (
          <div className={styles.emptyState}>
            <Users size={48} color="#9ca3af" style={{ margin: "0 auto 1rem" }} />
            <h3>No hay clientes registrados</h3>
            <p>Agrega un cliente para comenzar a gestionar sus oportunidades.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Razón Social</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>NIT</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Tipo</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Email</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Fecha Creación</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c, i) => (
                  <tr
                    key={c.nit}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      backgroundColor: i % 2 === 0 ? "white" : "#fafafa",
                      transition: "background 0.15s",
                    }}
                  >
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 600, color: "#121e46" }}>
                      {c.razonsocial || "—"}
                    </td>
                    <td style={{ padding: "0.875rem 1rem", color: "#374151" }}>{c.nit}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{
                        backgroundColor: c.tipocliente === "Empresa" ? "#dbeafe" : "#fef3c7",
                        color: c.tipocliente === "Empresa" ? "#1d4ed8" : "#92400e",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                      }}>
                        {c.tipocliente || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "0.875rem 1rem", color: "#6b7280" }}>{c.emailcontactocuenta || "—"}</td>
                    <td style={{ padding: "0.875rem 1rem", color: "#9ca3af", fontSize: "0.82rem" }}>
                      {c.fechacreacioncliente
                        ? new Date(c.fechacreacioncliente).toLocaleDateString("es-CO")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Cliente"
      >
        <ClientForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
}
