import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { width, height, totalSize } from 'react-native-dimension';
import Geolocation from '@react-native-community/geolocation';
import * as data from './json.json';
import RNRestart from 'react-native-restart';
const jsonData = data;

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// loggedIn: true,
			latitude: 0,
			longitude: 0,
			error: null,
			waveHeight: null,
			buildingHeight: [],
			safeBuiildings: [],
			sbLat: [],
			sbLong: [],

		};
	}

	async  componentWillMount() {
		var randomInput = Math.floor(Math.random() * Math.floor(10));

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
		await fetch("https://iam.bluemix.net/oidc/token", requestOptions)
			.then(response => (response.json()))
			.then(async result => {
				var tkn = result.access_token;
				var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
				myHeaders.append("Authorization", "Bearer" + tkn);
				myHeaders.append("ML-Instance-ID", "300cc33a-c052-4c6c-8fc1-f4bc6bf1c46d");

				var raw = "{\"input_data\": [{\"fields\": [\"earthquake\"], \"values\": [[" + randomInput + "]]}]}";

				var requestOptions = {
					method: 'POST',
					headers: myHeaders,
					body: raw,
					redirect: 'follow'
				};

				await fetch("https://eu-gb.ml.cloud.ibm.com/v4/deployments/e83690d0-dcf9-43fa-8dc9-2f0dbdd995bf/predictions", requestOptions)
					.then(response => response.json())
					.then(result => {
						//console.log(result.predictions[0].values[0][0][0]);
						if (result.predictions[0].values[0][0][0] < 0) {
							result.predictions[0].values[0][0][0] = result.predictions[0].values[0][0][0] * -1;
						}
						this.setState({ waveHeight: result.predictions[0].values[0][0][0] });
						console.log(this.state.waveHeight);
						
					})
					.catch(error => console.log('error', error));
			})
			let sampleArray =[];
			for(var j=0; j<4; j++){
				sampleArray.push(jsonData[j]);
			}
			this.setState({buildingHeight:sampleArray});
			//console.log(this.state.buildingHeight);
		let SB = [];
		for (var i = 0; i < this.state.buildingHeight.length; i++) {
			if (this.state.buildingHeight[i].Height > this.state.waveHeight) {
				//console.log('wrking')
				SB.push(this.state.buildingHeight[i])
			}
		}
		this.setState({safeBuiildings:SB});
		console.log(this.state.safeBuiildings)


	}
	componentDidMount(){
		Geolocation.getCurrentPosition((info) => {
			this.setState({ latitude: info.coords.latitude, longitude: info.coords.longitude })
		})
	}
	render() {

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
				<Marker coordinate={this.state} />
				
				{/* { (this.state.safeBuiildings[0]!=[])?(
		  this.state.safeBuiildings[0].map((arg, index)=>{
			  return(
				 
				<Marker coordinate ={this.state.safeBuiildings.latitude,this.state.safeBuiildings.longitude}/>)
			  
		  })
		  ):("") */}
				{
					(this.state.safeBuiildings!= null) ? (
						this.state.safeBuiildings.map((arg, index) => {
							return (
								<Marker pinColor="#00ff00" coordinate={{ latitude: arg.Latitude, longitude: arg.Longitude }} />)

						})
					) : (
						<Text>
							
						</Text>
					)
				}
			</MapView>

		</View>)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		flex: 1,
		width: width(100),
		height: height(100)
	}
});

export default App;
