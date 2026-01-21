export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-violet-700 mb-4">
        Bienvenue sur votre Dashboard
      </h1>
      <p className="text-gray-600 text-lg">
        Sélectionnez une section dans le menu.
      </p>
      
      {/* Exemple de contenu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-xl text-gray-900 mb-2">Statistique 1</h3>
          <p className="text-gray-600">Contenu ici</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-xl text-gray-900 mb-2">Statistique 2</h3>
          <p className="text-gray-600">Contenu ici</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-xl text-gray-900 mb-2">Statistique 3</h3>
          <p className="text-gray-600">Contenu ici</p>
        </div>
      </div>
    </div>
  );
}
