(function($){
	$(window).load(function(){
		
        /*	FlexSlide text
        /*----------------------------------------------------*/
		$('.flexslider').flexslider({
			animation: "slide",
			selector: ".flex-slogan > li",
			controlNav: false,
			directionNav: false,
			direction: "vertical",
			slideshowSpeed: 4000,
			keyboard: true,
			touch: false,
         });
        
		
        /*	countdown
        /*----------------------------------------------------*/
        var dateFinal = '2019/11/01';

        $('.countdown').countdown(dateFinal, function(event) {

            var $this = $(this)

            //$this.find('span.weeks').html(event.strftime('%w'));
            $this.find('span.days').html(event.strftime('%D'));
            $this.find('span.hours').html(event.strftime('%H'));
            $this.find('span.minutes').html(event.strftime('%M'));
            $this.find('span.seconds').html(event.strftime('%S'));
        });
        
	});
    
    /*	slideshow1 ( nivo Slider )
    /*----------------------------------------------------*/
    $(function(){

            startSlideshow();

        })

        function startSlideshow() {

            $('#nivoSlider').nivoSlider({
                effect: 'slideInRight'
            });

        }
    
})(jQuery);
