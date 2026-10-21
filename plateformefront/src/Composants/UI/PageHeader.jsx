import { Box, Typography } from '@mui/material';

export default function PageHeader({ titre, sous, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: 2, flexWrap: 'wrap', mb: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 0.5 }}>{titre}</Typography>
        {sous && <Typography color="text.secondary">{sous}</Typography>}
      </Box>
      {action}
    </Box>
  );
}