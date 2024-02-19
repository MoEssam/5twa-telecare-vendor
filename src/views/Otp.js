import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold } from '../config/Constants';
import CodeInput from 'react-native-confirmation-code-input';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from '../components/StatusBar';

const Otp = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [otp_value, setOtpValue] = useState(route.params.data);
  const [type, setType] = useState(route.params.type);
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code);
  const [phone_number_value, setPhoneNumber] = useState(route.params.phone_number);
  const [id, setid] = useState(route.params.id); 

  const handleBackButtonClick= () => {
    navigation.goBack()
  }   

  useEffect(() => {
    if(global.mode == 'DEMO'){
      setTimeout(() => {
        check_otp(otp_value);
      }, 1000)
    }
  },[]);

  const check_otp = async(code) => {
    if (code != otp_value) {
      alert('Please enter valid OTP')
    }else if(type == 1) {
      navigation.navigate("Register", { phone_with_code_value:phone_with_code_value, phone_number_value:phone_number_value, })
    }else if(type == 2) {
      navigation.navigate("CreatePassword", { id:id, from:"otp" })
    }
  }

return(
  <SafeAreaView style={styles.container}>
    <StatusBar/>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
       <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'10%' , justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Enter OTP</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>Enter the 4 digit code that was sent to your phone number</Text>
        <View style={{ margin:10 }}/>
        <View style={styles.code}>
          <CodeInput
            useRef="codeInputRef2"
            keyboardType="numeric"
            codeLength={4}
            className='border-circle'
            autoFocus={false}
            codeInputStyle={{ fontWeight: '800' }}
            activeColor={colors.theme_bg}
            inactiveColor={colors.theme_bg}
            onFulfill={(isValid) => check_otp(isValid)}
          />
        </View>
        <View style={{ margin:20 }}/>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default Otp;