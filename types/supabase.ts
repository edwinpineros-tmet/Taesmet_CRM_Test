export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          ciudaddestinoventa: string | null
          codigocliente: number | null
          emailcontactocuenta: string | null
          fechacreacioncliente: string | null
          nit: number
          paisdestinoventa: string | null
          propietariocuenta: string | null
          razonsocial: string | null
          sectorciiu: string | null
          tipocliente: string | null
        }
        Insert: {
          ciudaddestinoventa?: string | null
          codigocliente?: number | null
          emailcontactocuenta?: string | null
          fechacreacioncliente?: string | null
          nit: number
          paisdestinoventa?: string | null
          propietariocuenta?: string | null
          razonsocial?: string | null
          sectorciiu?: string | null
          tipocliente?: string | null
        }
        Update: {
          ciudaddestinoventa?: string | null
          codigocliente?: number | null
          emailcontactocuenta?: string | null
          fechacreacioncliente?: string | null
          nit?: number
          paisdestinoventa?: string | null
          propietariocuenta?: string | null
          razonsocial?: string | null
          sectorciiu?: string | null
          tipocliente?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_propietariocuenta_fkey"
            columns: ["propietariocuenta"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      contactos: {
        Row: {
          cargo: string | null
          clienteasociado: number | null
          correo: string | null
          fechacreacioncontacto: string | null
          idcontacto: number
          nombrecontacto: string
          telefono: string | null
        }
        Insert: {
          cargo?: string | null
          clienteasociado?: number | null
          correo?: string | null
          fechacreacioncontacto?: string | null
          idcontacto?: number
          nombrecontacto: string
          telefono?: string | null
        }
        Update: {
          cargo?: string | null
          clienteasociado?: number | null
          correo?: string | null
          fechacreacioncontacto?: string | null
          idcontacto?: number
          nombrecontacto?: string
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contactos_clienteasociado_fkey"
            columns: ["clienteasociado"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["nit"]
          },
        ]
      }
      detallecotizacion: {
        Row: {
          cantidadarea: number | null
          cantidadkilos: number | null
          cantidadmetros: number | null
          cantidadunidades: number | null
          categoriaproducto: string | null
          descripcion: string | null
          iddetalle: number
          negocioasociado: number | null
        }
        Insert: {
          cantidadarea?: number | null
          cantidadkilos?: number | null
          cantidadmetros?: number | null
          cantidadunidades?: number | null
          categoriaproducto?: string | null
          descripcion?: string | null
          iddetalle?: number
          negocioasociado?: number | null
        }
        Update: {
          cantidadarea?: number | null
          cantidadkilos?: number | null
          cantidadmetros?: number | null
          cantidadunidades?: number | null
          categoriaproducto?: string | null
          descripcion?: string | null
          iddetalle?: number
          negocioasociado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detallecotizacion_negocioasociado_fkey"
            columns: ["negocioasociado"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["idoportunidad"]
          },
        ]
      }
      oportunidades: {
        Row: {
          clienteasociado: number | null
          departamento: string | null
          etapa: string | null
          fechacreacionoportunidad: string | null
          idoportunidad: number
          montoestimado: number | null
          nivelinteres: string | null
          titulonegocio: string | null
        }
        Insert: {
          clienteasociado?: number | null
          departamento?: string | null
          etapa?: string | null
          fechacreacionoportunidad?: string | null
          idoportunidad?: number
          montoestimado?: number | null
          nivelinteres?: string | null
          titulonegocio?: string | null
        }
        Update: {
          clienteasociado?: number | null
          departamento?: string | null
          etapa?: string | null
          fechacreacionoportunidad?: string | null
          idoportunidad?: number
          montoestimado?: number | null
          nivelinteres?: string | null
          titulonegocio?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oportunidades_clienteasociado_fkey"
            columns: ["clienteasociado"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["nit"]
          },
        ]
      }
      registroactividades: {
        Row: {
          fechahora: string | null
          fechaproximoseguimiento: string | null
          idactividad: number
          negocioasociado: number | null
          notas: string | null
          tipointeraccion: string | null
        }
        Insert: {
          fechahora?: string | null
          fechaproximoseguimiento?: string | null
          idactividad?: number
          negocioasociado?: number | null
          notas?: string | null
          tipointeraccion?: string | null
        }
        Update: {
          fechahora?: string | null
          fechaproximoseguimiento?: string | null
          idactividad?: number
          negocioasociado?: number | null
          notas?: string | null
          tipointeraccion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registroactividades_negocioasociado_fkey"
            columns: ["negocioasociado"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["idoportunidad"]
          },
        ]
      }
      usuarios: {
        Row: {
          codigooperario: number | null
          departamento: string | null
          email: string
          estado: string | null
          id: string
          nombrecompleto: string
          rol: string | null
        }
        Insert: {
          codigooperario?: number | null
          departamento?: string | null
          email: string
          estado?: string | null
          id: string
          nombrecompleto: string
          rol?: string | null
        }
        Update: {
          codigooperario?: number | null
          departamento?: string | null
          email?: string
          estado?: string | null
          id?: string
          nombrecompleto?: string
          rol?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
