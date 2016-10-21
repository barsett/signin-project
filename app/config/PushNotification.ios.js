'use-strict'

import store from '../stores/AppStore';
import { setPushNotificationToken } from '../actions/AuthAction'

const pushOption = {
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
          console.log( 'TOKEN:', token );

          //dispatch action to set token in the current state
          store.dispatch(setPushNotificationToken(token));
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
          console.log( 'NOTIFICATION:', notification );
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },

      /**
        * IOS ONLY: (optional) default: true
        * - Specified if permissions will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      popInitialNotification: true,
      requestPermissions: true,

};

export default pushOption;
