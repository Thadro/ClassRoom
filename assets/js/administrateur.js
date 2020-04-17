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

//Montrer la liste des classe
//PARTIE CLASSE

//Partie 1: Initialisation de l'interface: affichage des données
let class_Selected = "";

//Montrer la liste des classe
database.ref('class/').on('value', function(snapshot) 
{
    $('#dropdown-list').empty();
    $('#planning-dropdown-list').empty();

    let content = '';

    snapshot.forEach(function(item){
        const user = item.val();
        content += `<li>
                        <div class="list-item-container">
                            <div class="list-item-title">${user.class_Name}</div>
                            <div class="list-item-logo">
                                <button class="modif-class-button"><i class="fas fa-pencil-alt"></i></button>
                                <button class="delete-class-button" id=${user.class_Name}><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                    </li>`
    })

    $('#dropdown-list').append(content);
    $('#planning-dropdown-list').append(content);

   //Selection manuel de la classe (click sur le dropdown)
    setTimeout(() => {
        $('.list-item-title').click(function(){
            class_Selected = $(this).text();

            $('#class-title').empty();
            $('#class-title').append('<i class="fas fa-chalkboard-teacher"></i>' +class_Selected);

            showUser(class_Selected);
            showPlanning(class_Selected);
        });

        $('.delete-class-button').click(function(){
            $(this).attr('class', 'delete-class-button-target');
            onDeleteClass();
        })
    }, 500);
})


//Fonction 1: Permet de montrer les utilisateurs en fonction de la classe
function showUser(class_Selected)
{
    database.ref('class/' +class_Selected+ '/student-list').on('value', function(snapshot) {

        $('#users').empty();   
        
        let content = '';

        snapshot.forEach(function(item) {

            const user = item.val();

            //Afin d'éviter que la boucle affiche 'undefined' en lisant l'entrée class_Name
            content += `<tr>
                            <td>

                                    <button type="submit" id=${user.user_Id} class='delete-user-button'><i class="fas fa-times"></i></button>
                                    ${user.name}

                            </td>

                            <td>${user.tel}</td>
                            <td>${user.sexe}</td>

                            <td>
                                <form class="modif-form">
                                    <select>
                                        <option value="nom">Nom et prénom</option>
                                        <option value="tel">Telephone</option>
                                        <option value="sexe">Sexe</option>
                                    </select>
                                    <input type="text"  />
                                    <input type="hidden" value=${user.user_Id}   />
                                    <Button type="submit">Enregistrer</Button>
                                </form>
                            </td>
                        </tr>`;
        });

        $('#users').append(content);
        
        //Gestionnaire d'évenement pour la suppression et la modification.
        //On ajoute un id au formulaire lors du click pour pouvoir le cibler en Jquery
        setTimeout(() => {
            
            $('.delete-user-button').click(function(){
                $(this).attr('class', 'delete-user-button-target')
                onDeleteUser()
            })

            $('.modif-form').click(function(){
                $(this).attr('id', 'modif-form-target');
                setTimeout(() => $('#modif-form-target').on('submit', onModifUser), 500);
            });
  
        }, 500);
    })
}




//Gestion des information de classe, d'élève et de formateur

//Partie 2: Gestion des classes
//Fonction 2: Permet d'ajouter une nouvelle classe dans la base de donnée
$('#new-class-form').on('submit', onAddClass);

function onAddClass(event)
{
    event.preventDefault();
    $('#form-class-error').css('display', 'none');
    $('#form-class-error2').css('display', 'none');

    let new_Class = $('#class').val();

    if(new_Class == '')
    {
        $('#form-class-error').css('display', 'block');
        return
    }

    if(new_Class.indexOf(' ') != -1)
    {
        $('#form-class-error2').css('display', 'block');
        return
    }


    database.ref('class/' +new_Class).set({class_Name: new_Class});
}

//Fonction 3: Permet de supprimer une classe de la base de donnée
$('#delete-class').click(onDeleteClass);

function onDeleteClass()
{
    class_Target = $('.delete-class-button-target').attr('id');

    database.ref('class/' +class_Target).set(null);
    
    //Si on supprime la classe affichée, on réactualise le titre du boutton ainsi que l'affichage du tableau
    if(class_Selected == class_Target)
    {
        class_Selected = "";
        $('#class-title').empty();
        $('#class-title').append('<i class="fas fa-chalkboard-teacher"></i>Classe');
    }

    //Supperssion des cours de la class
    database.ref('classroom/' +class_Target).set(null);
}





// Partie 3: Gestion des formateurs
//Fonction 3: Permet de rajouter un formateur dans la base de donnée
$('#new-teacher-form').on('submit', onAddTeacher);

function onAddTeacher(event)
{
    event.preventDefault();

    //On efface les messages d'erreurs à chaque nouvelle envoie de formulaire
    $('#error-title-teacher-form1').css('display', 'none');
    $('#error-title-teacher-form2').css('display', 'none');
    $('#error-title-teacher-form3').css('display', 'none');
    $('#error-title-teacher-form4').css('display', 'none');

    let teacher_Id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    let name = $('#name').val();
    let pseudo = $('#teacher-pseudo').val();
    let password = $('#teacher-password').val();
    let password_Confirm = $('#teacher-password-confirm').val();
    let teacher_Classe = class_Selected;

    //Gestion des cas d'erreur
    
    //Cas 1: Aucune classe n'a étè sélèctionnée
    if(class_Selected == "")
    {
        $('#error-title-teacher-form1').css('display', 'block');
        return;
    }

    //Cas 2: Les champs sont vides
    if(name == "" || pseudo == "" || password == "" || password_Confirm == "")
    {
        $('#error-title-teacher-form2').css('display', 'block');
        return;
    }

    //Cas 3: Probleme de correspondance entre les mots de passe
    if(password != password_Confirm)
    {
        $('#error-title-teacher-form3').css('display', 'block');
        return;
    }

    //Cas 4: le pseudo ou mots de passe est déjà inscrit dans la base de données (en développement)
    // database.ref('user-list/').on('value', function(snapshot) {
    //     snapshot.forEach(function(item) {
    //         user = item.val();

    //         console.log(user);

    //         if(name == user.name || pseudo == user.pseudo || password == user.password)
    //         {
    //             $('#error-title-teacher-form4').css('display', 'block');
    //             console.log("debug");
    //         }
    //     });
    // });


    let data = {
        name: name,
        pseudo: pseudo,
        password: password,
        class: teacher_Classe,
        user_Type: 'prof',
        user_Id: teacher_Id
    }

    //Liste des utilisateurs utilisé pour l'autentification
    database.ref('user-list/' +teacher_Id).set(data);
}





//Partie 4: Gestion des élèves
//Fonction 3: Permet de rajouter un élève dans la base de donnée
$('#new-user-form').on('submit', onAddUser);

function onAddUser(event)
{
    event.preventDefault();

    //On efface les messages d'erreurs à chaque nouvelle envoie de formulaire
    $('#error-title1').css('display', 'none');
    $('#error-title2').css('display', 'none');
    $('#error-title3').css('display', 'none');

    //Data student
    let user_Id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    let nom = $('#nom').val();
    let tel = $('#tel').val();
    let sexe = $("input[name='sexe']:checked").val();

    //Data user
    let pseudo = $('#pseudo').val();
    let password = $('#password').val();
    let password_Confirm = $('#password_confirm').val();

    // Gestion des cas d'erreurs
    if(class_Selected == "")
    {
        $('#error-title1').css('display', 'block');
        return;
    }

    //1 champs non remplis
    if(nom == "" || tel == "" || sexe == "" || pseudo == "" || password == "" || password_Confirm == "")
    {
        $('#error-title2').css('display', 'block');
        return;
    }

    //2 Erreur de mots de passe
    if(password != password_Confirm)
    {
        $('#error-title3').css('display', 'block');
        return;
    }

    //Data student: contient les informations de l'élève
    let data_Student = {
        name : nom,
        tel : tel,
        sexe : sexe,
        user_Id: user_Id
    };

    //Data user: contient les informations de l'utilisateur
    let data_User = {
        name: nom,
        class: class_Selected,
        pseudo: pseudo,
        password: password,
        user_Type: "élève",
        user_Id: user_Id
    }

    //On créer deux liste dans la base de données:

    //Liste des élèves affiché dans le tableau
    database.ref('class/' +class_Selected+ '/student-list/' +user_Id).set(data_Student);

    //Liste des utilisateurs utilisé pour l'autentification
    database.ref('user-list/' +user_Id).set(data_User);
}


//Fonction 4: Permet de supprimer un utilisateur de la base de donnée
function onDeleteUser()
{

    let user_Selected = $('.delete-user-button-target').attr('id')

    database.ref('class/' +class_Selected+ '/student-list/' +user_Selected).set(null);
    database.ref('user-list/' +user_Selected).set(null);
}


//Fonction 5: Permet de modifier les information d'un utilisateur dans la base de donnée
function onModifUser(event)
{
    event.preventDefault();

    let attribute = $('#modif-form-target > select').val();
    let new_Value = $('#modif-form-target > input[type="text"]').val();
    let user_Selected = $('#modif-form-target > input[type="hidden"]').val();
    console.log(user_Selected, attribute)


    database.ref('class/' +class_Selected+ '/student-list/' +user_Selected+ '/' +attribute).set(new_Value);

    //On enleve l'id au formulaire pour éviter de marquer plusieurs formulaire avec le meme id
    $('#modif-form-target').removeAttr('id');
}





//Affichage du formulaire d'ajout d'utilisateur
function dropDownFunction() 
{
    document.getElementById("myDropdown").classList.toggle("show");
}

//Affichage du formulaire d'ajout du professeur
function dropDownFunctionProfesseur() 
{
    document.getElementById("myDropdown-professeur").classList.toggle("show-prof-form");
}

//Affichage du formulaire d'ajout du professeur
function dropDownFunctionCours() 
{
    document.getElementById("myDropdown-cours").classList.toggle("show-cours-form");
}




//PARTIE PLANNING
//Fonction 1: Permet d'afficher les cours en fonctions des classes
function showPlanning(class_Selected)
{
    database.ref('classroom/' +class_Selected).on('value', function(snapshot) {

        $('.tab-cell-hour').css('background-color', '#f1f1f1');
        $('.tab-cell-hour').empty()
    
        snapshot.forEach(function(item){

            const classroom = item.val();
    
            if(classroom.hour == "day")
            {
                $(`td[class*=${classroom.date}]`).css('background-color', '#e2e2e2');
                $(`td[class*=${classroom.date}]`).append(`
                    <div class="classroom-title">
                        <button class="delete-classroom-button" id=${classroom.classroom_Id}><i class="fas fa-times"></i></button>
                        <div>
                            <h4>${classroom.title}</h4>
                            <h4>${classroom.teacher}</h4>
                        </div>
                    </div>`);
            }

            else
            {
                let table_Target = '.' +classroom.date+ '-' +classroom.hour;
            
                $(table_Target).css('background-color', '#e2e2e2');
                $(table_Target).append(`
                <div class="classroom-title">
                    <button class="delete-classroom-button" id=${classroom.classroom_Id}><i class="fas fa-times"></i></button>
                    <div>
                        <h4>${classroom.title}</h4>
                        <h4>${classroom.teacher}</h4>
                    </div>
                </div>`);
            }
        });

        setTimeout(() => {
            $('.delete-classroom-button').click(function(){
                $(this).attr('class', 'delete-classroom-button-target');
                onDeleteCLassroom();
            });
        });
    })

    //Rajouter la suppression du cour si on rajoute un cour au meme endroit
}


//Fonction 2: Permet d'ajouter un cour dans la base de données 
$('#classroom-form').on('submit', onAddClassroom);

function onAddClassroom(event)
{
    event.preventDefault();

    let classroom_Id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    let classroom_Name = $('#classroom-name').val();
    let teacher_Name = $('#teacher-name').val();
    let date_Selected = $('#date-selected').val();
    let hour_Selected = $('#hour-select').val();

    data = {
        title: classroom_Name,
        class: class_Selected,
        teacher: teacher_Name,
        date: date_Selected,
        hour: hour_Selected,
        classroom_Id: classroom_Id
    }

    database.ref('classroom/' +class_Selected+ '/' +classroom_Id).set(data);
}

function onDeleteCLassroom()
{
    let classroom_Target = $('.delete-classroom-button-target').attr('id');

    //Suppression de la classe ainsi que des données élèves qu'elle contient
    database.ref('classroom/' +class_Selected+ '/' +classroom_Target).set(null);
}


//Fonction 3: Permet d'ajouter un classe dans le formulaire d'ajout du planning
$('#planning-new-class-form').on('submit', onAddClassPlanning);

function onAddClassPlanning(event)
{
    event.preventDefault();

    let new_Class = $('#planning-Class').val();

    database.ref('class/' +new_Class).set({class_Name: new_Class});
}

//Partie 5: Gestion router

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

$('#register-student').mouseenter(function(){
    $('#register-student > p').css({
        'color' : '#eb2a5c',
        transitionDuration: '0.5s'
    })
})

$('#register-student').mouseleave(function(){
    $('#register-student > p').css({
        'color' : '#F7F7F2',
        transitionDuration: '0.5s'
    })
})

$('.dropbtn').mouseenter(function(){
    $('.dropbtn > p').css({
        'color' : '#eb2a5c',
        transitionDuration: '0.5s'
    })
})

$('.dropbtn').mouseleave(function(){
    $('.dropbtn > p').css({
        'color' : '#F7F7F2',
        transitionDuration: '0.5s'
    })
})

$('.dropbtn-professeur').mouseenter(function(){
    $('.dropbtn-professeur > p').css({
        'color' : '#eb2a5c',
        transitionDuration: '0.5s'
    })
})

$('.dropbtn-professeur').mouseleave(function(){
    $('.dropbtn-professeur > p').css({
        'color' : '#F7F7F2',
        transitionDuration: '0.5s'
    })
})

$('.dropbtn-cours').mouseenter(function(){
    $('.dropbtn-cours > p').css({
        'color' : '#eb2a5c',
        transitionDuration: '0.5s'
    })
})

$('.dropbtn-cours').mouseleave(function(){
    $('.dropbtn-cours > p').css({
        'color' : '#F7F7F2',
        transitionDuration: '0.5s'
    })
})