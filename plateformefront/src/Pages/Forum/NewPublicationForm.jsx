import SimpleTextForm from './SimpleTextForm';

function NewPublicationForm({ onSubmit, onCancel }) {
  return (
    <SimpleTextForm
      fields={[
        { name: 'titre', label: 'Titre de votre question' },
        { name: 'content', label: 'Décrivez votre question', multiline: true, rows: 4 },
      ]}
      onSubmit={({ titre, content }) => onSubmit(titre, content)}
      onCancel={onCancel}
      submitLabel="Publier"
    />
  );
}

export default NewPublicationForm;