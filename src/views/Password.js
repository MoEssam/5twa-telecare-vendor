import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, regular, bold, api_url, vendor_login, vendor_forget_password } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { StatusBar } from '../components/StatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loader from '../components/Loader';
import { connect } from 'react-redux'; 
import { updateVendorProfilePicture } from '../actions/AuthFunctionActions';

const Password = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false); 

  const login_validation = async() =>{
    if(password == ""){
      alert('Please enter Password.')
      await setValidation(false);
    }else{
      await setValidation(true);
      login();
    }
  }

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const login = async() => {
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + vendor_login,
      data:{ phone_with_code: phone_with_code_value , fcm_token: global.fcm_token, password: password }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        saveData(response.data)
      }else{
        alert('Please enter correct Password')
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const saveData = async(data) =>{
    try{
        await AsyncStorage.setItem('id', data.result.id.toString());
        await AsyncStorage.setItem('owner_name', data.result.owner_name.toString());
        await AsyncStorage.setItem('email', data.result.email.toString());
        await AsyncStorage.setItem('store_name', data.result.store_name.toString());
        await AsyncStorage.setItem('phone_number', data.result.phone_number.toString());
        await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
        await AsyncStorage.setItem('profile_picture', data.result.profile_picture.toString());
        await AsyncStorage.setItem('hospital_id', data.result.hospital_id.toString());
        await AsyncStorage.setItem('document_approved_status', data.result.document_approved_status.toString());
        await AsyncStorage.setItem('address_update_status', data.result.address_update_status.toString());
        
        global.id = await data.result.id.toString();
        global.owner_name = await data.result.owner_name.toString();
        global.email = await data.result.email.toString();
        global.store_name = await data.result.store_name.toString();
        global.phone_number = await data.result.phone_number.toString();
        global.phone_with_code = await data.result.phone_with_code.toString();
        await props.updateVendorProfilePicture( data.result.profile_picture.toString());
        global.hospital_id = await data.result.hospital_id.toString();
        global.document_approved_status = await data.result.document_approved_status.toString();
        global.address_update_status = await data.result.address_update_status.toString();
        await home();
      }catch (e) {
        alert(e);
    }
  }

  const home = async() => {
    navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }

  const forgot_password = async() =>{
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + vendor_forget_password,
      data:{ phone_with_code: phone_with_code_value }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        navigation.navigate('Otp',{ data : response.data.result.otp, type: 2, id : response.data.result.id })
      }else{
        alert(response.data.message)
      }
    })
    .catch(error => {
      setLoading(false);
      alert(error);
    });
  }

return (
 <SafeAreaView style={styles.container}>
  <StatusBar/>
  <Loader visible={loading} />
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
      <View>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'10%' , justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Welcome to {app_name}</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>Please enter your password to access your account</Text>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Enter your password"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={{ margin:20 }}/>
        <TouchableOpacity onPress={login_validation} style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Submit</Text>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <TouchableOpacity onPress={forgot_password}> 
          <Text style={{ color:colors.theme_fg, fontFamily:regular, alignSelf:'center', fontSize:12}}>Forgot Password</Text>
        </TouchableOpacity>
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
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
  },
  textFieldIcon: {
    padding:5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontFamily:regular,
    fontSize:14,
    color:colors.theme_fg_two
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
  },
});

function mapStateToProps(state){
  return{
    vendor_profile_picture : state.auth_function.vendor_profile_picture,
  };
}

const mapDispatchToProps = (dispatch) => ({
	updateVendorProfilePicture: (data) => dispatch(updateVendorProfilePicture(data))

});

export default connect(mapStateToProps,mapDispatchToProps)(Password);