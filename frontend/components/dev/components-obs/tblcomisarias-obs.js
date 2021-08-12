import { LitElement, html } from "lit-element";
import { tableStyles } from './table-styles';
import Utils from "../utils-obs";

export class tblComisariasObs extends LitElement {
    static get properties() {
        return {
            comisarias: { type: Array }
        };
    }

    static get styles() {
        return [
            tableStyles
        ]
    }

    constructor() {
        super();
        this.comisarias = [];
    }

    render() {
        return html`
        <table border="0" width="100%">
			<thead>
				<tr>
					<th>#</th>
					<th>Código INEI</th>
					<th>Código PNP</th>
					<th>División policíal</th>
					<th>Comisaría</th>
					<th>Latitud</th>
					<th>Longitud</th>
				</tr>
			</thead>
			<tbody>
			${this.comisarias.map(({
				cod_inei, cod_pnp, divpol, comisaria, latitud, longitud
			}, index) => html`
				<tr>
					<td align="center">${index + 1}</td>
					<td>${cod_inei}</td>
					<td>${cod_pnp}</td>
					<td>${Utils.capStr(divpol)}</td>
					<td>${Utils.capStr(comisaria)}</td>
					<td>${latitud}</td>
					<td>${longitud}</td>
				</tr>
			`)}
			</tbody>
		</table>`;
    }
}

customElements.define('tblcomisarias-obs', tblComisariasObs);