// Variablen:

// Variablen zur Punkteberechnung:

// Bonus für rasches Zudecken der Karten zu Beginn des Spiels: Bonus = (timelimit_timebonus in Sek. - Zeitdauer Karten sichtbar in Sek.)*factor_timebonus
var timelimit_timebonus = 100; // Zeitspanne, in der Bonuspunkte für das rasche Zudecken der Karten zu Spielbeginn erworben werden können, in Sekunden
var factor_timebonus = 15; // Faktor, mit der die Zeitdifferenz zwischen timelimit und tatsächlicher Zeit multipliziert wird
// Punktzahl bei richtigem Treffer:
var factor_correct = 10; // Punkte für richtigen Treffer: P = Anzahl der noch aufzudeckenden Karten * factor_correct
// Punktabzug bei falscher Karte:
var factor_wrong = 5; // Punktabzug bei falschem Treffer: P = (Anzahl bereits aufgedeckter Karten + 1) * factor_wrong
// Punktabzug für Joker:
var factor_joker = 10; // Punktabzug pro angefangener Sekunde, in der der Joker alle Karten sichtbar macht

// Weitere Variablen:

// Array mit den Firmen- bzw. Produktnamen
var names = new Array(
    "apple",
    "bosch",
    "braun",
    "eads",
    "enbw",
    "google",
    "hp",
    "intel",
    "johndeere",
    "kaercher",
    "kuka",
    "logitech",
    "mercedes",
    "miele",
    "philips",
    "siemens",
    "sony",
    "stihl",
    "thyssenkrupp",
    "zeiss"        
);

var new_names = [];
var cleared_cards = [20];
var names_copy = names.slice(0); // slice(0) bewirkt Kopie, nicht Referenz!

var current_id;
var cards_left = 20;
var timeouts = [];
var timer_start = 0;
var timer_duration = 0;
var currentpoints = 0;
var joker_inuse = false;

$(document).on({
    'pageinit': function() {
        

// Fenstergröße abfragen und danach Größen der Elemente anpassen
        scaleContent();
        // Falls Fenstergröße geändert wird, Elemente erneut anpassen
        $(window).resize(function() {
            scaleContent();
        });
        
        $('.card').click(function(){
               cardClicked(this); 
        });
        
        
        // Bei Klick auf den Start-Button Spiel initialisieren
        $('#button_ready').click(function(){
            // Spielregeln ausblenden
            $("#popup_rules").popup("close");
            $('#overlay').fadeOut('fast');
            // Fenster "Los geht's" einblenden
            timeouts.push(new Timer(function(){
                $('#overlay').fadeIn('fast');
                $("#popup_start").popup("open");
            },500));  
        });
        $('#button_ok').click(function(){
            // Fenster "Los geht's" ausblenden
            $("#popup_start").popup("close");
            $('#overlay').fadeOut('fast'); 
            // Spiel starten
            gameStart();
        });
        
        $('#button_restart').click(function(){
            $("#popup_end").popup("close");
            $('#overlay').fadeOut('fast');
              
            // Variablen rücksetzen
            resetVariables();
            // Alles zudecken
            hideAll();
            // Spiel neu starten
            timeouts.push(new Timer(function(){
                $('#overlay').fadeIn('fast');
                $("#popup_start").popup("open");

            },500));
        });
        
        $('#button_menu').click(function(){
            // Evtl. noch laufende Timeouts anhalten
            for (var i = 0; i < timeouts.length; i++) {
                timeouts[i].pause();
            }
            $('#SidePanelMemory').panel('open'); // Panel einblenden
        });
        
        $('#menu_joker').click(function(){
            if(timer_start == 0){ // Timer läuft nicht (= Karten sind nicht bereits eingeblendet)
                // Panel ausblenden
                $('#SidePanelMemory').panel('close');
//                // Transparentes Overlay einblenden
//                $('#overlay_transp').fadeIn('fast');
                // Vermerken, dass Joker genutzt wurde
                joker_inuse = true;
                // Alle Karten einblenden
                showAll(); 
            }
            else{
                // Fehlermeldung Karten bereits eingeblendet
            }
            
        });
        
        $('#overlay_transp').click(function(){
            
            if(timer_start > 0){ // Falls Stoppuhr läuft (= alle Karten sind eingeblendet - Spielbeginn bzw. Joker)
                timer_duration = new Date - timer_start; // Prüfen, wie lange die Karten eingeblendet waren
                hideAll(); // alle Karten wieder umdrehen
                
                if(joker_inuse){ // Joker aktiv
                    var joker_malus = (Math.floor(timer_duration/1000) + 1)*factor_joker; // Minus-Punkte für Joker (timer_duration in ms)
                    addPoints(- joker_malus); // Punkte abziehen
                    joker_inuse = false;
                }
                else{ // Karten sind zu Spielbeginn eingeblendet
                    var time_bonus = (timelimit_timebonus - Math.floor(timer_duration/1000))*factor_timebonus; // Bonus-Punkte für schnelles Zudecken der Karten (timer_duration in ms)
                    if(time_bonus < 0){time_bonus = 0;} // keine Minus-Punkte
                    addPoints(time_bonus); // Punkte addieren
                    game(); // Spiel starten
                }
                
                
                    
            }
            
            if(timer_start > 0){ // Falls Stoppuhr läuft (= alle Karten sind eingeblendet, Joker)
                
                timer_duration = new Date - timer_start; // Prüfen, wie lange die Karten eingeblendet waren
                hideAll(); // alle Karten wieder umdrehen
                
                
                $('#overlay_transp').fadeOut('fast'); // Overlay ausblenden
                
                // Timeouts fortsetzen
//                for (var i = 0; i < timeouts.length; i++) {
//                timeouts[i].resume();}      
            }  
        });
        
        $('#menu_restart').click(function(){
            $('#SidePanelMemory').panel('close'); // Panel ausblenden
              
            // Variablen rücksetzen
            resetVariables();
            // Alles zudecken
            hideAll();
            // Spiel neu starten
            timeouts.push(new Timer(function(){
                $('#overlay').fadeIn('fast');
                $("#popup_start").popup("open");

            },500));
        });
        
        $('#menu_close').click(function(){
            $('#SidePanelMemory').panel('close'); // Panel ausblenden
            // Timeouts fortsetzen
            for (var i = 0; i < timeouts.length; i++) {
                timeouts[i].resume();
            }
        });
//      $('.card').click(function() {
//            $('#overlay').fadeIn('fast', function() {
//                $('#productbox').animate({'top': '20%'}, 500);
//            });
//        });
//        $('.card').click(function() {
//            turnCard(this); // Bei Klick entsprechende Karte umdrehen
//        });
//        $('#productbox').click(function() {
//            $('#productbox').animate({'top': '-100%'}, 500, function() {
//                $('#overlay').fadeOut('fast');
//            });
//        });
//

        $('#popup_product').click(function() {

            $("#popup_product").popup("close");
            $('#overlay').fadeOut('fast');
        });
    },
    'pageshow': function() {

        
        $('#overlay').fadeIn('fast');
        $("#popup_rules").popup("open");
        


    }
});
      

/* Funktion zum Anpassen diverser Content-Elemente an die Fenster-Auflösung*/
function scaleContent(){
        // Dimensionen des Bildschirms abfragen 
        var width = $(window).width();
        var height = $(window).height();


        // Content-Bereich anpassen
        $('.cardboard').css({"width": +width + "px"});

        // Card-Elemente anpassen
        $('.container').css({"width": +0.95*width / 4 + "px"});
        $('.container').css({"height": +0.95*width / 4 + "px"});
        
        //Wert 'perspective' anpassen, da Perspektive mit Fensterbreite skaliert
        $('.container').css({"perspective": +width+ "px"});
        $('.container').css({"-webkit-perspective": +width+ "px"});
        
        //Punkte-Popup anpassen
        $('#popup-content').css({"height": +height/4+ "px"}); // Höhe des Popup-Contents anpassen
        fontNormal(); // Schriftgröße anpassen
        
}



// Funktion zum Durchmischen der Namen
function shuffleArray(array){
    for(i = 0; i < array.length; i++)
        {
            var temp = array[i]; // i-ten Wert zwischenspeichern
            var j = Math.floor((Math.random()*array.length)); // ganzzahlige Zufallszahl zwischen null und (Arraygröße-1)
            array[i] = array[j]; // Wert von Zufalls-Position ...
            array[j] = temp; // ... mit dem Wert an der i-ten Position tauschen
        }
    return array;
}

/* Funktion zum Initialisieren zu Spielbeginn */
function init(){
    new_names = shuffleArray(names); // Namen mischen
    
    for(i = 0; i < 20; i++)
        {
            // Alle 20 Bilder zuweisen
            $('#card' + (i+1) +' img:last').attr('src', 'bilder/memory/' +new_names[i]+ '.jpg');
            $('#card' + (i+1) +' img:last').attr('id',new_names[i]);
        }
}

// Funktion zum Auf- und Zudecken einer Karte
function turnCard(id){
    $(id).toggleClass('show');
}

function showAll(){
    // Transparentes Overlay einblenden
    $('#overlay_transp').fadeIn('fast');
    
    $('.card').addClass('show'); // Alle Karten aufdecken
    if (timer_start == 0) { // Timer läuft noch nicht
        timer_start = new Date(); // Stoppuhr starten
    }    
}

function hideAll(){
    $('#overlay_transp').fadeOut('fast'); // Overlay ausblenden
    
    for(i=1; i<=20; i++){
        if(cleared_cards[i-1] == false){ // Karte noch nicht gefunden
            $('#card'+i+' div').removeClass('show'); // Karte wieder zudecken
        }
    }
    
    if(timer_start > 0){// Timer läuft bereits
        timer_start = 0; // Timer rücksetzen
    }   
}
// Funktion zum Entfernen einer Karte (bzw. des Bildes)
function removeCard(id){
    $(id).find('img:first').stop().animate({ opacity: 0.0}, 0); // Rückseite (HsKA-Logo) ausblenden
    $(id).find('img:last').stop().animate({ opacity: 0.3}, 500); // Vorderseite teiltransparent
}

// Funktionen zum Punkte-Popup

// Schriftgrößen anpassen
function fontBig(){ // Schrift groß machen
    var popupheight = $('#popup-content').height(); // Höhe des Popups auslesen
    $('.points_text').css({'font-size': +popupheight * 0.6 + 'px'}); // Schrift vergrößern
    $('.points_text').css({'padding-top': +popupheight * 0.2 + "px"}); // Abstand z. oberen Rand entfernen
    }
function fontNormal(){ // Normale Schriftgröße
    var popupheight = $('#popup-content').height(); // Höhe des Popups auslesen
    $('.points_text').css({'font-size': +popupheight * 0.4 + 'px'}); // Schriftgröße anpassen
    $('.points_text').css({'padding-top': +popupheight * 0.3 + "px"}); // Abstand z. oberen Rand 
    }
    
// Funktion zum Ändern der Punktzahl (inkl. Ein- und Ausblenden des Popups)
function addPoints(value){   
    $( "#popup_points" ).popup( "open" ); // Punkte-Popup einblenden
    timeouts.push(new Timer(function(){
        fontBig(); // Schrift groß machen
        if(value < 0){$(".points_text").css({'color': 'red'});} // Punktabzüge in roter Schrift
        var pointsnew = currentpoints + value; // Neuen Wert berechnen
        $(".points_text").text(pointsnew); // Neuen Wert schreiben
        currentpoints = pointsnew; // neuen Wert übertragen
    },500));
    
    timeouts.push(new Timer(function(){ // Schrift wieder schwarz und normale Größe
        $(".points_text").css({'color': 'black'});
        fontNormal();
    }, 1500)); 
    timeouts.push(new Timer(function(){$( "#popup_points" ).popup( "close" );},2000)); // Popup ausblenden
    timeouts.push(new Timer(function(){
        $('.card').off('click').on('click',function(){cardClicked(this);}); // Klick auf Karten wieder aktivieren
        game(); // Wieder zurück zur game-Funktion springen
    },3000)); 
}

// Funktion zum starten und pausieren eines Wartebefehls
function Timer(callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        if(remaining > 0){
            timerId = window.setTimeout(callback, remaining);}
    };

    this.resume();
}

// Funktion zum Starten des Spielablaufs
function gameStart(){
    resetVariables(); // Variablen rücksetzen

    // Logos mischen
    init();
    // Logos einblenden
    showAll();
    
//    $('.card').off('click');
//    // Alle Karten einblenden
//    turnCard('all');
//    timeouts.push(new Timer(function(){
//        $('.card').click(function(){cardClicked(this);});
//        game();
//    },4000));
//    
}

function game(){
    if(cards_left > 1){ // Falls noch mind. 2 Karten nicht aufgedeckt wurden
        showProduct();
    }
    else{
        // Letzte Karte aufdecken
        for(i=1; i<=20; i++){
        if(cleared_cards[i-1] == false){ // Karte noch nicht gefunden
            turnCard('#card'+i+' div'); 
            removeCard('#card'+i+' div');
        }
    }
    timeouts.push(new Timer(function(){     
        // Spielende-Popup einblenden
        $('#overlay').fadeIn('fast');
        $('#points_final').text(currentpoints);
        $('#popup_end').popup('open');
    },3000));
    }
}

function cardClicked(id){
    var cardid = id.parentElement.id; // id.partentElement.id liefert Karten-ID (zb. "card15")
    // Nur etwas tun, wenn die geklickte Karte nicht bereits zuvor aufgedeckt wurde
    if( cleared_cards[cardid.substr(4)-1] == false){ // substr(4) liefert Zahl aus Karten-Id)
        $('.card').off('click'); // Klicken auf andere Karten deaktivieren
        turnCard(id); // Karte aufdecken
        // img-ID auslesen (= Produktname)
        var imgid = $(id).find('img');
        imgid = imgid.last().attr('id');


        timeouts.push(new Timer(function() {
            if (imgid == current_id) { // Gewähltes Logo passt zu Produktbild 
                timeouts.push(new Timer(function() {
                    removeCard(id);
                }, 1000)); // Karte ausgrauen
                timeouts.push(new Timer(function() {
                    addPoints((cards_left * factor_correct));
                }, 2000)); // Punkte addieren
                // Produktbild aus Array löschen, so dass dieses nicht mehr gezeigt wird
                var array_id = $.inArray(imgid, names_copy); // Index mit diesem Produktnamen im Array finden
                names_copy.splice(array_id, 1);
                // Kartenzähler anpassen
                cards_left--;
                // Merken, dass diese Karte bereits gefunden wurde
                cleared_cards[cardid.substr(4) - 1] = true; // substr(4) liefert Zahl aus Karten-Id
            }
            else { // Falsche Wahl
                timeouts.push(new Timer(function() {
                    turnCard(id);
                }, 1000));// Karte wieder umdrehen
                timeouts.push(new Timer(function() {
                    addPoints(-(21 - cards_left) * factor_wrong);
                }, 2000)); // Punkte abziehen

            }
        }, 1000));
    }
    
    
    
    
    
}

// Zufälliges Produkt einblenden
function showProduct()
{
    var i = Math.floor((Math.random()*names_copy.length)); // ganzzahlige Zufallszahl zwischen null und (Arraygröße-1)
    $('#popup_product img').attr('src', 'bilder/memory/products/' +names_copy[i]+ '.jpg'); // Bild zuweisen
    current_id = names_copy[i]; // Produktname speichern
    // Bild anzeigen
    timeouts.push(new Timer(function(){
        $('#popup_product').popup('open');
    },500));
} 
    

// Variablen auf Startwerte zurücksetzen
function resetVariables()
{
    names_copy = names.slice(0);
    cards_left = 20;
    timeouts = [];
    timer_start = 0;
    currentpoints = 0;
    joker_inuse = false;
    
    for(i=1; i<=20; i++){    
        $('#card'+i).find('img:first').stop().animate({ opacity: 1}, 0); // Rückseite (HsKA-Logo) einblenden
        $('#card'+i).find('img:last').stop().animate({ opacity: 1}, 0); // Firmenlogos neu zuweisen
    }
    
    for(i=0; i<20; i++){
        cleared_cards[i] = false;
    }
    $(".points_text").text('0'); // Punkte auf null setzen
}