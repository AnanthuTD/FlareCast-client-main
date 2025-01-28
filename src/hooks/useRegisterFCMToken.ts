'use client'

import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import axiosInstance from '@/axios';
import { messaging } from '@/lib/firebaseConfig';

const useRegisterFCMToken = (url: string) => {
  useEffect(() => {
    const registerFCMToken = async () => {
      try {
        const fcmToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY });

        console.log('fcmToken: ', fcmToken);

        if (fcmToken) {
          // Send token to your server to associate it with the user
          await axiosInstance.post(url, {
            fcmToken,
          });
        }
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    registerFCMToken();
  }, [url]);
};

export default useRegisterFCMToken;
