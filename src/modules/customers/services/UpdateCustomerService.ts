import { injectable, inject } from 'tsyringe';

import SystemError from '@global/errors/SystemError';
import ICustomersRepository from '@modules/customers/infra/repository/ICustomerRepository';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';

interface IRequest {
  id: string;
  name: string;
  email: string;
  cpf: string;
  birthDate: Date;
  address: {
    street: string;
    neighbourhood: string;
    city: string;
    state: string;
    country: string;
    zipcode: number;
    number: number;
  };
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(data: IRequest): Promise<Customer> {
    const { id, name, email, cpf, birthDate, address } = data;

    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new SystemError('Customer does not exists.');
    }

    const checkCustomerEmail = await this.customersRepository.findByEmail(
      email,
    );

    if (checkCustomerEmail && checkCustomerEmail.id !== id) {
      throw new SystemError('Email address is not available.');
    }

    const checkCustomerCPF = await this.customersRepository.findByCPF(cpf);

    if (checkCustomerCPF && checkCustomerCPF.id !== id) {
      throw new SystemError('CPF is not available.');
    }

    Object.assign(customer, { name, email, cpf, birthDate, address });

    return this.customersRepository.save(customer);
  }
}

export default CreateCustomerService;
