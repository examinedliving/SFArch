/*home.js*/
(function($, window) {
	sf.cache = {
		touches: [],
		pageX: 0,
		movedTouches: []
	};

	$(this).on('scrollstart', function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();
	});


	$(this).find('ui-content').on('touchend', function(e) {
		var touches = sf.cache.movedTouches,
			diff = Math.abs(touches[0] - touches[touches.length - 1]);
		if (diff > 2) {
			e.stopImmediatePropagation();
			e.preventDefault();
		}
	});
	$(this).find('.ui-content').on('touchstart', function(e) {
		var touchpoint = e.originalEvent.changedTouches[0].pageY;
		sf.cache.movedTouches.push(touchpoint);
	});

	$('.img-slide').on('touchend touchstart', function(e) {
		$('.l-arrow,.r-arrow').removeClass('init');
		var cancel = false,
			classAdd = 'tmp';
		if ($('#img-slide-container').hasClass('.moving')) {
			cancel = true;
		}
		var startX, distance, verticalDistance,
			classRemove, direction, currentX,
			startY, classKeep, currentY,
			goFwd, goBack,
			index = $('.img-slide').index(this);
		touches = sf.cache.touches = e.originalEvent.changedTouches;

		if (e.type === "touchstart") {
			/* First Touch */
			sf.cache.pageX = touches[0].pageX;
			sf.cache.pageY = touches[0].pageY;
		} else {

			classAdd = index;
			startX = sf.cache.pageX;
			startY = sf.cache.pageY;
			currentX = touches[0].pageX;
			currentY = touches[0].pageY;
			verticalDistance = Math.abs(currentY - startY);
			direction = currentX < startX ? 'fwd' : 'back';

			distance = (direction == 'fwd') ? Math.abs(startX - currentX) : Math.abs(currentX - startX);

			goFwd = (direction === "fwd" && distance >= 10 && index < 5) ? true : false;
			goBack = (direction === "back" && distance >= 10 && index > 0) ? true : false;

			classRemove = classAdd;
			if (goFwd) {
				classRemove = 'img-' + classRemove;
				classAdd = 'img-' + parseInt(index + 1, 10);
			} else if (goBack) {
				classRemove = 'img-' + classRemove;
				classAdd = 'img-' + parseInt(index - 1, 10);
			} else {
				classKeep = 'img-' + classRemove;
				classAdd = 'tmp';
				classRemove = 'tmp';
			}

			$('#slide-container').addClass(classAdd);
			$('#slide-container').removeClass(classRemove);
			$('#img-slide-container').addClass('moving');

			if (classAdd === 'tmp' || cancel) {

				$('#slide-container').removeClass(classAdd);
				$('#slide-container').addClass(classKeep);
				$('#img-slide-container').removeClass('moving');
			}
		}
	});

	$('#slide-container').on('transitionend', function(e) {
		$('#slide-container').removeClass('tmp');

		if ($(this).hasClass('img-5')) {
			$('#img-slide-container').removeClass('l-end').addClass('r-end');
		} else if ($(this).hasClass('img-0')) {
			$('#img-slide-container').removeClass('r-end').addClass('l-end');
		} else {
			$('#img-slide-container').removeClass('l-end r-end');
		}
		$('#img-slide-container').removeClass('moving');
	});

	$(this).on('tap', '.r-arrow,.l-arrow', function(e) {
		var cancel = false,
			classAdd = 'tmp';
		if ($('#img-slide-container').hasClass('moving')) {
			cancel = true;
		}
		var classRemove,
			goFwd, goBack,
			rArrow = $(this).is('.r-arrow') ? $(this) : false,
			lArrow = $(this).is('.l-arrow') ? $(this) : false;

		classAdd = parseInt($('#slide-container').prop('classList')[0].split('-')[1], 10);

		classRemove = classAdd;

		goFwd = (rArrow && $('.r-end').length === 0) ? true : false;

		goBack = (lArrow && $('.l-end').length === 0) ? true : false;

		if (goFwd) {
			classRemove = 'img-' + classAdd;
			classAdd = 'img-' + parseInt(classAdd + 1, 10);
		} else if (goBack) {
			classRemove = 'img-' + classAdd;
			classAdd = 'img-' + parseInt(classAdd - 1, 10);
		} else {
			classKeep = 'img-' + classAdd;
			classRemove = 'tmp';
			classAdd = 'tmp';
		}
		sf.cache.removed = classRemove;
		$('#img-slide-container').addClass('moving');
		$('#slide-container').addClass(classAdd).removeClass(classRemove);

		if (classAdd === 'tmp' || cancel) {
			$('#img-slide-container').removeClass('moving');
			$('#slide-container').addClass(classKeep);
			$('#slide-container').removeClass(classAdd);
		}

	});

}(jQuery, window));