import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { StudentModule } from 'src/student/student.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [StudentModule],
})
export class SeedModule {}
