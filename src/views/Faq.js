import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';

const Faq = () => {
  const navigation = useNavigation();
    const route = useRoute();
    const [faq_question, setFaqQuestion] = useState(route.params.data);

  const faq_details = (data) => {
    navigation.navigate("FaqDetails", { data: data })
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={faq_details.bind(this,item)}>
      <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
        <View style={{ width:'90%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:regular, fontSize:14, color:colors.grey}}>{item.question}</Text>
        </View>
        <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-end'}}>    
          <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:25 }} />
        </View>  
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
    	<ScrollView style={{padding:10}} showsVerticalScrollIndicator={false}>
        <FlatList
          data={faq_question.data}
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

export default Faq;
