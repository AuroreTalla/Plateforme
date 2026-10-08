import SimpleTextForm from './SimpleTextForm';

function ReponseForm({ onSubmit, onCancel }) {
  return (
    <SimpleTextForm
      fields={[
        { name: 'content', label: '', placeholder: 'Votre réponse...', multiline: true, rows: 3 },
      ]}
      onSubmit={({ content }) => onSubmit(content)}
      onCancel={onCancel}
      submitLabel="Envoyer"
    />
  );
}

export default ReponseForm;