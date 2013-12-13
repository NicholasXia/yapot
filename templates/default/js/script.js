/**
*
* Detect Mobile Touch Support
*
**/

var touchSupport = false;
var eventClick = 'click';
var eventHover = 'mouseover mouseout';

(function(){
	if ('ontouchstart' in document.documentElement) {
		$('html').addClass('touch');
		touchSupport = true;
		eventClick = 'touchon touchend';
		eventHover = 'touchstart touchend';
	} else {
		$('html').addClass('no-touch');
	}
})();




/**
*
* Hides Adress Bar
*
**/

function hideAddressBar() {
	if(!window.location.hash) {
		if(document.documentElement.scrollHeight < window.outerHeight) {

			/* Expands Page Height if it's smaller than window */

			document.body.style.minHeight = (window.outerHeight + 60) + 'px';
			document.getElementById('container').style.minHeight = (window.outerHeight + 60) + 'px';
			document.getElementById('content-container').style.minHeight = (window.outerHeight + 60) + 'px';
		}

		setTimeout( function(){ window.scrollTo(0, 1); }, 0 );
	}
}
 
window.addEventListener('load', function(){ if(!window.pageYOffset){ hideAddressBar(); } } );




/**
*
* Photoswipe
*
**/

var photoswipeContainer = '.photoswipe a';
		
if($(photoswipeContainer).length > 0){
	(function(window, $, PhotoSwipe){

		$(document).ready(function(){
			
			var options = {
			
				/* Customizing toolbar */

				getToolbar: function(){
					return '<div class="ps-toolbar-previous icon-left-open"></div>'
					+ '<div class="ps-toolbar-play icon-play"></div>'
					+ '<div class="ps-toolbar-next icon-right-open"></div>';
				},
						
				getImageCaption: function(el){
					var captionText, captionEl, captionBack;
					
					/* Get the caption from the alt tag */

					if (el.nodeName === "IMG"){
						captionText = el.getAttribute('alt'); 
					}

					var i, j, childEl;
					for (i=0, j=el.childNodes.length; i<j; i++){
						childEl = el.childNodes[i];
						if (el.childNodes[i].nodeName === 'IMG'){
							captionText = childEl.getAttribute('alt'); 
						}
					}
					
					/* Return a DOM element with custom styling */

					captionBack = document.createElement('a');
					captionBack.setAttribute('id', 'ps-custom-back');
					captionBack.setAttribute('class', 'icon-cancel-1');
					
					captionEl = document.createElement('div');
					captionEl.appendChild(captionBack);
					
					captionBack = document.createElement('span');
					captionBack.innerHTML=captionText;
					captionEl.appendChild(captionBack);
					return captionEl;
				},
				
				enableMouseWheel: false,
				captionAndToolbarOpacity: 1,
			}




			/* Creating Photoswipe instance */

			var instance = PhotoSwipe.attach(window.document.querySelectorAll(photoswipeContainer), options );




			/* Adding listener to custom back button */

			instance.addEventHandler(PhotoSwipe.EventTypes.onShow, function(e){
				$('.ps-caption').addClass('active');
				$('.ps-toolbar').addClass('active');
				$('.ps-document-overlay').addClass('active');
				$('.ps-carousel').addClass('active');

				if($('html').hasClass('no-csstransforms')){
					$(document).on('click', '#ps-custom-back', function() {
						e.target.hide();
					});
				}else{
					$(document).on(eventClick, '#ps-custom-back' , function(){
						$('.ps-caption').removeClass('active');
						$('.ps-toolbar').removeClass('active');
						setTimeout(function(){
							$('.ps-document-overlay').removeClass('active');
							$('.ps-document-overlay').addClass('unload');
							$('.ps-carousel').removeClass('active');
							setTimeout(function(){
								e.target.hide();
							}, 400);
						}, 400);
					});
				}

			});




			/* Play/Pause Icon Change */

			/* Slideshow Start */

			instance.addEventHandler(PhotoSwipe.EventTypes.onSlideshowStart, function(e){
				$('.ps-toolbar-play').removeClass('icon-play');
				$('.ps-toolbar-play').addClass('icon-pause');
				$('.ps-toolbar-play').addClass('hover');
			});

			/* Slideshow End */

			instance.addEventHandler(PhotoSwipe.EventTypes.onSlideshowStop, function(e){
				$('.ps-toolbar-play').removeClass('icon-pause');
				$('.ps-toolbar-play').addClass('icon-play');
				$('.ps-toolbar-play').removeClass('hover');
			});
					
		}, false);	

	}(window, window.jQuery, window.Code.PhotoSwipe));




	/* Hover Effects - Photoswipe */

	$(document).on(eventHover, '#ps-custom-back, .ps-toolbar-previous, .ps-toolbar-play, .ps-toolbar-next', function() {
		$(this).toggleClass('hover');
	});
}




/**
*
* Google Maps - Contact
*
**/

if( document.getElementById('map-container-api') != null){

	google.maps.visualRefresh = true;

	/* Set Latitude and longitude for your google maps center and marker */

	var mapLatitude = 37.8017993;
	var maplongitude = -122.4768507;

	var map;
	var mapContainer = document.getElementById('map-container-api');
	var mapMarker = new google.maps.LatLng(mapLatitude, maplongitude);

	function initialize() {
		var mapOptions = {
			zoom: 13,
			center: new google.maps.LatLng(mapLatitude, maplongitude),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
		};

		map = new google.maps.Map(mapContainer, mapOptions);

		var marker = new google.maps.Marker({
			position: mapMarker,
		    animation: google.maps.Animation.DROP,
			map: map,
			flat: true,
			tite: 'Restart Inc.'
		});
	}

	google.maps.event.addDomListener(window, 'load', initialize);

}




jQuery(document).ready(function($) {
	$('#sidemenu-container').toggleClass('active');
	$('#sidemenu-container').toggleClass('active');

	/**
	*
	* Touch Gestures
	*        &
	* Hover and Animation Triggers
	*
	**/

	/* Hover Effects */

	$('.portfolio-grid article a, .button, button, input[type="submit"], input[type="reset"], input[type="button"], #header a, .header-button, #nav-container a, .nav-child-container, .gallery-container a, #ps-custom-back').bind(eventHover, function(event) {
		$(this).toggleClass('hover');
	});

	/* Sidebar multi-level menu */
	
	$('.nav-child-container').bind(eventClick, function(event) {
		event.preventDefault();
		var $this = $(this);
		var ul = $this.next('ul');
		var ulChildrenHeight = ul.children().length * 46;

		if(!$this.hasClass('active')){
			$this.toggleClass('active');
			ul.toggleClass('active');
			ul.height(ulChildrenHeight + 'px');
		}else{
			$this.toggleClass('active');
			ul.toggleClass('active');
			ul.height(0);
		}
	});

	/* Sidebar Functionality */
	
	var opened = false;
	$('#menu-trigger').bind(eventClick, function(event) {
		$('#content-container').toggleClass('active');
		$('#sidemenu').toggleClass('active');
		if(opened){
			opened = false;
			setTimeout(function() {
				$('#sidemenu-container').removeClass('active');
			}, 500);
		} else {
			$('#sidemenu-container').addClass('active');
			opened = true;
		}
	});
		
	$('.nav a').bind('click', function(event) {
		event.preventDefault();
		var path = $(this).attr('href');
		$('#content-container').toggleClass('active');
		$('#sidemenu').toggleClass('active');
		setTimeout(function() {
			window.location = path;
		}, 500);
	});

	/* Swipe menu support */
		
	$('.touch-gesture #content').hammer().on('swiperight', function(event) {
		$('#content-container').addClass('active');
		$('#sidemenu').addClass('active');
		if(opened){
			opened = false;
			setTimeout(function() {
				$('#sidemenu-container').removeClass('active');
			}, 500);
		} else {
			$('#sidemenu-container').addClass('active');
			opened = true;
		}
	});
	
	$('.touch-gesture #content').hammer().on('swipeleft', function(event) {
		$('#content-container').removeClass('active');
		$('#sidemenu').removeClass('active');
		if(opened){
			opened = false;
			setTimeout(function() {
				$('#sidemenu-container').removeClass('active');
			}, 500);
		} else {
			$('#sidemenu-container').addClass('active');
			opened = true;
		}
	});




	/**
	*
	* Check if the child menu has an active item.
	* If yes, then it will expand the menu by default.
	*
	**/
	
	var $navItems = $('.nav ul li a');

	$navItems.each(function(index){
		if ($(this).hasClass('current')) {
			$parentUl = $(this).parent().parent();
			$parentUl.height($parentUl.children('li').length * 46 + "px");
			$parentUl.prev().addClass('active');
			$parentUl.addClass('active');
			$anchor = $parentUl.prev();
			$anchor.children('.nav-child-container').addClass('active');
		}
	});




	/**
	*
	* Flexslider
	*
	**/

	var $flexsliderContainer = $('.flexslider');

	if($flexsliderContainer.length > 0){
		$flexsliderContainer.flexslider({
			controlsContainer: ".flexslider-controls",
			prevText: '<span class="icon-left-open-big"></span>',
			nextText: '<span class="icon-right-open-big"></span>',
			slideshowSpeed: 5000,
			animationSpeed: 600,
			slideshow: true,
			smoothHeight: false,
			animationLoop: true,
		});
	}




	/**
	*
	* Alert boxes
	*
	**/

	var $alertBoxes = $('.alert-box .close');

	$alertBoxes.bind(eventClick, function(event) {
		event.preventDefault();
		var $parent = $(this).parent('.alert-box');
		$parent.fadeOut(500);
		setTimeout(function() { $parent.hide(0); }, 500);
	});




	/**
	*
	* H5 Validate - Form jQuery Validation
	*
	**/

	$('form').h5Validate();
});