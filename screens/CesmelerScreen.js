import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,Button,
  View,ScroolView,SafeAreaView,Dimensions,TouchableHighlight,Linking,ActivityIndicator
} from 'react-native';
import { WebBrowser,DangerZone,PublisherBanner,MapView , Location, Permissions,Constants,AdMobInterstitial } from 'expo';
const { Lottie } = DangerZone;
import { MonoText } from '../components/StyledText';
import { Ionicons,FontAwesome } from '@expo/vector-icons';
import SwipeUpDown from 'react-native-swipe-up-down';
// Using a local version here because we need it to import MapView from 'expo'
import MapViewDirections from '../screens/MapViewDirections';
import Lightbox from 'react-native-lightbox';
import TimerMixin from 'react-timer-mixin';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 39.878582;
const LONGITUDE = 41.269779;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyCYvMpmVhFc0ydILEuXGJNYNGFnBoKPCL8';
console.disableYellowBox = true;
export default class CesmelerScreen extends React.Component {
  static navigationOptions = {
    header: null,
   
  };
  constructor(props) {
    super(props);
    this.state = {
        animation:null,
        footer:110,
        location: null,
        mesafe:null,
        dakika:null,
        sayac:0,
        bekle:false,
        maksimum_sicaklik:null,
        minimum_sicaklik:null,
        medrese_adi:'Cedit Çeşmesi',
        coordinates: [
          {
            latitude: 39.9066046,
            longitude: 41.271480,
          },
          {
            latitude: 39.909410,
            longitude: 41.278286,
          },
        ],
    };
    this.mapView = null;
  }

  componentDidMount() {
    //this._playAnimation();
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      
     
     fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/317825?apikey=xBIquGHJ9jMx2NAGi7vpgitWSEG77XGz')
        .then((response) => response.json())
        .then((responseJson) => {
          var maksimum=(responseJson.DailyForecasts["0"].Temperature.Maximum.Value-32)*5/9;
          var minimum=(responseJson.DailyForecasts["0"].Temperature.Minimum.Value-32)*5/9;
          maksimum=Math.ceil(maksimum);
          minimum=Math.ceil(minimum);
          this.setState({
            maksimum_sicaklik:maksimum,
            minimum_sicaklik:minimum
          })

        })
        .catch((error) => {
          console.error(error);
        });
      
    }
    this.setState({
      bekle:true

    })
    setInterval(() => {
      
      this._getLocationAsync();
      this.setState({
        bekle:false
      })
    }, 5000)
  }
  reklam_ =async()=>{
    AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/8691691433'); // Test ID, Replace with your-admob-unit-id
    AdMobInterstitial.setTestDeviceID('EMULATOR');
    await AdMobInterstitial.requestAdAsync();
    await AdMobInterstitial.showAdAsync();
  }
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    this.setState({
      coordinates:[
        {
         
          latitude:parseFloat(this.state.location.coords.latitude),
          longitude:parseFloat(this.state.location.coords.longitude)
        },{
            latitude:this.state.coordinates[1].latitude,
            longitude:this.state.coordinates[1].longitude
        }
       
      ]
    })
    this.hesapla(this.state.coordinates[0].latitude,this.state.coordinates[0].longitude,this.state.coordinates[1].latitude,this.state.coordinates[1].longitude);

    
   
    

    
  };
  _playAnimation = () => {
    if (!this.state.animation) {
      this._loadAnimationAsync();
    } else {
      this.animation.reset();
      this.animation.play();
    }
  };

  _loadAnimationAsync = async () => {
    let result = await fetch(
      'http://www.agrupsigorta.com/loading.json'
    )
      .then(data => {
        return data.json();
      })
      .catch(error => {
      });
    this.setState({ animation: result }, this._playAnimation);
  };
	onMapPress = (e) => {
		if (this.state.coordinates.length == 2) {
			this.setState({
				coordinates: [
					e.nativeEvent.coordinate,
				],
			});
		} else {
			this.setState({
				coordinates: [
					...this.state.coordinates,
					e.nativeEvent.coordinate,
				],
			});
		}
	}

	onReady = (result) => {
		this.mapView.fitToCoordinates(result.coordinates, {
			edgePadding: {
        right: (width / 20),
        
				bottom: (height / 20),
				left: (width / 20),
				top: (height / 20),
			}
		});
	}
  hesapla=async(lat1,lon1,lat2,lon2)=>{
    var R = 6371e3; // metres
    var φ1 = lat1*Math.PI/180;
    var φ2 = lat2*Math.PI/180;
    var Δφ = (lat2-lat1)*Math.PI/180;
    var Δλ = (lon2-lon1)*Math.PI/180;
    
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    var d = R * c/1000;
    d=d.toFixed(1);
    if (d>1) {
      this.setState({mesafe:d+" Km"})
      var dakika=d/20*60;
      var dakika=Math.ceil(dakika);
      this.setState({dakika:dakika})
     
    }
    else if (d<=1) {
      d=d*1000;
      this.setState({mesafe:d+" Metre"})
      var dakika=d/10*60/1000;
      var dakika=Math.ceil(dakika);
      this.setState({dakika:dakika})
    } 
    
  }
	onError = (errorMessage) => {
		
  }
  _reklam_site =async () => {
    WebBrowser.openBrowserAsync('https://www.dedeman.com/TR/7-Oteller/278-Dedeman-Palandoken/');
  };
  ceditcesmesi = async () =>{
    this.setState({
        medrese_adi:'Cedit Çeşmesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.909410,
            longitude: 41.278286,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  sabahanecesmesi = async () =>{
    this.setState({
        medrese_adi:'Şabahane Çeşmesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.907656,
            longitude: 41.278396,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  cennetcesmesi = async () =>{
    this.setState({
        medrese_adi:'Cennet Çeşmesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.907911,
            longitude: 41.272584,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  dabakhanecesmesi = async () =>{
    this.setState({
        medrese_adi:'Dabakhane Çeşmesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.907423,
            longitude: 41.278973,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  alipasacesmesi = async () =>{
    this.setState({
        medrese_adi:'Ali Paşa Çeşmesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.912620,
            longitude: 41.276646,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  dortgullucesmesi = async () =>{
    this.setState({
        medrese_adi:'Dörtgüllü Çeşmesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.904032,
            longitude: 41.269037,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  yazicizadecesmesi = async () =>{
    this.setState({
        medrese_adi:'Yazıcızade Çeşmesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.903442,
            longitude: 41.269164,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  
 
  render() {
   if(this.state.bekle){
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}> Su beraberinde ferahlık ve temizlik getirir.</Text>
          </View>
        </View>
              
       <ScrollView >
           <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Cedit Çeşmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Cedit Cami karşısında yer alan çeşme 19. yüzyıl özellikleri taşımaktadır. Kitabesi bulunmamaktadır. Düzgün kesme siyah ve kırmızı taştan inşa edilmiştir.
        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ceditcesmesi}>Yol tarifi için tıklayın...</Text>

        
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/7163419742" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Şabahane Çesmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Kuyumcular Çarşısı olarak da bilinen Taş Mağazalarının başında bir dizi çeşme yer almaktadır. Soldan üçüncü çeşmenin üzerinde yer alan kitabeye göre günümüze gelen en eski Osmanlı eseridir. Çeşme Yakup adlı birisi tarafından Süleyman Han adına yapılmıştır.Şafiiler Camii'nin altında bulunduğu için Şafiiler Çeşmesi olarak da adlandırılmaktadır.
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.sabahanecesmesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://3.bp.blogspot.com/-6N6TkYeqnOI/V1KbIuj0jbI/AAAAAAAAePI/NnU-PP3hFSICV6zxXgph8yI7gEe4pcx0wCLcB/s1600/%25C5%259Eabahane%2B%25C3%2587e%25C5%259Fmesi.jpg'}}
          />
        </Lightbox>
       
              <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/6971848050" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Cennet Çesmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Karaköse Mahallesi'nde Boyahane Hamamı'nın doğusunda yer alır.
Tarihi kesin olarak bilinmemektedir ancak Erzurum'un en eski çeşmelerinden biridir. Yerli, yabancı seyyahların bahsettiği çeşmeyi Evliya Çelebi şu şekilde tanımlar: Üç ay havası gayet latiftir ki adam hayat-i cavdânî bulur. Suyu zülâl-i hayattır. Ata ve kadınlara suyu gayet faydalıdır. Cennet pınarı denilen sudan Temmuzda içen (ve min-el-mai küllü şey'in hay) ayetini anlar.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.cennetcesmesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.hinisinsesi.com/images/haberler/cennet_cesmesi[1].jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/8479660408" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Dabakhane Çesmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Tebriz Kapı semtinde bulunmaktadır.18 nci yüzyılda yaptırıldığı düşünülmektedir. 1962 ve 1975 yıllarında Erzurum Belediyesi tarafından iki defa köklü bir onarım görmüştür. Bu neden le orijinal şeklini tamamen yitirmiştir. Çeşme günümüzde Kevelciler Meydanı ortasında ve yol seviyesinden yaklaşık 4 m. Kadar derinde kalmıştır. Zeminden aşağıda bulunduğu için onbir basamakla inilmektedir. Bir duvara bitişik olarak inşa edilen çeşme, dikdörtgen bir blok halindedir. Yuvarlak kemerli bir niş içerisinde bir tas yuvası ile iki lüle yer alır. Saçak üç yönü dolanmaktadır. Kemer üzengi hizasında kalın bir silme yatay bir çizgide çeşmeyi ikiye ayırır. Akım hızı 32 lt/dk. Kadar olup, sularının böbrek hastalıklarına iyi geldiği bilinmek-tedir. Çeşme 12 m. Kadar güneyindeki Lala Paşa Hamamı’nın suları ile aynı kaynaktan beslenmektedir. 


Erzurum’un en önemli çeşmelerinden olan Dabakhane Çeşmesi Erzurum dışında da tanındığı için şehre gelen ziyaretçilerin ilk uğrak yerlerinden biridir. Erzurum dışındaki bir çok böbrek hastasına sularının gönderil diğide bilinmektedir. Hemen batısındaki yörede dabakhanelerin bulunması nedeniyle, Dabakhane adını taşımaktadır.

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.dabakhanecesmesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://agrup.com.tr/YX6B0554.png'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/8942694831" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Ali Paşa Çeşmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Ali Paşa Cami avlusuna bitişik olan çeşme Hacı Ali Efendi ve Topçu Kolağası Ömer Ağa tarafından 1865 yılında yaptırılmıştır. Çeşmenin üzerinde her iki kişinin de kitabesi bulunmaktadır. Düz kesme taştan inşa edilmiştir. Çeşmelrinin içinde su taslarını koymak için özel lüleler mevcuttur. Çeşmelerin arkasında bulunan abdest alma yerleri beş gözlü revak içerisine yerleştirilmiştir.
      
      </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.alipasacesmesi}>Yol tarifi için tıklayın...</Text>
        
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/4892479625" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Dörtgüllü Çesme</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Murat Paşa Mahallesi, Saray Bosna Caddesi üzerindedir.
       Dört yüzlü ve dört lüleli olması sebebiyle adına Dörtgüllü denmiştir. İki yüzünde kitabesi bulunmaktadır. 
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.dortgullucesmesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://4.bp.blogspot.com/-myrRDmnzBt8/Tslg1gTpihI/AAAAAAAAJYk/pE4z9nw9eCQ/s1600/D%25C3%25B6rtg%25C3%25BCll%25C3%25BC+%25C3%2587e%25C5%259Fmesi.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/6013989605" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Yazıcızade Çesmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Saray Bosna Caddesi üzerinde yer alan çeşmenin kitabesinden edinilen bilgiye göre 1750 .yılında yaptırılmıştır. Bu çeşme Mustafa Ağa'nın oğlu İbrahim Paşa tarafından inşa ettirilmiştir. Günümüze kadar çeşmenin orjinal halinden sadece kitabesi kalmıştır.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.yazicizadecesmesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://agrup.com.tr/JZ0H3XS4.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/6124959804" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              
        <View style={{marginTop:150}}></View>
        </View>
        </ScrollView>
        <SwipeUpDown	
        hasRef={ref => (this.swipeUpDownRef = ref)}	
    itemMini={
     
            <View style={{justifyContent:'center',alignItems:'center'}}>
           <View style={{width:'20%',height:10,borderRadius:40,backgroundColor:'gray',marginTop:0}}>
            </View>
       
           
       </View>} // Pass props component when collapsed
    itemFull={  <View style={styles.container1}>
    <MapView
      initialRegion={{
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}
      style={[StyleSheet.absoluteFill,{borderRadius:35,height:250,backgroundColor:'white'}]}
      ref={c => this.mapView = c} // eslint-disable-line react/jsx-no-bind
      onPress={this.onMapPress}
      loadingEnabled={true}
    >
      {this.state.coordinates.map((coordinate, index) =>
        <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} /> // eslint-disable-line react/no-array-index-key
      )}
      {(this.state.coordinates.length === 2) && (
        <MapViewDirections
          origin={this.state.coordinates[0]}
          destination={this.state.coordinates[1]}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="#1da1f2"
          onReady={this.onReady}
          onError={this.onError}
        />
      )}
    
    </MapView>
    <ActivityIndicator size="small" color="black" animating={true} />

  </View>} // Pass props component when show full
    animation="spring" 
  
    swipeHeight={Platform.OS === 'ios' ? 80 : 60}
    disablePressToShow={true} // Press item mini to show full
    style={{ backgroundColor: '#F2F2F2',borderTopLeftRadius:55,borderTopRightRadius:55,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,zIndex:2000}} // style for swipe
/>

      </View>
    );


   }else{
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}> Su beraberinde ferahlık ve temizlik getirir.</Text>
          </View>
        </View>
              
       <ScrollView >
       <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Cedit Çeşmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Cedit Cami karşısında yer alan çeşme 19. yüzyıl özellikleri taşımaktadır. Kitabesi bulunmamaktadır. Düzgün kesme siyah ve kırmızı taştan inşa edilmiştir.
        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ceditcesmesi}>Yol tarifi için tıklayın...</Text>

        
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/7163419742" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Şabahane Çesmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Kuyumcular Çarşısı olarak da bilinen Taş Mağazalarının başında bir dizi çeşme yer almaktadır. Soldan üçüncü çeşmenin üzerinde yer alan kitabeye göre günümüze gelen en eski Osmanlı eseridir. Çeşme Yakup adlı birisi tarafından Süleyman Han adına yapılmıştır.Şafiiler Camii'nin altında bulunduğu için Şafiiler Çeşmesi olarak da adlandırılmaktadır.
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.sabahanecesmesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://3.bp.blogspot.com/-6N6TkYeqnOI/V1KbIuj0jbI/AAAAAAAAePI/NnU-PP3hFSICV6zxXgph8yI7gEe4pcx0wCLcB/s1600/%25C5%259Eabahane%2B%25C3%2587e%25C5%259Fmesi.jpg'}}
          />
        </Lightbox>
       
              <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/6971848050" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Cennet Çesmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Karaköse Mahallesi'nde Boyahane Hamamı'nın doğusunda yer alır.
Tarihi kesin olarak bilinmemektedir ancak Erzurum'un en eski çeşmelerinden biridir. Yerli, yabancı seyyahların bahsettiği çeşmeyi Evliya Çelebi şu şekilde tanımlar: Üç ay havası gayet latiftir ki adam hayat-i cavdânî bulur. Suyu zülâl-i hayattır. Ata ve kadınlara suyu gayet faydalıdır. Cennet pınarı denilen sudan Temmuzda içen (ve min-el-mai küllü şey'in hay) ayetini anlar.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.cennetcesmesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.hinisinsesi.com/images/haberler/cennet_cesmesi[1].jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/8479660408" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Dabakhane Çesmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Tebriz Kapı semtinde bulunmaktadır.18 nci yüzyılda yaptırıldığı düşünülmektedir. 1962 ve 1975 yıllarında Erzurum Belediyesi tarafından iki defa köklü bir onarım görmüştür. Bu neden le orijinal şeklini tamamen yitirmiştir. Çeşme günümüzde Kevelciler Meydanı ortasında ve yol seviyesinden yaklaşık 4 m. Kadar derinde kalmıştır. Zeminden aşağıda bulunduğu için onbir basamakla inilmektedir. Bir duvara bitişik olarak inşa edilen çeşme, dikdörtgen bir blok halindedir. Yuvarlak kemerli bir niş içerisinde bir tas yuvası ile iki lüle yer alır. Saçak üç yönü dolanmaktadır. Kemer üzengi hizasında kalın bir silme yatay bir çizgide çeşmeyi ikiye ayırır. Akım hızı 32 lt/dk. Kadar olup, sularının böbrek hastalıklarına iyi geldiği bilinmek-tedir. Çeşme 12 m. Kadar güneyindeki Lala Paşa Hamamı’nın suları ile aynı kaynaktan beslenmektedir. 


Erzurum’un en önemli çeşmelerinden olan Dabakhane Çeşmesi Erzurum dışında da tanındığı için şehre gelen ziyaretçilerin ilk uğrak yerlerinden biridir. Erzurum dışındaki bir çok böbrek hastasına sularının gönderil diğide bilinmektedir. Hemen batısındaki yörede dabakhanelerin bulunması nedeniyle, Dabakhane adını taşımaktadır.

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.dabakhanecesmesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://agrup.com.tr/YX6B0554.png'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/8942694831" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Ali Paşa Çeşmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Ali Paşa Cami avlusuna bitişik olan çeşme Hacı Ali Efendi ve Topçu Kolağası Ömer Ağa tarafından 1865 yılında yaptırılmıştır. Çeşmenin üzerinde her iki kişinin de kitabesi bulunmaktadır. Düz kesme taştan inşa edilmiştir. Çeşmelrinin içinde su taslarını koymak için özel lüleler mevcuttur. Çeşmelerin arkasında bulunan abdest alma yerleri beş gözlü revak içerisine yerleştirilmiştir.
      
      </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.alipasacesmesi}>Yol tarifi için tıklayın...</Text>
        
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/4892479625" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Dörtgüllü Çesme</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Murat Paşa Mahallesi, Saray Bosna Caddesi üzerindedir.
       Dört yüzlü ve dört lüleli olması sebebiyle adına Dörtgüllü denmiştir. İki yüzünde kitabesi bulunmaktadır. 
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.dortgullucesmesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://4.bp.blogspot.com/-myrRDmnzBt8/Tslg1gTpihI/AAAAAAAAJYk/pE4z9nw9eCQ/s1600/D%25C3%25B6rtg%25C3%25BCll%25C3%25BC+%25C3%2587e%25C5%259Fmesi.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/6013989605" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Yazıcızade Çesmesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Saray Bosna Caddesi üzerinde yer alan çeşmenin kitabesinden edinilen bilgiye göre 1750 .yılında yaptırılmıştır. Bu çeşme Mustafa Ağa'nın oğlu İbrahim Paşa tarafından inşa ettirilmiştir. Günümüze kadar çeşmenin orjinal halinden sadece kitabesi kalmıştır.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.yazicizadecesmesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://agrup.com.tr/JZ0H3XS4.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/6124959804" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              
        <View style={{marginTop:150}}></View>
        </View>
        </ScrollView>
        <SwipeUpDown	
        hasRef={ref => (this.swipeUpDownRef = ref)}	
    itemMini={
     
            <View style={{justifyContent:'center',alignItems:'center'}}>
           <View style={{width:'20%',height:10,borderRadius:40,backgroundColor:'gray',marginTop:0}}>
            </View>
       
           
       </View>} // Pass props component when collapsed
    itemFull={  <View style={styles.container1}>
    <MapView
      initialRegion={{
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}
      style={[StyleSheet.absoluteFill,{borderRadius:35,height:250,backgroundColor:'white'}]}
      ref={c => this.mapView = c} // eslint-disable-line react/jsx-no-bind
      onPress={this.onMapPress}
      loadingEnabled={true}
    >
      {this.state.coordinates.map((coordinate, index) =>
        <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} /> // eslint-disable-line react/no-array-index-key
      )}
      {(this.state.coordinates.length === 2) && (
        <MapViewDirections
          origin={this.state.coordinates[0]}
          destination={this.state.coordinates[1]}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="#1da1f2"
          onReady={this.onReady}
          onError={this.onError}
        />
      )}
    
    </MapView>
    <View style={{flexDirection:'row',marginTop:200}}>
      <View style={{flexDirection:'column',marginLeft:Platform.OS === 'ios' ? 0 : 0,marginTop:Platform.OS === 'ios' ? 0 : -15}}>
          <Text style={{fontSize:Platform.OS === 'ios' ? 35 : 20,fontFamily:'baslik1',color:'gray',marginTop:5}}>{this.state.mesafe}</Text>
          <Text style={{fontSize:Platform.OS === 'ios' ? 25 : 15,fontFamily:'baslik1',color:'gray',marginTop:Platform.OS === 'ios' ? 5 : -5}}  >{this.state.dakika} Dakika</Text>
          <Text style={{fontSize:Platform.OS === 'ios' ? 20 : 15,fontFamily:'baslik1',color:'gray',marginTop:Platform.OS === 'ios' ? 5 : -5}} >{this.state.medrese_adi}</Text>
        

      </View>
      <View style={{marginLeft:width/4,flexDirection:'column'}}>
      <FontAwesome
    name="snowflake-o"
    size={60}
    color="gray"
  />
  <Text style={{fontSize:Platform.OS === 'ios' ? 18 : 13,fontFamily:'baslik1',color:'gray',marginTop:Platform.OS === 'ios' ? 5 : -5}} >{this.state.minimum_sicaklik}° / {this.state.maksimum_sicaklik}°</Text>
  </View>
    </View>

       <View style={styles.reklam1}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/8479660408" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>

  </View>} // Pass props component when show full
    animation="spring" 
  
    swipeHeight={Platform.OS === 'ios' ? 80 : 60}
    disablePressToShow={true} // Press item mini to show full
    style={{ backgroundColor: '#F2F2F2',borderTopLeftRadius:55,borderTopRightRadius:55,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,zIndex:2000}} // style for swipe
/>

      </View>
    );

   }
    
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent:'center',
    alignItems:'center'
  },
  container1: {
    width:'100%',
    height:'100%',
    backgroundColor: 'white',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:35
  },
  header:{
    zIndex:2000,
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
  footer:{
    position:'absolute',
    bottom:-50,
    width:'100%',
    backgroundColor:'#F4F4F4',
    height:110,
    borderWidth: 1,
    borderRadius: 55,
    borderColor: '#EDEDED',
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
    justifyContent:'center',
    alignItems: 'center',
  },
  reklam:{
   marginTop:Platform.OS === 'ios' ? 40 : 20,
    width:'95%',
    backgroundColor:'white',
    borderWidth: 1,
    height:120,
    borderRadius: 10,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    justifyContent:'center',
    alignItems: 'center',
  },

  reklam1:{
    marginTop:Platform.OS === 'ios' ? 40 : 20,

     width:'95%',
     backgroundColor:'white',
     borderWidth: 1,
     height:120,
     borderRadius: 10,
     borderColor: '#ddd',
     borderBottomWidth: 0,
     shadowColor: '#000',
     shadowOffset: { width: 6, height: 10 },
     shadowOpacity: 0.1,
     shadowRadius: 2,
     elevation: 5,
     justifyContent:'center',
     alignItems: 'center',
   },
 
  
});
