import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Avatar,
    Tooltip, Fade, CircularProgress, Snackbar, Alert
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

export function DemandesMatieres() {
    // ⚠️ Toujours en mock : aucun backend (entité, repository, contrôleur)
    // n'existe encore pour les propositions de matières. À implémenter séparément.
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100%' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 1 }}>
                Nouvelles Matières
            </Typography>
            <Typography color="#64748b">
                Cette fonctionnalité n'est pas encore connectée au backend.
            </Typography>
        </Box>
    );
}
export default DemandesMatieres;