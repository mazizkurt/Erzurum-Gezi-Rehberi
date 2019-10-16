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
export default class KiliselerScreen extends React.Component {
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
        medrese_adi:'Oltu Rus Kilisesi',
        coordinates: [
          {
            latitude: 39.9066046,
            longitude: 41.271480,
          },
          {
            latitude: 40.550885,
            longitude: 41.000388,
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
  olturus = async () =>{
    this.setState({
        medrese_adi:'Oltu Rus Kilisesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 40.550885,
            longitude: 41.000388,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  osvankmanastiri = async () =>{
    this.setState({
        medrese_adi:'Öşvank Manastırı ve Kilisesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 40.613499,
            longitude: 41.542379,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  meryemana = async () =>{
    this.setState({
        medrese_adi:'Meryem Ana Kilisesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 40.509105,
            longitude: 41.460461,
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>Din ehIini kin ehIinden ayırt et; Hak’Ia oturanı ara, onunIa otur!</Text>
          </View>
        </View>
              
       <ScrollView >
       <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Oltu Rus Kilisesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Oltu Rus Kilisesi; Oltu ilçe merkezinde, şehrin doğusunda yer almaktadır. Üzerinde kitabesi bulunmayan yapının, 1877-1878 Osmanlı-Rus savaşı sonrasında, ruslar tarafından 1885-1890 yılları arasında inşa edildiği bilinmektedir. Yapı; 32x15 m boyutlarındaki dikdörtgen ayaklar tarafından desteklenen, kiborion tarzındaki kubbenin iki yanında yer alan dikdörtgen mekânlardan oluşmaktadır. Kuzey ve güneydeki uzun cepheler kısa tutulmuştur. Batı cephesinin ortasında süslü, yuvarlak kemerli, hafif dışa taşırılmış giriş kapıları vardır. Bu girişlerle doğudaki apsis üzeri yükseltilerek, haç planı üst örtüde daha belirgin hale getirilmiştir
        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.olturus}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://imgs.star.com.tr/imgsdisk/2019/01/06/060120191234598175213.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/7163419742" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50,textAlign:'center'}} >Öşvank Manastırı ve Kilisesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Öşvank Kilisesi; Uzundere ilçesi Çamlıyamaç köyündedir. Renkli taş bezemeleri ve kabartma figurleri ile ünlüdür. Öşvank Kilisesi güney haç kolundaki giriş alnında bulunan kitabeye göre Gürcü Bağrat'lı Hanedanlığı zamanında 3. Adernese'nin oğlu Magistras Bağrat tarafından 963-973 yılları arasında yapılmıştır. Mimarisi Öşk'lü Grigor'a ait olan kilise Vaftizci Yahya'ya adanmış yapının büyük kubbesi Bizans imparatorları 2. Basileios ve 7. Constantin tarafından 1022-1028 yılları arasında onarılmıştır. Kilisenin iç bölümlerinde bol miktarda görülen freskolar, 1036 yılında, Jojil Potrikios tarafından yapılmıştır. Kubbe kasnağında on iki pencere bulunmaktadır. Pencerelerin dış yüzleri kabartma silmelerle sınırlandırılmıştır. Sivri kemerli ve ince uzun olan bu pencereler gotik üslubu yansıtmaktadır. Haç Planlı olan kilisenin dıştan çapraz kanatlı (trancept) olmasına karşın içeride apsislerin oluşturduğu üç dilimli bir bölüm ve onun devamı olan uzun bir kol bulunmaktadır. Yapının iç bölümlerinde bulunan sütunların kaideleri bitkisel motifler ve dini resimlerle bezenmiştir. Apsisin üstü yıkılmış olan kilisenin ön cephesinde, portakaldaki ilave bölüme ait sütunlardan birisi günümüze kadar gelememiş ve onun yerine bir ağaç kütüğü konulmuştur. Batı haç kolu; batı, kuzey ve güney cephelerden ek mekânlarla çevrilidir. İki katlı kuzey mekân ilk yapıma aitken, güney ve batıdakiler sonradan eklenmiştir. Kilisenin içerisinde hamam, yatakhane, vaftizhane, rahip evleri, mutfak ve kütüphane gibi bolümler bulunmaktadır.
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.osvankmanastiri}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://4.bp.blogspot.com/-IXWmvDzxqgo/WZRj74uoG5I/AAAAAAAAK_k/4fVPn74Di7sQ3btNuwN6aUzNqOWjLXxrwCLcBGAs/s1600/1-20170808_130957.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50,textAlign:'center'}} >Meryem Ana (Haho) Kilisesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum, Tortum ilçesinde, Bağbaşı’nda bulunan Hahuli Manastırının Meryem Ana Kilisesi Bağdat Kralı III.Davut tarafından 976-1001 yıllarında yapılmıştır. Manastırı oluşturan yapılar bu kilisenin çevresinde yer almıştır. Kilise kapalı Yunan haçı ile bazilika planının birleştirilmesi ile meydana gelmiş kendine özgü bir yapıdır. Oldukça düzgün, kaliteli kesme taşlarla yapılan kilisenin üst örtüsü kırma çatılıdır. Kilisenin içerisindeki kabartmalarda arslan, boğa, kartal, grifon gibi figürlere geniş ölçüde yer verilmiştir. Ayrıca iç mekânın duvarları ve özellikle apsid İncil’den alınma sahneleri içeren ve Hz.İsa ile Meryem’i tasvir eden fresklerle bezenmiştir. Kilisenin apsid bölümünün üzeri kule şeklinde yükselmiştir. Ayrıca girişin yanında kesme taştan üç kat halinde çan kulesi bulunmaktadır. Kulenin üst noktası yuvarlak kemerlerle birbirine bağlanmış, üzeri kubbeli bir köşk şeklindedir. Kilisenin içerisine uzun kenarların ortasındaki yuvarlak kemerli bir kapıdan girilmektedir.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.meryemana}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://fastly.4sqi.net/img/general/600x600/58981430_rKddjmK7ME8qSvClZWkmJDjvfvS7Df1YUNzKMZVFQW0.jpg'}}
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>Din ehIini kin ehIinden ayırt et; Hak’Ia oturanı ara, onunIa otur!</Text>

          </View>
        </View>
              
       <ScrollView >
       <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Oltu Rus Kilisesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Oltu Rus Kilisesi; Oltu ilçe merkezinde, şehrin doğusunda yer almaktadır. Üzerinde kitabesi bulunmayan yapının, 1877-1878 Osmanlı-Rus savaşı sonrasında, ruslar tarafından 1885-1890 yılları arasında inşa edildiği bilinmektedir. Yapı; 32x15 m boyutlarındaki dikdörtgen ayaklar tarafından desteklenen, kiborion tarzındaki kubbenin iki yanında yer alan dikdörtgen mekânlardan oluşmaktadır. Kuzey ve güneydeki uzun cepheler kısa tutulmuştur. Batı cephesinin ortasında süslü, yuvarlak kemerli, hafif dışa taşırılmış giriş kapıları vardır. Bu girişlerle doğudaki apsis üzeri yükseltilerek, haç planı üst örtüde daha belirgin hale getirilmiştir
        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.olturus}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://imgs.star.com.tr/imgsdisk/2019/01/06/060120191234598175213.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/7163419742" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50,textAlign:'center'}} >Öşvank Manastırı ve Kilisesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Öşvank Kilisesi; Uzundere ilçesi Çamlıyamaç köyündedir. Renkli taş bezemeleri ve kabartma figurleri ile ünlüdür. Öşvank Kilisesi güney haç kolundaki giriş alnında bulunan kitabeye göre Gürcü Bağrat'lı Hanedanlığı zamanında 3. Adernese'nin oğlu Magistras Bağrat tarafından 963-973 yılları arasında yapılmıştır. Mimarisi Öşk'lü Grigor'a ait olan kilise Vaftizci Yahya'ya adanmış yapının büyük kubbesi Bizans imparatorları 2. Basileios ve 7. Constantin tarafından 1022-1028 yılları arasında onarılmıştır. Kilisenin iç bölümlerinde bol miktarda görülen freskolar, 1036 yılında, Jojil Potrikios tarafından yapılmıştır. Kubbe kasnağında on iki pencere bulunmaktadır. Pencerelerin dış yüzleri kabartma silmelerle sınırlandırılmıştır. Sivri kemerli ve ince uzun olan bu pencereler gotik üslubu yansıtmaktadır. Haç Planlı olan kilisenin dıştan çapraz kanatlı (trancept) olmasına karşın içeride apsislerin oluşturduğu üç dilimli bir bölüm ve onun devamı olan uzun bir kol bulunmaktadır. Yapının iç bölümlerinde bulunan sütunların kaideleri bitkisel motifler ve dini resimlerle bezenmiştir. Apsisin üstü yıkılmış olan kilisenin ön cephesinde, portakaldaki ilave bölüme ait sütunlardan birisi günümüze kadar gelememiş ve onun yerine bir ağaç kütüğü konulmuştur. Batı haç kolu; batı, kuzey ve güney cephelerden ek mekânlarla çevrilidir. İki katlı kuzey mekân ilk yapıma aitken, güney ve batıdakiler sonradan eklenmiştir. Kilisenin içerisinde hamam, yatakhane, vaftizhane, rahip evleri, mutfak ve kütüphane gibi bolümler bulunmaktadır.
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.osvankmanastiri}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://4.bp.blogspot.com/-IXWmvDzxqgo/WZRj74uoG5I/AAAAAAAAK_k/4fVPn74Di7sQ3btNuwN6aUzNqOWjLXxrwCLcBGAs/s1600/1-20170808_130957.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50,textAlign:'center'}} >Meryem Ana (Haho) Kilisesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum, Tortum ilçesinde, Bağbaşı’nda bulunan Hahuli Manastırının Meryem Ana Kilisesi Bağdat Kralı III.Davut tarafından 976-1001 yıllarında yapılmıştır. Manastırı oluşturan yapılar bu kilisenin çevresinde yer almıştır. Kilise kapalı Yunan haçı ile bazilika planının birleştirilmesi ile meydana gelmiş kendine özgü bir yapıdır. Oldukça düzgün, kaliteli kesme taşlarla yapılan kilisenin üst örtüsü kırma çatılıdır. Kilisenin içerisindeki kabartmalarda arslan, boğa, kartal, grifon gibi figürlere geniş ölçüde yer verilmiştir. Ayrıca iç mekânın duvarları ve özellikle apsid İncil’den alınma sahneleri içeren ve Hz.İsa ile Meryem’i tasvir eden fresklerle bezenmiştir. Kilisenin apsid bölümünün üzeri kule şeklinde yükselmiştir. Ayrıca girişin yanında kesme taştan üç kat halinde çan kulesi bulunmaktadır. Kulenin üst noktası yuvarlak kemerlerle birbirine bağlanmış, üzeri kubbeli bir köşk şeklindedir. Kilisenin içerisine uzun kenarların ortasındaki yuvarlak kemerli bir kapıdan girilmektedir.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.meryemana}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://fastly.4sqi.net/img/general/600x600/58981430_rKddjmK7ME8qSvClZWkmJDjvfvS7Df1YUNzKMZVFQW0.jpg'}}
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
              adUnitID="ca-app-pub-5888738492049923/4892479625" // Test ID, Replace with your-admob-unit-id
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
