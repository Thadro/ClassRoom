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




//Fonction 1: Autentification de l'utilisateur
$('form').on('submit', userConnexion);

function userConnexion(event)
{
    event.preventDefault();

    let pseudo = $('#sign-in-identifiant').val();
    let password = $('#sign-in-mdp').val();
    
    //Cas particulié pour l'administrateur puisque ses identifiants sont définits de base dans l'application
    if(pseudo == 'root' && password == 'root')
    {
        self.location.href = 'administrateur.html'
    }

    //On va chercher la liste des utilisateurs dans la base de donnée pour comparer avec les valeurs de l'utilisateur
    database.ref('user-list/').on('value', function(snapshot){
        snapshot.forEach(function(item){
            
            const user = item.val();

            //On redirige l'utilisateur vers sa page en fonction de son user_Type
            if(pseudo == user.pseudo && password == user.password)
            {
               if(user.user_Type == 'élève')
               {
                    let token = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                    let name = user.name;
                    let class_Selected = user.class;

                    let data = {
                        name: name,
                        class: class_Selected
                    }

                    localStorage.setItem('token', token);

                    database.ref('user-connected/' +token+ '/data').set(data);

                    self.location.href = 'élève.html';
               }

               if(user.user_Type == 'prof')
               {
                   let token = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                   let name = user.name;
                   let class_Selected = user.class;

                   let data = {
                       name: name,
                       class: class_Selected
                   }

                   localStorage.setItem('token', token);

                    database.ref('user-connected/' +token+ '/data').set(data);

                    self.location.href = 'formateur.html';
               }

            }
        })
    })
}

//Js complémentaire: mise en forme boutton

$(document).ready(function(){

    $('#sign-in-to-chat').mouseenter(function(){
        $('#sign-in-to-chat > p').css({
            'color' : '#eb2a5c',
            transitionDuration: '0.5s'
        })
    })

    $('#sign-in-to-chat').mouseleave(function(){
        $('#sign-in-to-chat > p').css({
            'color' : '#F7F7F2',
            transitionDuration: '0.5s'
        })
    })
})