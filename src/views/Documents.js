import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, SafeAreaView, Text, TouchableOpacity  } from 'react-native';
import * as colors from '../assets/css/Colors';
import {  api_url, bold, regular, id_proof_icon, certificate_icon, get_documents, upload_icon, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const Documents = () => {
  const route = useRoute();
	const navigation = useNavigation();

  const [id_proof, setIdProof] = useState({
    path:id_proof_icon,
    status:0,
    status_name:'Waiting for upload',
    color:colors.warning
  });

  const [certificate, setCertificate] = useState({
    path:certificate_icon,
    status:0,
    status_name:'Waiting for upload',
    color:colors.warning
  });


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      documents_list();
    });
    return unsubscribe;
		
	},[]);

  const documents_list = async() => {
		await axios({
			method: 'post', 
			url: api_url + get_documents,
			data:{ vendor_id:global.id }
		})
		.then(async response => {
      console.log(response.data.status)
      if(response.data.status == 1){
        find_document(response.data.result)
      }
		})
		.catch(error => {
			alert('Sorry something went wrong')
		});
	} 

  const find_document = (list) =>{
    list.map((data) => {
      let value = { path:{ uri : img_url + data.document_path},status:data.status,status_name:data.status_name, color:get_status_foreground(data.status)}
      console.log(value)
      if(data.document_name == 'id_proof'){
        setIdProof(value);
      }else if(data.document_name == 'certificate'){
        setCertificate(value)
      }
    })
  }

  const get_status_foreground = (status) =>{
		if(status == 5){
			return colors.error
		}else if(status == 3){
			return  colors.warning
		}else if(status == 4){
			return colors.success  
		}
	}

  const move_to_upload = (slug,status,path) =>{
    if(status == 0){
      navigation.navigate("DocumentUpload",{ slug:slug, path:upload_icon, status:status });
    }else{
      navigation.navigate("DocumentUpload",{ slug:slug, path:path, status:status });
    }
  }

  return (
  <SafeAreaView style={styles.container}>
    <View style={{ padding:10 }}>
      <View>
        <Text style={{ fontFamily:bold, color:colors.theme_fg, fontSize:25}}>
          Verify your identity
        </Text>
        <View style={{ margin:5 }} />
        <Text style={{ fontFamily:regular, color:colors.grey, fontSize:12}}>
          In order to complete your registration please upload a copy of id proof and certificate.
        </Text>
      </View>
      <View style={{ margin:20 }} />
      <View>
        <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:18}}>
          ID Proof
        </Text>
        <Text style={{ fontFamily:regular, color:colors.grey, fontSize:12}}>
          Please make sure that every details of the document is clearly visible.
        </Text>
        <View style={{ margin:10 }} />
        <TouchableOpacity activeOpacity={1} onPress={move_to_upload.bind(this,'id_proof',id_proof.status,id_proof.path)} style={{ borderWidth:1, padding:10, borderRadius:5, borderStyle:'dashed', flexDirection:'row'}}>
          <View style={{ width:'70%'}}>
            <Text style={{ fontFamily:bold, color:id_proof.color, fontSize:14}}>{id_proof.status_name}</Text>
            <View style={{ margin:5 }} />
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:12}}>Please upload your passport or driving licence or any one ID proof</Text>
          </View>
          <View style={{ width:'30%', alignItems:'center', justifyContent:'center'}}>
            <Image source={id_proof.path} style={{ height:75, width:75}} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ margin:20 }} />
      <View>
        <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:18}}>
          Certificate
        </Text>
        <Text style={{ fontFamily:regular, color:colors.grey, fontSize:12}}>
          Please make sure that every details of the document is clearly visible.
        </Text>
        <View style={{ margin:10 }} />
        <TouchableOpacity activeOpacity={1} onPress={move_to_upload.bind(this,'certificate',certificate.status,certificate.path)} style={{ borderWidth:1, padding:10, borderRadius:5, borderStyle:'dashed', flexDirection:'row'}}>
          <View style={{ width:'70%'}}>
            <Text style={{ fontFamily:bold, color:certificate.color, fontSize:14}}>{certificate.status_name}</Text>
            <View style={{ margin:5 }} />
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:12}}>Please upload your store registration certificate</Text>
          </View>
          <View style={{ width:'30%', alignItems:'center', justifyContent:'center'}}>
            <Image source={certificate.path} style={{ height:75, width:75}} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three
  }
});

export default Documents;