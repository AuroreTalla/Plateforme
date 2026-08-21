# Plateforme Éducative

Plateforme web permettant aux élèves et professeurs d'accéder à des matières, suivre des cours et exercices, échanger via des forums de discussion, et à l'administration de superviser l'ensemble du système.

## Fonctionnalités

### Authentification & Comptes
- Inscription avec vérification d'email par code
- Connexion par JWT (access token + refresh token, cookies HttpOnly)
- Mot de passe oublié / réinitialisation par code
- Modification du profil et changement de mot de passe
- Trois rôles : Élève, Professeur, Administrateur

### Demande de statut Professeur
- Un élève peut demander à devenir professeur à l'inscription
- L'administrateur reçoit une notification et valide/refuse la demande
- Historique complet des décisions (validées, refusées, révoquées)
- Possibilité de révoquer le statut professeur

### Matières, Cours & Exercices
- Chaque matière est liée à un groupe de discussion (forum) dédié
- Ajout de contenus pédagogiques : texte, image, vidéo, audio, PDF, document
- Suppression protégée : une matière ne peut être supprimée sans nettoyer son forum associé

### Forums (Publications & Réponses)
- Système de questions/réponses par matière (type StackOverflow)
- Statut de résolution : Non résolue / Résolue
- L'auteur d'une question peut proposer une réponse comme solution
- Un professeur/admin valide officiellement la solution
- Notifications temps réel via WebSocket (STOMP)
- Recherche par mot-clé et pagination des publications

### Feedback
- Élèves et professeurs peuvent envoyer un avis sur la plateforme (note optionnelle)
- Vue dédiée pour l'administrateur consultant tous les retours

### Administration
- Gestion des utilisateurs
- Gestion des matières (création, suppression)
- Gestion des demandes professeur
- Vue globale des forums

## Architecture

### Backend — Spring Boot
com.example.plateformeback
├── config/ Sécurité, CORS, WebSocket, upload
├── jwt/ Génération, validation, rafraîchissement des tokens
├── user/ Utilisateurs, authentification
│ └── demandeProfesseur/ Demandes de statut professeur
├── groupe/ Groupes de discussion (forums)
├── matiere/ Matières, cours, exercices
├── publication/ Publications (questions)
├── reponse/ Réponses aux publications
├── feedback/ Retours utilisateurs
├── password/ Réinitialisation de mot de passe
├── verificationEmail/ Vérification d'email, notifications
├── upload/ Upload de fichiers
└── exception/ Gestion centralisée des erreurs

**Stack** : Java 21, Spring Boot 3.5, Spring Security (JWT), Spring Data JPA (Hibernate), MariaDB/MySQL, WebSocket (STOMP/SockJS), Lombok.

### Frontend — React
src/
├── Composants/
│ ├── Authentification/ Contexte utilisateur, garde de routes
│ ├── Layout/ Layout global, layout dashboard
│ ├── NavBar/ SideBar/ Navigation
│ ├── Matiere/ Groupe/ Providers de données partagées
├── Pages/
│ ├── Acceuil/ Inscription/ Connexion/
│ ├── Dashboard/ Vue personnalisée par rôle
│ ├── Forum/ Publications, réponses
│ ├── Matiere/ Cours, exercices
│ ├── Parametre/ Feedback/
│ └── Admin/ Utilisateurs, demandes, matières
├── ConfigBackEnd/ Services API (axios), WebSocket
├── Routes/ Configuration React Router
└── utils/ Utilitaires (dates, etc.)

**Stack** : React 18, React Router, Material UI (MUI), Tailwind CSS, Axios, STOMP.js/SockJS.


##  Installation

### Prérequis
- Java 21
- Node.js 18+
- MariaDB/MySQL

### Backend

```bash
cd plateformeback
# Configurer application.properties :

**`application.properties`
```properties
spring.datasource.url=jdbc:mariadb://localhost:3306/plateformeBD
spring.datasource.username=<user>
spring.datasource.password=<password>
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
spring.jpa.open-in-view=false

spring.mail.host=<smtp_host>
spring.mail.port=587
spring.mail.username=<email>
spring.mail.password=<password>

spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=20MB
app.upload.dir=uploads

jwt.secret=<votre_secret>
```
```bash
# exécutter le backend de l'application :
mvn spring-boot:run
```

### Frontend

```bash
cd plateformebackfront

#installer les dependaces
npm install

# exécutter le backend de l'application :
npm run dev
```

Adapter l'URL de l'API backend dans `src/ConfigBackEnd/Api.js`.

##  Sécurité

- Authentification stateless par JWT (access + refresh token en cookies HttpOnly)
- Mots de passe hachés (BCrypt)
- Autorisations par rôle (`@PreAuthorize`) sur les endpoints sensibles
- CORS restreint aux origines connues
- Upload de fichiers : whitelist d'extensions, limite de taille par type

