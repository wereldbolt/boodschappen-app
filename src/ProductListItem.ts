import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { ProductEntity, PickStates } from './DataStore';



export class ProductListItem extends LitElement {

  @property({ type: Object }) product!: ProductEntity;

  @property({ type: Number }) pickState: PickStates;

  static styles = css`
  li{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 6px;
    border-radius: 5px;
    border: 1px solid gray;
  }

  li.pickState-${PickStates.Picked}{
    background-color: green;
  }

  li.pickState-${PickStates.Unavailable}{
    background-color: red;
  }



  `;

  constructor() {
    super();
    this.pickState = PickStates.Unpicked;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log(this.product.name);
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

    console.log(event)
    console.log('dispatching')
    this.dispatchEvent(event);


    console.log(this.pickState)
  }


  render() {
    return html`
<li class="pickState-${this.pickState}" @click="${this.setPickState}">
      <p>${this.product.name}</p> <p>${this.product.count}</p>
</li>
    `;
  }
}
