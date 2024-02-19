import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';

const FaqDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [faq_answer, setFaqAnswer] = useState(route.params.data);

  return (
    <SafeAreaView style={styles.container}>
    	<ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageView}>
          <Image style={{ height:200, width:'100%'}} source={{ uri : img_url + faq_answer.image}} />
        </View> 
        <View style={{ margin:5 }} />
        <View style={styles.description}>
          <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14 }}>{faq_answer.answer}</Text>
        </View>     
	    </ScrollView>
    </SafeAreaView>  
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
  description: {
    padding:10
  }
});

export default FaqDetails;
