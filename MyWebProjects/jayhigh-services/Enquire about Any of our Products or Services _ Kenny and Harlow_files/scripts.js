/*
 * Scripts File
 * Author: SundayElephant
 *
 * This file should contain any js scripts you want to add to the site.
 * Instead of calling it in the header or throwing it inside wp_head()
 * this file will be called automatically in the footer so as not to
 * slow the page load.
 *
 * There are a lot of example functions and tools in here. If you don't
 * need any of it, just remove it. They are meant to be helpers and are
 * not required. It's your world baby, you can do whatever you want.
*/

(function($){
	/*
	 * Get Viewport Dimensions
	 * returns object with viewport dimensions to match css in width and height properties
	 * ( source: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript )
	*/
	function updateViewportDimensions() {
		var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
		return { width:x,height:y };
	}
	// setting the viewport width
	var viewport = updateViewportDimensions();


	/*
	 * Throttle Resize-triggered Events
	 * Wrap your actions in this function to throttle the frequency of firing them off, for better performance, esp. on mobile.
	 * ( source: http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed )
	*/
	var waitForFinalEvent = (function () {
		var timers = {};
		return function (callback, ms, uniqueId) {
			if (!uniqueId) { uniqueId = "Don't call this twice without a uniqueId"; }
			if (timers[uniqueId]) { clearTimeout (timers[uniqueId]); }
			timers[uniqueId] = setTimeout(callback, ms);
		};
	})();

	// how long to wait before deciding the resize has stopped, in ms. Around 50-100 should work ok.
	var timeToWaitForLast = 100;


	/*
	 * Here's an example so you can see how we're using the above function
	 *
	 * This is commented out so it won't work, but you can copy it and
	 * remove the comments.
	 *
	 *
	 *
	 * If we want to only do it on a certain page, we can setup checks so we do it
	 * as efficient as possible.
	 *
	 * if( typeof is_home === "undefined" ) var is_home = $('body').hasClass('home');
	 *
	 * This once checks to see if you're on the home page based on the body class
	 * We can then use that check to perform actions on the home page only
	 *
	 * When the window is resized, we perform this function
	 * $(window).resize(function () {
	 *
	 *    // if we're on the home page, we wait the set amount (in function above) then fire the function
	 *    if( is_home ) { waitForFinalEvent( function() {
	 *
	 *	// update the viewport, in case the window size has changed
	 *	viewport = updateViewportDimensions();
	 *
	 *      // if we're above or equal to 768 fire this off
	 *      if( viewport.width >= 768 ) {
	 *        console.log('On home page and window sized to 768 width or more.');
	 *      } else {
	 *        // otherwise, let's do this instead
	 *        console.log('Not on home page, or window sized to less than 768.');
	 *      }
	 *
	 *    }, timeToWaitForLast, "your-function-identifier-string"); }
	 * });
	 *
	 * Pretty cool huh? You can create functions like this to conditionally load
	 * content and other stuff dependent on the viewport.
	 * Remember that mobile devices and javascript aren't the best of friends.
	 * Keep it light and always make sure the larger viewports are doing the heavy lifting.
	 *
	*/

	/*
	 * We're going to swap out the gravatars.
	 * In the functions.php file, you can see we're not loading the gravatar
	 * images on mobile to save bandwidth. Once we hit an acceptable viewport
	 * then we can swap out those images since they are located in a data attribute.
	*/
	function loadGravatars() {
		// set the viewport using the function above
		viewport = updateViewportDimensions();
		// if the viewport is tablet or larger, we load in the gravatars
		if (viewport.width >= 768) {
			$('.comment img[data-gravatar]').each(function(){
				$(this).attr('src',$(this).attr('data-gravatar'));
			});
		}
	} // end function

	/*
	 * Set the same height for elements
	*/
	$.fn.equalHeights = function(per_row) {
		var currentTallest	= 0,
			$this 			= $(this);

		if (per_row) {
			for (var i=0; i<$this.length; i=i+per_row) {
				currentTallest	= 0;

				$this.slice(i, i+per_row).each(function() {
					$(this).css({'min-height': '1px'});
					if ($(this).outerHeight() > currentTallest) {
						currentTallest = $(this).outerHeight();
					}
                });

				$this.slice(i, i+per_row).css({'min-height': currentTallest});
			}
		} else {
			$this.each(function(){
				$(this).css({'min-height': '1px'});
				if ($(this).outerHeight() > currentTallest) {
					currentTallest = $(this).outerHeight();
				}
			});

			$this.css({'min-height': currentTallest});
		}

		return this;
	};

	// Vertically Align Function
    (function ($) {
    $.fn.vAlign = function() {
        return this.each(function(i){
        var ah = $(this).height();
        var ph = $(this).parent().height();
        var mh = Math.ceil((ph-ah) / 2);
        $(this).css('margin-top', mh);
        });
    };
    })(jQuery);

	/*
	 * Put all your regular jQuery in here.
	*/
	$(document).ready(function($) {
		// Let's fire off the gravatar function
		loadGravatars();
		$('.col-slider').slick({
			dots: true,
			arrows: false,
			slidesToShow: 2,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 7000,
			responsive: [
			    {
			      breakpoint: 992,
			      settings: {
			        slidesToShow: 1,
			        slidesToScroll: 1
			      }
			    }
			    // You can unslick at a given breakpoint now by adding:
			    // settings: "unslick"
			    // instead of a settings object
			  ]
		});

		$(".tax-collection-wrap .page-header .absolute-dropdown .elementor-icon").on('click', function(e) {
			e.preventDefault();
			var target = $(this).attr('href');
			$('html, body').animate({
				scrollTop: ($(target).offset().top)
			}, 1000);
		});

		$('.story-services').equalHeights();
	});

	$(window).load(function() {
		if ($(window).width() > 1023) {
			$(".loader_inner").fadeOut();
	   		$(".loader").delay(600).fadeOut("slow");
		}
		$('.story-services').equalHeights();
	});

	// Fire needed update on window resize
	$(window).resize(function () {
		$('.story-services').equalHeights();
	});

	// Animate elements when it goes to the viewport
	$(window).scroll(function(){
	    if ($(this).scrollTop() > 500) {
	      $('.scrollToTop').fadeIn();
	      // $('.scrollToTop').stop().animate({ right: '30px' },800);
	    } else {
	      $('.scrollToTop').fadeOut();
	      // $('.scrollToTop').stop().animate({ right: '-150px' },800);
	    }
	});
	/* This is basic - uses default settings */
	$('.scrollToTop').click(function(){
	    $('html, body').animate({scrollTop : 0},800);
	    return false;
	});

})(jQuery);
