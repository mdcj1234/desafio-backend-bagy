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

// return new Promise((resolve, reject) =>
//     createReadStream()
//       .pipe(createWriteStream(filePath))
//       .on('finish', () => resolve(true))
//       .on('error', () => reject()),
//   );

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
      const resolvedImageFile = await imageFile;

      await storeImageFileInTempFolder(resolvedImageFile);

      const { fileName } = resolvedImageFile;

      const createProductService = container.resolve(CreateProductService);
      return createProductService.execute({
        ...data,
        imageFileName: fileName,
      });
    },
    updateProduct: (_, { id, data }) => {
      const updateProductService = container.resolve(UpdateProductService);
      return updateProductService.execute({ id, ...data });
    },
    updateProductImage: async (_, { id, imageFile }) => {
      const resolvedImageFile = await imageFile;

      await storeImageFileInTempFolder(resolvedImageFile);

      const { fileName } = resolvedImageFile;

      const updateProductImageService = container.resolve(
        UpdateProductImageService,
      );
      return updateProductImageService.execute({
        id,
        imageFileName: fileName,
      });
    },
    deleteProduct: (_, { id }) => {
      const deleteProductService = container.resolve(DeleteProductService);
      return deleteProductService.execute(id);
    },
  },
};
