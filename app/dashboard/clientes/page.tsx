"use client";

import React from "react";
import styles from "../page.module.css";
import { Users } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Directorio de Clientes</h1>
          <p className={styles.subtitle}>Gestión de empresas y personas</p>
        </div>
        <button className={styles.primaryButton}>+ Nuevo Cliente</button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <Users size={48} color="#9ca3af" style={{ margin: "0 auto 1rem" }} />
          <h3>No hay clientes registrados</h3>
          <p>Agrega un cliente para comenzar a gestionar sus oportunidades.</p>
        </div>
      </div>
    </div>
  );
}
