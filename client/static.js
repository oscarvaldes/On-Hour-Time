$(document).ready(function () {
    $('button.addItem').click(function () {

        data = {
            name: $('#add_item').val()
        };
        $.ajax({
            type: 'POST',                       // define the type of HTTP verb we want to use (POST for our form)
            url: 'http://localhost:8080/servlets/Backend',           // the url where we want to POST
            data: data,                         // our data object
            dataType: 'text'                    // what type of data do we expect back from the server
        }).done(function (data, _, out) {
            //console.log(data);
            var newGroceryItem = JSON.parse(data);
            $('#noAislesList').append("<p class='noAisle'>" + newGroceryItem.Item + "<label><input class='check-box' type='checkbox'></label>" + "<input class='aisleInput' placeholder='Enter Aisle' type='text'>" + "</p>");//must append form inline label with checkbox

        }).fail(function (data) {

        });
    });

    $('button.addAisle').click(function () {
        var groceryName;
        var aisleNumber;
        var data;

        $('[type=checkbox]').each(function () {
            if ($(this).is(':checked')) {
                groceryName = $(this).closest('.noAisle').text();
                aisleNumber = $(this).closest('.noAisle').find("input[type=text]").val();
                $(this).closest('.noAisle').remove();
                data = {
                    name: groceryName,
                    aisle: aisleNumber
                };
                $.ajax({
                    type: 'POST',                       // define the type of HTTP verb we want to use (POST for our form)
                    url: 'http://localhost:8080/servlets/Backend',           // the url where we want to POST
                    data: data,                         // our data object
                    dataType: 'text'                    // what type of data do we expect back from the server
                }).done(function (data, _, out) {
                    var groceryObject = JSON.parse(data);
                    $('#aisleTable').append("<tr>" + "<td class='nameItem'>" + groceryObject.Item + "</td>" + "<td>" +"Aisle "+ groceryObject.Aisle + "</td>" + "<td>" + "<button class=\"btn btn-default purchase\">"+"Purchase"+"</button>" + "</td>" + "</tr>");
                    // $('#AislesList').append(groceryObject.Aisle);

                }).fail(function (data) {

                });
            }
        });

    });

    $(document).on('click', 'button.purchase', function(event) {
        var groceryName;
        var data;

        groceryName = $(this).closest('tr').find('.nameItem').text();
        $(this).closest('tr').remove();

        data = {
            name: groceryName
        };
        $.ajax({
            type: 'GET',                       // define the type of HTTP verb we want to use (POST for our form)
            url: 'http://localhost:8080/servlets/Backend',           // the url where we want to POST
            data: data,                         // our data object
            dataType: 'text'                    // what type of data do we expect back from the server
        }).done(function (data, _, out) {
            console.log('Item Deleted');

        }).fail(function (data) {

        });

    });

});
