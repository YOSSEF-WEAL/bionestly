"use client";

import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DrawerEditLink from "@/components/myUI/DrawerEditLink";
import DrawerAddLink from "@/components/myUI/DrawerAddLink";
import DrawerDeleteLink from "@/components/myUI/DrawerDeleteLink";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";

function Links({ linksData, onRefresh }) {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    async function fetchUserEmail() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    }
    fetchUserEmail();
  }, []);

  const sortedLinks = linksData?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="w-full flex flex-col items-end gap-6">
      <div className="flex items-center justify-between w-full mt-2">
        <DrawerAddLink userEmail={userEmail} onRefresh={onRefresh} />
        <h2 className="text-base md:text-2xl font-bold text-end">
          الروابط المخصصة
        </h2>
      </div>

      <div className="flex flex-row flex-wrap justify-center gap-1.5 md:gap-4 w-full">
        {sortedLinks.length > 0 ? (
          sortedLinks.map((link) => (
            <Card
              key={link.id}
              className={`flex flex-col w-full max-w-[47%] md:max-w-sm group hover:shadow-lg transition-all duration-300 py-0 order-[${link.order}]`}
            >
              <CardContent className="p-2">
                <div
                  className="flex flex-col md:flex-row items-center gap-4"
                  dir="rtl"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={
                        link.image_url ||
                        "https://via.placeholder.com/80x80.png?text=No+Image"
                      }
                      alt={link.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-300 md:w-20 md:h-20 w-full h-30"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center items-start">
                    <h3 className="font-semibold text-lg text-start line-clamp-1 mb-2">
                      {link.title}
                    </h3>

                    <div className="flex gap-2 justify-end">
                      <DrawerEditLink linkData={link} onRefresh={onRefresh} />
                      <DrawerDeleteLink linkData={link} onRefresh={onRefresh} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <ExternalLink size={48} className="text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600">
                لا توجد روابط
              </h3>
              <p className="text-gray-500">ابدأ بإضافة أول رابط لك</p>
              <DrawerAddLink userEmail={userEmail} onRefresh={onRefresh} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Links;
