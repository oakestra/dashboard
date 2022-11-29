function initMap(lng, lat, circle_radius) {
    const coords = ol.proj.fromLonLat([lng, lat]);

    const location = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat])),
    });

    location.setStyle(
        new ol.style.Style({
            image: new ol.style.Icon({
                // crossOrigin: 'anonymous',
                // For Internet Explorer 11
                imgSize: [50, 80],
                src: 'assets/js/marker_map.svg',
            }),
        }),
    );

    const circleFeature = new ol.Feature({
        // geometry: new ol.geom.Circle([lng, lat], 50),
        geometry: new ol.geom.Circle(coords, circle_radius),
    });
    circleFeature.setStyle(
        new ol.style.Style({
            renderer(coordinates, state) {
                const [[x, y], [x1, y1]] = coordinates;
                const ctx = state.context;
                const dx = x1 - x;
                const dy = y1 - y;
                const radius = Math.sqrt(dx * dx + dy * dy);

                const innerRadius = 0;
                const outerRadius = radius * 1.4;

                const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
                gradient.addColorStop(0, 'rgba(255,0,0,0)');
                gradient.addColorStop(0.6, 'rgba(0,0,255,0.2)');
                gradient.addColorStop(1, 'rgba(0,0,255,0.8)');
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
                ctx.fillStyle = gradient;
                ctx.fill();

                ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
                ctx.strokeStyle = 'rgba(0,0,255,1)';
                ctx.stroke();
            },
        }),
    );

    const vectorSource = new ol.source.Vector({
        features: [location, circleFeature],
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
    });

    var map = new ol.Map({
        target: 'map',
        layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), vectorLayer],
        view: new ol.View({
            center: coords,
            zoom: 15,
        }),
    });
}
