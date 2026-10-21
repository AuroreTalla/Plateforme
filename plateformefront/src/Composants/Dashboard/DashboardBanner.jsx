import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

export default function DashboardBanner({ titre, sous }) {
  return (
    <Box sx={{
      position: 'relative', overflow: 'hidden', borderRadius: 4, p: { xs: 3, md: 5 },
      background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', mb: 4,
    }}>
      {/* décor */}
      <Box sx={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200,
        borderRadius: '50%', bgcolor: 'rgba(124,58,237,0.10)' }} />
      <Box sx={{ position: 'absolute', right: 90, bottom: -50, width: 120, height: 120,
        borderRadius: '50%', bgcolor: 'rgba(124,58,237,0.12)' }} />
      <SchoolIcon sx={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)',
        fontSize: { xs: 70, md: 130 }, color: '#7c3aed', opacity: 0.85 }} />

      <Box sx={{ position: 'relative', maxWidth: { xs: '65%', md: '60%' } }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95' }}>{titre}</Typography>
        <Typography sx={{ color: '#5b21b6', mt: 1 }}>{sous}</Typography>
      </Box>
    </Box>
  );
}