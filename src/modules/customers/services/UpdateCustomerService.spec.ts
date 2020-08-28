import SystemError from '@global/errors/SystemError';

import FakeCustomersRepository from '../infra/repository/fakes/FakeCustomerRepository';
import UpdateCustomerService from './UpdateCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let updateCustomerService: UpdateCustomerService;

describe('Update Customer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();

    updateCustomerService = new UpdateCustomerService(fakeCustomersRepository);
  });

  it('should be able to update a customer', async () => {
    const newCustomer = {
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
    };

    const customer = await fakeCustomersRepository.create(newCustomer);
    customer.name = 'Marcio Danilo Costa Junior';
    customer.email = 'marcio@teste.com.br';

    const updatedCustomer = await updateCustomerService.execute(customer);

    expect(updatedCustomer).toHaveProperty('id');
    expect(updatedCustomer.name).toBe('Marcio Danilo Costa Junior');
    expect(updatedCustomer.email).toBe('marcio@teste.com.br');
    expect(updatedCustomer.cpf).toBe('12826691686');
    expect(updatedCustomer.birthDate).toBeInstanceOf(Date);
  });

  it('should not be able to update invalid customer', async () => {
    await expect(
      updateCustomerService.execute({
        id: 'invalid-id',
        birthDate: new Date(1994, 0, 3),
        cpf: '12826691687',
        email: 'marcio@teste.com.br',
        name: 'Marcio Costa',
        address: {
          city: 'Belo Horizonte',
          country: 'Brasil',
          neighbourhood: 'Gutierrez',
          state: 'MG',
          street: 'Estacio de Sa',
          number: 147,
          zipcode: 30441042,
        },
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to update customer with existing email', async () => {
    await fakeCustomersRepository.create({
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

    const customer = await fakeCustomersRepository.create({
      birthDate: new Date(1994, 0, 3),
      cpf: '12826691687',
      email: 'marcio@teste.com.br',
      name: 'Marcio Costa',
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

    customer.name = 'Marcio Junior';
    customer.email = 'junior@teste.com.br';

    await expect(
      updateCustomerService.execute(customer),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to update customer with existing cpf', async () => {
    await fakeCustomersRepository.create({
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

    const customer = await fakeCustomersRepository.create({
      birthDate: new Date(1994, 0, 3),
      cpf: '12826691687',
      email: 'marcio@teste.com.br',
      name: 'Marcio Costa',
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

    customer.name = 'Marcio Junior';
    customer.cpf = '12826691686';

    await expect(
      updateCustomerService.execute(customer),
    ).rejects.toBeInstanceOf(SystemError);
  });
});
