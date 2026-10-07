// src/hooks/useFetchedResource.js
import { useState, useEffect, useCallback } from "react";

/**
 * Charge une ressource via fetchFn au montage, et expose un moyen
 * de la recharger manuellement (refetch) après une mutation ailleurs.
 *
 * @param {() => Promise<{data: any}>} fetchFn - fonction axios à appeler
 * @param {any} fallback - valeur initiale avant le premier chargement
 */
export function useFetchedResource(fetchFn, fallback = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchFn();
      setData(res.data);
    } catch (e) {
      console.error("❌ Erreur chargement ressource :", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchFn();
        if (mounted) setData(res.data);
      } catch (e) {
        if (mounted) {
          console.error("❌ Erreur chargement ressource :", e);
          setError(e);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => { mounted = false; };
  }, [fetchFn]);

  return { data, loading, error, refetch: load };
}