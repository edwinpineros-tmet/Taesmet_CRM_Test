"use client";

import React, { useState } from "react";
import styles from "../page.module.css";
import { Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import Modal from "@/components/Modal";
import TaskForm from "@/components/forms/TaskForm";

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledTasks] = useState([
    { id: 1, type: "Llamada", title: "Seguimiento Cotización", date: "Hoy, 14:00", contact: "Carlos Martínez" },
    { id: 2, type: "Reunión Presencial", title: "Presentación de producto", date: "Mañana, 09:30", contact: "Ingeniería ABC" },
    { id: 3, type: "Correo", title: "Envío de catálogo estrcuturas", date: "Jueves, 11:00", contact: "Constructora Alfa" },
  ]);

  const handleSuccess = () => {
    setIsModalOpen(false);
    alert("Actividad registrada exitosamente");
    // TODO: Refresh data
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Tareas y Actividades</h1>
          <p className={styles.subtitle}>Registro de actividades y seguimientos de negocios</p>
        </div>
        <button 
          className={styles.primaryButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Programar Tarea
        </button>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.chartsColumn}>
          {/* Mock Calendar View */}
          <div className={styles.chartCard} style={{ minHeight: '500px' }}>
            <h3 className={styles.chartTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarIcon size={20} />
              Calendario de Actividades
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e5e7eb', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginTop: '1rem' }}>
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} style={{ padding: '0.75rem', backgroundColor: '#f9fafb', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem' }}>
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} style={{ padding: '0.5rem', backgroundColor: 'white', minHeight: '80px', position: 'relative' }}>
                  <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{i + 1 > 31 ? i - 30 : i + 1}</span>
                  {i === 15 && (
                    <div style={{ padding: '0.25rem', backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '0.75rem', borderRadius: '4px', marginTop: '4px' }}>
                      2 Tareas
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.activitiesColumn}>
          <div className={styles.activitiesCard}>
            <h3 className={styles.activitiesTitle}>Tareas Programadas</h3>
            <div className={styles.activitiesList}>
              {scheduledTasks.map(task => (
                <div key={task.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <Clock size={20} color="#f59e0b" />
                  </div>
                  <div className={styles.activityInfo}>
                    <h4 style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {task.title}
                      <button style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }} title="Completar">
                        <CheckCircle size={18} />
                      </button>
                    </h4>
                    <p>{task.type} - {task.contact}</p>
                    <p style={{ color: '#f59e0b', fontWeight: 500, fontSize: '0.75rem', marginTop: '0.25rem' }}>{task.date}</p>
                  </div>
                </div>
              ))}
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
