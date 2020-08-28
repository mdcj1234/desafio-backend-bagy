import SystemError from '@global/errors/SystemError';

import FakeStorageProvider from '@global/container/providers/Storage/fakes/FakeStorageProvider';
import FakeProductsRepository from '../infra/repository/fakes/FakeProductsRepository';
import UpdateProductImageService from './UpdateProductImageService';

let fakeStorageProvider: FakeStorageProvider;
let fakeProductsRepository: FakeProductsRepository;
let udateProductImageService: UpdateProductImageService;

describe('Update Product Image', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeProductsRepository = new FakeProductsRepository();

    udateProductImageService = new UpdateProductImageService(
      fakeProductsRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update a product image', async () => {
    const newProduct = await fakeProductsRepository.create({
      name: 'Chaveiro',
      image_url: 'fake_url',
      description: 'Descrição chaveiro',
      price: 1.1,
      stock: 10,
      weight: 0.05,
    });

    const product = await udateProductImageService.execute({
      id: newProduct.id,
      imageFileName: 'fake_url2',
    });

    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Chaveiro');
    expect(product.image_url).toBe('fake_url2');
    expect(product.description).toBe('Descrição chaveiro');
    expect(product.price).toBe(1.1);
    expect(product.stock).toBe(10);
    expect(product.weight).toBe(0.05);
  });

  it('should not be able to update image of invalid product', async () => {
    const product = {
      id: 'fake-id',
      name: 'Lapis',
      image_url: 'fake_url',
      description: 'Descrição lapis',
      price: 1.9,
      stock: 15,
      weight: 0.15,
    };

    await expect(
      udateProductImageService.execute({
        id: product.id,
        imageFileName: 'fake_url2',
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });
});
