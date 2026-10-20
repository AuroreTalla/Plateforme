import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { AuthContext } from '../../Composants/Authentification/AuthContext';
import { getRecommandations } from '../../Services/UserService';

function destination(r) {
  if (r.type === 'COURS') return `/dashboard/matiere/${r.matiereId}/cours`;
  if (r.type === 'EXERCICE') return `/dashboard/matiere/${r.matiereId}/exercices`;
  return `/dashboard/forum/${r.groupeId}`;
}

export default function Recommandations({ type, id }) {
  const { currentUser } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.recommandationsActives || !id) {
      setItems([]);
      return;
    }
    getRecommandations(type, id)
      .then((r) => setItems(r.data))
      .catch(() => setItems([]));
  }, [type, id, currentUser?.recommandationsActives]);

  if (!items.length) return null;

  return (
    <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e2e8f0' }}>
      <Typography variant="subtitle1" fontWeight="bold">Pour aller plus loin</Typography>
      {items.map((r) => (
        <Typography
          key={r.type + r.id}
          variant="body2"
          sx={{ cursor: 'pointer', my: 0.5, color: '#7c3aed' }}
          onClick={() => navigate(destination(r))}
        >
          {r.titre} <small style={{ color: '#64748b' }}>({r.raison})</small>
        </Typography>
      ))}
    </Box>
  );
}