"use client";

import * as React from "react";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchUrlMetadata } from "@/lib/url-metadata";
import { updateLink } from "@/app/_services/actionLinks";
import { toast } from "sonner";

function DrawerEditLink({ linkData, onRefresh }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="flex items-center gap-1"
        >
          <Edit size={14} />
          تعديل
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">تعديل الرابط</DialogTitle>
          <DialogDescription className="text-right">
            قم بتعديل بيانات الرابط هنا. اضغط حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <LinkForm linkData={linkData} setOpen={setOpen} onRefresh={onRefresh} />
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="flex items-center gap-1"
        >
          <Edit size={14} />
          تعديل
        </Button>
      </DrawerTrigger>
      <DrawerContent dir="rtl">
        <DrawerHeader className="text-right">
          <DrawerTitle>تعديل الرابط</DrawerTitle>
          <DrawerDescription>
            قم بتعديل بيانات الرابط هنا. اضغط حفظ عند الانتهاء.
          </DrawerDescription>
        </DrawerHeader>
        <LinkForm
          linkData={linkData}
          setOpen={setOpen}
          onRefresh={onRefresh}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerEditLink;

function LinkForm({ linkData, setOpen, onRefresh, className }) {
  const [formData, setFormData] = React.useState({
    title: linkData?.title || "",
    url: linkData?.url || "",
    image_url: linkData?.image_url || "",
    order: linkData?.order || 1,
  });
  const [isLoadingMetadata, setIsLoadingMetadata] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showImageUpload, setShowImageUpload] = React.useState(false);
  const [originalUrl, setOriginalUrl] = React.useState(linkData?.url || "");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUrlChange = async (url) => {
    handleChange("url", url);

    if (url && url.startsWith("http") && url !== originalUrl) {
      setIsLoadingMetadata(true);
      setShowImageUpload(false);

      try {
        const metadata = await fetchUrlMetadata(url);
        if (metadata.success) {
          if (metadata.image) handleChange("image_url", metadata.image);
          if (metadata.title) handleChange("title", metadata.title);
        } else {
          setShowImageUpload(true);
        }
      } catch {
        setShowImageUpload(true);
      } finally {
        setIsLoadingMetadata(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateLink(linkData.id, formData);

      if (result?.error) {
        toast.error("فشل في تحديث الرابط: " + result.error);
      } else {
        toast.success("تم تحديث الرابط بنجاح");
        setOpen(false);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الرابط");
      console.error("Error updating link:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isLoadingMetadata || isSubmitting;

  return (
    <form
      className={cn("grid items-start gap-6", className)}
      onSubmit={handleSubmit}
      dir="rtl"
    >
      <div className="grid gap-3">
        <Label htmlFor="url" className="text-right">
          الرابط
        </Label>
        <Input
          type="url"
          id="url"
          value={formData.url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com"
          className="text-right"
          required
          disabled={isDisabled}
        />
        {isLoadingMetadata && (
          <p className="text-sm text-blue-600 text-right">
            جاري جلب بيانات الرابط...
          </p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="title" className="text-right">
          عنوان الرابط
        </Label>
        <Input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={formData.title || "سيتم جلب العنوان تلقائياً من الرابط"}
          className="text-right"
          required
          disabled={isDisabled}
        />
      </div>

      <div className="flex flex-row justify-between  gap-3">
        <Label htmlFor="image_url" className="text-right w-fit">
          {showImageUpload ? "ارفع صورة أو أدخل رابط الصورة" : "رابط الصورة"}
        </Label>

        {formData.image_url && !showImageUpload ? (
          <div className="flex gap-1.5 items-center justify-between w-[78%]">
            <img
              src={formData.image_url}
              alt="معاينة الصورة"
              className="w-full h-20 object-cover rounded-md border"
              onError={() => setShowImageUpload(true)}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className=""
              onClick={() => {
                handleChange("image_url", "");
                setShowImageUpload(true);
              }}
              disabled={isDisabled}
            >
              إزالة
            </Button>
          </div>
        ) : (
          <Input
            type="url"
            id="image_url"
            value={formData.image_url}
            onChange={(e) => handleChange("image_url", e.target.value)}
            placeholder={
              showImageUpload
                ? "لم نتمكن من جلب الصورة تلقائياً - أدخل رابط الصورة"
                : "https://example.com/image.jpg"
            }
            className="text-right"
            disabled={isDisabled}
          />
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="order" className="text-right">
          ترتيب العرض
        </Label>
        <Input
          type="number"
          id="order"
          value={formData.order}
          onChange={(e) => handleChange("order", parseInt(e.target.value))}
          min="1"
          className="text-right"
          required
          disabled={isDisabled}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isDisabled}>
        {isSubmitting ? "جاري التحميل..." : "حفظ التغييرات"}
      </Button>
    </form>
  );
}
