import MockAdapter from "axios-mock-adapter";
import { api } from "./api";
import {
  MOCK_CREDENTIALS,
  addUserToStore,
  createMockJwt,
  MOCK_ANALYTICS,
  getUsersStore,
  removeUserFromStore,
  updateUserInStore,
} from "./mockData";
import type { User } from "../store/usersSlice";

const ACCESS_TOKEN_EXPIRY = 60; // 1 minute
const REFRESH_TOKEN_EXPIRY = 86400; // 24 hours

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

function filterAndSortUsers(params: {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search: string;
  role: string;
  status: string;
  startDate?: string;
  endDate?: string;
}) {
  let filtered = [...getUsersStore()];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search),
    );
  }

  if (params.role) {
    filtered = filtered.filter((u) => u.role === params.role);
  }

  if (params.status) {
    filtered = filtered.filter((u) => u.status === params.status);
  }

  if (params.startDate) {
    const start = new Date(params.startDate).getTime();
    filtered = filtered.filter((u) => new Date(u.createdAt).getTime() >= start);
  }

  if (params.endDate) {
    // Add 1 day to include the entire end date up to 23:59:59
    const end = new Date(params.endDate).getTime() + 86400000;
    filtered = filtered.filter((u) => new Date(u.createdAt).getTime() <= end);
  }

  filtered.sort((a, b) => {
    const key = params.sortBy === "createdAt" ? "createdAt" : params.sortBy;
    const aVal = String(a[key as keyof User] ?? "");
    const bVal = String(b[key as keyof User] ?? "");
    const cmp = aVal.localeCompare(bVal);
    return params.sortOrder === "asc" ? cmp : -cmp;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / params.pageSize) || 1;
  const start = (params.page - 1) * params.pageSize;
  const data = filtered.slice(start, start + params.pageSize);

  return {
    data,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages,
  };
}

export function setupMockApi() {
  const mock = new MockAdapter(api, { delayResponse: 80 });

  mock.onPost("/auth/login").reply(async (config) => {
    await delay();
    const { email, password } = JSON.parse(config.data || '{}');

    if (
      email !== MOCK_CREDENTIALS.email ||
      password !== MOCK_CREDENTIALS.password
    ) {
      return [401, { message: "Invalid email or password" }];
    }

    const userInStore = getUsersStore().find((u) => u.email.toLowerCase() === email.toLowerCase());
    const id = userInStore?.id || "1";
    const name = userInStore?.name || "Admin User";
    const profileImage = userInStore?.profileImage;

    const accessToken = createMockJwt(
      { sub: id, email, name, profileImage, type: "access" },
      ACCESS_TOKEN_EXPIRY,
    );
    const refreshToken = createMockJwt(
      { sub: id, email, type: "refresh" },
      REFRESH_TOKEN_EXPIRY,
    );

    return [
      200,
      {
        accessToken,
        refreshToken,
        user: { id, email, name, profileImage },
      },
    ];
  });

  mock.onPost("/auth/refresh").reply(async () => {
    await delay(200);
    const accessToken = createMockJwt({ sub: "1", type: "access" }, ACCESS_TOKEN_EXPIRY);
    const refreshToken = createMockJwt({ sub: "1", type: "refresh" }, REFRESH_TOKEN_EXPIRY);
    return [200, { accessToken, refreshToken }];
  });

  mock.onGet("/analytics/summary").reply(async () => {
    await delay(80);
    return [200, MOCK_ANALYTICS];
  });

  mock.onGet("/users").reply(async (config) => {
    await delay();
    const params = {
      page: Number(config.params?.page ?? 1),
      pageSize: Number(config.params?.pageSize ?? 10),
      sortBy: config.params?.sortBy ?? "createdAt",
      sortOrder: (config.params?.sortOrder ?? "desc") as 'asc' | 'desc',
      search: String(config.params?.search ?? ""),
      role: config.params?.role ?? "",
      status: config.params?.status ?? "",
      startDate: config.params?.startDate ?? "",
      endDate: config.params?.endDate ?? "",
    };
    return [200, filterAndSortUsers(params)];
  });

  mock.onPost("/users").reply(async (config) => {
    await delay();
    const payload = JSON.parse(config.data || '{}');

    const existing = getUsersStore().find(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase(),
    );
    if (existing) {
      return [409, { message: "A user with this email already exists" }];
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      role: payload.role,
      status: payload.status,
      profileImage: payload.profileImage || undefined,
      createdAt: new Date().toISOString(),
    };
    addUserToStore(newUser);
    return [201, newUser];
  });

  mock.onDelete(/\/users\/\w+/).reply(async (config) => {
    await delay();
    const id = config.url?.split("/").pop();
    if (id) removeUserFromStore(id);
    return [204];
  });

  mock.onPut(/\/users\/\w+/).reply(async (config) => {
    await delay();
    const id = config.url?.split("/").pop();
    const payload = JSON.parse(config.data || '{}');

    if (payload.email && id) {
      const existing = getUsersStore().find(
        (u) => u.email.toLowerCase() === payload.email.toLowerCase() && u.id !== id,
      );
      if (existing) {
        return [409, { message: "A user with this email already exists" }];
      }
    }

    if (id) {
      const updated = updateUserInStore(id, payload);
      if (!updated) {
        return [404, { message: "User not found" }];
      }
      return [200, updated];
    }
    return [400, { message: "Invalid ID" }];
  });

  return mock;
}
