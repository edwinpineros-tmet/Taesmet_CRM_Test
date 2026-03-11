import React from "react";
import styles from "./MetricCard.module.css";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: number;
  currentValue?: number;
  formatAsCurrency?: boolean;
}

export default function MetricCard({ title, value, previousValue, currentValue, formatAsCurrency }: MetricCardProps) {
  let variation = 0;
  let isPositive = true;
  let isNeutral = true;

  if (previousValue !== undefined && currentValue !== undefined && previousValue !== 0) {
    variation = ((currentValue - previousValue) / previousValue) * 100;
    isPositive = variation > 0;
    isNeutral = variation === 0;
  } else if (previousValue === 0 && currentValue && currentValue > 0) {
    variation = 100; // Infinity formally, but we can show 100%
    isPositive = true;
    isNeutral = false;
  }

  const formattedValue = formatAsCurrency 
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(value))
    : value;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.valueContainer}>
        <span className={styles.value}>{formattedValue}</span>
      </div>
      
      {previousValue !== undefined && currentValue !== undefined && (
        <div className={`${styles.variation} ${isNeutral ? styles.neutral : isPositive ? styles.positive : styles.negative}`}>
          {isNeutral ? (
            <Minus size={16} />
          ) : isPositive ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span>
            {Math.abs(variation).toFixed(1)}% vs periodo ant.
          </span>
        </div>
      )}
    </div>
  );
}
