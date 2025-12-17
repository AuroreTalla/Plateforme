import { useState, useEffect } from "react";
import { 
  UserCheck, 
  UserX, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Clock
} from "lucide-react";

export default function InfoProf() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showRefusModal, setShowRefusModal] = useState(false);
  const [raisonRefus, setRaisonRefus] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/admin/demandes-professeur", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setDemandes(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const validerProfesseur = async (userId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/admin/valider-professeur/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Retirer de la liste
        setDemandes(demandes.filter(d => d.id !== userId));
        alert("Utilisateur validé comme professeur !");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la validation");
    } finally {
      setActionLoading(false);
    }
  };

  const refuserProfesseur = async () => {
    if (!raisonRefus.trim()) {
      alert("Veuillez indiquer une raison");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/admin/refuser-professeur/${selectedDemande.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ raison: raisonRefus })
      });

      if (response.ok) {
        setDemandes(demandes.filter(d => d.id !== selectedDemande.id));
        setShowRefusModal(false);
        setRaisonRefus("");
        setSelectedDemande(null);
        alert("Demande refusée");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du refus");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Clock className="text-purple-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Demandes de Statut Professeur
              </h1>
              <p className="text-gray-500">
                {demandes.length} demande{demandes.length > 1 ? "s" : ""} en attente
              </p>
            </div>
          </div>

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
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {demande.name?.charAt(0)?.toUpperCase()}
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

                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            Inscrit le{" "}
                            {new Date(demande.dateInscription).toLocaleDateString("fr-FR")}
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Refuser la demande
              </h2>
            </div>

            <p className="text-gray-600 mb-4">
              Veuillez indiquer la raison du refus à{" "}
              <span className="font-semibold">{selectedDemande?.name}</span>
            </p>

            <textarea
              value={raisonRefus}
              onChange={(e) => setRaisonRefus(e.target.value)}
              placeholder="Raison du refus..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRefusModal(false);
                  setRaisonRefus("");
                  setSelectedDemande(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={refuserProfesseur}
                disabled={actionLoading || !raisonRefus.trim()}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Envoi..." : "Confirmer le refus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}