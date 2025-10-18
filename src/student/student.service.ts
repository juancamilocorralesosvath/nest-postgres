import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { Student } from './entities/student.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { PaginationDto } from './dto/pagination.dto';
import { isUUID } from 'class-validator';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  // no le veo mucha utilidad a esto
  private logger = new Logger('StudentService');

  constructor(
    // como funciona este injectrepository?
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      const { grades = [], ...studentDetails } = createStudentDto;
      const student = this.studentRepository.create({
        ...studentDetails,
        grade: grades.map((grade) => this.gradeRepository.create(grade)),
      });
      await this.studentRepository.save(student);
      return student;
    } catch (error) {
      console.log('🚀 ~ StudentService ~ create ~ error:', error);
      this.handleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit, offset } = paginationDto;
      return await this.studentRepository.find({
        take: limit,
        skip: offset,
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  async findOne(term: string) {
    let student: Student | null;

    if (isUUID(term)) {
      student = await this.studentRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.studentRepository.createQueryBuilder('student');
      student = await queryBuilder
        .where('UPPER(name)=:name or nickname=:nickname', {
          name: term.toUpperCase(),
          nickname: term.toLowerCase(),
        })
        .leftJoinAndSelect('student.grade', 'studentGrades')
        .getOne();
    }
    if (!student) throw new NotFoundException(`Student ${term} not found`);

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const { grades, ...studentDetails } = updateStudentDto;

    const student = await this.studentRepository.preload({
      id: id,
      ...studentDetails,
    });

    if (!student)
      throw new NotFoundException(`Student with id ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (grades) {
        await queryRunner.manager.delete(Grade, { student: { id } });
        student.grade = grades.map((grade) =>
          this.gradeRepository.create(grade),
        );
      }
      await queryRunner.manager.save(student);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }

  deleteAllStudents() {
    const query = this.studentRepository.createQueryBuilder();
    try {
      return query.delete().where({}).execute();
    } catch (error) {
      this.handleException(error);
    }
  }
  private handleException(error) {
    this.logger.error(error);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.detail);
    }
  }
}
