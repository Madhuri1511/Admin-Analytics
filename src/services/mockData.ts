import type { User } from '../store/usersSlice';

export const MOCK_CREDENTIALS = {
  email: 'madhuri.patil@yopmail.com',
  password: 'password123',
};

export const MOCK_ANALYTICS = {
  totalUsers: 12847,
  revenue: 24850000,
  orders: 3421,
  conversionRate: 3.8,
};


const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.sharma@yopmail.com',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-15T10:30:00+05:30',
    profileImage: 'https://i.pravatar.cc/150?u=priya',
  },
  {
    id: '2',
    name: 'Rahul Verma',
    email: 'rahul.verma@yopmail.com',
    role: 'editor',
    status: 'active',
    createdAt: '2025-02-20T14:45:00+05:30',
    profileImage: 'https://i.pravatar.cc/150?u=rahul',
  },
  {
    id: '3',
    name: 'Ananya Patel',
    email: 'ananya.patel@yopmail.com',
    role: 'viewer',
    status: 'inactive',
    createdAt: '2025-03-10T09:15:00+05:30',
  },
  {
    id: '4',
    name: 'Vikram Singh',
    email: 'vikram.singh@yopmail.com',
    role: 'editor',
    status: 'pending',
    createdAt: '2025-04-05T16:20:00+05:30',
  },
  {
    id: '5',
    name: 'Kavya Reddy',
    email: 'kavya.reddy@yopmail.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2025-05-12T11:00:00+05:30',
    profileImage: "https://i.pravatar.cc/150?u=kavya"
  },
  {
    id: '6',
    name: 'Madhuri Patil',
    email: 'madhuri.patil@yopmail.com',
    role: 'admin',
    status: 'active',
    createdAt: '2025-11-19T17:15:00+05:30',
  },
  {
    id: '7',
    name: 'Suresh Iyer',
    email: 'suresh.iyer@yopmail.com',
    role: 'editor',
    status: 'inactive',
    createdAt: '2025-06-18T13:45:00+05:30',
  },
  {
    id: '8',
    name: 'Neha Gupta',
    email: 'neha.gupta@yopmail.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2025-07-22T10:10:00+05:30',
  },
  {
    id: '9',
    name: 'Amit Joshi',
    email: 'amit.joshi@yopmail.com',
    role: 'editor',
    status: 'pending',
    createdAt: '2025-08-30T15:25:00+05:30',
  },
  {
    id: '10',
    name: 'Divya Nair',
    email: 'divya.nair@yopmail.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2025-09-14T12:40:00+05:30',
  },
  {
    id: '11',
    name: 'Rohan Das',
    email: 'rohan.das@yopmail.com',
    role: 'admin',
    status: 'active',
    createdAt: '2025-10-02T09:55:00+05:30',
  },
  {
    id: '12',
    name: 'Pooja Malhotra',
    email: 'pooja.malhotra@yopmail.com',
    role: 'viewer',
    status: 'inactive',
    createdAt: '2025-11-19T17:15:00+05:30',
  },

];

const STORAGE_KEY = 'app_users_store';

let usersStore: User[] = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge new profile images into existing stored users
      return parsed.map((user: User) => {
        const initial = INITIAL_USERS.find(u => u.id === user.id);
        if (initial?.profileImage && !user.profileImage) {
          return { ...user, profileImage: initial.profileImage };
        }
        return user;
      });
    }
  } catch (e) {
    console.error('Failed to parse users from localStorage', e);
  }
  return INITIAL_USERS;
})();

function persistStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usersStore));
  } catch (e) {
    console.error('Failed to save users to localStorage', e);
  }
}

export function getUsersStore(): User[] {
  return usersStore;
}

export function addUserToStore(user: User): void {
  usersStore = [user, ...usersStore];
  persistStore();
}

export function removeUserFromStore(id: string): void {
  usersStore = usersStore.filter((u) => u.id !== id);
  persistStore();
}

export function updateUserInStore(id: string, data: Partial<User>): User | null {
  let updated: User | null = null;
  usersStore = usersStore.map((u) => {
    if (u.id === id) {
      updated = { ...u, ...data } as User;
      return updated;
    }
    return u;
  });
  if (updated) persistStore();
  return updated;
}

export function createMockJwt(payload: any, expiresInSeconds: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    }),
  );
  const signature = btoa('mock-signature');
  return `${header}.${body}.${signature}`;
}
