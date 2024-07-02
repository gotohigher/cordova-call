import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
// import './push';
// import { message } from './firebase';
// import { getToken, onMessage } from 'firebase/messaging';

function App() {
  useEffect(() => {
    document.addEventListener(
      "deviceready",
      () => {
        var permissions = window.cordova.plugins.permissions;
        // window.cordova.plugins.backgroundMode.enable();
        // window.cordova.plugins.backgroundMode.wakeUp();
        permissions.checkPermission(permissions.CALL_PHONE, function (status) {
          if (status.hasPermission) {
            console.log("Yes :D ");
          } else {
            console.warn("No :( ");

            permissions.requestPermission(
              permissions.CALL_PHONE,
              success,
              error
            );

            function error() {
              console.warn("Call permission is not turned on");
            }

            function success(status) {
              if (!status.hasPermission)
                console.warn("Call permission is not turned on");
            }
          }
        });
        console.log("Cordova is ready");
        const push = window.PushNotification.init({
          android: {
            // senderID: "350708747450", // Replace with your Firebase Sender ID
            // alert: true,
            // badge: true,
            // sound: true,
            // voip: true,
          },
          ios: {
            // voip: true,
            alert: true,
            badge: true,
            sound: true,
            clearBadge: true,
          },
        });

        push.on('registration', function(data) {
            // data.registrationId is the device token
            console.log('hellothere', data.registrationId);
        });

        push.on('notification', (data) => {
            console.log('Notification received:', data);
            // Handle the notification
            // alert(data.message); // For example, display an alert
            handleIncomingCall();
        });
    
        push.on('error', (e) => {
            console.error('Push notification error:', e.message);
        });
      },
      false
    );
  }, []);

  function handleIncomingCall() {
    // callData contains the data from the incoming call notification
    var cordovaCall = window.cordova.plugins.CordovaCall;
    console.log(`Incoming call from`);

    cordovaCall.receiveCall("John Doe");
    // Adding Event Listeners for the call
    cordovaCall.on("answer", function () {
      console.log("Call answered");
      // trigger further actions like establishing a connection to your VOIP server
    });

    cordovaCall.on("reject", function () {
      console.log("Call rejected");
      // handle call rejection
    });

    cordovaCall.on("hangup", function () {
      console.log("Call ended");
      // handle call hangup
    });
  }

  const clickButton = () => {
    console.log("here please");
    callFunction();
  };

  const clickButtonReceive = () => {
    var cordovaCall = window.cordova.plugins.CordovaCall;
    cordovaCall.receiveCall("David Marcus");
    cordovaCall.on("receiveCall", onSuccess);
  };

  const callFunction = () => {
    var options = {
      from: "John Doe", // Caller's name
      to: "Bye", // Callee's name
      video: false, // Enable video call
    };
    var cordovaCall = window.cordova.plugins.CordovaCall;
    console.log("cordova", cordovaCall);
    cordovaCall.sendCall(options.to);
    cordovaCall.on("sendCall", onSuccess); // Listen on the 'sendCall' event
  };

  function onSuccess(data) {
    console.log("Send call successful", data);
  }

  function onError(data) {
    console.error("Send call failed", data);
  }

  return (
    <div className="App">
      <header className="App-header">
        <button title="click" onClick={clickButton}>
          Call{" "}
        </button>{" "}
        <button title="click" onClick={clickButtonReceive}>
          Receive{" "}
        </button>{" "}
      </header>{" "}
    </div>
  );
}

export default App;
