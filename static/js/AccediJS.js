$(document).ready(function(){
    
    /* Sfocatura sfondo all'entrata del mouse */
    $("#cardAccesso").mouseenter(function(){
        $('#sfondoAccedi').css({ '-webkit-filter': 'blur(3px)',
                                     '-moz-filter': 'blur(3px)',
                                     '-o-filter': 'blur(3px)',
                                     '-ms-filter': 'blur(3px)',
                                     'transition':'.3s ease'});
    });

    /* Reset dell'immagine originale all'uscita del mouse */
    $("#cardAccesso").mouseleave(function(){
        $('#sfondoAccedi').css({ '-webkit-filter': 'blur(0px)',
        '-moz-filter': 'blur(0px)',
        '-o-filter': 'blur(0px)',
        '-ms-filter': 'blur(0px)',
        'transition':'.3s ease'});
    });

    /* Quando lo shake finisce si toglie l'animazione */
    $('#cardAccesso').on("webkitAnimationEnd", function(){
        $("#cardAccesso").css( 'animation','');
    }); 

    /* Verifica dati */
    $('#accediButton').click(function(){
        /* Verifica Email */
        if($('#Email').val().length<1){
            $("#ErroreAcc2").html("L'email deve essere inserita");
            var $div = $('#divErroreAcc2');
            $div.fadeIn(500, function(){ $div.delay(1500).fadeOut(500); });
            $("#cardAccesso").css( 'animation','shake 0.4s');
            return false;
        }
        else if($('#Email').val().trim().match(/[A-z0-9\.\+_-]+@[A-z0-9\._-]+\.[A-z]{2,6}/)==null){
            $("#ErroreAcc2").html("Il formato dell'email non è corretto");
            var $div = $('#divErroreAcc2');
            $div.fadeIn(500, function(){ $div.delay(1500).fadeOut(500); });
            $("#cardAccesso").css( 'animation','shake 0.4s');
            return false;
        }
        else{
            $("#ErroreAcc2").html("");
        }

        /* Verifica Password */
        if($('#Password').val().length<1){
            $("#ErroreAcc2").html("La password deve essere inserita");
            var $div = $('#divErroreAcc2');
            $div.fadeIn(500, function(){ $div.delay(1500).fadeOut(500); });
            $("#cardAccesso").css( 'animation','shake 0.4s');
            return false;
        }
        else if($('#Password').val().length<8){
            $("#ErroreAcc2").html("La password deve essere almeno di 8 caratteri")
            var $div = $('#divErroreAcc2');
            $div.fadeIn(500, function(){ $div.delay(1500).fadeOut(500); });
            $("#cardAccesso").css( 'animation','shake 0.4s');
            return false;
        }
        else{
            $("#ErroreAcc2").html("");
        }

        /* Verifica esistenza campi*/
        if($('#ErroreAcc').html().trim()=="L'email inserita non appartiene ad alcun account"){
            var $div = $('#divErroreAcc');
            $div.fadeIn(500, function(){ $div.delay(1500).fadeOut(500); });
            $("#cardAccesso").css( 'animation','shake 0.4s');
            return false;
        }
        if($('#ErroreAcc').html().trim()=="La password inserita non è corretta"){
            var $div = $('#divErroreAcc');
            $div.fadeIn(500, function(){ $div.delay(1500).fadeOut(500); });
            $("#cardAccesso").css( 'animation','shake 0.4s');
            return false;
        }
    });

    /* Funzione che blocca la submit al momento della digitazione dell'email */
    $('#Email').keydown(function(e){
        if(e.which != 13){
            $("#accediButton").prop("disabled",true);
        }
    });

    /* Funzione che blocca la submit al momento della digitazione della password */
    $('#Password').keydown(function(e){
        if(e.which != 13){
            $("#accediButton").prop("disabled",true);
        }
    });

    /* Caricamento dei dati presi da Accesso.php */
    $('#Email').keyup(function(){
        $("#ErroreAcc").html("");
        if($('#Password').val().length>7){
            var email=$("#Email").val();
            var password=$("#Password").val();
            $("#ErroreAcc").load('http://localhost:3000/Accesso.php',{ 'value2': email, 'value1': password}, function(){
                $("#accediButton").prop("disabled",false);
            });
        }
        else{
            $("#accediButton").prop("disabled",false);
        }
    });

    $('#Password').keyup(function(){
        $("#ErroreAcc").html("");
        if($('#Email').val().length>0){
            var email=$("#Email").val();
            var password=$("#Password").val();
            $("#ErroreAcc").load('http://localhost:3000/Accesso.php',{ 'value2': email, 'value1': password}, function(){
                $("#accediButton").prop("disabled",false);
            });
        }
        else{
            $("#accediButton").prop("disabled",false);
        }
    });
});
