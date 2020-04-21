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
                            <td>
                                <form class="report-form">
                                    <input type="hidden" value=${user.user_Id}  />
<<<<<<< HEAD
                                    <select class="date-select-bar">

=======
                                    <select class='date-select-bar'>
                                        <option value="23-04-2020">23/04/2020</option>
                                        <option value="24-04-2020">24/04/2020</option>
                                        <option value="25-04-2020">25/04/2020</option>
                                        <option value="26-04-2020">26/04/2020</option>
                                        <option value="27-04-2020">27/04/2020</option>
>>>>>>> bd636247a796ff49395b9f8266268a413768da51
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
        $('.report-form').click(function(){
            $(this).attr('id', 'report-form-target');
            setTimeout(() => $('#report-form-target').on('submit', onReportStudent), 500);
        });

    }, 500);
})

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

function onReportStudent(event)
{
    event.preventDefault();

    let report_Id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    let student_Selected = $("#report-form-target > input[type='hidden']").val();
    let date = $('#report-form-target > select').val();
    let report_Type = $("#report-form-target > .radio-container > input[name='report']:checked").val();

    let data = {
        date
    }

    if(report_Type == 'late')
    {
        database.ref('class/' +class_Selected+ '/student-list/' +student_Selected+ '/report-list/retard/' +report_Id).set(data);
    }

    else if(report_Type == "absent")
    {
        database.ref('class/' +class_Selected+ '/student-list/' +student_Selected+ '/report-list/absence/' +report_Id).set(data);
    }

    $('#report-form-target').removeAttr('id'); 
}

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