"use client";

import * as React from "react";
import * as LucideIcons from "lucide-react";
import { Check, ChevronsUpDown, Plus, X, Save, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

import {
  getPlatforms,
  getSocialLinksById,
  getPlatformById,
} from "@/app/_services/data-services";
import {
  upsertSocialLink,
  deleteSocialLink,
} from "@/app/_services/actionsProfile";
import LoadingSpinnerSelectedPlatform from "@/components/myUI/LoadingSpinnerSelectedPlatform";

function toPascalCase(str) {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function SelectPlatforms({ profile_id, onPlatformSelect, onLinksChange }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [platforms, setPlatforms] = React.useState([]);
  const [filteredPlatforms, setFilteredPlatforms] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [socialLinks, setSocialLinks] = React.useState([]);
  const [originalLinks, setOriginalLinks] = React.useState([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    if (!profile_id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const allPlatforms = await getPlatforms();
        const socialLinksData = await getSocialLinksById(profile_id);

        const preparedLinks = (socialLinksData || []).map((link) => ({
          ...link,
          tempUrl: link.url_link || "",
          markedForDeletion: false,
        }));

        let selectedValue = "";
        if (preparedLinks.length > 0) {
          const userPlatform = await getPlatformById(preparedLinks[0].platform);
          selectedValue = userPlatform?.id?.toString() || "";
        }

        setPlatforms(allPlatforms || []);
        setFilteredPlatforms(allPlatforms || []);
        setValue(selectedValue);
        setSocialLinks(preparedLinks);
        setOriginalLinks(preparedLinks);
      } catch (error) {
        console.error("Error fetching platforms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile_id]);

  React.useEffect(() => {
    if (search.trim() === "") {
      setFilteredPlatforms(platforms);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredPlatforms(
        platforms.filter((p) => p.name.toLowerCase().includes(lowerSearch))
      );
    }
  }, [search, platforms]);

  const handleSelect = (platformId) => {
    const selectedPlatform = platforms.find(
      (p) => p.id.toString() === platformId
    );
    if (!selectedPlatform) return;

    // إضافة لينك جديد مؤقت في UI
    const alreadyExists = socialLinks.some(
      (link) => link.platform === selectedPlatform.id
    );
    if (!alreadyExists) {
      const newLink = {
        id: null, // لسه ما اتحفظش في الداتا بيز
        platform: selectedPlatform.id,
        tempUrl: "",
        markedForDeletion: false,
      };
      setSocialLinks((prev) => [...prev, newLink]);
      setIsEditing(true); // يظهر زرار الحفظ
    }

    if (onPlatformSelect) {
      onPlatformSelect(selectedPlatform);
    }

    setSearch("");
    setOpen(false);
  };

  // التعديل مؤقت على tempUrl بدون تفعيل save
  const handleInputChange = (platformId, url) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.platform === platformId ? { ...link, tempUrl: url } : link
      )
    );
    setIsEditing(true); // يظهر الأزرار فقط عند أي تغيير
  };

  const handleMarkForDeletion = (platformId) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.platform === platformId
          ? { ...link, markedForDeletion: !link.markedForDeletion }
          : link
      )
    );
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const linksToSave = socialLinks.filter((l) => !l.markedForDeletion);
      const linksToDelete = socialLinks.filter((l) => l.markedForDeletion);

      // حفظ الروابط
      for (const link of linksToSave) {
        if (link.tempUrl && link.tempUrl.trim() !== "") {
          const result = await upsertSocialLink(
            profile_id,
            link.platform,
            link.tempUrl
          );
          if (result?.error) {
            toast.error(`فشل في حفظ رابط ${link.platform}: ${result.error}`);
          }
        }
      }

      // حذف الروابط المعلَّمة
      for (const link of linksToDelete) {
        if (link.id) {
          const result = await deleteSocialLink(link.id);
          if (result?.error) {
            toast.error(`فشل في حذف الرابط: ${result.error}`);
          }
        }
      }

      const finalLinks = linksToSave.map((l) => ({
        ...l,
        url_link: l.tempUrl,
        markedForDeletion: false,
      }));
      setSocialLinks(finalLinks);
      setOriginalLinks(finalLinks);
      setIsEditing(false);
      toast.success("تم حفظ التغييرات بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSocialLinks(
      originalLinks.map((l) => ({
        ...l,
        tempUrl: l.url_link,
        markedForDeletion: false,
      }))
    );
    setIsEditing(false);
  };

  if (loading)
    return (
      <div className="text-sm text-gray-500 w-full flex items-center justify-center">
        <LoadingSpinnerSelectedPlatform />
      </div>
    );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              <Plus className="mr-2" />
              إضافة منصة
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[250px] p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="ابحث عن منصة..."
                className="h-9"
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>لم يتم العثور على منصات</CommandEmpty>
                <CommandGroup>
                  {filteredPlatforms.map((platform) => {
                    const iconName = toPascalCase(platform.icon_name_lucide);
                    const IconComponent = LucideIcons[iconName] || null;

                    return (
                      <CommandItem
                        key={platform.id}
                        value={platform.name}
                        onSelect={() => handleSelect(platform.id.toString())}
                      >
                        {IconComponent && (
                          <IconComponent className="mr-2 w-4 h-4" />
                        )}
                        {platform.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === platform.id.toString()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <h3 className="text-lg font-semibold">الروابط الاجتماعية</h3>
      </div>

      {/* عرض الروابط */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" dir="rtl">
        {socialLinks.map((link) => {
          const platform = platforms.find((p) => p.id === link.platform);
          if (!platform) return null;

          const iconName = toPascalCase(platform.icon_name_lucide);
          const IconComponent = LucideIcons[iconName] || null;

          return (
            <div
              key={link.platform}
              className={cn(
                "flex flex-col gap-3 bg-white shadow-lg rounded-lg p-3 relative transition",
                link.markedForDeletion
                  ? "opacity-50 border border-red-400 bg-red-50"
                  : ""
              )}
              dir="rtl"
            >
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-medium">
                  {IconComponent && <IconComponent size={20} />}
                  {platform.name}
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "hover:bg-red-100",
                    link.markedForDeletion
                      ? "text-red-600"
                      : "text-red-400 hover:text-red-600"
                  )}
                  onClick={() => handleMarkForDeletion(link.platform)}
                >
                  <X size={16} />
                </Button>
              </div>
              <input
                type="url"
                placeholder={`رابط ${platform.name}`}
                value={link.tempUrl || ""}
                disabled={link.markedForDeletion}
                onChange={(e) =>
                  handleInputChange(link.platform, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          );
        })}
      </div>

      {/* أزرار الحفظ والإلغاء */}
      {isEditing && (
        <div className="flex justify-end gap-3 mt-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Ban size={16} />
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? "جاري الحفظ..." : "حفظ"}
            <Save size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default SelectPlatforms;
