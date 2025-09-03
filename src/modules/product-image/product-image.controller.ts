import { Controller } from '@nestjs/common';
import { ProductImageService } from './product-image.service';

@Controller('product-image')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}
}
