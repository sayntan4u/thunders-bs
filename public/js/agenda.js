$(".btn-checkbox").click(function () {
    // alert("hello");
    if ($(this).children(".material-icons").html() == "check_box") {
        $(this).children(".material-icons").html("check_box_outline_blank");
    }
    else {
        $(this).children(".material-icons").html("check_box");
    }

});

$(".btn-edit").click(function () {
    const val = $(this).parent().siblings("span").html();
    $(this).parent().parent().siblings(".update-card").children(".card-body").children(".input-task").val(val);

    $(this).parent().parent().addClass("hide");
    $(this).parent().parent().siblings(".update-card").removeClass("hide");
});

//Edit card functions
function showEditCard(elem) {
    $(elem).addClass("hide");
    $(elem).siblings(".edit-card").removeClass("hide");
}

function hideEditCard() {
    $(".btn_add_agenda").removeClass("hide");
    $(".btn_add_agenda").siblings(".edit-card").addClass("hide");
}

function valueChangedNewAgenda(elem) {
    const val = $(elem).val();
    if (val != "") {
        $("#btnAddAgenda").removeClass("disabled");
    } else {
        $("#btnAddAgenda").addClass("disabled");
    }
}

//update card functions
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
    $(elem).parent().parent().parent().siblings(".task").children("span").html(val);

    $(elem).parent().parent().parent().addClass("hide");
    $(elem).parent().parent().parent().siblings(".task").removeClass("hide");

}
