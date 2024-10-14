import { Test, TestingModule } from '@nestjs/testing';
import { IspController } from './isp.controller';

describe('IspController', () => {
  let controller: IspController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IspController],
    }).compile();

    controller = module.get<IspController>(IspController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
