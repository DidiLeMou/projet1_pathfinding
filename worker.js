/*Projet 1: Rachelle Passuello-Dussault et Isabelle Deslandes
21 février 2018 */


////////////////////////////////////////////////////////////////////////////////
//                             functions                                      //
////////////////////////////////////////////////////////////////////////////////

/**
 * Genere un nombre aleatoire et le retourne
 * @returns {Number} nombre aleatoire
 */
function nombreAleatoire() {
    var nbreAleatoire = Math.random();
    return nbreAleatoire;
}

/**
 * Initialise une grille de jeu avec une longueur et hauteur donnee
 * puis la retourne
 * @param {Number} L Longueur de la grille
 * @param {Number} H Hauteur de la grille
 * @returns {Array} grilleJeu
 */
function InitialiserGrille(L, H) {
    var grilleJeu = new Array(H);
    const tmpFill = '-'; // tampon pour remplir l'array: allouer et remplir l'espace
    for (var i = 0; i < H; i++) {
        grilleJeu[i] = new Array(L);
        for (var j = 0; j < L; j++) {
            grilleJeu[i][j] = "-";
        }
    }
    return grilleJeu;
}

/**
 * Dessine une grille avec l'affichage graphique codeBoot
 * @param {Array} grille grille a dessiner
 * @returns {void}
 */
function dessinerGrille(grille) {
    var grilleCodeboot = setScreenMode(L, H);
    for (var i = 0; i < grille.length; i++) {
        for (var j = 0; j < grille[i].length; j++) {
            setPixel(j, i, COULEUR.tuile);
            if (grille[i][j] === 'm') {
              setPixel(j, i, COULEUR.mur);
            }
            else if (grille[i][j] === 'p') {
              setPixel(j, i, COULEUR.princesse);
            }
            else if (grille[i][j] === 'c') {
              setPixel(j, i, COULEUR.chevalier);
            }
            else if (grille[i][j] === 'x') { // caractere invente pour le chemin
              setPixel(j, i, COULEUR.chemin);
            }
            else if (grille[i][j] === 'n') { // net for never going back (a*)
              setPixel(j, i, COULEUR.tuile); // invisible to user
            }
        }
    }
}

/**
 * Ajoute les murs a la grille
 * @param {Array} grille grille qui doit avoir des murs
 * @param {Number} D possibilite d avoir un mur
 * @returns {Array} grille avec les murs
 */
function ajouterMurs(grille, D) {
    var prob = nombreAleatoire(); //Générer un nombre aleatoire
    for (var i = 0; i < grille.length; i++) {
        for (var j = 0; j < grille[i].length; j++) {
            var prob = nombreAleatoire(); //Générer un nombre aleatoire
            if (prob < D) {
                grille[i][j] = 'm';
            }
        }
    }
    return grille;
}

/**
 * Trace la grille
 * @param {Array} grille grille qui doit avoir des murs
 * @returns {void}
 */
function tracerGrilleJeu(grille) {
    for (var i = 0; i < H; i++) {
        print(grille[i] + ',');
    }
}

/**
 * Trouve les tuiles libres dans une grille
 * @param {Array} grille grille qui a des tuiles libres
 * @returns {Array} liste des coordonnees libres
 */
function trouverTuileLibre(grille) {
    var coordonnees = [];
    for (var i = 0; i < grille.length; i++) {
        for (var j = 0; j < grille[i].length; j++) {
            if (grille[i][j] === "-") {
                var emplTuileLibre = [];
                emplTuileLibre.push(i);
                emplTuileLibre.push(j);
                coordonnees.push(emplTuileLibre); /*Quand je vais acceder a element[0],
                j'accede a i, quand je vais acceder a element[1], je vais acceder a j. */
            }
        }
    }
    return coordonnees;
}

/**
 * Trouve les tuiles prises dans une grille
 * @param {Array} grille grille qui a des tuiles prises
 * @returns {Array} liste des coordonnees prises y,x
 */
function trouverTuilesPrises(grille) {
    var coordonnees = [];
    for (var i = 0; i < grille.length; i++) {
        for (var j = 0; j < grille[i].length; j++) {
            if (grille[i][j] === "m") {
                var emplTuilePrise = [];
                emplTuilePrise.push(i);
                emplTuilePrise.push(j);
                coordonnees.push(emplTuilePrise); /*Quand je vais acceder a element[0],
                j'accede a i, quand je vais acceder a element[1], je vais acceder a j. */
            }
        }
    }
    return coordonnees;
}

/**
 * Retourne un se de coordonnees libres random
 * @param {Array} grille grille qui comprend les sets libres
 * @returns {Array} set de coordonnees libres
 */
var findFreeCoor = function (grille) {
    var freeCoor = trouverTuileLibre(grille);
    var valRandom = Math.floor(Math.random() * freeCoor.length); // val random entre 0 et freeCoor.length
    return freeCoor[valRandom];// return freeCoor[tonRandom];
    // ça va te return un array de 2 coordonness de la forme [x,y]
    // tu vas utiliser ce return pour placer ton perso
};

/**
 * Ajoute les personnages dans une grille
 * @param {Array} grille grille quiva avoir les persos
 * @returns {Array} grille avec les personnages
 */
function ajouterPersonnages(grille) {
    var coorPrincesse = findFreeCoor(grille);
    var princesseJ = coorPrincesse[1];
    var princesseI = coorPrincesse[0];
    grille[princesseI][princesseJ] = 'p';

    var coorChevalier = findFreeCoor(grille);
    var chevalierJ = coorChevalier[1];
    var chevalierI = coorChevalier[0];
    grille[chevalierI][chevalierJ] = "c";

    return grille;
}

/**
 * Trouve la position initiale en x du chemin
 * @param {Array} grille grille
 * @returns {Number} position initiale en x
 */
function trouverPosiInitialeX(grille) {
  for (var i = 0; i < grille.length; i++) {
      for (var j = 0; j < grille[i].length; j++) {
        if (grille[i][j] === 'c') {
          return j;
        }
      }
  }
  return null;
}

/**
 * Trouve la position initiale en y du chemin
 * @param {Array} grille grille
 * @returns {Number} position initiale en y
 */
function trouverPosiInitialeY(grille) {
  for (var i = 0; i < grille.length; i++) {
      for (var j = 0; j < grille[i].length; j++) {
        if (grille[i][j] === 'c') {
          return i;
        }
      }
  }
  return null;
}

/**
 * Trouve la position finale en x du chemin
 * @param {Array} grille grille de jeu
 * @return {Number} position finale en x
 */
function trouverPositionFinaleX(grille) {
    for (var i = 0; i < grille.length; i++) {
        for (var j = 0; j < grille[i].length; j++) {
            if (grille[i][j] === 'p') {
                return j;
            }
        }
    }
    return null;
}

function trouverPositionFinaleY(grille) {
    for (var i = 0; i < grille.length; i++) {
        for (var j = 0; j < grille[i].length; j++) {
            if (grille[i][j] === 'p') {
                return i;
            }
        }
    }
    return null;
}

/**
 * Retourne un array bool des voisins si libre (bas, haut, droite, gauche)
 * @param {Array} posActuelle vecteur y,x de la position actuelle
 * @param {Array} grille grille
 */
function getVoisins(posActuelle, grille) {
    var voisinsOks = [];

    //bas
    if (grille[posActuelle[0] + 1][posActuelle[1]] === undefined) {
        voisinsOks.push(false);
    } else {
        if (grille[posActuelle[0] + 1][posActuelle[1]] !== undefined && grille[posActuelle[0] + 1][posActuelle[1]] !== 'm') {
            voisinsOks.push(true); // on peut aller en bas
        }
        if (grille[posActuelle[0] + 1][posActuelle[1]] === undefined || grille[posActuelle[0] + 1][posActuelle[1]] === 'm') {
            voisinsOks.push(false); // on peut pas aller en bas
        }
    }

    //haut
    if (grille[posActuelle[0] - 1][posActuelle[1]] === undefined) {
        voisinsOks.push(false);
    } else {

        if (grille[posActuelle[0] - 1][posActuelle[1]] !== undefined && grille[posActuelle[0] - 1][posActuelle[1]] !== 'm') {
            voisinsOks.push(true); // on peut aller en haut
        }

        if (grille[posActuelle[0] - 1][posActuelle[1]] === undefined || grille[posActuelle[0] - 1][posActuelle[1]] === 'm') {
            voisinsOks.push(false); // on peut pas aller en haut
        }
    }

    //droite
    if (grille[posActuelle[0]][posActuelle[1] + 1] === undefined) {
        voisinsOks.push(false);
    } else {
        if (grille[posActuelle[0]][posActuelle[1] + 1] !== undefined && grille[posActuelle[0]][posActuelle[1] + 1] !== 'm') {
            voisinsOks.push(true); // on peut aller a droite
        }

        if (grille[posActuelle[0]][posActuelle[1] + 1] === undefined || grille[posActuelle[0]][posActuelle[1] + 1] === 'm') {
            voisinsOks.push(false); // on peut pas aller a droite
        }
    }

    //gauche
    if (grille[posActuelle[0]][posActuelle[1] + 1] === undefined) {
        voisinsOks.push(false);
    } else {
        if (grille[posActuelle[0]][posActuelle[1] + 1] !== undefined && grille[posActuelle[0]][posActuelle[1] - 1] !== 'm') {
            voisinsOks.push(true); // on peut aller a gauche
        }

        if (grille[posActuelle[0]][posActuelle[1] - 1] === undefined || grille[posActuelle[0]][posActuelle[1] - 1] === 'm') {
            voisinsOks.push(false); // on peut pas aller a gauche
        }
    }

    return voisinsOks;
}

function manhattanX(xi, xf) {
    return Math.abs(xi - xf);
}

function getDeltaX(xi, xf) {
    return xi - xf; // si neg va a droite
}

function manhattanY(yi, yf) {
    return Math.abs(yi - yf);
}

////////////////////////////////////////////////////////////////////////////////
//                             grid setup                                     //
////////////////////////////////////////////////////////////////////////////////

var L; // Longueur de la grille
do {
    L = parseInt(prompt("Entrez la longueur de la grille"));
    if (L < 0 || isNaN(L)) {
        alert("Veuillez entrer une valeur numérique positive.");
    }
} while (L < 0 || isNaN(L));

var H; // Hauteur de la grille
do {
    H = parseInt(prompt("Entrez la hauteur de la grille"));
    if (H < 0 || isNaN(L)) {
        alert("Veuillez entrer une valeur positive.");
    }
} while (H < 0 || isNaN(L));

var D; // Probabilite mur
do {
    const D = parseFloat(prompt("Entrez probabilité d'avoir un mur (Nombre entre 0 et 1)"));
    if (D < 0 || isNaN(L)) {
        alert("Veuillez entrer une valeur positive.");
    }
} while (D < 0 || isNaN(L));


var COULEUR = {
    tuile: { r: 235, g: 235, b: 235 },
    princesse: { r: 197, g: 83, b: 218 },
    chevalier: { r: 213, g: 12, b: 12 },
    mur: { r: 133, g: 113, b: 94 },
    chemin: { r: 42, g: 255, b: 28 }
};

// La seule grille dont tu auras besoin
var grille = InitialiserGrille(L, H);

// ajout des murs a cette grille
grille = ajouterMurs(grille, D);

// Tu peux maintenant directement dessiner
// n'importe quelle grille en la passant par
// parametre a la fonction dessinerGrille
print("Grille initiale:");
dessinerGrille(grille);

// Tu peux maintenant directement tracer
// n'importe quelle grille en la passant para
// parametre a la fonction tracerGrille
tracerGrilleJeu(grille);

// ajout des personnages
grille = ajouterPersonnages(grille);

// afficher la grille avec les personnages
print("Grille avec personnages");
dessinerGrille(grille);

// tracer la grille avec les personnages
tracerGrilleJeu(grille);


////////////////////////////////////////////////////////////////////////////////
//                             Algorithm                                      //
////////////////////////////////////////////////////////////////////////////////

// TODO il faudra afficher grille a chaque etape de l'alogrithme pour montrer
var posx = trouverPosiInitialeX(grille);
var posy = trouverPosiInitialeY(grille);
var posi = [posy, posx];
const posfx = trouverPositionFinaleX(grille);
const posfy = trouverPositionFinaleY(grille);
const posf = [posfy, posfx];

var openSet = trouverTuileLibre(grille);
var closedSet = trouverTuilesPrises(grille);

print(getVoisins(posi, grille));

//rappel [y][x]
