import SystemError from '@global/errors/SystemError';

import FakeCustomersRepository from '../infra/repository/fakes/FakeCustomerRepository';
import CreateCustomerService from './CreateCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomerService: CreateCustomerService;

describe('Create Customer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();

    createCustomerService = new CreateCustomerService(fakeCustomersRepository);
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomerService.execute({
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

    expect(customer).toHaveProperty('id');
    expect(customer.name).toBe('Marcio Junior');
    expect(customer.email).toBe('junior@teste.com.br');
    expect(customer.cpf).toBe('12826691686');
    expect(customer.birthDate).toBeInstanceOf(Date);
  });

  it('should not be able to create two customers with same email', async () => {
    await createCustomerService.execute({
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

    await expect(
      createCustomerService.execute({
        birthDate: new Date(1994, 0, 3),
        cpf: '12826691687',
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
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to create two customers with same cpf', async () => {
    await createCustomerService.execute({
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

    await expect(
      createCustomerService.execute({
        birthDate: new Date(1994, 0, 3),
        cpf: '12826691686',
        email: 'marcio@teste.com.br',
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
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });
});
