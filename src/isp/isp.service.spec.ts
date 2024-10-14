import { Test, TestingModule } from '@nestjs/testing';
import { IspService } from './isp.service';

describe('IspService', () => {
  let service: IspService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IspService],
    }).compile();

    service = module.get<IspService>(IspService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
