//Initialisation de l'application
// Configuration de firebase
var firebaseConfig = {
    apiKey: "AIzaSyCvIsah7MPvXALU1hiilY6pjzm7UNZi9zc",
    authDomain: "project-classroom-c1da1.firebaseapp.com",
    databaseURL: "https://project-classroom-c1da1.firebaseio.com",
    projectId: "project-classroom-c1da1",
    storageBucket: "project-classroom-c1da1.appspot.com",
    messagingSenderId: "613309391988",
    appId: "1:613309391988:web:87116cee59aff788fe5d21"
  };

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

let token = localStorage.getItem('token');
console.log(token);

//Affichage des information de l'utilisateur
database.ref('user-connected/' +token).on('value', function(snapshot){

    $('#profil-name').empty();

    snapshot.forEach(function(item){
        user = item.val();

        $('#profil-name').text(user.name);

        //A FAIRE AFFICHER LA CLASSE EN FONCTION DES INFOS UTILISATEURS (classe et planning)
    })
});

//Deconnexion de l'utilisateur
$('#btn-logout').click(function(){
    database.ref('user-connected/' +token).set(null);
    localStorage.setItem('token', '');
    self.location.href = 'index.html';
})

//Affichage tableau des élèves
$('#classroom-section-title').click(function(){
    $('#classroom-section-title').css("height", "50px");
    $('#planning-section-title').css("height", "35px");
    $('#classroom-section').css("display", "block");
    $('#planning-section').css("display", "none");
})

//Affichage tableau planning
$('#planning-section-title').click(function(){
    $('#classroom-section-title').css("height", "35px");
    $('#planning-section-title').css("height", "50px");
    $('#classroom-section').css("display", "none");
    $('#planning-section').css("display", "block");
})