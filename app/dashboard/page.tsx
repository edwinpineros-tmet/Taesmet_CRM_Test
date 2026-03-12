"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { createClient } from "@/utils/supabase/client";
import DateRangeFilter, { DateRange } from "@/components/DateRangeFilter";
import MetricCard from "@/components/MetricCard";
import StatusDonutChart from "@/components/StatusDonutChart";
import UserStackedBarChart from "@/components/UserStackedBarChart";
import ClientStackedBarChart from "@/components/ClientStackedBarChart";
import { CheckCircle, Clock } from "lucide-react";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    preset: "30d",
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });

  const [loading, setLoading] = useState(true);
  const [nextActivities, setNextActivities] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalDeals: 0,
    totalDealsPrev: 0,
    newContacts: 0,
    newContactsPrev: 0,
    avgDealAmount: 0,
    avgDealAmountPrev: 0,
  });

  const fetchDashboardData = async (range: DateRange) => {
    setLoading(true);
    const supabase = createClient();

    // Simulate fetching logic that respects range.startDate and range.endDate
    // For now we setup the skeleton bindings
    try {
      // Fetch Next Activities (RegistroActividades)
      const { data: activities } = await supabase
        .from('registroactividades')
        .select(`
          idactividad,
          tipointeraccion,
          fechahora,
          notas,
          fechaproximoseguimiento,
          oportunidades(titulonegocio, clientes(razonsocial))
        `)
        .gte('fechaproximoseguimiento', new Date().toISOString())
        .order('fechaproximoseguimiento', { ascending: true })
        .limit(5);

      if (activities) setNextActivities(activities);

      // We'll populate real metrics here later
      setMetrics({
        totalDeals: 120,
        totalDealsPrev: 90,
        newContacts: 45,
        newContactsPrev: 30,
        avgDealAmount: 15400000,
        avgDealAmountPrev: 12000000,
      });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(dateRange);
  }, [dateRange]);

  const mockStatusData: any[] = [
    { name: '1. Prospección', value: 30 },
    { name: '2. Negociación', value: 45 },
    { name: '3. Cotización', value: 25 },
    { name: '4. Cierre Ganado', value: 60 },
    { name: '5. Cierre Perdido', value: 10 },
  ];

  const mockUserData: any[] = [
    { usuario: 'Carlos M.', '1. Prospección': 10, '2. Negociación': 15, '3. Cotización': 8, '4. Cierre Ganado': 20, '5. Cierre Perdido': 2 },
    { usuario: 'Ana P.', '1. Prospección': 12, '2. Negociación': 20, '3. Cotización': 10, '4. Cierre Ganado': 25, '5. Cierre Perdido': 5 },
    { usuario: 'Luis R.', '1. Prospección': 8, '2. Negociación': 10, '3. Cotización': 7, '4. Cierre Ganado': 15, '5. Cierre Perdido': 3 },
  ];

  const mockClientData: any[] = [
    { cliente: 'Industrias XYZ', montoTotal: 54000000, '3. Cotización': 2, '4. Cierre Ganado': 5 },
    { cliente: 'Constructora Alfa', montoTotal: 32000000, '1. Prospección': 3, '2. Negociación': 1, '4. Cierre Ganado': 3 },
    { cliente: 'Estructuras Beta', montoTotal: 25000000, '2. Negociación': 4, '3. Cotización': 1 },
    { cliente: 'Acero Nacional', montoTotal: 18000000, '1. Prospección': 1, '4. Cierre Ganado': 2 },
  ];

  const estados = ['1. Prospección', '2. Negociación', '3. Cotización', '4. Cierre Ganado', '5. Cierre Perdido'];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard General</h1>
          <p className={styles.subtitle}>Resumen de actividad comercial</p>
        </div>
        <DateRangeFilter onRangeChange={setDateRange} />
      </header>

      {loading ? (
        <div className={styles.loading}>Cargando métricas...</div>
      ) : (
        <>
          <section className={styles.metricsGrid}>
            <MetricCard
              title="Contactos Nuevos"
              value={metrics.newContacts}
              currentValue={metrics.newContacts}
              previousValue={metrics.newContactsPrev}
            />
            <MetricCard
              title="Total Negocios"
              value={metrics.totalDeals}
              currentValue={metrics.totalDeals}
              previousValue={metrics.totalDealsPrev}
            />
            <MetricCard
              title="Promedio Monto Estimado"
              value={metrics.avgDealAmount}
              currentValue={metrics.avgDealAmount}
              previousValue={metrics.avgDealAmountPrev}
              formatAsCurrency
            />
          </section>

          <div className={styles.mainGrid}>
            <div className={styles.chartsColumn}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Estado de Oportunidades</h3>
                <StatusDonutChart data={mockStatusData} />
              </div>

              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Oportunidades por Usuario</h3>
                <UserStackedBarChart data={mockUserData} estados={estados} />
              </div>

              <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
                <h3 className={styles.chartTitle}>Top Clientes por Monto y Estado</h3>
                <ClientStackedBarChart data={mockClientData} estados={estados} />
              </div>
            </div>

            <div className={styles.activitiesColumn}>
              <div className={styles.activitiesCard}>
                <h3 className={styles.activitiesTitle}>Próximas Actividades</h3>
                <div className={styles.activitiesList}>
              {nextActivities.length > 0 ? nextActivities.map(activity => (
                <div key={activity.idactividad} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <Clock size={20} color="#f59e0b" />
                  </div>
                  <div className={styles.activityInfo}>
                    <h4>{activity.oportunidades?.titulonegocio || 'Sin Negocio'}</h4>
                    <p>{activity.tipointeraccion} - {new Date(activity.fechaproximoseguimiento).toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                <p className={styles.emptyState}>No hay actividades programadas.</p>
              )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
