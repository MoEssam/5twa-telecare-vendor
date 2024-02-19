import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import * as colors from "../assets/css/Colors";
import { bold, logo, api_url, app_settings } from "../config/Constants";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { StatusBar } from "../components/StatusBar";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, { Importance } from "react-native-push-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { connect } from "react-redux";
import { updateVendorProfilePicture } from "../actions/AuthFunctionActions";

const Splash = (props) => {
  const navigation = useNavigation();

  useEffect(() => {
    get_app_settings();
  }, []);

  const get_app_settings = async () => {
    axios({
      method: "get",
      url: api_url + app_settings,
    })
      .then(async (response) => {
        await configure();
        await channel_create();
        await saveData(response.data.result);
        console.log("response.data.result", response.data.result);
      })
      .catch((error) => {
        alert("Sorry something went wrong");
      });
  };

  const saveData = async (data) => {
    const id = await AsyncStorage.getItem("id");
    const owner_name = await AsyncStorage.getItem("owner_name");
    const store_name = await AsyncStorage.getItem("store_name");
    const phone_number = await AsyncStorage.getItem("phone_number");
    const phone_with_code = await AsyncStorage.getItem("phone_with_code");
    const profile_picture = await AsyncStorage.getItem("profile_picture");
    const online_status = await AsyncStorage.getItem("online_status");
    const hospital_id = await AsyncStorage.getItem("hospital_id");
    const document_approved_status = await AsyncStorage.getItem(
      "document_approved_status"
    );
    const address_update_status = await AsyncStorage.getItem(
      "address_update_status"
    );

    global.currency = await data.default_currency;
    global.delivery_charge_per_km = await data.delivery_charge_per_km;
    global.app_name = data.app_name;
    global.currency_short_code = data.currency_short_code;
    global.user_type = data.user_type;
    global.mode = data.mode;

    if (id !== null) {
      global.id = await id;
      global.owner_name = await owner_name;
      global.store_name = await store_name;
      global.phone_number = await phone_number;
      global.phone_with_code = await phone_with_code;
      global.online_status = await online_status;
      global.hospital_id = hospital_id;
      global.document_approved_status = document_approved_status;
      global.address_update_status = address_update_status;
      await props.updateVendorProfilePicture(profile_picture);
      await navigate();
    } else {
      global.id = 0;
      navigate();
    }
  };

  const navigate = async () => {
    if (global.id) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "LoginHome" }],
        })
      );
    }
  };

  const channel_create = () => {
    PushNotification.createChannel(
      {
        channelId: "medical_booking", // (required)
        channelName: "Booking", // (required)
        channelDescription: "Medical Booking Solution", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "uber.mp3", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  const configure = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token.token);
        global.fcm_token = token.token;
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  return (
    <View style={styles.background}>
      <StatusBar />
      <View style={styles.logo_container}>
        <Image style={styles.logo} source={logo} />
      </View>
      <Text style={styles.spl_text}>5TWA Care Pharmacy</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.theme_fg_three,
  },
  logo_container: {
    height: 190,
    width: 190,
  },
  logo: {
    height: undefined,
    width: undefined,
    flex: 1,
  },
  spl_text: {
    fontFamily: bold,
    fontSize: 20,
    color: colors.theme_fg,
    letterSpacing: 2,
  },
});

function mapStateToProps(state) {
  return {
    vendor_profile_picture: state.auth_function.vendor_profile_picture,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateVendorProfilePicture: (data) =>
    dispatch(updateVendorProfilePicture(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
