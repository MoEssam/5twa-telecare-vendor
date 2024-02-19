import React, { useState } from 'react';
import { StyleSheet, Text, Image, View, SafeAreaView, ScrollView } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular , img_url} from '../config/Constants';
import { useRoute } from '@react-navigation/native';
import YoutubePlayer from "react-native-youtube-iframe";
import { TouchableOpacity } from 'react-native-gesture-handler';

const BlogDetails = (props) => {
  const route = useRoute();
  const [data, setData] = useState(route.params.data);
  const [playing, setPlaying] = useState(false);

  const togglePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const onStateChange = () =>{

  }

  return (
    <SafeAreaView style={{backgroundColor:colors.theme_fg_three, flex:1}}>
      <ScrollView>
        {data.video ?
        <View>
            <YoutubePlayer
                height={220}
                play={playing}
                videoId={data.video}
                onChangeState={onStateChange}
            />
        </View>
        :
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
          <View style={styles.notification_img}>
            <Image
              style= {{flex:1 , width: undefined, height: undefined}}
              source={{uri: img_url + data.image}}
            />
          </View>
        </View>
        }
        <View style={{ padding:10 }}>
          <View style={{ flexDirection:'row'}}>
            <View style={{ alignItems:'center', justifyContent:'center'}}><Text style={styles.notification_title}>{data.title}</Text></View>
          </View>
          <View style={styles.margin_10} />
          <Text style={styles.description}>{data.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default BlogDetails;

const styles = StyleSheet.create({
  margin_10:{
    margin:10
  },
  notification_title:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    fontSize:20,
    fontFamily:bold
  },
  notification_img:{
    height:200, 
    width:'100%'
  },
  description:{ color:colors.theme_fg_two, alignSelf:'center', fontFamily:regular, fontSize:14}
});
