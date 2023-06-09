import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductRepository } from '../../data/repositories/product-repository';
import { CategoriesRepository } from '../../data/repositories/category-repository';
import { UserEntity } from '../../data/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

import { makeFakeUser, makeFakeProduct, makeFakeCategory } from '../../../test/factories'

const expectedCreateProduct = makeFakeProduct()
const expectedFindAllProduct = [makeFakeProduct(), makeFakeProduct()]

const expectedFindOneCategory = makeFakeCategory()

describe('ProductsService', () => {
  let sut: ProductsService;
  let productRepository: ProductRepository;
  let categoriesRepository: CategoriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(expectedCreateProduct),
            findAll: jest.fn().mockResolvedValue(expectedFindAllProduct),
          }
        },
        {
          provide: CategoriesRepository,
          useValue: {
            findOne: jest.fn().mockResolvedValue(expectedFindOneCategory)
          }
        }
      ],
    }).compile();

    sut = module.get<ProductsService>(ProductsService);
    productRepository = module.get<ProductRepository>(ProductRepository);
    categoriesRepository = module.get<CategoriesRepository>(CategoriesRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('should throw if category was not found', async () => {
      jest.spyOn(categoriesRepository, 'findOne').mockResolvedValueOnce(null)

      const promise = sut.create({
        data: {
          name: 'any_name',
          valueInCents: 10000,
          categoryId: 1
        }, 
        user: makeFakeUser()
      })

      await expect(promise).rejects.toThrowError(new NotFoundException('Category was not found'))
    });

    it('should call repository with correct values', async () => {
      const createSpy = jest.spyOn(productRepository, 'create')
      const user = makeFakeUser()

      await sut.create({
        data: {
          name: 'any_name',
          valueInCents: 10000,
          categoryId: 1
        },
        user
      })

      expect(createSpy).toHaveBeenCalledWith({
        name: 'any_name',
        valueInCents: 10000,
        categoryId: 1,
        createdBy: user.id
      })
    });

    it('should return a product entity on success', async () => {
      const result = await sut.create({
        data: {
          name: 'any_name',
          valueInCents: 10000,
          categoryId: 1
        },
        user: makeFakeUser()
      })

      expect(result).toEqual(expectedCreateProduct)
    });
  }); 

  describe('listAll', () => {
    it('should call repository with filters', async () => {
      const findAllSpy = jest.spyOn(productRepository, 'findAll')

      await sut.listAll({
        filters: { name: 'any_name', categoryId: '3' },
        user: makeFakeUser()
      })

      expect(findAllSpy).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          name: {
            in: 'any_name'
          },
          categoryId: 3
        }
      })
    }); 

    it('should call repository without filters', async () => {
      const findAllSpy = jest.spyOn(productRepository, 'findAll')

      await sut.listAll({
        filters: {},
        user: makeFakeUser()
      })

      expect(findAllSpy).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        }
      })
    });
  });
});
