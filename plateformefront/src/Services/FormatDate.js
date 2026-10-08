export const formatDate = (dateString) => {
  if (!dateString) return '';

  // Si le backend renvoie uniquement HH:mm
  if (/^\d{2}:\d{2}$/.test(dateString)) {
    return `Aujourd'hui à ${dateString}`;
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const time = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (isToday) {
    return `Aujourd'hui à ${time}`;
  }

  if (isYesterday) {
    return `Hier à ${time}`;
  }

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ` à ${time}`;
};