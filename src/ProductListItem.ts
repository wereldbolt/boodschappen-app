import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ProductEntity, PickStates, ProductCategories } from './DataStore';

export class ProductListItem extends LitElement {

  @property({ type: Object }) product!: ProductEntity;

  @property({ type: Number }) pickState: PickStates;

  @property({ type: Boolean }) isPicking: Boolean = false;

  static styles = css`


  li{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 4px 15px;
    margin-bottom: 15px;
    border-radius: 5px;
    border: 1px solid gray;
  }

  li.pickState-${PickStates.Picked}{
    background-color: #b3f5b3;
  }

  li.pickState-${PickStates.Unavailable}{
    background-color: #ffa894;
  }

  li.productCategory-${ProductCategories.Bakery}{
    border-left: 10px solid #f7ee3b;
  }

  li.productCategory-${ProductCategories.Butchery}{
    border-left: 10px solid #f78a3b;
  }

  li.productCategory-${ProductCategories.Dairy}{
    padding: 5px 15px;
    border-left: 10px solid #2847fa;
  }


  li.productCategory-${ProductCategories.Detergent}{
    border-left: 10px solid #fa287f
  }


  li.productCategory-${ProductCategories.Fruit}{
    border-left: 10px solid #e5fa28
  }

  li.productCategory-${ProductCategories.Vegetables}{
    border-left: 10px solid #28fa63
  }

  li p:first-of-type{
    width: 150px;
    display: flex;
  }

  .amount-btn-wrapper {
      display: flex;
      align-items: center;
      justify-count: space-between;
  }

  .amount-btn-wrapper button{
      width: 30px;
      height: 30px;
      margin: 3px;
  }
  `;

  constructor() {
    super();
    this.pickState = PickStates.Unpicked;

  }

  setPickState() {
    let nextState: PickStates;
    try {
      switch (this.pickState) {
        case PickStates.Unpicked:
          nextState = PickStates.Picked;
          break;
        case PickStates.Picked:
          nextState = PickStates.Unavailable;
          break;
        case PickStates.Unavailable:
          nextState = PickStates.Unpicked;
          break;
        default:
          nextState = PickStates.Unpicked;
          throw new Error(`Current Pickstate not implemented`);
      }
    } catch (err) {
      console.log(err);
    } finally {

      // @ts-ignore
      this.pickState = nextState;

      // @ts-ignore
      this.product.pickState = nextState;
    }

    const event = new CustomEvent('product-pickState', {
      bubbles: true,
      detail: {
        product: this.product
      }
    });

    this.dispatchEvent(event);
  }

  increaseProductAmount(e: Event) {
    e.stopPropagation();
    const currentProductAmount = this.product.count;
    this.product.count++;
    this.requestUpdate();
    if (currentProductAmount === 0) this.dispatchProductToPickChangeEvent();
  }

  decreaseProductAmount(e: Event) {
    e.stopPropagation();
    const currentProductAmount = this.product.count;
    if (currentProductAmount === 0) return;
    this.product.count--;
    this.requestUpdate();
    if (this.product.count === 0) this.dispatchProductToPickChangeEvent();
  }

  dispatchProductToPickChangeEvent() {
    const event = new CustomEvent('product-toPickChange', {
      bubbles: true,
      detail: {
        product: this.product
      }
    });

    this.dispatchEvent(event);
  }

  resetProductAmount(e :Event){
    e.stopPropagation();
    const currentProductAmount = this.product.count;
    if (currentProductAmount === 0) return;
    this.product.count = 0;
    this.requestUpdate();
    this.dispatchProductToPickChangeEvent();

  }


  render() {
    return html`

${when(this.isPicking && this.product.count === 0, () =>
      html`

      `
    , () =>
      html`
      <li class="pickState-${this.pickState} productCategory-${this.product.category}" @click="${this.setPickState}">
      <p>${this.product.name}</p>


      ${when(this.isPicking, () => {
        },() =>

          html`
          <div class="amount-btn-wrapper">
          <button @click="${this.increaseProductAmount}">+</button>
          <button @click="${this.decreaseProductAmount}">-</button>
          <button @click="${this.resetProductAmount}">🗑</button>
          </div>
        `

      )}

      <p>${this.product.count}</p>
      </li>
      `
    )}

    `;
  }
}
