import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ScrollView} from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, api_url, vendor_privacy_policy } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from '../components/StatusBar'; 
import axios from 'axios';
import Loader from '../components/Loader';

const PrivacyPolicy = () => {

  const navigation = useNavigation();
  const [policy_result, setPolicyResult] = useState([]);
  const [loading, setLoading] = useState('false');

  useEffect(() => {
    get_privacy(); 
  },[]);

  const get_privacy = async() => {
    setLoading(true);
    axios({
    method: 'post', 
    url: api_url + vendor_privacy_policy,
    data:{ user_type:global.user_type }
    })
    .then(async response => {
      setLoading(false);
      setPolicyResult(response.data.result)
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  } 

  const renderItem = ({ item }) => (
    <View>
      <View style={{ justifyContent:'center', alignItems:'flex-start', padding:10,}}>
        <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>{item.title}</Text>
        <View style={{ margin:10 }} />
        <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14}}>{item.description}</Text>
      </View>
    </View>
  );
 
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Loader visible={loading} />
        <StatusBar/>
        <View style={{ margin:10}} />
        <FlatList
          data={policy_result}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
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

export default PrivacyPolicy;
