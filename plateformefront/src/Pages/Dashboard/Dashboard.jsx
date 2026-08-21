import { useContext } from 'react';
import { AuthContext } from '../../Composants/Authentification/AuthContext';
import DashboardEleve from './DashboardEleve';
import DashboardProfesseur from './DashboardProfesseur';
import DashboardAdmin from './DashboardAdmin';

export default function Dashboard() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return null;

  switch (currentUser.statut) {
    case 'ADMIN':
      return <DashboardAdmin currentUser={currentUser} />;
    case 'PROFESSEUR':
      return <DashboardProfesseur currentUser={currentUser} />;
    default:
      return <DashboardEleve currentUser={currentUser} />;
  }
}