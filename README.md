# Projet crypto blockchain 

Le site est une plateforme d'enchère de NFT via une crypto perso (MRC).

L'API qui s'occupe des 'TokenURI' des NFTS est sur le git ici : 

https://github.com/Mirecos/WEB3---API

Au passage voila aussi un début de dashboard DUNE car je trouvais ca sympa :
https://dune.com/mirec/first-dashboard


## Nom : RECCHIA
## Prénom : Michel

## Installation 

- Tout d'abord, cloner le projet. Puis lancer a la racine du projet :
```
$ docker compose build
```
Puis
```
$ docker compose up
```

Verifier que le 'start.sh' dans '/Frontend' a bien 'LF' en caractère de fin de ligne si jamais il y a un bug en rapport avec ca. 

## Vidéos explicatives

IMPORTANT : Sur les vidéos on ne voit juste pas les interactions avec RabbyWallet ( Connexion / Signature de contrat). Mais on voit quand meme assez bien les fonctionnalités principales.

Il y a quelques vidéos dispos sur le pour présenter le projet.

La première '1_VisualisationStatutNFT' -> On y voit la visualisation des détails d'une NFT dans 3 cas différents :
- En étant non connecté
- En étant connecté
- En étant connecté en tant que le propriétaire de la NFT

La seconde '2_EnchereNFT' -> On y voit deux addresses différentes enchérir sur une NFT mise en enchère précèdemment.

