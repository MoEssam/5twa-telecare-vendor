import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, vendor_earning, api_url, money_bag, earnings_icon } from '../config/Constants';
import CardView from 'react-native-cardview';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Moment from 'moment';

const Earnings = () => {
	const navigation = useNavigation();
	const [total_earnings, setTotalEarnings] = useState('');
  	const [today_earnings, setTodayEarnings] = useState('');
  	const [earnings, setEarnings] = useState([]); 
  	const [count, setCount] = useState('');

  	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', async () => {
		await get_earning();
		});
		return unsubscribe;
	},[]);

	const handleBackButtonClick= () => {
		navigation.goBack()
	} 

	const get_earning = async() => {
		await axios({
			method: 'post', 
			url: api_url + vendor_earning,
			data:{ id:global.id }
		})
		.then(async response => {
			setTotalEarnings(response.data.result.total_earnings);
			setTodayEarnings(response.data.result.today_earnings);
			setEarnings(response.data.result.earnings);
			setCount(response.data.result.earnings.length);
		})
		.catch(error => {
			alert('Sorry something went wrong')
		});
	}  

	const renderItem = ({ item }) => (

		<View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
			<View style={{ width:'15%',justifyContent:'center', alignItems:'center' }}>
				<Image style={{ height: 30, width: 30 ,}} source={earnings_icon} />
			</View>  
			<View style={{ width:'65%', justifyContent:'center', alignItems:'flex-start'}}>
				<Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_fg_two}}>Your earnings credited for this order - #{item.order_id}</Text>
			<View style={{ margin:2}} />
				<Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{Moment(item.created_at).format('MMM DD, YYYY hh:mm A')}</Text>   
			</View>
			<View style={{ width:'20%',justifyContent:'center', alignItems:'center'}}>
				<Text style={{ fontFamily:bold, fontSize:16, color:colors.grey}}>{global.currency}{item.amount}</Text>
			</View>  
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			{count == 0 ?
				<View style={{ width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
					<Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Sorry no earnings received .</Text>
				</View>
			:
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<View style={{ width:'100%',justifyContent:'center', alignItems:'flex-start' }}>
						<Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Earnings</Text>
					</View>
				</View>
				<View style={{ margin:10 }} />
				<View style={{width:'100%', flexDirection:'row', alignItems:'center',  justifyContent:'center'}}>
					<CardView cardMaxElevation={5}
						cornerRadius={10}
						cardElevation={5}
						style={{ width:'40%', flexDirection:'column', backgroundColor:colors.theme_fg_three, borderRadius:10, padding:5, paddingTop:15, paddingBottom:15, alignItems:'center', justifyContent:'center'}}>
						<View style={{ justifyContent:'center', alignItems:'center', backgroundColor:colors.secondary_blue, borderRadius:50, width:'50%' }}>
							<Image style={{ height: 30, width: 30, margin:20 }} source={money_bag} />
						</View>
						<View style={{margin:3}}/>
						<View style={{ justifyContent:'center', alignItems:'center' }}>
							<Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:25}}>{global.currency}{today_earnings}</Text>
							<View style={{ margin:2 }} />
							<Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:12}}>Today Earnings</Text>
						</View>
					</CardView>
				<View style={{ width:'5%'}}/>
					<CardView cardMaxElevation={5}
						cornerRadius={10}
						cardElevation={5}
						style={{ width:'40%', flexDirection:'column', backgroundColor:colors.theme_fg_three, marginLeft:'2%', marginRight:'1%', borderRadius:10, padding:5, paddingTop:15, paddingBottom:15, alignItems:'center', justifyContent:'center'}}>
						<View style={{ justifyContent:'center', alignItems:'center', backgroundColor:colors.secondary_blue, borderRadius:50, width:'50%' }}>
							<Image style={{ height: 30, width: 30, margin:20 }} source={money_bag} />
						</View>
						<View style={{margin:3}}/>
						<View style={{ justifyContent:'center', alignItems:'center' }}>
							<Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:25}}>{global.currency}{total_earnings}</Text>
							<View style={{ margin:2 }} />
							<Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:12}}>Total Earnings</Text>
						</View>
					</CardView>
				</View>
				<View style={{ margin:10 }} />
				<Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two, padding:10}}>Earnings transactions</Text>
				<FlatList
					data={earnings}
					renderItem={renderItem}
					keyExtractor={item => item.id}
				/>
				<View style={{ margin:50 }} />
			</ScrollView>
			}
		</SafeAreaView>  
	)
	}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,

  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
    padding:10
  },
 
});

export default Earnings;
