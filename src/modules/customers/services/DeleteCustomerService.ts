import { injectable, inject } from 'tsyringe';

import SystemError from '@global/errors/SystemError';
import ICustomersRepository from '@modules/customers/infra/repository/ICustomerRepository';

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(id: string): Promise<boolean> {
    const checkCustomerExists = await this.customersRepository.findById(id);

    if (!checkCustomerExists) {
      throw new SystemError('Customer does not exists.');
    }

    const result = await this.customersRepository.delete(id);

    return result;
  }
}

export default DeleteCustomerService;
