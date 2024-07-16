import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
// import "./push";
// import { message } from './firebase';
// import { getToken, onMessage } from 'firebase/messaging';

function App() {
  const [token, setToken] = useState("Hello");
  useEffect(() => {
    document.addEventListener(
      "deviceready",
      () => {
        var permissions = window.cordova.plugins.permissions;
        // handleIncomingCall();
        window.cordova.plugins.backgroundMode.enable();
        window.cordova.plugins.backgroundMode.overrideBackButton();
        window.cordova.plugins.backgroundMode.on("activate", function () {
          // Perform the background task
          console.log("Background Mode Activated");
          pushNotification();
          OneSignalInit();
          // You can also change the settings of background mode here
          // For example:
          window.cordova.plugins.backgroundMode.setDefaults({ silent: true });
        });
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
      },
      false
    );
  }, []);

  function OneSignalInit() {
    // Uncomment to set OneSignal device logging to VERBOSE
    // window.plugins.OneSignal.setLogLevel(6, 0);

    // NOTE: Update the setAppId value below with your OneSignal AppId.
    window.cordova.plugins.OneSignal.setAppId(
      "0e1a82fe-ef70-4709-b6fa-d091d50c1b93"
    );
    window.cordova.plugins.OneSignal.setNotificationOpenedHandler(function (
      jsonData
    ) {
      console.log("notificationOpenedCallback: " + JSON.stringify(jsonData));
      handleIncomingCall();
    });

    //Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
    window.cordova.plugins.OneSignal.promptForPushNotificationsWithUserResponse(
      function (accepted) {
        console.log("User accepted notifications: " + accepted);
        handleIncomingCall();
      }
    );
  }

  function pushNotification() {
    window.cordova.plugins.backgroundMode.enable();
    const push = window.PushNotification.init({
      android: {
        senderID: "350708747450", // Replace with your Firebase Sender ID
        alert: true,
        badge: true,
        sound: true,
        voip: true,
      },
      ios: {
        // voip: true,
        alert: true,
        badge: true,
        sound: true,
        clearBadge: true,
      },
    });

    push.on("registration", (data) => {
      console.log("Registration ID:", data.registrationId);
      setToken(data.registrationId);
      // Send the registration ID to your server
    });

    push.on("notification", (data) => {
      console.log("Notification received:", data);
      // Handle the notification
      // alert(data.message); // For example, display an alert
      handleIncomingCall();
    });

    push.on("error", (e) => {
      console.error("Push notification error:", e.message);
      setToken("error");
    });
  }

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

    cordovaCall.sendCall(options.to, options.video);
    cordovaCall.setSpeakerphoneOn(true);
    cordovaCall.on("sendCall", onSuccess); // Listen on the 'sendCall' event
    setTimeout(function () {
      cordovaCall.endCall();
    }, 30000);
    cordovaCall.on("sendCall", function (info) {
      //info now contains the user id of the person you're trying to call
      setTimeout(function () {
        cordovaCall.connectCall();
      }, 5000);
    });
    cordovaCall.on("sendCallFailed", onError); // Listen on the 'sendCallFailed' event

    // cordovaCall.on('receiveCall', function (data) {
    // 	console.log('Receive call', data);
    // });
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
          Call
        </button>
        <button title="click" onClick={clickButtonReceive}>
          Receive
        </button>
        <label>Device Token</label>
        <input value={token} />
      </header>
    </div>
  );
}

export default App;
