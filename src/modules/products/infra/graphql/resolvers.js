import { container } from 'tsyringe';
import { createWriteStream } from 'fs';

import path from 'path';

import CreateProductService from '@modules/products/services/CreateProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import UpdateProductImageService from '@modules/products/services/UpdateProductImageService';
import DeleteProductService from '@modules/products/services/DeleteProductService';
import ProductsRepository from '../typeorm/repositories/ProductsRepository';

async function storeImageFileInTempFolder(imageFile) {
  const { createReadStream, filename } = imageFile;

  const filePath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'tmp',
    `${filename}`,
  );

  return createReadStream().pipe(createWriteStream(filePath));
}

export default {
  Product: {
    created_at: product => {
      return new Date(product.created_at);
    },
    updated_at: product => {
      return new Date(product.updated_at);
    },
  },
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
    createProduct: async (_, { imageFile, data }) => {
      let imageFileName = '';

      if (imageFile) {
        const resolvedImageFile = await imageFile;

        await storeImageFileInTempFolder(resolvedImageFile);

        const { filename } = resolvedImageFile;

        imageFileName = filename;
      }

      const createProductService = container.resolve(CreateProductService);
      return createProductService.execute({
        ...data,
        imageFileName,
      });
    },
    updateProduct: (_, { id, data }) => {
      const updateProductService = container.resolve(UpdateProductService);
      return updateProductService.execute({ id, ...data });
    },
    updateProductImage: async (_, { id, imageFile }) => {
      const resolvedImageFile = await imageFile;

      await storeImageFileInTempFolder(resolvedImageFile);

      const { filename } = resolvedImageFile;

      const updateProductImageService = container.resolve(
        UpdateProductImageService,
      );
      return updateProductImageService.execute({
        id,
        imageFileName: filename,
      });
    },
    deleteProduct: (_, { id }) => {
      const deleteProductService = container.resolve(DeleteProductService);
      return deleteProductService.execute(id);
    },
  },
};
