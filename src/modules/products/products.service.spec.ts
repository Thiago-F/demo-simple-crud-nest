import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductRepository } from '../../data/repositories/product-repository';
import { CategoriesRepository } from '../../data/repositories/category-repository';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductRepository,
          useValue: {
            create: jest.fn()
          }
        },
        {
          provide: CategoriesRepository,
          useValue: {
            findOne: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
