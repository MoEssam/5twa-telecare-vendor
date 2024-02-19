import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, PermissionsAndroid, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, height_50, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, location, vendor_address, api_url, vendor_details } from '../config/Constants';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader'; 

const AddAddress = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [mapRegion, setmapRegion] = useState({"latitude": 37.4220936, "latitudeDelta": 0.015, "longitude": -122.083922, "longitudeDelta": 0.0152});
  const mapRef = useRef(null);
  const [address, setAddress] = useState('Please select your location...');
  const [pin_code, setPinCode] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0); 
  const [landmark, setLandmark] = useState('');
  const [validation,setValidation] = useState(false); 
  const [location_value, setLocationValue] = useState('');
  const [address_status, setAddressStatus] = useState(0);
  
  const handleBackButtonClick= () => {
    navigation.goBack()
  }
  
  const ref_variable = async() =>{
    await setTimeout(() => {
      mapRef.current.focus();
    }, 200);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await requestCameraPermission();
      await get_address();
    });
    return unsubscribe;
  },[]);

  const requestCameraPermission = async() =>{
    if(Platform.OS === "android"){
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': global.app_name+' needs to Access your location for tracking'
            }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await findType();
        } else {
            alert(granted)
        }
    } catch (err) {
        await handleBackButtonClick();
    }
    }else{
      await getInitialLocation();
    }
  }

  const findType = async() =>{
    if(address_status == 0){
      await getInitialLocation();
    }else{
      await get_address();
    }
  }

  const getInitialLocation = async() =>{
    // console.log("did i get my current location?",position,LATITUDE_DELTA,LONGITUDE_DELTA)
    await Geolocation.getCurrentPosition( async(position) => {
      let region = {
        latitude:       await position.coords.latitude,
        longitude:      await position.coords.longitude,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      console.log("didn't",region)
      setmapRegion( region )
      
    }, error => console.log(error) , 
    {enableHighAccuracy: false, timeout: 10000 });
  }

  const onRegionChange = async(value) => {
    console.log("setting address")
    setAddress( 'Please wait...' );
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
           if(responseJson.results[0].formatted_address != undefined){
              let address = responseJson.results[0].address_components;
              let pin_code = address[address.length - 1].long_name;
              setPinCode(  pin_code );
              setAddress( responseJson.results[0].formatted_address );
              setLatitude(  value.latitude );
              setLongitude(  value.longitude );
           }else{
            setAddress( 'Sorry something went wrong' );
            console.log(responseJson)
           }
    }) 
  }  

  const address_validation = async() =>{
    if(landmark == ""){
      alert('Please enter the landmark')
      await setValidation(false);
    }else{
      await setValidation(true);
      add_address();
    }
  }

  const add_address = async () => {
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + vendor_address,
      // {"latitude": 37.4220936, "latitudeDelta": 0.015, "longitude": -122.083922, "longitudeDelta": 0.0152}
      data:{ id:global.id, address:address.toString(), manual_address:landmark, latitude:37.4220936, longitude:-122.083922 }

      // data:{ id:global.id, address:address.toString(), manual_address:landmark, latitude:latitude, longitude:longitude }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        handleBackButtonClick();
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
      console.log("add address error is",error)
      console.log(api_url+vendor_address)
      console.log(global.id, address.toString(), landmark, latitude, longitude )
    });
    }

    const get_address = async () => {
      Keyboard.dismiss();
      setLoading(true);
      await axios({
        method: 'post', 
        url: api_url + vendor_details,
        data:{ vendor_id: global.id }
      })
      .then(async response => {
        setLoading(false);
        if(response.data.status == 1){
          let result = response.data.result;
          setAddressStatus(result.address_update_status);
          if(result.address_update_status == 1){
            await setLandmark(result.manual_address);
            await setAddress(result.address);
            await setLatitude(result.latitude);
            await setLongitude(result.longitude);
            await setLocation(response.data.result);
          }
        }
      })
      .catch(error => {
        setLoading(false);
        alert('Sorry something went wrong')
      });
    }

    const setLocation = (data) =>{
      let region = {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      setmapRegion(region);
    }


  return (
    
  <SafeAreaView style={styles.container}>
    <ScrollView style={{ padding:10 }} showsVerticalScrollIndicator={false} >
      <Loader visible={loading} />
      <View style={{alignItems:'center', justifyContent:'center'}} >
        <MapView
          provider={PROVIDER_GOOGLE} 
          ref={mapRef}
          style={{width: '100%',height: height_50}}
          initialRegion={ mapRegion }
          onRegionChangeComplete={region => onRegionChange(region)}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
        </MapView>
        <View style={{position: 'absolute',}}>
            <View style={{height:30, width:25, top:-15 }} >
              <Image
                style= {{flex:1 , width: undefined, height: undefined}}
                source={location}
              />
            </View>
          </View>
        <View style={{position: 'absolute',}}>
          <View style={{height:30, width:25, top:-15 }} >
            <Image
              style= {{flex:1 , width: undefined, height: undefined}}
              source={location}
            />
          </View>
        </View>
      </View>
      <View style={{ marginTop:20 }} />
        <View style={{ flexDirection:'row' }} >
          <Text style={styles.landmark_label} >LandMark</Text>
        </View> 
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Enter your landmark"
            underlineColorAndroid="grey"
            onChangeText={text => setLandmark(text)}
            value={landmark}
          />
        </View>
        <View style={{ flexDirection:'row' }} >
          <Text style={{fontSize:15, fontFamily: bold, color:colors.theme_fg_two}} >Address</Text>
        </View>
        <View style={{ flexDirection:'row' }} >
          <Text style={{fontSize:15, marginTop:5,fontFamily: regular, color:colors.theme_fg_two}} >
            {address}
          </Text>
        </View>
        <View style={{ margin:30 }} />
        <View style={{ alignItems:'center', justifyContent:'center'}}>
        <TouchableOpacity onPress={address_validation.bind(this)} style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Add Address</Text>
        </TouchableOpacity>
      </View>
        </ScrollView>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:colors.theme_bg_three,
    flex:1
  },
  button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'94%',
    marginLeft:'3%',
    marginRight:'3%',
    height:45,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
    height: 45
  },
  textField: {
    flex: 1,
    padding: 1,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontSize:14,
    color:colors.grey,
    fontFamily:regular
  },
  landmark_label:{
    fontSize:15, 
    fontFamily:bold, 
    color:colors.theme_fg_two 
  },
});

export default AddAddress;
