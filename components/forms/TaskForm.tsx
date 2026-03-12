"use client";

import React, { useState, useEffect } from "react";
import styles from "./Form.module.css";
import { createClient } from "@/utils/supabase/client";

interface TaskFormProps {
  onSuccess: () => void;
}

export default function TaskForm({ onSuccess }: TaskFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oportunidades, setOportunidades] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    negocioAsociado: "",
    tipoInteraccion: "Llamada",
    fechaHora: "",
    notas: "",
    fechaProximo: "",
  });

  useEffect(() => {
    const fetchOportunidades = async () => {
      const supabase = createClient();
      // Fetching active deals
      const { data } = await supabase
        .from("oportunidades")
        .select("idoportunidad, titulonegocio")
        .in("etapa", ['1. Prospección', '2. Negociación', '3. Cotización'])
        .order("titulonegocio");
      if (data) setOportunidades(data);
    };
    fetchOportunidades();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.negocioAsociado) throw new Error("Debes seleccionar un negocio");

      const supabase = createClient();
      const { error: insertError } = await supabase.from("registroactividades").insert({
        negocioasociado: parseInt(formData.negocioAsociado, 10),
        tipointeraccion: formData.tipoInteraccion,
        fechahora: formData.fechaHora ? new Date(formData.fechaHora).toISOString() : null,
        notas: formData.notas,
        fechaproximoseguimiento: formData.fechaProximo ? new Date(formData.fechaProximo).toISOString() : null
      } as any);

      if (insertError) {
        throw new Error(insertError.message);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Error al crear la actividad:", err);
      setError(err.message || "Ocurrió un error al crear la actividad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorText}>{error}</div>}

      <div className={styles.group}>
        <label className={styles.label} htmlFor="negocioAsociado">Oportunidad / Negocio Asociado *</label>
        <select
          id="negocioAsociado"
          name="negocioAsociado"
          required
          className={styles.select}
          value={formData.negocioAsociado}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">-- Seleccionar Negocio Activo --</option>
          {oportunidades.map(op => (
            <option key={op.idoportunidad} value={op.idoportunidad}>
              {op.titulonegocio}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="tipoInteraccion">Tipo de Interacción *</label>
          <select
            id="tipoInteraccion"
            name="tipoInteraccion"
            className={styles.select}
            value={formData.tipoInteraccion}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="Llamada">Llamada</option>
            <option value="Correo">Correo</option>
            <option value="Reunión Presencial">Reunión Presencial</option>
            <option value="Videollamada">Videollamada</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </div>

        <div className={styles.group}>
          <label className={styles.label} htmlFor="fechaHora">Fecha y Hora de la Actividad</label>
          <input
            id="fechaHora"
            name="fechaHora"
            type="datetime-local"
            className={styles.input}
            value={formData.fechaHora}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="notas">Notas / Resumen de Actividad</label>
        <textarea
          id="notas"
          name="notas"
          className={styles.textarea}
          value={formData.notas}
          onChange={handleChange}
          disabled={loading}
          placeholder="Escribe el resultado de la llamada o reunión..."
        />
      </div>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="fechaProximo">Fecha Próximo Seguimiento</label>
        <input
          id="fechaProximo"
          name="fechaProximo"
          type="datetime-local"
          className={styles.input}
          value={formData.fechaProximo}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Guardando..." : "Registrar Actividad"}
      </button>
    </form>
  );
}
