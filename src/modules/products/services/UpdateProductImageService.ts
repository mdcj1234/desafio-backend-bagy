import { injectable, inject } from 'tsyringe';

import SystemError from '@global/errors/SystemError';
import IProductsRepository from '@modules/products/infra/repository/IProductsRepository';
import IStorageProvider from '@global/container/providers/Storage/models/IStorageProvider';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IRequest {
  id: string;
  imageFileName: string;
}

@injectable()
class UpdateProductImageService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute(data: IRequest): Promise<Product> {
    const { id, imageFileName } = data;

    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new SystemError('Product does not exists.');
    }

    const image_url = await this.storageProvider.saveFile(imageFileName);

    Object.assign(product, {
      ...product,
      image_url,
    });

    return this.productsRepository.save(product);
  }
}

export default UpdateProductImageService;
