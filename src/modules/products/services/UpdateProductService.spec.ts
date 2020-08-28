import SystemError from '@global/errors/SystemError';

import FakeProductsRepository from '../infra/repository/fakes/FakeProductsRepository';
import UpdateProductService from './UpdateProductService';

let fakeProductsRepository: FakeProductsRepository;
let udateProductService: UpdateProductService;

describe('Create Product', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();

    udateProductService = new UpdateProductService(fakeProductsRepository);
  });

  it('should be able to update a product', async () => {
    const newProduct = await fakeProductsRepository.create({
      name: 'Chaveiro',
      image_url: 'fake_url',
      description: 'Descrição chaveiro',
      price: 1.1,
      stock: 10,
      weight: 0.05,
    });

    newProduct.name = 'Lapis';
    newProduct.description = 'É um lapis';
    newProduct.price = 2.9;
    newProduct.stock = 3;
    newProduct.weight = 0.15;

    const product = await udateProductService.execute(newProduct);

    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Lapis');
    expect(product.image_url).toBe('fake_url');
    expect(product.description).toBe('É um lapis');
    expect(product.price).toBe(2.9);
    expect(product.stock).toBe(3);
    expect(product.weight).toBe(0.15);
  });

  it('should not be able to update an invalid product', async () => {
    const product = {
      id: 'fake-id',
      name: 'Lapis',
      image_url: 'fake_url',
      description: 'Descrição lapis',
      price: 1.9,
      stock: 15,
      weight: 0.15,
    };

    await expect(udateProductService.execute(product)).rejects.toBeInstanceOf(
      SystemError,
    );
  });

  it('should not be able to update a product with name already taken', async () => {
    await fakeProductsRepository.create({
      name: 'Chaveiro',
      image_url: 'fake_url',
      description: 'Descrição chaveiro',
      price: 1.1,
      stock: 10,
      weight: 0.05,
    });

    const newProduct = await fakeProductsRepository.create({
      name: 'Lapis',
      image_url: 'fake_url',
      description: 'Descrição lapis',
      price: 1.9,
      stock: 15,
      weight: 0.15,
    });

    newProduct.name = 'Chaveiro';
    newProduct.description = 'Descrição chaveiro';
    newProduct.price = 2.9;
    newProduct.stock = 3;
    newProduct.weight = 0.15;

    await expect(
      udateProductService.execute(newProduct),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to update a product with stock lower than zero', async () => {
    const newProduct = await fakeProductsRepository.create({
      name: 'Chaveiro',
      image_url: 'fake_url',
      description: 'Descrição chaveiro',
      price: 1.1,
      stock: 10,
      weight: 0.05,
    });

    newProduct.name = 'Lapis';
    newProduct.description = 'É um lapis';
    newProduct.price = 2.9;
    newProduct.stock = -1;
    newProduct.weight = 0.15;

    await expect(
      udateProductService.execute(newProduct),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to update a product with price lower than or equal to zero', async () => {
    const newProduct = await fakeProductsRepository.create({
      name: 'Chaveiro',
      image_url: 'fake_url',
      description: 'Descrição chaveiro',
      price: 1.1,
      stock: 10,
      weight: 0.05,
    });

    newProduct.name = 'Lapis';
    newProduct.description = 'É um lapis';
    newProduct.price = 0;
    newProduct.stock = 10;
    newProduct.weight = 0.15;

    await expect(
      udateProductService.execute(newProduct),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to update a product with weight lower than or equal to zero', async () => {
    const newProduct = await fakeProductsRepository.create({
      name: 'Chaveiro',
      image_url: 'fake_url',
      description: 'Descrição chaveiro',
      price: 1.1,
      stock: 10,
      weight: 0.05,
    });

    newProduct.name = 'Lapis';
    newProduct.description = 'É um lapis';
    newProduct.price = 1;
    newProduct.stock = 10;
    newProduct.weight = -0.15;

    await expect(
      udateProductService.execute(newProduct),
    ).rejects.toBeInstanceOf(SystemError);
  });
});
