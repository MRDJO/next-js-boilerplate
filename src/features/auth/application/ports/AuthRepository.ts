import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email";
import { UserId } from "../../domain/value-objects/UserId";

export interface AuthRepository{
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
  emailExists(email: Email): Promise<boolean>;
}