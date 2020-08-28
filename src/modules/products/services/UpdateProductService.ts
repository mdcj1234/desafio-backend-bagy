import { injectable, inject } from 'tsyringe';

import SystemError from '@global/errors/SystemError';
import IProductsRepository from '@modules/products/infra/repository/IProductsRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IRequest {
  id: string;
  name: string;
  image_url: string;
  description: string;
  weight: number;
  price: number;
  stock: number;
}

@injectable()
class UpdateProductRepository {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(data: IRequest): Promise<Product> {
    const { id, name, image_url, description, weight, price, stock } = data;

    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new SystemError('Product does not exists.');
    }

    const checkProductName = await this.productsRepository.findByName(name);

    if (checkProductName && checkProductName.id !== id) {
      throw new SystemError('Product name already registred.');
    }

    if (!stock || stock < 0) {
      throw new SystemError(
        'Stock quantity must be greater than or equal to zero.',
      );
    }

    if (!price || price <= 0) {
      throw new SystemError('Price must be greater than zero.');
    }

    if (!weight || weight <= 0) {
      throw new SystemError('Weight must be greater than zero.');
    }

    Object.assign(product, {
      name,
      image_url,
      description,
      weight,
      price,
      stock,
    });

    return this.productsRepository.save(product);
  }
}

export default UpdateProductRepository;
