import { useNavigate } from "react-router-dom";
import NavBar from "../../Composants/NavBar/NavBar";
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FavoriteIcon from '@mui/icons-material/Favorite';

function APropos() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            {/* Navbar */}
            <NavBar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <SchoolIcon className="text-purple-600 mx-auto mb-6" style={{ fontSize: 80 }} />
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                        À propos de notre plateforme
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Une plateforme d'apprentissage innovante dédiée à la préparation des concours et à l'excellence académique
                    </p>
                </div>
            </section>

            {/* Notre Mission */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">Notre Mission</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-4">
                                Nous croyons que l'éducation de qualité doit être accessible à tous. Notre plateforme a été créée pour offrir aux étudiants les meilleurs outils et ressources pour réussir leurs concours et atteindre leurs objectifs académiques.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed mb-4">
                                Grâce à une approche pédagogique moderne et interactive, nous accompagnons chaque étudiant dans son parcours d'apprentissage, en mettant l'accent sur la compréhension profonde des concepts et la pratique régulière.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Notre communauté de professeurs passionnés et d'étudiants motivés crée un environnement d'apprentissage collaboratif où chacun peut progresser à son rythme.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl p-12 shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
                                        <EmojiEventsIcon className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Excellence</h3>
                                        <p className="text-gray-600 text-sm">Des contenus de haute qualité</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
                                        <PeopleIcon className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Communauté</h3>
                                        <p className="text-gray-600 text-sm">Entraide et collaboration</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-pink-600 w-12 h-12 rounded-full flex items-center justify-center">
                                        <LightbulbIcon className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Innovation</h3>
                                        <p className="text-gray-600 text-sm">Méthodes pédagogiques modernes</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center">
                                        <FavoriteIcon className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Passion</h3>
                                        <p className="text-gray-600 text-sm">Amour de l'enseignement</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nos Valeurs */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Nos Valeurs</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <span className="text-white text-2xl font-bold">1</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Accessibilité</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Rendre l'éducation de qualité accessible à tous, peu importe la localisation ou les moyens financiers.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <span className="text-white text-2xl font-bold">2</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Qualité</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Offrir des contenus pédagogiques rigoureux, vérifiés et constamment mis à jour.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <span className="text-white text-2xl font-bold">3</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Accompagnement</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Soutenir chaque étudiant dans son parcours avec un suivi personnalisé et une communauté bienveillante.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Rejoignez notre communauté
                    </h2>
                    <p className="text-xl text-purple-100 mb-10">
                        Commencez votre parcours vers la réussite dès aujourd'hui
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate("/inscription")}
                            className="px-10 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            S'inscrire gratuitement
                        </button>
                        <button
                            onClick={() => navigate("/contact")}
                            className="px-10 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
                        >
                            Nous contacter
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex items-center space-x-4 mb-4">
                            <SchoolIcon style={{ fontSize: 32 }} />
                            <span className="text-xl font-bold">Plateforme</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            La plateforme pour l'apprentissage et la préparation des concours en ligne.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default APropos;
