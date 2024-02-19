import React from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity  } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, login_image } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import PhoneInput from 'react-native-phone-input';
import { StatusBar } from '../components/StatusBar';

const LoginHome = () => {

  const navigation = useNavigation();

  const phone = () => {
    navigation.navigate("Phone")
  }

	return(
    <SafeAreaView style={styles.container}>
      <StatusBar/>
      <View style={styles.image_style} >
        <Image style= {{ height: undefined,width: undefined,flex: 1, }} source={login_image} />
      </View>
      <View style={{ margin:10 }} />
      <View style={{ margin:20 }} >
        <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:15, }}>Let's get started! Enter your mobile number</Text>
        <View style={{ margin:10 }} />
        <TouchableOpacity onPress={phone.bind(this)} activeOpacity={1} style={styles.textFieldcontainer}>
          <PhoneInput style={{ borderColor:colors.theme_fg_two }} flagStyle={styles.flag_style}  initialCountry="ae" offset={10} textStyle={styles.country_text} textProps={{ placeholder: "Enter your phone number", placeholderTextColor : colors.grey }} disabled={true} autoFormat={true} />
        </TouchableOpacity>
        <View style={{ margin:10 }} />
        <View>
          <Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:14}}>Signing in now</Text>
        </View>
        <View style={{ margin:10 }} />
      </View>
    </SafeAreaView>  
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  image_style: {
    height:'70%',
    width:'100%',
  },
  textFieldcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
    padding:10,
    backgroundColor:colors.theme_bg_three
  },
  textFieldIcon: {
    padding:5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  country_text:{
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    color:colors.theme_fg_two,
    fontFamily:regular,
    fontSize:14
  },
  
});


export default LoginHome;