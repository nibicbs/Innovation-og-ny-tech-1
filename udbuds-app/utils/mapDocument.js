// Kortet kører i en isoleret WebView. Ingen Google-nøgle er nødvendig.
export function mapDocument(css) {
    return `<!doctype html>
<html lang="da"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
 integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
<style>${css}</style></head><body><div id="map" aria-label="Opgaver i nærheden"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
 integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script>
function notify(type, id) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({type: type, id: id}));
}
if (!window.L) {
    notify('error');
} else {
    var map = L.map('map', { zoomControl: false });
    L.control.zoom({position: 'topright'}).addTo(map);
    var markers = L.layerGroup().addTo(map);
    var positioned = false;
    var loadedTiles = 0;
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.on('loading', function() { loadedTiles = 0; });
    tiles.on('tileload', function() { loadedTiles++; notify('loaded'); });
    tiles.on('load', function() { if (!loadedTiles) notify('error'); });
    tiles.addTo(map);
    function locationOf(item) { return [item.latitude, item.longitude]; }
    function label(text) {
        var node = document.createElement('span');
        node.textContent = text;
        return node;
    }
    window.renderMap = function(data) {
        if (!positioned) {
            map.fitBounds([locationOf(data.profile), locationOf(data.profiles.customer),
                locationOf(data.profiles.company)].concat(data.tasks.map(locationOf)),
                {padding: [32, 32], maxZoom: 15});
            positioned = true;
        }
        markers.clearLayers();
        L.circle(locationOf(data.profile), {
            radius: data.profile.radiusMeters, color: '#17324D', weight: 2,
            opacity: 0.65, fillOpacity: 0.03, interactive: false
        }).addTo(markers);
        ['customer', 'company'].forEach(function(role) {
            var person = data.profiles[role];
            L.marker(locationOf(person), {
                icon: L.divIcon({className: 'profile-pin ' + role, iconSize: [20, 20]}),
                title: person.name, zIndexOffset: -100
            }).bindTooltip(label(person.name)).addTo(markers);
        });
        data.tasks.forEach(function(task, index) {
            var selected = task.id === data.selectedId;
            if (selected) L.circle(locationOf(task), {
                radius: task.radiusMeters, color: '#2E7D73', weight: 3, opacity: 0.85, fillOpacity: 0.08, interactive: false
            }).addTo(markers);
            L.marker(locationOf(task), {
                icon: L.divIcon({className: 'task-pin' + (selected ? ' selected' : ''), html: String(index + 1), iconSize: [40, 40]}),
                title: task.title, alt: task.title, zIndexOffset: selected ? 100 : 0
            }).on('click', function() { notify('select', task.id); }).addTo(markers);
        });
    };
    window.addEventListener('resize', function() { map.invalidateSize(); });
    notify('mounted');
}
</script></body></html>`;
}

export function mapUpdateScript(data) {
    // Databasetekst behandles som data, aldrig som HTML eller JavaScript.
    const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    return `window.renderMap && window.renderMap(${json}); true;`;
}
