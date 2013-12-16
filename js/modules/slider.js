(function($,window,undefined){

	$.fn.slider=function(){
		return $(this).slider.init();
	}

	$.fn.slider.init=function(){
		var $this=$(this),
			dfr=$.Deferred();
			$active=$(this).find('.active').length>0 ? $(this).find('.active') : $(this).find('li:first'),
			$next=$active.next('li'),
			index=$this.find('li').index($next),
			len=$this.find('li').length,
			newNext,$newNext;
			if(index===(len-1)){
				newNext=0;
			} else {
				newNext=index+1;
			}
			$newNext=$this.find('li').eq(newNext);
			$newNext.addClass('newNext');
			dfr.resolve(loop($active,$next,$newNext));
			
	}

	var loop=function($active,$next,$newNext){
		var dfr=$.Deferred();
		setTimeout(function(){
			$active.removeClass('active');
			$next.addClass('active').removeClass('next');
			$active.transition({"-webkit-transform":"translate3d(-320px,0,0)"},500,'easeOutQuad');
			$('.mySlider .active').transition({"-webkit-transform":"translate3d(0px,0,0)"},500,'easeOutQuad');
			$newNext.transition({"-webkit-transform":"translate3d(320px,0,0)"},0,'linear').delay(500).addClass('next').removeClass('newNext');
			dfr.resolve();
		},1500);
		dfr.done(function(){
			clearTimeout();
			$('.mySlider').init();
		});

	}

	$.fn.slider.state={
		initiated:false
	}

	$.fn.slider.show=function(){
		
	}

	$.fn.slider.hide=function(){

	}

	$.fn.slider.layout=function(){

	}

	$.fn.slider.moveToEnd=function(){

	}

	$.fn.slider.stop=function(){

	}

	var getWidth=function(elem){
		return elem.width();
	}


	$.fn.slider.defaults={
		delay:1000,
		distance:320,
		action:'init'
	}

	var init=function(elem,args){
		if(!$.fn.slider.state.initiated){
			$.fn.slider.state.initiated=true;
		} 
		$.fn.slider.config=$.extend({},$.fn.slider.defaults,args);
		return $(elem).slider.call(null,$.fn.slider.config.action);
	}


}(jQuery,window))

