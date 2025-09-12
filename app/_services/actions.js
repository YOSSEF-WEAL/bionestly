"use server";

import { signIn, signOut } from "./auth";

export async function logout()
{
    await signOut({ redirectTo: "/" });
}

export async function signInWithGoogle()
{
    await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction()
{
    await signOut({ redirectTo: "/" });
}
