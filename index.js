/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import crashlytics from '@react-native-firebase/crashlytics';
// // import analytics from '@react-native-firebase/analytics';



// // Initialize Crashlytics and Firebase
// if (!crashlytics().isCrashlyticsCollectionEnabled()) {
//   crashlytics().setCrashlyticsCollectionEnabled(true);
// }

// if (!analytics().isAnalyticsCollectionEnabled()) {
//   analytics().setAnalyticsCollectionEnabled(true);
// }

AppRegistry.registerComponent(appName, () => App);
