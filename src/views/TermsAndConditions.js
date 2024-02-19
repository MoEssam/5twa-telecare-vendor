import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView} from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold } from '../config/Constants';

const TermsAndConditions = () => {
 
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding:10}} showsVerticalScrollIndicator={false}>
        <View style={{ margin:10}} />
        <View style={{ justifyContent:'center', alignItems:'flex-start',}}>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>Information</Text>
          <View style={{ margin:10 }} />
          <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
        </View>
        <View style={{ margin:10 }} />
        <View style={{ justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>Location</Text>
          <View style={{ margin:10 }} />
          <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14}}>in order for us to be able to provide your requested services, you will need to grant us permission to obtain your geographic locatio from your device.athereafter, you can disable this function in the settings of you device, understanding that you many not be able to avail yourself of our services that require your location</Text>
        </View>
        <View style={{ margin:10 }} />
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

export default TermsAndConditions;
