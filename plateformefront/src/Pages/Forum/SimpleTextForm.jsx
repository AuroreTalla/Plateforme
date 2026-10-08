import { useState } from 'react';
import { Box, Paper, TextField, Button } from '@mui/material';

/**
 * Formulaire texte générique : un ou plusieurs champs TextField,
 * un bouton Annuler et un bouton de soumission.
 *
 * @param {Array<{name, label, multiline, rows}>} fields - champs à afficher
 * @param {(values: object) => void} onSubmit - reçoit { [name]: value, ... }
 * @param {() => void} onCancel
 * @param {string} submitLabel
 */
function SimpleTextForm({ fields, onSubmit, onCancel, submitLabel = 'Valider' }) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, '']));
  const [values, setValues] = useState(initial);

  const handleChange = (name) => (e) => {
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEmptyRequired = fields.some((f) => f.required !== false && !values[f.name]?.trim());
    if (hasEmptyRequired) return;

    onSubmit(values);
    setValues(initial);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 3 }} component="form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <TextField
          key={field.name}
          fullWidth
          multiline={field.multiline}
          rows={field.rows}
          label={field.label}
          placeholder={field.placeholder}
          value={values[field.name]}
          onChange={handleChange(field.name)}
          sx={{ mb: 2 }}
        />
      ))}

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
          {submitLabel}
        </Button>
      </Box>
    </Paper>
  );
}

export default SimpleTextForm;