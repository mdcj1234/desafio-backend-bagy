import SystemError from '@global/errors/SystemError';

import FakeStorageProvider from '@global/container/providers/Storage/fakes/FakeStorageProvider';
import FakeProductsRepository from '../infra/repository/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';

let fakeStorageProvider: FakeStorageProvider;
let fakeProductsRepository: FakeProductsRepository;
let createProductService: CreateProductService;

describe('Create Product', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeProductsRepository = new FakeProductsRepository();

    createProductService = new CreateProductService(
      fakeProductsRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create a new product', async () => {
    const product = await createProductService.execute({
      name: 'Chaveiro',
      imageFileName: 'fake_image',
      description: 'Descrição chaveiro',
      price: 1.1,
      stock: 10,
      weight: 0.05,
    });

    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Chaveiro');
    expect(product.description).toBe('Descrição chaveiro');
    expect(product.price).toBe(1.1);
    expect(product.stock).toBe(10);
    expect(product.weight).toBe(0.05);
  });

  it('should not be able to create two products with the same name', async () => {
    await createProductService.execute({
      name: 'Chaveiro',
      imageFileName: 'fake_image',
      description: 'Descrição chaveiro',
      price: 1.1,
      stock: 10,
      weight: 0.05,
    });

    await expect(
      createProductService.execute({
        name: 'Chaveiro',
        imageFileName: 'fake_image',
        description: 'Descrição chaveiro',
        price: 1.1,
        stock: 10,
        weight: 0.05,
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to create a product with stock less than zero', async () => {
    await expect(
      createProductService.execute({
        name: 'Chaveiro',
        imageFileName: 'fake_image',
        description: 'Descrição chaveiro',
        price: 1.1,
        stock: -1,
        weight: 0.05,
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to create a product with price equal or less than zero', async () => {
    await expect(
      createProductService.execute({
        name: 'Chaveiro',
        imageFileName: 'fake_image',
        description: 'Descrição chaveiro',
        price: 0,
        stock: 10,
        weight: 0.05,
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to create a product with weight equal or less than zero', async () => {
    await expect(
      createProductService.execute({
        name: 'Chaveiro',
        imageFileName: 'fake_image',
        description: 'Descrição chaveiro',
        price: 1.1,
        stock: 10,
        weight: 0,
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });
});
