/* 
    Document   : JS-Script
    Created on : 12.08.2013, 19:05:00
    Author     : Alexander Hehn
    Description: Muss vor der Benutzung von PhotoSwipe ausgeführt werden. Der Code stammt von http://www.photoswipe.com/
*/


(function(window, $, PhotoSwipe){				
	$(document).ready(function(){					
		$('div.gallery-page')
			.on('pageshow', function(e){							
				var 
					currentPage = $(e.target),
					options = {},
					photoSwipeInstance = $("ul.gallery a", e.target).photoSwipe(options,  currentPage.attr('id'));								
				return true;							
			})						
			.on('pagehide', function(e){							
				var 
					currentPage = $(e.target),
					photoSwipeInstance = PhotoSwipe.getInstance(currentPage.attr('id'));
				if (typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
					PhotoSwipe.detatch(photoSwipeInstance);
				}							
				return true;							
			});					
	});			
}(window, window.jQuery, window.Code.PhotoSwipe));