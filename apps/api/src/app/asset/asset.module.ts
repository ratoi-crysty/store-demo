import { Module } from '@nestjs/common';
import { AssetService } from './service/asset.service';

@Module({
  providers: [AssetService],
})
export class AssetModule {}
