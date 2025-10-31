import { useState, useEffect } from 'react';

/**
 * Custom hook for loading data from Firestore with fallback to JSON
 * 
 * @param fetchFunction - Function to fetch data from Firestore
 * @param fallbackData - Static JSON data as fallback
 * @returns { data, loading, error }
 */
export function useFirestoreData<T>(
  fetchFunction: () => Promise<T>,
  fallbackData: T
) {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const firestoreData = await fetchFunction();
        
        if (isMounted) {
          setData(firestoreData);
          setError(null);
        }
      } catch (err) {
        console.warn('Failed to load from Firestore, using fallback data:', err);
        
        if (isMounted) {
          // Keep using fallback data (already set in initial state)
          setError('Using cached data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}