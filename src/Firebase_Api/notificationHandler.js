import React from 'react';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {getUniqueId} from 'react-native-device-info';
import {KEYS, storeData,getData} from '../api/User_Preference';
import {BASE_URL, makeRequest} from '../api/Api_info';
import messaging from '@react-native-firebase/messaging';

class NotificationHandler {
  async onRegister() {
    try {
      const erpiD = await getData(KEYS.USER_INFO);
      // console.log('============ggrgrg===================', erpiD.erpID);
      let fcmToken = '';
      if (Platform.OS === 'android') {
        fcmToken = await messaging().getToken();
      } else if (Platform.OS === 'ios') {
        fcmToken = await messaging().getAPNSToken();
      }

      console.log('FCM Token:', fcmToken);

      let uniqueId = getUniqueId();
      console.log('Unique Device ID:', uniqueId);

      const params = {
        token: fcmToken,
        uniqueDeviceId: uniqueId,
        erpID: erpiD.erpID

      
      };

      const response = await makeRequest(
        BASE_URL + '/mobile/uploadToken',
        params,
      );

      console.log('Response:', response);

      if (response.success) {
          // await storeData(KEYS.USER_INFO);
      }
    } catch (error) {
      console.error('Error uploading token:', error);
    }
  }

  onNotification(notification) {
    if (typeof this._onNotification === 'function') {
      this._onNotification(notification);
    }
  }

  onAction(notification) {
    console.log('Notification action received:');
    console.log(notification.action);
    console.log(notification);

    if (notification.action === 'Yes') {
      PushNotification.invokeApp(notification);
    }
  }

  onRegistrationError(err) {
    console.log('Registration error:', err);
  }

  attachRegister(handler) {
    this._onRegister = handler;
  }

  attachNotification(handler) {
    this._onNotification = handler;
  }
}

const handler = new NotificationHandler();

PushNotification.configure({
  onRegister: handler.onRegister.bind(handler),
  onNotification: handler.onNotification.bind(handler),
  onAction: handler.onAction.bind(handler),
  onRegistrationError: handler.onRegistrationError.bind(handler),
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

export default handler;
