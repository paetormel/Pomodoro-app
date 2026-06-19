"use client";

import { useQuery } from "@tanstack/react-query";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
};

async function fetchUsers() {
  const response = await fetch("/api/users");

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return (await response.json()) as User[];
}

export default function Home() {
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-950 p-6 text-slate-100">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <p className="mb-2 text-sm uppercase tracking-[0.35em] text-cyan-300">
          TanStack Query
        </p>
        <h1 className="text-3xl font-semibold">Users from the API</h1>
        <p className="mt-3 text-sm text-slate-300">
          This page now fetches data through TanStack Query instead of querying
          Prisma directly on the server.
        </p>

        {isLoading ? (
          <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Loading users...
          </p>
        ) : error ? (
          <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            Failed to load users from the API.
          </p>
        ) : users.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            No users yet. Add one through <code>/api/users</code>.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {users.map((user) => (
              <li
                key={user.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
              >
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {user.role}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
