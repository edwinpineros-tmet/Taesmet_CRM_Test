"use client";

import React from "react";
import styles from "../page.module.css";
import { Contact } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Contactos</h1>
          <p className={styles.subtitle}>Directorio de contactos vinculados</p>
        </div>
        <button className={styles.primaryButton}>+ Nuevo Contacto</button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <Contact size={48} color="#9ca3af" style={{ margin: "0 auto 1rem" }} />
          <h3>No hay contactos</h3>
          <p>Los contactos se vincularán a tus clientes.</p>
        </div>
      </div>
    </div>
  );
}
