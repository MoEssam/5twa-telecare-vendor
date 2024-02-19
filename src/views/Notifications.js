import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList, View, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, api_url, customer_notification, img_url } from '../config/Constants';
import Loader from '../components/Loader';
import axios from 'axios';
import Moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Icon, { Icons } from '../components/Icons';

const Notifications = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    get_notifation();
  },[]);

  const get_notifation = async() => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_notification,
      data:{ app_module:3}
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        setData(response.data.result)
      }
    })
    .catch( async error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const notification_details = (data) =>{
    navigation.navigate("NotificationDetails", {data:data});
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={notification_details.bind(this,item)}>
      <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
        <View style={{ width:'95%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>{item.title}</Text>
          <View style={{ margin:3 }} />
          <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontFamily:regular, fontSize:10, color:colors.grey}}>{item.description}</Text>   
        </View>
        <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
          <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
        </View>  
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
    	<ScrollView style={{padding:10}} showsVerticalScrollIndicator={false}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <View style={{ alignItems:'center',marginTop:'60%'}}>
          {data.length == 0 && 
            <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_two, textAlign:'justify'}}>Notification List is empty</Text>
          }
        </View> 
	    </ScrollView>
    </SafeAreaView>  
  )
}

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
});
