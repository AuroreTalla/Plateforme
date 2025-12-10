import React, { useState } from 'react';
import { BookOpen, MessageSquare, FileText, Home, Bell, User, ChevronRight, Users, Search } from 'lucide-react';

const Apropos = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    { id: 1, name: 'Mathématiques', color: 'bg-blue-500', courses: 12, exercises: 45, members: 234 },
    { id: 2, name: 'Physique', color: 'bg-purple-500', courses: 8, exercises: 32, members: 189 },
    { id: 3, name: 'Chimie', color: 'bg-green-500', courses: 10, exercises: 38, members: 156 },
    { id: 4, name: 'Informatique', color: 'bg-orange-500', courses: 15, exercises: 67, members: 312 },
  ];

  const discussions = [
    { id: 1, title: "Comment résoudre les équations du second degré ?", author: "Marie K.", replies: 12, subject: 'Mathématiques' },
    { id: 2, title: "Aide sur la loi d'Ohm", author: "Jean D.", replies: 5, subject: 'Physique' },
    { id: 3, title: "Exercice sur les réactions d'oxydoréduction", author: "Sophie L.", replies: 8, subject: 'Chimie' },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map(subject => (
          <div 
            key={subject.id}
            onClick={() => {
              setSelectedSubject(subject);
              setCurrentView('subject');
            }}
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
          >
            <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center mb-4`}>
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{subject.name}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{subject.courses} cours</p>
              <p>{subject.exercises} exercices</p>
              <p className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {subject.members} membres
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Discussions récentes</h2>
        <div className="space-y-3">
          {discussions.map(discussion => (
            <div key={discussion.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">{discussion.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{discussion.author}</span>
                    <span>•</span>
                    <span className="text-blue-600">{discussion.subject}</span>
                    <span>•</span>
                    <span>{discussion.replies} réponses</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSubjectView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Retour
        </button>
      </div>

      <div className={`${selectedSubject.color} rounded-xl p-8 text-white`}>
        <h1 className="text-4xl font-bold mb-2">{selectedSubject.name}</h1>
        <p className="text-white/90">Explorez les cours, pratiquez avec des exercices et échangez avec la communauté</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Cours</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">Accédez aux {selectedSubject.courses} cours disponibles</p>
          <button className="text-blue-600 font-medium text-sm flex items-center gap-1">
            Voir les cours <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Exercices</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">Pratiquez avec {selectedSubject.exercises} exercices</p>
          <button className="text-green-600 font-medium text-sm flex items-center gap-1">
            Voir les exercices <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Groupe d'échange</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">{selectedSubject.members} membres actifs</p>
          <button className="text-purple-600 font-medium text-sm flex items-center gap-1">
            Rejoindre la discussion <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cours récents</h2>
        <div className="space-y-2">
          {['Chapitre 1: Introduction', 'Chapitre 2: Concepts fondamentaux', 'Chapitre 3: Applications pratiques'].map((course, idx) => (
            <div key={idx} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
              <span className="text-gray-700">{course}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Discussions actives - {selectedSubject.name}</h2>
        <div className="space-y-3">
          {discussions.filter(d => d.subject === selectedSubject.name).map(discussion => (
            <div key={discussion.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium text-gray-800 mb-2">{discussion.title}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{discussion.author}</span>
                <span>•</span>
                <span>{discussion.replies} réponses</span>
              </div>
            </div>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium">
            + Nouvelle discussion
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">EduPlatform</h2>
        </div>
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Accueil</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Mes cours</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Exercices</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Communauté</span>
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Top bar */}
          <div className="flex justify-end items-center mb-6 gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          {currentView === 'dashboard' ? renderDashboard() : renderSubjectView()}
        </div>
      </div>
    </div>
  );
};

export default Apropos;

/*npx tailwindcss -i ./src/css/input.css -o ./src/css/output.css --watch


{/* Section Témoignages */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-xl text-purple-100 mb-16 max-w-2xl mx-auto">
            Rejoignez des milliers d'étudiants et professeurs satisfaits
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-5xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 italic mb-6">
                "Une plateforme exceptionnelle qui a transformé ma façon d'enseigner. Mes élèves adorent !"
              </p>
              <p className="font-bold text-purple-600">Marie Dupont</p>
              <p className="text-sm text-gray-500">Professeure de Mathématiques</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-5xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 italic mb-6">
                "J'ai progressé rapidement grâce aux cours interactifs et au suivi personnalisé."
              </p>
              <p className="font-bold text-purple-600">Jean Martin</p>
              <p className="text-sm text-gray-500">Étudiant en Sciences</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-5xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 italic mb-6">
                "Interface intuitive, contenu de qualité et communauté bienveillante. Parfait !"
              </p>
              <p className="font-bold text-purple-600">Sophie Laurent</p>
              <p className="text-sm text-gray-500">Professeure d'Histoire</p>
            </div>
          </div>
        </div>
      </section>