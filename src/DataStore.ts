const products = [
  {
    name: 'halfvolle melk',
    count: 2,
    category: 'zuivel'
  },
  {
    name: 'volle melk',
    count: 1,
    category: 'zuivel'
  },
  {
    name: 'vla',
    count: 1,
    category: 'zuivel'
  },
  {
    name: 'yoghurt',
    count: 1,
    category: 'zuivel'
  },
  {
    name: 'tijger brood',
    count: 6,
    category: 'bakkerij'
  }
];

export enum PickStates {
  Unpicked,
  Picked,
  Unavailable
}

export enum ProductCategories {
  Dairy,
  Bakery,
  Butchery,
  Detergent,
  Vegetables,
  Fruit
}

export class ProductEntity{

  public name: string

  public count: number

  public pickState! : PickStates;

  public category: ProductCategories;

  constructor(product: any) {
    this.name = product.name;
    this.count = product.count;
    this.pickState = product.pickState || PickStates.Unpicked;

    switch (product.category){
      case "zuivel":
        this.category = ProductCategories.Dairy
        break;
      case "bakkerij":
        this.category = ProductCategories.Bakery;
        break;
      default:
        throw new Error(`product category unknown: ${product.category}`);
    }

  }

}

export class DataStore {

    async fetchData() : Promise<ProductEntity[]>{
      return new Promise(resolve => {
        resolve(products.map(p => new ProductEntity(p)));
      });
    }
}
