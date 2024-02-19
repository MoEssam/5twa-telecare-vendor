import React, { useState, useEffect} from 'react';
import { StyleSheet, Image,  View, SafeAreaView, Text,  ScrollView, TouchableOpacity, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons'
import { regular, bold, withdrawal_history, api_url, withd_wal, withd_debit, withdrawal_request } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Moment from 'moment';
import Loader from '../components/Loader';
import DialogInput from 'react-native-dialog-input';

const Withdrawal = () =>{
	const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState(0);
	const [wal_amt, setWalAmt] = useState(0);
	const [withdraw_list, setWithdrawaList] = useState([]); 
	const [dialog_visible, setIDialogVisible] = useState(false);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', async () => {
		  await get_withdrawal_list();
		});
		return unsubscribe;
	},[]);

	const get_withdrawal_list = async() => {
		setLoading(true);
		await axios({
			method: 'post', 
			url: api_url + withdrawal_history,
			data:{ id:global.id }
		})
		.then(async response => {
			setLoading(false);
			console.log(response.data.result)
			setWalAmt(response.data.result.wallet_amount);
			setWithdrawaList(response.data.result.withdraw);
		})
		.catch(error => {
			setLoading(false);
			alert('Sorry something went wrong')
		});
	} 

	const withdrawal_limit = () => {
		if(wal_amt > 0){
		  setIDialogVisible(true);
		}else{
		  alert("Your balance is low.");
		}
	  }

	const request_amt = async(val) => {
		setLoading(true);
		await axios({
			method: 'post', 
			url: api_url + withdrawal_request,
			data:{ vendor_id:global.id, amount:val }
		})
		.then(async response => {
			setLoading(false);
			if(response.data.status == 1){
				setAmount(0);
				get_withdrawal_list();
			}
		})
		.catch(error => {
			setLoading(false);
			alert('Sorry something went wrong')
		});
	} 

	const showDialog = (val) =>{
		setIDialogVisible(false);
	}
	
	const sendInput = async(val) =>{
		if(val == "" || val == 0 || val == undefined){
		  await setIDialogVisible(false);
		  alert("Please enter valid amount.")
		}else if(val > wal_amt){
		  await setIDialogVisible(false);
		  alert("Your request amount is high.")
		}else{
		  await setIDialogVisible(false);
		  await request_amt(val);
		}
	}

	const renderItem = ({ item }) => (
		<View style={{ padding:5, paddingLeft:10, paddingRight:10 }} >
		  <View style={{ width:'100%', flexDirection:'row', justifyContent:'center', alignItems:'center', borderWidth:0.5, padding:15, borderRadius:10, borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three,}}>
			<View style={{ width:'20%',justifyContent:'center', alignItems:'flex-start'}}>
			   <View style={{ width: 30, height:30, }}>
				<Image style= {{ height: undefined, width: undefined, flex: 1,  }} source={withd_debit} />
			  </View>
			</View> 
			<View style={{ width:'60%', justifyContent:'center', alignItems:'flex-start'}}>
				<Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two}}>Your request status is {item.status_name}</Text>
				<View style={{ margin:3}} />
				<View style={{ flexDirection:'row' }} >
					<Text style={{ fontFamily:regular, fontSize:11, color:colors.grey}}>{Moment(item.created_at).fromNow()} {item.created_at}</Text>   
				</View> 
			</View>
			<View style={{ width:'20%',justifyContent:'center', alignItems:'flex-end'}}>
				<Text style={{ fontFamily:regular, fontSize:15, color:colors.grey}}>{global.currency}{item.amount}</Text>
			</View> 
			</View>
		</View>
	);

	return(
		<SafeAreaView style={styles.container}>
			<Loader visible={loading}/>
			<View style={{ padding:10, }} >
				<View style={{ alignItems:'center' }} >
					<View style={{ width: '100%', borderRadius:10, }}>
						<View style={{ width:'100%', flexDirection:'row', backgroundColor:colors.theme_fg, borderRadius:10 }}>
							<View style={{ width:'100%', padding:20, flexDirection:'row' }}>
								<View style={{ width:'20%',alignItems:'flex-start', justifyContent:'center' }}>
									<View style={{ width: 40, height:40,  }}>
										<Image style= {{ height: undefined, width: undefined, flex: 1, }} source={withd_wal} />
									</View>
								</View>
								<View style={{ width:'80%',alignItems:'flex-start', justifyContent:'center' }}>
									<Text style={{ fontSize:14, color:colors.light_grey, fontFamily:bold}}>Available Balance</Text>
									<Text style={{ fontSize:22, color:colors.theme_fg_three, fontFamily:regular, marginTop:10 }}>{global.currency}{wal_amt}</Text>
								</View>
							</View> 
						</View>   
					</View>
				</View>
			</View>
			{withdraw_list.length > 0 ?
				<ScrollView>
					<View style={{ margin:10 }} />
					<View style={{ flexDirection:'row', padding:10 }} >
						<View style={{alignItems:'center', justifyContent:'flex-start', flexDirection:'row', width:'100%' }}>
							<Icon type={Icons.Ionicons} name="ios-wallet" color={colors.theme_fg} style={{ fontSize:20 }} />
							<View style={{ margin:2 }} />
							<Text style={{ fontSize:16, color:colors.theme_fg, fontFamily:bold }}>Your transactions</Text>
						</View> 
					</View>
					<FlatList
						data={withdraw_list}
						renderItem={renderItem}
						keyExtractor={item => item.id}
					/>
				</ScrollView> 
					:
					<View style={{ width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
						<Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Sorry no data found</Text>
					</View>
				}
				<View style={{ margin:50 }} />	
			{wal_amt > 0 &&
				<TouchableOpacity onPress={withdrawal_limit.bind(this)} style={{ height:40, position:'absolute', bottom:10, width:'100%', backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center', width:'90%', marginLeft:'5%', borderRadius:10}}>
					<Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16}}>
						Withdraw Now
					</Text>
				</TouchableOpacity>
			}	
			<DialogInput isDialogVisible={dialog_visible}
				title="Withdrawal Request"
				message="Enter your amount"
				hintInput ="amount"
				textInputProps={{ keyboardType: "phone-pad" }}
				submitInput={ (inputText) => {sendInput(inputText)} }
				closeDialog={ () => {showDialog(false)}}>
			</DialogInput>	
  		</SafeAreaView>  
	)
}
const styles = StyleSheet.create({
container: {
    flex: 1
},
});

export default Withdrawal;