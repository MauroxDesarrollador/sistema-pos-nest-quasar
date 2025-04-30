import { Test, TestingModule } from '@nestjs/testing';
import { jwtService } from './jwt.service';

describe('jwtService', () => {
  let service: jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [jwtService],
    }).compile();

    service = module.get<jwtService>(jwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign and verify a JWT token', () => {
    const payload = { userId: 1, username: 'example_user' };
    const token = service.sign(payload);
    const decodedPayload = service.verify(token);
    expect(decodedPayload).toEqual(payload);
  });
});