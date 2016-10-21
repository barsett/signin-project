'use-strict'
import PushNotification from 'react-native-push-notification';
import {SENDER_ID, REMINDER_PERIOD} from './Config';
import store from '../stores/AppStore';
import { setPushNotificationToken } from '../actions/AuthAction'
import { runFetchAvailTask } from '../actions/TaskAction'
import { runFetchApproval } from '../actions/ApprovalAction';

import { Actions } from 'react-native-router-flux';

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

          if (store.getState().getIn(['currentUser', 'roles']) === 'OTORISATOR'){
            //store.dispatch(runFetchApproval(true));
          } else {
            store.dispatch(runFetchAvailTask(true));
          }


          if (notification.foreground){
            // show toast// send local notification
            console.log( 'Sending local notification' );
            PushNotification.localNotification({
              title: notification.title,
              message: notification.message,
              kodeSurvey: notification.kodeSurvey,
            });
          }


          // disable and replace by server based notification
          // schedule reminder before tenggat waktu
          // const reminder = 'SLA untuk ' + notification.title + ' akan habis.';
          // const tenggatResponse = Number(notification.tenggatResponse);
          // const reminderDetail = 'Tenggat Response: ' + new Date(tenggatResponse).toLocaleString();
          // PushNotification.localNotificationSchedule({
          //   title: reminder,
          //   message: reminderDetail,
          //   date: new Date(tenggatResponse - REMINDER_PERIOD),
          // });

          // if click from outside application then go to daftar tugas
          if (notification.userInteraction){
            // check user role
            if (store.getState().getIn(['currentUser', 'roles']) === 'OTORISATOR'){
              // check if data is already fetch
              Actions.approvalList({disableReload: true});

              store.dispatch(runFetchApproval(true))
              .then(() => {
                const approvalDS = store.getState().getIn(['approvals','dataSource']);

                const index = approvalDS.findIndex((item) => {
                  if (item.getIn(['survey','kodeSurvey']) === notification.kodeSurvey){
                    return true;
                  } else {
                    return false;
                  }
                });

                console.log("Notification Found Data: ", index);

                if (index >= 0){
                  // if found go to ask
                  const task = approvalDS.get(index).toJS();
                  Actions.detailOtorisasi({data: task});
                }

              });



            } else {
              //fetch daftar tugas
              Actions.task();
            }

          }
      },

      // ANDROID ONLY: GCM Sender ID.
      senderID: SENDER_ID,

};

export default pushOption;
