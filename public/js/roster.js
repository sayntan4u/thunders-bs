
function loadRoster() {
    $.ajax({
        url: '/roster/getRoster',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // $('#roster').empty();
            // $.each(data, function(index, item) {
            //     console.log(item);
            // });
            console.log(data);
            generateRosterTable(data);
        },
        error: function (xhr, status, error) {
            console.error('Error loading roster:', error);
        }
    });
}

function updateRoster(day, time, irName) {
    $.ajax({
        url: '/roster/updateRoster',
        type: 'POST',
        dataType: 'json',
        data: { day: day, time: time, irName: irName },
        success: function (data) {
            // Handle success
        },
        error: function (xhr, status, error) {
            console.error('Error updating roster:', error);
        }
    });
}

function clearRoster() {
    clearRosterTable();
    $.ajax({
        url: '/roster/clearRoster',
        type: 'POST',
        dataType: 'json'
    });
}

function generateRosterTable(data) {
    const weekArray = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const timeArray = ['11AM', '1PM', '3PM', '5PM', '7PM'];
    $('.roster-header tr').empty(); // Clear existing header rows
    $('.roster-body').empty(); // Clear existing body rows

    const headerRow = $('.roster-header tr');
    // headerRow.append('<tr></tr>');
    headerRow.append('<th scope="col" class="bg-dark text-light"><i class="fa-solid fa-clock"></i></th>');
    weekArray.forEach(function (day) {
        headerRow.append('<th scope="col" class="bg-dark text-light">' + day + '</th>');
    });
    // headerRow.append('');


    timeArray.forEach(function (time) {
        const bodyRow = $('<tr></tr>');
        bodyRow.append(`<th scope="row" class="time align-middle bg-dark text-light">${time}</th>`);
        $.each(data, function (index, item) {
            bodyRow.append(`<td class="${item.data[time] == '' ? '' : 'has_data'}"><input type="text" class="form-control ${item.data[time] == '' ? '' : 'has_data'} ${item.day}-${time}" value="${item.data[time]}" onchange='valueChangedRoster(this,"${item.day}","${time}")'></td>`);
        });
        $('.roster-body').append(bodyRow);
    });
}

function clearRosterTable() {
    const weekArray = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const timeArray = ['11AM', '1PM', '3PM', '5PM', '7PM'];

    weekArray.forEach(function (day) {
        timeArray.forEach(function (time) {
            $(`.${day}-${time}`).val(''); // Clear the input field
        });
    });

}

function valueChangedRoster(elem, day, time) {
    const value = $(elem).val();
    if(value != ""){
        $(elem).parent().addClass("has_data");
    }else{
        $(elem).parent().removeClass("has_data");
    }
    updateRoster(day, time, value);
}

loadRoster();

