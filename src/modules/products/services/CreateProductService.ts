import { injectable, inject } from 'tsyringe';

import SystemError from '@global/errors/SystemError';
import IProductsRepository from '@modules/products/infra/repository/IProductsRepository';
import IStorageProvider from '@global/container/providers/Storage/models/IStorageProvider';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IRequest {
  name: string;
  imageFileName: string;
  description: string;
  weight: number;
  price: number;
  stock: number;
}

@injectable()
class CreateProductRepository {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute(data: IRequest): Promise<Product> {
    const { name, stock, weight, price, imageFileName, description } = data;

    const checkProductName = await this.productsRepository.findByName(name);

    if (checkProductName) {
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

    const image_url = await this.storageProvider.saveFile(imageFileName);

    const productData = {
      name,
      stock,
      weight,
      price,
      image_url,
      description,
    };

    const product = await this.productsRepository.create(productData);

    return product;
  }
}

export default CreateProductRepository;
