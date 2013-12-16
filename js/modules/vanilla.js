/* Javascript Functions That For One Reason Or Another I Want To Keep Seperate From The File That Is Wrapped With $(document).ready */
/* initialize iscroll variables*/
var myScrollb, myScrollm, myScrollBi;

/* when page is loaded - init iscroll on blog page
 * Other iscroll generated at runtime
 */
function loaded() {
	setTimeout(function() {
		myScrollb = new iScroll('blog-scroll');
	}, 100);
}

/* show pageloading overlay*/
function showLoader() {
	if (arguments.length !== 0) {
		if (arguments[0] !== "string") {
			$('#global-loading').css('background', 'rgba(200,200,200,' + arguments[0] + ')');
		} else {
			$('#logo-wrapper img').fadeIn(600);
		}
	}
	$('#global-loading').css('left', '0').css('opacity', 1).addClass('active').fadeIn(300);
}
/* hide pageloading overlay*/
function hideLoader() {
	return $('#global-loading').removeClass('active').fadeOut(300, function() {
		$(this).css('opacity', 0).css('left', '9999px').css('background', 'rgba(255,255,255,.98)');
		$('#logo-wrapper img').fadeOut('normal');
	}).promise();
}
/* preload images based upon device*/
function imgPreload(pathStr) {
	var pathA = 'images/photos/about/' + pathStr + '/',
		pathH = 'images/photos/home/' + pathStr + '/',
		homeSlides = $('#home-content img.device'),
		aboutSlides = $('#about-content img.device'),
		defer = $.Deferred(),
		arr = [];
	homeSlides.each(function(i) {
		this.width = sf.device.width;
		this.height = sf.device.slideHeight;
		this.src = pathH + $(this).attr('data-src');
	});
	aboutSlides.each(function(i) {
		var dfr = $.Deferred();
		arr.push(dfr);
		$(this).one('load', function(e) {
			arr[i].resolve();
		});
		this.width = sf.device.aboutWidth;
		this.height = sf.device.slideHeight;
		this.src = pathA + $(this).attr('data-src');
	});
	return $.when.apply(null, arr).then(function() {
		defer.resolve();
	});

}

/* jsonp function to load blog*/
function loadBlog() {
	var dfr = $.Deferred(),
		request = $.ajax({
			url: 'http://www.sfarch.us/feed/json?=get_posts',
			dataType: 'json',
			beforeSend: setHeader
		});
	request.then(function(data) {
		$.extend(sf, {
			blog: data
		});
		$.each(data, function(i, a) {
			var li = $('<li/>', {
				"html": [
					$('<div/>', {
						"class": "article-caption",
						"html": a.excerpt,
					}), $('<div/>', {
						"class": "ui-icon-arrow-right"
					})
				],
				data: {
					id: a.id
				}
			});
			li.appendTo('#blogs');
		});
		return dfr.promise();
	});
	return dfr.resolve(request);
}

/* set request header - access - controll */
function setHeader(xhr) {
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
}
/* hide and show blog depending on blog item chosen, or returning to blog menu */
function toggleBlog(elem) {
	var dfr = $.Deferred(),
		splitter = [],
		hideShow = function(which) {
			var w = sf.device.width,
				h = sf.device.height,
				tx, ty, setIScroll;

			setIScroll = function() {
				if (typeof myScrollBi === "undefined") {
					setTimeout(function() {
						console.log('myScrollbi init');
						myScrollBi = new iScroll('b-container-iscroll');
						dfr.resolve();
					}, 600);
				} else {
					setTimeout(function() {
						console.log('myScrollbi refresh');
						myScrollBi.refresh();
						dfr.resolve();
					}, 600);

				}
				return dfr.promise();
			};
			if (which === 'hide') {
				tx = $('#b-article-wrapper').position().left + w;
				ty = (-1 * h);
				$('#b-article-wrapper').css('-webkit-transform', 'translate3d(' + tx + 'px,0,0)');
				$('#b-article-wrapper').one('webkitTransitionEnd', function() {
					var $this = $(this);
					setTimeout(function() {
						myScrollBi.destroy();
						myScrollBi = undefined;
						$this.css('-webkit-transform', 'translate3d(' + tx + 'px,' + ty + 'px,0)');
						dfr.resolve();
					}, 50);
				});
			} else {
				tx = w;
				ty = 0;
				$('#b-article-wrapper').css('-webkit-transform', 'translate3d(' + tx + 'px,0,0)');
				$('#b-article-wrapper').one('webkitTransitionEnd', function() {
					var $this = $(this);
					$this.css('-webkit-transform', 'translate3d(' + tx + 'px,0,0)');
					setTimeout(function() {
						$this.css('-webkit-transform', 'translate3d(0,0,0)');
					}, 0);
					setIScroll();
				});
			}
			return dfr;
		};
	if ($('#b-article-wrapper').hasClass('active')) {
		hideShow('hide').then(function() {
			$('#b-article-wrapper').removeClass('active');
		});
	} else {
		showLoader(0.6);
		var id = $(elem).data('id'),
			data = $.grep(sf.blog, function(i, j) {
				return i.id === id;
			}),
			content = data[0].content,
			title = data[0].title;
		$('#b-container .cell.text h5').html(title);
		content = content.replace(/\n/g, '</p></section><section><p>').replace(/(&nbsp;){2,}/g, '');
		content = '<section><p>' + content + '</section></p>';
		content = $.trim(content);
		$(content).find('p').filter(function() {
			return this.innerHTML === '' || this.innerHTML.match(/^(&nbsp;|\s)*?$/) !== null;
		}).each(function() {
			$(this).add($(this).parent('section')).detach();
		});
		$('.blog-article div:first').html($(content));
		hideShow('show').then(function() {
			$('#b-article-wrapper').addClass('active');
			hideLoader();
			myScrollBi.refresh();

		});
	}
	return dfr;

}

/* get Device information, and store a bunch of useful info in sf object - Then init image preload */

function getDevice() {
	var dfr = $.Deferred(),
		usrAgent = navigator.userAgent,
		pixelRatio = devicePixelRatio,
		pathStr;
	isiPhone = function() {
		return usrAgent.match(/iPhone;/gi) !== null;
	},
	isiPod = function() {
		return usrAgent.match(/iPod;/gi);
	},
	isiPad = function() {
		return usrAgent.match(/iPad;/gi) !== null;
	},
	isRetina = function() {
		return pixelRatio === 2.0;
	},
	isversion5 = function() {
		return $('body').height() > 480 && isRetina();
	},
	isversion4 = function() {
		return (!isversion5() && isRetina());
	};
	if (isiPhone() || isiPod()) {
		sf.device.device = isiPod() ? 'iPod' : 'iPhone';
		sf.device.width = 320;
		sf.device.height = 480;
		sf.device.pageHeight = 385;
		sf.device.slideHeight = 172;
		sf.device.aboutWidth = 290;
		if (isversion4()) {
			sf.device.retina = true;
			sf.device.version = 4;
			pathStr = 'iPhone_@2x';
		} else if (isversion5()) {
			sf.device.height = 568;
			sf.device.pageHeight = 473;
			sf.device.retina = true;
			sf.device.version = 5;
			pathStr = 'iPhone_@2x';
		} else {
			sf.device.retina = false;
			sf.device.version = 3;
			pathStr = 'iPhone';
		}
	} else if (isiPad()) {
		sf.device.device = 'iPad';
		sf.device.width = 768;
		sf.device.height = 1024;
		sf.device.retina = false;
		sf.device.version = 2;
		pathStr = 'iPad';
		if (isRetina()) {
			sf.device.retina = true;
			sf.device.version = 4;
			pathStr = 'iPad_@2x';
		}
	}
	transitionFix(sf.device.width, sf.device.height);
	dimensionsFix(sf.device.width, sf.device.height, sf.device.pageHeight);
	return imgPreload(pathStr);
}

/* any overrides for page item dimensions/placement should be placed in here */
function dimensionsFix(w, h, ph) {
	/* misc layout fixes depending on device */
	var fn = {
		568: {
			fix: function() {
				var boxH, imgPadding, fn;
				boxH = (ph - sf.device.slideHeight);
				imgPadding = (boxH - 175) / 2;
				/* Fix homepage box -height */
				$('#home-content .box.logo,.sfarchology,#home-content .box.logo .row').css('height', boxH + 'px');
				$('#home-content .box.logo .row').css('height', boxH + 'px');
				$('#logo').css('padding-top', imgPadding);
				return fn["480"]["global"]();
			}

		},
		1024: {
			fix: function() {

			}
		},
		480: {
			fix: function() {
				return this["global"]();
			},
			global: function() {
				// $('#contact-content .row.label').each(function() {
				//	var height = $(this).height();
				//	if ($(this).find('.address').length > 0) {
				//		height = $(this).find('.address').height();
				//	}
				//	$(this).find('.ui-icon').css({
				//		'height': height,
				//		"line-height": height + 'px'
				//	});
				// });
				// var fifth = $('.row.label.fifth').position().top,
				//	maxH = (ph - 20) - fifth,
				//	padding = fifth * .05,
				//	iMaxH = maxH - padding;
				// $('.row.label.fifth>div,.row.label.fifth img').css('height', maxH).css('line-height', maxH + 'px');
				// $('#contact-logo').css('padding-top', (padding / 2) + 'px');
				// $('#contact-logo a').css('line-height', maxH / 2 + 'px');
			}
		}
	}
	return (Object.keys(fn).indexOf(h) !== -1) ? fn[h].fix() : fn[480].fix();

}
/* on app load - sets appropriate transition X and Y positions on pages based upon device w & h */
function transitionFix(w, h) {
	var pageOrder = ['home-content', 'about-content', 'map-content', 'blog-content', 'contact-content'];
	$('#about-content,#map-content,#blog-content,#contact-content').each(function() {
		var x = pageOrder.indexOf(this.id) * w;
		$(this).css('-webkit-transform', 'translate3d(' + x + 'px,0,0)');
	});
	$("#listContainer").css('-webkit-transform', 'translate3d(' + (2 * w) + 'px,' + (-1 * h) + 'px,0)');
	$('#b-article-wrapper').css('-webkit-transform', 'translate3d(' + (4 * w) + 'px,' + (-1 * h) + 'px,0)');
}

window.addEventListener('load', loaded, false);

/* Check if blog page is ready - loop until ready while showing loader */
function checkReady() {
	if ($('#blogs li:visible').length < 1) {
		if ($('#global-loading').not('.active')) {
			console.log('not visible');
			showLoader();
		}
		setTimeout(function() {
			checkReady();
		}, 300);
	} else {
		hideLoader();
		return;
	}
}

/* global pageslide implimentation:
	also includes or calls various fixes based upon which page is being loaded */
function pageSlide(toPage, fromPage, direction) {
	var distance, fns, fn;
	distance = $(toPage).position() || 0;
	fn = 'go' + direction.charAt(0).toUpperCase() + direction.slice(1);

	if (toPage === "#blog-content") {
		console.log('checkReady');
		checkReady();
	}

	fns = {
		goLeft: function() {
			var $this = this;
			$('.page').each(function(i) {
				var distX = $(this).position().left - distance.left,
					distY = $(this).position().top;
				this.style["-webkit-transform"] = $this.getStyleString(distX, distY);
			});

		},
		goRight: function() {
			var $this = this;
			$('.page').each(function(i) {
				var distX = $(this).position().left + Math.abs(distance.left),
					distY = $(this).position().top;
				this.style["-webkit-transform"] = $this.getStyleString(distX, distY);
			});
		},
		goUp: function() {
			var $this = this,
				arr;
			arr = [$('#listContainer').css('-webkit-transform', $this.getStyleString(0, -480)), $('#map-content').css('-webkit-transform', $this.getStyleString(0, 0))];
			$('#listContainer').one('webkitTransitionEnd', function() {
				$('#pc-touch-area').parent().removeClass('active');
				myScrollm.scrollTo(0, 0);
				myScrollm.refresh();
			});
			return jQuery.apply(null, arr);
		},
		goDown: function() {
			var $this = this,
				arr;
			arr = [$('#listContainer').css('-webkit-transform', $this.getStyleString(0, 0)), $('#map-content').css('-webkit-transform', $this.getStyleString(0, 480))];
			$('#listContainer').one('webkitTransitionEnd', function() {
				if (typeof myScrollm === "undefined") {
					setTimeout(function() {
						myScrollm = new iScroll('map-iscroll-base');
					}, 0);
				} else {
					setTimeout(function() {
						myScrollm.refresh();
					}, 100);
				}
			});
			return jQuery.apply(null, arr);
		},
		getStyleString: function(x, y) {
			return 'translate3d(' + x + 'px,' + y + 'px,0)';
		},
		hiddenUp: function() {
			var x = $('#map-content').position().left;
			$('#map-content').css('-webkit-transform', 'translate3d(' + x + 'px,0px,0px)');
			$('#listContainer').css('-webkit-transform', 'translate3d(' + x + 'px,-480px,0px)');
		}
	};
	fns[fn]();
	if (fromPage === "#map-content") {
		hideMapData();
		if ($(fromPage).position().top !== 0 && (direction === "left" || direction === "right")) {
			setTimeout(function() {
				$('.segmented-controller li').toggleClass('active');
				fns.hiddenUp();
			}, 1500);
		}
	}

}
/* enhanced version of jQuery.getScript - returns resolved deferred */
function getScript(script) {
	var dfr = $.Deferred();
	return $.getScript(script).then(function() {
		return dfr.resolve();
	}, function() {
		setTimeout(function() {
			getScript(script);
		}, 1000);
	});

}

/* attach fastclick handler where appropriate */

function applyFC() {
	FastClick.attach(document.body);
	$('circle').each(function(i) {
		FastClick.attach(this);
	});
}

/* basically the init function
 * delegates functions, manages deferred objects on app load
 */
function loadPages(script1, script2, script3) {
	showLoader();
	var defer = $.Deferred(),
		when = $.when(getScript(script1)).then(function(data) {
			return getScript(script2);
		}).then(function(data) {
			return getScript(script3);
		}).then(function() {
			defer.resolve([getDevice(), loadBlog()]);
		});
	defer.done(function() {
		sf.blogReady = 1;
	});
	return defer.promise(when);
}

/* Callback that displays mapData text at page bottom */
function showMapData(data, elem) {
	var ul = $('<ul/>', {
		html: [$('<li/>'), $('<li/>'), $('<li/>')]
	});
	sf.ul = ul;
	$(ul).find('li:first').html(data.building);
	$(ul).find('li:eq(1)').html(data.street);
	$(ul).find('li:eq(2)').html(data.city + ',' + data.state + ' ' + data.zip);

	$(elem).replaceWith($(ul));
}

/* hideMapData -
 *		based upon various conditions that involve
 *		not wanting to see that data anaymore
 */

function hideMapData() {
	var ul = $('#mapInfo ul');
	if (ul.length > 0) {
		ul.replaceWith(sf.p);
	}
	$('circle').eq(sf.clickMap.lastClicked).attr('r', 7).css('fill-opacity', 0.5).css('fill', '#ff9500');
}


function createSliders(slider, options) {
	if (typeof arguments[0] === 'undefined') {
		throw arguments.callee;
	}
	if (slider === "init") {
		var instance, reverse, sizes, atTheEnd;

		options = {
			animation: 'slide',
			controlNav: false,
			directionNav: false,
			slideshowSpeed: 4000,
			pauseOnAction: false,
		};
		sizes = {
			first: {
				itemWidth: 320
			},
			second: {
				itemWidth: 290
			}
		};
		atTheEnd = {
			after: function(slider) {
				if (slider.atEnd === false) {
					slider.pause();
					slider.play();
				} else {
					var index = $('.slider').index(slider);
					instance = index === 1 ? 'second' : 'first';
					options.itemWidth = sizes[instance].itemWidth;
					if (slider.currentSlide !== 0) {
						reverse = true;
					} else {
						reverse = false;
					}
					$.extend(options, {
						reverse: reverse
					});
					slider.pause();
					createSliders(slider, options);
				}
			}
		};

		$.extend(options, atTheEnd, sizes['first']);
		$('.slider:first').flexslider(options);

		options.itemWidth = sizes['second'];

		$('.slider:eq(1)').flexslider(options);
	} else {
		slider.removeData('flexslider');
		slider.flexslider(options);
	}
}