export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-purple-600 bg-opacity-90 z-50">

      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-lg">
        
        {/* Icône de chargement */}
        <div className="w-12 h-12 border-4 border-purple-700 border-t-transparent rounded-full animate-spin"></div>

        {/* Texte */}
        <p className="text-lg font-semibold text-purple-700">
          Chargement...
        </p>

      </div>
    </div>
  );
}
