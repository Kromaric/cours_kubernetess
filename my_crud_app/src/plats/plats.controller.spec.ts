import { Test, TestingModule } from '@nestjs/testing';
import { PlatsController } from './plats.controller';
import { PlatsService } from './plats.service';
import { Plat } from '../entities/plat.entity';

describe('PlatsController', () => {
  let controller: PlatsController;
  let service: PlatsService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatsController],
      providers: [
        {
          provide: PlatsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PlatsController>(PlatsController);
    service = module.get<PlatsService>(PlatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of plats', async () => {
      const plats: Plat[] = [
        {
          id: 1,
          nom: 'Pizza',
          prix: 12.5,
          description: 'Délicieuse',
          allergenes: ['lactose'],
          vegetarien: false,
          commandes: [],
        },
      ];

      mockService.findAll.mockResolvedValue(plats);

      const result = await controller.findAll();

      expect(result).toEqual(plats);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a plat by id', async () => {
      const plat: Plat = {
        id: 1,
        nom: 'Pizza',
        prix: 12.5,
        description: 'Bonne',
        allergenes: ['lactose'],
        vegetarien: false,
        commandes: [],
      };

      mockService.findOne.mockResolvedValue(plat);

      const result = await controller.findOne('1');

      expect(result).toEqual(plat);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a plat', async () => {
      const newPlat = {
        nom: 'Salade',
        prix: 8,
        description: 'Fraîche',
        allergenes: ['gluten'],
        vegetarien: true,
      };

      const savedPlat: Plat = { id: 1, ...newPlat, commandes: [] };

      mockService.create.mockResolvedValue(savedPlat);

      const result = await controller.create(newPlat);

      expect(result).toEqual(savedPlat);
      expect(mockService.create).toHaveBeenCalledWith(
        newPlat.nom,
        newPlat.prix,
        newPlat.description,
        newPlat.allergenes,
        newPlat.vegetarien,
      );
    });
  });

  describe('update', () => {
    it('should update a plat', async () => {
      const updatedPlat: Plat = {
        id: 1,
        nom: 'Pizza XL',
        prix: 15,
        description: 'Délicieuse',
        allergenes: ['lactose'],
        vegetarien: false,
        commandes: [],
      };

      mockService.update.mockResolvedValue(updatedPlat);

      const result = await controller.update('1', {
        nom: 'Pizza XL',
        prix: 15,
      });

      expect(result).toEqual(updatedPlat);
      expect(mockService.update).toHaveBeenCalledWith(
        1,
        'Pizza XL',
        15,
        undefined,
        undefined,
        undefined,
      );
    });
  });

  describe('remove', () => {
    it('should remove a plat', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(result).toEqual({ message: 'Plat #1 supprimé' });
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });
  });
});
