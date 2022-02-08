function initMap(lng, lat) {

  const rome = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([11.668118226444951, 48.26255677936406])),
  });

  rome.setStyle(
    new ol.style.Style({
      image: new ol.style.Icon({
        // crossOrigin: 'anonymous',
        // For Internet Explorer 11
        imgSize: [50, 80],
        src: 'assets/js/marker_map.svg',
      }),
    })
  );

  const vectorSource = new ol.source.Vector({
    features: [rome],
  });

  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
  });

  var map = new ol.Map({
    target: 'map',
    layers: [new ol.layer.Tile({source: new ol.source.OSM()}), vectorLayer],
    view: new ol.View({
      center: ol.proj.fromLonLat([lng, lat]),
      zoom: 12
    })
  });
}
