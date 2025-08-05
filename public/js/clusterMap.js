mapboxgl.accessToken = mapToken;

const currentHour = new Date().getHours();

let lightPreset = "night";
let theme = "high-contrast";

if (currentHour >= 5 && currentHour < 8) {
    lightPreset = "dawn";
} else if (currentHour >= 8 && currentHour < 18) {
    lightPreset = "day";
} else if (currentHour >= 18 && currentHour < 20) {
    lightPreset = "dusk";
} else {
    lightPreset = "night";
}

const map = new mapboxgl.Map({
    container: "cluster-map",
    style: "mapbox://styles/mapbox/standard",
    config: {
        basemap: {
            theme: theme,
            lightPreset: lightPreset,
        },
    },
    center: [-103.5917, 40.6699],
    zoom: 3,
});

map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource("campgrounds", {
        type: "geojson",
        generateId: true,
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "campgrounds",
        filter: ["has", "point_count"],
        paint: {
            // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            "circle-color": [
                "step",
                ["get", "point_count"],
                "#34d399",
                10,
                "#facc15",
                30,
                "#ef4444",
            ],
            "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                10,
                25,
                30,
                30,
            ],
            "circle-emissive-strength": 1,
        },
    });

    map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "campgrounds",
        filter: ["has", "point_count"],
        layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
        },
    });

    map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "campgrounds",
        filter: ["!", ["has", "point_count"]],
        paint: {
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
            "circle-emissive-strength": 1,
        },
    });

    // inspect a cluster on click
    map.addInteraction("click-clusters", {
        type: "click",
        target: { layerId: "clusters" },
        handler: (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ["clusters"],
            });
            const clusterId = features[0].properties.cluster_id;
            map.getSource("campgrounds").getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom,
                    });
                }
            );
        },
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.addInteraction("click-unclustered-point", {
        type: "click",
        target: { layerId: "unclustered-point" },
        handler: (e) => {
            const coordinates = e.feature.geometry.coordinates.slice();
            const { popUpMarkup } = e.feature.properties;
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popUpMarkup)
                .addTo(map);
        },
    });

    // Change the cursor to a pointer when the mouse is over a cluster of POIs.
    map.addInteraction("clusters-mouseenter", {
        type: "mouseenter",
        target: { layerId: "clusters" },
        handler: () => {
            map.getCanvas().style.cursor = "pointer";
        },
    });

    // Change the cursor back to a pointer when it stops hovering over a cluster of POIs.
    map.addInteraction("clusters-mouseleave", {
        type: "mouseleave",
        target: { layerId: "clusters" },
        handler: () => {
            map.getCanvas().style.cursor = "";
        },
    });

    // Change the cursor to a pointer when the mouse is over an individual POI.
    map.addInteraction("unclustered-mouseenter", {
        type: "mouseenter",
        target: { layerId: "unclustered-point" },
        handler: () => {
            map.getCanvas().style.cursor = "pointer";
        },
    });

    // Change the cursor back to a pointer when it stops hovering over an individual POI.
    map.addInteraction("unclustered-mouseleave", {
        type: "mouseleave",
        target: { layerId: "unclustered-point" },
        handler: () => {
            map.getCanvas().style.cursor = "";
        },
    });
});
