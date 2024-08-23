import { Module } from '@nestjs/common';
import { InterceptorsModule } from './interceptors/interceptors.module';

@Module({
  imports: [InterceptorsModule],
  exports: [InterceptorsModule]
})
export class CommonModule {}
