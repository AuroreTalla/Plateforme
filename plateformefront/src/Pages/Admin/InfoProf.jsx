import { useState, useEffect } from "react";
import { 
  UserCheck, 
  UserX, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import LoadingPage from "../../Composants/LoadingPage.jsx";
import { listeDemandes, refusProf, validerProf } from "../../ConfigBackEnd/ProfService.js";

export default function InfoProf() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showRefusModal, setShowRefusModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      setError("");
      const response = await listeDemandes();  // ✅ Appeler la fonction
      
      if (response.data) {
        // ✅ Le backend renvoie { demandes: [...], total: X }
        setDemandes(response.data.demandes || []);
      }
    } catch (error) {
      console.error("Erreur récupération demandes:", error);
      setError("Erreur lors de la récupération des demandes");
      
      // ✅ Vérifier si c'est une erreur d'authentification
      if (error.response?.status === 403) {
        setError("Accès refusé. Vous devez être administrateur.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validerProfesseur = async (userId) => {
    setActionLoading(true);
    setError("");
    
    try {
      const response = await validerProf(userId);  // ✅ Passer userId
      
      if (response.data) {
        // Retirer de la liste
        setDemandes(demandes.filter(d => d.id !== userId));
        
        // ✅ Notification de succès
        alert(`✅ ${response.data.message}`);
      }
    } catch (error) {
      console.error("Erreur validation:", error);
      const message = error.response?.data?.message || "Erreur lors de la validation";
      setError(message);
      alert(`❌ ${message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const refuserProfesseur = async () => {
    if (!selectedDemande) return;
    
    setActionLoading(true);
    setError("");
    
    try {
      const response = await refusProf(selectedDemande.id);  // ✅ Passer l'ID
      
      if (response.data) {
        setDemandes(demandes.filter(d => d.id !== selectedDemande.id));
        setShowRefusModal(false);
        setSelectedDemande(null);
        
        alert(`✅ ${response.data.message}`);
      }
    } catch (error) {
      console.error("Erreur refus:", error);
      const message = error.response?.data?.message || "Erreur lors du refus";
      setError(message);
      alert(`❌ ${message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* En-tête */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Clock className="text-purple-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Demandes de Statut Professeur
              </h1>
              <p className="text-gray-500">
                {demandes.length} demande{demandes.length !== 1 ? "s" : ""} en attente
              </p>
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Liste des demandes */}
          {demandes.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
              <p className="text-xl text-gray-600">Aucune demande en attente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {demandes.map((demande) => (
                <div
                  key={demande.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-[300px]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {demande.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {demande.name}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Mail size={16} />
                            {demande.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mt-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            Inscrit le{" "}
                            {demande.dateInscription 
                              ? new Date(demande.dateInscription).toLocaleDateString("fr-FR")
                              : "Date inconnue"
                            }
                          </span>
                        </div>
                        <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                          En attente de validation
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => validerProfesseur(demande.id)}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserCheck size={18} />
                        Valider
                      </button>

                      <button
                        onClick={() => {
                          setSelectedDemande(demande);
                          setShowRefusModal(true);
                        }}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserX size={18} />
                        Refuser
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de refus */}
      {showRefusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Refuser la demande
              </h2>
            </div>

            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir refuser la demande de{" "}
              <span className="font-semibold">{selectedDemande?.name}</span> ?
            </p>

            <p className="text-sm text-gray-500 mb-4">
              ℹ️ L'utilisateur ne sera pas notifié par email.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRefusModal(false);
                  setSelectedDemande(null);
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={refuserProfesseur}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Traitement..." : "Confirmer le refus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}