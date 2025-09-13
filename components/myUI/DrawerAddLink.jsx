"use client";

import * as React from "react";
import { Plus, ExternalLink } from "lucide-react";
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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchUrlMetadata } from "@/lib/url-metadata";
import { addLink } from "@/app/_services/actionLinks";
import { toast } from "sonner";

function DrawerAddLink({ onAdd, existingLinks = [], userEmail }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          إضافة رابط جديد
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">إضافة رابط جديد</DialogTitle>
          <DialogDescription className="text-right">
            قم بإدخال بيانات الرابط الجديد هنا. اضغط إضافة عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <AddLinkForm
          onAdd={onAdd}
          setOpen={setOpen}
          existingLinks={existingLinks}
          userEmail={userEmail}
        />
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="flex items-center gap-2">
          إضافة رابط جديد
          <Plus size={16} />
        </Button>
      </DrawerTrigger>
      <DrawerContent dir="rtl">
        <DrawerHeader className="text-right">
          <DrawerTitle>إضافة رابط جديد</DrawerTitle>
          <DialogDescription>
            قم بإدخال بيانات الرابط الجديد هنا. اضغط إضافة عند الانتهاء.
          </DialogDescription>
        </DrawerHeader>
        <AddLinkForm
          onAdd={onAdd}
          setOpen={setOpen}
          existingLinks={existingLinks}
          userEmail={userEmail}
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

export default DrawerAddLink;

function AddLinkForm({ onAdd, setOpen, existingLinks, userEmail, className }) {
  const [formData, setFormData] = React.useState({
    title: "",
    url: "",
    image_url: "",
    order: Math.max(...existingLinks.map((link) => link.order), 0) + 1,
  });
  const [isLoadingMetadata, setIsLoadingMetadata] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showImageUpload, setShowImageUpload] = React.useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUrlChange = async (url) => {
    handleChange("url", url);
    if (!url || !url.startsWith("http")) return;

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      toast.error("لا يوجد إيميل مستخدم. تأكد من تسجيل الدخول");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addLink(formData, userEmail);

      if (result?.error) {
        toast.error("فشل في إضافة الرابط: " + result.error);
      } else {
        toast.success("تم إضافة الرابط بنجاح");
        onAdd && onAdd(result.link);
        setOpen(false);
        setFormData({
          title: "",
          url: "",
          image_url: "",
          order: Math.max(...existingLinks.map((link) => link.order), 0) + 2,
        });
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء إضافة الرابط");
      console.error("Error adding link:", err);
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
        <Label htmlFor="add-url" className="text-right">
          الرابط
        </Label>
        <Input
          type="url"
          id="add-url"
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
        <Label htmlFor="add-title" className="text-right">
          عنوان الرابط
        </Label>
        <Input
          type="text"
          id="add-title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={formData.title || "سيتم جلب العنوان تلقائياً من الرابط"}
          className="text-right"
          required
          disabled={isDisabled}
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="add-image_url" className="text-right">
          {showImageUpload ? "ارفع صورة أو أدخل رابط الصورة" : "رابط الصورة"}
        </Label>

        {formData.image_url && !showImageUpload ? (
          <div className="space-y-3">
            <img
              src={formData.image_url}
              alt="معاينة الصورة"
              className="w-full h-32 object-cover rounded-md border"
              onError={() => setShowImageUpload(true)}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
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
            id="add-image_url"
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
        <Label htmlFor="add-order" className="text-right">
          ترتيب العرض
        </Label>
        <Input
          type="number"
          id="add-order"
          value={formData.order}
          onChange={(e) => handleChange("order", parseInt(e.target.value))}
          min="1"
          className="text-right"
          required
          disabled={isDisabled}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isDisabled}>
        {isSubmitting ? "جاري التحميل..." : "إضافة الرابط"}
      </Button>
    </form>
  );
}
