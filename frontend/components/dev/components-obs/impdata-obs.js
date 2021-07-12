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
        return css`        
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
        for (let i = 0; i < files.length; i++) {
            let file = files[i];          
            formData.append("files[]", file);
        }

        const res = await fetch("http://localhost/cad/recibir_archivo.php", {
            method: "POST",
            body: formData,
        });

        if(res.status === 200){
            this.toogleIsProcessing();
            alert("Se procesó el archivo correctamente!");
        } else {
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
        return html`
            <mwc-button label="Importar" @click="${this.handleClickImport}"></mwc-button>
            
            <mwc-dialog heading="Gustavo ponle un titulo">
                <div>
                    ${this.isProcessing ? 
                    html`<mwc-circular-progress indeterminate></mwc-circular-progress>` : 
                    html`<input type="file">`
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