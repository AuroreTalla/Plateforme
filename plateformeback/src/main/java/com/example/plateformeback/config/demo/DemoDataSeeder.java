package com.example.plateformeback.config.demo;

import com.example.plateformeback.enums.TypeContenu;
import com.example.plateformeback.enums.TypeRoleUser;
import com.example.plateformeback.groupe.Groupe;
import com.example.plateformeback.groupe.GroupeService;
import com.example.plateformeback.matiere.MatiereDTO;
import com.example.plateformeback.matiere.MatiereRepository;
import com.example.plateformeback.matiere.MatiereService;
import com.example.plateformeback.publication.Publication;
import com.example.plateformeback.publication.PublicationRepository;
import com.example.plateformeback.reponse.Reponse;
import com.example.plateformeback.reponse.ReponseRepository;
import com.example.plateformeback.user.Users;
import com.example.plateformeback.user.UsersRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Jeu de données de démonstration, chargé uniquement avec le profil "prod"
 * et uniquement si la base est vide.
 *
 * Comptes créés (mot de passe commun = variable APP_DEMO_PASSWORD) :
 *   admin@demo.com (admin), prof@demo.com (professeur de maths), eleve@demo.com (élève),
 *   plus d'autres professeurs et élèves.
 */
@Slf4j
@Component
@Profile("prod")
@RequiredArgsConstructor // volontairement PAS @AllArgsConstructor : demoPassword n'est pas final
public class DemoDataSeeder implements CommandLineRunner {

    private static final String STATUT_RESOLUE = "RESOLUE";
    private static final String STATUT_NON_RESOLUE = "NON_RESOLUE";

    private final UsersRepository usersRepository;
    private final MatiereRepository matiereRepository;
    private final MatiereService matiereService;
    private final GroupeService groupeService;
    private final PublicationRepository publicationRepository;
    private final ReponseRepository reponseRepository;
    private final BCryptPasswordEncoder encoder;

    @Value("${app.demo.password:}")
    private String demoPassword;

    @Override
    @Transactional
    public void run(String... args) {
        if (demoPassword.isBlank()) {
            log.warn("APP_DEMO_PASSWORD absent : jeu de démonstration ignoré");
            return;
        }
        // ne touche jamais à de vraies données
        if (usersRepository.count() > 0 || matiereRepository.count() > 0) return;

        // ================= UTILISATEURS =================
        Users admin = creerUtilisateur("admin@demo.com", "Emmanuel Tchounkeu", TypeRoleUser.ADMIN);

        Users profMaths = creerUtilisateur("prof@demo.com", "Marie-Claire Ngono", TypeRoleUser.PROFESSEUR);
        Users profPhysique = creerUtilisateur("samuel.fotso@demo.com", "Samuel Fotso", TypeRoleUser.PROFESSEUR);
        Users profInfo = creerUtilisateur("nadege.bekolo@demo.com", "Nadège Bekolo", TypeRoleUser.PROFESSEUR);
        Users profFrancais = creerUtilisateur("josiane.mballa@demo.com", "Josiane Mballa", TypeRoleUser.PROFESSEUR);

        Users aminata = creerUtilisateur("eleve@demo.com", "Aminata Diallo", TypeRoleUser.ELEVE);
        Users brice = creerUtilisateur("brice.nkoulou@demo.com", "Brice Nkoulou", TypeRoleUser.ELEVE);
        Users sandrine = creerUtilisateur("sandrine.kamga@demo.com", "Sandrine Kamga", TypeRoleUser.ELEVE);
        Users ibrahim = creerUtilisateur("ibrahim.sow@demo.com", "Ibrahim Sow", TypeRoleUser.ELEVE);
        Users clarisse = creerUtilisateur("clarisse.ebogo@demo.com", "Clarisse Ebogo", TypeRoleUser.ELEVE);
        Users yannick = creerUtilisateur("yannick.essomba@demo.com", "Yannick Essomba", TypeRoleUser.ELEVE);
        Users fatou = creerUtilisateur("fatou.ndiaye@demo.com", "Fatou Ndiaye", TypeRoleUser.ELEVE);

        // ================= MATIÈRES =================
        MatiereDTO maths = matiereService.creerMatiere("Mathématiques",
                "Algèbre, analyse et suites : les outils de base pour résoudre des problèmes.");
        MatiereDTO physique = matiereService.creerMatiere("Physique-Chimie",
                "Mécanique, électricité et quantité de matière, avec des exercices d'application.");
        MatiereDTO info = matiereService.creerMatiere("Informatique",
                "Initiation à la programmation en Python et aux bases de données SQL.");
        MatiereDTO francais = matiereService.creerMatiere("Français",
                "Méthodologie du commentaire composé et maîtrise de la langue.");

        // Cours et exercices en TEXTE : ils vivent dans la base, pas sur le disque éphémère

        // ----- Mathématiques -----
        cours(maths, 1, "Les équations du second degré", """
                Une équation du second degré s'écrit ax² + bx + c = 0, avec a ≠ 0.
                On commence par calculer le discriminant Δ = b² − 4ac, puis on distingue trois cas :
                • Δ > 0 : deux solutions réelles, x₁ = (−b − √Δ) / (2a) et x₂ = (−b + √Δ) / (2a)
                • Δ = 0 : une solution double, x = −b / (2a)
                • Δ < 0 : aucune solution réelle

                Exemple : x² − 5x + 6 = 0. Ici a = 1, b = −5 et c = 6, donc Δ = 25 − 24 = 1.
                Les solutions sont x₁ = (5 − 1) / 2 = 2 et x₂ = (5 + 1) / 2 = 3.

                Attention aux signes : lorsque c est négatif, le terme −4ac est positif.""");

        cours(maths, 2, "Introduction aux dérivées", """
                La dérivée d'une fonction f en un point a mesure la vitesse de variation de f en ce point.
                Graphiquement, f'(a) est le coefficient directeur (la pente) de la tangente à la courbe au point d'abscisse a.

                Règles de base :
                • (k)' = 0 pour une constante k
                • (xⁿ)' = n · xⁿ⁻¹
                • (u + v)' = u' + v'
                • (k · u)' = k · u'
                • (u · v)' = u'v + uv'

                Exemple : f(x) = 3x² − 4x + 1 donne f'(x) = 6x − 4, donc f'(2) = 8.

                Si f'(x) > 0 sur un intervalle, f est croissante sur cet intervalle ; si f'(x) < 0, elle est décroissante.""");

        cours(maths, 3, "Suites arithmétiques et géométriques", """
                Une suite arithmétique de raison r vérifie uₙ₊₁ = uₙ + r. Son terme général est uₙ = u₀ + n · r.
                Exemple : u₀ = 3 et r = 4 donnent u₁₀ = 3 + 10 × 4 = 43.

                Une suite géométrique de raison q vérifie uₙ₊₁ = q · uₙ. Son terme général est uₙ = u₀ · qⁿ.
                Exemple : u₀ = 2 et q = 3 donnent u₅ = 2 × 3⁵ = 486.

                Somme des termes d'une suite géométrique (q ≠ 1) : u₀ + u₁ + … + uₙ = u₀ · (1 − qⁿ⁺¹) / (1 − q).""");

        exercice(maths, 1, "Exercice 1 : discriminant", """
                Résoudre dans ℝ les équations suivantes :
                a) 2x² − 3x − 5 = 0
                b) x² + 4x + 4 = 0
                c) x² + x + 1 = 0""");

        exercice(maths, 2, "Exercice 2 : dérivées", """
                Calculer la dérivée des fonctions suivantes :
                a) f(x) = 4x³ − 2x² + 7x − 1
                b) g(x) = (x² + 1)(3x − 2)
                En déduire la valeur de f'(1).""");

        // ----- Physique-Chimie -----
        cours(physique, 1, "Les lois de Newton", """
                1) Principe d'inertie : dans un référentiel galiléen, si la somme des forces qui s'exercent sur un objet est nulle, son mouvement est rectiligne uniforme (ou l'objet reste au repos).
                2) Relation fondamentale de la dynamique : ΣF = m · a, avec F en newtons (N), m en kilogrammes (kg) et a en m/s².
                3) Principe des actions réciproques : si un objet A exerce une force sur un objet B, alors B exerce sur A une force de même valeur, de même direction et de sens opposé.

                Exemple : une voiture de 1 200 kg accélère à 2 m/s². La force résultante vaut F = 1 200 × 2 = 2 400 N.""");

        cours(physique, 2, "Loi d'Ohm et associations de résistances", """
                Pour un conducteur ohmique, la tension U (en volts) est proportionnelle à l'intensité I (en ampères) : U = R · I, où R est la résistance en ohms (Ω).

                En série, l'intensité est la même dans tous les dipôles et les résistances s'additionnent : R = R₁ + R₂.
                En dérivation (parallèle), la tension est la même aux bornes de chaque branche et 1/R = 1/R₁ + 1/R₂.

                Exemple : avec R₁ = 100 Ω et R₂ = 150 Ω, la résistance équivalente vaut 250 Ω en série et 60 Ω en parallèle.
                Sous 5 V, en série, l'intensité est I = 5 / 250 = 0,02 A, soit 20 mA.""");

        cours(physique, 3, "La quantité de matière (la mole)", """
                La quantité de matière n se mesure en moles (mol). Elle se calcule à partir de la masse m de l'échantillon (en g) et de la masse molaire M de l'espèce (en g/mol) : n = m / M.

                Le nombre d'entités vaut N = n · Nₐ, avec la constante d'Avogadro Nₐ ≈ 6,02 × 10²³ mol⁻¹.

                Exemple : la masse molaire de l'eau est M(H₂O) = 2 × 1 + 16 = 18 g/mol. Un échantillon de 90 g d'eau contient donc n = 90 / 18 = 5 mol de molécules.""");

        exercice(physique, 1, "Exercice 1 : chute libre", """
                Un objet est lâché sans vitesse initiale d'une hauteur de 20 m. En négligeant les frottements de l'air (g = 10 m/s²) :
                a) calculer la durée de la chute ;
                b) calculer la vitesse de l'objet à son arrivée au sol.""");

        exercice(physique, 2, "Exercice 2 : résistance et puissance", """
                Un conducteur ohmique de résistance R = 220 Ω est soumis à une tension U = 12 V.
                a) Calculer l'intensité du courant qui le traverse.
                b) Calculer la puissance qu'il dissipe (P = U · I).""");

        exercice(physique, 3, "Exercice 3 : quantité de matière", """
                Calculer la quantité de matière contenue dans 117 g de chlorure de sodium NaCl.
                Données : M(Na) = 23 g/mol ; M(Cl) = 35,5 g/mol.""");

        // ----- Informatique -----
        cours(info, 1, "Qu'est-ce qu'une base de données ?", """
                Une base de données organise des informations dans des tables, composées de lignes (les enregistrements) et de colonnes (les champs).
                Chaque table possède une clé primaire qui identifie chaque ligne de façon unique ; une clé étrangère permet de relier une table à une autre.

                Le langage SQL sert à interroger et à modifier les données : SELECT (lire), INSERT (ajouter), UPDATE (modifier), DELETE (supprimer).

                Exemple : SELECT nom, moyenne FROM eleves WHERE classe = 'Tle C' ORDER BY moyenne DESC;""");

        cours(info, 2, "Variables et conditions en Python", """
                Une variable associe un nom à une valeur : age = 17. Python reconnaît automatiquement le type (entier, décimal, texte...).

                Une condition permet d'exécuter du code selon un test. L'indentation (4 espaces) délimite le bloc :

                note = 12
                if note >= 10:
                    print('Admis')
                else:
                    print('Ajourné')

                Opérateurs de comparaison : ==, !=, <, <=, >, >=. On les combine avec and, or et not.""");

        cours(info, 3, "Les boucles et les listes en Python", """
                Une liste regroupe plusieurs valeurs : notes = [12, 15, 9, 14].

                La boucle for parcourt les éléments de la liste :

                total = 0
                for note in notes:
                    total = total + note
                print(total / len(notes))

                Ce programme affiche la moyenne des notes : 12.5.
                La fonction range(5) permet de répéter une action 5 fois, avec i valant successivement 0, 1, 2, 3 et 4.
                La boucle while répète un bloc tant qu'une condition reste vraie.""");

        exercice(info, 1, "Exercice 1 : majeur ou mineur", """
                Écrire un programme Python qui demande son âge à l'utilisateur, puis affiche « Majeur » s'il a 18 ans ou plus, et « Mineur » sinon.""");

        exercice(info, 2, "Exercice 2 : requêtes SQL", """
                On dispose de la table eleves(id, nom, classe, moyenne). Écrire les requêtes SQL permettant de :
                a) afficher tous les élèves de la classe 'Tle C' ;
                b) afficher les 3 élèves ayant la meilleure moyenne ;
                c) calculer la moyenne générale de la classe 'Tle C'.""");

        // ----- Français -----
        cours(francais, 1, "Le commentaire composé : méthode", """
                Le commentaire composé analyse un texte littéraire en suivant un plan organisé en axes de lecture.

                1) L'introduction : une amorce, la présentation du texte (auteur, époque, genre), la problématique, puis l'annonce du plan.
                2) Le développement : deux ou trois axes, chacun divisé en paragraphes. Dans chaque paragraphe, on avance une idée, on l'illustre par une citation précise et on analyse un procédé d'écriture (figure de style, champ lexical, rythme, point de vue...).
                3) La conclusion : un bilan qui répond à la problématique, puis une ouverture vers une autre œuvre ou un autre courant.

                Conseil : ne jamais paraphraser le texte. Chaque citation doit être suivie d'une explication de son effet sur le lecteur.""");

        cours(francais, 2, "L'accord du participe passé", """
                Employé avec l'auxiliaire être, le participe passé s'accorde avec le sujet : « Elles sont parties tôt. »

                Employé avec l'auxiliaire avoir, il s'accorde avec le COD seulement si celui-ci est placé avant le verbe : « Les fleurs que j'ai cueillies sont magnifiques. »
                Si le COD est placé après le verbe, ou s'il n'y en a pas, le participe reste invariable : « J'ai mangé une pomme. »""");

        exercice(francais, 1, "Exercice 1 : accorder les participes passés", """
                Accorder correctement les participes passés entre parenthèses :
                a) Les lettres que j'ai (écrire) hier sont (arriver) ce matin.
                b) Les chansons qu'elle a (chanter) ont été (applaudir) par toute la salle.""");

        // ================= FORUMS =================
        Groupe forumMaths = groupeService.findById(maths.groupeId());
        Groupe forumPhysique = groupeService.findById(physique.groupeId());
        Groupe forumInfo = groupeService.findById(info.groupeId());
        Groupe forumFrancais = groupeService.findById(francais.groupeId());

        // --- Mathématiques ---
        Publication p1 = publier(aminata, forumMaths, "Comment trouver le discriminant ?",
                "Bonjour, je n'arrive pas à calculer Δ pour l'équation 2x² − 3x − 5 = 0. "
                        + "Je trouve toujours un résultat négatif alors que l'exercice dit qu'il y a des solutions. "
                        + "Qu'est-ce que je fais de travers ?");
        repondre(p1, brice, "Fais attention au signe de c : ici c = −5. Moi aussi je me suis trompé là-dessus la semaine dernière.");
        resoudre(p1, profMaths, "Ici a = 2, b = −3 et c = −5. Donc Δ = (−3)² − 4 × 2 × (−5) = 9 + 40 = 49. "
                + "L'erreur classique est d'oublier que −4ac devient positif quand c est négatif. "
                + "Comme Δ > 0, il y a deux solutions : x₁ = (3 − 7) / 4 = −1 et x₂ = (3 + 7) / 4 = 5/2.", admin);

        Publication p2 = publier(ibrahim, forumMaths, "Résoudre x² − 5x + 6 = 0 sans le discriminant ?",
                "En cours, la professeure a dit qu'on pouvait parfois résoudre une équation du second degré sans calculer Δ. "
                        + "Je ne vois pas comment faire sur x² − 5x + 6 = 0. Quelqu'un a une astuce ?");
        proposerSolution(p2, aminata, "Oui ! Cherche deux nombres dont la somme vaut 5 et le produit vaut 6 : ce sont 2 et 3. "
                + "Donc x² − 5x + 6 = (x − 2)(x − 3) et les solutions sont 2 et 3.");

        Publication p3 = publier(sandrine, forumMaths, "Quelle différence entre dérivée et primitive ?",
                "Je confonds les deux notions depuis le dernier chapitre. Quelqu'un peut m'expliquer simplement ?");
        repondre(p3, yannick, "La primitive, c'est l'opération inverse de la dérivation : si F' = f, alors F est une primitive de f. "
                + "Par exemple, x² est une primitive de 2x, puisque la dérivée de x² est 2x.");

        publier(clarisse, forumMaths, "À quoi servent les suites géométriques dans la vie courante ?",
                "Je comprends la formule uₙ = u₀ · qⁿ, mais je ne vois pas où on s'en sert en pratique. "
                        + "Est-ce que quelqu'un a un exemple concret (argent, population...) ?");

        // --- Physique-Chimie ---
        Publication q1 = publier(yannick, forumPhysique, "Durée de chute libre : je suis bloqué",
                "Dans l'exercice 1 (objet lâché de 20 m), j'ai essayé d'utiliser v = g × t mais on ne me donne pas la vitesse. "
                        + "Comment trouver la durée de la chute ?");
        resoudre(q1, profPhysique, "Utilise plutôt la hauteur : h = ½ · g · t². Ici 20 = 5 · t², donc t² = 4 et t = 2 s. "
                + "Tu peux ensuite en déduire la vitesse à l'arrivée : v = g · t = 10 × 2 = 20 m/s.", profPhysique);

        Publication q2 = publier(fatou, forumPhysique, "Quelle est la différence entre masse et poids ?",
                "Dans mon cahier j'ai écrit que la masse de mon sac est de 8 kg, et mon voisin dit que c'est son poids. Qui a raison ?");
        resoudre(q2, profPhysique, "Tu as raison : 8 kg est une masse, qui mesure la quantité de matière et ne change pas d'un endroit à l'autre. "
                + "Le poids est une force, exprimée en newtons : P = m × g. Avec g ≈ 9,8 N/kg sur Terre, ton sac pèse environ 78 N. "
                + "Sur la Lune (g ≈ 1,6 N/kg), sa masse serait toujours de 8 kg mais son poids serait d'environ 13 N.", profPhysique);

        Publication q3 = publier(brice, forumPhysique, "Résistance équivalente en parallèle",
                "Si je branche une résistance de 100 Ω et une de 150 Ω en parallèle, quelle est la résistance équivalente ? "
                        + "Est-ce que je dois simplement les additionner comme en série ?");
        repondre(q3, ibrahim, "Non, l'addition c'est seulement pour le montage en série. "
                + "En parallèle je crois qu'il faut utiliser 1/R = 1/R₁ + 1/R₂, mais je ne suis plus sûr du calcul.");

        // --- Informatique ---
        Publication r1 = publier(brice, forumInfo, "IndentationError en Python",
                "Mon programme affiche « IndentationError: expected an indented block » à la ligne du print, "
                        + "alors que j'ai bien écrit mon code comme dans le cours. Qu'est-ce qui ne va pas ?");
        resoudre(r1, profInfo, "En Python, l'indentation fait partie de la syntaxe. Après une ligne qui se termine par « : » "
                + "(if, for, while, def), la ligne suivante doit être décalée, en général de 4 espaces. "
                + "Vérifie aussi que tu n'as pas mélangé tabulations et espaces dans le même fichier : "
                + "c'est une autre cause fréquente de cette erreur.", profInfo);

        Publication r2 = publier(sandrine, forumInfo, "Clé primaire ou clé étrangère ?",
                "Je confonds les deux notions dans le cours sur les bases de données. "
                        + "Quelqu'un peut m'expliquer la différence avec un exemple simple ?");
        repondre(r2, aminata, "La clé primaire identifie une ligne de façon unique dans sa table (par exemple l'identifiant d'un élève). "
                + "La clé étrangère est une colonne qui reprend la clé primaire d'une autre table pour créer un lien : "
                + "par exemple, une table notes contient l'identifiant de l'élève concerné.");

        publier(ibrahim, forumInfo, "Python ou Java pour débuter ?",
                "Je voudrais me lancer dans la programmation pendant les vacances. "
                        + "Vous me conseillez de commencer par Python ou par Java ? Mon objectif est de créer plus tard des applications web.");

        // --- Français ---
        Publication f1 = publier(clarisse, forumFrancais, "Accord du participe passé avec avoir",
                "Pourquoi écrit-on « les fleurs que j'ai cueillies » avec un e et un s, "
                        + "alors que dans « j'ai mangé une pomme » le participe ne change pas ?");
        resoudre(f1, profFrancais, "Avec l'auxiliaire avoir, le participe passé s'accorde avec le COD seulement si celui-ci est placé avant le verbe. "
                + "Dans « les fleurs que j'ai cueillies », le COD est « que » (qui reprend « les fleurs », féminin pluriel) "
                + "et il est placé avant : on écrit donc cueillies. "
                + "Dans « j'ai mangé une pomme », le COD vient après le verbe : le participe reste invariable.", profFrancais);

        publier(yannick, forumFrancais, "Comment formuler une problématique ?",
                "Pour le commentaire composé du poème étudié en classe, je n'arrive pas à écrire ma problématique. "
                        + "Est-ce qu'elle doit obligatoirement être une question ? Et comment passer de mon idée générale à une vraie problématique ?");

        log.info("Jeu de données de démonstration créé : 12 utilisateurs, 4 matières, 12 questions de forum");
    }

    // ================= OUTILS =================

    private Users creerUtilisateur(String email, String nom, TypeRoleUser statut) {
        Users u = new Users();
        u.setEmail(email);
        u.setName(nom);
        u.setStatut(statut);
        u.setPassword(encoder.encode(demoPassword));
        u.setEmailVerifie(true); // pas de code d'activation à saisir
        return usersRepository.save(u);
    }

    private void cours(MatiereDTO matiere, int ordre, String titre, String contenu) {
        matiereService.ajouterCours(matiere.id(), titre, TypeContenu.TEXTE, contenu, null, ordre);
    }

    private void exercice(MatiereDTO matiere, int ordre, String titre, String contenu) {
        matiereService.ajouterExercice(matiere.id(), titre, TypeContenu.TEXTE, contenu, null, ordre);
    }

    private Publication publier(Users auteur, Groupe groupe, String titre, String contenu) {
        Publication p = new Publication();
        p.setTitre(titre);
        p.setContent(contenu);
        p.setSender(auteur);
        p.setGroupe(groupe);
        p.setStatut(STATUT_NON_RESOLUE);
        return publicationRepository.save(p);
    }

    /** Réponse ordinaire, sans être proposée comme solution. */
    private void repondre(Publication publication, Users auteur, String contenu) {
        reponseRepository.save(nouvelleReponse(publication, auteur, contenu));
    }

    /** Réponse proposée comme solution, en attente de validation : la question reste non résolue. */
    private void proposerSolution(Publication publication, Users auteur, String contenu) {
        Reponse r = nouvelleReponse(publication, auteur, contenu);
        r.setEstSolutionProposee(true);
        reponseRepository.save(r);
    }

    /** Solution validée : la question passe à l'état résolu. */
    private void resoudre(Publication publication, Users auteur, String contenu, Users validateur) {
        Reponse r = nouvelleReponse(publication, auteur, contenu);
        r.setEstSolutionProposee(true);
        r.setValideeParUserId(validateur.getId());
        r.setDateValidation(LocalDateTime.now());
        reponseRepository.save(r);

        publication.setStatut(STATUT_RESOLUE);
        publicationRepository.save(publication);
    }

    private Reponse nouvelleReponse(Publication publication, Users auteur, String contenu) {
        Reponse r = new Reponse();
        r.setContent(contenu);
        r.setSender(auteur);
        r.setPublication(publication);
        return r;
    }
}