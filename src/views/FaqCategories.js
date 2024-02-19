import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, vendor_faq, api_url, img_url } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ContentLoader from "react-native-easy-content-loader";
import Loader from '../components/Loader';

const FaqCategories = () => {
  const navigation = useNavigation();
  const [faq_category_list, setFaqCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  const faq_question = (data) => {
    navigation.navigate("Faq", { data: data})
  }

  useEffect(() => {
    get_faq_category(); 
  },[]);

  const get_faq_category = async() => {
    setLoading(true);
    axios({
    method: 'post', 
    url: api_url + vendor_faq,
    data:{user_type:global.user_type},
    })
    .then(async response => {
      setLoading(false);
      setFaqCategoryList(response.data.result);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={faq_question.bind(this,item)}>
      <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
        <View style={{ width:'15%',justifyContent:'center', alignItems:'center'}}>
          <View style={{ width: 30, height:30, }}>
            <Image style= {{ height: undefined,width: undefined,flex: 1,borderRadius:10 }} source={{ uri: img_url + item.icon }} />
          </View> 
        </View>  
        <View style={{ width:'80%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>{item.category_name}</Text>
          <View style={{ margin:3 }} />
          <Text style={{ fontFamily:regular, fontSize:10, color:colors.grey}}>{item.description}</Text>   
        </View>
        <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
          <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
        </View>  
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading}/>
    	<ScrollView style={{padding:10}} showsVerticalScrollIndicator={false}>
        <View style={{ margin:10 }} />
        <ContentLoader 
          pRows={1}
          pHeight={[10, 30, 20]}
          pWidth={['80%', 70, 100]}
          listSize={5}
          loading={loading}>
          <FlatList
            data={faq_category_list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </ContentLoader>
	    </ScrollView>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
});

export default FaqCategories;
