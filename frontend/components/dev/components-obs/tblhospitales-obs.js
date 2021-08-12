import { LitElement, html } from "lit-element";
import { tableStyles } from './table-styles';
import Utils from "../utils-obs";

export class tblHospitalesObs extends LitElement {
	static get properties() {
		return {
			hospitales: { type: Array }
		};
	}

	static get styles() {
		return [
			tableStyles
		]
	}

	constructor() {
		super();
		this.hospitales = [];
	}

	render() {
		return html`
		<table border="0" width="100%">
			<thead>
				<tr>
					<th>#</th>
					<th>Nombre</th>
					<th>Clasificación</th>
					<th>Tipo</th>
					<th>Dirección</th>
					<th>Red</th>
					<th>Microred</th>
					<th>Unidad ejecutora</th>
					<th>Categoría</th>
					<th>Director</th>
				</tr>
			</thead>
			<tbody>
				${this.hospitales.map(({
			nombre, clasificacion, tipo, direccion, red, microred, unidad_ejecutora, categoria, director
			}, index) => html`
				<tr>
					<td align="center">${index + 1}</td>
					<td>${Utils.capStr(nombre)}</td>
					<td>${Utils.capStr(clasificacion)}</td>
					<td>${Utils.capStr(tipo)}</td>
					<td>${Utils.capStr(direccion)}</td>
					<td>${Utils.capStr(red)}</td>
					<td>${Utils.capStr(microred)}</td>
					<td>${Utils.capStr(unidad_ejecutora)}</td>
					<td>${categoria}</td>
					<td>${Utils.capStr(director)}</td>
				</tr>
				`)}
			</tbody>
		</table>`;
	}
}

customElements.define('tblhospitales-obs', tblHospitalesObs);