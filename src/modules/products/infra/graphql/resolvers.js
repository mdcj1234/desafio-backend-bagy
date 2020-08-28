import { container } from 'tsyringe';
import { createWriteStream } from 'fs';

import path from 'path';

import CreateProductService from '@modules/products/services/CreateProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import DeleteProductService from '@modules/products/services/DeleteProductService';
import ProductsRepository from '../typeorm/repositories/ProductsRepository';

async function waitForImageFileToImport(promiseImageFile) {
  const imageFile = await promiseImageFile;

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

  return new Promise((resolve, reject) =>
    createReadStream()
      .pipe(createWriteStream(filePath))
      .on('finish', () => resolve(true))
      .on('error', () => reject()),
  );
}

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
    createProduct: async (_, { data }) => {
      const { imageFile } = data;

      await waitForImageFileToImport(imageFile);

      const { filename } = await imageFile;

      const createProductService = container.resolve(CreateProductService);
      const inputData = {
        ...data,
        imageFileName: filename,
      };
      return createProductService.execute(inputData);
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
