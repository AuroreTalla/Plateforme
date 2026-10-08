import { useNavigate } from "react-router-dom";
import NavBar from "../../Composants/NavBar/NavBar";
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import LaptopIcon from '@mui/icons-material/Laptop';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SearchIcon from '@mui/icons-material/Search';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Navbar */}
      <NavBar />

      {/* Hero Section avec illustration */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Partie gauche - Texte */}
            <div className="flex-1 space-y-8">

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Commencez à apprendre{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  chez vous
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Accédez à des cours en ligne, suivez vos progrès et atteignez vos objectifs éducatifs.
              </p>
            </div>

            {/* Partie droite - Illustration */}
            <div className="flex-1 relative">
              <div className="relative w-full max-w-lg mx-auto">

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi choisir notre plateforme ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez tous les avantages qui font de nous un bon choix pour votre apprentissage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-purple-100">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <MenuBookIcon className="text-white" style={{ fontSize: 32 }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cours interactifs</h3>
              <p className="text-gray-600 leading-relaxed">
                Des contenus pédagogiques riches, engageants et adaptés à tous les niveaux d'apprentissage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-100">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <AssessmentIcon className="text-white" style={{ fontSize: 32 }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Suivi des progrès</h3>
              <p className="text-gray-600 leading-relaxed">
                Tableaux de bord détaillés et analyses en temps réel pour suivre votre évolution.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-pink-100">
              <div className="bg-pink-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <PeopleIcon className="text-white" style={{ fontSize: 32 }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Communauté active</h3>
              <p className="text-gray-600 leading-relaxed">
                Échangez avec des professeurs et élèves passionnés ayant déja suivi ce parcours.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-green-100">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <LaptopIcon className="text-white" style={{ fontSize: 32 }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Apprentissage flexible</h3>
              <p className="text-gray-600 leading-relaxed">
                Apprenez à votre rythme, où vous voulez et quand vous voulez, 24h/24 et 7j/7.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-yellow-100">
              <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <SupportAgentIcon className="text-white" style={{ fontSize: 32 }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Support dédié</h3>
              <p className="text-gray-600 leading-relaxed">
                Une équipe disponible pour répondre à toutes vos questions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section CTA finale */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <SchoolIcon className="text-purple-600 mx-auto mb-6" style={{ fontSize: 80 }} />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Prêt à transformer votre expérience d'apprentissage ?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Rejoignez notre communauté dès aujourd'hui et accédez à des ressources éducatives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/inscription")}
              className="px-10 py-4 bg-purple-600 text-white rounded-full font-semibold text-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Créer mon compte
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-10 py-4 border-2 border-purple-600 text-purple-600 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all duration-300"
            >
              Découvrir les cours
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 bottom-0 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col justify-center items-center">
            <div className="flex items-center space-x-4 mb-4">
              <SchoolIcon style={{ fontSize: 32 }} />
              <span className="text-xl font-bold">Plateforme</span>
            </div>
            <p className="text-gray-400 text-sm">
              La plateforme pour l'apprentissage et la preparation des concours en ligne.
            </p>

          </div>

        </div>
      </footer>
    </div>
  );
}

export default LandingPage;