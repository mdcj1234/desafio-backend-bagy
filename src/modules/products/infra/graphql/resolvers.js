import { container } from 'tsyringe';

import CreateProductService from '@modules/products/services/CreateProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import DeleteProductService from '@modules/products/services/DeleteProductService';
import ProductsRepository from '../typeorm/repositories/ProductsRepository';

export default {
  Query: {
    products: () => {
      const productsRepository = new ProductsRepository();
      return productsRepository.list();
    },
    product: (_, id) => {
      const productsRepository = new ProductsRepository();
      return productsRepository.findById(id);
    },
  },
  Mutation: {
    createProduct: (_, { data }) => {
      const createProductService = container.resolve(CreateProductService);
      return createProductService.execute(data);
    },
    updateProduct: (_, { id, data }) => {
      const updateProductService = container.resolve(UpdateProductService);
      return updateProductService.execute({ id, ...data });
    },
    deleteProduct: (_, { id }) => {
      const deleteProductService = container.resolve(DeleteProductService);
      return deleteProductService.execute(id);
    },
  },
};
