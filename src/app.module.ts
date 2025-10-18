import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +!process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, // solo en ambientes bajos, en produccion se debe hacer migraciones
    }),
    StudentModule,
    SeedModule,
    AuthModule,
    //SeedModule,
    //AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
