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
    name: 'tijgerbrood',
    count: 6,
    category: 'bakkerij'
  },
  {
    name: 'appels',
    count: 1,
    category: 'fruit'
  },
  {
    name: 'bananen',
    count: 3,
    category: 'fruit'
  },
  {
    name: 'sla',
    count: 0,
    category: 'groente'
  },
  {
    name: 'gehakt 1kg',
    count: 0,
    category: 'slagerij'
  },
  {
    name: 'afwasmiddel',
    count: 0,
    category: 'schoonmaakmiddelen'
  }

];

let nextProductId = 0;

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

  public id : number

  public name: string

  public count: number

  public pickState! : PickStates;

  public category: ProductCategories;

  public showItem: Boolean = true;

  constructor(product: any) {
    this.id = ++nextProductId;
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
      case "fruit":
        this.category = ProductCategories.Fruit;
        break;
      case "groente":
        this.category = ProductCategories.Vegetables;
        break;
      case "slagerij":
        this.category = ProductCategories.Butchery;
        break;
      case "schoonmaakmiddelen":
        this.category = ProductCategories.Detergent;
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
