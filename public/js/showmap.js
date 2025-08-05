mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: campground.geometry.coordinates,
    zoom: 12,
});

map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25, anchor: "top" }).setHTML(`
          <div class="camp-popup">
            <h4 class="camp-popup-title">${campground.title}</h4>
            <p class="camp-popup-location">📍 ${campground.location}</p>
          </div>
        `)
    )
    .addTo(map);
