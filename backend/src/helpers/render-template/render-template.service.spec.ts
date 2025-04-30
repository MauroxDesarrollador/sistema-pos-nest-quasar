import { Test, TestingModule } from '@nestjs/testing';
import { RenderTemplateService } from './render-template.service';

describe('RenderTemplateService', () => {
  let service: RenderTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RenderTemplateService],
    }).compile();

    service = module.get<RenderTemplateService>(RenderTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
