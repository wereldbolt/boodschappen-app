import { LitElement, html, css } from 'lit';
import { property , state} from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ProductEntity, PickStates, ProductCategories } from './DataStore';

export class ProductListItem extends LitElement {

  @property({ type: Object }) product!: ProductEntity;

  @property({ type: Number }) pickState: PickStates;

  @property({ type: Boolean }) isPicking: Boolean = false;

  @property({type: Boolean}) shouldPick : Boolean = false;

  @property({type: Number, attribute: false}) renderCount = 0;

  @state()
  showItem: Boolean = false;

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

  li.filterState-hidden{
    display:none;
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
    border-left: 10px solid #ed2d90
  }

  li.productCategory-${ProductCategories.Vegetables}{
    border-left: 10px solid #14ba14
  }

  li p:first-of-type{
    width: 150px;
    display: flex;
    align-items: center;
  }

  .productPickCount {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid black;
    width: 25px;
    height: 25px;
    font-size: smaller;
    margin-left: 15px;
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
    if(this.product.id === 1) console.log('rendering')
    if(this.product.id === 1) console.log(this.showItem)
    if(this.product.id === 1) console.log(this.product.showItem)
    if(this.product.id === 1) this.renderCount++
    if(this.product.id === 1) console.log(this.renderCount)


    if(this.showItem && !(this.product.count === 0 && this.isPicking)){
      return html`
      <li class="pickState-${this.pickState} productCategory-${this.product.category}" @click="${this.setPickState}">
      <p>${this.product.name} <span class="productPickCount">${this.product.count}</span></p>

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

      <p>to show: ${this.product.showItem}</p>
      </li>`
    }
  }
}
