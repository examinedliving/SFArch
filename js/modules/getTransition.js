getTransition = function(ind, act) {
	var arr = ["left-3", "left-2", "left-1", "active-page", "right-1", "right-2", "right-3"],
		newIndex, distance;
	if (act > ind) {
		distance = Math.abs(act - ind);
		$('.page').each(function(i) {
			var c, cl = Array.prototype.slice.call(this.classList);
			c = cl.filter(function(e, i, a) {
				return e.indexOf('left') !== -1 || e.indexOf('active-page') !== -1;
			}).join();
			newIndex = arr.indexOf(c) - distance;
			$(this).addClass(arr[newIndex]).removeClass(c);
		});

	} else {
		distance = Math.abs(ind - act);
		$('.page').each(function(i) {
			var c, cl = Array.prototype.slice.call(this.classList);
			c = cl.filter(function(e, i, a) {
				return e.indexOf('right') !== -1 || e.indexOf('active-page') !== -1;
			}).join();
			newIndex = arr.indexOf(c) + distance;
			$(this).addClass(arr[newIndex]).removeClass(c);
		});
	}

};