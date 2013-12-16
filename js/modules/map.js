//map.js
/* Functions related to populating map, etc. */

(function($, window, undefined) {
	$.Deferred(function(defer) {
		var json, response, mapData = [],
			clickMap = {},
			extractedData = [];

		json = $.getJSON('res/data/project_data.json');
		response = json.then(function(data) {
			$.each(data, function(i, a) {
				extractedData.push(a);
				mapData.push(a.mapData);
				clickMap[i] = {
					clicked: 0
				};
			});
			clickMap.lastClicked = 0;
			$.extend(sf, {
				fullData: extractedData,
				mapData: mapData,
				clickMap: clickMap
			});
			defer.promise(sf);
		}).then(function() {
			$('#svgMap').vectorMap({
				map: 'us_aea_en',
				scaleColors: ['#C8EEFF', '#0071A4'],
				normalizeFunction: 'polynomial',
				hoverOpacity: 1.0,
				hoverColor: false,
				markerStyle: {
					initial: {
						fill: '#FF9500',
						stroke: '#383f47',
						"stroke-width": 1,
						"fill-opacity": 0.5,
						r: 7
					}
				},
				focusOn: {
					x: 0.73,
					y: 0.33,
					scale: 2.8
				},
				zoomMax: 32,
				markers: sf.mapData
			});
			$('path').filter(function(i) {
				var code = $(this).data('code');
				return code === "US-AK" || code === "US-HI";
			}).hide();
			$('circle').each(function(i) {
				$(this).data('fullData', sf.fullData[i]);
			});
			defer.resolve();
		}).promise();
		return defer;
	});
}(jQuery, window));