import { useState } from 'react';
import GroupeList from './GroupeList';
import GroupeChat from './GroupeChat';

function Forum() {
  const [selectedGroupe, setSelectedGroupe] = useState(null);

  const handleSelectGroupe = (groupeNom) => {
    setSelectedGroupe(groupeNom);
  };

  const handleBackToList = () => {
    setSelectedGroupe(null);
  };

  return (
    <div>
      {selectedGroupe ? (
        <GroupeChat 
          groupeNom={selectedGroupe} 
          onBack={handleBackToList} 
        />
      ) : (
        <GroupeList onSelectGroupe={handleSelectGroupe} />
      )}
    </div>
  );
}

export default Forum;