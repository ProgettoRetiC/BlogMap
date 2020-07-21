/* Funzione per rendere possibile la modifica della recensione */
function modifica(){
    $("#idTesto").prop("disabled",false);
    $("#mandaRecensione").prop("disabled",false);
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = gestisciResponse;
    httpRequest.open("GET", "htm/ModificaRiga2.htm", true);
    httpRequest.send();
    function gestisciResponse(e) {
        if (e.target.readyState == XMLHttpRequest.DONE && e.target.status == 200) {
            document.getElementById("rigaCommento").innerHTML = e.target.responseText;
        }
    }
}

/* Funzione per disabilitare la modifica della recensione */
function annulla(){
    $("#idTesto").prop("disabled",true);
    $("#formModificaRecensione")[0].reset();
    for(i=1;i<$('.valutato').val();i++){
        $("#immagineStella"+i).prop("src","Immagini/Stella.png");
    }
    $("#immagineStella"+i).prop("src","Immagini/Stella.png");
    $("#radioStelle"+i).prop("checked",true);
    i++;
    for(i;i<6;i++){
        $("#immagineStella"+i).prop("src","Immagini/StellaVuota.png");
    }
    $("#mandaRecensione").prop("disabled",true);
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = gestisciResponse;
    httpRequest.open("GET", "htm/ModificaRiga.htm", true);
    httpRequest.send();
    function gestisciResponse(e) {
        if (e.target.readyState == XMLHttpRequest.DONE && e.target.status == 200) {
            document.getElementById("rigaCommento").innerHTML = e.target.responseText;
        }
    }
}

$(document).ready(function(){
    /* Verifica la data aggiunta sia corretta */
    $('#prenotaButton').click(function(){
        oggi = new Date();
        giorno = oggi.getDate();
        mese = oggi.getMonth()+1;
        anno = oggi.getYear();
        ora= oggi.getHours();
        minuti= oggi.getMinutes();
        if($('#giorno').val()==''){
            $('#controlloPrenotazione').html('Non è stata inserita alcuna data');
            return false;
        }
        if($('#orario').val()==''){
            $('#controlloPrenotazione').html('Non è stata inserito alcun orario');
            return false;
        }
        data = $('#giorno').val().split('-');
        time=  $('#orario').val().split(':');
        if(time[0]<ora && data[2]<=giorno || time[1]<minuti && time[0]<ora && data[2]<=giorno ){
            $('#controlloPrenotazione').html('L orario inserito non è valido');
            return false;
        }
        else if(data[0]<anno || (data[0]==anno && data[1]<mese) || (data[0]==anno && data[1]==mese && data[2]<giorno)){
            $('#controlloPrenotazione').html('La data inserita non è valida');
            return false;
        }
        else{
            return true;
        }
    })

    /* Gestione della chiusura del modal */
    $('#calendario').on('hide.bs.modal', function () {
        $('#giorno').val('');
        $('#controlloPrenotazione').html("");
        $('#orario').val('');
    });

    /* Verifica che gli input inseriti nella recensione siano corretti */
    $('#inviaRec').click(function(){
        if($('#idTesto').val().length<1){
            alert("Non hai inserito la recensione");
            return false;
        }
        else if($('#idTesto').val().length>2000){
            alert("La recensione inserita supera i 2000 caratteri");
            return false;
        }
        if(!$("input[name='stelle']:checked").val()) {
            alert('Devi inserire una valutazione');
            return false;
         }
    })

    /* Verifica che gli input inseriti nella modifica della recensione siano corretti */
    $('#mandaRecensione').click(function(){
        if($('#idTesto').val().length<1){
            alert("Non hai inserito la recensione");
            return false;
        }
        else if($('#idTesto').val().length>2000){
            alert("La recensione inserita supera i 2000 caratteri");
            return false;
        }
        if(!$("input[name='stelle']:checked").val()) {
            alert('Devi inserire una valutazione');
            return false;
         }
    })

    /* Funzioni per la gestione delle stelle di valutazione */
    $('#immagineStella1').click(function(){
        if(!$('#idTesto').prop('disabled')){
            $('#radioStelle1').prop('checked', true);
            $("#immagineStella1").prop("src","Immagini/Stella.png");
            $("#immagineStella2").prop("src","Immagini/StellaVuota.png");
            $("#immagineStella3").prop("src","Immagini/StellaVuota.png");
            $("#immagineStella4").prop("src","Immagini/StellaVuota.png");
            $("#immagineStella5").prop("src","Immagini/StellaVuota.png");
        }
    });

    $('#immagineStella2').click(function(){
        if(!$('#idTesto').prop('disabled')){
            $('#radioStelle2').prop('checked', true);
            $("#immagineStella1").prop("src","Immagini/Stella.png");
            $("#immagineStella2").prop("src","Immagini/Stella.png");
            $("#immagineStella3").prop("src","Immagini/StellaVuota.png");
            $("#immagineStella4").prop("src","Immagini/StellaVuota.png");
            $("#immagineStella5").prop("src","Immagini/StellaVuota.png");
        }
    });

    $('#immagineStella3').click(function(){
        if(!$('#idTesto').prop('disabled')){
            $('#radioStelle3').prop('checked', true);
            $("#immagineStella1").prop("src","Immagini/Stella.png");
            $("#immagineStella2").prop("src","Immagini/Stella.png");
            $("#immagineStella3").prop("src","Immagini/Stella.png");
            $("#immagineStella4").prop("src","Immagini/StellaVuota.png");
            $("#immagineStella5").prop("src","Immagini/StellaVuota.png");
        }
    });

    $('#immagineStella4').click(function(){
        if(!$('#idTesto').prop('disabled')){
            $('#radioStelle4').prop('checked', true);
            $("#immagineStella1").prop("src","Immagini/Stella.png");
            $("#immagineStella2").prop("src","Immagini/Stella.png");
            $("#immagineStella3").prop("src","Immagini/Stella.png");
            $("#immagineStella4").prop("src","Immagini/Stella.png");
            $("#immagineStella5").prop("src","Immagini/StellaVuota.png");
        }
    });

    $('#immagineStella5').click(function(){
        if(!$('#idTesto').prop('disabled')){
            $('#radioStelle5').prop('checked', true);
            $("#immagineStella1").prop("src","Immagini/Stella.png");
            $("#immagineStella2").prop("src","Immagini/Stella.png");
            $("#immagineStella3").prop("src","Immagini/Stella.png");
            $("#immagineStella4").prop("src","Immagini/Stella.png");
            $("#immagineStella5").prop("src","Immagini/Stella.png");
        }
    });

    /* Setta la altezza dello sfondo */
    $('#sfondoLuogo').css('height', $('#footer2').offset().top);

    /* Gestione del reset */
    $("#resetLuogo").click(function(){
        for(i=1;i<6;i++){
            $("#immagineStella"+i).prop("src","Immagini/StellaVuota.png");
        }
    })
})
