import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCustomers1598298952488
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          {
            name: 'id',
            type: 'varchar(100)',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar(100)',
          },
          {
            name: 'email',
            isUnique: true,
            type: 'varchar(100)',
          },
          {
            name: 'cpf',
            isUnique: true,
            type: 'varchar(11)',
          },
          {
            name: 'birthDate',
            type: 'date',
          },
          {
            name: 'addressStreet',
            type: 'varchar(100)',
            isNullable: true,
          },
          {
            name: 'addressNeighbourhood',
            type: 'varchar(100)',
            isNullable: true,
          },
          {
            name: 'addressCity',
            type: 'varchar(100)',
            isNullable: true,
          },
          {
            name: 'addressState',
            type: 'varchar(3)',
            isNullable: true,
          },
          {
            name: 'addressCountry',
            type: 'varchar(20)',
            isNullable: true,
          },
          {
            name: 'addressZipcode',
            type: 'decimal(10,0)',
            isNullable: true,
          },
          {
            name: 'addressNumber',
            type: 'decimal(10,0)',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('customers');
  }
}
