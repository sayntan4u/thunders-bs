var settingsJson = {};

//SKB methods
$("#addFieldBtn").click(function () {
    $("#addFieldBtn").prop("disabled", true);
    $("#table_header").append(`
        <li id="add_li">
        <div class="input-group">
                                <input type="text" class="form-control" placeholder="Add Field Name" id="textFieldName">
                                
                                <button type="button" class="btn btn-danger" onclick="cancelAddField()"><i class="fa-solid fa-xmark"></i></button>
                                &nbsp;
                                <button type="button" class="btn btn-success" onclick="addField()"><i class="fa-solid fa-check"></i></button>
                              </div>
        </li>
        `);
    document.getElementById("textFieldName").focus();
});

function cancelAddField() {
    $("#addFieldBtn").prop("disabled", false);
    $('#add_li').remove();
}

function addField(fieldName = "") {
    if (fieldName == "") {
        fieldName = $("#textFieldName").val();
        settingsJson.SKB_table.push({
            header: fieldName,
            sub_heading: []
        });
        // console.log(settingsJson.SKB_table);
        $("#settingsJsonTextSKB").val(JSON.stringify(settingsJson.SKB_table, null, 2));
        generateSKBTable(settingsJson.SKB_table);
    }
    $("#table_header").append(`
        <li draggable="true" id="` + fieldName.replaceAll(/\s/g, '') + `" ondragstart="dragstartHandlerSKB(event)" ondrop="dropHandlerSKB(event)" ondragover="dragoverHandlerSKB(event)" class="th">
                                  <span class="badge rounded-pill bg-secondary">` + fieldName + `</span>
                                  <!-- Example single danger button -->
                                  <div class="btn-group">
                                    <button type="button" class="btn dropdown-toggle btn-sm"
                                      data-bs-toggle="dropdown" aria-expanded="false">
                                      <i class="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                      <li><button class="btn dropdown-item" onclick="add_sub_heading(this)" >Add Sub-heading</button></li>
                                      <li><button class="btn dropdown-item" onclick="delete_heading(this)">Delete</button></li>
                                    </ul>
                                  </div>
                                  <ul class="sub_heading sub_heading_` + fieldName.replaceAll(/\s/g, '') + `">
                                  </ul>
                                </li>
        
        `);

    $("#addFieldBtn").prop("disabled", false);
    $('#add_li').remove();

}

function delete_heading(elem) {
    const heading_name = $(elem).parent().parent().parent().parent().children("span").html();
    // console.log(heading_name);

    for (let i = 0; i < settingsJson.SKB_table.length; i++) {
        if (settingsJson.SKB_table[i].header == heading_name) {
            settingsJson.SKB_table.splice(i, 1);
            break;
        }
    }
    // console.log(settingsJson.SKB_table);
    $("#settingsJsonTextSKB").val(JSON.stringify(settingsJson.SKB_table, null, 2));
    generateSKBTable(settingsJson.SKB_table);
    elem.parentNode.parentNode.parentNode.parentNode.remove();
}

function add_sub_heading(elem) {
    // const sub_heading_ul = elem.parentNode.parentNode.parentNode.parentNode.children[2];
    // alert($(elem).parent().parent().parent().parent());
    $(elem).parent().parent().parent().parent().children(".sub_heading").append(`
        <li class="add_li">
       <div class="input-group">
                               <input type="text" class="form-control" placeholder="Add Sub Field Name" id="textSubFieldName">
                               
                               <button type="button" class="btn btn-danger" onclick="cancelAddSubField()"><i class="fa-solid fa-xmark"></i></button>
                               &nbsp;
                               <button type="button" class="btn btn-success" onclick="addSubField()"><i class="fa-solid fa-check"></i></button>
                             </div>
       </li>
       `);
    document.getElementById("textSubFieldName").focus();

}

function cancelAddSubField() {
    $('.add_li').remove();
}

function addSubField(sub_field_name = "", heading = "") {

    if (heading == "") {
        sub_field_name = $("#textSubFieldName").val();

        const heading_name = $('.add_li').parent().parent().children("span").html();
        // console.log(heading_name);

        for (let i = 0; i < settingsJson.SKB_table.length; i++) {
            if (settingsJson.SKB_table[i].header == heading_name) {
                settingsJson.SKB_table[i].sub_heading.push(sub_field_name);
                break;
            }
        }
        // console.log(settingsJson.SKB_table);
        $("#settingsJsonTextSKB").val(JSON.stringify(settingsJson.SKB_table, null, 2));
        generateSKBTable(settingsJson.SKB_table);

        $('.add_li').parent().append(`
            <li>
                                          <span class="badge rounded-pill bg-warning">` + sub_field_name + `</span>
                                          <button type="button" class="btn btn-sm" onclick="delete_sub_heading(this)"><i class="fa-solid fa-xmark text-danger"></i></button>
            </li>
            `);
        $('.add_li').remove();
    } else {
        $('.sub_heading_' + heading.replaceAll(/\s/g, '')).append(`
            <li>
                                          <span class="badge rounded-pill bg-warning">` + sub_field_name + `</span>
                                          <button type="button" class="btn btn-sm" onclick="delete_sub_heading(this)"><i class="fa-solid fa-xmark text-danger"></i></button>
            </li>
            `);
    }


}

function delete_sub_heading(elem) {
    const heading_name = $(elem).parent().parent().parent().children("span").html();
    const sub_heading_name = $(elem).parent().children("span").html();

    // console.log(heading_name);
    // console.log(sub_heading_name);

    for (let i = 0; i < settingsJson.SKB_table.length; i++) {
        if (settingsJson.SKB_table[i].header == heading_name) {
            for (let j = 0; j < settingsJson.SKB_table[i].sub_heading.length; j++) {
                if (settingsJson.SKB_table[i].sub_heading[j] == sub_heading_name) {
                    settingsJson.SKB_table[i].sub_heading.splice(j, 1);
                    break;
                }
            }
            break;
        }
    }
    // console.log(settingsJson.SKB_table);
    $("#settingsJsonTextSKB").val(JSON.stringify(settingsJson.SKB_table, null, 2));
    generateSKBTable(settingsJson.SKB_table);
    $(elem).parent().remove();
}


function generateSKBTableTree(SKB_table) {
    $("#table_header").html("");
    for (let i = 0; i < SKB_table.length; i++) {
        addField(SKB_table[i].header);
        if (SKB_table[i].sub_heading.length > 0) {
            for (let j = 0; j < SKB_table[i].sub_heading.length; j++) {
                addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
            }
        }
    }
}

function generateSKBTable(SKB_table) {

    $(".skb_table").html("");
    $(".skb_table").append(`
        <thead class="thead-dark">
            <tr class="header">

            </tr>
            <tr class="sub_heading">

            </tr>
        </thead>
        `);

    var isSubHeading = false;

    for (let i = 0; i < SKB_table.length; i++) {

        if (SKB_table[i].sub_heading.length > 0) {
            isSubHeading = true;
            $(".skb_table thead .header").append(`
                <th scope="col" class="txt-align-center text-light bg-dark" colspan="` + SKB_table[i].sub_heading.length + `">` + SKB_table[i].header + `</th>
                `);
        } else {
            $(".skb_table thead .header").append(`
                <th scope="col" class="txt-align-center text-light bg-dark">` + SKB_table[i].header + `</th>
                `);
        }
    }

    if (isSubHeading) {
        for (let i = 0; i < SKB_table.length; i++) {
            if (SKB_table[i].sub_heading.length > 0) {
                for (let j = 0; j < SKB_table[i].sub_heading.length; j++) {
                    $(".skb_table thead .sub_heading").append(`
                        <th scope="col" class="txt-align-center text-light bg-dark">` + SKB_table[i].sub_heading[j] + `</th>
                        `);
                }
            } else {
                $(".skb_table thead .sub_heading").append(`
                    <th scope="col" class="txt-align-center text-light bg-dark"></th>
                    `);
            }

        }
    }
}

$("#saveConfigSKB").click(function () {
    const data = { config: settingsJson };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/saveSettings");
    xhttp.onload = function () {
        // console.log(this.responseText);
        $(".alert_skb").toggleClass("hide");
        setTimeout(function () { $(".alert_skb").toggleClass("hide"); }, 6000);
    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
});

function dragstartHandlerSKB(ev) {
    ev.dataTransfer.setData("text", $(ev.target).children("span").html());
}

function dropHandlerSKB(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    $("#drag_drop").html(data + " -> " + $(ev.target).html());

    swapElements(data, $(ev.target).html(), settingsJson.SKB_table);

    $("#settingsJsonTextSKB").val(JSON.stringify(settingsJson.SKB_table, null, 2));
    generateSKBTableTree(settingsJson.SKB_table);
    generateSKBTable(settingsJson.SKB_table);
}

function dragoverHandlerSKB(ev) {
    ev.preventDefault();
}

//Sapphire Methods
$("#addFieldBtnSapphire").click(function () {
    $("#addFieldBtnSapphire").prop("disabled", true);
    $("#table_header_sapphire").append(`
        <li id="add_li_sapphire">
        <div class="input-group">
                                <input type="text" class="form-control" placeholder="Add Field Name" id="textFieldNameSapphire">
                                
                                <button type="button" class="btn btn-danger" onclick="cancelAddFieldSapphire()"><i class="fa-solid fa-xmark"></i></button>
                                &nbsp;
                                <button type="button" class="btn btn-success" onclick="addFieldSapphire()"><i class="fa-solid fa-check"></i></button>
                              </div>
        </li>
        `);
    document.getElementById("textFieldNameSapphire").focus();
});

function cancelAddFieldSapphire() {
    $("#addFieldBtnSapphire").prop("disabled", false);
    $('#add_li_sapphire').remove();
}

function addFieldSapphire(fieldName = "") {
    if (fieldName == "") {
        fieldName = $("#textFieldNameSapphire").val();
        settingsJson.Sapphire_table.push({
            header: fieldName,
            sub_heading: []
        });
        // console.log(settingsJson.SKB_table);
        $("#settingsJsonTextSapphire").val(JSON.stringify(settingsJson.Sapphire_table, null, 2));
        generateSapphireTable(settingsJson.Sapphire_table);
    }
    $("#table_header_sapphire").append(`
        <li draggable="true" id="` + fieldName.replaceAll(/\s/g, '') + `_Sapphire" ondragstart="dragstartHandlerSKB(event)" ondrop="dropHandlerSKB(event)" ondragover="dragoverHandlerSKB(event)" class="th">
                                  <span class="badge rounded-pill bg-secondary">` + fieldName + `</span>
                                  <!-- Example single danger button -->
                                  <div class="btn-group">
                                    <button type="button" class="btn dropdown-toggle btn-sm"
                                      data-bs-toggle="dropdown" aria-expanded="false">
                                      <i class="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                      <li><button class="btn dropdown-item" onclick="add_sub_heading_sapphire(this)" >Add Sub-heading</button></li>
                                      <li><button class="btn dropdown-item" onclick="delete_heading_sapphire(this)">Delete</button></li>
                                    </ul>
                                  </div>
                                  <ul class="sub_heading sub_heading_sapphire_` + fieldName.replaceAll(/\s/g, '') + `">
                                  </ul>
                                </li>
        
        `);

    $("#addFieldBtnSapphire").prop("disabled", false);
    $('#add_li_sapphire').remove();

}

function delete_heading_sapphire(elem) {
    const heading_name = $(elem).parent().parent().parent().parent().children("span").html();
    // console.log(heading_name);

    for (let i = 0; i < settingsJson.Sapphire_table.length; i++) {
        if (settingsJson.Sapphire_table[i].header == heading_name) {
            settingsJson.Sapphire_table.splice(i, 1);
            break;
        }
    }
    // console.log(settingsJson.SKB_table);
    $("#settingsJsonTextSapphire").val(JSON.stringify(settingsJson.Sapphire_table, null, 2));
    generateSapphireTable(settingsJson.Sapphire_table);
    elem.parentNode.parentNode.parentNode.parentNode.remove();
}

function add_sub_heading_sapphire(elem) {
    // const sub_heading_ul = elem.parentNode.parentNode.parentNode.parentNode.children[2];
    // alert($(elem).parent().parent().parent().parent());
    $(elem).parent().parent().parent().parent().children(".sub_heading").append(`
        <li class="add_li_sapphire">
       <div class="input-group">
                               <input type="text" class="form-control" placeholder="Add Sub Field Name" id="textSubFieldNameSapphire">
                               
                               <button type="button" class="btn btn-danger" onclick="cancelAddSubFieldSapphire()"><i class="fa-solid fa-xmark"></i></button>
                               &nbsp;
                               <button type="button" class="btn btn-success" onclick="addSubFieldSapphire()"><i class="fa-solid fa-check"></i></button>
                             </div>
       </li>
       `);
    document.getElementById("textSubFieldNameSapphire").focus();

}

function cancelAddSubFieldSapphire() {
    $('.add_li_sapphire').remove();
}

function addSubFieldSapphire(sub_field_name = "", heading = "") {

    if (heading == "") {
        sub_field_name = $("#textSubFieldNameSapphire").val();

        const heading_name = $('.add_li_sapphire').parent().parent().children("span").html();
        // console.log(heading_name);

        for (let i = 0; i < settingsJson.Sapphire_table.length; i++) {
            if (settingsJson.Sapphire_table[i].header == heading_name) {
                settingsJson.Sapphire_table[i].sub_heading.push(sub_field_name);
                break;
            }
        }
        // console.log(settingsJson.SKB_table);
        $("#settingsJsonTextSapphire").val(JSON.stringify(settingsJson.Sapphire_table, null, 2));
        generateSapphireTable(settingsJson.Sapphire_table);

        $('.add_li_sapphire').parent().append(`
            <li>
                                          <span class="badge rounded-pill bg-warning">` + sub_field_name + `</span>
                                          <button type="button" class="btn btn-sm" onclick="delete_sub_heading_sapphire(this)"><i class="fa-solid fa-xmark text-danger"></i></button>
            </li>
            `);
        $('.add_li').remove();
    } else {
        $('.sub_heading_sapphire_' + heading.replaceAll(/\s/g, '')).append(`
            <li>
                                          <span class="badge rounded-pill bg-warning">` + sub_field_name + `</span>
                                          <button type="button" class="btn btn-sm" onclick="delete_sub_heading_sapphire(this)"><i class="fa-solid fa-xmark text-danger"></i></button>
            </li>
            `);
    }


}

function delete_sub_heading_sapphire(elem) {
    const heading_name = $(elem).parent().parent().parent().children("span").html();
    const sub_heading_name = $(elem).parent().children("span").html();

    // console.log(heading_name);
    // console.log(sub_heading_name);

    for (let i = 0; i < settingsJson.Sapphire_table.length; i++) {
        if (settingsJson.Sapphire_table[i].header == heading_name) {
            for (let j = 0; j < settingsJson.Sapphire_table[i].sub_heading.length; j++) {
                if (settingsJson.Sapphire_table[i].sub_heading[j] == sub_heading_name) {
                    settingsJson.Sapphire_table[i].sub_heading.splice(j, 1);
                    break;
                }
            }
            break;
        }
    }
    // console.log(settingsJson.SKB_table);
    $("#settingsJsonTextSapphire").val(JSON.stringify(settingsJson.Sapphire_table, null, 2));
    generateSapphireTable(settingsJson.Sapphire_table);
    $(elem).parent().remove();
}

function generateSapphireTableTree(Sapphire_table) {
    $("#table_header_sapphire").html("");
    // console.log(Sapphire_table);
    for (let i = 0; i < Sapphire_table.length; i++) {
        addFieldSapphire(Sapphire_table[i].header);
        if (Sapphire_table[i].sub_heading.length > 0) {
            for (let j = 0; j < Sapphire_table[i].sub_heading.length; j++) {
                addSubFieldSapphire(Sapphire_table[i].sub_heading[j], Sapphire_table[i].header);
            }
        }
    }
}

function generateSapphireTable(Sapphire_table) {

    $(".sapphire_table").html("");
    $(".sapphire_table").append(`
        <thead class="thead-dark">
            <tr class="header">

            </tr>
            <tr class="sub_heading">

            </tr>
        </thead>
        `);

    var isSubHeading = false;

    for (let i = 0; i < Sapphire_table.length; i++) {

        if (Sapphire_table[i].sub_heading.length > 0) {
            isSubHeading = true;
            $(".sapphire_table thead .header").append(`
                <th scope="col" class="txt-align-center text-light bg-dark" colspan="` + Sapphire_table[i].sub_heading.length + `">` + Sapphire_table[i].header + `</th>
                `);
        } else {
            $(".sapphire_table thead .header").append(`
                <th scope="col" class="txt-align-center text-light bg-dark">` + Sapphire_table[i].header + `</th>
                `);
        }
    }

    if (isSubHeading) {
        for (let i = 0; i < Sapphire_table.length; i++) {
            if (Sapphire_table[i].sub_heading.length > 0) {
                for (let j = 0; j < Sapphire_table[i].sub_heading.length; j++) {
                    $(".sapphire_table thead .sub_heading").append(`
                        <th scope="col" class="txt-align-center text-light bg-dark">` + Sapphire_table[i].sub_heading[j] + `</th>
                        `);
                }
            } else {
                $(".sapphire_table thead .sub_heading").append(`
                    <th scope="col" class="txt-align-center text-light bg-dark"></th>
                    `);
            }

        }
    }
}

$("#saveConfigSapphire").click(function () {
    const data = { config: settingsJson };
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/saveSettings");
    xhttp.onload = function () {
        // console.log(this.responseText);
        $(".alert_sapphire").toggleClass("hide");
        setTimeout(function () { $(".alert_sapphire").toggleClass("hide"); }, 6000);
    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
});

function dragstartHandlerSKB(ev) {
    ev.dataTransfer.setData("textSapphire", $(ev.target).children("span").html());
}

function dropHandlerSKB(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("textSapphire");
    $("#drag_drop_sapphire").html(data + " -> " + $(ev.target).html());

    swapElements(data, $(ev.target).html(), settingsJson.Sapphire_table);

    $("#settingsJsonTextSapphire").val(JSON.stringify(settingsJson.Sapphire_table, null, 2));
    generateSapphireTableTree(settingsJson.Sapphire_table);
    generateSapphireTable(settingsJson.Sapphire_table);
}

function dragoverHandlerSapphire(ev) {
    ev.preventDefault();
}

//Common Methods

function editColSpan(elem){
    $(elem).toggleClass("hide");
    $(elem).parent().children(".btn_controls").toggleClass("hide");
    $(elem).parent().children("input").prop("disabled", false);
    
}

function cancelColSpan(elem){
    $(elem).parent().toggleClass("hide");
    $(elem).parent().parent().children("button").toggleClass("hide");
    $(elem).parent().parent().children("input").prop("disabled", true);
}

function saveColSpan(elem, page, group){
    $(elem).parent().toggleClass("hide");
    $(elem).parent().parent().children("button").toggleClass("hide");
    $(elem).parent().parent().children("input").prop("disabled", true);

    settingsJson["total" + page + group + "ColSpan"] = parseInt($(elem).parent().parent().children("input").val());

    console.log(settingsJson);


}

//Helper
function swapElements(itemA, itemB, jsonData) {
    var indexA = null;
    var indexB = null;
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].header == itemA) {
            indexA = i;
        }
        if (jsonData[i].header == itemB) {
            indexB = i;
        }
    }
    if (indexA != null && indexB != null) {
        var c = jsonData[indexA];
        jsonData[indexA] = jsonData[indexB];
        jsonData[indexB] = c;
    }

}

function loadSettings() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/getSettings");
    xhttp.onload = function () {
        const response = JSON.parse(this.responseText);
        settingsJson = response;

        //Load SKB Settings
        $("#settingsJsonTextSKB").val(JSON.stringify(settingsJson.SKB_table, null, 2));

        $("#viewColSpanSKB").val(settingsJson.totalViewSKBColSpan);
        $("#analyzeColSpanSKB").val(settingsJson.totalAnalyzeSKBColSpan);
        $("#viewColSpanSapphire").val(settingsJson.totalViewSapphireColSpan);
        $("#analyzeColSpanSapphire").val(settingsJson.totalAnalyzeSapphireColSpan);
        
        generateSKBTableTree(settingsJson.SKB_table);
        generateSKBTable(settingsJson.SKB_table);

        //Load Sapphire settings
        $("#settingsJsonTextSapphire").val(JSON.stringify(settingsJson.Sapphire_table, null, 2));
        generateSapphireTableTree(settingsJson.Sapphire_table);
        generateSapphireTable(settingsJson.Sapphire_table);
    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

loadSettings();