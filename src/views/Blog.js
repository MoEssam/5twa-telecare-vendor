import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList, View, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, api_url, customer_get_blog, img_url } from '../config/Constants';
import Loader from '../components/Loader';
import axios from 'axios';
import Moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import CardView from 'react-native-cardview';
const Blog = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    get_notifation();
  },[]);

  const get_notifation = async() => {
    setLoading(true);
    await axios({
      method: 'get', 
      url: api_url + customer_get_blog,
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

  const blog_details = (data) =>{
    navigation.navigate("BlogDetails", {data:data});
  }

  return (
    <SafeAreaView style={{ backgroundColor:colors.theme_fg_three, flex:1 }}>
      <Loader visible={loading} />
      <ScrollView style={{ padding:10 }} showsVerticalScrollIndicator={false}> 
        <View style={{ margin:5 }}/>
        <View style={styles.header}>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>My Blog</Text>
        </View>
        <View style={{ margin:5 }} />
        <FlatList
          data={data}
          renderItem={({ item,index }) => (
            <TouchableOpacity activeOpacity={1} onPress={blog_details.bind(this,item)}>
                <CardView
                    cardElevation={5}
                    style={{ margin:5, backgroundColor:colors.theme_bg_three }}
                    cardMaxElevation={5}
                    cornerRadius={10}>
                    <View style={{ padding:10}}>
                    <View style={{ width:'100%',height:150 }}>
                        <Image style={{ height: undefined, width: undefined, borderRadius:10, flex:1 }} source={{uri: img_url+item.image}} />
                    </View> 
                    <View style={{ margin:5 }} /> 
                    <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{item.title}</Text>
                    <View style={{ margin:2}}/>
                    <Text style={styles.justnow}>{Moment(item.created_at).fromNow() }</Text>
                    <View style={{ margin:2}}/>
                    <Text style={styles.coupon_description} ellipsizeMode='tail' numberOfLines={2}>{item.description}</Text>
                    
                    </View>
                </CardView>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
        <View style={{ alignItems:'center',marginTop:'60%'}}>
          {data.length == 0 && 
            <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_two, textAlign:'justify'}}>Blog List is empty</Text>
          }
        </View> 
      </ScrollView>
    </SafeAreaView>
  );
}

export default Blog;

const styles = StyleSheet.create({
  coupon_title:{ fontSize:14, fontFamily:bold, color:colors.theme_fg_two },
  coupon_description:{ color:colors.theme_fg_two, fontSize:12, fontFamily:regular },
  justnow:{ color:colors.theme_fg_two, fontSize:11, fontFamily:regular },
});
