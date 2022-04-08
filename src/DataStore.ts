const products = [
  {
    name: 'halfvolle melk',
    count: 2,
    category: 'zuivel',
    pickState: 0
  },
  {
    name: 'volle melk',
    count: 1,
    category: 'zuivel',
    pickState: 0
  }
]

export class ProductEntity{

  public name: string

  public count: number

  public pickState! : PickStates

  constructor(product: any) {
    this.name = product.name;
    this.count = product.count;
    this.pickState = product.pickState;
  }

}

export enum PickStates {
  Unpicked,
  Picked,
  Unavailable
}

export class DataStore {

    async fetchData() : Promise<ProductEntity[]>{
      return new Promise(resolve => {
        resolve(products);
      });
    }
}
