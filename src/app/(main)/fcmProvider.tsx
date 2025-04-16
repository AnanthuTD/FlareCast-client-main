'use client'

import useFCM, { FCMRoles } from "@/hooks/useFCM";
import useRegisterFCMToken from "@/hooks/useRegisterFCMToken";
import React from "react";

function FCMProvider({ children }: { children: React.ReactNode }) {
	useRegisterFCMToken("/api/notifications/register/fcm");
	useFCM(FCMRoles.USER);
	
	return <>{children}</>;
}

export default FCMProvider;
