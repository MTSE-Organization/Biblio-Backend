import { SetMetadata } from '@nestjs/common';

export const PCODE_KEY = 'pcode';
export const PCode = (pcode: string) => SetMetadata(PCODE_KEY, pcode);
