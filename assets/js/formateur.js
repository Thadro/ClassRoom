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

//Affichage du tableau des élèves
database.ref('class/' +class_Selected+ '/student-list').on('value', function(snapshot) {
    
    $('#student').empty();

    let content = '';

        snapshot.forEach(function(item) {

            const user = item.val();

            //Afin d'éviter que la boucle affiche 'undefined' en lisant l'entrée class_Name
            content += `<tr>
                            <td>${user.name}</td>
                            <td>${user.tel}</td>
                            <td>${user.sexe}</td>
                            <td><i class="fas fa-stopwatch"></i><i class="fas fa-times-circle"></i></td>
                        </tr>`;
        });

    $('#student').append(content);
})

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

//Deconnexion de l'utilisateur
$('#btn-logout').click(function(){
    database.ref('user-connected/' +token).set(null);
    localStorage.setItem('token', '');
    localStorage.setItem('class', '');
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