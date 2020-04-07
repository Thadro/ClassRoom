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




//Partie 1: Initialisation de l'interface, fonction d'affichage des données
let class_Selected = "";

//Montrer la liste des classe
database.ref('class/').on('value', function(snapshot) 
{
    $('#dropdown-list').empty();

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

    //Selection manuel de la classe (click sur le dropdown)
    setTimeout(() => {
        $('.list-item-title').click(function(){
            class_Selected = $(this).text();

            $('#class-title').empty();
            $('#class-title').append('<i class="fas fa-chalkboard-teacher"></i>' +class_Selected);

            showUser(class_Selected);
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
                                <form class="delete-form">
                                    <input type="hidden" value=${user.user_Id}  />
                                    <button type="submit"><i class="fas fa-times"></i></button>
                                    ${user.nom}
                                </form>
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
            $('.delete-form').click(function(){
                $('#delete-form-target').removeAttr('id');
                $(this).attr('id', 'delete-form-target');
                setTimeout(() => $('#delete-form-target').on('submit', onDeleteUser), 500);
            });

            $('.modif-form').click(function(){
                $('#modif-form-target').removeAttr('id');
                $(this).attr('id', 'modif-form-target');
                setTimeout(() => $('#modif-form-target').on('submit', onModifUser), 500);
            });
  
        }, 500);
    })
}




//Gestion des information de classe et d'élève

//Partie 2: Gestion des classes
//Fonction 2: Permet d'ajouter une nouvelle classe dans la base de donnée
$('#new-class-form').on('submit', onAddClass);

function onAddClass(event)
{
    event.preventDefault();

    let new_Class = $('#class').val();

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
}




//Partie 3: Gestion des élèves
//Fonction 3: Permet de rajouter un utilisateur dans la base de donnée
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
    let passwordConfirm = $('#password_confirm').val();

    // Gestion des cas d'erreurs
    if(class_Selected == "")
    {
        $('#error-title1').css('display', 'block');
        return;
    }

    //1 champs non remplis
    if(nom == "" || tel == "" || sexe == "" || pseudo == "" || password == "" || passwordConfirm == "")
    {
        $('#error-title2').css('display', 'block');
        return;
    }

    //2 Erreur de mots de passe
    if(password != passwordConfirm)
    {
        $('#error-title3').css('display', 'block');
        return;
    }

    //Data student: contient les informations de l'élève
    let data_Student = {
        nom : nom,
        tel : tel,
        sexe : sexe,
        user_Id: user_Id
    };

    //Data user: contient les informations de l'utilisateur
    let data_User = {
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
function onDeleteUser(event)
{
    event.preventDefault();

    let user_Selected = $('#delete-form-target > input[type="hidden"]').val();

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

    database.ref('class/' +class_Selected+ '/student-list/' +user_Selected+ '/' +attribute).set(new_Value);

    //On enleve l'id au formulaire pour éviter de marquer plusieurs formulaire avec le meme id
    $('#modif-form-target').removeAttr('id');
}

  //Affichage du formulaire d'ajout d'utilisateur
    function dropDownFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }
  
  // Fermer le dropdown
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      let i;
      for (i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (getElementById('#register-student').click()) {
           document.getElementsByClassName('dropdown-content') = openDropdown.classList.remove('show');
        }
      }
    }
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