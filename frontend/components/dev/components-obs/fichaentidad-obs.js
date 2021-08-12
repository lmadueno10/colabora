import { LitElement, html, css } from "lit-element";
import "@material/mwc-tab-bar";
import "@material/mwc-tab";
import "@material/mwc-icon-button";
import "./tblcomisarias-obs";
import "./tblhospitales-obs";
import "./tblcolegios-obs";
import "./tblubigeos-obs";
import { tableStyles } from './table-styles';

const TAB_COMISARIAS = 0;
const TAB_HOSPITALES = 1;
const TAB_COLEGIOS = 2;

const TAB_DEPARTAMENTO = 0;
const TAB_PROVINCIA = 1;
const TAB_DISTRITO = 2;

export class FichaEntidadObs extends LitElement {
    static get properties() {
        return {
            codUbigeo: { type: String },
            departamentos: { type: Array },
            provincias: { type: Array },
            distritos: { type: Array },
            activeTab: { type: Array }
        };
    }

    static get styles() {
        return [
            tableStyles,
            css`
            *{
                font: 12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif
            }
            mwc-tab-bar {
                --mdc-theme-primary: #1976d2;
            }
            .container{
                padding: 10px 10px 10px 0px;
            }`
        ]
    }

    async firstUpdated() {
        if(this.codUbigeo.length == 2 || this.codUbigeo.length == 4) this.activeTab = TAB_PROVINCIA;
        if(this.codUbigeo.length >= 4) this.activeTab = TAB_DISTRITO;

        await this.setUbigeos(this.codUbigeo, this.activeTab);
    }

    setDepartamentos(departamentos = []) {
        this.departamentos = departamentos.map(x => ({
            ...x,
            isOpen: false,
            activeTab: 0,
            comisarias: [],
            hospitales: [],
            colegios: []
        }));
    }

    setProvincias(provincias = []) {
        this.provincias = provincias.map(x => ({
            ...x,
            isOpen: false,
            activeTab: 0,
            comisarias: [],
            hospitales: [],
            colegios: []
        }));
    }

    setDistritos(distritos = []) {
        this.distritos = distritos.map(x => ({
            ...x,
            isOpen: false,
            activeTab: 0,
            comisarias: [],
            hospitales: [],
            colegios: []
        }));
    }

    async getDepartamentos() {
        const req = await axios.get("http://observatorio.colaboraccion.pe/php/dynamic_sql.php", {
            params: {
                sql: `
            select
                x.*,
                x.cant_comisarias + x.cant_hospitales + x.cant_iiee as cant_entidades
            from(
                select
                    d.first_iddp as codigo_ubigeo,
                    d.nombdep,
                    (select count(*) from gen_comisarias where substr(ubigeo,1, 2) = d.first_iddp) as cant_comisarias,
                    (select count(*) from gen_hospitales where substr(ubigeo,1, 2) = d.first_iddp) as cant_hospitales,
                    (select count(*) from observatorio.ie_ficha where id_departamento = d.gid) as cant_iiee
                from departamento d
                group by
                    d.first_iddp,
                    d.nombdep,
                    d.gid
            ) x
            where
                x.cant_comisarias + x.cant_hospitales + x.cant_iiee > 0
            order by
                x.nombdep
            ` }
        });

        return req.data;
    }

    async getProvincias(codUbigeo = "") {
        const req = await axios.get("http://observatorio.colaboraccion.pe/php/dynamic_sql.php", {
            params: {
                sql: `
            select
                x.*,
                x.cant_comisarias + x.cant_hospitales + x.cant_iiee as cant_entidades
            from(
                select
                    p.first_idpr as codigo_ubigeo,
                    p.nombprov,
                    d.nombdep,
                    (select count(*) from gen_comisarias where substr(ubigeo,1, 4) = p.first_idpr) as cant_comisarias,
                    (select count(*) from gen_hospitales where substr(ubigeo,1, 4) = p.first_idpr) as cant_hospitales,
                    (select count(*) from observatorio.ie_ficha where id_provincia = p.gid) as cant_iiee
                from provincia p
                inner join departamento d on d.first_iddp = substr(p.first_idpr, 1, 2)
                where
                    substr(p.first_idpr,1, 2) = substr('${codUbigeo}',1, 2)
                group by
                    p.first_idpr,
                    p.nombprov,
                    d.nombdep,
                    p.gid
            ) x
            where
                x.cant_comisarias + x.cant_hospitales + x.cant_iiee > 0
            order by
                x.nombprov
            ` }
        });

        return req.data;
    }
    
    async getDistritos(codUbigeo = "") {
        const req = await axios.get("http://observatorio.colaboraccion.pe/php/dynamic_sql.php", {
            params: {
                sql: `
                select
                x.*,
                x.cant_comisarias + x.cant_hospitales + x.cant_iiee as cant_entidades
            from(
                select
                    dd.iddist as codigo_ubigeo,
                    dd.departamen as nombdep,
                    dd.provincia as nombprov,
                    dd.distrito as nombdist,
                    (select count(*) from gen_comisarias where substr(ubigeo,1, 6) = substr(dd.iddist,1, 6)) as cant_comisarias,
                    (select count(*) from gen_hospitales where substr(ubigeo,1, 6) = substr(dd.iddist,1, 6)) as cant_hospitales,
                    (select count(*) from observatorio.ie_ficha where id_distrito = dd.gid) as cant_iiee
                from distrito_f dd
                where
                    substr(dd.iddist,1, 4) = substr('${codUbigeo}',1, 4)
                group by
                    dd.iddist,
                    dd.departamen,
                    dd.provincia,
                    dd.distrito,
                    dd.gid
            ) x
            where
                x.cant_comisarias + x.cant_hospitales + x.cant_iiee > 0
            order by
                x.nombdist
            ` }
        });

        return req.data;
    }

    async getComisarias(ubigeo) {
        const req = await axios.get("http://observatorio.colaboraccion.pe/php/dynamic_sql.php", {
            params: {
                sql: `select cod_inei, cod_pnp, divpol, comisaria, latitud, longitud from gen_comisarias where substr(ubigeo,1, ${ubigeo.length}) = '${ubigeo}'`
            }
        });
        return req.data;
    }

    async getHospitales(ubigeo) {
        const req = await axios.get("http://observatorio.colaboraccion.pe/php/dynamic_sql.php", {
            params: {
                sql: `select institucion, nombre, clasificacion, tipo, direccion, disa, red, microred, codue, unidad_ejecutora, categoria, telefono, horario, director, estado from gen_hospitales where substr(ubigeo,1, ${ubigeo.length}) = '${ubigeo}' order by categoria`
            }
        });
        return req.data;
    }

    async getColegios(codUbigeo = "") {
        const req = await axios.get("http://observatorio.colaboraccion.pe/php/dynamic_sql.php", {
            params: {
                sql: `select centro_educativo, cod_mod, codlocal, nivel_modalidad, forma, genero, tipo_gestion, depedencia as dependencia, director, telefono, nombre_ugel from observatorio.ie_ficha where substr(ubigeo,1, ${codUbigeo.length}) = '${codUbigeo}'`
            }
        });
        return req.data;
    }

    async setActiveTab(codUbigeo = "", activeTab = TAB_COMISARIAS) {
        const ubigeos = this.getCurrUbigeo();
        const ubigeo = ubigeos.find(x => x.codigo_ubigeo == codUbigeo);
        
        ubigeo.activeTab = activeTab;
        ubigeo.isOpen = true;

        if(this.activeTab == TAB_DEPARTAMENTO) this.departamentos = ubigeos;
        if(this.activeTab == TAB_PROVINCIA) this.provincias = ubigeos;
        if(this.activeTab == TAB_DISTRITO) this.distritos = ubigeos;
    }

    getCurrUbigeo() {
        if(this.activeTab == TAB_DEPARTAMENTO) return [...this.departamentos];
        if(this.activeTab == TAB_PROVINCIA) return [...this.provincias];
        if(this.activeTab == TAB_DISTRITO) return [...this.distritos];
    }

    async handleChangeTab(e) {
        const codUbigeo = e.detail.codUbigeo;
        const activeTab = e.detail.tabId;
        this.setActiveTab(codUbigeo, activeTab);
        
        const ubigeos = this.getCurrUbigeo();
        const ubigeo = ubigeos.find(x => x.codigo_ubigeo == codUbigeo);

        if (activeTab == TAB_COMISARIAS && ubigeo.comisarias.length == 0) ubigeo.comisarias = await this.getComisarias(codUbigeo);
        if (activeTab == TAB_HOSPITALES && ubigeo.hospitales.length == 0) ubigeo.hospitales = await this.getHospitales(codUbigeo);
        if (activeTab == TAB_COLEGIOS && ubigeo.colegios.length == 0) ubigeo.colegios = await this.getColegios(codUbigeo);

        if(this.activeTab == TAB_DEPARTAMENTO) this.departamentos = ubigeos;
        if(this.activeTab == TAB_PROVINCIA) this.provincias = ubigeos;
        if(this.activeTab == TAB_DISTRITO) this.distritos = ubigeos;
    }

    handleClickUbigeo(e) {
        const codUbigeo = e.detail;
    }

    async handleChangeTabUbi(e) {
        const index = e.detail.index;
        this.activeTab = index;
        await this.setUbigeos(this.codUbigeo, index);
    }

    async setUbigeos(codUbigeo = "", tabId = -1) {
        if(tabId == TAB_DEPARTAMENTO && this.departamentos.length == 0) {
            const departamentos = await this.getDepartamentos();
            this.setDepartamentos(departamentos);
        }

        if(tabId == TAB_PROVINCIA && this.provincias.length == 0) {
            const provincias = await this.getProvincias(codUbigeo);
            this.setProvincias(provincias);
        }

        if(tabId == TAB_DISTRITO && this.distritos.length == 0) {
            const distritos = await this.getDistritos(codUbigeo);
            this.setDistritos(distritos);
        }
    }

    constructor() {
        super();
        this.codUbigeo = "";
        this.departamentos = [];
        this.provincias = [];
        this.distritos = [];
        this.activeTab = -1;
    }

    render() {
        return html`
        <mwc-tab-bar activeIndex="${this.activeTab}" @MDCTabBar:activated="${this.handleChangeTabUbi}">
            <mwc-tab label="Departamentos"></mwc-tab>
            <mwc-tab label="Provincias"></mwc-tab>
            ${this.codUbigeo.length >= 4 ? html`<mwc-tab label="Distritos"></mwc-tab>` : ''}
        </mwc-tab-bar>
        
        <div class="container">
            ${this.activeTab == TAB_DEPARTAMENTO ? 
            html`
            <tblubigeos-obs 
            codUbigeo="${this.codUbigeo.substr(0,2)}"
            .ubigeos="${this.departamentos}" 
            @event-onchange="${this.handleChangeTab}"
            @event-onclick="${this.handleClickUbigeo}">
            </tblubigeos-obs>` : ''}

            ${this.activeTab == TAB_PROVINCIA ? 
            html`
            <tblubigeos-obs 
            codUbigeo="${this.codUbigeo.substr(0,4)}"
            .ubigeos="${this.provincias}"
            esProvincia
            @event-onchange="${this.handleChangeTab}">
            </tblubigeos-obs>` : ''}

            ${this.activeTab == TAB_DISTRITO ? 
            html`
            <tblubigeos-obs 
            codUbigeo="${this.codUbigeo}"
            .ubigeos="${this.distritos}"
            esDistrito
            @event-onchange="${this.handleChangeTab}">
            </tblubigeos-obs>` : ''}
        </div>`;
    }
}

customElements.define('fichaentidad-obs', FichaEntidadObs);