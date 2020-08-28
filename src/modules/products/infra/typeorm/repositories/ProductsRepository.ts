import { getRepository, Repository, In } from 'typeorm';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/infra/repository/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductDTO from '@modules/products/dtos/IUpdateProductDTO';
import IFindProductDTO from '@modules/products/dtos/IFindProductDTO';

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  async save(product: Product): Promise<Product> {
    return this.ormRepository.save(product);
  }

  async create({
    name,
    image_url,
    description,
    weight,
    price,
    stock,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      image_url,
      description,
      weight,
      price,
      stock,
    });
    await this.ormRepository.save(product);

    return product;
  }

  async delete(id: string): Promise<boolean> {
    await this.ormRepository.delete(id);

    return true;
  }

  async list(): Promise<Product[]> {
    return this.ormRepository.find();
  }

  async findById(id: string): Promise<Product | undefined> {
    return this.ormRepository.findOne(id);
  }

  async findByName(name: string): Promise<Product | undefined> {
    return this.ormRepository.findOne({
      where: { name },
    });
  }

  async findAllById(products: IFindProductDTO[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const allProducts = await this.ormRepository.find({
      id: In(productIds),
    });

    return allProducts;
  }

  async updateStock(products: IUpdateProductDTO[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const allProducts = await this.ormRepository.find({
      id: In(productIds),
    });

    const updatedProducts = allProducts.map(stockProduct => {
      const purchasedProductIndex = products.findIndex(
        product => product.id === stockProduct.id,
      );

      const updatedProduct = stockProduct;
      updatedProduct.stock -= products[purchasedProductIndex].quantity;

      return updatedProduct;
    });

    await this.ormRepository.save(updatedProducts);

    return updatedProducts;
  }
}

export default ProductsRepository;
