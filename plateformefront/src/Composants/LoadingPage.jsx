export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-purple-600 bg-opacity-90 z-50">

      <div className="flex flex-col items-center gap-4 p-6">
        
        {/* Icône de chargement */}
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

        {/* Texte */}
        <p className="text-lg font-semibold text-white">
          Chargement...
        </p>

      </div>
    </div>
  );
}
