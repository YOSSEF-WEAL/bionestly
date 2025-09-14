"use client";

import React, { useEffect, useState } from "react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { toast } from "sonner";
import { updateProfile } from "@/app/_services/actionsProfile";
import { createClient } from "@supabase/supabase-js";

// Supabase Client (بالمفاتيح العامة)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function ProfileImageUploader({ fieldKey, label, onUploaded }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const bucketName = "portfolios";
  const path = `profiles/${fieldKey}`;

  // إعدادات الرفع
  const props = useSupabaseUpload({
    bucketName,
    path,
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 5, // 5MB
  });

  useEffect(() => {
    const updateDb = async () => {
      if (!props.isSuccess || !props.successes.length) return;

      try {
        setIsUpdating(true);

        // اسم الملف اللي اترفع
        const uploadedFileName = props.successes[0];

        // هات الرابط العام للصورة
        const { data } = supabase.storage
          .from(bucketName)
          .getPublicUrl(`${path}/${uploadedFileName}`);

        const publicUrl = data.publicUrl;

        // Update جدول profiles
        const result = await updateProfile({ [fieldKey]: publicUrl });

        if (result?.error) {
          toast.error(`فشل في تحديث ${label}: ${result.error}`);
        } else {
          toast.success(`${label} تم تحديثها بنجاح ✅`);
          if (onUploaded) onUploaded(publicUrl); // تحديث الـ UI بالرابط الجديد
        }
      } catch (error) {
        console.error("Error updating profile image:", error);
        toast.error(`حدث خطأ أثناء تحديث ${label}`);
      } finally {
        setIsUpdating(false);
      }
    };

    updateDb();
  }, [props.isSuccess]);

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <h4 className="text-sm font-medium">{label}</h4>
      <Dropzone {...props}>
        <DropzoneEmptyState className="text-center" />
        <DropzoneContent className="mt-2" />
      </Dropzone>
      {isUpdating && (
        <p className="text-xs text-gray-500">جاري تحديث {label}...</p>
      )}
    </div>
  );
}

export default ProfileImageUploader;
