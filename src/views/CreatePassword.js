import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, api_url, vendor_reset_password } from '../config/Constants';
import { StatusBar } from '../components/StatusBar';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';

const CreatePassword = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [id, setid] = useState(route.params.id); 
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [validation,setValidation] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [from_screen, setFromScreen] = useState(route.params.from); 

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const reset_validation = async() =>{
    if(password == ""){
      alert('Please enter Password.')
      await setValidation(false);
    }else if(confirm_password == ""){
      alert('Please enter confirm Password.')
      await setValidation(false);
    }else if(password != confirm_password){
      alert('Password mismatch.')
      await setValidation(false);
    }else{
      await setValidation(true);
      reset_password();
    }
  }

  const reset_password = async() =>{
    console.log({ id: id, password: password })
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + vendor_reset_password,
      data:{ id: id, password: password }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        navigate()
      }else{
        alert(response.data.message)
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const navigate = async() => {
    if(from_screen == "otp"){
      navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: "Phone" }],
        })
      );
    }else{
      handleBackButtonClick();
    }
    
  }

return( 
  <SafeAreaView style={styles.container}>
    <StatusBar/>
    <Loader visible={loading} />
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
      <View>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'10%' , justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Create Password</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>Enter your new password for login</Text>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Password"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
          />
        </View>
         <View style={{ margin:5 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Confirm Password"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setConfirmPassword(text)}
          />
        </View>
        <View style={{ margin:20 }}/>
        <TouchableOpacity onPress={reset_validation}  style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Submit</Text>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
    color:colors.theme_fg_two,
    fontSize:14,
    fontFamily:regular
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

export default CreatePassword;