import { Test, TestingModule } from '@nestjs/testing';
import { RoleServiceService } from './role.service';

describe('RoleServiceService', () => {
  let service: RoleServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleServiceService],
    }).compile();

    service = module.get<RoleServiceService>(RoleServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
