import { injectable, inject } from 'tsyringe';

import SystemError from '@global/errors/SystemError';
import IProductsRepository from '@modules/products/infra/repository/IProductsRepository';

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    const checkProductExists = await this.productsRepository.findById(id);

    if (!checkProductExists) {
      throw new SystemError('Product does not exists.');
    }

    const result = await this.productsRepository.delete(id);

    return result;
  }
}

export default DeleteProductService;
