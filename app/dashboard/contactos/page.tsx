"use client";

import React, { useState } from "react";
import styles from "../page.module.css";
import { Contact } from "lucide-react";
import Modal from "@/components/Modal";
import ContactForm from "@/components/forms/ContactForm";

export default function ContactsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    alert("Contacto creado exitosamente");
    // TODO: Refresh data
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Contactos</h1>
          <p className={styles.subtitle}>Directorio de contactos vinculados</p>
        </div>
        <button 
          className={styles.primaryButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Nuevo Contacto
        </button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <Contact size={48} color="#9ca3af" style={{ margin: "0 auto 1rem" }} />
          <h3>No hay contactos</h3>
          <p>Los contactos se vinculularán a tus clientes.</p>
        </div>
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
