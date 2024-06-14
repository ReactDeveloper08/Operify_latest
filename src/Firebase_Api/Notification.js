import PushNotification, {Importance} from 'react-native-push-notification';
import NotificationHandler from './notificationHandler';
import {CommonActions} from '@react-navigation/native';
// import {NavigationContainerRef} from '@react-navigation/native';
import React from 'react';

export const navigationRef = React.createRef();

export default class notification {
  static attachNotification(onNotification) {
    PushNotification.configure({
      onNotification: function (notification) {
        // Log the title of the incoming notification
        console.log('Notification Title:', notification.title);

        // Call the provided onNotification callback
        onNotification(notification);

        if (notification.userInteraction) {
          const {title} = notification;
          if (title === 'Indent') {
            navigationRef.current.dispatch(
              CommonActions.navigate({name: 'Indent'}),
            );
          } else if (title === 'PO') {
            navigationRef.current.dispatch(
              CommonActions.navigate({name: 'PO'}),
            );
          } else {
            // Navigate to default screen
            navigationRef.current.dispatch(
              CommonActions.navigate({name: 'mytab'}),
            );
          }
        }
      },
    });
  }
  constructor(onRegister, onNotification) {
    this.lastId = 0;
    this.lastChannelCounter = 0;

    this.createDefaultChannels();

    NotificationHandler.attachRegister(onRegister);
    NotificationHandler.attachNotification(onNotification);

    // Clear badge number at start
    PushNotification.getApplicationIconBadgeNumber(function (number) {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });

    PushNotification.getChannels(function (channels) {
      console.log(channels);
    });
  }

  createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: 'Tppl', // (required)
        channelName: 'Tppl', // (required)
        channelDescription: 'A default Tppl', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created =>
        console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  createOrUpdateChannel() {
    this.lastChannelCounter++;
    PushNotification.createChannel(
      {
        channelId: 'Tppl',
        channelName: 'Tppl',
        channelDescription: `A Tppl to categorise your custom notifications. Updated at: ${Date.now()}`,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  popInitialNotification() {
    PushNotification.popInitialNotification(notification =>
      console.log('InitialNotication:', notification),
    );
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  requestPermissions() {
    return PushNotification.requestPermissions();
  }

  abandonPermissions() {
    PushNotification.abandonPermissions();
  }

  getDeliveredNotifications(callback) {
    PushNotification.getDeliveredNotifications(callback);
  }
}
componentDidMount = async () => {
    await this.checkAppVersion();
    this.handleSliderBox();
    // this.onRegister();
    AppState.addEventListener('change', this.handleAppStateChange);
  };
  handleAppStateChange = async nextAppState => {
    try {
      const {appState} = this.state;
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        await this.checkAppVersion();
      }

      this.setState({appState: nextAppState});
    } catch (error) {
      console.log(error.message);
    }
  };
  checkAppVersion = async () => {
    try {
      let buildNumber = null;
      let IosbuildNumber = null;
      if (Platform.OS === 'ios') {
        IosbuildNumber = Number(DeviceInfo.getBuildNumber());
      } else {
        buildNumber = Number(deviceInfoModule.getBuildNumber());
      }
      console.log('====================================');
      console.log('dada', buildNumber);
      console.log('====================================');

      let params = {
        IosbuildNumber: IosbuildNumber,
        build_no: buildNumber,
      };

      const response = await makeRequest(
        BASE_URL + '/mobile/versioncheck',
        params,
      );
      const {success, app_url, message, app_url_ios} = response;
      console.log('====================================');
      console.log('dada111', response);
      console.log('====================================');

      if (success === false) {
        this.setState({isUpdateVisible: true});
        const storeUrl = Platform.OS === 'ios' ? app_url_ios : app_url;
        this.setState({isStoreUrl: storeUrl});
      }
    } catch (error) {
      console.error(error);
    }
  };
