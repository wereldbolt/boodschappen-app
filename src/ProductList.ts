import { LitElement, html, css } from 'lit';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { property, state } from 'lit/decorators.js';
import { DataStore, PickStates, ProductCategories, ProductEntity } from './DataStore';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

export class ProductList extends LitElement {

  @property({ type: Boolean }) productsInitialized = false;

  @property({ attribute: false }) dataStore: DataStore;

  @property({ type: [ProductEntity] }) products: ProductEntity[] = [];

  @property({ type: Number }) productsPickedCount = 0;

  @property({ type: Boolean }) isPicking: Boolean = true;

  @property({ type: Number }) productsToPickCount: number = 0;

  @property({type: Array}) private filteredProducts: ProductEntity[] = [];

  constructor() {
    super();
    this.dataStore = new DataStore();
  }

  computeFilteredProducts() {
    let _toPick = 0;
    let categories : ProductCategories[] = [];


    // Object.keys(ProductCategories).filter(x => (parseInt(x, 10) >= 0)).map(x => parseInt(x, 10));

    this.shadowRoot!.querySelectorAll('#productCategoryFilters input').forEach(n => {
      const m: HTMLInputElement = n as HTMLInputElement;
      const idNumber: number = parseInt(m.id, 10);
      if (m.checked) { // @ts-ignore
        categories.push(idNumber);
      }
    });

    // @ts-ignore
    this.filteredProducts = this.products
      .reduce((p: ProductEntity[], c: ProductEntity) => { //filter aan het winkelen -> product.count > 0
        if (c.count > 0) _toPick++;
        if (c.count === 0 && this.isPicking) return p;
        p.push(c);
        return p;
      }, [])

    // @ts-ignore
      .reduce((p: ProductEntity[], c: ProductEntity) => {

        if(categories.length === 0){
          p.push(c);
          return p;
        }

        if(categories.includes(c.category)){
          p.push(c);
          return p;
        }

        return p;

      }, []);

    this.productsToPickCount = _toPick;
    // console.log(this.productCategoryFilters)
    console.log(`filtered products: ${JSON.stringify(this.filteredProducts)}`);
  }

  async connectedCallback() {
    super.connectedCallback();
    const productEntities = await this.dataStore.fetchData();
    console.log('connected')
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

    #productCategoryFilters{
      display: flex;
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

  render() {
    return html`
<div @product-toPickChange="${this.productToPickChangeListener}">
    ${this.templateHeader()}

    ${this.templateFilterCategories()}

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
