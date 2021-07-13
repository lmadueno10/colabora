import { LitElement, html, css } from "lit-element";
import "@material/mwc-button";
import "@material/mwc-dialog";
import "@material/mwc-circular-progress";

export class ImpDataObs extends LitElement {

    static get properties() {
        return {
            isProcessing: { type: Boolean }
        };
    }

    static get styles() {
        return css `        
        mwc-dialog {
            --mdc-dialog-min-width: 400px;            
        }
        mwc-dialog > div{
            display: flex;
            justify-content: space-around;
            overflow: hidden;
        }
        `
    }

    handleClickImport() {
        this.shadowRoot.querySelector("mwc-dialog").show();
    }

    async handleClickProcesar() {
        //Filtrar que solo sean XLSX
        //Recuperar y pasar el file al backend
        //Loading
        this.toogleIsProcessing();
        const files = this.shadowRoot.querySelector("[type=file]").files;
        const formData = new FormData();
        //console.log(files);
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            formData.append("files", file);
            //console.log(file);
        }
        const res = await fetch("http://localhost:3800/upload", {
            method: "POST",
            body: formData,
        });

        console.log(res);

        if (res.status === 200) {
            this.toogleIsProcessing();
            alert("Se procesó el archivo correctamente!");
            setTimeout(() => {
                this.shadowRoot.querySelector("mwc-dialog").close();
            }, 800);
        } else {
            this.toogleIsProcessing();
            alert("Ocurrió un error procesando la petición");
        }

    }

    toogleIsProcessing() {
        this.isProcessing = !this.isProcessing;
    }

    constructor() {
        super();
        this.isProcessing = false;
    }

    render() {
            return html `
            <mwc-button class="mdc-button mdc-button--unelevated" label="Importar" @click="${this.handleClickImport}"></mwc-button>
            
            <mwc-dialog heading="Importar Data Externa">
                <div>
                    ${this.isProcessing ? 
                    html`<mwc-circular-progress indeterminate></mwc-circular-progress>` : 
                    html`<input type="file" id='files' name='files' accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'>`
                    }
                </div>
                ${this.isProcessing ? "" : html`
                <mwc-button slot="secondaryAction" @click="${this.handleClickProcesar}">
                    Procesar archivo
                </mwc-button>`}
                <mwc-button slot="primaryAction" dialogAction="cancel">
                    Cancelar
                </mwc-button>
            </mwc-dialog>
        `;
    }
}

customElements.define("impdata-obs", ImpDataObs);