import React, { useState, useEffect} from 'react';
import { StyleSheet, Image,  View, SafeAreaView, Text,  ScrollView, TouchableOpacity, Switch, FlatList, Alert } from 'react-native';
import * as colors from '../assets/css/Colors';
import {  dashboard, regular, bold, change_online_status, api_url, img_url, dash_banner, dash_completed_icon, dash_active_icon, dash_wallet_icon, dash_earnings_icon, vendor_details} from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import CardView from 'react-native-cardview'
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { connect } from 'react-redux'; 
import Moment from 'moment';

const Home = (props) => {
  const navigation = useNavigation();
  const [switch_value, setSwitchValue] = useState(true);
  const [loading, setLoading] = useState(false);
  const [active_orders, setActiveOrders] = useState(0);
  const [completed_orders, setCompletedOrders] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [earnings, setEarnings] = useState(0); 
  const [order_list, setOrderList] = useState([]);

  useEffect(() => {
    if(global.online_status == 1){
      setSwitchValue(true);
    }else{
      setSwitchValue(false);
    }
    const unsubscribe = navigation.addListener('focus', async () => {
      await view_profile();
      await get_dashboard();
    });
    return unsubscribe;
  },[]);

  const add_address = () =>{
    navigation.navigate("AddAddress");
  }

  const toggleSwitch = async(value) => {
    if(value){
      await setSwitchValue(value);  
      await online_status(1);
      await saveData(1);
    }else{
      await setSwitchValue( value );  
      await online_status(0);
      await saveData(0);
    }  
  }

  const view_profile = async () => {
    await axios({
      method: 'post', 
      url: api_url + vendor_details,
      data:{ vendor_id:global.id }
    })
    .then(async response => {
      global.address_update_status = response.data.result.address_update_status;
      global.document_approved_status = response.data.result.document_approved_status;
		console.log(response.data.result.document_approved_status +''+ response.data.result.address_update_status)
    })
    .catch(error => {
    });
  }

  const get_dashboard = async () => {
    if(global.address_update_status == 0){
      Alert.alert(
        "Add your store address",
        "Please add your address to show the customer",
        [
          { text: "OK", onPress: () => add_address()}
        ]
      );
    }else if(global.document_approved_status == 0){
      Alert.alert(
        "Upload Your Document",
        "Please upload your document and contact admin to aprove your Shop.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    } 
    console.log("api + url",api_url + dashboard )
    console.log("id is ",global.id)

    await axios({
      method: 'post', 
      url: api_url + dashboard,
      data:{ id: global.id }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        console.log("response is in home screen", response.data)
        setActiveOrders(response.data.result.active_orders);
        setCompletedOrders(response.data.result.completed_orders);
        setWallet(response.data.result.wallet);
        setEarnings(response.data.result.earnings);
        setOrderList(response.data.result.new_orders);
      }
    })
    .catch(error => {
      alert('Sorry something went wrong')
      setLoading(false);
    });
  }

  const online_status = async (status) => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + change_online_status,
      data:{ id: global.id, online_status : status }
    })
    .then(async response => {
      setLoading(false);
    })
    .catch(error => {
      alert('Sorry something went wrong')
      setLoading(false);
    });
  }

  const saveData = async(status) =>{
    try{
        await AsyncStorage.setItem('online_status', status.toString());
        global.online_status = await status.toString();
        
      }catch (e) {
    }
  }
  
  const move_profile = () =>{
    navigation.navigate("Profile")
  }

  const render_list  = ({ item }) => (
    <CardView
      cardElevation={2}
      cardMaxElevation={2}
      style={{ padding:20, justifyContent:'center', width:'100%', height:120, margin:5 }}
      cornerRadius={5}>
      <View >
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold}}>{item.customer_name}</Text>
        <View style={{ margin:2 }} />
        <View style={{ borderLeftWidth:4, borderColor:colors.theme_bg, padding:10 }}>
          <Text numberOfLines={1} style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>order id: #{item.id}</Text>
          <View style={{ margin:4 }} />
          <View style={{ flexDirection:'row'}}>
            <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold}} >{Moment(item.created_at).fromNow()}</Text>
          </View>
        </View>
      </View>
    </CardView> 
  );
  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading}/>
      <ScrollView style={{ padding:10}} showsVerticalScrollIndicator={false}>
        <View style={{ margin:10 }} />
        <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
          <View style={{ width:'50%',justifyContent:'center', alignItems:'flex-start', }}>
          <TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: colors.theme_bg }}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={switch_value}
            />
            </TouchableOpacity>
          </View>
          <View onPress={move_profile.bind(this)} style={{ width:'50%',justifyContent:'center', alignItems:'flex-end', }}>
            <TouchableOpacity style={{ width: 40, height:40, borderWidth:1, borderRadius:30, borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three,  }}>
              <Image style= {{ height: undefined, width: undefined, flex: 1, borderRadius:30 }} source={{ uri : img_url + props.vendor_profile_picture }} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ margin:10 }} />
        <View style={{ flexDirection:'row' }} >
          <Text style={{ fontSize:24, fontFamily:bold, color:colors.theme_fg_two,  letterSpacing:0.5 }}>Hello</Text>
          <View style={{ margin:3 }} />
          <Text style={{ fontSize:24, fontFamily:bold, color:colors.theme_fg, letterSpacing:0.5 }}>{global.store_name}</Text>
        </View>
        <View style={{ width: '100%', height:180, borderRadius:10 }}>
          <Image style= {{ height: undefined, width: undefined, flex: 1, borderRadius:10 }} source={dash_banner} />
        </View>
        <View style={{ margin:20 }} />
        <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_two }}>Your Reports</Text>
        <View style={{ margin:5 }} />
        <View style={{ flexDirection:'row'}}>
          <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}>
            <CardView
              cardElevation={4}
              style={{ margin:5}}
              cardMaxElevation={4}
              cornerRadius={10}>
              <View style={{ padding:10, alignItems:'center', justifyContent:'center', backgroundColor:'#a7c661', height:130, width:150 }}>
                <View style={{ width: 50, height:50 }}>
                  <Image style= {{ height: undefined, width: undefined, flex: 1, }} source={dash_active_icon} />
                </View>
                <View style={{ margin:3 }} />
                <Text style={{ fontSize:18, fontFamily:bold, color:colors.theme_fg_three }}>
                    {active_orders}
                </Text>
                <View style={{ margin:4 }} />
                <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_three }}>Active Orders</Text>
              </View>
            </CardView>
          </View>
          <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}>
            <CardView
              cardElevation={4}
              style={{ margin:5}}
              cardMaxElevation={4}
              cornerRadius={10}>
              <View style={{ padding:10, alignItems:'center', justifyContent:'center', backgroundColor:'#61c6c1', height:130, width:150 }}>
                <View style={{ width: 50, height:50 }}>
                  <Image style= {{ height: undefined, width: undefined, flex: 1, }} source={dash_completed_icon} />
                </View>
                <View style={{ margin:3 }} />
                <Text style={{ fontSize:18, fontFamily:bold, color:colors.theme_fg_three }}>
                  {completed_orders}
                </Text>
                <View style={{ margin:4 }} />
                <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_three }}>Completed</Text>
              </View>
            </CardView>
          </View>
        </View>
        <View style={{ margin:10 }} />
        <View style={{ flexDirection:'row'}}>
          <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}>
            <CardView
              cardElevation={4}
              style={{ margin:5}}
              cardMaxElevation={4}
              cornerRadius={10}>
              <View style={{ padding:10, alignItems:'center', justifyContent:'center', backgroundColor:'#c68c61', height:130, width:150 }}>
                <View style={{ width: 50, height:50 }}>
                  <Image style= {{ height: undefined, width: undefined, flex: 1, }} source={dash_wallet_icon} />
                </View>
                <View style={{ margin:3 }} />
                <Text style={{ fontSize:18, fontFamily:bold, color:colors.theme_fg_three }}>
                {global.currency}{wallet}
                </Text>
                <View style={{ margin:4 }} />
                <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_three }}>Wallet</Text>
              </View>
            </CardView> 
          </View>
          <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}>
            <CardView
              cardElevation={4}
              style={{ margin:5}}
              cardMaxElevation={4}
              cornerRadius={10}>
              <View style={{ padding:10, alignItems:'center', justifyContent:'center', backgroundColor:'#619fc6', height:130, width:150 }}>
                <View style={{ width: 50, height:50 }}>
                  <Image style= {{ height: undefined, width: undefined, flex: 1, }} source={dash_earnings_icon} />
                </View>
                <View style={{ margin:3 }} />
                <Text style={{ fontSize:18, fontFamily:bold, color:colors.theme_fg_three }}>
                  {global.currency}{earnings}
                </Text>
                <View style={{ margin:4 }} />
                <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_three }}>Earnings</Text>
              </View>
            </CardView>
          </View>
        </View>
        <View style={{ margin:20 }} />
        <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_two }}>Pending Bookings</Text>
        <View style={{ margin:5 }} />
        {order_list.length > 0 ?
          <FlatList
            data={order_list}
            renderItem={render_list}
            keyExtractor={item => item.id}
          />
          :
          <View style={{  alignItems:'center', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Sorry no orders found</Text>
          </View>
        } 
        <View style={{ margin:50 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function mapStateToProps(state){
  return{
    vendor_profile_picture : state.auth_function.vendor_profile_picture,
  };
}

export default connect(mapStateToProps,null)(Home);
