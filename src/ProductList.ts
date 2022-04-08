import { LitElement, html, css } from 'lit';
import { when } from 'lit/directives/when.js';
import { map } from 'lit/directives/map.js';
import { property } from 'lit/decorators.js';
import { DataStore, PickStates, ProductEntity } from './DataStore';
import { eventOptions } from '@lit/reactive-element/development/decorators/event-options';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

export class ProductList extends LitElement {
  @property({ type: Boolean }) productsInitialized = false;

  @property({ attribute: false }) dataStore: DataStore;

  @property({ type: [ProductEntity] }) products: ProductEntity[] = [];

  @property({ type: Number }) productsPickedCount = 0;

  @property({type: Boolean}) startPicking = false;

  @property({type: Boolean}) isPicking : Boolean = true;


  constructor() {
    super();
    this.dataStore = new DataStore();
  }

  async connectedCallback() {
    super.connectedCallback();
    let p = await this.dataStore.fetchData();
    setTimeout(() => {
      this.products = p;
      this.productsInitialized = true;
    }, 500);

  }

  static styles = css`
    ul{
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
    }
  `;

  productPickStateListener(e: CustomEvent) {
    if(e.detail.product.pickState === PickStates.Picked) {
      this.productsPickedCount++;
    }else if(e.detail.product.pickState === PickStates.Unpicked){
      this.productsPickedCount--;
    }
  }

  render() {
    return html`
      <p>boodschappenlijst ${this.isPicking}

      ${when(this.productsInitialized, () => {
      return html`${this.productsPickedCount}/${this.products.length}`;
    }, () => {
      return '...';
    })}


      </p>
       ${when(this.productsInitialized, () => html`
      <ul @product-pickState="${this.productPickStateListener}">
        ${this.products.map(
      (item, index) =>
        html`
              <product-listitem .product=${item}></product-listitem>
            `
    )}
      </ul>
        `, () => html`loading...`)}

    `;
  }

}
