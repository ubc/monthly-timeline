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
				
				slider_index = index;
				
				var active_date = dates.get( index );
				
				jQuery(active_date).addClass('active-date');
				// centre the last active div
				storyline.css( 'marginLeft', function( index ){ return  helper.centre( slider_index, 'storyline' ); } );
				
				dateline.css( 'marginLeft', function( index ){ return  helper.centre( slider_index, 'dateline' ); } );
			}	
			
		});
			
		// filtering 
		$('#commitment a').click(function(event) {
		
			 var commitment = $(this).data('commitment');
			 event.preventDefault();
			
			if( commitment ) {
				$('#commitment .btn-small').html( 'commitment: '+commitment+' <span class="caret"></span>');
				$('.story').each(function( index, el) {
					var story = $(el);
					
					id = story.data('commitment');
					
					if(id != commitment){
						story.hide('200');
					} else {
						story.show('200');
					}
				});
			
			} else {
				$('#commitment .btn-small').html( 'commitment <span class="caret"></span>');
				$('.story').show('200');
			}
			
			
		});
		// click on the time line
		jQuery(window).resize(function(){
			storyline.css( 'marginLeft', function( index ){ return  helper.centre( slider_index, 'storyline' ); } );
			
		});
		
		storyline.touchwipe({
	    	wipeLeft: function() {  helper.move( slider_index, 'next' ); },
	     	wipeRight: function() { helper.move( slider_index, 'previous' ); },
	     	min_move_x: 20,
	     	min_move_y: 20,
	     	preventDefaultEvents: false
		});
    	
		// next slide
		jQuery( options.next ).click( function(e){ 
			e.preventDefault();
			
			if(helper.is_moving)
				return;
			helper.move( slider_index, 'next' );
			
			
			 
		});
		// previous slide 
		jQuery( options.previous ).click( function(e){ 
			e.preventDefault();
			if(helper.is_moving)
				return;
			helper.move( slider_index, 'previous' ); 
			
		});
		
		// click on the time line
		dates.click(function(event) {
			var that = this;
			event.preventDefault();
			if( ! jQuery(this).hasClass('active-date') ) {
				dates.each( function( index, el ) {
					if( that == el) {
						helper.move( index, 'point' );
					}
				});
			}
			
		});
		
		jQuery(window).on('keypress', function(e){ 
		
			if(e.keyCode == 39 || e.keyCode == 37) {
				if(helper.is_moving)
					return;
				e.preventDefault();
			}
	
			if(e.keyCode == 39 ){
				helper.move( slider_index, 'next' );
			} 
			if(e.keyCode == 37 ){
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
  		is_moving: false, 
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
			jQuery(el).removeClass( 'active-slide' );
		},
		remove_class_active_date: function(el){
			jQuery(el).parent().removeClass( 'active-date' );
		},
		move : function( index, where ) {
			helper.is_moving = true;
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
			
			storyline.find('.active-slide').animate( { opacity:0.3 }, { queue: false, duration: 100, always: function(){
				helper.remove_class_active_slider( this );
				
				dateline.find('.active-date').children('.date-wrap').animate( 
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
							
							next_date = dates.get( slider_index );
							
							jQuery( next_date ).children('.date-wrap').animate( { height:80, width:80, marginLeft:0, marginTop:0, fontSize:16 }, 200, 
								function()		{ jQuery(this).parent().addClass( 'active-date' ); helper.is_moving = false; } );
				
						} );
						
					} });
			
			} } );
			
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
	update_make_as_last: 0,
	ready : function() {
		jQuery().storyline('init');
		TimeLine.mark_all_as_last();
		
		jQuery(window).resize(function(){
			
			jQuery().storyline('init');
			TimeLine.mark_all_as_last();
		});
	},
	mark_all_as_last: function(){
		if( TimeLine.update_make_as_last == 0 || 
		( TimeLine.update_make_as_last > 980 && window.innerWidth < 980) || 
		( TimeLine.update_make_as_last < 980 && window.innerWidth > 980) ){
			if(window.innerWidth > 980){
				mod_num = 3;
			} else {
				mod_num = 2;
			}
			
			jQuery('.slide-wrap').each(function(index, el) {
				TimeLine.mark_as_last(el, mod_num);
			});	
			
			TimeLine.update_make_as_last = window.innerWidth;
		}
	},
	mark_as_last: function(el, mod_num ) {
		
		var stories = jQuery(el).children('.story');
		stories.removeClass('last-one').removeClass('last-two');
		mod = ( stories.length % mod_num )
		if( 2 == mod) {
			stories.slice(-mod).addClass("last-two");
		}
		if( 1 == mod) {
			stories.slice(-mod).addClass("last-one");
		} 
	}
}
jQuery(TimeLine.ready);

/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 * 
 * @author Nishanth Sudharsanam 
 * @version 1.2 Allowed tracking of amount of swipe which is passed to the callback.
 * 
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
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
 			preventDefaultEvents: false, // prevent default on swipe
			preventDefaultEventsX: true, // prevent default is touchwipe is triggered on horizontal movement
			preventDefaultEventsY: false // prevent default is touchwipe is triggered on vertical movement
	 };
     
     if (settings) $.extend(config, settings);

     this.each(function() {
    	 var startX;
    	 var startY;
		 var isMoving = false;
		 var touchesX = [];
		 var touchesY = [];
	     var timer;
    	 function cancelTouch() {
    		 this.removeEventListener('touchmove', onTouchMove);
    		 startX = null;
    		 startY = null;
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
	    			if(config.preventDefaultEventsX) {
    					 e.preventDefault(); 
    		 		}
	    		 	touchesX.push(dx);
					if(touchesX.length === 1){ // first call.. 
	    		 		timer=setTimeout(function(){ // wait a while incase we get other touchmove events
	    		 			cancelTouch();
	    		 			dxFinal = touchesX.pop();
	    		 			touchesX = []; // empty touches
	    		 			// call callbacks
	    					if(dxFinal > 0) {
	    						config.wipeLeft(Math.abs(dxFinal));
	    					}
	    					else {
	    						config.wipeRight(Math.abs(dxFinal));
	    					}
	    		 		},200);
	    		 	}
	    		 }
	    		 else if(Math.abs(dy) >= config.min_move_y) {
	    		    if(config.preventDefaultEventsY) {
    					 e.preventDefault(); 
    		 		}
	    		 	touchesY.push(dy);
					if(touchesY.length === 1){ // first call.. 
	    		 		timer=setTimeout(function(){ // wait a while incase we get other touchmove events
	    		 			cancelTouch();
	    		 			dyFinal = touchesY.pop();
	    		 			touchesY = []; // empty touches
	    		 			// call callbacks
	    					if(dyFinal > 0) {
	    						config.wipeDown(Math.abs(dyFinal));
	    					}
	    					else {
	    						config.wipeUp(Math.abs(dyFinal));
	    					}
	    		 		},200);
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
