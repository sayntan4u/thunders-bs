// Activity Search functionality
$('#searchActivity').on('click', function () {
    getData();
});

var settingsJson = {};

function sumData() {

    var list = document.getElementsByClassName("list");
    var networkingDone = document.getElementsByClassName("networkingDone");
    var networkingTarget = document.getElementsByClassName("networkingTarget");
    var infosDone = document.getElementsByClassName("infosDone");
    var infosTarget = document.getElementsByClassName("infosTarget");
    var reinfosDone = document.getElementsByClassName("reinfosDone");
    var reinfosTarget = document.getElementsByClassName("reinfosTarget");
    var meetupsDone = document.getElementsByClassName("meetupsDone");
    var meetupsTarget = document.getElementsByClassName("meetupsTarget");
    var inviDone = document.getElementsByClassName("invisDone");
    var inviTarget = document.getElementsByClassName("invisTarget");
    var plans = document.getElementsByClassName("plans");
    var pendingPlans = document.getElementsByClassName("pendingPlans");



    var totalList = 0;
    var totalNetworkingDone = 0;
    var totalNetworkingTarget = 0;
    var totalInfosDone = 0;
    var totalInfosTarget = 0;
    var totalReinfosDone = 0;
    var totalReinfosTarget = 0;
    var totalMeetupDone = 0;
    var totalMeetupTarget = 0;
    var totalInviDone = 0;
    var totalInviTarget = 0;
    var totalPlanDone = 0;
    var totalPendingPlans = 0;

    for (let index = 0; index < list.length; index++) {
        totalList = totalList + Number(list[index].value);
        totalNetworkingDone = totalNetworkingDone + Number(networkingDone[index].value);
        totalNetworkingTarget = totalNetworkingTarget + Number(networkingTarget[index].value);
        totalInfosDone = totalInfosDone + Number(infosDone[index].value);
        totalInfosTarget = totalInfosTarget + Number(infosTarget[index].value);
        totalReinfosDone = totalReinfosDone + Number(reinfosDone[index].value);
        totalReinfosTarget = totalReinfosTarget + Number(reinfosTarget[index].value);
        totalMeetupDone = totalMeetupDone + Number(meetupsDone[index].value);
        totalMeetupTarget = totalMeetupTarget + Number(meetupsTarget[index].value);
        totalInviDone = totalInviDone + Number(inviDone[index].value);
        totalInviTarget = totalInviTarget + Number(inviTarget[index].value);
        totalPlanDone = totalPlanDone + Number(plans[index].value);
        totalPendingPlans = totalPendingPlans + Number(pendingPlans[index].value);
    }

    // document.getElementsByClassName("totalList")[0].innerHTML = totalList;
    document.getElementsByClassName("totalNetworkingDone")[0].innerHTML = totalNetworkingDone;
    document.getElementsByClassName("totalNetworkingTarget")[0].innerHTML = totalNetworkingTarget;
    document.getElementsByClassName("totalInfosDone")[0].innerHTML = totalInfosDone;
    document.getElementsByClassName("totalInfosTarget")[0].innerHTML = totalInfosTarget;
    document.getElementsByClassName("totalReinfosDone")[0].innerHTML = totalReinfosDone;
    document.getElementsByClassName("totalReinfosTarget")[0].innerHTML = totalReinfosTarget;
    document.getElementsByClassName("totalMeetupDone")[0].innerHTML = totalMeetupDone;
    document.getElementsByClassName("totalMeetupTarget")[0].innerHTML = totalMeetupTarget;
    document.getElementsByClassName("totalInviDone")[0].innerHTML = totalInviDone;
    document.getElementsByClassName("totalInviTarget")[0].innerHTML = totalInviTarget;
    document.getElementsByClassName("totalPlanDone")[0].innerHTML = totalPlanDone;
    document.getElementsByClassName("totalPendingPlans")[0].innerHTML = totalPendingPlans;
}

function sumSapphireData() {

    var nodeCount = document.getElementsByClassName("nodeCount-Sapphire");
    var networkingDone = document.getElementsByClassName("networkingDone-Sapphire");
    var infosDone = document.getElementsByClassName("infosDone-Sapphire");
    var reinfosDone = document.getElementsByClassName("reinfosDone-Sapphire");
    var meetupsDone = document.getElementsByClassName("meetupsDone-Sapphire");
    var inviDone = document.getElementsByClassName("invisDone-Sapphire");
    var plans = document.getElementsByClassName("plans-Sapphire");
    var pendingPlans = document.getElementsByClassName("pendingPlans-Sapphire");
    var secondMeetings = document.getElementsByClassName("secondMeetings-Sapphire");
    var uv = document.getElementsByClassName("uv-Sapphire");



    var totalNodeCount = 0;
    var totalNetworkingDone = 0;
    var totalInfosDone = 0;
    var totalReinfosDone = 0;
    var totalMeetupDone = 0;
    var totalInviDone = 0;
    var totalPlanDone = 0;
    var totalPendingPlans = 0;
    var totalSecondMeetings = 0;
    var totalUV = 0;

    for (let index = 0; index < nodeCount.length; index++) {
        totalNodeCount = totalNodeCount + Number(nodeCount[index].value);
        totalNetworkingDone = totalNetworkingDone + Number(networkingDone[index].value);
        totalInfosDone = totalInfosDone + Number(infosDone[index].value);
        totalReinfosDone = totalReinfosDone + Number(reinfosDone[index].value);
        totalMeetupDone = totalMeetupDone + Number(meetupsDone[index].value);
        totalInviDone = totalInviDone + Number(inviDone[index].value);
        totalPlanDone = totalPlanDone + Number(plans[index].value);
        totalPendingPlans = totalPendingPlans + Number(pendingPlans[index].value);
        totalSecondMeetings = totalSecondMeetings + Number(secondMeetings[index].value);
        totalUV = totalUV + Number(uv[index].value);
    }

    document.getElementsByClassName("totalNodeCount")[0].innerHTML = totalNodeCount;
    document.getElementsByClassName("totalNetworkingDone-Sapphire")[0].innerHTML = totalNetworkingDone;
    document.getElementsByClassName("totalInfosDone-Sapphire")[0].innerHTML = totalInfosDone;
    document.getElementsByClassName("totalReinfosDone-Sapphire")[0].innerHTML = totalReinfosDone;
    document.getElementsByClassName("totalMeetupDone-Sapphire")[0].innerHTML = totalMeetupDone;
    document.getElementsByClassName("totalInviDone-Sapphire")[0].innerHTML = totalInviDone;
    document.getElementsByClassName("totalPlanDone-Sapphire")[0].innerHTML = totalPlanDone;
    document.getElementsByClassName("totalPendingPlans-Sapphire")[0].innerHTML = totalPendingPlans;
    document.getElementsByClassName("totalSecondMeetings")[0].innerHTML = totalSecondMeetings;
    document.getElementsByClassName("totalUV")[0].innerHTML = totalUV;
}

function getData() {
    $("#dataTable").addClass("hide");
    $("#dataTableSapphire").addClass("hide");
    $("#prevWeekAcordion").addClass("hide");
    $("#prevWeekAcordionSapphire").addClass("hide");

    $(".accordion-button").addClass("collapsed");
    $(".accordion-button").prop("aria-expanded", false);
    $(".accordion-collapse").removeClass("show");

    $(".loading").removeClass("hide");

    var wk = document.getElementById("inputWeek").value;
    var yr = document.getElementById("inputYear").value;
    var groupSearch = $("#groupSelect").val();

    // console.log(groupSearch);

    const data = { week: wk, year: yr, group: groupSearch };

    // console.log(data);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        // alert(JSON.parse(this.responseText).length);

        const response = JSON.parse(this.responseText);
        console.log(response);

        if (groupSearch == "SKB") {
            $(".skbData").html("");

            for (let i = 0; i < response.length; i++) {
                $(".skbData").append(`<tr>
                <th scope="row" class="middle">${response[i].sl}</th>
                <td>${response[i].name}</td>
                <td><input type="text" class="form-control bg-info list ${response[i].name + '-list'}" value="${(response[i].list > 0) ? response[i].list : ''}" onchange="valueChanged('${response[i].name}', 'list')"></td>
                <td><input type="text" class="form-control done_data networkingDone ${response[i].name + '-networkingDone'}" value="${(response[i].networkingDone > 0) ? response[i].networkingDone : ''}" onchange="valueChanged('${response[i].name}', 'networkingDone')"></td>
                <td><input type="text" class="form-control bg-warning networkingTarget ${response[i].name + '-networkingTarget'}" value="${(response[i].networkingTarget > 0) ? response[i].networkingTarget : ''}" onchange="valueChanged('${response[i].name}', 'networkingTarget')"></td>
                <td><input type="text" class="form-control done_data infosDone ${response[i].name + '-infosDone'}" value="${(response[i].infosDone > 0) ? response[i].infosDone : ''}" onchange="valueChanged('${response[i].name}', 'infosDone')"></td>
                <td><input type="text" class="form-control bg-warning infosTarget ${response[i].name + '-infosTarget'}" value="${(response[i].infosTarget > 0) ? response[i].infosTarget : ''}" onchange="valueChanged('${response[i].name}', 'infosTarget')"></td>
                <td><input type="text" class="form-control done_data reinfosDone ${response[i].name + '-reinfosDone'}" value="${(response[i].reinfosDone > 0) ? response[i].reinfosDone : ''}" onchange="valueChanged('${response[i].name}', 'reinfosDone')"></td>
                <td><input type="text" class="form-control bg-warning reinfosTarget ${response[i].name + '-reinfosTarget'}" value="${(response[i].reinfosTarget > 0) ? response[i].reinfosTarget : ''}" onchange="valueChanged('${response[i].name}', 'reinfosTarget')"></td>
                <td><input type="text" class="form-control done_data meetupsDone ${response[i].name + '-meetupsDone'}" value="${(response[i].meetupsDone > 0) ? response[i].meetupsDone : ''}" onchange="valueChanged('${response[i].name}', 'meetupsDone')"></td>
                <td><input type="text" class="form-control bg-warning meetupsTarget ${response[i].name + '-meetupsTarget'}" value="${(response[i].meetupsTarget > 0) ? response[i].meetupsTarget : ''}" onchange="valueChanged('${response[i].name}', 'meetupsTarget')"></td>
                <td><input type="text" class="form-control done_data invisDone ${response[i].name + '-invisDone'}" value="${(response[i].invisDone > 0) ? response[i].invisDone : ''}" onchange="valueChanged('${response[i].name}', 'invisDone')"></td>
                <td><input type="text" class="form-control bg-warning invisTarget ${response[i].name + '-invisTarget'}" value="${(response[i].invisTarget > 0) ? response[i].invisTarget : ''}" onchange="valueChanged('${response[i].name}', 'invisTarget')"></td>
                <td><input type="text" class="form-control bg-success plans ${response[i].name + '-plans'}" value="${(response[i].plans > 0) ? response[i].plans : ''}" onchange="valueChanged('${response[i].name}', 'plans')"></td>
                <td><input type="text" class="form-control bg-plan pendingPlans ${response[i].name + '-pendingPlans'}" value="${(response[i].pendingPlans > 0) ? response[i].pendingPlans : ''}" onchange="valueChanged('${response[i].name}', 'pendingPlans')"></td>
                <td><input type="text" class="form-control remarks ${response[i].name + '-remarks'}" value="${response[i].remarks}" onchange="valueChanged('${response[i].name}', 'remarks')"></td>
              </tr>`);
            }

            $(".skbData").append(`
            <tr class="">
                    
                    <td colspan="3" class="txt-align-center"> <b>Total</b> </td>
                    
                    <th class="txt-align-center done_data totalNetworkingDone"></th>
                    <th class="txt-align-center bg-warning  totalNetworkingTarget"></th>
                    <th class="txt-align-center done_data totalInfosDone"></th>
                    <th class="txt-align-center bg-warning  totalInfosTarget"></th>
                    <th class="txt-align-center done_data totalReinfosDone"></th>
                    <th class="txt-align-center bg-warning  totalReinfosTarget"></th>
                    <th class="txt-align-center done_data totalMeetupDone"></th>
                    <th class="txt-align-center bg-warning  totalMeetupTarget"></th>
                    <th class="txt-align-center done_data totalInviDone"></th>
                    <th class="txt-align-center bg-warning  totalInviTarget"></th>
                    <th class="txt-align-center bg-success totalPlanDone"></th>
                    <th class="txt-align-center bg-plan totalPendingPlans"></th>
                    <th class="txt-align-center"></th>
                  </tr>
            `);
            sumData();

            $(".prevWeek").html("Week " + (wk - 1) + " Data");
            $(".currWeek").html("Week " + wk + " Data");

            $("#dataTable").removeClass("hide");
        } else {
            $(".sapphireData").html("");

            for (let i = 0; i < response.length; i++) {
                $(".sapphireData").append(`<tr>
            <th scope="row" class="middle">${response[i].sl}</th>
            <td>${response[i].name}</td>
            <td><input type="text" class="form-control bg-info nodeCount-Sapphire ${response[i].name + '-nodeCount-Sapphire'}" value="${(response[i].nodeCount > 0) ? response[i].nodeCount : ''}" onchange="valueChanged('${response[i].name}', 'nodeCount', 'Sapphire')"></td>
            <td><input type="text" class="form-control done_data networkingDone-Sapphire ${response[i].name + '-networkingDone-Sapphire'}" value="${(response[i].networkingDone > 0) ? response[i].networkingDone : ''}" onchange="valueChanged('${response[i].name}', 'networkingDone', 'Sapphire')"></td>
            <td><input type="text" class="form-control done_data infosDone-Sapphire ${response[i].name + '-infosDone-Sapphire'}" value="${(response[i].infosDone > 0) ? response[i].infosDone : ''}" onchange="valueChanged('${response[i].name}', 'infosDone', 'Sapphire')"></td>
            <td><input type="text" class="form-control done_data reinfosDone-Sapphire ${response[i].name + '-reinfosDone-Sapphire'}" value="${(response[i].reinfosDone > 0) ? response[i].reinfosDone : ''}" onchange="valueChanged('${response[i].name}', 'reinfosDone', 'Sapphire')"></td>
            <td><input type="text" class="form-control done_data meetupsDone-Sapphire ${response[i].name + '-meetupsDone-Sapphire'}" value="${(response[i].meetupsDone > 0) ? response[i].meetupsDone : ''}" onchange="valueChanged('${response[i].name}', 'meetupsDone', 'Sapphire')"></td>
            <td><input type="text" class="form-control done_data invisDone-Sapphire ${response[i].name + '-invisDone-Sapphire'}" value="${(response[i].invisDone > 0) ? response[i].invisDone : ''}" onchange="valueChanged('${response[i].name}', 'invisDone', 'Sapphire')"></td>
            <td><input type="text" class="form-control bg-success plans-Sapphire ${response[i].name + '-plans-Sapphire'}" value="${(response[i].plans > 0) ? response[i].plans : ''}" onchange="valueChanged('${response[i].name}', 'plans', 'Sapphire')"></td>
            <td><input type="text" class="form-control done_data  pendingPlans-Sapphire ${response[i].name + '-pendingPlans-Sapphire'}" value="${(response[i].pendingPlans > 0) ? response[i].pendingPlans : ''}" onchange="valueChanged('${response[i].name}', 'pendingPlans', 'Sapphire')"></td>
            <td><input type="text" class="form-control bg-plan secondMeetings-Sapphire ${response[i].name + '-secondMeetings-Sapphire'}" value="${(response[i].secondMeetings > 0) ? response[i].secondMeetings : ''}" onchange="valueChanged('${response[i].name}', 'secondMeetings', 'Sapphire')"></td>
            <td><input type="text" class="form-control bg-plan uv-Sapphire ${response[i].name + '-uv-Sapphire'}" value="${(response[i].uv > 0) ? response[i].uv : ''}" onchange="valueChanged('${response[i].name}', 'uv', 'Sapphire')"></td>
            <td><input type="text" class="form-control remarks-Sapphire ${response[i].name + '-remarks-Sapphire'}" value="${response[i].remarks}" onchange="valueChanged('${response[i].name}', 'remarks', 'Sapphire')"></td>
            </tr>`);
            }

            $(".sapphireData").append(`
        <tr class="">
                
                <td colspan="2" class="txt-align-center"> <b>Total</b> </td>
                <th class="txt-align-center bg-info totalNodeCount"></th>
                <th class="txt-align-center done_data totalNetworkingDone-Sapphire"></th>
                <th class="txt-align-center done_data totalInfosDone-Sapphire"></th>
                <th class="txt-align-center done_data totalReinfosDone-Sapphire"></th>
                <th class="txt-align-center done_data totalMeetupDone-Sapphire"></th>
                <th class="txt-align-center done_data totalInviDone-Sapphire"></th>
                <th class="txt-align-center bg-success totalPlanDone-Sapphire"></th>
                <th class="txt-align-center done_data  totalPendingPlans-Sapphire"></th>
                <th class="txt-align-center bg-plan totalSecondMeetings"></th>
                <th class="txt-align-center bg-plan totalUV"></th>
                <th class="txt-align-center"></th>
        </tr>
        `);
            // sumData();
            sumSapphireData();

            $(".prevWeek").html("Week " + (wk - 1) + " Data");
            $(".currWeek").html("Week " + wk + " Data");

            $("#dataTableSapphire").removeClass("hide");
        }
        
        $(".loading").addClass("hide");

        if (wk > 1 && groupSearch == "SKB") {
            $("#prevWeekAcordion").removeClass("hide");
            getPrevWeekData(wk - 1, yr);
        }
        if (wk > 1 && groupSearch == "Sapphire") {
            $("#prevWeekAcordionSapphire").removeClass("hide");
            getPrevWeekDataSapphire(wk - 1, yr);
        }

    }
    xhttp.open("POST", "getData");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
    // $('.alert').addClass("show");
}

function valueChanged(docName, triggeredFrom, group = "SKB") {
    // console.log(docName);
    // console.log(triggeredFrom);
    // console.log($("." + docName + "-" + triggeredFrom).val());
    var wk = document.getElementById("inputWeek").value;
    var yr = document.getElementById("inputYear").value;

    if(group == "SKB"){
        var value_input = $("." + docName + "-" + triggeredFrom).val();


        if (value_input == '' && triggeredFrom != "remarks") {
            value_input = 0;
        }
    
        const data = { week: wk, year: yr, name: docName, fieldName: triggeredFrom, value: value_input, group : "SKB" };
    
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "updateUser");
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(data));
        sumData();
    }else{
        var value_input = $("." + docName + "-" + triggeredFrom + "-Sapphire").val();


        if (value_input == '' && triggeredFrom != "remarks-Sapphire") {
            value_input = 0;
        }
    
        const data = { week: wk, year: yr, name: docName, fieldName: triggeredFrom, value: value_input, group : "Sapphire" };
    
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "updateUser");
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(data));
        sumSapphireData();
    }

    
}

function getPrevWeekData(wk, yr) {
    $("#prevWeekTable").addClass("hide");
    $(".loading_prev").removeClass("hide");

    const data = { week: wk.toString(), year: yr , group: "SKB"};

    // console.log(data);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        // alert(JSON.parse(this.responseText).length);

        const response = JSON.parse(this.responseText);

        $(".skbPrevData").html("");

        for (let i = 0; i < response.length; i++) {
            $(".skbPrevData").append(`<tr>
            <th scope="row" class="middle">${response[i].sl}</th>
            <td>${response[i].name}</td>
            <td class="txt-align-center bg-info plist">${response[i].list}</td>
            <td class="txt-align-center done_data pnetworkingDone">${response[i].networkingDone}</td>
            <td class="txt-align-center bg-warning pnetworkingTarget">${response[i].networkingTarget}</td>
            <td class="txt-align-center done_data pinfosDone">${response[i].infosDone}</td>
            <td class="txt-align-center bg-warning pinfosTarget">${response[i].infosTarget}</td>
            <td class="txt-align-center done_data preinfosDone">${response[i].reinfosDone}</td>
            <td class="txt-align-center bg-warning preinfosTarget">${response[i].reinfosTarget}</td>
            <td class="txt-align-center done_data pmeetupsDone">${response[i].meetupsDone}</td>
            <td class="txt-align-center bg-warning pmeetupsTarget">${response[i].meetupsTarget}</td>
            <td class="txt-align-center done_data pinvisDone">${response[i].invisDone}</td>
            <td class="txt-align-center bg-warning pinvisTarget">${response[i].invisTarget}</td>
            <td class="txt-align-center bg-success pplans">${response[i].plans}</td>
            <td class="txt-align-center bg-plan ppendingPlans">${response[i].pendingPlans}</td>
          </tr>`);
        }

        $(".skbPrevData").append(`
        <tr class="">
                
                <td colspan="3" class="txt-align-center"> <b>Total</b> </td>
                
                <th class="txt-align-center done_data ptotalNetworkingDone"></th>
                <th class="txt-align-center bg-warning  ptotalNetworkingTarget"></th>
                <th class="txt-align-center done_data ptotalInfosDone"></th>
                <th class="txt-align-center bg-warning  ptotalInfosTarget"></th>
                <th class="txt-align-center done_data ptotalReinfosDone"></th>
                <th class="txt-align-center bg-warning  ptotalReinfosTarget"></th>
                <th class="txt-align-center done_data ptotalMeetupDone"></th>
                <th class="txt-align-center bg-warning  ptotalMeetupTarget"></th>
                <th class="txt-align-center done_data ptotalInviDone"></th>
                <th class="txt-align-center bg-warning  ptotalInviTarget"></th>
                <th class="txt-align-center bg-success ptotalPlanDone"></th>
                <th class="txt-align-center bg-plan ptotalPendingPlans"></th>
              </tr>
        `);
        sumPrevData();

        $("#prevWeekTable").removeClass("hide");
        $(".loading_prev").addClass("hide");
    }
    xhttp.open("POST", "getData");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}

function getPrevWeekDataSapphire(wk, yr) {
    $("#prevWeekTableSapphire").addClass("hide");
    $(".loading_prev_sapphire").removeClass("hide");

    const data = { week: wk.toString(), year: yr , group: "Sapphire"};

    // console.log(data);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        // alert(JSON.parse(this.responseText).length);

        const response = JSON.parse(this.responseText);

        $(".sapphirePrevData").html("");

        for (let i = 0; i < response.length; i++) {
            $(".sapphirePrevData").append(`<tr>
            <th scope="row" class="middle">${response[i].sl}</th>
                    <td>${response[i].name}</td>
                    <td class="txt-align-center bg-info pnodeCount-Sapphire">${response[i].nodeCount}</td>
                    <td class="txt-align-center done_data pnetworkingDone-Sapphire">${response[i].networkingDone}</td>
                    <td class="txt-align-center done_data pinfosDone-Sapphire">${response[i].infosDone}</td>
                    <td class="txt-align-center done_data preinfosDone-Sapphire">${response[i].reinfosDone}</td>
                    <td class="txt-align-center done_data pmeetupsDone-Sapphire">${response[i].meetupsDone}</td>
                    <td class="txt-align-center done_data pinvisDone-Sapphire">${response[i].invisDone}</td>
                    <td class="txt-align-center bg-success pplans-Sapphire">${response[i].plans}</td>
                    <td class="txt-align-center done_data ppendingPlans-Sapphire">${response[i].pendingPlans}</td>
                    <td class="txt-align-center bg-plan psecondMeetings-Sapphire">${response[i].secondMeetings}</td>
                    <td class="txt-align-center bg-plan puv-Sapphire">${response[i].uv}</td>
          </tr>`);
        }

        $(".sapphirePrevData").append(`
        <tr class="">
                
                 <td colspan="2" class="txt-align-center"> <b>Total</b> </td>
                        <th class="txt-align-center bg-info ptotalNodeCount"></th>
                        <th class="txt-align-center done_data ptotalNetworkingDone-Sapphire"></th>
                        <th class="txt-align-center done_data ptotalInfosDone-Sapphire"></th>
                        <th class="txt-align-center done_data ptotalReinfosDone-Sapphire"></th>
                        <th class="txt-align-center done_data ptotalMeetupDone-Sapphire"></th>
                        <th class="txt-align-center done_data ptotalInviDone-Sapphire"></th>
                        <th class="txt-align-center bg-success ptotalPlanDone-Sapphire"></th>
                        <th class="txt-align-center done_data ptotalPendingPlans-Sapphire"></th>
                        <th class="txt-align-center bg-plan ptotalSecondMeetings"></th>
                        <th class="txt-align-center bg-plan ptotalUV"></th>
              </tr>
        `);
        sumPrevDataSapphire();

        $("#prevWeekTableSapphire").removeClass("hide");
        $(".loading_prev_sapphire").addClass("hide");
    }
    xhttp.open("POST", "getData");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}

function sumPrevData() {

    var list = document.getElementsByClassName("plist");
    var networkingDone = document.getElementsByClassName("pnetworkingDone");
    var networkingTarget = document.getElementsByClassName("pnetworkingTarget");
    var infosDone = document.getElementsByClassName("pinfosDone");
    var infosTarget = document.getElementsByClassName("pinfosTarget");
    var reinfosDone = document.getElementsByClassName("preinfosDone");
    var reinfosTarget = document.getElementsByClassName("preinfosTarget");
    var meetupsDone = document.getElementsByClassName("pmeetupsDone");
    var meetupsTarget = document.getElementsByClassName("pmeetupsTarget");
    var inviDone = document.getElementsByClassName("pinvisDone");
    var inviTarget = document.getElementsByClassName("pinvisTarget");
    var plans = document.getElementsByClassName("pplans");
    var pendingPlans = document.getElementsByClassName("ppendingPlans");



    var totalList = 0;
    var totalNetworkingDone = 0;
    var totalNetworkingTarget = 0;
    var totalInfosDone = 0;
    var totalInfosTarget = 0;
    var totalReinfosDone = 0;
    var totalReinfosTarget = 0;
    var totalMeetupDone = 0;
    var totalMeetupTarget = 0;
    var totalInviDone = 0;
    var totalInviTarget = 0;
    var totalPlanDone = 0;
    var totalPendingPlans = 0;

    for (let index = 0; index < list.length; index++) {
        totalList = totalList + Number(list[index].innerHTML);
        totalNetworkingDone = totalNetworkingDone + Number(networkingDone[index].innerHTML);
        totalNetworkingTarget = totalNetworkingTarget + Number(networkingTarget[index].innerHTML);
        totalInfosDone = totalInfosDone + Number(infosDone[index].innerHTML);
        totalInfosTarget = totalInfosTarget + Number(infosTarget[index].innerHTML);
        totalReinfosDone = totalReinfosDone + Number(reinfosDone[index].innerHTML);
        totalReinfosTarget = totalReinfosTarget + Number(reinfosTarget[index].innerHTML);
        totalMeetupDone = totalMeetupDone + Number(meetupsDone[index].innerHTML);
        totalMeetupTarget = totalMeetupTarget + Number(meetupsTarget[index].innerHTML);
        totalInviDone = totalInviDone + Number(inviDone[index].innerHTML);
        totalInviTarget = totalInviTarget + Number(inviTarget[index].innerHTML);
        totalPlanDone = totalPlanDone + Number(plans[index].innerHTML);
        totalPendingPlans = totalPendingPlans + Number(pendingPlans[index].innerHTML);
    }

    // document.getElementsByClassName("totalList")[0].innerHTML = totalList;
    document.getElementsByClassName("ptotalNetworkingDone")[0].innerHTML = totalNetworkingDone;
    document.getElementsByClassName("ptotalNetworkingTarget")[0].innerHTML = totalNetworkingTarget;
    document.getElementsByClassName("ptotalInfosDone")[0].innerHTML = totalInfosDone;
    document.getElementsByClassName("ptotalInfosTarget")[0].innerHTML = totalInfosTarget;
    document.getElementsByClassName("ptotalReinfosDone")[0].innerHTML = totalReinfosDone;
    document.getElementsByClassName("ptotalReinfosTarget")[0].innerHTML = totalReinfosTarget;
    document.getElementsByClassName("ptotalMeetupDone")[0].innerHTML = totalMeetupDone;
    document.getElementsByClassName("ptotalMeetupTarget")[0].innerHTML = totalMeetupTarget;
    document.getElementsByClassName("ptotalInviDone")[0].innerHTML = totalInviDone;
    document.getElementsByClassName("ptotalInviTarget")[0].innerHTML = totalInviTarget;
    document.getElementsByClassName("ptotalPlanDone")[0].innerHTML = totalPlanDone;
    document.getElementsByClassName("ptotalPendingPlans")[0].innerHTML = totalPendingPlans;
}

function sumPrevDataSapphire() {

    var nodeCount = document.getElementsByClassName("pnodeCount-Sapphire");
    var networkingDone = document.getElementsByClassName("pnetworkingDone-Sapphire");
    var infosDone = document.getElementsByClassName("pinfosDone-Sapphire");
    var reinfosDone = document.getElementsByClassName("preinfosDone-Sapphire");
    var meetupsDone = document.getElementsByClassName("pmeetupsDone-Sapphire");
    var inviDone = document.getElementsByClassName("pinvisDone-Sapphire");
    var plans = document.getElementsByClassName("pplans-Sapphire");
    var pendingPlans = document.getElementsByClassName("ppendingPlans-Sapphire");
    var secondMeetings = document.getElementsByClassName("psecondMeetings-Sapphire");
    var uv = document.getElementsByClassName("puv-Sapphire");



    var totalNodeCount = 0;
    var totalNetworkingDone = 0;
    var totalInfosDone = 0;
    var totalReinfosDone = 0;
    var totalMeetupDone = 0;
    var totalInviDone = 0;
    var totalPlanDone = 0;
    var totalPendingPlans = 0;
    var totalSecondMeetings = 0;
    var totalUV = 0;

    for (let index = 0; index < nodeCount.length; index++) {
        totalNodeCount = totalNodeCount + Number(nodeCount[index].innerHTML);
        totalNetworkingDone = totalNetworkingDone + Number(networkingDone[index].innerHTML);
        totalInfosDone = totalInfosDone + Number(infosDone[index].innerHTML);
        totalReinfosDone = totalReinfosDone + Number(reinfosDone[index].innerHTML);
        totalMeetupDone = totalMeetupDone + Number(meetupsDone[index].innerHTML);
        totalInviDone = totalInviDone + Number(inviDone[index].innerHTML);
        totalPlanDone = totalPlanDone + Number(plans[index].innerHTML);
        totalPendingPlans = totalPendingPlans + Number(pendingPlans[index].innerHTML);
        totalSecondMeetings = totalSecondMeetings + Number(secondMeetings[index].innerHTML);
        totalUV = totalUV + Number(uv[index].innerHTML);
    }

    document.getElementsByClassName("ptotalNodeCount")[0].innerHTML = totalNodeCount;
    document.getElementsByClassName("ptotalNetworkingDone-Sapphire")[0].innerHTML = totalNetworkingDone;
    document.getElementsByClassName("ptotalInfosDone-Sapphire")[0].innerHTML = totalInfosDone;
    document.getElementsByClassName("ptotalReinfosDone-Sapphire")[0].innerHTML = totalReinfosDone;
    document.getElementsByClassName("ptotalMeetupDone-Sapphire")[0].innerHTML = totalMeetupDone;
    document.getElementsByClassName("ptotalInviDone-Sapphire")[0].innerHTML = totalInviDone;
    document.getElementsByClassName("ptotalPlanDone-Sapphire")[0].innerHTML = totalPlanDone;
    document.getElementsByClassName("ptotalPendingPlans-Sapphire")[0].innerHTML = totalPendingPlans;
    document.getElementsByClassName("ptotalSecondMeetings")[0].innerHTML = totalSecondMeetings;
    document.getElementsByClassName("ptotalUV")[0].innerHTML = totalUV;
}

function generateSKBTable(SKB_table) {

    var isSubHeading = false;

    for (let i = 0; i < SKB_table.length; i++) {

        if (SKB_table[i].sub_heading.length > 0) {
            isSubHeading = true;
            $(".skb_dataTable thead .header").append(`
                <th scope="col" class="txt-align-center text-light bg-dark" colspan="` + SKB_table[i].sub_heading.length + `">` + SKB_table[i].header + `</th>
                `);
        } else {
            $(".skb_dataTable thead .header").append(`
                <th scope="col" class="txt-align-center text-light bg-dark">` + SKB_table[i].header + `</th>
                `);
        }
    }

    if (isSubHeading) {
        for (let i = 0; i < SKB_table.length; i++) {
            if (SKB_table[i].sub_heading.length > 0) {
                for (let j = 0; j < SKB_table[i].sub_heading.length; j++) {
                    $(".skb_dataTable thead .sub_heading").append(`
                        <th scope="col" class="txt-align-center text-light bg-dark">` + SKB_table[i].sub_heading[j] + `</th>
                        `);
                }
            } else {
                $(".skb_dataTable thead .sub_heading").append(`
                    <th scope="col" class="txt-align-center text-light bg-dark"></th>
                    `);
            }

        }
    }
}

function loadSettings() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/getSettings");
    xhttp.onload = function () {
        const response = JSON.parse(this.responseText);
        settingsJson = response;
        generateSKBTable(settingsJson.initTableView.concat(settingsJson.SKB_table , settingsJson.endTable));
    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

loadSettings();