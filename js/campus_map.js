			// Wait for device API libraries to load
			//
			document.addEventListener("deviceready", onDeviceReady, false);
			
			
			// device APIs are available
			//
			function onDeviceReady() {
				$("#welcome").popup("open", {positionTo: "window"});
				$( ".geook" ).click(function() {
					//$('#map-canvas').html('<a href="#" class="geook" data-role="button" data-icon="refresh" data-theme="a" data-inline="true">Refresh</a>');
					navigator.geolocation.getCurrentPosition(onSuccess, onError,{maximumAge:600000, timeout:5000, enableHighAccuracy: true});
					$("#welcome").popup("close");
				});
				
				$( "#geofalse" ).click(function() {
					onError();
					$("#welcome").popup("close");
				});
			}

			
			// onSuccess Geolocation
			//
			function onSuccess(position) {
				/*var element = document.getElementById('geolocation');
				element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
									'Longitude: '          + position.coords.longitude             + '<br />' +
									'Altitude: '           + position.coords.altitude              + '<br />' +
									'Accuracy: '           + position.coords.accuracy              + '<br />' +
									'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
									'Heading: '            + position.coords.heading               + '<br />' +
									'Speed: '              + position.coords.speed                 + '<br />' +
									'Timestamp: '          + position.timestamp                    + '<br />';*/
									
				$('#geolocation').html('Latitude: '           + position.coords.latitude              + '<br />' +
									'Longitude: '          + position.coords.longitude             + '<br />' +
									'Altitude: '           + position.coords.altitude              + '<br />' +
									'Accuracy: '           + position.coords.accuracy              + '<br />' +
									'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
									'Heading: '            + position.coords.heading               + '<br />' +
									'Speed: '              + position.coords.speed                 + '<br />' +
									'Timestamp: '          + position.timestamp                    + '<br />');
									
									
				meineLongitude = position.coords.longitude;
				meineLatitude = position.coords.latitude;
				var Latlng_position = new google.maps.LatLng(meineLatitude, meineLongitude); // Schreibt aktuelle Position in Koordinaten-Variable für die aktuellen Position
				
				var mapOptions = {													// Definition der Anzeige-Optionen der Google-Maps karte
						zoom: 17,													// Zoom-Stufe der Karte
						center: Latlng_position,									// Definition des Mittelspunktes nach dem die Karte ausgerichtet wird
						mapTypeId: google.maps.MapTypeId.ROADMAP,					// Definiert den Anzeige-Typ der Goole Maps Karte
						panControl: false,											// panControl-Button wird deaktiviert
						zoomControl: false,											// ZoomControl-Button wird aktiviert
						mapTypeControl: false,										// Auswahlmöglichkeit für Kartentyp wird deaktiviert
						scaleControl: false,										// scaleControl wird aktiviert
						streetViewControl: false,									// StreetViewControl-Button wird deaktiviert
				};
				
				create_map(mapOptions);
				set_position(Latlng_position, map);
				set_markers(map);
			}

		
			// onError Callback creates the Google Map only with the HsKA building markers
			//
			function onError(error) {
				//window.alert('Deine Position konnte nicht ermittelt werden! :-(');
				$("#nopos").popup("open", {positionTo: "window"});
				var Latlng_center = new google.maps.LatLng(49.013625,8.390161);	// Erstellt Variable mit der Position nach der die Karte zentriert werden soll
				var mapOptions = {												// Definition der Anzeige-Optionen der Google-Maps karte
					zoom: 15,													// Zoom-Stufe der Karte
					center: Latlng_center,										// Definition des Mittelspunktes nach dem die Karte ausgerichtet wird
					mapTypeId: google.maps.MapTypeId.ROADMAP,					// Definiert den Anzeige-Typ der Goole Maps Karte
					panControl: false,											// panControl-Button wird deaktiviert
					zoomControl: false,											// ZoomControl-Button wird aktiviert
					mapTypeControl: false,										// Auswahlmöglichkeit für Kartentyp wird deaktiviert
					scaleControl: false,										// scaleControl wird aktiviert
					streetViewControl: false,									// StreetViewControl-Button wird deaktiviert
				};
				// Google Map erzeugen
				create_map(mapOptions);
				set_markers(map); 
			}
  
  		
			// Create the Google Map with the delivered mapOptions in the div-Objekt "map-canvas"
			//
			function create_map(options){
				map = new google.maps.Map(document.getElementById('map-canvas'), options);
			}

			
  			// Set the marker at the position of the user in the Google Map 
			//
			function set_position(myPosition, map){
				// Marker für aktuellen Standort einfügen
				var marker = new google.maps.Marker({
					position: myPosition,
					map: map,
					title: 'Mein Standort',
					icon: '../bilder/navigation/position.png'
				});
			}
			
			
			
  			// Set the marker at the position of the user in the Google Map 
			//
			function set_markers(map){
				// Auslesen der JSON-Datei und zeichnen von Google-Maps-Markern
				$.getJSON('../daten/gebaeude.json', function(json) {
					$.each(json, function(bau,data) {
						var latLng = new google.maps.LatLng(data.position.latitude, data.position.longitude); 
						// Creating a marker and putting it on the map
						var marker = new google.maps.Marker({
							position: latLng,
							map: map,
							title: data.name,
							icon: '../bilder/navigation/' + bau + '.png'
						});
					});
				});
			}	