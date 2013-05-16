<?php 
/*
Plugin Name: Monthly Timeline
Plugin URI: http://ctlt.ubc.ca
Description: Lets you display you posts every month in a timeline fashion
Author: Enej UBC CTLT
Version: 0.3
*/


add_shortcode('monthly-timeline', 'monthly_timeline_shortcode_handler');
 
function monthly_timeline_shortcode_handler( $atts ) {
	
	
	// Attributes
	extract( shortcode_atts(
		array(
			'query' => '',
			'taxonomy'   => '',
			'taxonomy_is'=> '',
			'filter_1'   => '',		
			'filter_2'   => '',			
			'filter_3_1'   => '',
			'filter_3_2'   => '',
		), $atts )
	);


	wp_enqueue_script( 'monthly-timeline' , plugins_url( 'js/monthly-timeline.js', __FILE__), array('jquery'), '1.0', true );
	ob_start();
  ?> 
  <div id="storyline-wrap">
	<div id="story-filter"  class="filter-wrap">
	
		<label>Filter By</label>
		
		<?php if( $filter_1 ): ?>
		<div  id="commitment"  class="btn-group">
			<button data-toggle="dropdown" class="btn btn-small dropdown-toggle"><?php echo $filter_1; ?> <span class="caret"></span></button>
			<ul class="dropdown-menu">
				
			  <li><a href="#<?php echo $filter_1;?>-all">All</a></li>
			  <?php monthly_timeline_filter( $filter_1 ); ?>
			</ul>
		</div>
		<?php endif; ?>
				
		<a href="/" class="button action"><i class="icon-angle-left"></i> Story View</a>
	</div>
	<?php 
	if(!empty($query) ):
		$query = $query.'&posts_per_page=-1&orderby=date&order=DESC';
	else:
		$query = 'posts_per_page=-1&orderby=date&order=DESC';
	endif;
	
	$query = wp_parse_args( $query );
	
	if( !empty($taxonomy) && !empty($taxonomy_is)):
	$query['tax_query'] = array(
		array(
			'taxonomy' => $taxonomy,
			'field' => 'slug',
			'terms' => $taxonomy_is
		)
	);
	endif;

	$the_query = new WP_Query( $query );
	$store = array();
	$dates = array();
	
	while ( $the_query->have_posts() ):
		$the_query->the_post();
		
		$store[get_the_date('Y')][get_the_date('M')][] = array(
			'title' => get_the_title(),
			'url'	=> get_permalink(),
			'image' => get_the_post_thumbnail(get_the_ID(), array(80,80)),
			'commitment' => monthly_timeline_get_terms(get_the_ID(), 'commitment' ),
		);
		$output = '<li>' . get_the_title() . '</li>';
	endwhile;
	
	wp_reset_postdata();
	?>
	<div id="storyline">
	
		<?php 
			if(is_array($store)):
			foreach($store as $year => $month_stories):
				foreach($month_stories as $month => $stories): 
					
				$dates[] = array( $month, $year );
				$html = '
				
				<div class="slide '. $year.'-'.$month.'1">
					<div class="slide-wrap ">';
					foreach( $stories as $story): 
						
						$html .='<a class="story" data-commitment="'.esc_attr( implode( $story["commitment"], ',' ) ).'" href="'.esc_url($story["url"]).'">
						'.$story['image'].'
						<h2>'.$story['title'].'</h2>
						</a>';
					
					endforeach;
				$html .='	</div>
				</div>';
				
				$slider[] = $html;
				
				endforeach;
			endforeach;
			endif;
		//$slider = array_reverse ( $slider );
		if( is_array( $slider) ) :
			foreach($slider as $slide):		
				echo $slide;
			endforeach;
		endif;
		?>
	</div>
	<div class="action-container">
		<a href="#next" id="next-slide">Next</a> 
		<a href="#previous" id="previous-slide">Previous</a> 
	</div>
	<div class="datesline-shell">
	<div id="datesline-wrap">
		<div id="datesline">
			<?php
			// $dates = array_reverse ( $dates );
			foreach( $dates as $date):?>
				<a class="date" href="#">
					<div class="date-wrap">
						<div class="date-wrap-outer">
							<div class="date-wrap-inner">
								<span class="date-month date-part"><?php echo $date[0]; ?></span> 
								<span class="date-year date-part"><?php echo $date[1]; ?></span>
							</div>
						</div>
			
					</div>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
	</div>
</div>
<style>
/* TIMELINE VIEW */

#storyline-wrap{
	clear: both;
	position: relative;
	overflow: hidden;
}
.datesline-shell{
	overflow: hidden;
	width: 875px;
	margin: 0 auto;
}
.filter-wrap {
	text-align: center;
	margin: 20px auto;
	width: 600px;
	clear: both;
}
#bubble-filter{
	margin: 0 auto 40px;
}

.filter-wrap label{
	display: inline;
	color:#FFF;
	margin-right: 10px;
	text-transform: uppercase;
}
#story-filter .btn,
#bubble-filter .btn{
	background: #FFF;
	color:#4c025c;
	text-transform: uppercase;
	text-shadow: none;
	border-radius: 5px;
	padding: 1px 8px;
	border:none;
	letter-spacing: 1px;
	-moz-box-shadow: 2px 2px 2px rgba(0,0,0,0.3);
	-webkit-box-shadow: 2px 2px 2px rgba(0,0,0,0.3);
	box-shadow: 2px 2px 2px rgba(0,0,0,0.3);
}
.filter-wrap .caret{
	border-top: 4px solid #ac006d;
	margin:7px 5px 0 10px;
}
.filter-wrap .dropup .caret{
	border-top: 4px solid transparent;
	border-bottom:4px solid #ac006d;
	margin:4px 5px 0 10px;
}
.filter-wrap .dropdown-menu{
	text-align: left;
}
.filter-wrap .dropdown-menu li{
	border-bottom: none;
}
.slide{
	position: relative;
	overflow: hidden;
	width: 870px;
	float: left;
	text-align: center;
	margin:30px 0;
	opacity: 0.3;
	padding-bottom: 10px;
	min-height: 300px;
}
.slide-wrap{
	margin: 0 60px;
}
.active-slide{
	opacity: 1;
}
.story{
	background: #FFF;
	color: #4c025c;
	border-radius: 5px;
	width: 240px;
	margin: 10px 5px 0 5px;
	height:80px;
	float: left;
	position: relative;
	overflow: hidden;
	text-decoration: none;
	-moz-box-shadow: 2px 2px 2px rgba(0,0,0,0.3);
	-webkit-box-shadow: 2px 2px 2px rgba(0,0,0,0.3);
	box-shadow: 2px 2px 2px rgba(0,0,0,0.3);
	text-align: left;
}
.story:hover h2,
.story:hover{
	color:#FFF;
}
.story:hover {
	background:#ac006d;
}
#storyline-wrap .last-one{
	left: -120px;
	margin-left: 50%;
}
.last-two{
	left: 15%;
}
.story img{
	width: 80px;
	float: left;
	margin-right: 15px;
}
.story h2{
	font-size: 14px;
	line-height: 18px;
	letter-spacing: 0.1px;
	text-transform: uppercase;
	font-weight: 400;
	color: #4c025c;
	margin: 10px 10px;
}
/* next and previous slides action */
.action-container{
	position: absolute;
	left: 50%;
	width: 980px;
	margin-left: -490px;
	top:150px;
}
#previous-slide,
#next-slide{
	position: absolute;
	top:-29px;
	height: 305px;
	width: 40px;
	background: url(<?php echo plugins_url('/monthly-timeline/img/timeline-arrow.png'); ?>) no-repeat;
	text-indent: -999em;
}
#previous-slide:focus,
#next-slide:focus{
	outline: none;
}

#previous-slide{
	left: 30px;
	background-position: -85px 0;
}
#previous-slide:hover{
	background-position: 6px 0;
	outline: none;
}
#next-slide{
	right: 30px;
	background-position:  -124px 0;
}
#next-slide:hover{
	background-position: -215px 0;
	outline: none;
}
#datesline-wrap{
	clear: both;
	width: 100%;
	position: relative;
	background: url( <?php echo plugins_url('/monthly-timeline/img/month-view.png'); ?> ) no-repeat 50% 42%; 
	/* On bottom, like z-index: 1; */
}	
#datesline{
	clear: both;
	position: relative;
	overflow: hidden;
	margin-bottom: 100px;
	height: 90px;
	
}
.date{
	width: 80px;
	position: relative;
	float: left;
	overflow: visible;
}
.date:focus{
	outline: none;
}
.date:hover .date-wrap-inner{
	background: #ac006d;
	opacity: 1;
}
.date-wrap{
	width: 50px;
	height: 50px;
	color:#FFF;
	font-size: 11px;
	text-align: center;
	margin-top: 15px;
	margin-left: 15px;
	float: left;
	overflow: visible;
}

.date-wrap-outer{
	width: 90%;
	height: 90%;
	border:3px solid #ac006d;
	background: #4c025c;
	-moz-border-radius: 50%;
	-webkit-border-radius: 50%;
	border-radius: 50%; /* future proofing */
	-khtml-border-radius: 50%; /* for old Konqueror browsers */
}
.date-wrap-inner{
	padding: 0;
	width: 84%;
	height: 84%;
	margin-left: 8.6%;
	margin-top: 8.6%;
	background: #7c0165;
	opacity: 0.8;
	position: relative;
	-moz-border-radius: 50%;
	-webkit-border-radius: 50%;
	border-radius: 50%; /* future proofing */
	-khtml-border-radius: 50%; /* for old Konqueror browsers */
}
.active-date .date-wrap-inner{
	opacity: 1;
}
.active-date .date-wrap{
	width: 80px;
	height: 80px;
	font-size: 16px;
	margin-top: 0;
	margin-left: 0;
	vertical-align: middle;
}
.date-part{
	display: block;
	float: left;
	width: 100%;
}

.date-month{
	font-weight: 900;
	text-transform: uppercase;
	margin: 20% 0 0;
	float: left;
	line-height: 1;	
}
.date-year{
	margin: 0;
	line-height: 1;	
	font-weight: 100;
}
</style>

  <?php
  $output_string = ob_get_contents();
  ob_end_clean();
  
  return $output_string;
	
}

/**
 * monthly_timeline_filter function.
 * 
 * @access public
 * @param mixed $taxonomy
 * @return void
 */
function monthly_timeline_filter( $taxonomy, $filter ) { 
	
	$taxonomies = array(  $taxonomy );

	$args = array(
	    'orderby'       => 'name', 
	    'order'         => 'ASC',
	    'hide_empty'    => true, 
	    'fields'        => 'all', 
	    'hierarchical'  => false, 
	);
	$terms = get_terms( $taxonomies, $args );
	
	foreach( $terms as $term ):
		
		?><li><a href="#<?php echo $taxonomy.'-'.$term->slug; ?>" data-commitment="<?php echo esc_attr( $term->slug);?>" ><?php echo $term->name; ?></a></li><?php
		
	endforeach;
}

/**
 * monthly_timeline_get_terms function.
 * 
 * @access public
 * @param mixed $post_id
 * @param mixed $taxonomy
 * @return void
 */
function monthly_timeline_get_terms($post_id, $taxonomy ){
	if(empty($taxonomy)){
		return array();
	}
	$taxonomy_terms = get_the_terms( $post_id, $taxonomy );
	
	$terms = array();
	
	if( $taxonomy_terms ) {
		foreach( $taxonomy_terms as $term ) {
			$terms[] = $term->slug;
		}
	}
	
	return $terms;

}