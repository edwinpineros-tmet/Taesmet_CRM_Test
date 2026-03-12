"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../page.module.css";
import { UserCircle } from "lucide-react";
import Modal from "@/components/Modal";
import ContactForm from "@/components/forms/ContactForm";
import { createClient } from "@/utils/supabase/client";
import { useUserRole } from "@/utils/useUserRole";

interface Contacto {
  idcontacto: number;
  nombrecontacto: string;
  cargo: string | null;
  telefono: string | null;
  correo: string | null;
  clientes: { razonsocial: string | null } | null;
}

export default function ContactsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, isLeader, loading: roleLoading } = useUserRole();

  const fetchContactos = useCallback(async () => {
    if (roleLoading || !userId) return;
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("contactos")
      .select("idcontacto, nombrecontacto, cargo, telefono, correo, clientes(razonsocial, propietariocuenta)")
      .order("nombrecontacto");

    const { data, error } = await query;
    if (error) {
      console.error("Error cargando contactos:", error);
      setLoading(false);
      return;
    }

    // Filter by owner on the client side, using the nested clientes.propietariocuenta
    const filtered = isLeader
      ? data || []
      : (data || []).filter((c: any) => c.clientes?.propietariocuenta === userId);

    setContactos(filtered as unknown as Contacto[]);
    setLoading(false);
  }, [userId, isLeader, roleLoading]);

  useEffect(() => {
    fetchContactos();
  }, [fetchContactos]);

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchContactos();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Contactos</h1>
          <p className={styles.subtitle}>
            {isLeader ? "Todos los contactos del equipo" : "Contactos de tus clientes"}
          </p>
        </div>
        <button
          className={styles.primaryButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Nuevo Contacto
        </button>
      </header>

      <div className={styles.tableCard}>
        {loading || roleLoading ? (
          <div className={styles.emptyState}>
            <p>Cargando contactos...</p>
          </div>
        ) : contactos.length === 0 ? (
          <div className={styles.emptyState}>
            <UserCircle size={48} color="#9ca3af" style={{ margin: "0 auto 1rem" }} />
            <h3>No hay contactos registrados</h3>
            <p>Los contactos se vincularán a tus clientes.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Nombre</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Cargo</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Cliente</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Teléfono</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#6b7280", fontWeight: 600 }}>Correo</th>
                </tr>
              </thead>
              <tbody>
                {contactos.map((c, i) => (
                  <tr
                    key={c.idcontacto}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      backgroundColor: i % 2 === 0 ? "white" : "#fafafa",
                    }}
                  >
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 600, color: "#121e46" }}>
                      {c.nombrecontacto}
                    </td>
                    <td style={{ padding: "0.875rem 1rem", color: "#374151" }}>{c.cargo || "—"}</td>
                    <td style={{ padding: "0.875rem 1rem", color: "#374151" }}>
                      {c.clientes?.razonsocial || "—"}
                    </td>
                    <td style={{ padding: "0.875rem 1rem", color: "#6b7280" }}>{c.telefono || "—"}</td>
                    <td style={{ padding: "0.875rem 1rem", color: "#6b7280" }}>{c.correo || "—"}</td>
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
        title="Crear Nuevo Contacto"
      >
        <ContactForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
}
