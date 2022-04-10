import { LitElement, html, css } from 'lit';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { property, state } from 'lit/decorators.js';
import { DataStore, PickStates, ProductCategories, ProductEntity } from './DataStore.js';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

export class ProductList extends LitElement {

  @property({ type: Boolean }) productsInitialized = false;

  @property({ attribute: false }) dataStore: DataStore;

  @state()
  products: ProductEntity[] = [];

  @property({ type: Number }) productsPickedCount = 0;

  @property({ type: Boolean }) isPicking: Boolean = true;

  @property({ type: Number }) productsToPickCount: number = 0;

  constructor() {
    super();
    this.dataStore = new DataStore();
  }

  async connectedCallback() {
    super.connectedCallback();
    const productEntities = await this.dataStore.fetchData();
    console.log('connected');
    setTimeout(() => {
      productEntities.forEach(p => this.products.push(p));
      this.computeFilteredProducts();
      this.productsInitialized = true;
    }, 500);

  }

  computeFilteredProducts() {
    let _toPick = 0;

    let categories: ProductCategories[] = [];

    this.shadowRoot!.querySelectorAll('#productCategoryFilters input').forEach(n => {
      const m: HTMLInputElement = n as HTMLInputElement;
      const idNumber: number = parseInt(m.id, 10);
      if (m.checked) { // @ts-ignore
        categories.push(idNumber);
      }
    });

    // @ts-ignore
    this.products.forEach(p => {

      // to pick
      if (p.count > 0) _toPick++;

      // to show
      if (p.count === 0 && this.isPicking) {
        p.showItem = false;
        return;
      }

      if (categories.length === 0) {
        p.showItem = true;
        return;
      }

      if (categories.includes(p.category)) {
        p.showItem = true;
        return;
      }

      p.showItem = false;

    });

    this.productsToPickCount = _toPick;
    console.log(this.products.filter(p => p.showItem));
    this.requestUpdate();
  }

  static styles = css`
    ul{
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      padding: 0;
    }

    #productCategoryFilters{
      display: flex;
      flex-wrap: wrap;
    }

    #productCategoryFilters span{
      font-size: x-small;
    }

    #productCategoryFilters label{
      display: flex;
      align-items: center;
      margin-left: 6px;
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

  templateFilterCategories() {
    return html`

<div id="productCategoryFilters">
            <label @click=${this.computeFilteredProducts}><input id="${ProductCategories.Dairy}" type="checkbox"><span>zuivel</span> 🥛</label>
            <label @click=${this.computeFilteredProducts}><input id="${ProductCategories.Bakery}" type="checkbox"><span>bakkerij</span> 🥨</label>
            <label @click=${this.computeFilteredProducts}><input id="${ProductCategories.Vegetables}" type="checkbox"><span>groente</span> 🥬</label>
            <label @click=${this.computeFilteredProducts}><input id="${ProductCategories.Fruit}" type="checkbox"><span>fruit</span> 🍌</label>
            <label @click=${this.computeFilteredProducts}><input id="${ProductCategories.Detergent}" type="checkbox"><span>schoonmaakmiddelen</span> ✨</label>
            <label @click=${this.computeFilteredProducts}><input id="${ProductCategories.Butchery}" type="checkbox"><span>slagerij<span> 🍗</label>

</div>

    `;
  }

  templateProductListItems(){
    return html`
    ${when(this.productsInitialized, () => html`
      <ul @product-pickState="${this.productPickStateListener}">

      ${
      repeat(
        this.products,
        p => p.id,
        item => html`<product-listitem .product=${item} .showItem=${item.showItem} .isPicking="${this.isPicking}"></product-listitem>`
      )}
      </ul>
        `, () => html`loading...`)}
    `
  }

  render() {
    return html`
<div @product-toPickChange="${this.productToPickChangeListener}">
    ${this.templateHeader()}

    ${this.templateFilterCategories()}

       ${this.templateProductListItems()}
    </div>
    `;
  }


}
