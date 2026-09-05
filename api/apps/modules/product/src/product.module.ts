import { Module } from '@nestjs/common';
import PrismaModule from '@share/libs/prisma/prisma.module';
import ProductController from './product.controller';
import ProductService from './product.service';
import ShareModule from '@share/share.module';

@Module({
  imports: [ShareModule, PrismaModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export default class ProductModule {}
