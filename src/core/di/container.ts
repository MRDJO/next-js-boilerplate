import "reflect-metadata";
import { Container } from "inversify";
import { featureFlags } from "@/core/config/feature-flags";
import { MockAuthService } from "@/core/auth/auth.mocks";
import { CookieAuthService } from "@/core/auth/auth.service";
import { MockApiClient } from "@/core/http/api-client.mock";
import { FetchApiClient } from "@/core/http/api-client";
import { MockUserRepository } from "@/features/users/repository/user.repository.mock";
import { UserRepository } from "@/features/users/repository/user.repository";
import { TOKENS } from "./tokens";

let appContainer: Container | undefined;

const bindAuth = (container: Container) => {
  if (featureFlags.useMockAuth) {
    container.bind(TOKENS.AuthService).to(MockAuthService).inSingletonScope();
  } else {
    container.bind(TOKENS.AuthService).to(CookieAuthService).inSingletonScope();
  }
};

const bindData = (container: Container) => {
  if (featureFlags.useMockData) {
    container.bind(TOKENS.ApiClient).to(MockApiClient).inSingletonScope();
    container.bind(TOKENS.UserRepository).to(MockUserRepository).inSingletonScope();
  } else {
    container.bind(TOKENS.ApiClient).to(FetchApiClient).inSingletonScope();
    container.bind(TOKENS.UserRepository).to(UserRepository).inSingletonScope();
  }
};

export const getAppContainer = () => {
  if (!appContainer) {
    appContainer = new Container({
      defaultScope: "Singleton",
    });

    bindAuth(appContainer);
    bindData(appContainer);
  }

  return appContainer;
};
