
        function auswerten() {
        	var punkte = 0;
        	for (i=0; obj = document.getElementsByName('richtig')[i]; i++)
        		if (obj.checked) punkte++;
        	document.getElementById('ausgabe').firstChild.data =
        		'Du hast '+ punkte +' von '+ (pmax = document.getElementsByName('richtig').length) +
        		' möglichen Punkten erreicht. Das sind '+ Math.round(punkte*100/pmax) +' Prozent.';
        }