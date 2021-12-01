import { Injectable } from '@nestjs/common';
import 'multer';

@Injectable()
export class AssetService {
  uploadFile(file: Express.Multer.File) {
    file.path
  }
}
