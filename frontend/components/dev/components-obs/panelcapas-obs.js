import { LitElement, html, css } from "lit-element";

export class PanelCapasObs extends LitElement {

    static get properties() {
        return {
            map: { type: Object },
            panel: { type: Object },
            sitiosBitel: { type: Object },
            nodosBitel: { type: Object },
            nodosTelefonica: { type: Object },
            nodosInternexa: { type: Object },
            fibraOptica: { type: Object },
            fOpticaMicro: { type: Object },
            conexion: { type: Object },
            core: { type: Object },
            distribucion: { type: Object },
        }
    }

    getLatLng(data = []) {
        data.forEach(ele => (ele.latitud = Number(ele.latitud), ele.longitud = Number(ele.longitud)));
        return data;
    }

    getFeatures(data = []) {
        var jsonFeatures = [];

        data.forEach(function (point) {
            var lat = point.latitud;
            var lon = point.longitud;

            var feature = {
                type: 'Feature',
                properties: point,
                geometry: {
                    type: 'Point',
                    coordinates: [lon, lat]
                }
            };

            jsonFeatures.push(feature);
        });

        return jsonFeatures;
    }

    getGeoJson(jsonFeatures = [], color = "", text = "") {
        return L.geoJson(jsonFeatures, {
            pointToLayer: function (feature, latlng) {
                var marker = L.marker(latlng, {
                    icon: L.ExtraMarkers.icon({
                        icon: "fa-number",
                        markerColor: color,
                        shape: "circle",
                        prefix: "fas",
                        number: text
                    })
                });
                marker.bindPopup("Cargando...", { closeButton: true, minWidth: 300 });
                return marker;
            }
        });
    }

    async getColumnsName() {
        const params = { params: { sql: "SELECT string_agg(column_name, ', ') as col_name FROM information_schema.columns where table_name = 'bitel_bitel_point' and column_name != 'geom'" } };
        const req = await axios.get("http://observatorio.colaboraccion.pe/php/dynamic_sql.php", params);
        return req.data[0].col_name;
    }

    async setMarkers(title = "", tableName = "", color = "", text = "", layerGroup) {
        const colNames = await this.getColumnsName();
        const params = { params: { sql: `SELECT ${colNames}, ST_X(geom) as longitud, ST_Y(geom) as latitud FROM telecom.${tableName}` } };
        const req = await axios.get("http://observatorio.colaboraccion.pe/php/dynamic_sql.php", params);
        const res = this.getLatLng(req.data);
        const jsonFeatures = this.getFeatures(res);
        const markers = this.getGeoJson(jsonFeatures, color, text).addTo(layerGroup);

        markers.on('click', function (e) {
            var props = e.layer.feature.properties;


            const content = [];

            for (const [key, value] of Object.entries(props)) {
                content.push(`<tr><td><b>${key}</b></td><td>${value}</td></tr>`);
            }

            e.layer._popup.setContent(`<div style="text-align: center;"><b>${title}</b></div><table>${content.join("")}</table>`);
        });
    }

    updated(changedProperties) {
        const _this = this;

        if (changedProperties.get("panel") != null && changedProperties.get("panel") !== this.panel) {
            this.panel.on('panel:selected', function (feature) {
                console.log(feature.name)
                switch (feature.key) {
                    case 'sbitel':
                        _this.setMarkers(feature.name, "bitel_bitel_point", "yellow", "B", _this.sitiosBitel);
                        _this.sitiosBitel.addTo(_this.map);
                        break;
                    case 'nbitel':
                        _this.setMarkers(feature.name, "nodos_bitel_point", "yellow", "B", _this.nodosBitel);
                        _this.nodosBitel.addTo(_this.map);
                        break;
                    case 'ntelefonica':
                        _this.setMarkers(feature.name, "telefonica_point", "blue-dark", "T", _this.nodosTelefonica);
                        _this.nodosTelefonica.addTo(_this.map);
                        break;
                    case 'ninternexa':
                        _this.setMarkers(feature.name, "telefonica_point", "blue", "I", _this.nodosInternexa);
                        _this.nodosInternexa.addTo(_this.map);
                        break;
                    case 'foptical':
                        _this.setMarkers(feature.name, "fibra_optica_point", "orange", "F", _this.fibraOptica);
                        _this.fibraOptica.addTo(_this.map);
                        break;
                    case 'foptmicro':
                        _this.setMarkers(feature.name, "fibra_optica_y_microondas_point", "orange", "M", _this.fOpticaMicro);
                        _this.fOpticaMicro.addTo(_this.map);
                        break;
                    case 'conexion':
                        _this.setMarkers(feature.name, "conexion_point", "green", "C", _this.conexion);
                        _this.conexion.addTo(_this.map);
                        break;
                    case 'core':
                        _this.setMarkers(feature.name, "core_point", "green-light", "CO", _this.core);
                        _this.core.addTo(_this.map);
                        break;
                    case 'distribucion':
                        _this.setMarkers(feature.name, "distribucion_point", "green-dark", "D", _this.distribucion);
                        _this.distribucion.addTo(_this.map);
                        break;
                }


            });

            this.panel.on('panel:unselected', function (feature) {
                switch (feature.key) {
                    case 'sbitel':
                        _this.map.removeLayer(_this.sitiosBitel);
                        break;
                    case 'nbitel':
                        _this.map.removeLayer(_this.nodosBitel);
                        break;
                    case 'ntelefonica':
                        _this.map.removeLayer(_this.nodosTelefonica);
                        break;
                    case 'ninternexa':
                        _this.map.removeLayer(_this.nodosInternexa);
                        break;
                    case 'foptical':
                        _this.map.removeLayer(_this.fibraOptica);
                        break;
                    case 'foptmicro':
                        _this.map.removeLayer(_this.fOpticaMicro);
                        break;
                    case 'conexion':
                        _this.map.removeLayer(_this.conexion);
                        break;
                    case 'core':
                        _this.map.removeLayer(_this.core);
                        break;
                    case 'distribucion':
                        _this.map.removeLayer(_this.distribucion);
                        break;
                }
            });
        }
    }

    constructor() {
        super();
        this.map = {};
        this.panel = {};
        this.sitiosBitel = new L.layerGroup();
        this.nodosBitel = new L.layerGroup();
        this.nodosTelefonica = new L.layerGroup();
        this.nodosInternexa = new L.layerGroup();
        this.fibraOptica = new L.layerGroup();
        this.fOpticaMicro = new L.layerGroup();
        this.conexion = new L.layerGroup();
        this.core = new L.layerGroup();
        this.distribucion = new L.layerGroup();
    }
}

customElements.define('panelcapas-obs', PanelCapasObs);