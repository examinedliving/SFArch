 (function($, window) {

     $.each(sf.fullData, function(i, a) {
         $('.list-project').eq(i).data('fullData', a);
     });

     var map = $('#svgMap').vectorMap('get', 'mapObject');

     map.setFocusLatLng = function(scale, lat, lng) {
         var point,
             proj = jvm.WorldMap.maps[this.params.map].projection,
             centralMeridian = proj.centralMeridian,
             width = this.width - this.baseTransX * 2 * this.baseScale,
             height = this.height - this.baseTransY * 2 * this.baseScale,
             inset,
             bbox,
             scaleFactor = this.scale / this.baseScale,
             centerX,
             centerY;

         if (lng < (-180 + centralMeridian)) {
             lng += 360;
         }

         point = jvm.Proj[proj.type](lat, lng, centralMeridian);

         inset = this.getInsetForPoint(point.x, point.y);
         if (inset) {
             bbox = inset.bbox;

             centerX = (point.x - bbox[0].x) / (bbox[1].x - bbox[0].x);
             centerY = (point.y - bbox[0].y) / (bbox[1].y - bbox[0].y);

             this.setFocus(scale, centerX, centerY);
         }
     };



     $(document).on('click', '.list-project', function(e) {
         $('circle').eq(sf.clickMap.lastClicked).attr('r', 7).css('fill-opacity', 0.5).css('fill', '#ff9500');
         pageSlide('#listContainer', null, 'up');
         var fullData = $(this).data('fullData'),
             lat = fullData.mapData.latLng[0],
             lng = fullData.mapData.latLng[1],
             id = fullData.id,
             circle = $('circle').filter(function() {
                 return fullData.id === $(this).data('fullData').id;
             }),
             index = $('circle').index(circle),
             lastClicked = sf.clickMap.lastClicked;
         if (typeof sf.p === "undefined") {
             sf.p = $('#mapInfo p');
             showMapData(fullData, sf.p);
         } else if ($('#mapInfo p').length === 0) {
             showMapData(fullData, $('#mapInfo ul'));
         } else {
             showMapData(fullData, $('#mapInfo p'));
         }
         sf.clickMap[lastClicked]['clicked'] = 0;
         sf.clickMap[index]['clicked'] = 1;
         sf.clickMap.lastClicked = index;
         map.setFocusLatLng(8, lat, lng);
         $('circle').eq(index).attr('r', 10).css('fill', "#0079c2").css('fill-opacity', 1);
         $('.segmented-controller li:first').addClass('active');
         $('.segmented-controller li:last').removeClass('active');
     });


     $(document).delegate('circle', 'click', function(e, i) {
         var index = $(this).data('index'),
             lastClicked = sf.clickMap.lastClicked,
             fullData = $(this).data('fullData'),
             elem;
         sf.clickMap.lastClicked = index;
         if (typeof sf.p === "undefined") {
             sf.p = $('#mapInfo p');
             elem = $('#mapInfo p');
         } else if ($('#mapInfo p').length === 0) {
             elem = $('#mapInfo ul');
         } else {
             elem = $('#mapInfo p');
         }
         if (sf.clickMap[index]['clicked'] === 0) {
             showMapData(fullData, elem);
             sf.clickMap[lastClicked]['clicked'] = 0;
             sf.clickMap[index]['clicked'] = 1;
             $('circle').eq(lastClicked).attr('r', 7).css('fill', '#ff9500').css('fill-opacity', 0.5);
             $('circle').eq(index).attr('r', 10).css('fill', "#0079c2").css('fill-opacity', 1);
         } else {
             $('circle').eq(index).attr('r', 7).css('fill', '#ff9500').css('fill-opacity', 0.5);
             sf.clickMap[index]['clicked'] = 0;
             hideMapData();
             e.preventDefault();
         }
     });

 }(jQuery, window))