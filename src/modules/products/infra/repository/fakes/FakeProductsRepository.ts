import { uuid } from 'uuidv4';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/infra/repository/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductDTO from '@modules/products/dtos/IUpdateProductDTO';
import IFindProductDTO from '@modules/products/dtos/IFindProductDTO';

class ProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  async save(product: Product): Promise<Product> {
    const findIndex = this.products.findIndex(
      findProduct => findProduct.id === product.id,
    );

    this.products[findIndex] = product;

    return product;
  }

  async create(productData: ICreateProductDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, { id: uuid(), ...productData });

    this.products.push(product);

    return product;
  }

  async delete(id: string): Promise<boolean> {
    const findIndex = this.products.findIndex(
      findProducts => findProducts.id === id,
    );

    this.products = this.products.splice(findIndex, 1);

    return true;
  }

  async list(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: string): Promise<Product | undefined> {
    const findProduct = this.products.find(product => product.id === id);
    return findProduct;
  }

  async findByName(name: string): Promise<Product | undefined> {
    const findProduct = this.products.find(product => product.name === name);
    return findProduct;
  }

  async findAllById(products: IFindProductDTO[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const allProducts = this.products.filter(product =>
      productIds.includes(product.id),
    );
    return allProducts;
  }

  async updateStock(products: IUpdateProductDTO[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const allProducts = this.products.filter(product =>
      productIds.includes(product.id),
    );

    const preUpdatedProducts = allProducts.map(stockProduct => {
      const purchasedProductIndex = products.findIndex(
        product => product.id === stockProduct.id,
      );

      const updatedProduct = stockProduct;
      updatedProduct.stock -= products[purchasedProductIndex].quantity;

      return updatedProduct;
    });

    const updatedProducts = preUpdatedProducts.map(product => {
      const findIndex = this.products.findIndex(
        findProduct => findProduct.id === product.id,
      );

      this.products[findIndex] = product;

      return product;
    });

    return updatedProducts;
  }
}

export default ProductsRepository;
