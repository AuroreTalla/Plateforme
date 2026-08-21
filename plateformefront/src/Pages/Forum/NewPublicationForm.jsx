import { useState } from 'react';
import { Box, Paper, TextField, Button } from '@mui/material';

function NewPublicationForm({ onSubmit, onCancel }) {
  const [titre, setTitre] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titre.trim() || !content.trim()) return;
    onSubmit(titre, content);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }} component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Titre de votre question"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Décrivez votre question"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
          Publier
        </Button>
      </Box>
    </Paper>
  );
}

export default NewPublicationForm;