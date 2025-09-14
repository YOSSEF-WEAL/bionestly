"use server";

import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Sign out user
export async function logout()
{
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/');
}

// Sign in with email and password
export async function signInWithPassword(prevState, formData)
{
    const email = formData.get('email');
    const password = formData.get('password');
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error)
    {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/account'); // بعد تسجيل الدخول الناجح، نذهب للحساب
}


export async function signUpWithPassword(prevState, formData)
{
    const email = formData.get('email');
    const password = formData.get('password');
    const repeatPassword = formData.get('repeatPassword');

    if (password !== repeatPassword)
    {
        return { error: 'كلمتا المرور غير متطابقتين' };
    }

    const supabase = await createClient();

    // ملاحظة: لقد أزلنا emailRedirectTo من هنا لأنه لم يعد ضرورياً
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error)
    {
        console.error('Sign up error:', error);
        return { error: `فشل في إنشاء الحساب: ${error.message}` };
    }

    // بما أن تأكيد البريد معطل، فإن Supabase يقوم بتسجيل دخول المستخدم تلقائياً
    // بعد إنشاء الحساب بنجاح.
    // كل ما علينا فعله هو إعادة تحديث المسار وإعادة التوجيه.

    revalidatePath('/', 'layout');
    redirect('/account'); // وجه المستخدم مباشرة إلى صفحة حسابه
}


// Reset password for email
export async function resetPasswordForEmail(prevState, formData)
{
    const email = formData.get('email');
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
    });

    if (error)
    {
        return { error: error.message };
    }
    return { success: true };
}

// Update user password
export async function updateUserPassword(prevState, formData)
{
    const password = formData.get('password');
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error)
    {
        return { error: error.message };
    }

    // بعد تحديث كلمة المرور بنجاح، وجهه لصفحة الحساب
    revalidatePath('/', 'layout');
    redirect('/account');
}
