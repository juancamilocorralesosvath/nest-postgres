import { Injectable } from '@nestjs/common';
import { StudentService } from 'src/student/student.service';
import { initialData } from './data/seed-student.data';
import { Student } from 'src/student/entities/student.entity';

@Injectable()
export class SeedService {
  // podemos usar este student service dado que lo exportamos en el modulo student cierto?
  constructor(private readonly studentService: StudentService) {}

  async runSeed() {
    await this.insertNewStudents();
    return 'SEED EXECUTED';
  }

  async insertNewStudents() {
    await this.studentService.deleteAllStudents();
    const students = initialData.students;

    const insertPromises: Promise<Student | undefined>[] = [];

    students.forEach((student) => {
      insertPromises.push(this.studentService.create(student));
    });

    await Promise.all(insertPromises);
    return true;
  }
}
