"use client";

import React, { useState } from "react";
import styles from "../page.module.css";
import { Users } from "lucide-react";
import Modal from "@/components/Modal";
import ClientForm from "@/components/forms/ClientForm";

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // You can refresh the client list here later
  const handleSuccess = () => {
    setIsModalOpen(false);
    alert("Cliente creado exitosamente");
    // TODO: Refresh page or client data
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Directorio de Clientes</h1>
          <p className={styles.subtitle}>Gestión de empresas y personas</p>
        </div>
        <button 
          className={styles.primaryButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Nuevo Cliente
        </button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <Users size={48} color="#9ca3af" style={{ margin: "0 auto 1rem" }} />
          <h3>No hay clientes registrados</h3>
          <p>Agrega un cliente para comenzar a gestionar sus oportunidades.</p>
        </div>
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
