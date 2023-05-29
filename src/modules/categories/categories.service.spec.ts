import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from '../../data/repositories/category-repository';
import { UserEntity } from '../../data/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
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

describe('CategoriesService', () => {
  let sut: CategoriesService;
  let categoriesRepository: CategoriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: {
            findOne: jest.fn().mockResolvedValue(makeFakeCategory()),
            create: jest.fn().mockResolvedValue(makeFakeCategory()),
            findAll: jest.fn().mockResolvedValue([makeFakeCategory(), makeFakeCategory()]),
          }
        }
      ],
    }).compile();

    sut = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get<CategoriesRepository>(CategoriesRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('should throw if category already exists', async () => {
      const promise = sut.create({
        data: {
          name: 'any_name'
        },
        user: makeFakeUser()
      })

      await expect(promise).rejects.toThrowError(new UnauthorizedException('Category already exists'))
    });

    it('should return a category on success', async () => {
      jest.spyOn(categoriesRepository, 'findOne').mockResolvedValueOnce(null)

      const result = await sut.create({
        data: {
          name: 'any_name'
        },
        user: makeFakeUser()
      })

      expect(result).toEqual(makeFakeCategory())
    });
  });

  describe('findAll', () => {
    it('should call repository with correct values', async () => {
      const findAllSpy = jest.spyOn(categoriesRepository, 'findAll')

      await sut.findAll({
        filters: {
          name: 'any_name',
        },
        user: makeFakeUser()
      })

      expect(findAllSpy).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'any_name'
          },
          deletedAt: null
        }
      })
    });

    it('should return a list of entities on success', async () => {
      const result = await sut.findAll({
        filters: {
          name: 'any_name',
        },
        user: makeFakeUser()
      })

      expect(result).toEqual([makeFakeCategory(), makeFakeCategory()])
    });
  });

  describe('findOne', () => {
    it('should call repository with correct values', async () => {
      const findOneSpy = jest.spyOn(categoriesRepository, 'findOne')

      await sut.findOne({ id: 1 })

      expect(findOneSpy).toHaveBeenCalledWith({
        where: {
          id: 1,
          deletedAt: null
        }
      })
    });

    it('should return a entity on success', async () => {
      const result = await sut.findOne({ id: 1 })

      expect(result).toEqual(makeFakeCategory())
    });
  });
});
