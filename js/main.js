$(document).ready(function() {
	var script1 = 'js/third-party/jquery-jvectormap-1.2.2.min.js',
		script2 = 'js/third-party/jquery-jvectormap-us-aea-en.js',
		script3 = 'js/modules/map.js',
		imgs = {
			src: "images/assets/sflogo_no_bg_230.svg",
			w: 230,
			h: 230
		},
		img = new Image(imgs.w, imgs.h);
	img.src = imgs.src;
	$.when(loadPages(script1, script2, script3)).then(function() {
		setTimeout(function() {
			document.documentElement.style.webkitTouchCallout = "none";
			document.documentElement.style.webkitUserSelect = "none";

			$('#about-content .section_p p:last').fitText(1.35);

			applyFC();

			createSliders('init');

			$.getScript('js/modules/map2.js');

			hideLoader().then(function() {
				$('.tada').delay(400).fadeIn('normal').promise().then(function() {
					$(this).addClass('animated hinge');
				});
			});
		}, 1000);
	});

	$(document).on('click', 'article a:has(img)', function(e) {
		e.preventDefault();
	});

	$(document).on('click', '.cell.text', function() {
		$('.tab-item').eq(0).removeClass('active');
		pageSlide('#blog-content', '#home-content', 'left');
		$('.tab-item').eq(3).addClass('active');
	});

	$(document).on('click', '#map-content .segmented-controller li:not(".active")', function(e) {
		var $this = $(this);
		$('.segmented-controller li').toggleClass('active');
		pageSlide('#listContainer', null, 'down');
		hideMapData();
	});

	$('.bar-title,.content,.bar-tab,#splash').on('touchmove', function(e) {
		e.preventDefault();
	});

	$('#pc-touch-area').on('click', function(e) {
		$(this).parent().addClass('active');
		$('.segmented-controller li').toggleClass('active');
		pageSlide('#map-content', null, 'up');
	});

	$('#fax').on('touchstart click', function(e) {
		e.stopPropagation();
		e.preventDefault();
	});


	$(document).on('click', '.tab-item:not(".active")', function(e) {
		var aT = $('.tab-item.active'),
			toPage, fromPage,
			$this = $(this),
			aI = $('.tab-item').index(aT),
			index = $('.tab-item').index(this),
			pages = ['#home-content', '#about-content', '#map-content', '#blog-content', '#contact-content'];

		aT.removeClass('active');
		$this.addClass('active');

		toPage = pages[index];
		fromPage = pages[aI];
		if (index > aI) {
			pageSlide(toPage, fromPage, "left");
		} else {
			pageSlide(toPage, fromPage, "right");
		}
	});
	$(document).on('click', '#blogs li', function() {
		toggleBlog(this);
	});
	$(document).on('click', '.subpage .ui-icon-arrow-left', toggleBlog);
});