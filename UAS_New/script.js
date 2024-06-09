// 1. Menambahkan Elemen Dasar Peta Pada Halaman HTML
const map = L.map('map').setView([-6.816, 107.1425], 13);

// 1.2 Menambahkan Basemap OSM
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// 1.3 Menambahkan Basemap OSM HOT
const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

// 1.4 Menambahkan Basemap Google
const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// 1.5 Menambahkan Fitur Fullscreen Peta
map.addControl(new L.Control.Fullscreen());

// 1.6 Menambahkan Tombol Home (Zoom to Extent)
const home = {
    lat: -6.816,
    lng: 107.1425,
    zoom: 9
};
L.easyButton('fa-home', function (btn, map) {
    map.setView([home.lat, home.lng], home.zoom);
}, 'Zoom To Home').addTo(map);

// 1.7 Menambahkan Fitur My Location
map.addControl(
    L.control.locate({
        locateOptions: {
            enableHighAccuracy: true
        }
    })
);

// 2. Menambahkan Data Spasial Pada WebGIS
// 2.2 Data Batas Administrasi (Line)
const Admnkelline = new L.LayerGroup();
$.getJSON("./asset/Bencana/Admnkelline.geojson", function (data) {
    L.geoJSON(data, {
        style: {
            color: "black",
            weight: 2,
            opacity: 1,
            dashArray: '3,3,20,3,20,3,20,3,20,3,20',
            lineJoin: 'round'
        }
    }).addTo(Admnkelline);
});
Admnkelline.addTo(map);

// 2.3 Data Gempabumi 
const gempabumii = new L.LayerGroup();
$.getJSON("./asset/Bencana/gempabumii.geojson", function (data) {
    L.geoJson(data, {
        style: function (feature) {
            console.log('mencari', feature);
            switch (feature.properties.gridcode) {
                case '1': return { fillColor: "green", fillOpacity: 0.8, weight: 0.5, color: "green" };
                case '2': return { fillColor: "yellow", fillOpacity: 0.8, weight: 0.5, color: "yellow" };
                case '3': return { fillColor: "red", fillOpacity: 0.8, weight: 0.5, color: "red" };
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<b>Gempabumi: </b>' + feature.properties.gridcode);
        }
    }).addTo(gempabumii);
});
gempabumii.addTo(map);

// 3. Membuat Layer Control
const baseMaps = {
    "OpenStreetMap": basemapOSM,
    "OSM HOT": osmHOT,
    "Google": baseMapGoogle
};

const overlayMaps = {
    "Batas Administrasi": Admnkelline,
    "Gempabumi": gempabumii
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

// 3.4 Menambahkan Legenda Pada Peta
let legend = L.control({ position: "topright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML =
        '<p style="font-size: 18px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Legenda</p>' +
        '<p style="font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Batas Administrasi</p>' +
        '<div><svg><line x1="0" y1="11" x2="23" y2="11" style="stroke-width:2;stroke:rgb(0,0,0);stroke-dasharray:10 1 1 1 1 1 1 1 1 1"/></svg></div>Batas Desa/Kelurahan<br>' +
        '<p style="font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Kelas Resiko</p>' +
        '<div style="background-color: green"></div>Rendah<br>' +
        '<div style="background-color: yellow"></div>Sedang<br>' +
        '<div style="background-color: red"></div>Tinggi<br>';
    return div;
};
legend.addTo(map);