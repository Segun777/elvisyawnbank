# Elvis Yawn Bank — Backend Development Guide

## 📚 Introduction

This guide provides comprehensive patterns, templates, and best practices for developing NestJS modules in the Elvis Yawn Bank backend. Use this as a reference while implementing each feature module.

---

## 🏗️ Module Structure Pattern

Each feature module follows this standardized structure:

```
src/modules/{module-name}/
├── entities/
│   └── {entity-name}.entity.ts        # Database entity definition
├── dtos/
│   ├── create-{entity}.dto.ts         # Create input DTO
│   ├── update-{entity}.dto.ts         # Update input DTO
│   └── {entity}.response.dto.ts       # Response DTO
├── repositories/
│   └── {entity-name}.repository.ts    # Custom repository with queries
├── services/
│   └── {entity-name}.service.ts       # Business logic
├── controllers/
│   └── {entity-name}.controller.ts    # HTTP endpoints
├── guards/
│   └── {permission}.guard.ts          # Custom authorization (optional)
├── decorators/
│   └── {custom-decorator}.ts          # Custom decorators (optional)
├── filters/
│   └── {exception}.filter.ts          # Exception filters (optional)
└── {module-name}.module.ts            # Module definition
```

---

## 📋 Step-by-Step Module Creation

### Example: User Management Module

#### Step 1: Define the Entity

```typescript
// src/modules/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserDeviceEntity } from './user-device.entity';
import { UserLoginHistoryEntity } from './user-login-history.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

  @Column({ type: 'boolean', default: false })
  twoFaEnabled: boolean;

  @Column({ type: 'varchar', nullable: true, select: false })
  twoFaSecret?: string;

  @Column({ type: 'varchar', nullable: true })
  profileImageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserDeviceEntity, (device) => device.user, { cascade: true })
  devices: UserDeviceEntity[];

  @OneToMany(() => UserLoginHistoryEntity, (history) => history.user)
  loginHistory: UserLoginHistoryEntity[];
}
```

#### Step 2: Create DTOs

```typescript
// src/modules/users/dtos/create-user.dto.ts
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain uppercase, lowercase, number, and special character'
  })
  password: string;
}
```

```typescript
// src/modules/users/dtos/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}
```

```typescript
// src/modules/users/dtos/user.response.dto.ts
export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  twoFaEnabled: boolean;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Step 3: Create Custom Repository

```typescript
// src/modules/users/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({
      where: { email },
      select: ['id', 'email', 'firstName', 'lastName', 'status', 'password', 'twoFaSecret']
    });
  }

  async findActiveUsers(): Promise<UserEntity[]> {
    return this.find({
      where: { status: 'ACTIVE' },
      order: { createdAt: 'DESC' }
    });
  }

  async findWithLoginHistory(userId: string): Promise<UserEntity | null> {
    return this.findOne({
      where: { id: userId },
      relations: ['loginHistory']
    });
  }

  async findByIdWithDevices(userId: string): Promise<UserEntity | null> {
    return this.findOne({
      where: { id: userId },
      relations: ['devices']
    });
  }
}
```

#### Step 4: Create Service

```typescript
// src/modules/users/services/user.service.ts
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user.response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    const savedUser = await this.userRepository.save(user);
    return this.mapToResponseDto(savedUser);
  }

  async getUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.mapToResponseDto(user);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Hash password if provided
    if (updateUserDto.password) {
      updateUserDto['password'] = await bcrypt.hash(updateUserDto.password, 12);
    }

    const updatedUser = this.userRepository.merge(user, updateUserDto);
    await this.userRepository.save(updatedUser);

    return this.mapToResponseDto(updatedUser);
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async verifyPassword(user: UserEntity, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  private mapToResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      twoFaEnabled: user.twoFaEnabled,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
```

#### Step 5: Create Controller

```typescript
// src/modules/users/controllers/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  Pagination,
  BadRequestException
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.userService.getUserById(req.user.sub);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.sub, updateUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async deleteUser(@Param('id') userId: string) {
    // Implementation
  }
}
```

#### Step 6: Create Module

```typescript
// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDeviceEntity } from './entities/user-device.entity';
import { UserLoginHistoryEntity } from './entities/user-login-history.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserDeviceEntity, UserLoginHistoryEntity])],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService, UserRepository]
})
export class UsersModule {}
```

---

## 🔐 Security Patterns

### Authentication Guard

```typescript
// src/common/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### Authorization Guard with Roles

```typescript
// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
```

### Roles Decorator

```typescript
// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

---

## 🗄️ Database Migration Pattern

### Create Migration

```typescript
// src/database/migrations/1234567890000-CreateUsersTable.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1234567890000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true
          },
          {
            name: 'firstName',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'lastName',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'password',
            type: 'varchar'
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
            default: "'ACTIVE'"
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()'
          }
        ],
        indices: [
          {
            name: 'idx_users_email',
            columnNames: ['email']
          },
          {
            name: 'idx_users_status',
            columnNames: ['status']
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

---

## 🧪 Testing Pattern

### Unit Test Example

```typescript
// src/modules/users/services/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Test@1234'
      };

      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(createUserDto as any);
      jest.spyOn(repository, 'save').mockResolvedValue({ id: 'uuid', ...createUserDto } as any);

      const result = await service.createUser(createUserDto);
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw ConflictException if user exists', async () => {
      const createUserDto = {
        email: 'existing@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Test@1234'
      };

      jest.spyOn(repository, 'findByEmail').mockResolvedValue({} as any);

      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });
  });
});
```

---

## 📊 Pagination & Filtering Pattern

### Generic Pagination DTO

```typescript
// src/common/dtos/pagination.dto.ts
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  search?: string;
}
```

### Generic Response DTO

```typescript
// src/common/dtos/paginated.response.dto.ts
export class PaginatedResponseDto<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Service with Pagination

```typescript
async findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<UserResponseDto>> {
  const { page, limit, sortBy, sortOrder } = paginationDto;
  const skip = (page - 1) * limit;

  const [data, total] = await this.userRepository.findAndCount({
    skip,
    take: limit,
    order: { [sortBy]: sortOrder }
  });

  return {
    data: data.map(user => this.mapToResponseDto(user)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

---

## 🔍 Error Handling Pattern

### Custom Exception Filter

```typescript
// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HttpException');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    this.logger.error(`[${status}] ${exception.message}`);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      ...(typeof exceptionResponse === 'object' && exceptionResponse)
    });
  }
}
```

---

## 💾 Database Connection Pool Configuration

```typescript
// src/database/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'elvisyawnbank',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  pool: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  },
  extra: {
    statement_timeout: 30000
  }
};
```

---

## ✅ Best Practices Checklist

- [ ] **Entity Definition**
  - [ ] Use UUIDs for primary keys
  - [ ] Include timestamps (createdAt, updatedAt)
  - [ ] Define proper relationships
  - [ ] Use enums for status fields

- [ ] **DTO Validation**
  - [ ] Use class-validator decorators
  - [ ] Create separate DTOs for create/update/response
  - [ ] Never expose sensitive fields in response DTOs
  - [ ] Validate on API boundaries

- [ ] **Repository Queries**
  - [ ] Use custom repository methods for complex queries
  - [ ] Always select specific fields (avoid SELECT *)
  - [ ] Use indexes for frequently queried columns
  - [ ] Implement pagination for large result sets

- [ ] **Service Layer**
  - [ ] Keep business logic in services
  - [ ] Don't expose database details to controllers
  - [ ] Validate input and throw appropriate exceptions
  - [ ] Use dependency injection

- [ ] **Controller Layer**
  - [ ] Keep controllers thin (delegate to services)
  - [ ] Apply guards and decorators consistently
  - [ ] Return consistent response formats
  - [ ] Use appropriate HTTP status codes

- [ ] **Security**
  - [ ] Hash passwords using bcrypt
  - [ ] Never log sensitive data
  - [ ] Implement RBAC guards
  - [ ] Validate and sanitize inputs
  - [ ] Use JWT for authentication

- [ ] **Error Handling**
  - [ ] Use appropriate HTTP exceptions
  - [ ] Include meaningful error messages
  - [ ] Log errors for debugging
  - [ ] Don't expose internal details

- [ ] **Testing**
  - [ ] Write unit tests for services
  - [ ] Mock repositories in tests
  - [ ] Test happy path and error cases
  - [ ] Aim for 80%+ coverage

- [ ] **Performance**
  - [ ] Use database indexes
  - [ ] Implement pagination
  - [ ] Cache frequently accessed data
  - [ ] Use connection pooling
  - [ ] Monitor query performance

- [ ] **Documentation**
  - [ ] Add JSDoc comments to public methods
  - [ ] Document complex business logic
  - [ ] Keep README.md updated
  - [ ] Include example usage

---

## 📖 Common Module Development Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Planning | 1 day | Design entities, DTOs, API endpoints |
| Database | 1-2 days | Create entities, migrations, indices |
| Repository | 1 day | Implement custom queries |
| Service | 2 days | Implement business logic, validation |
| Controller | 1 day | Implement endpoints, guards |
| Testing | 2 days | Unit tests, integration tests |
| Review | 1 day | Code review, optimization |

---

**Next Steps:**
1. Review this guide
2. Use templates as starting points
3. Follow the patterns consistently
4. Test thoroughly before merging
5. Update this guide with lessons learned

**Happy coding! 🚀**

