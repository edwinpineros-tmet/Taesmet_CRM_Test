"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface UserProfile {
  userId: string | null;
  rol: string | null;
  /** true if the user is 'Lider Comercial' or 'Administrador' — can see all records */
  isLeader: boolean;
  loading: boolean;
}

export function useUserRole(): UserProfile {
  const [profile, setProfile] = useState<UserProfile>({
    userId: null,
    rol: null,
    isLeader: false,
    loading: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile({ userId: null, rol: null, isLeader: false, loading: false });
        return;
      }

      const { data } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", user.id)
        .single();

      const rol = (data as { rol: string | null } | null)?.rol ?? null;
      const isLeader = rol === "Lider Comercial" || rol === "Administrador";

      setProfile({ userId: user.id, rol, isLeader, loading: false });
    };

    fetchProfile();
  }, []);

  return profile;
}
