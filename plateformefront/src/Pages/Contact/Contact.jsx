import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Composants/NavBar/NavBar";
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';

function Contact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        // Simulation d'envoi (à remplacer par votre API)
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            {/* Navbar */}
            <NavBar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <EmailIcon className="text-purple-600 mx-auto mb-6" style={{ fontSize: 80 }} />
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Contactez-<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">nous</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Une question ? Une suggestion ? Notre équipe est là pour vous aider
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Formulaire de contact */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>

                            {success && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                    ✅ Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Nom </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                        placeholder="Votre nom"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                        placeholder="votre.email@exemple.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Sujet</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                        placeholder="Objet de votre message"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none"
                                        placeholder="Décrivez votre demande..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <SendIcon className="mr-2" />
                                            Envoyer le message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Informations de contact */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Autres moyens de nous contacter</h2>
                                <p className="text-gray-600 leading-relaxed mb-8">
                                    Vous pouvez également nous joindre directement via les coordonnées ci-dessous. Notre équipe est disponible pour répondre à toutes vos questions.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Email */}
                                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                            <EmailIcon className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                                            <p className="text-gray-600">noreplyprepasconcours@gmail.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Téléphone */}
                                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                            <PhoneIcon className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Téléphone</h3>
                                            <p className="text-gray-600"></p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
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

export default Contact;
