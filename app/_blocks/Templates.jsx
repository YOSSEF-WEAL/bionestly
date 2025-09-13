"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { updateTemplate } from "../_services/actionsProfile";
import { toast } from "sonner";

function Templates({ templatesData, myTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(myTemplate);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (id) => {
    setSelectedTemplate(id);
  };

  const handleSave = () => {
    if (!selectedTemplate) return;
    startTransition(async () => {
      const res = await updateTemplate(selectedTemplate);
      if (res?.error) {
        toast.error("خطأ في الحفظ: " + res.error);
      } else {
        toast.success("تم الحفظ بنجاح");
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-end gap-6 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full mt-2 mb-5">
        <Button variant="save" onClick={handleSave} disabled={isPending}>
          {isPending ? "جاري الحفظ..." : "حفظ"}
          <Check />
        </Button>
        <h2 className="text-base md:text-2xl font-bold text-end">
          اختر من القوالب المتاحة
        </h2>
      </div>

      {/* Templates List */}
      <div className="flex flex-row flex-wrap justify-center gap-2 md:gap-6 w-full">
        {templatesData?.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <div
              key={template.id}
              className="relative group rounded-3xl overflow-hidden shadow-xl cursor-pointer flex-shrink-0 w-[48%] md:w-[300px] lg:w-[300px] h-80 md:h-140 lg:[600px]"
              onClick={() => handleSelect(template.id)}
            >
              {/* Template Image */}
              <img
                src={template.preview_url}
                alt={template.name}
                className="w-[101%] h-[101%] object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gray-800/70  opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-4 text-white">
                <h3 className="text-lg font-bold mb-2">{template.name}</h3>
                <p className="text-sm mb-4 line-clamp-3">
                  {template.description}
                </p>
                <Button
                  variant="secondary"
                  className={"px-5"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(template.id);
                  }}
                >
                  اختر
                </Button>
              </div>

              {/* Active Template Overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                  <Check size={56} className="text-white drop-shadow-lg" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Templates;
