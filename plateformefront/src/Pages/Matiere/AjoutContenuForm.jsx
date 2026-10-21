import { useState, useRef } from 'react';
import {
  Dialog, Box, Typography, IconButton, Button, TextField,
  LinearProgress, Alert, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { uploadFichier } from '../../Services/UploadService';

// Mêmes limites que UploadService côté backend (1 Mo = 1 000 000 octets)
const REGLES = {
  jpg: { type: 'IMAGE', maxMo: 2 }, jpeg: { type: 'IMAGE', maxMo: 2 },
  png: { type: 'IMAGE', maxMo: 2 }, webp: { type: 'IMAGE', maxMo: 2 },
  mp4: { type: 'VIDEO', maxMo: 15 },
  mp3: { type: 'AUDIO', maxMo: 8 }, wav: { type: 'AUDIO', maxMo: 8 },
  pdf: { type: 'PDF', maxMo: 5 },
  doc: { type: 'DOCUMENT', maxMo: 5 }, docx: { type: 'DOCUMENT', maxMo: 5 },
  txt: { type: 'DOCUMENT', maxMo: 1 },
};

const extensionDe = (nom) => nom.split('.').pop().toLowerCase();
const formatTaille = (octets) =>
  octets < 1_000_000 ? `${Math.round(octets / 1000)} Ko` : `${(octets / 1_000_000).toFixed(1)} Mo`;

function AjoutContenuForm({ open, onSubmit, onCancel }) {
  const inputRef = useRef(null);
  const [mode, setMode] = useState('FICHIER');
  const [file, setFile] = useState(null);
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setMode('FICHIER'); setFile(null); setTitre(''); setContenu('');
    setProgress(0); setUploading(false); setDragOver(false); setError('');
  };

  const fermer = () => {
    if (uploading) return;
    reset();
    onCancel();
  };

  const choisirFichier = (f) => {
    if (!f) return;
    const regle = REGLES[extensionDe(f.name)];
    if (!regle) {
      setError('Format non pris en charge. Formats acceptés : JPG, PNG, WEBP, MP4, MP3, WAV, PDF, DOC, DOCX, TXT.');
      return;
    }
    if (f.size > regle.maxMo * 1_000_000) {
      setError(`Fichier trop volumineux : maximum ${regle.maxMo} Mo pour ce format.`);
      return;
    }
    setError('');
    setFile(f);
    if (!titre.trim()) setTitre(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    choisirFichier(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async () => {
    setError('');
    if (!titre.trim()) { setError('Le titre est requis.'); return; }

    try {
      if (mode === 'TEXTE') {
        if (!contenu.trim()) { setError('Le contenu texte est requis.'); return; }
        await onSubmit({ titre, type: 'TEXTE', contenu, mediaUrl: null });
      } else {
        if (!file) { setError('Veuillez sélectionner un fichier.'); return; }
        setUploading(true);
        const { type } = REGLES[extensionDe(file.name)];
        const res = await uploadFichier(file, type, setProgress);
        await onSubmit({ titre, type, contenu: null, mediaUrl: res.data.url });
      }
      reset();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Une erreur est survenue.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={fermer} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 4 } }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, borderBottom: '1px solid #f1f5f9' }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: '#f5f3ff', color: '#7c3aed',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CloudUploadOutlinedIcon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight="bold">Ajouter du contenu</Typography>
          <Typography variant="body2" color="text.secondary">
            Sélectionnez un fichier ou rédigez un texte
          </Typography>
        </Box>
        <IconButton onClick={fermer} disabled={uploading}><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <ToggleButtonGroup
          exclusive fullWidth size="small" value={mode} disabled={uploading}
          onChange={(_, v) => v && setMode(v)}
          sx={{ mb: 3, '& .Mui-selected': { bgcolor: '#f5f3ff !important', color: '#7c3aed' } }}
        >
          <ToggleButton value="FICHIER">Fichier</ToggleButton>
          <ToggleButton value="TEXTE">Texte</ToggleButton>
        </ToggleButtonGroup>

        <TextField fullWidth label="Titre" value={titre} disabled={uploading}
          onChange={(e) => setTitre(e.target.value)} sx={{ mb: 3 }} />

        {mode === 'TEXTE' ? (
          <TextField fullWidth multiline rows={6} label="Contenu" value={contenu}
            onChange={(e) => setContenu(e.target.value)} />
        ) : (
          <>
            {/* Zone de dépôt */}
            <Box
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              sx={{
                border: '2px dashed', borderColor: dragOver ? '#7c3aed' : '#c4b5fd',
                bgcolor: dragOver ? '#f5f3ff' : '#faf9ff', borderRadius: 3,
                p: 4, textAlign: 'center', transition: 'all 0.15s',
              }}
            >
              <CloudUploadOutlinedIcon sx={{ color: '#7c3aed', fontSize: 32, mb: 1 }} />
              <Typography fontWeight={600}>Choisissez un fichier ou glissez-le ici</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Image (2 Mo), vidéo MP4 (15 Mo), audio (8 Mo), PDF et documents (5 Mo)
              </Typography>
              <Button variant="outlined" onClick={() => inputRef.current?.click()} disabled={uploading}
                sx={{ textTransform: 'none', color: '#7c3aed', borderColor: '#7c3aed' }}>
                Parcourir
              </Button>
              <input ref={inputRef} type="file" hidden
                accept=".jpg,.jpeg,.png,.webp,.mp4,.mp3,.wav,.pdf,.doc,.docx,.txt"
                onChange={(e) => { choisirFichier(e.target.files?.[0]); e.target.value = ''; }} />
            </Box>

            {/* Fichier sélectionné */}
            {file && (
              <Box sx={{ mt: 2, p: 2, border: '1px solid #e2e8f0', borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <InsertDriveFileOutlinedIcon sx={{ color: '#7c3aed' }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{file.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTaille(file.size)} · {uploading ? `Envoi en cours… ${progress} %` : 'Prêt à envoyer'}
                    </Typography>
                  </Box>
                  <IconButton size="small" disabled={uploading}
                    onClick={() => { setFile(null); setProgress(0); }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
                {uploading && (
                  <LinearProgress variant="determinate" value={progress}
                    sx={{ mt: 1.5, borderRadius: 1, '& .MuiLinearProgress-bar': { bgcolor: '#7c3aed' } }} />
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2, px: 3, borderTop: '1px solid #f1f5f9' }}>
        <Button onClick={fermer} disabled={uploading}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={uploading}
          sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
          Ajouter
        </Button>
      </Box>
    </Dialog>
  );
}

export default AjoutContenuForm;