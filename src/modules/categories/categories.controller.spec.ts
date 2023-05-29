import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { UserEntity } from '../../data/entities/user.entity';
import { CategoryEntity } from '../../data/entities/category.entity';

const makeFakeUser = (): UserEntity => ({
  id: 1,
  name: 'any_name',
  email: 'any_email@mail.com'
} as UserEntity)

const makeFakeCategory = (): CategoryEntity => ({
  id: 1,
  name: 'any_name'
} as CategoryEntity)

describe('CategoriesController', () => {
  let sut: CategoriesController;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            create: jest.fn().mockResolvedValue(makeFakeCategory()),
            findAll: jest.fn().mockResolvedValue([makeFakeCategory(), makeFakeCategory()]),
            findOne: jest.fn().mockResolvedValue(makeFakeCategory()),
          }
        },
      ],
    }).compile(); 

    sut = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('should call service with correct values', async () => {
      const createSpy = jest.spyOn(categoriesService, 'create')

      await sut.create(
        {
          name: 'any_name'
        },
        {
          user: makeFakeUser()
        }
      )

      expect(createSpy).toHaveBeenCalledWith({
        data: {
          name: 'any_name'
        },
        user: makeFakeUser()
      })
    });

    it('should return a category entity on success', async () => {
      const result = await sut.create(
        {
          name: 'any_name'
        },
        {
          user: makeFakeUser()
        }
      )

      expect(result).toEqual(makeFakeCategory())
    });
  });

  describe('findAll', () => {
    it('should call service with correct values', async () => {
      const findAllSpy = jest.spyOn(categoriesService, 'findAll')

      await sut.findAll({ name: 'any_name' }, { user: makeFakeUser() })

      expect(findAllSpy).toHaveBeenCalledWith({
        filters: {
          name: 'any_name'
        },
        user: makeFakeUser()
      })
    });

    it('should return a list of category entities on success', async () => {
      const response = await sut.findAll({ name: 'any_name' }, { user: makeFakeUser() })

      expect(response).toEqual([makeFakeCategory(), makeFakeCategory()])
    });
  });

  describe('findOne', () => {
    it('should call service with correct values', async () => {
      const findOneSpy = jest.spyOn(categoriesService, 'findOne')

      await sut.findOne('1')

      expect(findOneSpy).toHaveBeenCalledWith({
        id: Number('1')
      })
    });

    it('should return a category entity on success', async () => {
      const response = await sut.findOne('1')

      expect(response).toEqual(makeFakeCategory())
    });
  });
});
