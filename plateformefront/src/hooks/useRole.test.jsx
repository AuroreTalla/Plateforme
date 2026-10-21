import { renderHook } from '@testing-library/react';
import { AuthContext } from '../Composants/Authentification/AuthContext';
import { useRole } from './useRole';

const avec = (statut) => ({ children }) => (
  <AuthContext.Provider value={{ currentUser: statut ? { statut } : null }}>
    {children}
  </AuthContext.Provider>
);

test('un élève n\'est ni admin ni professeur', () => {
  const { result } = renderHook(() => useRole(), { wrapper: avec('ELEVE') });
  expect(result.current.isAdmin).toBe(false);
  expect(result.current.isProfOuAdmin).toBe(false);
});

test('un professeur peut modifier mais n\'est pas admin', () => {
  const { result } = renderHook(() => useRole(), { wrapper: avec('PROFESSEUR') });
  expect(result.current.isProfOuAdmin).toBe(true);
  expect(result.current.isAdmin).toBe(false);
});

test('sans utilisateur, aucun rôle', () => {
  const { result } = renderHook(() => useRole(), { wrapper: avec(null) });
  expect(result.current.hasRole('ADMIN', 'PROFESSEUR', 'ELEVE')).toBe(false);
});