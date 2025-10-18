import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Grade } from './entities/grade.entity';

@Module({
  controllers: [StudentController],
  imports: [TypeOrmModule.forFeature([Student, Grade])],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
