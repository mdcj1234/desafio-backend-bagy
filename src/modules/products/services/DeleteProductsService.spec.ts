import SystemError from '@global/errors/SystemError';

import FakeProductsRepository from '../infra/repository/fakes/FakeProductsRepository';
import DeleteProductService from './DeleteProductService';

let fakeProductsRepository: FakeProductsRepository;
let deleteProductService: DeleteProductService;

describe('Delete Product', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();

    deleteProductService = new DeleteProductService(fakeProductsRepository);
  });

  it('should be able to delete a product', async () => {
    const product = await fakeProductsRepository.create({
      name: 'Chaveiro',
      image_url: 'fake_url',
      description: 'Descrição chaveiro',
      price: 1.1,
      stock: 10,
      weight: 0.05,
    });

    expect(deleteProductService.execute(product.id)).toBeTruthy();

    const productList = await fakeProductsRepository.list();

    expect(productList.length).toEqual(0);
  });

  it('should not be able to delete an invalid product', async () => {
    await expect(
      deleteProductService.execute('fake-id'),
    ).rejects.toBeInstanceOf(SystemError);
  });
});
