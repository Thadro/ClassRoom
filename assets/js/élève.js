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

//Affichage du pseudo et récupération de la classe
database.ref('user-connected/' +token).on('value', function(snapshot){

    $('#profil-name').empty();

    snapshot.forEach(function(item){
        user = item.val();

        $('#profil-name').text(user.pseudo);
        localStorage.setItem('class', user.class);
    })
});

let class_Selected = localStorage.getItem('class');

//Affichage du planning
database.ref('classroom/' +class_Selected).on('value', function(snapshot) {

    $('.tab-cell-hour').css('background-color', '#f1f1f1');
    $('.tab-cell-hour').empty()

    snapshot.forEach(function(item){

        const classroom = item.val();

        if(classroom.hour == "day")
        {
            $(`td[class*=${classroom.date}]`).css('background-color', '#e2e2e2');
            $(`td[class*=${classroom.date}]`).append(`
                <h4>${classroom.title}</h4>
                <h4>${classroom.teacher}</h4>
            `);
        }

        else
        {
            let table_Target = '.' +classroom.date+ '-' +classroom.hour;
        
            $(table_Target).css('background-color', '#e2e2e2');
            $(table_Target).append(`
                <h4>${classroom.title}</h4>
                <h4>${classroom.teacher}</h4>
            `);
        }
    });
})

//Affichage des abscence et retard
// database.ref('user-connected/' +token).on('value', function(snapshot){

// })

//Deconnexion de l'utilisateur
$('#btn-logout').click(function(){
    database.ref('user-connected/' +token).set(null);
    localStorage.setItem('token', '');
    localStorage.setItem('class', '');
    self.location.href = 'index.html';
})

$('#btn-logout').mouseenter(function(){
    $('#btn-logout > a').css({
        'color' : '#eb2a5c',
        transitionDuration: '0.8s'
    })
})

$('#btn-logout').mouseleave(function(){
    $('#btn-logout > a').css({
        'color' : '#F7F7F2',
        transitionDuration: '0.8s'
    })
})
