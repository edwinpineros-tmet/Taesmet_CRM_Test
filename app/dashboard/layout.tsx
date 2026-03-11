"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  LayoutDashboard,
  Users,
  Contact,
  Briefcase,
  Calendar,
  LogOut,
  Menu,
  X
} from "lucide-react";
import styles from "./layout.module.css";
// Añadimos useEffect a la importación
import React, { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- NUEVO: Estado para saber si ya validamos su rol en la BD ---
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // 1. Usamos "estado" e "id" en minúsculas para coincidir con PostgreSQL
      const { data: perfil, error } = await supabase
        .from("usuarios")
        .select("estado")
        .eq("id", user.id)
        .single();

      // Añadimos un console.log para que puedas ver qué trae exactamente
      console.log("Datos del perfil:", perfil);

      // 2. Comparamos con la propiedad en minúscula
      if (perfil?.estado === "Inactivo") {
        router.push("/pendiente");
      } else {
        setIsAuthorized(true);
      }
    };

    verifyAccess();
  }, [router]);

  // Mientras verificamos en la base de datos, mostramos una pantalla de carga
  // Esto evita que vean información confidencial por un segundo antes de ser redirigidos
  if (!isAuthorized) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', color: '#121e46', fontFamily: 'sans-serif' }}>
        <h2>Verificando permisos de acceso...</h2>
      </div>
    );
  }
  // ---------------------------------------------------------------

  const navigation = [
    { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clientes", href: "/dashboard/clientes", icon: Users },
    { name: "Contactos", href: "/dashboard/contactos", icon: Contact },
    { name: "Negocios", href: "/dashboard/negocios", icon: Briefcase },
    { name: "Tareas", href: "/dashboard/tareas", icon: Calendar },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className={styles.layout}>
      {/* Mobile Topbar */}
      <div className={styles.mobileTopbar}>
        <div className={styles.mobileLogo}>
          <img src="/logo.png" alt="Taesmet" height={30} />
          <span className={styles.logoText}>CRM</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={styles.mobileMenuBtn}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <img src="/logo.png" alt="Taesmet Logo" className={styles.sidebarLogo} />
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={20} className={styles.navIcon} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleSignOut} className={styles.signOutBtn}>
            <LogOut size={20} className={styles.navIcon} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}