import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { makeFakeUser, makeFakeCategory } from '../../../test/factories'

const createCategoryReturn = makeFakeCategory()
const findAllCategoryReturn = [makeFakeCategory(), makeFakeCategory()]
const findOneCategoryReturn = makeFakeCategory()

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
            create: jest.fn().mockResolvedValue(createCategoryReturn),
            findAll: jest.fn().mockResolvedValue(findAllCategoryReturn),
            findOne: jest.fn().mockResolvedValue(findOneCategoryReturn),
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
      const user = makeFakeUser()

      await sut.create(
        {
          name: 'any_name'
        },
        {
          user
        }
      )

      expect(createSpy).toHaveBeenCalledWith({
        data: {
          name: 'any_name'
        },
        user
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

      expect(result).toEqual(createCategoryReturn)
    });
  });

  describe('findAll', () => {
    it('should call service with correct values', async () => {
      const findAllSpy = jest.spyOn(categoriesService, 'findAll')
      const user = makeFakeUser()

      await sut.findAll({ name: 'any_name' }, { user })

      expect(findAllSpy).toHaveBeenCalledWith({
        filters: {
          name: 'any_name'
        },
        user
      })
    });

    it('should return a list of category entities on success', async () => {
      const response = await sut.findAll({ name: 'any_name' }, { user: makeFakeUser() })

      expect(response).toEqual(findAllCategoryReturn)
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

      expect(response).toEqual(findOneCategoryReturn)
    });
  });
});
