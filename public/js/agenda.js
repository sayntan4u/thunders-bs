$(".btn-checkbox").click(function () {
    // alert("hello");
    if ($(this).children(".material-icons").html() == "check_box") {
        $(this).children(".material-icons").html("check_box_outline_blank");
    }
    else {
        $(this).children(".material-icons").html("check_box");
    }

});


$(document).on("click", ".tasks .btn-edit", function () {
    const val = $(this).parent().siblings("span").html();
    $(this).parent().parent().siblings(".update-card").children(".card-body").children(".input-task").val(val);

    $(this).parent().parent().addClass("hide");
    $(this).parent().parent().siblings(".update-card").removeClass("hide");
    $(this).parent().parent().siblings(".update-card").children(".card-body").children(".input-task").focus();
});

$("#btnAddAgenda").click(function () {
    addAgendaFB($("#addAgendaTextBox").val());
    hideEditCard();
});

//Edit card functions
function showEditCard(elem) {
    $(elem).addClass("hide");
    $(elem).siblings(".edit-card").removeClass("hide");
    $("#addAgendaTextBox").focus();
}

function hideEditCard() {
    $("#addAgendaTextBox").val("");
    $(".btn_add_agenda").removeClass("hide");
    $(".btn_add_agenda").siblings(".edit-card").addClass("hide");
}

function valueChangedNewAgenda(e, elem) {
    const val = $(elem).val();
    if (val != "") {
        $("#btnAddAgenda").removeClass("disabled");
    } else {
        $("#btnAddAgenda").addClass("disabled");
    }

}

function checkKeyNewAgenda(e, elem) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        hideEditCard();
    }
    const val = $(elem).val();
    if(val !=""){
        if (e.key === 'Enter' || e.keyCode === 13) {
            addAgendaFB(val);
            hideEditCard();
        }
    }
    

}

//update card functions

function checkKeyUpdateAgenda(e, elem) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        $(elem).parent().parent().addClass("hide");
        $(elem).parent().parent().siblings(".task").removeClass("hide");
    }
    const val = $(elem).val();
    if(val !=""){
        if (e.key === 'Enter' || e.keyCode === 13) {
            $(elem).parent().parent().siblings(".task").children("span").html(val);
            $(elem).parent().parent().addClass("hide");
            $(elem).parent().parent().siblings(".task").removeClass("hide");
        }
    }

}

function hideUpdateCard(elem) {
    $(elem).parent().parent().parent().addClass("hide");
    $(elem).parent().parent().parent().siblings(".task").removeClass("hide");
}

function valueChangedUpdateAgenda(elem) {
    const val = $(elem).val();
    if (val != "") {
        $(".btn-update").removeClass("disabled");
    } else {
        $(".btn-update").addClass("disabled");
    }
}

function updateAgenda(elem) {

    const val = $(elem).parent().siblings(".input-task").val();
    // console.log(val);
    $(elem).parent().parent().parent().siblings(".task").children("span").html(val);

    $(elem).parent().parent().parent().addClass("hide");
    $(elem).parent().parent().parent().siblings(".task").removeClass("hide");

}

//Agenda CRUD functions

function loadAgendaFB() {

}

function addAgendaFB(task) {
    $(".tasks").append(`
        <div>
                                            <div class="card update-card hide">
                                                <div class="card-body">
                                                    <input type="text" class="form-control input-task"
                                                        placeholder="to add new agenda click here.."
                                                        onkeydown="valueChangedUpdateAgenda(this)" onkeyup="checkKeyUpdateAgenda(event, this)"/>
                                                    <div class="float-end controls-edit">
                                                        <button class="btn bg-secondary-subtle text-secondary-emphasis"
                                                            onclick="hideUpdateCard(this)">Cancel</button>
                                                        <button
                                                            class="btn bg-danger-subtle text-danger-emphasis btn-update"
                                                            onclick="updateAgenda(this)">Update</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="task align-middle">
                                                <a class="btn btn-drag text-muted"><i
                                                        class="material-icons">drag_indicator</i></a>
                                                <a href="#" class="btn btn-checkbox"><i
                                                        class="material-icons">check_box_outline_blank</i></a>
                                                <span>${task}</span>
                                                <div class="float-end">
                                                    <a class="btn btn-edit text-muted"><i
                                                            class="material-icons">edit_note</i></a>
                                                    <a class="btn btn-delete text-muted"><i
                                                            class="material-icons">delete_forever</i></a>
                                                </div>
                                            </div>
                                            <hr>
                                        </div>
                                        
        `);
}

function updateAgendaFB(agendaID, task, isCompleted) {

}

function deleteAgendaFB(agendaID) {

}