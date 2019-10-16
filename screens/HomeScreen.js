import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,ScroolView,NetInfo,Alert
} from 'react-native';
import { WebBrowser,DangerZone,PublisherBanner,Audio,AdMobInterstitial } from 'expo';
const { Lottie } = DangerZone;
import { MonoText } from '../components/StyledText';
import { Ionicons } from '@expo/vector-icons';
console.disableYellowBox = true;

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
   
  };
  state = {
    animation: null,
    status:false
  };
  reklam_ =async()=>{
    AdMobInterstitial.setAdUnitID('ca-app-pub-5888738492049923/6052097178'); // Test ID, Replace with your-admob-unit-id
    AdMobInterstitial.setTestDeviceID('EMULATOR');
    await AdMobInterstitial.requestAdAsync();
    await AdMobInterstitial.showAdAsync();
  }
  


  componentDidMount() {
    this.reklam_();


    NetInfo.isConnected.fetch().done((isConnected) => {
     if(isConnected){

    }else{
      Alert.alert("Lütfen internet bağlantınızı kontrol ediniz !");
    }
    });
    
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };
 
  muzik = async ()=>{
    const playbackObject = await Expo.Audio.Sound.createAsync(
        { uri: 'https://agrup.com.tr/Osmanl%c4%b1%20Saray%20M%c3%bczikleri%20-%20H%c3%bcseyini%20Taksim%20(Ney%20Tambur).mp3' },
        { shouldPlay: true }
      );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{flex:0.2,justifyContent:'flex-start',alignItems: 'flex-start',marginLeft:30}}  onPress={()=>this.props.navigation.openDrawer()}>
              <Ionicons name="ios-menu" size={30} color="white" />
            </TouchableOpacity>
            <Text style={{color:'white',fontSize:28,flex:1,fontFamily:'baslik1',marginTop:Platform.OS === 'ios' ? 0 : -20}}>Erzurum Gezi Rehberi</Text>
          </View>
          <View style={styles.sekil}>
            <Image source={require('../assets/images/header.jpg')} style={styles.sekil1}/>
          </View>
        </View>
              
            <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:120}}>Erzurum Hakkında</Text>
            <Text></Text>
            <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',width:'70%',textAlign:'center'}}>Anadolu'nun Giriş Kapısı, Türklerin Yıkılmayan Kalesi Erzurum; Dadaşlar Diyarı olarak namını duyurmuştur. Çağlar boyunca geçirdiği dönemlerin şaheserlerini büyük özenle korumakta ve gelecek nesillere aktarmaktadır.</Text>
           
            <View style={styles.reklam}>
            <PublisherBanner
  bannerSize="largeBanner"
  adUnitID="ca-app-pub-5888738492049923/6013989605" // Test ID, Replace with your-admob-unit-id
  testDeviceID="EMULATOR"
  onDidFailToReceiveAdWithError={this.bannerError}
  onAdMobDispatchAppEvent={this.adMobEvent} />
  </View>
      
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent:'center',
    alignItems:'center'
  },
  header:{
    position:'absolute',
    top:0,
    width:'100%',
    backgroundColor:'#1da1f2',
    height:110,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 5,
    justifyContent:'center',
    alignItems: 'center',
  },
  sekil:{
    flex:1,
    position:'absolute',
    top:70,
    width:'90%',
    backgroundColor:'white',
    height:90,
    borderRadius:120,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: Platform.OS === 'ios' ? 10 : 20 },
    shadowOpacity: 0.2,
    shadowRadius: Platform.OS === 'ios' ? 2 : 10,
    elevation: Platform.OS === 'ios' ? 5 : 10,
    justifyContent:'center',
    alignItems: 'center',
    
    
  },
  sekil1:{
    flex:1,

    width:'100%',
    backgroundColor:'white',
    height:90,
    borderRadius:Platform.OS === 'ios' ? 40 : 120,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: Platform.OS === 'ios' ? 10 : 20 },
    shadowOpacity: 0.2,
    shadowRadius: Platform.OS === 'ios' ? 2 : 10,
    elevation: Platform.OS === 'ios' ? 5 : 10,
    justifyContent:'center',
    alignItems: 'center',
    
    
  },
  footer:{
    position:'absolute',
    bottom:0,
    width:'100%',
    backgroundColor:'#1da1f2',
    height:60,
    borderWidth: 1,
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 5,
    justifyContent:'center',
    alignItems: 'center',
  },
  reklam:{
   marginTop:Platform.OS === 'ios' ? 40 : 20,
    width:'90%',
    backgroundColor:'white',
    borderWidth: 1,
    height:120,
    borderRadius: 10,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 5,
    justifyContent:'center',
    alignItems: 'center',
  },


  
});
