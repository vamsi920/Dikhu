import React, {Component} from 'react';
import {StyleSheet, View, Text, Dimensions, Alert} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {width,height, totalSize} from 'react-native-dimension';
import Geolocation from '@react-native-community/geolocation';
import * as data from './json.json';
const jsonData = data;

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// loggedIn: true,
			latitude : 0,
			longitude : 0,
			error:null,
			waveHeight:0,
			buildingHeight:[],
			safeBuiildings:[],
			sbLat:[],
			sbLong:[],
			
					};
	}

	async  componentWillMount() {
		  var randomInput= Math.floor(Math.random() * Math.floor(10));
		  
		  //console.log(randomInput);
		  var myHeaders = new Headers();
		  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
		  myHeaders.append("Authorization", "Basic Yng6Yng=");
		  
		  var raw = "apikey=buo_hn2XVPhUHKEjIHd2xw7SDBxbJJLyOTjY3L-9klIp&grant_type=urn:ibm:params:oauth:grant-type:apikey";
		 
		  var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		  };
 		  fetch("https://iam.bluemix.net/oidc/token", requestOptions)
   .then(response => (response.json()))
   .then(result => {var tkn = result.access_token;
	var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Authorization", "Bearer"+tkn);
myHeaders.append("ML-Instance-ID", "300cc33a-c052-4c6c-8fc1-f4bc6bf1c46d");

 var raw = "{\"input_data\": [{\"fields\": [\"earthquake\"], \"values\": [["+randomInput+"]]}]}";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

 fetch("https://eu-gb.ml.cloud.ibm.com/v4/deployments/e83690d0-dcf9-43fa-8dc9-2f0dbdd995bf/predictions", requestOptions)
  .then(async response => response.json())
  .then(async result => {
	  console.log(result.predictions[0].values[0][0][0]);
	  this.setState({waveHeight:result.predictions[0].values[0][0][0]});

  })
  .catch(error => console.log('error', error));
})
		Geolocation.getCurrentPosition((info) =>{
			this.setState({latitude:info.coords.latitude, longitude: info.coords.longitude})
		} )
		 this.state.buildingHeight.push(jsonData);
		// console.log(this.state.buildingHeight[0][0]);
		let SB=[];
		
	for(var i=0; i<4;i++){
			if(this.state.buildingHeight[0][i].Height>this.state.waveHeight){
				SB.push(this.state.buildingHeight[0][i])
			}
		}
		console.log(SB);
		 this.state.safeBuiildings.push(SB);
		
		//console.log(this.state.safeBuiildings[0])

//iudfigd


		//console.log(SB)
		
	}
		// navigator.geolocation.getCurrentPosition(position=>{
		// 	this.setState({
		// 		latitude:position.coords.latitude,
		// 		longitude:position.coords.longitude,
		// 		error:null
		// 	})
		// },
		// 	error => this.setState({error:error.message}),
		// 	{enableHighAccuracy:true, timeout: 20000,maximumAge:2000}
		// )}
	//  	var firebaseConfig = {
	// 		apiKey: 'AIzaSyCkc9QZsqXPorD7jvhL4-mGaUYPsT5OSMo',
	// 		authDomain: 'sample-dcf1f.firebaseapp.com',
	// 		databaseURL: 'https://sample-dcf1f.firebaseio.com',
	// 		projectId: 'sample-dcf1f',
	// 		storageBucket: 'sample-dcf1f.appspot.com',
	// 		messagingSenderId: '333266407595',
	// 		appId: '1:333266407595:web:d9cd5442f3eadff94fe7ee',
	// 		measurementId: 'G-8VJQH31L53',
	//  	};
	// 	// Initialize Firebase
	// 	if (!firebase.apps.length) {
	// 		firebase.initializeApp(firebaseConfig)
	// 	}
	// //  	firebase.initializeApp(firebaseConfig);
	// firebase.auth().useDeviceLanguage();
	// 	firebase.auth().onAuthStateChanged(user=>{
	// 		if(user){
	// 			this.setState({
	// 				loggedIn:true
	// 			})
	// 		}
	// 		else{

	// 			this.setState({
	// 				loggedIn:false
	// 			})
	// 		}
	// 	});
	  

	render() {
		var {width, height} = Dimensions.get('window');
		return (<View style={styles.container}>
		<MapView
		style={styles.map}
		provider={PROVIDER_GOOGLE}
    region={{
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  >
	  <Marker coordinate ={this.state}/> 
	  <Marker coordinate ={this.state}/> 
	  {/* { (this.state.safeBuiildings[0]!=[])?(
		  this.state.safeBuiildings[0].map((arg, index)=>{
			  return(
				 
				<Marker coordinate ={this.state.safeBuiildings.latitude,this.state.safeBuiildings.longitude}/>)
			  
		  })
		  ):("") */}
		 { 
		(this.state.safeBuiildings[0]!=null)?(
			this.state.safeBuiildings[0].map((arg, index)=>{
				return(
				   
				  <Marker pinColor="#00ff00" coordinate ={{latitude:arg.Latitude, longitude:arg.Longitude}}/>)
				
			})
		):("")
	  }
  </MapView>
  
  </View>)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map:{
		flex:1,
		width: width(100),
		height: height(100)
	}
});

export default App;
