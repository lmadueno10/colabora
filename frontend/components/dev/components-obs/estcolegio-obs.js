import { LitElement, html, css } from "lit-element";

export class EstColegioObs extends LitElement {

    static get properties() {
        return {
            codMod: { type: String },
            matrGenero: { type: Array },
            matrGrado: { type: Array },
            docentes: { type: Array },
            secciones: { type: Array },
        };
    }

    static get styles() {
        return css`
        *{
            font-size: 13px;
        }
        .panel {
            margin: 10px auto;
        }
        table{
            border-collapse: collapse;        
            width: 100%;
        }
        table thead th{
            font-weight: bold;
            background: #1976d226;
            color: #000;
        }
        table tbody td:not(:first-child){
            text-align: center;
        }`;
    }

    async firstUpdated() {
        const res = await axios.get(`http://services.colaboraccion.pe:5005/api/colegios/${this.codMod}`);
        this.matrGenero = res.data.matrGenero;
        this.matrGrado = res.data.matrGrado;
        this.docentes = res.data.docentes;
        this.secciones = res.data.secciones;
    }

    setMatrSexo(data = []) {
        this.matrGenero = data;
    }

    setMatrPeriodo(data = []) {
        this.matrPeriodo = Array.from(Array(6), (ele, i) => {
            return {
                grado: `${i + 1}º Grado`,
                ...Object.assign({}, ...data.map(ele => ({ [`matr_${ele.anio}`]: ele[`matr0${i + 1}`] })))            
            }
        }); 
    }

    setDocentes(data = []) {
        this.docentes = [Object.assign({}, ...data.map(ele => ({ [`tdocente_${ele.anio}`]: ele.tdocente })))];
    }

    setMatrSecciones(data = []) {
        this.seccPeriodo = Array.from(Array(6), (ele, i) => {
            return {
                grado: `${i + 1}º Grado`,
                ...Object.assign({}, ...data.map(ele => ({ [`secc_${ele.anio}`]: ele[`secc0${i + 1}`] })))            
            }
        });
    }

    tableThTemplate(){
        const col = [];
        for (let x = 2004; x <= 2020; x++) {
            col.push(html`<th>${x}</th>`);
        }
        return col;
    }

    constructor() {
        super();
        this.codMod = "";
        this.matrGenero = [];
        this.matrGrado = [];
        this.docentes = [];
        this.secciones = [];
    }

    render() {
        return html`
        <div class="panel">
            <b>Matrícula por grado y sexo, 2020</b>
            <table>
                <thead>
                    <tr>
                        <th rowspan="2">Nivel</th>
                        <th colspan="2">1º Grado</th>
                        <th colspan="2">2º Grado</th>
                        <th colspan="2">3º Grado</th>
                        <th colspan="2">4º Grado</th>
                        <th colspan="2">5º Grado</th>
                        <th colspan="2">6º Grado</th>
                    </tr>
                    <tr>
                        <th>H</th>
                        <th>M</th>
                        <th>H</th>
                        <th>M</th>
                        <th>H</th>
                        <th>M</th>
                        <th>H</th>
                        <th>M</th>
                        <th>H</th>
                        <th>M</th>
                        <th>H</th>
                        <th>M</th>
                    </tr>
                </thead>
                <tbody>
                ${this.matrGenero.map(m => 
                    html`            
                        <tr>
                            <td>${m.nivelModalidad.valor}</td>
                            <td>${m.matr1h}</td>
                            <td>${m.matr1m}</td>
                            <td>${m.matr2h}</td>
                            <td>${m.matr2m}</td>
                            <td>${m.matr3h}</td>
                            <td>${m.matr3m}</td>
                            <td>${m.matr4h}</td>
                            <td>${m.matr4m}</td>
                            <td>${m.matr5h}</td>
                            <td>${m.matr5m}</td>
                            <td>${m.matr6h}</td>
                            <td>${m.matr6m}</td>
                        </tr>`
                    )}
                </tbody>
            </table>
        </div>

        <div class="panel">
            <b>Matrícula por periodo según grado, 2004-2020</b>        
            <table>
                <thead>
                    <tr>
                        <th></th>
                        ${this.tableThTemplate()}
                    </tr>
                </thead>
                <tbody>
                ${this.matrGrado.map(m => 
                    html`            
                        <tr>
                            <td>${m.grado}</td>
                            <td>${m.matr_2004}</td>
                            <td>${m.matr_2005}</td>
                            <td>${m.matr_2006}</td>
                            <td>${m.matr_2007}</td>
                            <td>${m.matr_2008}</td>
                            <td>${m.matr_2009}</td>
                            <td>${m.matr_2010}</td>
                            <td>${m.matr_2011}</td>
                            <td>${m.matr_2012}</td>
                            <td>${m.matr_2013}</td>
                            <td>${m.matr_2014}</td>
                            <td>${m.matr_2015}</td>
                            <td>${m.matr_2016}</td>
                            <td>${m.matr_2017}</td>
                            <td>${m.matr_2018}</td>
                            <td>${m.matr_2019}</td>
                            <td>${m.matr_2020}</td>
                        </tr>`
                    )}
                </tbody>
            </table>
        </div>     
        
        <div class="panel">
            <b>Docentes, 2004-2020</b>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        ${this.tableThTemplate()}
                    </tr>
                </thead>
                <tbody>
                ${this.docentes.map(m => 
                    html`
                        <tr>
                            <td>Total</td>
                            <td>${m.tdocente_2004}</td>
                            <td>${m.tdocente_2005}</td>
                            <td>${m.tdocente_2006}</td>
                            <td>${m.tdocente_2007}</td>
                            <td>${m.tdocente_2008}</td>
                            <td>${m.tdocente_2009}</td>
                            <td>${m.tdocente_2010}</td>
                            <td>${m.tdocente_2011}</td>
                            <td>${m.tdocente_2012}</td>
                            <td>${m.tdocente_2013}</td>
                            <td>${m.tdocente_2014}</td>
                            <td>${m.tdocente_2015}</td>
                            <td>${m.tdocente_2016}</td>
                            <td>${m.tdocente_2017}</td>
                            <td>${m.tdocente_2018}</td>
                            <td>${m.tdocente_2019}</td>
                            <td>${m.tdocente_2020}</td>
                        </tr>
                    `
                    )}
                </tbody>
            </table>
        </div>
        
        <div class="panel">
            <b>Secciones por periodo según grado, 2004-2020</b>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        ${this.tableThTemplate()}
                    </tr>
                </thead>
                <tbody>
                ${this.secciones.map(m => 
                    html`            
                        <tr>
                            <td>${m.grado}</td>
                            <td>${m.secc_2004}</td>
                            <td>${m.secc_2005}</td>
                            <td>${m.secc_2006}</td>
                            <td>${m.secc_2007}</td>
                            <td>${m.secc_2008}</td>
                            <td>${m.secc_2009}</td>
                            <td>${m.secc_2010}</td>
                            <td>${m.secc_2011}</td>
                            <td>${m.secc_2012}</td>
                            <td>${m.secc_2013}</td>
                            <td>${m.secc_2014}</td>
                            <td>${m.secc_2015}</td>
                            <td>${m.secc_2016}</td>
                            <td>${m.secc_2017}</td>
                            <td>${m.secc_2018}</td>
                            <td>${m.secc_2019}</td>
                            <td>${m.secc_2020}</td>
                        </tr>`
                    )}
                </tbody>
            </table>
        </div>`;
    }
}

customElements.define('estcolegio-obs', EstColegioObs);