import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Student } from './entities/student.entity';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiResponse({status: 201, description: "student was created", type: Student})
  @ApiResponse({status: 400, description: 'bad request'})
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.studentService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.studentService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
