import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { Product } from '../../entities/product.entity';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-product')
  generateProduct(
    @Body() body: { name: string; category?: string },
  ): Promise<Partial<Product>> {
    return this.aiService.generateProduct(body.name, body.category || '');
  }
}
