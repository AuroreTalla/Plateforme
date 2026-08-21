import { useState } from 'react';
import { Box, Paper, TextField, Button } from '@mui/material';

function ReponseForm({ onSubmit, onCancel }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mt: 2, borderRadius: 3 }} component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Votre réponse..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
          Envoyer
        </Button>
      </Box>
    </Paper>
  );
}

export default ReponseForm;