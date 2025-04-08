$("#addFieldBtn").click(function () {
    $("#addFieldBtn").prop("disabled",true);
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
});

function cancelAddField(){
    $("#addFieldBtn").prop("disabled",false);
    $('#add_li').remove();
}

function addField(){

    const fieldName = $("#textFieldName").val();
    $("#table_header").append(`
        <li draggable="true" class="th">
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
                                  <ul class="sub_heading">
                                  </ul>
                                </li>
        
        `);

    $("#addFieldBtn").prop("disabled",false);
    $('#add_li').remove();
}

function delete_heading(elem){
    elem.parentNode.parentNode.parentNode.parentNode.remove();
}

function add_sub_heading(elem){
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

}

function cancelAddSubField(){
    $('.add_li').remove();
}

function addSubField(){

    const sub_field_name = $("#textSubFieldName").val();
    $('.add_li').parent().append(`
        <li>
                                      <span class="badge rounded-pill bg-warning">` + sub_field_name +`</span>
                                      <button type="button" class="btn btn-sm" onclick="delete_sub_heading(this)"><i class="fa-solid fa-xmark text-danger"></i></button>
        </li>
        `);
    $('.add_li').remove();

}

function delete_sub_heading(elem){
    $(elem).parent().remove();
}