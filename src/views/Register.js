import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, regular, bold, vendor_register, api_url } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux'; 
import { updateVendorProfilePicture } from '../actions/AuthFunctionActions';

const Register = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code_value);
  const [phone_number_value, setPhoneNumber] = useState(route.params.phone_number_value);
  const [owner_name, setOwnerName] = useState("");
  const [store_name, setStoreName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false); 
  const [confirm_password, setConfirmPassword] = useState("");

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const register_validation = async() =>{
    if(owner_name=="" || store_name=="" || email==""){
      alert('Please fill the details.')
      await setValidation(false);
    }else if(password == ""){
      alert('Please enter Password.')
      await setValidation(false);
    }else if(confirm_password == ""){
      alert('Please enter Confirm Password.')
      await setValidation(false);
    }else if(password != confirm_password){
      alert('Password mismatch.')
      await setValidation(false);
    }else{
      await setValidation(true);
      registration();
    }
  }

  const registration = async() => {
    console.log({ phone_number:phone_number_value , fcm_token:global.fcm_token, phone_with_code:phone_with_code_value, password:password, owner_name:owner_name, store_name:store_name, email:email })
    await Keyboard.dismiss();
    await setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + vendor_register,
      data:{ phone_number:phone_number_value , fcm_token:global.fcm_token, phone_with_code:phone_with_code_value, password:password, owner_name:owner_name, store_name:store_name, email:email }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        saveData(response.data)
      }else{
        alert(response.data.message)
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
        await AsyncStorage.setItem('email', data.result.email.toString());
        await AsyncStorage.setItem('owner_name', data.result.owner_name.toString());
        await AsyncStorage.setItem('store_name', data.result.store_name.toString());
        await AsyncStorage.setItem('phone_number', data.result.phone_number.toString());
        await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
        await AsyncStorage.setItem('profile_picture', data.result.profile_picture.toString());
        
        global.id = await data.result.id.toString();
        global.email = await data.result.email.toString();
        global.owner_name = await data.result.owner_name.toString();
        global.store_name = await data.result.store_name.toString();
        global.phone_number = await data.result.phone_number.toString();
        global.phone_with_code = await data.result.phone_with_code.toString();
        await props.updateVendorProfilePicture( data.result.profile_picture.toString());
        
        await navigate();
      }catch (e) {
        alert(e);
    }
  }

  const navigate = async() => {
    navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }

return( 
  <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
    <Loader visible={loading} />
      <View>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'10%' , justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Welcome to {app_name}</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>Please enter your details for registration.</Text>
        <View style={{ margin:10 }}/>
         <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Owner Name"
            underlineColorAndroid="transparent"
            onChangeText={text => setOwnerName(text)}
          />
        </View>
        <View style={{ margin:5 }}/>
         <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Store Name"
            underlineColorAndroid="transparent"
            onChangeText={text => setStoreName(text)}
          />
        </View>
        <View style={{ margin:5 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Email"
            underlineColorAndroid="transparent"
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View style={{ margin:5 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Password"
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
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setConfirmPassword(text)}
          />
        </View>
        <View style={{ margin:20 }}/>
        <TouchableOpacity onPress={register_validation.bind(this)}  style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold}}>Submit</Text>
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
    backgroundColor:colors.theme_bg_three
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

export default connect(mapStateToProps,mapDispatchToProps)(Register);
