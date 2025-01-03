"use client";

import axiosInstance from "@/axios";
import { useUserStore } from "@/providers/UserStoreProvider";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

const authPaths = ["/signin", "/signup"];

function CheckAuthentication({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathName = usePathname();
  const setUser = useUserStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuthorizedUser() {
      try {
        const { data } = await axiosInstance.get(
          "/api/user/auth/check-authentication"
        );

        if (data.user) {
          setUser(data.user);
          if (authPaths.includes(pathName)) {
            router.replace("/home");
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthorizedUser();
  }, [setUser, router, pathName]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default CheckAuthentication;
