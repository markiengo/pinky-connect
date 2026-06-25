"use server";

import { prisma } from "@/lib/db";
import { createSession, clearSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!username || !password) {
    return { error: "Vui lòng nhập tên đăng nhập và mật khẩu." };
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return { error: "Tên đăng nhập không tồn tại." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Mật khẩu không đúng." };
  }

  await createSession({ userId: user.id, username: user.username });
  redirect("/");
}

export async function signupAction(formData: FormData): Promise<{ error?: string }> {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!username || !password) {
    return { error: "Vui lòng nhập tên đăng nhập và mật khẩu." };
  }
  if (username.length < 3) {
    return { error: "Tên đăng nhập phải có ít nhất 3 ký tự." };
  }
  if (password.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự." };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: "Tên đăng nhập đã tồn tại." };
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, passwordHash: hash },
  });

  await createSession({ userId: user.id, username: user.username });
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
