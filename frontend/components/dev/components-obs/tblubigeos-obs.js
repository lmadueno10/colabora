import { LitElement, html, css } from "lit-element";
import { tableStyles } from './table-styles';
import Utils from "../utils-obs";

import "@material/mwc-tab-bar";
import "@material/mwc-tab";
import "@material/mwc-icon-button";
import "@material/mwc-circular-progress";
import "./tblcomisarias-obs";
import "./tblhospitales-obs";
import "./tblcolegios-obs";

const TAB_COMISARIAS = 0;
const TAB_HOSPITALES = 1;
const TAB_COLEGIOS = 2;

export class tblUbigeos extends LitElement {
	static get properties() {
		return {
            codUbigeo: { type: String },
			ubigeos: { type: Array },
            esProvincia: { type: Boolean },
            esDistrito: { type: Boolean }
		};
	}

	static get styles() {
		return [
			tableStyles,
            css`
            * {
                --mdc-theme-primary: #1976d2;
            }
            .close-btn{
                float: right;
                color: red;
            }
            .scroll{
                margin: 10px auto; 
                height:224px; 
                overflow:auto;
            }
            .loading{
                text-align: center;
                margin: 20px 20px;
            }
            .container{
                padding: 10px;
                border-radius: 10px;
                background: rgb(255, 255, 255);
                box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
                margin: 10px auto;
            }            
            .selected{
                background: #1976d2;
                color: #fff;
            }            
            .selected a{
                color: #fff;
            }
            ::-webkit-scrollbar {
                width: 8px;
            }
            ::-webkit-scrollbar-track {
                background: #f1f1f1; 
            }          
            ::-webkit-scrollbar-thumb {
                background: #888; 
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #555; 
            }`
		]
	}

    async setActiveTab(codUbigeo = "", activeTab = TAB_COMISARIAS) {
        const ubigeos = [...this.ubigeos];
        const ubigeo = ubigeos.find(x => x.codigo_ubigeo == codUbigeo);
        ubigeo.activeTab = activeTab;
        ubigeo.isOpen = true;
        this.ubigeos = ubigeos;
    }

    templateLoading() {
        return html`
        <div class="loading">
            <mwc-circular-progress indeterminate></mwc-circular-progress>
        </div>`; 
    }

    templateComisarias(nComisarias = 0, comisarias = []) {
        if(nComisarias > 0 && comisarias.length == 0)  return this.templateLoading();
        return html`
            <div class="scroll">
                <tblcomisarias-obs .comisarias="${comisarias}"></tblcomisarias-obs>
            </div>
        `;
    }

    templateHospitales(nHospitales = 0, hospitales = []) {
        if(nHospitales > 0 && hospitales.length == 0)  return this.templateLoading();
        return html`
            <div class="scroll">
                <tblhospitales-obs .hospitales="${hospitales}"></tblhospitales-obs>
            </div>
        `;
    }
    
    templateColegios(nColegios = 0, colegios = []) {
        if(nColegios > 0 && colegios.length == 0)  return this.templateLoading();
        return html`
            <div class="scroll">
                <tblcolegios-obs .colegios="${colegios}"></tblcolegios-obs>
            </div>
        `;
    }

    handleClickOcultar(codUbigeo = "") {
        const ubigeos = [...this.ubigeos];
        ubigeos.find(x => x.codigo_ubigeo == codUbigeo).isOpen = false;
        this.ubigeos = ubigeos;
    }

    handleClickUbigeo(codUbigeo = "") {
        this.dispatchEvent(new CustomEvent('event-onclick', { 
            detail: codUbigeo
        }));
    }

    handleChangeTab(e, codUbigeo = "") {
        this.dispatchEvent(new CustomEvent('event-onchange', { detail: {
            tabId: e.detail.index,
            codUbigeo
        } }));
    }
    
	constructor() {
		super();
        this.codUbigeo = "";
		this.ubigeos = [];
        this.esProvincia = false;
        this.esDistrito = false;
	}

	render() {
		return html`
		<table border="0" width="100%">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Departamento</th>
                    ${this.esProvincia || this.esDistrito ? html`<th>Provincia</th>` : "" }
                    ${this.esDistrito ? html`<th>Distrito</th>` : "" }
                    <th>Cantidad comisarías</th>
                    <th>Cantidad EE.SS</th>
                    <th>Cantidad II.EE</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${this.ubigeos.map((ubigeo, index) => 
                    html`            
                        <tr class="${ubigeo.codigo_ubigeo == this.codUbigeo ? "selected" : ""}">
                            <td align="center">${index + 1}</td>
                            <td>
                                <!--<a href="javascript:void(0)" @click="${() => this.handleClickUbigeo(codigo_ubigeo)}">-->
                                    ${Utils.capStr(ubigeo.nombdep)}
                                <!--</a>-->
                            </td>
                            ${this.esProvincia || this.esDistrito ? html`<td>${Utils.capStr(ubigeo.nombprov)}</td>` : "" }
                            ${this.esDistrito ? html`<td>${Utils.capStr(ubigeo.nombdist)}</td>` : "" }
                            <td align="center">
                                <a href="javascript:void(0)" @click="${() => this.setActiveTab(ubigeo.codigo_ubigeo, TAB_COMISARIAS)}">
                                    ${ubigeo.cant_comisarias}
                                </a>
                            </td>
                            <td align="center">
                                <a href="javascript:void(0)" @click="${() => this.setActiveTab(ubigeo.codigo_ubigeo, TAB_HOSPITALES)}">
                                    ${ubigeo.cant_hospitales}
                                </a>
                            </td>
                            <td align="center">
                                <a href="javascript:void(0)" @click="${() => this.setActiveTab(ubigeo.codigo_ubigeo, TAB_COLEGIOS)}">
                                    ${ubigeo.cant_iiee}
                                </a>
                            </td>
                            <td align="center">${ubigeo.cant_entidades}</td>
                        </tr>
                        ${ubigeo.isOpen ? html`
                        <tr>
                            <td colspan="10">
                                <div class="container">                                        
                                    <mwc-icon-button icon="close" class="close-btn" title="Cerrar" @click="${() => this.handleClickOcultar(ubigeo.codigo_ubigeo)}"></mwc-icon-button>
        
                                    <mwc-tab-bar activeIndex="${ubigeo.activeTab}" @MDCTabBar:activated="${(e) => this.handleChangeTab(e, ubigeo.codigo_ubigeo)}">
                                        <mwc-tab label="Comisarías(${ubigeo.cant_comisarias})"></mwc-tab>
                                        <mwc-tab label="EE.SS(${ubigeo.cant_hospitales})"></mwc-tab>
                                        <mwc-tab label="II.EE(${ubigeo.cant_iiee})"></mwc-tab>
                                    </mwc-tab-bar>
                                    ${ubigeo.activeTab == TAB_COMISARIAS ? this.templateComisarias(ubigeo.cant_comisarias, ubigeo.comisarias) : ''}
                                    ${ubigeo.activeTab == TAB_HOSPITALES ? this.templateHospitales(ubigeo.cant_hospitales, ubigeo.hospitales) : ''}
                                    ${ubigeo.activeTab == TAB_COLEGIOS ? this.templateColegios(ubigeo.cant_iiee, ubigeo.colegios) : ''}                                    
                                </div>
                            </td>
                        </tr>`
                        : '' } 
                    `
                )}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td><b>TOTAL</b></td>
                        ${this.esProvincia || this.esDistrito ? html`<td></td>` : "" }
                        ${this.esDistrito ? html`<td></td>` : "" }
                        <td align="center">${this.ubigeos.reduce((acc, { cant_comisarias }) => acc + Number(cant_comisarias), 0)}</td>
                        <td align="center">${this.ubigeos.reduce((acc, { cant_hospitales }) => acc + Number(cant_hospitales), 0)}</td>
                        <td align="center">${this.ubigeos.reduce((acc, { cant_iiee }) => acc + Number(cant_iiee), 0)}</td>
                        <td align="center">${this.ubigeos.reduce((acc, { cant_comisarias ,cant_hospitales, cant_iiee }) => acc + Number(cant_comisarias) + Number(cant_hospitales) + Number(cant_iiee), 0)}</td>
                    </tr>
                </tfoot>
        </table>`;
	}
}

customElements.define('tblubigeos-obs', tblUbigeos);