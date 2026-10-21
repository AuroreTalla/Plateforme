import { Dialog, Box, Typography, IconButton, Button, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { buildMediaUrl } from '../../Services/MatiereService.js';
import Recommandations from './Recommandations';

const typeLabels = {
  TEXTE: 'Texte', IMAGE: 'Image', VIDEO: 'Vidéo',
  AUDIO: 'Audio', PDF: 'PDF', DOCUMENT: 'Document',
};

function Contenu({ ressource }) {
  const url = buildMediaUrl(ressource.mediaUrl);

  switch (ressource.type) {
    case 'TEXTE':
      return <Typography sx={{ whiteSpace: 'pre-wrap' }}>{ressource.contenu}</Typography>;
    case 'IMAGE':
      return <Box component="img" src={url} sx={{ maxWidth: '100%', borderRadius: 2 }} />;
    case 'VIDEO':
      return <Box component="video" src={url} controls sx={{ maxWidth: '100%', borderRadius: 2 }} />;
    case 'AUDIO':
      return <Box component="audio" src={url} controls sx={{ width: '100%' }} />;
    case 'PDF':
      return <Box component="iframe" src={url} sx={{ width: '100%', height: '70vh', border: 'none', borderRadius: 2 }} />;
    case 'DOCUMENT':
      return (
        <Button href={url} target="_blank" variant="outlined"
          sx={{ textTransform: 'none', color: '#7c3aed', borderColor: '#7c3aed' }}>
          Télécharger le document
        </Button>
      );
    default:
      return null;
  }
}

/**
 * Boîte de dialogue d'affichage d'une ressource (cours ou exercice).
 * @param {object|null} ressource - la ressource ouverte, null = fermé
 * @param {'COURS'|'EXERCICE'} typeRessource
 * @param {() => void} onClose
 */
export default function RessourceViewer({ ressource, typeRessource, onClose }) {
  return (
    <Dialog open={!!ressource} onClose={onClose} fullWidth maxWidth="md"
      PaperProps={{ sx: { borderRadius: 4 } }}>
      {ressource && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 3, borderBottom: '1px solid #f1f5f9' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ flex: 1, minWidth: 0 }} noWrap>
              {ressource.titre}
            </Typography>
            <Chip label={typeLabels[ressource.type]} size="small"
              sx={{ bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 600 }} />
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            <Contenu ressource={ressource} />
            <Recommandations type={typeRessource} id={ressource.id} />
          </Box>
        </>
      )}
    </Dialog>
  );
}