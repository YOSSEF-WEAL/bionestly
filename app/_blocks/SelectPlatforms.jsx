"use client";

import * as React from "react";
import * as LucideIcons from "lucide-react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
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

import {
  getPlatforms,
  getSocialLinksById,
  getPlatformById,
} from "@/app/_services/data-services";

function toPascalCase(str) {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function SelectPlatforms({ profile_id, onPlatformSelect }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [platforms, setPlatforms] = React.useState([]);
  const [filteredPlatforms, setFilteredPlatforms] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!profile_id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const allPlatforms = await getPlatforms();
        const socialLinks = await getSocialLinksById(profile_id);

        let selectedValue = "";
        if (socialLinks && socialLinks.length > 0) {
          const userPlatform = await getPlatformById(socialLinks[0].platform);
          selectedValue = userPlatform?.id?.toString() || "";
        }

        setPlatforms(allPlatforms || []);
        setFilteredPlatforms(allPlatforms || []);
        setValue(selectedValue);
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

  const handleSelect = (currentValue) => {
    const selectedPlatform = platforms.find(
      (p) => p.id.toString() === currentValue
    );

    if (selectedPlatform && onPlatformSelect) {
      onPlatformSelect(selectedPlatform);
    }

    setSearch(""); // مسح البحث بعد الاختيار
    setOpen(false);
  };

  if (loading)
    return <div className="text-sm text-gray-500">جاري تحميل المنصات...</div>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
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
  );
}

export default SelectPlatforms;
