import { Module } from '@nestjs/common';
import { ConfigrationService } from './configration.service';

@Module({
  providers: [ConfigrationService],
  exports:[ConfigrationService]
})
export class ConfigrationModule {}
