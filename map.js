// Inicializace mapy – střed ČR
const map = L.map('map').setView([49.8, 15.5], 7);

// Podkladová mapa OpenStreetMap
L.tileLayer('https://stadiamaps.com{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);


// Načtení bodů z GeoJSONu
fetch('body.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error('Nepodařilo se načíst body.geojson (HTTP ' + response.status + ')');
    }
    return response.json();
  })
  .then(data => {
    const vrstva = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.bindPopup(
          '<h3>' + p.nazev + '</h3>' +
          '<p>' + p.popisek + '</p>'
        );
        layer.bindTooltip(p.nazev);
      }
    }).addTo(map);

    // Přizpůsobení výřezu všem bodům
    map.fitBounds(vrstva.getBounds(), { padding: [50, 50] });
  })
  .catch(err => console.error(err));
