import { LitElement, html } from "lit-element";
import { tableStyles } from './table-styles';
import Utils from "../utils-obs";

export class tblColegiosObs extends LitElement {
	static get properties() {
		return {
			colegios: { type: Array }
		};
	}

	static get styles() {
		return [
			tableStyles
		]
	}

	constructor() {
		super();
		this.colegios = [];
	}

	render() {
		return html`
		<table border="0" width="100%">
			<thead>
				<tr>
					<th>#</th>
					<th>Centro Educativo</th>
					<th>Código Modular</th>
					<th>Código Local</th>
					<th>Nivel/Modalidad</th>
					<th>Forma</th>
					<th>Género</th>
					<th>Tipo de gestión</th>
					<th>Dependencia</th>
					<th>Director</th>
					<th>Teléfono</th>
					<th>Nombre UGEL</th>
				</tr>
			</thead>
			<tbody>
				${this.colegios.map(({
					centro_educativo, cod_mod, codlocal, nivel_modalidad, forma, genero, tipo_gestion, dependencia, director,
					telefono, nombre_ugel
				}, index) => html`
					<tr>
						<td align="center">${index + 1}</td>
						<td>${Utils.capStr(centro_educativo)}</td>
						<td>${cod_mod}</td>
						<td>${codlocal}</td>
						<td>${nivel_modalidad}</td>
						<td>${forma}</td>
						<td>${genero}</td>
						<td>${tipo_gestion}</td>
						<td>${dependencia}</td>
						<td>${Utils.capStr(director)}</td>
						<td>${telefono}</td>
						<td>${Utils.capStr(nombre_ugel)}</td>
					</tr>
				`)}
			</tbody>
		</table>`;
	}
}

customElements.define('tblcolegios-obs', tblColegiosObs);