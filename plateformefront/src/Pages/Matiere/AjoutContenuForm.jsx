import { useState } from 'react';
import { Box, Paper, TextField, Button, MenuItem, LinearProgress, Alert } from '@mui/material';
import { uploadFichier } from '../../ConfigBackEnd/UploadService';

const TYPES = [
  { value: 'TEXTE', label: 'Texte' },
  { value: 'IMAGE', label: 'Image (jpg, png, webp — max 2 Mo)' },
  { value: 'VIDEO', label: 'Vidéo (mp4 — max 15 Mo)' },
  { value: 'AUDIO', label: 'Audio (mp3, wav — max 8 Mo)' },
  { value: 'PDF', label: 'PDF (max 5 Mo)' },
  { value: 'DOCUMENT', label: 'Document (doc, docx, txt — max 5 Mo)' },
];

function AjoutContenuForm({ onSubmit, onCancel }) {
  const [titre, setTitre] = useState('');
  const [type, setType] = useState('TEXTE');
  const [contenu, setContenu] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!titre.trim()) {
      setError('Le titre est requis.');
      return;
    }

    if (type === 'TEXTE') {
      if (!contenu.trim()) {
        setError('Le contenu texte est requis.');
        return;
      }
      onSubmit({ titre, type, contenu, mediaUrl: null });
      return;
    }

    if (!file) {
      setError('Veuillez sélectionner un fichier.');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadFichier(file, type);
      onSubmit({ titre, type, contenu: null, mediaUrl: res.data.url });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }} component="form" onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Titre"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        select
        label="Type de contenu"
        value={type}
        onChange={(e) => { setType(e.target.value); setFile(null); setContenu(''); }}
        sx={{ mb: 2 }}
      >
        {TYPES.map((t) => (
          <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
        ))}
      </TextField>

      {type === 'TEXTE' ? (
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Contenu"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          sx={{ mb: 2 }}
        />
      ) : (
        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
          {file ? file.name : 'Choisir un fichier'}
          <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
        </Button>
      )}

      {uploading && <LinearProgress sx={{ mb: 2 }} />}

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} disabled={uploading}>Annuler</Button>
        <Button type="submit" variant="contained" disabled={uploading} sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
          Ajouter
        </Button>
      </Box>
    </Paper>
  );
}

export default AjoutContenuForm;