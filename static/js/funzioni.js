$(document).ready(function(){
    /* Gestione immagini di sfondo */
    $(function(){
        $('.fadein img:gt(0)').hide();
        setInterval(function(){$('.fadein :first-child').fadeOut().next('img').fadeIn().end().appendTo('.fadein');}, 3000);
    });

    /* Gestione errori delle select */
    gestisciSelect();
    $("#categoria").change(function(){gestisciSelect();});

    function gestisciSelect(){
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = gestisciResponse;
        if($("#categoria").val()=="cibo"){
            $("#type").prop("disabled",false);
            httpRequest.open("GET", "htm/Cibo.htm", true);
        }
        else if($("#categoria").val()=="cultura"){
            $("#type").prop("disabled",false);
            httpRequest.open("GET", "htm/Cultura.htm", true);
        }
        else if($("#categoria").val()=="culto"){
            $("#type").prop("disabled",false);
            httpRequest.open("GET", "htm/Culto.htm", true);
        }
        else if($("#categoria").val()=="negozi"){
            $("#type").prop("disabled",false);
            httpRequest.open("GET", "htm/Negozi.htm", true);
        }
        else if($("#categoria").val()=="sanità"){
            $("#type").prop("disabled",false);
            httpRequest.open("GET", "htm/Sanità.htm", true);
        }
        else if($("#categoria").val()=="servizi"){
            $("#type").prop("disabled",false);
            httpRequest.open("GET", "htm/Servizi.htm", true);
        }
        else if($("#categoria").val()=="studio"){
            $("#type").prop("disabled",false);
            httpRequest.open("GET", "htm/Studio.htm", true);
        }
        else if($("#categoria").val()=="svago"){
            $("#type").prop("disabled",false);
            httpRequest.open("GET", "htm/Svago.htm", true);
        }
        else{
            $("#type").prop("disabled",true);
            httpRequest.open("GET", "htm/Niente.htm", true);
        }
        httpRequest.send();
        function gestisciResponse(e) {
            if (e.target.readyState == XMLHttpRequest.DONE && e.target.status == 200) {
                document.getElementById("type").innerHTML = e.target.responseText;
            }
        }
    }

    /* Controllo indirizzo */
    $('#Indirizzo').keyup(function(){
        if($('#Indirizzo').val().length==0){
            $('#erroreIndirizzo').html("L'indirizzo deve essere inserito");
        }
        else{
            $('#erroreIndirizzo').html("");
        }
    })

    /* Controllo città */
    $('#Citta').keyup(function(){
    if($('#Citta').val().length==0){
        $('#erroreCitta').html("La città deve essere inserita");
    }
    else{
        $('#erroreCitta').html("");
    }
    })

    $("#submitForm").click(function(){
        if($('#Indirizzo').val().length==0){
            $('#erroreIndirizzo').html("L'indirizzo deve essere inserito");
            return false;
        }
        else{
            $('#erroreIndirizzo').html('');
        }
        if($('#Citta').val().length==0){
            $('#erroreCitta').html("La città deve essere inserita");
            return false;
        }
        else{
            $('#erroreCitta').html('');
        }
        if($("#categoria").val()=="ScegliCategoria"){
            $('#erroreCategoria').html("La categoria deve essere inserita");
            return false;
        }
        else{
            $('#erroreCategoria').html('');
        }
        if($("#type").val()=="ScegliTipo"){
            $('#erroreTipo').html("Il tipo deve essere inserito");
            return false;
        }
        else{
            $('#erroreTipo').html('');
        }
        if($('#migliori').prop('checked')==false && $('#vicini').prop('checked')==false){
            $('#erroreRadio').html("Scegliere il tipo di ricerca");
            return false;
        }
        else{
            $('#erroreRadio').html("");
        }
        return true;
    });

    $("#resetForm").click(function(){
        $('#erroreIndirizzo').html("");
        $('#erroreCitta').html("");
        $('#erroreCategoria').html("");
        $('#erroreTipo').html("");
        $('#erroreRadio').html("");
        $("#type").prop("disabled",true);
        $("#type").val("ScegliTipo");
        $("#categoria").val("ScegliCategoria");
    });
});