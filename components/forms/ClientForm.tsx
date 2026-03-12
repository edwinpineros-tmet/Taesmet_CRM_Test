"use client";

import React, { useState } from "react";
import styles from "./Form.module.css";
import { createClient } from "@/utils/supabase/client";

interface ClientFormProps {
  onSuccess: () => void;
}

export default function ClientForm({ onSuccess }: ClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nit: "",
    razonSocial: "",
    tipoCliente: "Empresa",
    codigoCliente: "",
    sectorCiiu: "",
    emailContacto: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("No autenticado");

      const { error: insertError } = await supabase.from("clientes").insert({
        nit: parseInt(formData.nit, 10),
        razonsocial: formData.razonSocial,
        tipocliente: formData.tipoCliente,
        codigocliente: formData.codigoCliente ? parseInt(formData.codigoCliente, 10) : null,
        sectorciiu: formData.sectorCiiu,
        emailcontactocuenta: formData.emailContacto,
        propietariocuenta: user.id
      } as any);

      if (insertError) {
        throw new Error(insertError.message);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Error validando el cliente:", err);
      setError(err.message || "Ocurrió un error al crear el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorText}>{error}</div>}
      
      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="nit">NIT o Documento *</label>
          <input
            id="nit"
            name="nit"
            type="number"
            required
            className={styles.input}
            value={formData.nit}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className={styles.group}>
          <label className={styles.label} htmlFor="codigoCliente">Código Interno (Opcional)</label>
          <input
            id="codigoCliente"
            name="codigoCliente"
            type="number"
            className={styles.input}
            value={formData.codigoCliente}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="razonSocial">Razón Social o Nombres *</label>
        <input
          id="razonSocial"
          name="razonSocial"
          type="text"
          required
          className={styles.input}
          value={formData.razonSocial}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="tipoCliente">Tipo de Cliente</label>
          <select
            id="tipoCliente"
            name="tipoCliente"
            className={styles.select}
            value={formData.tipoCliente}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="Empresa">Empresa</option>
            <option value="Persona">Persona Natural</option>
          </select>
        </div>

        <div className={styles.group}>
          <label className={styles.label} htmlFor="sectorCiiu">Sector CIIU (Opcional)</label>
          <input
            id="sectorCiiu"
            name="sectorCiiu"
            type="text"
            className={styles.input}
            value={formData.sectorCiiu}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="emailContacto">Email Principal de Cuenta</label>
        <input
          id="emailContacto"
          name="emailContacto"
          type="email"
          className={styles.input}
          value={formData.emailContacto}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Creando..." : "Crear Cliente"}
      </button>
    </form>
  );
}
