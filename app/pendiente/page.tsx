import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function SalaDeEspera() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Revisamos si el admin ya lo activó por detrás
    const { data: perfil } = await supabase
        .from("usuarios")
        .select("estado")
        .eq("id", user.id)
        .single();

    if (perfil?.estado === "Activo") {
        redirect("/dashboard");
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f3f4f6',
            fontFamily: 'sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '3rem',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                textAlign: 'center',
                maxWidth: '500px'
            }}>
                <svg viewBox="0 0 24 24" width="64" height="64" stroke="#121e46" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem auto' }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h2 style={{ color: '#121e46', marginBottom: '1rem', fontSize: '1.5rem' }}>Cuenta en Revisión</h2>
                <p style={{ color: '#4b5563', lineHeight: '1.5', marginBottom: '2rem' }}>
                    Tu cuenta ha sido registrada exitosamente, pero <strong>requiere aprobación de un administrador</strong> para acceder al CRM.
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    Por favor, contacta a tu líder comercial para que asigne tu rol y active tu perfil.
                </p>
            </div>
        </div>
    );
}