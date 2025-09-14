"use client";

import * as React from "react";
import { useRouter } from "next/navigation"; // Step 1: Import useRouter
import { Trash2, AlertTriangle } from "lucide-react";
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
import { deleteLink } from "@/app/_services/actionLinks";
import { toast } from "sonner";

// The component no longer needs the 'onDelete' prop
function DrawerDeleteLink({ linkData }) {
  const router = useRouter(); // Step 2: Initialize the router
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteLink(linkData.id);
      if (result?.error) {
        toast.error("فشل في حذف الرابط: " + result.error);
      } else if (result?.success) {
        toast.success("تم حذف الرابط بنجاح");
        setOpen(false);
        router.refresh(); // Step 3: Refresh the page data
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الرابط");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            className="flex items-center gap-1"
            disabled={isDeleting}
          >
            <Trash2 size={14} />
            حذف
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle className="text-right flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} />
              تأكيد الحذف
            </DialogTitle>
            <DialogDescription className="text-right">
              هل أنت متأكد من حذف هذا الرابط؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DeleteConfirmation
            linkData={linkData}
            onDelete={handleDelete}
            setOpen={setOpen}
            isDeleting={isDeleting}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="flex items-center gap-1"
          disabled={isDeleting}
        >
          <Trash2 size={14} />
          حذف
        </Button>
      </DrawerTrigger>
      <DrawerContent dir="rtl">
        <DrawerHeader className="text-right">
          <DrawerTitle className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            تأكيد الحذف
          </DrawerTitle>
          <DrawerDescription>
            هل أنت متأكد من حذف هذا الرابط؟ لا يمكن التراجع عن هذا الإجراء.
          </DrawerDescription>
        </DrawerHeader>
        <DeleteConfirmation
          linkData={linkData}
          onDelete={handleDelete}
          setOpen={setOpen}
          isDeleting={isDeleting}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              إلغاء
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerDeleteLink;

function DeleteConfirmation({
  linkData,
  onDelete,
  setOpen,
  isDeleting,
  className,
}) {
  return (
    <div
      className={cn("flex flex-col w-full items-start gap-6", className)}
      dir="rtl"
    >
      {/* Link Preview */}
      <div className="bg-gray-50 rounded-lg p-4 border w-full">
        <div className="flex items-center gap-3" dir="rtl">
          <img
            src={linkData?.image_url}
            alt={linkData?.title}
            width={60}
            height={60}
            className="rounded-lg object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/60x60.png?text=No+Image";
            }}
          />
          <div className="flex-1 text-right">
            <h4 className="font-semibold text-lg">{linkData?.title}</h4>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3" dir="rtl">
          <AlertTriangle
            className="text-red-500 flex-shrink-0 mt-0.5"
            size={18}
          />
          <div className="text-right">
            <h5 className="font-medium text-red-800 mb-1">تحذير!</h5>
            <p className="text-sm text-red-700">
              سيتم حذف هذا الرابط نهائياً من قائمة الروابط الخاصة بك. هذا
              الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end w-full">
        <Button
          variant="outline"
          className={"hidden md:block"}
          onClick={() => setOpen(false)}
          disabled={isDeleting}
        >
          إلغاء
        </Button>
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <Trash2 size={16} />
          {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
        </Button>
      </div>
    </div>
  );
}
