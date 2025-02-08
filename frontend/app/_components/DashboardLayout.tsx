'use client';
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconHome, IconUpload, IconLogout } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

interface DecodedToken {
  email: string;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token) as DecodedToken;
        setUserEmail(decoded.email);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    Cookies.remove('accessToken');
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-[#121212]">
      <div className="relative z-10">
        <Sidebar>
          <SidebarBody>
            <div className="flex flex-col h-full">
              <div className="flex flex-col gap-2 mt-8">
                <SidebarLink
                  link={{
                    label: "Home",
                    href: "/",
                    icon: <IconHome className="h-4 w-4 text-neutral-500" />,
                  }}
                />
                <SidebarLink
                  link={{
                    label: "Upload",
                    href: "/pages/upload",
                    icon: <IconUpload className="h-4 w-4 text-neutral-500" />,
                  }}
                />
              </div>
              
              {userEmail && (
                <div className="mt-auto mb-4 flex flex-col gap-2">
                  <SidebarLink
                    link={{
                      label: userEmail,
                      href: "#",
                      icon: <div className="h-4 w-4 rounded-full bg-neutral-500" />,
                    }}
                    className="text-neutral-400"
                  />
                  <SidebarLink
                    link={{
                      label: "Logout",
                      href: "#",
                      icon: <IconLogout className="h-4 w-4 text-neutral-500" />,
                    }}
                    className="text-red-500 hover:text-red-400"
                    props={{ 
                      onClick: handleLogout,
                      href: "#"
                    }}
                  />
                </div>
              )}
            </div>
          </SidebarBody>
        </Sidebar>
      </div>
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>
    </div>
  );
} 