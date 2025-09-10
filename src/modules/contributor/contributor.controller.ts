import { Controller } from '@nestjs/common';
import { ContributorService } from './contributor.service';

@Controller('contributor')
export class ContributorController {
  constructor(private readonly contributorService: ContributorService) {}
}
