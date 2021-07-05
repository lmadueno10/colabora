import { LitElement, html, css } from "lit-element";
import "./estcolegio-obs";

export class FichaColegioObs extends LitElement {
    static get properties() {
        return {
            centroEducativo: { type: String },
            codMod: { type: String },
            anexo: { type: String },
            codigoLocal: { type: String },
            nivel: { type: String },
            forma: { type: String },
            genero: { type: String },
            tipoGestion: { type: String },
            dependencia: { type: String },
            director: { type: String },
            telefono: { type: String },
            correo: { type: String },
            paginaWeb: { type: String },
            turno: { type: String },
            tipoPrograma: { type: String },
            estado: { type: String },
            direccion: { type: String },
            localidad: { type: String },
            centroPoblado: { type: String },
            areaGeografica: { type: String },
            distrito: { type: String },
            provincia: { type: String },
            departamento: { type: String },
            codigoUgel: { type: String },
            nombreUgel: { type: String },
            caracteristica: { type: String },
            latitud: { type: Number },
            longitud: { type: Number },
        };
    }

    static get styles() {
        return css`
        *{
            font-size: 13px;
        }
        .container{
            background: #fff;
            border: 1px solid rgba(0, 0, 0, .125);
        }
        .header {
            padding-left: .30rem;
            background: #1976d2;
            color: #fff;
        }
        .body {
            padding: 5px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        table tr td:nth-child(odd) {
            font-weight: bold;
            background: #1976d226;
            color: #000;
            padding-left: .30rem;
        }
        table tr td {
            border-top: 1px solid #dee2e6;
        }
        #estcolegio{
            height: 300px; 
            overflow-y: scroll;
            padding: 5px;
        }       
        `;
    }

    async firstUpdated() {
        const params = { params: { type: "MARKER_DETAIL", cql_filter: `cod_mod = '${this.codMod}'` } };
        const request = await axios.get("http://observatorio.colaboraccion.pe/php/getInstEducativa.php", params);
        const res = request.data[0];
        this.centroEducativo = res.centro_educativo;
        this.codMod = res.cod_mod;
        this.anexo = res.anexo;
        this.codigoLocal = res.codlocal;
        this.nivel = res.nivel_modalidad;
        this.forma = res.forma;
        this.genero = res.genero;
        this.tipoGestion = res.tipo_gestion;
        this.dependencia = res.depedencia;
        this.director = res.director;
        this.telefono = res.telefono;
        this.correo = res.email;
        this.paginaWeb = res.pagina_web;
        this.turno = res.turno;
        this.tipoPrograma = res.tipo_programa;
        this.estado = res.estado;
        this.direccion = res.direccion;
        this.localidad = res.localidad;
        this.centroPoblado = res.centro_poblado;
        this.areaGeografica = res.area_geografica;
        this.distrito = res.distrito;
        this.provincia = res.provincia;
        this.departamento = res.departamento;
        this.codigoUgel = res.codigo_ugel;
        this.nombreUgel = res.nombre_ugel;
        this.caracteristica = res.caracteristica;
        this.latitud = Number(res.latitud);
        this.longitud = Number(res.longitud);
    }

    constructor() {
        super();
        this.centroEducativo = "";
        this.codMod = "";
        this.anexo = "";
        this.codigoLocal = "";
        this.nivel = "";
        this.forma = "";
        this.genero = "";
        this.tipoGestion = "";
        this.dependencia = "";
        this.director = "";
        this.telefono = "";
        this.correo = "";
        this.paginaWeb = "";
        this.turno = "";
        this.tipoPrograma = "";
        this.estado = "";
        this.direccion = "";
        this.localidad = "";
        this.centroPoblado = "";
        this.areaGeografica = "";
        this.distrito = "";
        this.provincia = "";
        this.departamento = "";
        this.codigoUgel = "";
        this.nombreUgel = "";
        this.caracteristica = "";
        this.latitud = 0;
        this.longitud = 0;
    }

    render() {
        return html`
        <div class="container">
            <div class="header">I.E. ${this.centroEducativo}</div>
            <div class="body">
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Código modular</td>
                                <td>${this.codMod}</td>
                                <td>Dirección</td>
                                <td>${this.direccion}</td>
                            </tr>
                            <tr>
                                <td>Anexo</td>
                                <td>${this.anexo}</td>
                                <td>Localidad</td>
                                <td>${this.localidad}</td>
                            </tr>
                            <tr>
                                <td>Código de local</td>
                                <td>${this.codigoLocal}</td>
                                <td>Centro Poblado</td>
                                <td>${this.centroPoblado}</td>
                            </tr>
                            <tr>
                                <td>Nivel/Modalidad</td>
                                <td>${this.nivel_modalidad}</td>
                                <td>Área geográfica</td>
                                <td>${this.areaGeografica}</td>
                            </tr>
                            <tr>
                                <td>Forma</td>
                                <td>${this.forma}</td>
                                <td>Distrito</td>
                                <td>${this.distrito}</td>
                            </tr>
                            <tr>
                                <td>Género</td>
                                <td>${this.genero}</td>
                                <td>Provincia</td>
                                <td>${this.provincia}</td>
                            </tr>
                            <tr>
                                <td>Tipo de Gestión</td>
                                <td>${this.tipoGestion}</td>
                                <td>Departamento</td>
                                <td>${this.departamento}</td>
                            </tr>
                            <tr>
                                <td>Gestión / Dependencia</td>
                                <td>${this.dependencia}</td>
                                <td>Código de DRE o UGEL que supervisa el S. E.</td>
                                <td>${this.codigoUgel}</td>
                            </tr>
                            <tr>
                                <td>Director(a)</td>
                                <td>${this.director}</td>
                                <td>Nombre de la DRE o UGEL que supervisa el S.E.</td>
                                <td>${this.nombreUgel}</td>
                            </tr>
                            <tr>
                                <td>Teléfono</td>
                                <td>${this.telefono}</td>
                                <td>Característica (Censo Educativo 2020)</td>
                                <td>${this.caracteristica}</td>
                            </tr>
                            <tr>
                                <td>Correo electrónico</td>
                                <td>${this.email}</td>
                                <td>Latitud</td>
                                <td>${this.latitud}</td>
                            </tr>
                            <tr>
                                <td>Página web</td>
                                <td>${this.email}</td>
                                <td>Longitud</td>
                                <td>${this.longitud}</td>
                            </tr>
                            <tr>
                                <td>Turno</td>
                                <td>${this.turno}</td>
                                <td>Tipo de programa</td>
                                <td>${this.tipoPrograma}</td>
                            </tr>
                            <tr>
                                <td>Estado</td>
                                <td>${this.estado}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <hr>
                <div id="estcolegio">
                    <estcolegio-obs codMod="${this.codMod}"></estcolegio-obs>
                </div>
            </div>
        </div>`;
    }
}

customElements.define('fichacolegio-obs', FichaColegioObs);