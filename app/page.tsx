import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <img src="/logo.png" alt="Taesmet Logo" className={styles.logo} />
        <h1 className={styles.title}>Bienvenido al CRM</h1>
        <p className={styles.description}>
          Gestión comercial de ventas de productos industriales
        </p>
        <Link href="/login" className={styles.button}>
          Iniciar Sesión
        </Link>
      </div>
    </main>
  );
}
