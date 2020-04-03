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



//Partie 1: Selection de la classe
let class_Selected = "FIDEV2";
showUser(class_Selected);

//Gestionnaire d'évenement 1: Envoie de la classe selectionné
$('#item-1').click(() => { 
    class_Selected = $('#item-1').text();
    $('#class-title').empty();
    $('#class-title').append('<i class="fas fa-chalkboard-teacher"></i>' +class_Selected);
    showUser(class_Selected);
});

$('#item-2').click(() => { 
    class_Selected = $('#item-2').text();
    $('#class-title').empty();
    $('#class-title').append('<i class="fas fa-chalkboard-teacher"></i>' +class_Selected);
    showUser(class_Selected);
});

$('#item-3').click(() => { 
    class_Selected = $('#item-3').text();
    $('#class-title').empty();
    $('#class-title').append('<i class="fas fa-chalkboard-teacher"></i>' +class_Selected);
    showUser(class_Selected);
});


//Fonction 1: Permet de montrer les utilisateurs en fonction de la classe
function showUser(class_Selected)
{
    database.ref('users/' +class_Selected).on('value', function (snapshot) {

        $('#users').empty();   
        
        let content = '';

        snapshot.forEach(function(item) {

            const user = item.val()
            content += `<tr>
                            <td>
                                <form class="delete_form">
                                    <input type="hidden" value=${user.user_Id}  />
                                    <button type="submit"><i class="fas fa-times"></i></button>
                                    ${user.nom}
                                </form>
                            </td>
                            <td>${user.tel}</td>
                            <td>${user.sexe}</td>
                            <td>
                                <form class="modif_form">
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
            $('.delete_form').click(function(){
                $('#delete_form_target').removeAttr('id');
                $(this).attr('id', 'delete_form_target');
                setTimeout(() => $('#delete_form_target').on('submit', onDeleteUser), 500);
            });

            $('.modif_form').click(function(){
                $('#modif_form_target').removeAttr('id');
                $(this).attr('id', 'modif_form_target');
                setTimeout(() => $('#modif_form_target').on('submit', onModifUser), 500);
            });
  
        }, 500);
    })
}




//Partie 2: Gestion de la création de classe et d'utilisateurs
// Gestionnaire d'evenement 2: Envoie des infos utilisateurs
$('#new-user-form').on('submit', onAddUser);

//Fonction 2: Permet de rajouter un utilisateur dans la base de donnée
function onAddUser (event)
{
    event.preventDefault();

    let user_Id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    let nom = $('#nom').val();
    let tel = $('#tel').val();
    let sexe = $("input[name='sexe']:checked").val();

    let data = {
        nom : nom,
        tel : tel,
        sexe : sexe,
        user_Id: user_Id
    };

    database.ref('users/' +class_Selected+ '/' +user_Id).set(data);
}


//Fonction 3: Permet d'ajouter une nouvelle classe dans la base de donnée
$('#new-class-form').on('submit', onAddClass);

function onAddClass (event)
{
    event.preventDefault();

    let new_Class = $('#class').val();

    database.ref('users/').push(new_Class);
}




//Partie 4: Modification des donnée utilisateur

//Fonction 4: Permet de supprimer un utilisateur de la base de donnée
function onDeleteUser   (event)
{
    event.preventDefault();

    let user_Selected = $('#delete_form_target > input[type="hidden"]').val();

    database.ref('users/' +class_Selected+ '/' +user_Selected).set(null);

}

//Fonction 5: Permet de modifier les information d'un utilisateur dans la base de donnée
function onModifUser (event)
{
    event.preventDefault();

    let attribute = $('#modif_form_target > select').val();
    let new_Value = $('#modif_form_target > input[type="text"]').val();
    let user_Selected = $('#modif_form_target > input[type="hidden"]').val();

    database.ref('users/' +class_Selected+ '/' +user_Selected+ '/' +attribute).set(new_Value);

    //On enleve l'id au formulaire pour éviter de marquer plusieurs formulaire avec le meme id
    $('#modif_form_target').removeAttr('id');
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