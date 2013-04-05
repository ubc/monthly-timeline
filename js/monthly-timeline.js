// lets make our own slider


(function( $ ) {
  
  var options = {}
  var slides; // each of the slides
  var dates; // .date divs
  var one_slide_width; // the current width of the slides
  var one_date_width;
  var storyline; // storyline div 
  var dateline; // dateline div
  var slide_index; 
 
  var methods = {
  	init: function( arg ) { 
     	 // THIS 
        options = $.extend( {}, $.fn.storyline.options, arg );
        
  		slides = jQuery( options.slides );
  		dates = jQuery( options.dates );
  		
  		storyline = jQuery( options.storyline );
  		dateline = jQuery( options.dateline );
		
		one_slide_width = slides.width();
		one_date_width  = dates.width();
		// set the initial widths
		storyline.css( { width: function () { return one_slide_width * slides.length } } );
		dateline.css( { width: function () { return one_date_width * dates.length } } );
		
		slides.each(function(index, el) {
			
			 last_index = slides.length-1;
			 
			 if( 0 == index ) {
			 	
			 	$(el).addClass('active-slide');
				// slide_index = index;
				
				slider_index = index;
				
				var active_date = dates.get( index );
				
				jQuery(active_date).addClass('active-date');
				// centre the last active div
				storyline.css( 'marginLeft', function( index ){ return  helper.centre( slider_index, 'storyline' ); } );
				
				dateline.css( 'marginLeft', function( index ){ return  helper.centre( slider_index, 'dateline' ); } );
			}	
		});
		
		jQuery(window).resize(function(){
			storyline.css( 'marginLeft', function( index ){ return  helper.centre( slider_index, 'storyline' ); } );
			
		});
		
		storyline.touchwipe({
	    	wipeLeft: function() { helper.move( slider_index, 'next' ); },
	     	wipeRight: function() { helper.move( slider_index, 'previous' ); },
	     	min_move_x: 20,
	     	min_move_y: 20,
	     	preventDefaultEvents: true
		});
		// next slide
		jQuery( options.next ).click( function(){ helper.move( slider_index, 'next' ); });
		// previous slide 
		jQuery( options.previous ).click( function(){ helper.move( slider_index, 'previous' ); });
		
		// click on the time line
		dates.click(function(event) {
			var that = this;
			event.preventDefault();
			if( ! jQuery(this).hasClass('active-date') ){
				dates.each( function(index, el ) {
					if( that == el) {
						helper.move( index, 'point' );
					}
				});
			}
			
		});
		
		jQuery(window).on('keypress', function(event){ 
			if(event.keyCode == 39 ){
				helper.move( slider_index, 'next' );
			} 
			if(event.keyCode == 37 ){
				helper.move( slider_index, 'previous' );
			}
			
		
		 } )
  	 }
  }
 
  $.fn.storyline = function( method ) {
		
		// Override defaults with specified options.
		options = $.extend( {}, $.fn.storyline.options, options );
		
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
  };
  
  
  var helper = {
  		centre: function( index, what ) {
			switch( what ){
				case 'storyline':
					var window_width = storyline.parent().width();
					var item_width = one_slide_width;
					
				break;
				case 'dateline':
					var window_width = dateline.parent().width();
					var item_width = one_date_width;
				break;
			}
			
			return ((window_width/2) - (item_width/2)) - ( index * item_width );

		},
		remove_class_active_slider: function(el) {
			console.log('done');
			jQuery(el).removeClass( 'active-slide' );
		},
		remove_class_active_date: function(el){
			jQuery(el).parent().removeClass( 'active-date' );
		},
		move : function( index, where ) {
			switch(where){
				case 'next':
					if( ( slides.length - 1 ) > slider_index){
						slider_index++;
					} else {
						slider_index = 0;
					}	
				break;
				case 'previous':
					if( 0 < slider_index ) {
						slider_index--;
					} else {
						slider_index = slides.length-1;
					}	
				break;
				
				case 'point':
					slider_index = index;
				break;
			
			} // end of switch
			jQuery('#storyline').find('.active-slide').animate( { opacity:0.3 }, { queue: false, duration: 100, always: function(){
				helper.remove_class_active_slider( this );
			} } );
			
			jQuery('#datesline').find('.active-date').children('.date-wrap').animate( 
				{ height:50, width:50, marginLeft:15, marginTop:15, fontSize:12 },
				{queue: false, duration: 100, always: function(){
					helper.remove_class_active_date( this );
					
					
					// storyline
					margin_left_value = helper.centre( slider_index, 'storyline' ); 
					
					storyline.animate( { marginLeft: margin_left_value}, 600 , function(){
						next_slide = slides.get(slider_index);
						jQuery( next_slide ).animate( { opacity:1}, 200,function(){ jQuery(this).addClass( 'active-slide' ) });
					} );
					
					// dateline
					margin_left_value_date = helper.centre( slider_index, 'dateline' ); 
					
					dateline.animate( { marginLeft: margin_left_value_date }, 600 , function(){
						next_date = dates.get(slider_index);
						jQuery( next_date ).children('.date-wrap').animate( { height:80, width:80, marginLeft:0, marginTop:0, fontSize:16 }, 200, 
						function()		{ jQuery(this).parent().addClass( 'active-date' ) } );
					} );
					
				} });
			
		
			
			
			
		}
		
  }
  // Some sensible defaults.
  $.fn.storyline.options = {
		storyline: "#storyline",
		dateline: "#datesline",
		storyline_wrap:"#storyline-wrap",
		next: "#next-slide",
		previous: "#previous-slide",
		slides:'.slide',
		dates:'.date'
	};
  
  
})( jQuery );




var TimeLine = {
	
	ready : function() {
		
		jQuery().storyline('init');
		
		jQuery('.slide-wrap').each(function(index, el) {
			TimeLine.mark_as_last(el);
		});
			
	},
	
	mark_as_last: function(el){
		var stories = jQuery(el).children('.story');
		
		mod = ( stories.length % 3 )
		if( 2 == mod)
			stories.slice(-mod).addClass("last-two");
		if( 1 == mod)
			stories.slice(-mod).addClass("last-one");
	}


}
jQuery(TimeLine.ready);

/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 * 
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de) demo http://www.netcu.de/jquery-touchwipe-iphone-ipad-library
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */
(function($) { 
   $.fn.touchwipe = function(settings) {
     var config = {
    		min_move_x: 20,
    		min_move_y: 20,
 			wipeLeft: function() { },
 			wipeRight: function() { },
 			wipeUp: function() { },
 			wipeDown: function() { },
			preventDefaultEvents: true
	 };
     
     if (settings) $.extend(config, settings);
 
     this.each(function() {
    	 var startX;
    	 var startY;
		 var isMoving = false;

    	 function cancelTouch() {
    		 this.removeEventListener('touchmove', onTouchMove);
    		 startX = null;
    		 isMoving = false;
    	 }	
    	 
    	 function onTouchMove(e) {
    		 if(config.preventDefaultEvents) {
    			 e.preventDefault();
    		 }
    		 if(isMoving) {
	    		 var x = e.touches[0].pageX;
	    		 var y = e.touches[0].pageY;
	    		 var dx = startX - x;
	    		 var dy = startY - y;
	    		 if(Math.abs(dx) >= config.min_move_x) {
	    			cancelTouch();
	    			if(dx > 0) {
	    				config.wipeLeft();
	    			}
	    			else {
	    				config.wipeRight();
	    			}
	    		 }
	    		 else if(Math.abs(dy) >= config.min_move_y) {
		    			cancelTouch();
		    			if(dy > 0) {
		    				config.wipeDown();
		    			}
		    			else {
		    				config.wipeUp();
		    			}
		    		 }
    		 }
    	 }
    	 
    	 function onTouchStart(e)
    	 {
    		 if (e.touches.length == 1) {
    			 startX = e.touches[0].pageX;
    			 startY = e.touches[0].pageY;
    			 isMoving = true;
    			 this.addEventListener('touchmove', onTouchMove, false);
    		 }
    	 }    	 
    	 if ('ontouchstart' in document.documentElement) {
    		 this.addEventListener('touchstart', onTouchStart, false);
    	 }
     });
 
     return this;
   };
 
 })(jQuery);