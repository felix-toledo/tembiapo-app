import { Test, TestingModule } from '@nestjs/testing';
import { RoleServiceService } from './role.service';

describe('RoleServiceService', () => {
  let service: RoleServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleServiceService],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    service = module.get<RoleServiceService>(RoleServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
