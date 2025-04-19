
function loadRoster() {
    $.ajax({
        url: '/roster/getRoster',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // $('#roster').empty();
            // $.each(data, function(index, player) {
            //     $('#roster').append('<li>' + player.name + '</li>');
            // });
            console.log(data);
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
    $.ajax({
        url: '/roster/clearRoster',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            // Handle success
        },
        error: function (xhr, status, error) {
            console.error('Error clearing roster:', error);
        }
    });
}


loadRoster();

