"use client";

import React, { useState } from "react";
import styles from "./DateRangeFilter.module.css";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

type Preset = "7d" | "15d" | "30d" | "3m" | "custom";

export interface DateRange {
  preset: Preset;
  startDate: Date;
  endDate: Date;
}

interface DateRangeFilterProps {
  onRangeChange: (range: DateRange) => void;
}

export default function DateRangeFilter({ onRangeChange }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<Preset>("30d");

  const handleSelectPreset = (preset: Preset) => {
    setSelectedPreset(preset);
    const end = new Date();
    const start = new Date();
    
    if (preset === "7d") start.setDate(end.getDate() - 7);
    else if (preset === "15d") start.setDate(end.getDate() - 15);
    else if (preset === "30d") start.setDate(end.getDate() - 30);
    else if (preset === "3m") start.setMonth(end.getMonth() - 3);

    onRangeChange({ preset, startDate: start, endDate: end });
    setIsOpen(false);
  };

  const getLabel = () => {
    switch (selectedPreset) {
      case "7d": return "Últimos 7 días";
      case "15d": return "Últimos 15 días";
      case "30d": return "Últimos 30 días";
      case "3m": return "Últimos 3 meses";
      case "custom": return "Personalizado";
      default: return "Seleccionar periodo";
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon size={18} className={styles.icon} />
        <span className={styles.label}>{getLabel()}</span>
        <ChevronDown size={18} className={`${styles.iconRight} ${isOpen ? styles.opened : ""}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.presets}>
            <button onClick={() => handleSelectPreset("7d")} className={selectedPreset === "7d" ? styles.active : ""}>Últimos 7 días</button>
            <button onClick={() => handleSelectPreset("15d")} className={selectedPreset === "15d" ? styles.active : ""}>Últimos 15 días</button>
            <button onClick={() => handleSelectPreset("30d")} className={selectedPreset === "30d" ? styles.active : ""}>Últimos 30 días</button>
            <button onClick={() => handleSelectPreset("3m")} className={selectedPreset === "3m" ? styles.active : ""}>Últimos 3 meses</button>
          </div>
        </div>
      )}
    </div>
  );
}
