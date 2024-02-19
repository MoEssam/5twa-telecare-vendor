import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import * as colors from "../assets/css/Colors";
import Icon, { Icons } from "../components/Icons";
import {
  regular,
  bold,
  vendor_check_phone,
  api_url,
} from "../config/Constants";
import PhoneInput from "react-native-phone-input";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { updateAmbulancePhoneNumber } from "../actions/AuthFunctionActions";
import { StatusBar } from "../components/StatusBar";
import Loader from "../components/Loader";
import axios from "axios";

const Phone = (props) => {
  const navigation = useNavigation();
  const phone_ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState(false);

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const phone_validation = async () => {
    Keyboard.dismiss();
    if (
      "+" + phone_ref.current.getCountryCode() ==
      phone_ref.current.getValue()
    ) {
      await setValidation(false);
      alert("Please enter your phone number");
    } else if (!phone_ref.current.isValidNumber()) {
      await setValidation(false);
      alert("Please enter valid phone number");
    } else {
      await setValidation(true);
      check_phone(phone_ref.current.getValue());
    }
  };

  const check_phone = async (phone_with_code) => {
    await Keyboard.dismiss();
    await setLoading(true);

    await axios({
      method: "post",
      url: api_url + vendor_check_phone,
      data: { phone_with_code: phone_with_code },
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data.result.is_available == 1) {
          navigation.navigate("Password", { phone_with_code: phone_with_code });
        } else {
          let phone_number = phone_ref.current.getValue();
          phone_number = phone_number.replace(
            "+" + phone_ref.current.getCountryCode(),
            ""
          );
          navigation.navigate("Otp", {
            data: response.data.result.otp,
            type: 1,
            phone_with_code: phone_with_code,
            phone_number: phone_number,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong");
      });
  };

  const terms_and_conditions = () => {
    navigation.navigate("TermsAndConditions");
  };
  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <StatusBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={{ margin: 20 }} />
        <Text
          style={{ fontSize: 20, color: colors.theme_fg_two, fontFamily: bold }}
        >
          Enter your phone number
        </Text>
        <View style={{ margin: 10 }} />
        <View style={styles.textFieldcontainer}>
          <PhoneInput
            ref={phone_ref}
            style={{ borderColor: colors.theme_fg_two }}
            flagStyle={styles.flag_style}
            initialCountry="ae"
            offset={10}
            textStyle={styles.country_text}
            textProps={{
              placeholder: "Enter your phone number",
              placeholderTextColor: colors.grey,
            }}
            autoFormat={true}
          />
        </View>
        <View style={{ margin: 20 }} />
        <Text style={{ fontSize: 14, color: colors.grey, fontFamily: regular }}>
          By continuing, you agree to our
        </Text>
        <View style={{ margin: 2 }} />
        <TouchableOpacity
          onPress={terms_and_conditions}
          style={{
            borderBottomWidth: 0.3,
            borderColor: colors.theme_fg_two,
            width: "45%",
          }}
        >
          <Text
            style={{
              color: colors.theme_fg_two,
              fontFamily: regular,
              fontSize: 14,
              letterSpacing: 0.2,
            }}
          >
            Terms & Conditions
          </Text>
        </TouchableOpacity>
        <View style={{ margin: 20 }} />
        <TouchableOpacity
          onPress={phone_validation.bind(this)}
          style={styles.button}
        >
          <Text
            style={{
              color: colors.theme_fg_three,
              fontFamily: bold,
              fontSize: 14,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
        <View style={{ margin: 10 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
  },
  textFieldIcon: {
    padding: 5,
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor: colors.theme_bg_three,
    color: colors.theme_fg_two,
    fontFamily: regular,
    fontSize: 14,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.theme_bg,
  },
  flag_style: {
    width: 38,
    height: 24,
  },
  country_text: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor: colors.theme_bg_three,
    color: colors.theme_fg_two,
    fontFamily: regular,
    fontSize: 14,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
  },
});

function mapStateToProps(state) {
  return {
    update_ambulance_phone_number:
      state.auth_function.update_ambulance_phone_number,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateAmbulancePhoneNumber: (data) =>
    dispatch(updateAmbulancePhoneNumber(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Phone);
