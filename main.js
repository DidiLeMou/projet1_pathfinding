/*Projet 1: Rachelle Passuello-Dussault et Isabelle Deslandes
21 février 2018 */

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
 * Dessine la grille avec l'affichage graphique dans codeBoot
 * @param {any} L Longueur de la grille a dessiner
 * @param {any} H Hauteur de la grille a dessiner
 */
function dessinerGrille(L, H) {
    var grilleCodeboot = setScreenMode(L, H);
    for (var i = 0; i < H; i++) {
        for (var j = 0; j < L; j++) {
            setPixel(j, i, COULEUR.tuile);
        }
    }
}

/**
 * Genere un nombre aleatoire et le retourne
 * @returns {Number} nombre aleatoire
 */
function nombreAleatoire() {
    var nbreAleatoire = Math.random();
    return nbreAleatoire;
}

/**
 * Ajoute les murs a la grille
 * @param {any} L
 * @param {any} H
 * @param {any} D
 */
function ajouterMurs(L, H, D) {
    dessinerGrille(L, H);
    var maGrille = InitialiserGrille(L, H);
    var densiteMur;
    var prob = nombreAleatoire(); //Générer un nombre aleatoire
    for (var i = 0; i < H; i++) {
        for (var j = 0; j < L; j++) {
            var prob = nombreAleatoire(); //Générer un nombre aleatoire
            if (prob < D) {
                setPixel(j, i, COULEUR.mur);
                maGrille[i][j] = "m";
                densiteMur = 1;
            }
            else { densiteMur = 0; }
        }
    }
    return maGrille;
}

var maVraieGrille = ajouterMurs(L, H, D);


function tracerGrilleJeu(H) {

    for (var i = 0; i < H; i++) {
        print(maVraieGrille[i] + ',');
    }


}

//tracerGrilleJeu(H);


function trouverTuileLibre(L, H) {

    var coordonnees = [];

    var tuileLibre;
    for (i = 0; i < L; i++) {
        for (j = 0; j < H; j++) {

            if (maVraieGrille[i][j] === "-") {
                var emplTuileLibre = [];
                tuileLibre = true;
                emplTuileLibre.push(i);
                emplTuileLibre.push(j);
                coordonnees.push(emplTuileLibre); /*Quand je vais acceder a element[0],
                j'accede a i, quand je vais acceder a element[1], je vais acceder a j. */
            }
        }
    }

    return coordonnees;
}

var findFreeCoor = function (L, H) {
    var freeCoor = trouverTuileLibre(L, H);
    var valRandom = Math.floor(Math.random() * freeCoor.length); // val random entre 0 et freeCoor.length
    return freeCoor[valRandom];// return freeCoor[tonRandom];
    // ça va te return un array de 2 coordonness de la forme [x,y]
    // tu vas utiliser ce return pour placer ton perso
};

var chevalier = null;
var princesse = null;

function ajouterPersonnages(L, H) {

    var coorPrincesse = findFreeCoor(L, H);
    var princesseJ = coorPrincesse[1];
    var princesseI = coorPrincesse[0];
    maVraieGrille[princesseI][princesseJ] = "p";
    setPixel(princesseJ, princesseI, COULEUR.princesse);

    var coorChevalier = findFreeCoor(L, H);
    var chevalierJ = coorChevalier[1];
    var chevalierI = coorChevalier[0];
    maVraieGrille[chevalierI][chevalierJ] = "c";
    setPixel(chevalierJ, chevalierI, COULEUR.chevalier);


}

ajouterPersonnages(L, H);
tracerGrilleJeu(H);

/* openSet: Points qui n'ont pas encore été étudiés. Fin lorsque openSet est VIDE
(sauf si princesse trouvée avant)
closedSet: Points qui ont déjà été étudiés

Références utilisées:
GRINSTEAD, Brian. A* search algorithm in javascript. [briangrinstead.com/blog/astar-search-algorithm-in-javascript/]
pseudocode A* algorithm, wikipedia.
The Coding Train. Coding challenge 51.1 and 51.2, [https://www.youtube.com/] */

var astar = {

    init: function (grid) {
        for (var x = 0; x < grid.length; x++) {
            for (var y = 0; y < grid[x].length; y++) {
                grid[x][y].f = 0;
                grid[x][y].g = 0;
                grid[x][y].h = 0;
                //grid[x][y].debug = "";
                grid[x][y].parent = null;
                grid[x][y].precedent = undefined;
                grid[x][y].mur = false;

                if (grid[x][y] === "m") {
                    grid[x][y].mur = true;
                }
            }
        }
    },

    formuleRecherche: function (grid, debut, fin) {
        astar.init(grid);

        var openSet = [];
        var closedSet = [];
        var debut = [chevalierI][chevalierJ];
        var fin = [princesseI][princesseJ];
        var chemin = [];
        var aucuneSolution = false;

        openSet.push(debut);

        while (openSet.length > 0) {//Tant que openSet n'ets pas vide

            var plusPetit = 0; //Sauvegarder le cout le plus bas.
            for (var i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[plusPetit].f) {
                    plusPetit = i;
                }

            }
            var noeudActuel = openSet[plusPetit];

            if (!aucuneSolution) {
                if (noeudActuel === fin) {
                    //Si le noeud actuel est la princesse, fin.
                    var essai = noeudActuel;
                    var chemin = [];
                    chemin.push(essai);
                    while (chemin.parent) {
                        chemin.push(essai);
                        curr = curr.parent;
                    }
                    alert("La princesse est sauvée!");
                    //return //chemin vert;//TODO: Retourner chemin tracé.
                }
            }


            retirerDeLaListeOuverte(openSet, noeudActuel); //Il faut enlever le noeud actuel de la luste ouverte.
            closedSet.push(noeudActuel); //Une fois évalué, le noeud va dans le closedSet.

            //var voisins = astar.voisins(maVraieGrille);
            var voisins = noeudActuel.voisins; //Pour chaque voisin du noeud actuel
            for (var i = 0; i < voisins.length; i++) {
                var voisin = voisins[i];

                if (!closedSet.includes(voisin) && !voisin.mur) {//Si le voisin n'est pas fermé ou un mur
                    var essaiG = noeudActuel.g + 1;//Cout déplacement = 1.

                    if (openSet.includes(voisin)) {
                        if (essaiG < voisin.g) {
                            voisin.g = essaiG;//Si essaiG plus economique que voisin, il devient prioritaire.
                        }
                    } else {
                        voisin.g = essaiG;
                        openSet.push(voisin);//Sauvegarder voisin dans openSet.
                    }
                    voisin.h = astar.manhattan(voisin, fin);//Distance (heuristique) estimée entre le noeud et la fin.
                    voisin.g = voisin.h + voisin.f;
                    voisin.precedent = noeudActuel;
                }
            }
            for (var i = 0; i < chemin.lenght; i++) {
                chemin[i](color(COULEUR.chemin));
            }
            if (openSet.length = 0) {
                alert("La princesse ne peut pas être sauvée!");
                aucuneSolution = true;
            }
        }

    },

    /*function formuleRecherche(i,j){
        this.x=i;
        this.y=j;
        this.f=0;
        this.h=0;
        this.g=0;
        this.voisins = [];
        this.precedent = undefined;
        this.mur = false;
    
    
        if(maVraieGrille[i][j] === "m"){
          this.mur = true;
        }*/
    retirerDeLaListeOuverte: function (set, noeud) {

        for (var index = set.length - 1; index <= 0; index--) {
            if (set[index] == noeud) {
                set.splice(index, 1);//Retirer le noeud actuel de la liste ouverte.
            }
        }
    },

    manhattan: function (coor1, coor2) {//Pour estimer heuristique.

        var dx = Math.abs(coor2.i - coor1.i);
        var dy = Math.abs(coor2.j - coor1.j);
        var resultat = dx + dy;

        return resultat;
    },

    voisins: function (grid) {
        var i = this.i;//i refere au nombre de lignes(H)
        var j = this.j;//j refere au nombre de colonnes (L)
        //Cas limites (coins)
        if (i < H - 1) {
            this.voisins.push(grille[i + 1][j]);
        }
        if (i > 0) {
            this.voisins.push(grille[i - 1][j]);
        }
        if (j < L - 1) {
            this.voisins.push(grille[i][j + 1]);
        }
        if (j > 0) {
            this.voisins.push(grille[i][j - 1]);
        }

    }
};

astar.formuleRecherche(maVraieGrille, maVraieGrille[chevalierI][chevalierJ], maVraieGrille[princesseI][princesseJ]);
