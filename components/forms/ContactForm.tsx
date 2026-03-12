"use client";

import React, { useState, useEffect } from "react";
import styles from "./Form.module.css";
import { createClient } from "@/utils/supabase/client";

interface ContactFormProps {
  onSuccess: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nombreContacto: "",
    clienteAsociado: "",
    cargo: "",
    telefono: "",
    correo: "",
  });

  useEffect(() => {
    // Fetch clients so we can associate the contact
    const fetchClientes = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("clientes").select("nit, razonsocial").order("razonsocial");
      if (data) setClientes(data);
    };
    fetchClientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.clienteAsociado) throw new Error("Debes seleccionar un cliente asociado");

      const supabase = createClient();
      const { error: insertError } = await supabase.from("contactos").insert({
        nombrecontacto: formData.nombreContacto,
        clienteasociado: parseInt(formData.clienteAsociado, 10),
        cargo: formData.cargo,
        telefono: formData.telefono,
        correo: formData.correo
      } as any);

      if (insertError) {
        throw new Error(insertError.message);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Error validando el contacto:", err);
      setError(err.message || "Ocurrió un error al crear el contacto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorText}>{error}</div>}
      
      <div className={styles.group}>
        <label className={styles.label} htmlFor="nombreContacto">Nombre Completo *</label>
        <input
          id="nombreContacto"
          name="nombreContacto"
          type="text"
          required
          className={styles.input}
          value={formData.nombreContacto}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="clienteAsociado">Cliente Asociado *</label>
        <select
          id="clienteAsociado"
          name="clienteAsociado"
          required
          className={styles.select}
          value={formData.clienteAsociado}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">-- Seleccionar Cliente --</option>
          {clientes.map(cliente => (
            <option key={cliente.nit} value={cliente.nit}>
              {cliente.razonsocial}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="cargo">Cargo o Rol (Opcional)</label>
        <input
          id="cargo"
          name="cargo"
          type="text"
          className={styles.input}
          value={formData.cargo}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="telefono">Teléfono de Contacto</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            className={styles.input}
            value={formData.telefono}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label} htmlFor="correo">Correo Electrónico</label>
          <input
            id="correo"
            name="correo"
            type="email"
            className={styles.input}
            value={formData.correo}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Creando..." : "Crear Contacto"}
      </button>
    </form>
  );
}
