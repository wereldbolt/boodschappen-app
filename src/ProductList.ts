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

  @property({ type: Boolean }) isPicking: Boolean = true;

  @property({ type: Number }) productsToPickCount: number = 0;

  @property({ type: Array }) filteredProducts: ProductEntity[] = [];

  constructor() {
    super();
    this.dataStore = new DataStore();
  }

  computeFilteredProducts() {
    let _toPick = 0;
    this.filteredProducts = this.products.reduce((p: ProductEntity[], c: ProductEntity) => {

      if (c.count > 0) _toPick++;
      if (c.count === 0 && this.isPicking) return p;
      p.push(c);
      return p;
    }, []);
    this.productsToPickCount = _toPick;
    console.log(`filtered products: ${JSON.stringify(this.filteredProducts)}`);
  }

  async connectedCallback() {
    super.connectedCallback();
    const productEntities = await this.dataStore.fetchData();
    setTimeout(() => {
      this.products = productEntities;
      this.computeFilteredProducts();
      this.productsInitialized = true;
    }, 500);

  }

  static styles = css`
    ul{
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      padding: 0;
    }
  `;

  productPickStateListener(e: CustomEvent) {
    if (e.detail.product.pickState === PickStates.Picked) {
      this.productsPickedCount++;
    } else if (e.detail.product.pickState === PickStates.Unpicked) {
      this.productsPickedCount--;
    }
  }

  productToPickChangeListener(e: CustomEvent) {
    e.detail.product!.count === 0 ? this.productsToPickCount-- : this.productsToPickCount++;
    this.computeFilteredProducts();
  }

  templateHeader() {
    return html`

      <p>boodschappenlijst
      ${when(this.productsInitialized, () => {
      return html`<span>${this.productsPickedCount}/${this.productsToPickCount}</span>`;
    }, () => {
      return '...';
    })}
      </p>
    `;
  }

  render() {
    return html`
<div @product-toPickChange="${this.productToPickChangeListener}">
    ${this.templateHeader()}



       ${when(this.productsInitialized, () => html`
      <ul @product-pickState="${this.productPickStateListener}">
        ${this.filteredProducts.map(
      (item, index) =>
        html`
              <product-listitem .product=${item} .isPicking="${this.isPicking}"></product-listitem>
            `
    )}
      </ul>
        `, () => html`loading...`)}

    </div>
    `;
  }


}
