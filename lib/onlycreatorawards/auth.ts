import type { UserRole } from "@/lib/onlycreatorawards/types";

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isEmailVerified: boolean;
  isBanned: boolean;
};

const demoAdmin: SessionUser = {
  id: "demo-admin",
  email: "admin@onlycreatorawards.com",
  displayName: "Demo Admin",
  role: "ADMIN",
  isEmailVerified: true,
  isBanned: false
};

const demoUser: SessionUser = {
  id: "demo-user",
  email: "fan@example.com",
  displayName: "Verified Fan",
  role: "USER",
  isEmailVerified: true,
  isBanned: false
};

export function getCurrentUser(): SessionUser {
  return process.env.OCA_DEMO_ROLE === "USER" ? demoUser : demoAdmin;
}

export function hasRole(user: SessionUser, roles: UserRole[]) {
  return !user.isBanned && roles.includes(user.role);
}

export function requireRole(roles: UserRole[]) {
  const user = getCurrentUser();

  return {
    user,
    allowed: hasRole(user, roles)
  };
}
