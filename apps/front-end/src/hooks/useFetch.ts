"use client";

import { useState, useEffect } from "react";

// Definimos un tipo genérico T para que el hook sepa qué datos va a recibir
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Si no hay URL, no hacemos nada (útil si esperamos un param)
    if (!url) return;

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        
        // Asumimos que tu API siempre devuelve { success: true, data: ... }
        // Si json.data existe, lo guardamos. Si no, guardamos el json entero.
        setState({ data: json.data || json, loading: false, error: null });
        
      } catch (error) {
        setState({ 
          data: null, 
          loading: false, 
          error: error instanceof Error ? error.message : "Error desconocido" 
        });
      }
    };

    fetchData();
  }, [url]); // Se re-ejecuta si cambia la URL

  return state;
}