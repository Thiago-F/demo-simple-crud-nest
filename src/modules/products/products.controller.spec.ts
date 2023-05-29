import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UserEntity } from '../../data/entities/user.entity';
import { makeFakeUser } from '../../../test/factories'

// const makeFakeUser = (): UserEntity => ({
//   id: 1,
//   name: 'any_name',
//   email: 'any_email@mail.com'
// } as UserEntity)

describe('ProductsController', () => {
  let sut: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
            listAll: jest.fn(), 
          }
        }
      ],
    }).compile(); 

    sut = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('should call service with correct values', async () => {
      const createSpy = jest.spyOn(productsService, 'create')
      const user = makeFakeUser()

      await sut.create(
        {
          name: 'any_name',
          valueInCents: 10000,
          categoryId: 1
        },
        {
          user
        }
      )

      expect(createSpy).toHaveBeenCalledWith({
        data: {
          name: 'any_name',
          valueInCents: 10000,
          categoryId: 1
        },
        user
      })
    });
  });

  describe('list', () => {
    it('should call service with correct values', async () => {
      const listSpy = jest.spyOn(productsService, 'listAll')
      const user = makeFakeUser()

      await sut.list({}, { user })

      expect(listSpy).toHaveBeenCalledWith({
        filters: {},
        user
      })
    });

    it('should call service with correct values and filters', async () => {
      const listSpy = jest.spyOn(productsService, 'listAll')
      const user = makeFakeUser()

      await sut.list({ name: 'any_name' }, { user })

      expect(listSpy).toHaveBeenCalledWith({
        filters: { name: 'any_name' },
        user
      })
    });
  });
});
