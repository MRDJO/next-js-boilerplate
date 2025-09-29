# Migration vers Architecture Hexagonale - Next.js

## 📋 Vue d'ensemble

Ce guide détaille la migration complète de votre architecture Next.js actuelle vers une architecture hexagonale respectant les principes de Clean Architecture et TDD.

## 🎯 Objectifs de la migration

- ✅ Séparer clairement les couches métier, application et infrastructure
- ✅ Rendre le code testable et maintenable
- ✅ Éliminer les couplages forts entre les couches
- ✅ Implémenter une injection de dépendances propre
- ✅ Faciliter l'évolution et l'ajout de nouvelles features

## 🏗️ Structure cible

```
src/
├── app/                           # Next.js App Router (UI uniquement)
│   ├── (auth)/
│   ├── dashboard/
│   ├── api/
│   └── globals.css
├── features/                      # Features organisées par domaine
│   ├── auth/
│   │   ├── domain/               # 🟡 Logique métier pure
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   ├── aggregates/
│   │   │   └── events/
│   │   ├── application/          # 🔵 Cas d'usage et orchestration
│   │   │   ├── use-cases/
│   │   │   ├── commands/
│   │   │   ├── queries/
│   │   │   └── ports/           # Interfaces
│   │   ├── infrastructure/       # 🔴 Adaptateurs externes
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   └── api/
│   │   └── presentation/         # 🟢 Interface utilisateur
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── stores/
│   │       └── controllers/
│   └── [autres-features]/
├── shared/                       # Code partagé entre features
│   ├── domain/
│   ├── infrastructure/
│   └── presentation/
├── config/                       # Configuration et DI
│   ├── container.ts
│   ├── database.ts
│   └── env.ts
└── __tests__/                   # Tests organisés par type
    ├── unit/
    ├── integration/
    └── e2e/
```

## 🚀 Plan de migration (4 semaines)

### Phase 1: Restructuration initiale (Semaine 1)
**Objectif**: Casser l'architecture actuelle et créer les bases

#### Jour 1-2: Backup et restructuration des dossiers

1. **Créer un backup complet**
```bash
git checkout -b backup-before-migration
git push origin backup-before-migration
git checkout main
git checkout -b feature/hexagonal-architecture
```

2. **Restructurer brutalement les dossiers**
```bash
# Supprimer l'ancienne structure
rm -rf features/*/api
rm -rf features/*/hooks
rm -rf features/*/store
rm -rf features/*/*.models.ts
rm -rf features/*/*.repository.ts
rm -rf features/*/*.service.ts
rm -rf features/*/*.actions.ts

# Créer la nouvelle structure pour chaque feature
for feature in auth user distributors; do
  mkdir -p features/$feature/{domain/{entities,value-objects,aggregates,events},application/{use-cases,commands,queries,ports},infrastructure/{repositories,services,api},presentation/{components,hooks,stores,controllers}}
done
```

#### Jour 3-5: Migration de la feature `auth` (pilote)

**Étape 1: Créer les entités domain**
```typescript
// features/auth/domain/entities/User.ts
import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';

export class User {
  constructor(
    private readonly id: UserId,
    private email: Email,
    private password: Password,
    private readonly name: string,
    private readonly createdAt: Date
  ) {}

  public static create(email: string, password: string, name: string): User {
    return new User(
      UserId.generate(),
      new Email(email),
      new Password(password),
      name,
      new Date()
    );
  }

  public changeEmail(newEmail: string): void {
    this.email = new Email(newEmail);
  }

  public verifyPassword(plainPassword: string): boolean {
    return this.password.verify(plainPassword);
  }

  // Getters
  public getId(): UserId { return this.id; }
  public getEmail(): Email { return this.email; }
  public getName(): string { return this.name; }
}
```

**Étape 2: Créer les value objects**
```typescript
// features/auth/domain/value-objects/Email.ts
export class Email {
  constructor(private readonly value: string) {
    this.validate();
  }

  private validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new Error('Invalid email format');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

**Étape 3: Définir les ports (interfaces)**
```typescript
// features/auth/application/ports/AuthRepository.ts
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { UserId } from '../../domain/value-objects/UserId';

export interface AuthRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}

// features/auth/application/ports/TokenService.ts
export interface TokenService {
  generate(payload: any): Promise<string>;
  verify(token: string): Promise<any>;
  refresh(token: string): Promise<string>;
}
```

**Étape 4: Créer les use cases**
```typescript
// features/auth/application/use-cases/LoginUseCase.ts
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { AuthRepository } from '../ports/AuthRepository';
import { TokenService } from '../ports/TokenService';

export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const email = new Email(command.email);
    const user = await this.authRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.verifyPassword(command.password)) {
      throw new Error('Invalid password');
    }

    const token = await this.tokenService.generate({
      userId: user.getId().getValue(),
      email: user.getEmail().getValue()
    });

    return { user, token };
  }
}
```

### Phase 2: Infrastructure et présentation (Semaine 2)

#### Jour 1-3: Implémenter les adaptateurs infrastructure

**Repository implementation**
```typescript
// features/auth/infrastructure/repositories/ApiAuthRepository.ts
import { AuthRepository } from '../../application/ports/AuthRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { UserId } from '../../domain/value-objects/UserId';

export class ApiAuthRepository implements AuthRepository {
  constructor(private readonly baseUrl: string) {}

  async findByEmail(email: Email): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users?email=${email.getValue()}`);
      const userData = await response.json();
      
      if (!userData) return null;
      
      return this.mapToUser(userData);
    } catch (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  async save(user: User): Promise<void> {
    const userData = this.mapFromUser(user);
    
    await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  }

  private mapToUser(data: any): User {
    // Mapping logic from API data to domain entity
  }

  private mapFromUser(user: User): any {
    // Mapping logic from domain entity to API data
  }
}
```

#### Jour 4-5: Créer les controllers de présentation

```typescript
// features/auth/presentation/controllers/AuthController.ts
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { RegisterUseCase } from '../../application/use-cases/RegisterUseCase';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase
  ) {}

  async login(request: { email: string; password: string }) {
    try {
      const result = await this.loginUseCase.execute(request);
      return {
        success: true,
        data: {
          user: {
            id: result.user.getId().getValue(),
            email: result.user.getEmail().getValue(),
            name: result.user.getName()
          },
          token: result.token
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
```

### Phase 3: Configuration et injection de dépendances (Semaine 3)

#### Créer le container de dépendances

```typescript
// config/container.ts
import { Container } from 'inversify';
import { AuthRepository } from '@/features/auth/application/ports/AuthRepository';
import { ApiAuthRepository } from '@/features/auth/infrastructure/repositories/ApiAuthRepository';
import { LoginUseCase } from '@/features/auth/application/use-cases/LoginUseCase';
import { AuthController } from '@/features/auth/presentation/controllers/AuthController';

const container = new Container();

// Infrastructure
container.bind<AuthRepository>('AuthRepository').to(ApiAuthRepository);

// Use Cases
container.bind<LoginUseCase>('LoginUseCase').to(LoginUseCase);

// Controllers
container.bind<AuthController>('AuthController').to(AuthController);

export { container };
```

#### Intégrer avec Next.js App Router

```typescript
// app/api/auth/login/route.ts
import { container } from '@/config/container';
import { AuthController } from '@/features/auth/presentation/controllers/AuthController';

export async function POST(request: Request) {
  const controller = container.get<AuthController>('AuthController');
  const body = await request.json();
  
  const result = await controller.login(body);
  
  if (result.success) {
    return NextResponse.json(result.data);
  } else {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
}
```

### Phase 4: Migration des autres features et tests (Semaine 4)

#### Appliquer le même pattern aux autres features

**Ordre de migration recommandé:**
1. `profile` (simple)
2. `distributors` (moyenne complexité)
3. `transactions` (complexe avec relations)
4. `dashboard` (agrégation de données)

#### Implémentation complète des tests

```typescript
// __tests__/unit/features/auth/application/use-cases/LoginUseCase.test.ts
import { LoginUseCase } from '@/features/auth/application/use-cases/LoginUseCase';
import { AuthRepository } from '@/features/auth/application/ports/AuthRepository';
import { TokenService } from '@/features/auth/application/ports/TokenService';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let mockTokenService: jest.Mocked<TokenService>;

  beforeEach(() => {
    mockAuthRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    };
    
    mockTokenService = {
      generate: jest.fn(),
      verify: jest.fn(),
      refresh: jest.fn()
    };

    useCase = new LoginUseCase(mockAuthRepository, mockTokenService);
  });

  describe('execute', () => {
    it('should login user successfully with valid credentials', async () => {
      // Arrange
      const user = User.create('test@example.com', 'password123', 'Test User');
      mockAuthRepository.findByEmail.mockResolvedValue(user);
      mockTokenService.generate.mockResolvedValue('mock-token');

      // Act
      const result = await useCase.execute({
        email: 'test@example.com',
        password: 'password123'
      });

      // Assert
      expect(result.token).toBe('mock-token');
      expect(result.user).toBe(user);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      mockAuthRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute({
        email: 'nonexistent@example.com',
        password: 'password123'
      })).rejects.toThrow('User not found');
    });
  });
});
```

## 🔧 Points de rupture assumés

### Ce qui sera cassé (temporairement):

1. **Tous les hooks existants** - À recréer pour utiliser les controllers
2. **Les stores Zustand/Redux** - À adapter pour les nouvelles entités
3. **Les appels API directs** - Remplacés par les use cases
4. **Les composants couplés aux anciens modèles** - À refactoriser

### Ce qui doit être supprimé définitivement:

```bash
# Anciens fichiers à supprimer après migration
find features -name "*.models.ts" -delete
find features -name "*.repository.ts" -delete
find features -name "*.service.ts" -delete
find features -name "*.actions.ts" -delete
```

## 📊 Métriques de suivi

### Indicateurs de progression:
- [ ] 100% des entités migrant vers domain/entities/
- [ ] 100% des use cases avec tests unitaires
- [ ] 0 import direct entre couches violant l'architecture
- [ ] 100% des dépendances injectées via container
- [ ] Couverture de tests > 80% sur la logique métier

### Checkpoints de validation:
- **Fin semaine 1**: Auth feature complètement migrée
- **Fin semaine 2**: 2 features supplémentaires migrées
- **Fin semaine 3**: Container DI opérationnel
- **Fin semaine 4**: Migration complète avec tests

## 🚨 Risques et mitigation

### Risques identifiés:
1. **Temps d'arrêt** - Mitigation: Branches parallèles + déploiement progressif
2. **Bugs de régression** - Mitigation: Tests exhaustifs + validation manuelle
3. **Complexité accrue temporairement** - Mitigation: Documentation détaillée

### Plan de rollback:
- Branch `backup-before-migration` disponible
- Déploiement par feature avec rollback individuel possible
- Tests de non-régression avant chaque merge

## 📚 Ressources et formation

### Documentation à créer:
- Guide des conventions de nommage
- Patterns d'injection de dépendances
- Guide de tests pour chaque couche
- ADR (Architecture Decision Records)

### Formation équipe:
- Session 1: Principes de l'architecture hexagonale
- Session 2: TDD et tests par couche
- Session 3: Injection de dépendances et container
- Session 4: Patterns de migration

---

## ✅ Checklist de migration

### Phase 1 - Restructuration
- [ ] Backup créé et testé
- [ ] Structure de dossiers créée
- [ ] Feature auth: entités domain créées
- [ ] Feature auth: value objects créés
- [ ] Feature auth: ports définis
- [ ] Feature auth: use cases implémentés

### Phase 2 - Infrastructure
- [ ] Repositories implémentés
- [ ] Services infrastructure créés
- [ ] Controllers presentation créés
- [ ] Hooks adaptés aux controllers

### Phase 3 - Configuration
- [ ] Container DI configuré
- [ ] Routes Next.js migrées
- [ ] Variables d'environnement adaptées
- [ ] Configuration de tests mise à jour

### Phase 4 - Finalisation
- [ ] Toutes les features migrées
- [ ] Tests unitaires > 80% couverture
- [ ] Tests d'intégration fonctionnels
- [ ] Documentation à jour
- [ ] Formation équipe effectuée

**🎯 L'objectif est d'avoir une architecture robuste, testable et évolutive, même si cela nécessite de casser temporairement l'existant !**