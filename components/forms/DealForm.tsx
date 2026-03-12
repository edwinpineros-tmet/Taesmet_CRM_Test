"use client";

import React, { useState, useEffect } from "react";
import styles from "./Form.module.css";
import { createClient } from "@/utils/supabase/client";

interface DealFormProps {
  onSuccess: () => void;
}

export default function DealForm({ onSuccess }: DealFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    tituloNegocio: "",
    clienteAsociado: "",
    departamento: "Rejillas",
    etapa: "1. Prospección",
    nivelInteres: "Medio",
    montoEstimado: "",
    paisDestino: "",
    ciudadDestino: "",
  });

  useEffect(() => {
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
      if (!formData.clienteAsociado) throw new Error("Debes seleccionar un cliente");

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const { error: insertError } = await supabase.from("oportunidades").insert({
        titulonegocio: formData.tituloNegocio,
        clienteasociado: parseInt(formData.clienteAsociado, 10),
        departamento: formData.departamento,
        etapa: formData.etapa,
        nivelinteres: formData.nivelInteres,
        montoestimado: formData.montoEstimado ? parseFloat(formData.montoEstimado) : null,
        paisdestinoventa: formData.paisDestino,
        ciudaddestinoventa: formData.ciudadDestino,
        propietariocuenta: user.id
      } as any);

      if (insertError) {
        throw new Error(insertError.message);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Error al crear la oportunidad:", err);
      setError(err.message || "Ocurrió un error al crear la oportunidad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorText}>{error}</div>}

      <div className={styles.group}>
        <label className={styles.label} htmlFor="tituloNegocio">Título de Oportunidad *</label>
        <input
          id="tituloNegocio"
          name="tituloNegocio"
          type="text"
          required
          className={styles.input}
          value={formData.tituloNegocio}
          onChange={handleChange}
          disabled={loading}
          placeholder="Ej: Suministro de estructuras metálicas..."
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

      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="departamento">Departamento *</label>
          <select
            id="departamento"
            name="departamento"
            className={styles.select}
            value={formData.departamento}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="Rejillas">Rejillas</option>
            <option value="Estructuras">Estructuras</option>
          </select>
        </div>

        <div className={styles.group}>
          <label className={styles.label} htmlFor="etapa">Etapa Inicial *</label>
          <select
            id="etapa"
            name="etapa"
            className={styles.select}
            value={formData.etapa}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="1. Prospección">1. Prospección</option>
            <option value="2. Negociación">2. Negociación</option>
            <option value="3. Cotización">3. Cotización</option>
            <option value="4. Cierre Ganado">4. Cierre Ganado</option>
            <option value="5. Cierre Perdido">5. Cierre Perdido</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="nivelInteres">Nivel de Interés</label>
          <select
            id="nivelInteres"
            name="nivelInteres"
            className={styles.select}
            value={formData.nivelInteres}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
          </select>
        </div>

        <div className={styles.group}>
          <label className={styles.label} htmlFor="montoEstimado">Monto Estimado (COP)</label>
          <input
            id="montoEstimado"
            name="montoEstimado"
            type="number"
            className={styles.input}
            value={formData.montoEstimado}
            onChange={handleChange}
            disabled={loading}
            placeholder="Ej: 5000000"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="paisDestino">País Destino Venta</label>
          <input
            id="paisDestino"
            name="paisDestino"
            type="text"
            className={styles.input}
            value={formData.paisDestino}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label} htmlFor="ciudadDestino">Ciudad Destino Venta</label>
          <input
            id="ciudadDestino"
            name="ciudadDestino"
            type="text"
            className={styles.input}
            value={formData.ciudadDestino}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Creando..." : "Crear Oportunidad"}
      </button>
    </form>
  );
}
