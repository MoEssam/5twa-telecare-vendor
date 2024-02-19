import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import {  bold, document_upload, api_url, document_update, img_url } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import ImgToBase64 from 'react-native-image-base64';
import Loader from '../components/Loader';

const options = {
    title: 'Select a photo',
    takePhotoButtonTitle: 'Take a photo',
    chooseFromLibraryButtonTitle: 'Choose from gallery',
    base64: true,
    quality:1, 
    maxWidth: 500, 
    maxHeight: 500,
  };

const DocumentUpload = () =>{

    const route = useRoute();
	const navigation = useNavigation();
    const [slug, setSlug] = useState(route.params.slug);
    const [path, setPath] = useState(route.params.path);
    const [status, setStatus] = useState(route.params.status);
    const [loading, setLoading] = useState(false);
    const [img_data,setImgData] = useState(""); 

    useEffect(() => {
		
	},[]);

    const select_photo = async () => {
        ImagePicker.launchImageLibrary(options, async(response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            const source =  await response.assets[0].uri;
            setImgData(response.assets[0].uri)
            ImgToBase64.getBase64String(response.assets[0].uri)
            .then(async base64String => {
                await upload_document(base64String);
            }
            )
            .catch(err => console.log(err));
        }
        });
    }

    const upload_document = async(data) =>{
        await setLoading(true);
        RNFetchBlob.fetch('POST', api_url + document_upload, {
          'Content-Type' : 'multipart/form-data',
        }, [
          {  
            name : 'image',
            filename : 'image.png', 
            data: data
          }
        ]).then(async (resp) => { 
            console.log(resp)
          await setLoading(false);
          let data = await JSON.parse(resp.data);
          if(data.result){
            update_document(data.result);
          }
        }).catch((err) => {
            setLoading(false);
            alert('Error on while upload try again later.')
        })
    }


    const update_document = async(path) => {
        console.log({ vendor_id:global.id, document_name:slug, document_path:path })
		await axios({
			method: 'post', 
			url: api_url + document_update,
			data:{ vendor_id:global.id, document_name:slug, document_path:path }
		})
		.then(async response => {
            if(response.data.status == 1){
                setPath({uri:img_url+path});
                setStatus(3);
            }
		})
		.catch(error => {
			alert('Sorry something went wrong')
		});
	} 

    const show_button = () =>{
        if(status == 0 || status == 5){
            return <TouchableOpacity onPress={select_photo.bind(this)} style={{ height:40, position:'absolute', bottom:10, width:'100%', backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center', width:'90%', marginLeft:'5%', borderRadius:10}}>
                    <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16}}>
                        Upload File
                    </Text>
                </TouchableOpacity>
        }
    }
	return(
        <SafeAreaView style={styles.container}>
            <Loader visible={loading}/>
            <View style={{ marginBottom:40, alignItems:'center', justifyContent:'center' }}>
                <View style={{ height:200, width:200}}>
                    <Image source={path} style={{ flex:1, height:undefined, width:undefined }} />
                </View>
                <View style={{ margin:10 }} />
                {status == 0 &&
                    <Text style={{ fontFamily:bold, color:colors.theme_fg, fontSize:16}}>Upload your file</Text>
                }
            </View>
            {show_button()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor:colors.theme_bg_three
    }
  });

export default DocumentUpload;