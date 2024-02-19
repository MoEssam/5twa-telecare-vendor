import React, { useState, useEffect} from 'react';
import { StyleSheet, Image,  View, SafeAreaView, Text,  ScrollView, FlatList, } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons'
import { regular, bold, wallet, api_url, withd_credit, withd_wal, withd_debit } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';
import Moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Wallet = () =>{
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [wallet_list, setWalletList] = useState([]);
  const [wallet_amt, setWalletAmt] = useState('');

  const handleBackButtonClick= () => {
		navigation.goBack()
	}

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await get_wallet();
    });
    return unsubscribe;
  },[]);

  const get_wallet = async() =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + wallet,
      data:{ id:global.id }
    })
    .then(async response => {
      setLoading(false);
      setWalletList(response.data.result.wallets); 
      console.log(response.data.result)
      setWalletAmt(response.data.result.wallet_amount);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const renderItem = ({ item }) => (
    <View style={{ padding:5, paddingLeft:10, paddingRight:10  }} >
      <View style={{ width:'100%', flexDirection:'row', justifyContent:'center', alignItems:'center', borderWidth:0.5, padding:10, borderRadius:10, borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three,}}>
        {item.type == 1 ?
          <View style={{ width:'15%',justifyContent:'center', alignItems:'flex-start'}}>
            <View style={{ width: 30, height:30, }}>
              <Image style= {{ height: undefined, width: undefined, flex: 1,  }} source={withd_credit} />
            </View>
          </View> 
          :
          <View style={{ width:'15%',justifyContent:'center', alignItems:'flex-start'}}>
            <View style={{ width: 30, height:30, }}>
              <Image style= {{ height: undefined, width: undefined, flex: 1,  }} source={withd_debit} />
            </View>
          </View> 
        }
	      <View style={{ width:'50%', justifyContent:'center', alignItems:'flex-start'}}>
	        <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two}}>{item.message}</Text>
	      <View style={{ margin:5}} />
	      <View style={{ flexDirection:'row' }} >
	        <Text style={{ fontFamily:regular, fontSize:10, color:colors.grey}}>{Moment(item.created_at).fromNow()}</Text>  
	      </View> 
	      </View>
	      <View style={{ width:'40%',justifyContent:'center', alignItems:'flex-end'}}>
	        <Text style={{ fontFamily:regular, fontSize:14, color:colors.grey}}>{global.currency}{item.amount}</Text>
	      </View> 
	    </View>
	  </View>
  );

	return(
	<SafeAreaView style={styles.container}>
    <Loader visible={loading}/>
    {wallet_list.length != 0 ?
	    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ height: 130, width: '100%', backgroundColor:colors.theme_fg,}}>
          <View style={{ margin:10 }} />
          <TouchableOpacity onPress={handleBackButtonClick} style={{ margin:5 }} >
            <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_three} style={{ fontSize:30 }} />
          </TouchableOpacity>
        </View>
        <View style={{ padding:10 }} >
        <View style={{ width: '100%', borderRadius:10, position:'absolute', top:-40, left:10 }}>
          <View style={{ width:'100%', flexDirection:'row', backgroundColor:colors.theme_fg_three, borderRadius:10  }}>
            <View style={{ width:'100%', padding:20, flexDirection:'row' }}>
              <View style={{ width:'20%',alignItems:'flex-start', justifyContent:'center' }}>
                <View style={{ width: 40, height:40,  }}>
                  <Image style= {{ height: undefined, width: undefined, flex: 1, }} source={withd_wal} />
                </View>
              </View>
              <View style={{ width:'80%',alignItems:'flex-start', justifyContent:'center'}}>
                <Text style={{ fontSize:16, color:colors.theme_fg, fontFamily:bold, marginTop:5,}}>Total Available Balance</Text>
                <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:regular, marginTop:10 }}>{global.currency} {wallet_amt}</Text>
              </View>
            </View> 
          </View>   
        </View>
          <View style={{ margin:30 }} />
          <View style={{ flexDirection:'row' }} >
            <View style={{alignItems:'center', justifyContent:'flex-start', flexDirection:'row', width:'100%' }}>
              <Icon type={Icons.Ionicons} name="ios-wallet" color={colors.theme_fg} style={{ fontSize:20 }} />
              <View style={{ margin:2 }} />
              <Text style={{ fontSize:16, color:colors.theme_fg, fontFamily:bold }}>Wallet transactions</Text>
             </View> 
          </View>
          <View style={{ margin:10 }} />
            <FlatList
              data={wallet_list}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
        </View>
	    </ScrollView>
      :
      <View style={{ width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
          <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Sorry no data found</Text>
      </View>
    }
      <View style={{ padding:10 }} >
      </View>
	  </SafeAreaView>
	)
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Wallet;