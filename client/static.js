$(document).ready(function () {
    $('#login').click(function () {

        data = {
            email: $('#email').val(),
            password: $('#password').val()
        };
        $.ajax({
            type: 'POST',                       // define the type of HTTP verb we want to use (POST for our form)
            url: 'http://localhost:3000/login',           // the url where we want to POST
            data: data,                         // our data object
            dataType: 'text'                    // what type of data do we expect back from the server
        }).done(function (data, _, out) {
            console.log(data);


        }).fail(function (data) {

        });
    });




});
