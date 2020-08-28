import SystemError from '@global/errors/SystemError';

import FakeCustomersRepository from '../infra/repository/fakes/FakeCustomerRepository';
import DeleteCustomerService from './DeleteCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let deleteCustomerService: DeleteCustomerService;

describe('Delete Customer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();

    deleteCustomerService = new DeleteCustomerService(fakeCustomersRepository);
  });

  it('should be able to delete a customer', async () => {
    const customer = await fakeCustomersRepository.create({
      birthDate: new Date(1994, 0, 3),
      cpf: '12826691686',
      email: 'junior@teste.com.br',
      name: 'Marcio Junior',
      address: {
        city: 'Belo Horizonte',
        country: 'Brasil',
        neighbourhood: 'Gutierrez',
        state: 'MG',
        street: 'Estacio de Sa',
        number: 147,
        zipcode: 30441042,
      },
    });

    expect(deleteCustomerService.execute(customer.id)).toBeTruthy();

    const customerList = await fakeCustomersRepository.list();

    expect(customerList.length).toEqual(0);
  });

  it('should not be able to delete an invalid customer', async () => {
    await expect(
      deleteCustomerService.execute('fake-id'),
    ).rejects.toBeInstanceOf(SystemError);
  });
});
