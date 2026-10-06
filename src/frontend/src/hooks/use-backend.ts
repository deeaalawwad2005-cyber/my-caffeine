import { createActor } from "@/backend";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";

/**
 * Shared access to the backend actor and the Internet Identity session.
 *
 * `useActor` must be called at the top level of a React hook — never inside a
 * query or mutation callback — so this hook is the single place pages and
 * query hooks obtain the actor from.
 */
export function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}

export function useAuth() {
  const {
    identity,
    login,
    clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginError,
    isSessionExpired,
    isAuthenticated,
    loginError,
  } = useInternetIdentity();

  return {
    identity,
    login,
    logout: clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginError,
    isSessionExpired,
    isAuthenticated,
    loginError,
  };
}
