import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TemplatesModule } from './templates/templates.module';
import { FormsModule } from './forms/forms.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AouthModule } from './aouth/aouth.module';
import { AuthModule } from './auth/auth.module';
import { TemplatesService } from './templates/templates.service';
import { TemplatesController } from './templates/templates.controller';
import { TemplatesModule } from './templates/templates.module';
import { FormsService } from './forms/forms.service';
import { FormsController } from './forms/forms.controller';
import { FormsModule } from './forms/forms.module';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';
import { CommentsModule } from './comments/comments.module';
import { LikesService } from './likes/likes.service';
import { LikesController } from './likes/likes.controller';
import { LikesModule } from './likes/likes.module';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TemplatesModule,
    FormsModule,
    CommentsModule,
    LikesModule,
    AdminModule,
    AouthModule,
  ],
  controllers: [AppController, AuthController, TemplatesController, FormsController, CommentsController, LikesController, AdminController],
  providers: [AppService, AuthService, TemplatesService, FormsService, CommentsService, LikesService, AdminService],
})
export class AppModule {}
