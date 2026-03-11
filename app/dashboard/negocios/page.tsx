"use client";

import React from "react";
import styles from "../page.module.css";
import { Briefcase } from "lucide-react";

export default function DealsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Oportunidades de Negocio</h1>
          <p className={styles.subtitle}>Tablero Kanban de ventas</p>
        </div>
        <button className={styles.primaryButton}>+ Nueva Oportunidad</button>
      </header>

      <div className={styles.tableCard} style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
        <div className={styles.emptyState} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '4rem' }}>
          <Briefcase size={48} color="#9ca3af" style={{ margin: "0 auto 1rem" }} />
          <h3>No hay negocios en curso</h3>
          <p>Crea una oportunidad para rastrear su ciclo de venta.</p>
        </div>
      </div>
    </div>
  );
}
