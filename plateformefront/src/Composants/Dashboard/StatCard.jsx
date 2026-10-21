import { Box, Typography, CircularProgress } from '@mui/material';

export default function StatCard({ label, value, icon: Icon, bg, color = '#fff', onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: bg, color, borderRadius: 3, p: 2.5, display: 'flex', alignItems: 'center', gap: 2,
        cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.15s',
        '&:hover': onClick ? { transform: 'translateY(-3px)' } : {},
      }}
    >
      <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon />
      </Box>
      <Box>
        <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.1 }}>
          {value === undefined || value === null
            ? <CircularProgress size={20} sx={{ color: 'inherit' }} />
            : value}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>{label}</Typography>
      </Box>
    </Box>
  );
}