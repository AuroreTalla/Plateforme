import { useState, useContext } from 'react';
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, CircularProgress, Switch, Chip,
} from '@mui/material';
import { AuthContext } from '../../Composants/Authentification/AuthContext';
import { modifierProfil, changerMotDePasse, modifierPreferences } from '../../Services/UserService';

const roleLabels = { ELEVE: 'Élève', PROFESSEUR: 'Professeur', ADMIN: 'Administrateur' };

/** Carte grise contenant des lignes séparées */
function Card({ children }) {
  return (
    <Box sx={{ bgcolor: '#f5f3ff', borderRadius: 3, overflow: 'hidden', mb: 4,
      '& > *:not(:last-child)': { borderBottom: '1px solid #ede9fe' } }}>
      {children}
    </Box>
  );
}

/** Une ligne : libellé, valeur ou action à droite */
function Row({ label, children, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2, flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Box sx={{ fontWeight: 600, color: '#1e293b' }}>{children}</Box>
      </Box>
      {action}
    </Box>
  );
}

const pill = { textTransform: 'none', borderRadius: 999, px: 3 };

export default function Parametre() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const [name, setName] = useState(currentUser?.name || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const [prefLoading, setPrefLoading] = useState(false);

  const [pwdOpen, setPwdOpen] = useState(false);
  const [ancienMdp, setAncienMdp] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmMdp, setConfirmMdp] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  if (!currentUser) return null;

  const modifie = name.trim() !== (currentUser.name || '');
  const [editingName, setEditingName] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await modifierProfil(name.trim());
      setCurrentUser(res.data);
      setMsg({ type: 'success', text: 'Profil mis à jour avec succès.' });
      setEditingName(false);
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.message || 'Erreur lors de la mise à jour.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
  setName(currentUser.name || '');
  setEditingName(false);
  setMsg(null);
};

  const handlePreference = async (checked) => {
    setPrefLoading(true);
    try {
      const res = await modifierPreferences(checked);
      setCurrentUser(res.data);
    } catch {
      setMsg({ type: 'error', text: 'Impossible de modifier la préférence.' });
    } finally {
      setPrefLoading(false);
    }
  };

  const fermerMdp = () => {
    setPwdOpen(false);
    setAncienMdp(''); setNouveauMdp(''); setConfirmMdp(''); setPwdError('');
  };

  const handleChangePassword = async () => {
    setPwdError('');
    if (nouveauMdp !== confirmMdp) { setPwdError('Les mots de passe ne correspondent pas.'); return; }
    if (nouveauMdp.length < 8) { setPwdError('Le nouveau mot de passe doit contenir au moins 8 caractères.'); return; }

    setPwdLoading(true);
    try {
      await changerMotDePasse(ancienMdp, nouveauMdp);
      fermerMdp();
      setMsg({ type: 'success', text: 'Mot de passe modifié avec succès.' });
    } catch (e) {
      setPwdError(e.response?.data?.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 4 }}>
        Paramètres du profil
      </Typography>

      {msg && <Alert severity={msg.type} sx={{ mb: 3 }} onClose={() => setMsg(null)}>{msg.text}</Alert>}

      <Typography fontWeight="bold" sx={{ mb: 1.5 }}>Informations du compte</Typography>
      <Card>
        <Row label="Nom"
        action={
            !editingName && (
            <Button variant="contained" size="small" onClick={() => setEditingName(true)}
                sx={{ ...pill, bgcolor: '#1e1b4b', '&:hover': { bgcolor: '#312e81' } }}>
                Modifier
            </Button>
            )
        }>
        {editingName ? (
            <TextField autoFocus fullWidth size="small" value={name}
            onChange={(e) => setName(e.target.value)} />
        ) : (
            currentUser.name
        )}
        </Row>
        <Row label="Adresse e-mail">{currentUser.email}</Row>
        <Row label="Rôle">
          <Chip label={roleLabels[currentUser.statut] || currentUser.statut} size="small"
            sx={{ bgcolor: '#ede9fe', color: '#7c3aed', fontWeight: 600 }} />
        </Row>
      </Card>

      <Typography fontWeight="bold" sx={{ mb: 1.5 }}>Connexion</Typography>
      <Card>
        <Row label="Mot de passe"
          action={
            <Button variant="contained" size="small" onClick={() => setPwdOpen(true)}
              sx={{ ...pill, bgcolor: '#1e1b4b', '&:hover': { bgcolor: '#312e81' } }}>
              Modifier
            </Button>
          }>
          ••••••••
        </Row>
      </Card>

      <Typography fontWeight="bold" sx={{ mb: 1.5 }}>Confidentialité et préférences</Typography>
      <Card>
        <Row label="Recommandations de ressources"
          action={
            <Switch checked={!!currentUser.recommandationsActives} disabled={prefLoading}
              onChange={(e) => handlePreference(e.target.checked)}
              sx={{ '& .Mui-checked': { color: '#7c3aed' },
                    '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#7c3aed' } }} />
          }>
          {currentUser.recommandationsActives ? 'Activées' : 'Désactivées'}
        </Row>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Pour améliorer la plateforme et vous proposer des ressources pertinentes, nous
            enregistrons les cours, exercices et publications que vous ouvrez. Désactiver cette
            option masque les recommandations.
          </Typography>
        </Box>
      </Card>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleSave} disabled={saving || !modifie}
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{ ...pill, py: 1.2, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
          Enregistrer
        </Button>
        <Button onClick={handleCancel} disabled={saving || !modifie}
          sx={{ ...pill, py: 1.2, bgcolor: '#ede9fe', color: '#7c3aed', '&:hover': { bgcolor: '#ddd6fe' } }}>
          Annuler
        </Button>
      </Box>

      <Dialog open={pwdOpen} onClose={fermerMdp} fullWidth maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle>Changer de mot de passe</DialogTitle>
        <DialogContent>
          {pwdError && <Alert severity="error" sx={{ mb: 2 }}>{pwdError}</Alert>}
          <TextField fullWidth type="password" label="Mot de passe actuel" value={ancienMdp}
            onChange={(e) => setAncienMdp(e.target.value)} sx={{ mb: 2, mt: 1 }} />
          <TextField fullWidth type="password" label="Nouveau mot de passe" value={nouveauMdp}
            onChange={(e) => setNouveauMdp(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth type="password" label="Confirmer le nouveau mot de passe" value={confirmMdp}
            onChange={(e) => setConfirmMdp(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={fermerMdp} disabled={pwdLoading}>Annuler</Button>
          <Button onClick={handleChangePassword} disabled={pwdLoading} variant="contained"
            sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
            {pwdLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}