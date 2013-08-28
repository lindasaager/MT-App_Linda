/* 
    Document   : JS-Script
    Created on : 28.08.2013, 14:23:00
    Author     : Alexander Hehn
    Description: Prüft nach, ob das Betriebssystem iOS ist. Wenn ja, wird der Button "App schließen" entfernt, da dieser unter iOS nicht funktioniert und dies zum Ausschluss aus dem AppStore führen kann.
*/


document.addEventListener("deviceready", sidepanel_onDeviceReady, false);
// Funktion ausführen, wenn die Seite geladen ist.
function sidepanel_onDeviceReady() {
	// Plattform abfragen
	var dev_platform = device.platform;
	// Prüfen, ob die Plattform iOS ist
	if (dev_platform == "iOS") {
	// Wenn ja, alle "App schließen"-Buttons verstecken
		$("a[onClick=\"navigator.app.exitApp();\"]").hide();
	}
}