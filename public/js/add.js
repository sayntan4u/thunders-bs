// Add Member functionality
$('#saveMember').on('click', function () {
    addPerson();
});

var userJson = {};

function addPerson() {
    const nm = $('#memberName').val();
    const data = { name: nm };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addUser");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
    $(".names").html("");
    $(".loading").removeClass("hide");
    // loadNames();
    addName(nm);
    $("#newPersonName").html(nm);

    $('.add_alert').removeClass("hide").addClass("show");
    setTimeout(function () { $('.add_alert').removeClass("show").addClass("hide"); }, 6000);
}

function addName(name) {
    userJson.push({ name: name, namelist: "" });
    generateNamesTable(userJson);
}

function loadNames() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/getNames");
    xhttp.onload = function () {

        const response = JSON.parse(this.responseText);
        userJson = response;
        if(userJson.length > 0){
            generateNamesTable(response);
        }else{
            $(".loading").addClass("hide");
        }

    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function generateNamesTable(response) {
    $(".names").html("");
    for (let i = 0; i < response.length; i++) {
        $(".names").append(`
        <tr>
        <th scope="row">${i + 1}</th>
        <td>${response[i].name}</td>
        <td class="namelist_container">
        
        <div class="row g-3">
            <div class="col-auto">
            <a href="${response[i].namelist == "" ? "#" : response[i].namelist}" id="${response[i].name}-link" target="_blank" class=${response[i].namelist == "" ? "text-danger" : "text-success"}>${response[i].name}'s Namelist</a>
               <input class="form-control hide" type="text" id="${response[i].name}-text"/> 
            </div>
            <div class="col-auto">
                <button id="${response[i].name}-btnCancel" class="btn btn-info btn-sm hide" onclick="cancel_edit('${response[i].name}')"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="col-auto">
                <button id="${response[i].name}-btn" class="btn btn-info btn-sm" onclick="show_editText('${response[i].name}')"><i class="fa-solid fa-pen"></i></button>
            </div>
        </div>
        </td>
        <td>
        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteMemberModal" data-bs-name='${response[i].name}'>Delete Person</button>
        </td>
      </tr>
        `);

        $(".loading").addClass("hide");
    }
}

function show_editText(name) {
    if ($("#" + name + "-btn").html() == '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>') {
        //save
        const data = { name: name, link: $("#" + name + "-text").val() };

        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/updateNamelist");
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(data));

        if ($("#" + name + "-text").val() == "") {
            $("#" + name + "-link").attr("href", "#");
            $("#" + name + "-link").removeClass("text-success").addClass("text-danger");
        } else {
            $("#" + name + "-link").attr("href", $("#" + name + "-text").val());
            $("#" + name + "-link").removeClass("text-danger").addClass("text-success");
        }

        $("#" + name + "-text").addClass("hide");
        $("#" + name + "-link").removeClass("hide");
        $("#" + name + "-btnCancel").addClass("hide");
        $("#" + name + "-btn").html('<i class="fa-solid fa-pen"></i>');

        // location.href = "/add";



    } else {
        //edit
        $("#" + name + "-text").val($("#" + name + "-link").attr("href") == "#" ? "" : $("#" + name + "-link").attr("href"));
        $("#" + name + "-link").addClass("hide");
        $("#" + name + "-text").removeClass("hide");
        $("#" + name + "-btnCancel").removeClass("hide");
        $("#" + name + "-btn").html('<i class="fa-solid fa-floppy-disk"></i>');
    }

}

function cancel_edit(name) {
    $("#" + name + "-text").addClass("hide");
    $("#" + name + "-link").removeClass("hide");
    $("#" + name + "-btnCancel").addClass("hide");
    $("#" + name + "-btn").html('<i class="fa-solid fa-pen"></i>');
}

var deleteModal = document.getElementById('deleteMemberModal');
deleteModal.addEventListener('show.bs.modal', function (event) {

    var button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    var name = button.getAttribute('data-bs-name');
    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.
    //
    // Update the modal's content.
    $("#userName").html(name);
})

function deleteUser() {
    const nm = $("#userName").html();
    const data = { name: nm };
    // alert(name);
    // location.href = "/delete?name=" + name;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/delete");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));

    for (let i = 0; i < userJson.length; i++) {
        if (userJson[i].name == nm) {
            // delete userJson[i];
            userJson.splice(i, 1);
            break;
        }
    }
    generateNamesTable(userJson);

    $("#deletePersonName").html(nm);
    $('.delete_alert').removeClass("hide").addClass("show");
    setTimeout(function () { $('.delete_alert').removeClass("show").addClass("hide"); }, 6000);
}

function search() {
    const searchStr = $("#search_text").val();
    resultJson = [];

    if (searchStr != "") {
        for (let i = 0; i < userJson.length; i++) {
            if (userJson[i].name.toLowerCase().match(searchStr.toLowerCase())) {
                resultJson.push(userJson[i]);
            }
        }
    } else {
        resultJson = userJson;
    }
    generateNamesTable(resultJson);
}

loadNames();
