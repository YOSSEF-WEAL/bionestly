"use server";

import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Sign out user
export async function logout() {
    const supabase = await createClient();
    
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return { error: error.message };
        }
        
        revalidatePath('/', 'layout');
        redirect('/');
    } catch (error) {
        return { error: error.message || 'An error occurred' };
    }
}

// Sign in with Google OAuth
export async function signInWithGoogle() {
    const supabase = await createClient();
    
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/oauth?next=/account`,
            },
        });
        
        if (error) {
            return { error: error.message };
        }
        
        if (data.url) {
            redirect(data.url);
        }
    } catch (error) {
        return { error: error.message || 'An error occurred' };
    }
}

// Alternative sign out action
export async function signOutAction() {
    return await logout();
}

// Sign in with email and password
export async function signInWithPassword(prevState, formData) {
    if (!formData) {
        return { error: 'Form data is required' };
    }
    
    const email = formData.get('email');
    const password = formData.get('password');
    
    const supabase = await createClient();
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (error) {
            return { error: error.message };
        }
        
        revalidatePath('/', 'layout');
        redirect('/account');
    } catch (error) {
        return { error: error.message || 'An error occurred' };
    }
}

// Sign up with email and password
export async function signUpWithPassword(prevState, formData) {
    if (!formData) {
        return { error: 'Form data is required' };
    }
    
    const email = formData.get('email');
    const password = formData.get('password');
    const repeatPassword = formData.get('repeatPassword');
    
    if (password !== repeatPassword) {
        return { error: 'Passwords do not match' };
    }
    
    const supabase = await createClient();
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account`,
            },
        });
        
        if (error) {
            return { error: error.message };
        }
        
        // If user is immediately confirmed (email confirmation disabled)
        if (data.user && !data.user.email_confirmed_at) {
            redirect('/auth/sign-up-success');
        } else if (data.user && data.user.email_confirmed_at) {
            // User is confirmed, redirect to account
            revalidatePath('/', 'layout');
            redirect('/account');
        } else {
            redirect('/auth/sign-up-success');
        }
    } catch (error) {
        return { error: error.message || 'An error occurred' };
    }
}

// Reset password for email
export async function resetPasswordForEmail(prevState, formData) {
    if (!formData) {
        return { error: 'Form data is required' };
    }
    
    const email = formData.get('email');
    
    const supabase = await createClient();
    
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/update-password`,
        });
        
        if (error) {
            return { error: error.message };
        }
        
        return { success: true };
    } catch (error) {
        return { error: error.message || 'An error occurred' };
    }
}

// Update user password
export async function updateUserPassword(prevState, formData) {
    if (!formData) {
        return { error: 'Form data is required' };
    }
    
    const password = formData.get('password');
    
    const supabase = await createClient();
    
    try {
        const { data, error } = await supabase.auth.updateUser({ password });
        
        if (error) {
            return { error: error.message };
        }
        
        revalidatePath('/', 'layout');
        redirect('/account');
    } catch (error) {
        return { error: error.message || 'An error occurred' };
    }
}

// Sign in with OAuth (Google)
export async function signInWithOAuth(provider = 'google') {
    const supabase = await createClient();
    
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/oauth?next=/account`,
            },
        });
        
        if (error) {
            return { error: error.message };
        }
        
        if (data.url) {
            redirect(data.url);
        }
    } catch (error) {
        return { error: error.message || 'An error occurred' };
    }
}
