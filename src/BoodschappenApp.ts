import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';


const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

export class BoodschappenApp extends LitElement {
  @property({ type: String }) title = 'Boodschappen app';

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--boodschappen-app-background-color);
    }

    main {
      flex-grow: 1;
    }

    .logo {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  @property({type: Boolean}) isPicking : Boolean = false;

  isPickingListener(){
    const element = this.shadowRoot!.getElementById('in-de-winkel')! as HTMLInputElement;
    this.isPicking = element.checked;
  }

  render() {
    return html`
      <main>
<!--        <div class="logo"><img alt="open-wc logo" src=${logo} /></div>-->
        <h1>${this.title} ${this.isPicking}</h1>
        <label><input id="in-de-winkel" type="checkbox" @click=${this.isPickingListener}>in de winkel</label>
        <product-list .isPicking="${this.isPicking}"></product-list>


      <p class="app-footer">
        Made with love by 🧷
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >Ernst</a
        >.
      </p>

      </main>

    `;
  }
}
