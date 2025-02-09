'use client';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { IconHome, IconUpload, IconLogout, IconLogin } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

interface DecodedToken {
  email: string;
}

function LogoutButton() {
  const { open, animate } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    router.refresh();
    router.push('/');
  };

  return (
    <motion.div
      animate={{
        display: animate ? (open ? "flex" : "none") : "flex",
        opacity: animate ? (open ? 1 : 0) : 1,
      }}
      className="flex items-center gap-2 group/sidebar py-2 text-red-500 hover:text-red-400 cursor-pointer"
      onClick={handleLogout}
    >
      <IconLogout className="h-4 w-4 text-neutral-500" />
      <span className="text-sm group-hover/sidebar:translate-x-1 transition duration-150">Logout</span>
    </motion.div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

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
              
              <div className="mt-auto mb-4 flex flex-col gap-2">
                {userEmail ? (
                  <>
                    <SidebarLink
                      link={{
                        label: userEmail,
                        href: "#",
                        icon: <div className="h-4 w-4 rounded-full bg-neutral-500" />,
                      }}
                      className="text-neutral-400"
                    />
                    <LogoutButton />
                  </>
                ) : (
                  <SidebarLink
                    link={{
                      label: "Login",
                      href: "/pages/logini",
                      icon: <IconLogin className="h-4 w-4 text-neutral-500" />,
                    }}
                    className="text-blue-500 hover:text-blue-400"
                  />
                )}
              </div>
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

