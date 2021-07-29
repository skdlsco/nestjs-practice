import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { exception } from 'console';
import { User } from './user.entity';
import { UserService } from './user.service';

class MockRepository {
  private users: User[];

  async findOne(id: number) {
    return this.users.find((u) => {
      u.id == id;
    });
  }

  async find() {
    return this.users;
  }

  async insert(user: User) {
    if (this.findOne(user.id)) throw exception();
    return this.users.push(user);
  }

  async save(user: User) {
    const idx = this.users.findIndex((u) => {
      u.id == user.id;
    });
    if (idx < 0) throw exception();
    this.users[idx] = user;
    return true;
  }
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: MockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
