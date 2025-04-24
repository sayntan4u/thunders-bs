Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}

$("#btnAddAgenda").click(function () {
    const task = $("#addAgendaTextBox").val();
    const id = Date.now();
    // console.log(id);
    addAgendaFB(task, id);
    addAgendaUI(task, id);
    hideEditCard();
});


$(document).on("click", ".tasks .btn-checkbox", function () {
    if ($(this).children(".material-icons").html() == "check_box") {
        $(this).children(".material-icons").html("check_box_outline_blank");
    }
    else {
        $(this).children(".material-icons").html("check_box");
    }
    updateTaskCount("Delete");
    const dt = new Date();
    updateConfirmAgendaFB($(this).siblings(".task_id").html(), dt.timeNow())
    addCompletedNotification($(this).siblings(".task_id").html(), $(this).siblings("span").html(), dt.timeNow());
    $(this).parent().parent().remove();

});

$(document).on("click", ".tasks .btn-edit", function () {
    const val = $(this).parent().siblings(".task_content").html();
    $(this).parent().parent().siblings(".update-card").children(".card-body").children(".input-task").val(val);

    $(this).parent().parent().addClass("hide");
    $(this).parent().parent().siblings(".update-card").removeClass("hide");
    $(this).parent().parent().siblings(".update-card").children(".card-body").children(".input-task").focus();
});

$(document).on("click", ".tasks .btn-delete", function () {
    const id = $(this).parent().siblings(".task_id").html();
    deleteAgendaFB(id);
    $(this).parent().parent().parent().remove();
    updateTaskCount("Delete");
});

$(document).on("click", ".completion_alerts .btn-undo", function () {
    const id = $(this).parent().siblings(".task_id").html();
    const task = $(this).parent().siblings(".task_content").html();
    addAgendaUI(task, id);
    updateConfirmAgendaFB(id, "", false);
    updateTaskCount("Add");
    $(this).parent().parent().parent().remove();
});

var tasks = [];
var tasksCount = 0;

//Task count

function updateTaskCount(type = "Update") {
    if (type == "Add") {
        tasksCount++;
    } else if (type == "Update") {
        //do nothing
    } else {
        tasksCount--;
    }

    if (tasksCount > 1) {
        $(".task_count").html(tasksCount.toString() + " tasks");
    } else {
        $(".task_count").html(tasksCount.toString() + " task");
    }

}


//Notifications

function addCompletedNotification(id, task, time) {
    $(".completion_alerts").append(`
        <div class="card bg-success-subtle text-success-emphasis border border-success-subtle">
                                        <div class="card-body">
                                          <strong>Completed</strong>
                                          <span class="task_content">${task}</span>
                                          <span class="task_id hide">${id}</span>
                                          <div class="d-flex justify-content-between align-items-center">    
                                            <span class="badge rounded-pill bg-warning-subtle text-warning-emphasis">${time}</span>
                                            <button class="btn btn-sm btn-success btn-undo"><i class="material-icons">undo</i></button>
                                          </div>
                                        </div>
                                    </div>
        `);
}


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
    const task = $(elem).val();
    if (task != "") {
        if (e.key === 'Enter' || e.keyCode === 13) {
            const id = Date.now();
            // console.log(id);
            addAgendaFB(task, id);
            addAgendaUI(task, id);
            hideEditCard();
        }
    }


}

function addAgendaUI(task, id) {
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
                                                            onclick="updateAgenda(this, '${id}')">Update</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="task align-middle">
                                                <a class="btn btn-drag text-muted"><i
                                                        class="material-icons">drag_indicator</i></a>
                                                <a href="#" class="btn btn-checkbox"><i
                                                        class="material-icons">check_box_outline_blank</i></a>
                                                <span class="task_content">${task}</span>
                                                <span class="task_id hide">${id}</span>
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


//update card functions

function checkKeyUpdateAgenda(e, elem) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        $(elem).parent().parent().addClass("hide");
        $(elem).parent().parent().siblings(".task").removeClass("hide");
    }
    const task = $(elem).val();
    if (task != "") {
        if (e.key === 'Enter' || e.keyCode === 13) {
            const id = $(elem).parent().parent().siblings(".task").children(".task_id").html();
            updateAgendaFB(task, id);
            $(elem).parent().parent().siblings(".task").children(".task_content").html(task);
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

function updateAgenda(elem, id) {
    const task = $(elem).parent().siblings(".input-task").val();
    updateAgendaFB(task, id);
    // console.log(val);
    $(elem).parent().parent().parent().siblings(".task").children(".task_content").html(task);
    $(elem).parent().parent().parent().addClass("hide");
    $(elem).parent().parent().parent().siblings(".task").removeClass("hide");

}

//Firebase functions

function loadAgendaFB() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/agenda/getAgendas");
    xhttp.onload = function () {
        const response = JSON.parse(this.responseText);
        tasks = response;
        loadAgendaList(response);
        loadCompletedAgendas(response);
        $(".loading_agenda").addClass("hide");
        $(".tasks-container").removeClass("hide");

    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function loadAgendaList(data) {
    var count = 0;
    for (let i = 0; i < data.length; i++) {
        if (!data[i].isCompleted) {
            addAgendaUI(data[i].task, data[i].id);
            count++;
        }
    }
    tasksCount = count;
    updateTaskCount();

}

function addAgendaFB(task, id) {
    const data = { task: task, id: id };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/agenda/addAgenda");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
    updateTaskCount("Add");
}

function updateAgendaFB(task, id) {
    const data = { task: task, id: id };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/agenda/updateAgenda");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}

function deleteAgendaFB(id) {
    const data = { id: id };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/agenda/deleteAgenda");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}

function updateConfirmAgendaFB(id, time, isCompleted = true) {
    const data = { id: id, time: time, isCompleted: isCompleted };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/agenda/updateConfirmAgenda");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}

function loadCompletedAgendas(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].isCompleted) {
            addCompletedNotification(data[i].id, data[i].task, data[i].time);
        }
    }
}

function getToday() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    $(".date").html(currentDate);
}

getToday();
loadAgendaFB();