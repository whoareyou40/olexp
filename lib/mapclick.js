var params = {
  LAYERS: 'xblk:navigation',
  FORMAT: 'image/png',
  
};
var params1 = {

};
var result;
var startPoint;
var destPoint;
var vectorLayer;

function initMap() {
  startPoint = new ol.Feature();
  destPoint = new ol.Feature();

	// The vector layer used to display the "start" and "destination" features.
	vectorLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
		features: [startPoint, destPoint]
		}),
		style:new ol.style.Style({
			image:new ol.style.Icon(({
				size:[24,36],
				anchor:[0.5,0.75],
				anchorXUnits:'fraction',
				anchorYUnits:'fraction',
				src:'../lib/marker.png'
			}))
		})
	});
	map.addLayer(vectorLayer);
	map.on('click', clickMap);
	
	//清空路径规划结果
	var clearButton = document.getElementById('clear');
	clearButton.addEventListener('click', function(event) {
		// Reset the "start" and "destination" features.
    clearResult();
  });
}

function clearResult() {
	startPoint.setGeometry(null);
	destPoint.setGeometry(null);
	// Remove the result layer.
	map.removeLayer(result);
}

function clickMap(event) {
  if (startPoint.getGeometry() != null && destPoint.getGeometry() != null) {
    clearResult();  
  }

	if (startPoint.getGeometry() == null) {
    // First click.
    startPoint.setGeometry(new ol.geom.Point(event.coordinate));
    console.info(event.coordinate);
  } else if (destPoint.getGeometry() == null) {
    // Second click.
    destPoint.setGeometry(new ol.geom.Point(event.coordinate));
    console.info(event.coordinate);
    // Transform the coordinates from the map projection (EPSG:3857)
    // to the server projection (EPSG:4326).
    var startCoord = (startPoint.getGeometry().getCoordinates());
    var destCoord = (destPoint.getGeometry().getCoordinates());

    var viewparams = [
      'x1:' + startCoord[0], 'y1:' + startCoord[1],
      'x2:' + destCoord[0], 'y2:' + destCoord[1]
	  //'x1:' + 12952117.2529, 'y1:' + 4836395.5717,
      //'x2:' + 12945377.2585, 'y2:' + 4827305.7549
    ];
    params.viewparams = viewparams.join(';');
    params1.viewparams = viewparams.join(';');
    result = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url:ServerUrl + '/geoserver/xblk/wms',  
        params: params
      })
    });
    console.info(result);

    var vector1 = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
           // url: ServerUrl + '/geoserver/xblk/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=xblk:navigation&outputFormat=application%2Fjson',
            url: ServerUrl + '/geoserver/xblk/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=xblk:road_xblk&maxFeatures=50&outputFormat=application%2Fjson',
            
            params: params1
        }),
        style: function (feature, resolution) {
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'blue',
                    width: 1
                })
            });
        }
    });
    console.info(vector1);
    map.addLayer(vector1);
    map.addLayer(result);
  }
}