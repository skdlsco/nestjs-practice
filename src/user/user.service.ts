import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, getManager, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createUser(user: User) {
    return this.userRepository.insert(user);
  }

  getAllUser() {
    return this.userRepository.find({ relations: ['friends'] });
  }

  getUserById(id: number) {
    return this.userRepository.findOne(id, { relations: ['friends'] });
  }

  updateUser(user: User) {
    return this.userRepository.save(user);
  }

  deleteUser(user: User) {
    return this.userRepository.delete(user);
  }

  async createFriend(me: User, friendId: number) {
    const friend: User = await this.getUserById(friendId);
    if (me.friends.find((u) => u.id == friend.id)) return;
    me.friends.push(friend);
    friend.friends.push(me);
    return await getManager()
      .transaction(async (transactionEntityManager) => {
        await transactionEntityManager.save(me);
        await transactionEntityManager.save(friend);
      })
      .catch((err) => {
        throw err;
      });
  }

  async deleteFriend(me: User, friendId: number) {
    const friend: User = await this.getUserById(friendId);
    if (me.friends.every((u) => u.id != friend.id)) return;
    me.friends = me.friends.filter((u) => u.id != friend.id);
    friend.friends = friend.friends.filter((u) => u.id != me.id);
    return await getManager()
      .transaction(async (transactionEntityManager: EntityManager) => {
        await transactionEntityManager.save(me);
        await transactionEntityManager.save(friend);
      })
      .catch((err) => {
        throw err;
      });
  }
}
