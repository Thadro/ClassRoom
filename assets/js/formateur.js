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


//Partie 1: Initialisation des données
// Initialisation Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

let token = localStorage.getItem('token');


//Affichage du pseudo et récupération de la classe
database.ref('user-connected/' +token).on('value', function(snapshot){

    $('#profil-name').empty();

    snapshot.forEach(function(item){
        user = item.val();

        $('#profil-name').text(user.pseudo);
        localStorage.setItem('class', user.class);
    })
});




//Partie 2: Gestion du tableau des élèves
let class_Selected = localStorage.getItem('class');

//Affichage du tableau des élèves
database.ref('class/' +class_Selected+ '/student-list').on('value', function(snapshot) {
    
    $('#student').empty();

    let content = '';

        snapshot.forEach(function(item) {

            const user = item.val();

            content += `<tr>
                            <td>${user.name}</td>
                            <td>${user.tel}</td>
                            <td>${user.sexe}</td>
                            <td>
                                <form class="report-form">
                                    <input type="hidden" value=${user.user_Id}  />
                                    <input type="hidden" value=${user.name} />

                                    <select class="date-select-bar">

                                    </select>

                                    <div class="radio-container">
                                        <input type="radio" name="report" value="late" id="late"    /><label for="late">Retard</label>
                                        <input type="radio" name="report" value="absent" id="absent" /><label for="absent">Absence</label>
                                    </div>
                                    <button type="submit">Enregistrer</button>
                                </form>
                            </td>
                        </tr>`;
        });

    $('#student').append(content);

    //Gestionnaire d'évenement pour le systeme d'abscence et retard.
    //On ajoute un id au formulaire lors du click pour pouvoir le cibler en Jquery.
    setTimeout(() => {
        showDate();

        $('.report-form').click(function(){
            $(this).attr('id', 'report-form-target');
            setTimeout(() => $('#report-form-target').on('submit', onReportStudent), 500);
        });

    }, 500);
})


/*Fonction 1: Permet d'inscrire les dates dans la select-bar du formulaire (ceci permet de signaler 
les abscences ou retards uniquement sur les cours ayant étè défini au préalable)*/
function showDate()
{
    database.ref('classroom/' +class_Selected).on('value', function(snapshot){

        $('.date-select-bar').empty();
    
        let content = '';
    
        snapshot.forEach(function(item){
    
            const classroom = item.val();
    
            option_Value = classroom.date+ '-' +classroom.hour;
    
            content += `<option value=${option_Value}>${classroom.date}</option>`;
        });
    
        $('.date-select-bar').append(content);
    })
}


//Fonction 2: Permet d'enregistrer les abscences et retard d'un élève dans la base de données
function onReportStudent(event)
{
    event.preventDefault();

    let report_Id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    let student_Selected = $("#report-form-target > input[type='hidden']:nth-child(1)").val();
    let student_name = $("#report-form-target > input[type='hidden']:nth-child(2)").val();
    let date = $('#report-form-target > select').val();
    let report_Type = $("#report-form-target > .radio-container > input[name='report']:checked").val();

    let data_Class = {
        student_Name: student_name,
        date: date,
        student_Id: student_Selected,
    }

    let data_Student = {
        date: date
    }

    if(report_Type == 'late')
    {
        database.ref('class/' +class_Selected+ '/report-list/retard/' +report_Id).set(data_Class);
        database.ref('class/' +class_Selected+ '/student-list/' +student_Selected+ '/report-list/retard/' +report_Id).set(data_Student);
    }

    else if(report_Type == "absent")
    {
        database.ref('class/' +class_Selected+ '/report-list/absence/' +report_Id).set(data_Class);
        database.ref('class/' +class_Selected+ '/student-list/' +student_Selected+ '/report-list/absence/' +report_Id).set(data_Student);
    }

    $('#report-form-target').removeAttr('id'); 
}




//Partie 3: Gestion du planning
//Affichage des cours en fonction de la classe du formateur
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




//Partie 4: Gestion du tableau des absence et retard
database.ref('class/' +class_Selected+ '/report-list/absence').on('value', function(snapshot) {
    
    $('#student-absente').empty();

    let content = '';

        snapshot.forEach(function(item) {

            const user = item.val();

            content += `<tr>
                            <td><button id=${user.student_Id} class='delete-user-button'><i class="fas fa-times"></i></button>Absence</td>
                            <td>${user.student_Name}</td>
                            <td>${user.date}</td>
                        </tr>`;
        });

    $('#student-absente').append(content);

    //Gestionnaire d'évenement pour le systeme d'abscence et retard.
    //On ajoute un id au formulaire lors du click pour pouvoir le cibler en Jquery.
    setTimeout(() => {

    }, 500);
})

database.ref('class/' +class_Selected+ '/report-list/retard').on('value', function(snapshot) {
    
    $('#student-late').empty();

    let content = '';

        snapshot.forEach(function(item) {

            const user = item.val();

            content += `<tr>
                            <td><button id=${user.student_Id} class='delete-user-button'><i class="fas fa-times"></i></button>Retard</td>
                            <td>${user.student_Name}</td>
                            <td>${user.date}</td>
                        </tr>`;
        });

    $('#student-late').append(content);

    //Gestionnaire d'évenement pour le systeme d'abscence et retard.
    //On ajoute un id au formulaire lors du click pour pouvoir le cibler en Jquery.
    setTimeout(() => {
        //A développer: fonction permettant de supprimer les absences dans la base de données
    }, 500);
})




//Partie 5: Fonctions complémentaires: déconnexion, router, mise en forme...
//Deconnexion de l'utilisateur
$('#btn-logout').click(function(){
    database.ref('user-connected/' +token).set(null);
    localStorage.setItem('token', '');
    localStorage.setItem('class', '');
    self.location.href = 'index.html';
})


//Gestion du router
//Affichage tableau des élèves
$('#classroom-section-title').click(function(){
    $('#classroom-section-title').css("height", "50px");
    $('#planning-section-title').css("height", "35px");
    $('#report-section-title').css("height", "35px");

    $('#classroom-section').css("display", "block");
    $('#planning-section').css("display", "none");
    $('#report-section').css("display", "none");
})

//Affichage tableau planning
$('#planning-section-title').click(function(){
    $('#classroom-section-title').css("height", "35px");
    $('#planning-section-title').css("height", "50px");
    $('#report-section-title').css("height", "35px");

    $('#classroom-section').css("display", "none");
    $('#planning-section').css("display", "block");
    $('#report-section').css("display", "none");
})

//Affichage tableau abscence et retard
$('#report-section-title').click(function(){
    $('#classroom-section-title').css("height", "35px");
    $('#planning-section-title').css("height", "35px");
    $('#report-section-title').css("height", "50px");

    $('#classroom-section').css("display", "none");
    $('#planning-section').css("display", "none");
    $('#report-section').css("display", "block");
})


//Coloration bouton
$('#btn-logout').mouseenter(function(){
    $('#btn-logout > a').css({
        'color' : '#eb2a5c',
        transitionDuration: '0.5s'
    })
})

$('#btn-logout').mouseleave(function(){
    $('#btn-logout > a').css({
        'color' : '#F7F7F2',
        transitionDuration: '0.5s'
    })
})