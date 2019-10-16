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
export default class TurbelerScreen extends React.Component {
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
        medrese_adi:'Abdurrahman Gazi Hz. Türbesi',
        coordinates: [
          {
            latitude: 39.9066046,
            longitude: 41.271480,
          },
          {
            latitude: 39.878371,
            longitude: 41.312761,
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
  agazi = async () =>{
    this.setState({
        medrese_adi:'Abdurrahman Gazi Türbesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.878371,
            longitude: 41.312761,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  habibbabaturbesi = async () =>{
    this.setState({
        medrese_adi:'Habib Baba Hz. Türbesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.912172,
            longitude: 41.276217,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  ebuishakturbesi = async () =>{
    this.setState({
        medrese_adi:'Ebuishak kaziruni Hz. Türbesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.906395,
            longitude: 41.277910,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  emirseyhturbesi = async () =>{
    this.setState({
        medrese_adi:'Emirşeyh Hz. Türbesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.904868,
            longitude: 41.279497,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  anehatunturbesi = async () =>{
    this.setState({
        medrese_adi:'Ane Hatun Türbesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.904441,
            longitude: 41.270031,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  dervisagaturbesi = async () =>{
    this.setState({
        medrese_adi:'Derviş Ağa Türbesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.910310,
            longitude: 41.278894,
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>
          Her canlı bir gün ölümü tadacaktır
</Text>
          </View>
        </View>
              
       <ScrollView >
           <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',textAlign:'center'}} onPress={this.cifte}>Abdurrahman Gazi Türbesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Abdurrahman Gazi Hz. Türbesi; Erzurum'un 2,5 km güneydoğusunda Palandöken Dağı'nın eteğindedir. Sahabe olan Abdurrahman Gazi Hz., aynı zamanda Hz. Muhammed'in (s.a.v) sancaktar lığını da yapmıştır. Bir tekke zaviye ile birlikte 16. yüzyıldan bu yana ziyaret edilen türbe, 1796 yılında Erzurum Valisi Yusuf Ziya Paşa'nın eşi Ayşe Hanım tarafından yaptırılmış, yanına bir de cami ilave edilmiştir. Türbenin giriş kapısı üzerinde bulunan I796 tarihli kitabe, Hattat Salim tarafından yazılmıştır. Türbe içerisinde 4.85 metre boyunda Abdurrahman Gazi Hazretleri'nin makamı bulunmaktadır. Türbenin etrafı zamanla ağaçlandırılarak mesire yeri haline getirilmiştir.
        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.agazi}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.kulturportali.gov.tr/Common/GetFoto.aspx?f=MjAxNjEyMTQxMDM3MzM0NDdfRVJaVVJVTSBBQkRVUlJBSE1BTiBHQVpJIFRVUkJFU0kgRm90b2dyYWYgTXVyYXQgT0NBTCAwNTQ5LkpQRw%3d%3d&d=U2VoaXJSZWhiZXJpXFxHZXppbGVjZWtZZXJc&s=bGFyZ2U%3d'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Habib Baba Türbesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Ali Paşa Mahallesi’nde, Taş Mağazalar caddesinin sonuna doğru, Gürcükapıya giderken yolun sağ tarafında yer alır. Türbe 1843 yılında vefat eden Timurtaş Baba için yaptırılmış, 1847 yılında vefat eden Habib Baba bu türbeye defnedilince halk tarafından Habib Baba Türbesi diye anılır olmuştur. 

Türbe, mescid ve kabirlerin yer aldığı iki bölümden oluşmaktadır. Kabirlerin bulunduğu bölümün üstü açıktır. Türbede; Timurtaş Baba ve Habib Baba'dan başka, Habib Babanın eşi Hatice Hanım'ın da aralarında bulunduğu 6 kabir mevcuttur. Habipbaba Türbesi'nin Taş Mağazalar Caddesine bakan duvarlarının köşelerinde, tunç tan yapılma üçer adet kandil askısı bulunmaktadır. 

1844 yılında türbe; Erzurum Valisi Müşir Kamil Paşa tarafından düzenlenmiş ve kitabeleri yazdırılmıştır. 

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.habibbabaturbesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.edibane.com/wp-content/uploads/2009/07/habibbabaturbesi.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',textAlign:'center',marginTop:50}} >Ebuishak Kaziruni Türbesi </Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Ebu İshak Kazeruni Hz. Türbesi; Büyük İslam düşünürlerinden Ebu İshak Hazretleri'ne ait türbenin ne zaman yapıldığı tam olarak bilinmemektedir. İç kaleyi Çifte Minareli Medrese'ye bağlayan sur duvarı üzerinde bulunan köşeli burçlardan biri, içten kubbe ile örtülerek türbe haline dönüştürülmüştür. Önünde bir de zaviyesi bulunmaktadır. Zatın asıl mezarı Kazerun'da bulunmakta, burasının bir makam olduğu belirtilmektedir. Türbe, 2006 yılında Kültür Bakanlığı tarafından restore edilmiş ve turizme açılmıştır. 
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ebuishakturbesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://turbeler.org/userfiles/Seyh-ebu-ishak-kazeruni-hz-turbesi-Erzurum.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Emirşeyh Türbesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Emir Şeyh Hz. Türbesi; Tebriz Kapı'da, Emir Şeyh Camisi’nin yanında bulunmaktadır. Abbasiler döneminde yaşamış Emir Şeyh Hazretleri'ne ait bu türbe, Erzurum'un maruz kaldığı sayısız istilalarda varlığını korumuş eserlerden biridir. Kitabesi olmayan türbenin ne zaman yapıldığı tam olarak bilinmese de Ketencizade Rüştü'nün belirttiğine göre, 575 yılında, Saltukoğlu Sultan Mehmet Kızılarslan zamanında inşa edilmiştir. Emir Şeyh Hz. Türbesi'ne mescidin içerisinden açılan bir kapıdan, beş basamaklı taş merdivenle inilmektedir. Kubbeli sınıfından olan bu türbede tahtadan yapılmış üç sanduka bulunmaktadır. Türbenin güneye açılan asıl kapısı taşla örülmüştür. Muntazam kesme taşla inşa edilen yapının beşikörtüsü kubbesi iki kemere dayanmaktadır. Türbenin tam ortasında dört köşeli bir havalandırma penceresi bulunmaktadır.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.emirseyhturbesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://2.bp.blogspot.com/-Q5iJtasqSNE/Vx4nkXSkI1I/AAAAAAAAd8w/oDWmdEEV27Q1tdGcctlLqHdNplcMiWOWgCLcB/s1600/Emir%2B%25C5%259Eeyh%2BT%25C3%25BCrbesi.JPG'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Ane Hatun Türbesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Murat Paşa Camisi'nin batısındaki hazirede bulunan, Erzurum'da baldaken düzenlemeli ikinci türbedir.
        Türbenin kuzey tarafında, payenin sol üst köşesinde, mermer üzerine yazılmış kitabede; "1059 (1649) Marav Han’ın kızı Ane Hatun için yaptırılmıştır." yazılıdır. Türbe kesme taştan, dört yana açık kemerler üze­rine oturan bir kubbe ile örtülüdür. Dıştan basık pira­midal çatının kaplamaları tahrip olmuştur.

      
      </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.anehatunturbesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://erzurumportali.com/upload/6/139/9LS84V9J.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/4892479625" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Derviş Ağa Türbesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Emir Şeyh Hz. Türbesi; Tebriz Kapı'da, Emir Şeyh Camisi’nin yanında bulunmaktadır. Abbasiler döneminde yaşamış Emir Şeyh Hazretleri'ne ait bu türbe, Erzurum'un maruz kaldığı sayısız istilalarda varlığını korumuş eserlerden biridir. Kitabesi olmayan türbenin ne zaman yapıldığı tam olarak bilinmese de Ketencizade Rüştü'nün belirttiğine göre, 575 yılında, Saltukoğlu Sultan Mehmet Kızılarslan zamanında inşa edilmiştir. Emir Şeyh Hz. Türbesi'ne mescidin içerisinden açılan bir kapıdan, beş basamaklı taş merdivenle inilmektedir. Kubbeli sınıfından olan bu türbede tahtadan yapılmış üç sanduka bulunmaktadır. Türbenin güneye açılan asıl kapısı taşla örülmüştür. Muntazam kesme taşla inşa edilen yapının beşikörtüsü kubbesi iki kemere dayanmaktadır. Türbenin tam ortasında dört köşeli bir havalandırma penceresi bulunmaktadır.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.dervisagaturbesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'data:image/jpeg;base64,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'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/4892479625" // Test ID, Replace with your-admob-unit-id
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>
          Her canlı bir gün ölümü tadacaktır
</Text>
          </View>
        </View>
              
       <ScrollView >
       <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',textAlign:'center'}} onPress={this.cifte}>Abdurrahman Gazi Türbesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Abdurrahman Gazi Hz. Türbesi; Erzurum'un 2,5 km güneydoğusunda Palandöken Dağı'nın eteğindedir. Sahabe olan Abdurrahman Gazi Hz., aynı zamanda Hz. Muhammed'in (s.a.v) sancaktar lığını da yapmıştır. Bir tekke zaviye ile birlikte 16. yüzyıldan bu yana ziyaret edilen türbe, 1796 yılında Erzurum Valisi Yusuf Ziya Paşa'nın eşi Ayşe Hanım tarafından yaptırılmış, yanına bir de cami ilave edilmiştir. Türbenin giriş kapısı üzerinde bulunan I796 tarihli kitabe, Hattat Salim tarafından yazılmıştır. Türbe içerisinde 4.85 metre boyunda Abdurrahman Gazi Hazretleri'nin makamı bulunmaktadır. Türbenin etrafı zamanla ağaçlandırılarak mesire yeri haline getirilmiştir.
        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.agazi}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.kulturportali.gov.tr/Common/GetFoto.aspx?f=MjAxNjEyMTQxMDM3MzM0NDdfRVJaVVJVTSBBQkRVUlJBSE1BTiBHQVpJIFRVUkJFU0kgRm90b2dyYWYgTXVyYXQgT0NBTCAwNTQ5LkpQRw%3d%3d&d=U2VoaXJSZWhiZXJpXFxHZXppbGVjZWtZZXJc&s=bGFyZ2U%3d'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Habib Baba Türbesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Ali Paşa Mahallesi’nde, Taş Mağazalar caddesinin sonuna doğru, Gürcükapıya giderken yolun sağ tarafında yer alır. Türbe 1843 yılında vefat eden Timurtaş Baba için yaptırılmış, 1847 yılında vefat eden Habib Baba bu türbeye defnedilince halk tarafından Habib Baba Türbesi diye anılır olmuştur. 

Türbe, mescid ve kabirlerin yer aldığı iki bölümden oluşmaktadır. Kabirlerin bulunduğu bölümün üstü açıktır. Türbede; Timurtaş Baba ve Habib Baba'dan başka, Habib Babanın eşi Hatice Hanım'ın da aralarında bulunduğu 6 kabir mevcuttur. Habipbaba Türbesi'nin Taş Mağazalar Caddesine bakan duvarlarının köşelerinde, tunç tan yapılma üçer adet kandil askısı bulunmaktadır. 

1844 yılında türbe; Erzurum Valisi Müşir Kamil Paşa tarafından düzenlenmiş ve kitabeleri yazdırılmıştır. 

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.habibbabaturbesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.edibane.com/wp-content/uploads/2009/07/habibbabaturbesi.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',textAlign:'center',marginTop:50}} >Ebuishak Kaziruni Türbesi </Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Ebu İshak Kazeruni Hz. Türbesi; Büyük İslam düşünürlerinden Ebu İshak Hazretleri'ne ait türbenin ne zaman yapıldığı tam olarak bilinmemektedir. İç kaleyi Çifte Minareli Medrese'ye bağlayan sur duvarı üzerinde bulunan köşeli burçlardan biri, içten kubbe ile örtülerek türbe haline dönüştürülmüştür. Önünde bir de zaviyesi bulunmaktadır. Zatın asıl mezarı Kazerun'da bulunmakta, burasının bir makam olduğu belirtilmektedir. Türbe, 2006 yılında Kültür Bakanlığı tarafından restore edilmiş ve turizme açılmıştır. 
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ebuishakturbesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://turbeler.org/userfiles/Seyh-ebu-ishak-kazeruni-hz-turbesi-Erzurum.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Emirşeyh Türbesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Emir Şeyh Hz. Türbesi; Tebriz Kapı'da, Emir Şeyh Camisi’nin yanında bulunmaktadır. Abbasiler döneminde yaşamış Emir Şeyh Hazretleri'ne ait bu türbe, Erzurum'un maruz kaldığı sayısız istilalarda varlığını korumuş eserlerden biridir. Kitabesi olmayan türbenin ne zaman yapıldığı tam olarak bilinmese de Ketencizade Rüştü'nün belirttiğine göre, 575 yılında, Saltukoğlu Sultan Mehmet Kızılarslan zamanında inşa edilmiştir. Emir Şeyh Hz. Türbesi'ne mescidin içerisinden açılan bir kapıdan, beş basamaklı taş merdivenle inilmektedir. Kubbeli sınıfından olan bu türbede tahtadan yapılmış üç sanduka bulunmaktadır. Türbenin güneye açılan asıl kapısı taşla örülmüştür. Muntazam kesme taşla inşa edilen yapının beşikörtüsü kubbesi iki kemere dayanmaktadır. Türbenin tam ortasında dört köşeli bir havalandırma penceresi bulunmaktadır.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.emirseyhturbesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://2.bp.blogspot.com/-Q5iJtasqSNE/Vx4nkXSkI1I/AAAAAAAAd8w/oDWmdEEV27Q1tdGcctlLqHdNplcMiWOWgCLcB/s1600/Emir%2B%25C5%259Eeyh%2BT%25C3%25BCrbesi.JPG'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Ane Hatun Türbesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Murat Paşa Camisi'nin batısındaki hazirede bulunan, Erzurum'da baldaken düzenlemeli ikinci türbedir.
        Türbenin kuzey tarafında, payenin sol üst köşesinde, mermer üzerine yazılmış kitabede; "1059 (1649) Marav Han’ın kızı Ane Hatun için yaptırılmıştır." yazılıdır. Türbe kesme taştan, dört yana açık kemerler üze­rine oturan bir kubbe ile örtülüdür. Dıştan basık pira­midal çatının kaplamaları tahrip olmuştur.

      
      </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.anehatunturbesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://erzurumportali.com/upload/6/139/9LS84V9J.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/4892479625" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Derviş Ağa Türbesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Emir Şeyh Hz. Türbesi; Tebriz Kapı'da, Emir Şeyh Camisi’nin yanında bulunmaktadır. Abbasiler döneminde yaşamış Emir Şeyh Hazretleri'ne ait bu türbe, Erzurum'un maruz kaldığı sayısız istilalarda varlığını korumuş eserlerden biridir. Kitabesi olmayan türbenin ne zaman yapıldığı tam olarak bilinmese de Ketencizade Rüştü'nün belirttiğine göre, 575 yılında, Saltukoğlu Sultan Mehmet Kızılarslan zamanında inşa edilmiştir. Emir Şeyh Hz. Türbesi'ne mescidin içerisinden açılan bir kapıdan, beş basamaklı taş merdivenle inilmektedir. Kubbeli sınıfından olan bu türbede tahtadan yapılmış üç sanduka bulunmaktadır. Türbenin güneye açılan asıl kapısı taşla örülmüştür. Muntazam kesme taşla inşa edilen yapının beşikörtüsü kubbesi iki kemere dayanmaktadır. Türbenin tam ortasında dört köşeli bir havalandırma penceresi bulunmaktadır.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.dervisagaturbesi}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExMWFhUWFh0bFxYYGRoYGBcdFxgYHhsaGBobHSggGxolGxUXIjEhJSkrLi4uFyAzODMsNyguMCsBCgoKDg0OGxAQGy0lICUtMC8vLS0tLS0tLy0tLS8tLS0tLS0tLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAQkAvgMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAEAgMFBgABBwj/xABKEAACAQIEBAMEBwMICQQDAQABAhEDIQAEEjEFE0FRBiJhMnGBkQcUI0JSobHB0fAWJENicoKS4TM0U4OissLS8URjk7MVRXMX/8QAGgEAAwEBAQEAAAAAAAAAAAAAAAIDAQQFBv/EADURAAICAQIDBAgEBwEAAAAAAAABAhEDEiEEMUFRYXGRBRMiUoGhwfAUFULRIzIzU7Hh8UP/2gAMAwEAAhEDEQA/AOd6b4zRh/RhQTH2Z5APpxvTgjl4wU8FADgYVpwQKeNilgoywfTjNOCeXjOXjAsG04zTgnl43y8AWDFcYqYINPD/AAumr1Ak2IYEi4UlG0k9hqi82xPLkjjjcnQ8McpuopsA041pwSUgwQQexEH5HGcvDxnGauLtBOEoOpKmD6TjNOCeXjNGNEsH041pwToxnLwBYMVxorgnl41y8AWClMJ0YLNPGuXjTQQphKLgs08YlO+MAI5eFBMPlMbCYBQcJjYTBITG9GNAG0Y3owQExmjAAxoxvl4I0YzRjDLB+XgStn6S+1UUfmf8KyfmB78MeI+JikvLU/aMP8I7+89MV3hnDDWMBgPzx5PHcfLG9GN79Wd3DYU1qmrJqt4lpL/o6bVG7vCr7wgmR7zgZPGOYUQq0x3OkyT3MtgocBpUxJJZh32+XX44tnAXytPLq1ZqStqa7FZMMdgbm3bHhzk5yue77z0o55xh7Dpdi2KNU8WZl/KdDA/dKKR8jhvL8fqKSHUG+3sken+WOi8Qr5avlapoNTYimWhSAwiDdbEG2KDxzhZZ2dRuT+sD8ow2LJLHK4OhMk3kj/Ed+JKZLilKrYGD+E2P+eDtGKA1FlubQY+N/wBxxeeCZwVqQb7ws3vHX47493geNeZuE+Z5vEYVBaoj2jGaME6MZox6dnKDaMa0YK0Y1owADaMaKYJ0Y1oxoAxp4xKd8ElMYiXwBY9oxmjD+jGwuFsWxnRjNOH9GGKubpqdLVFB7EiflhZZIxVydDRjKTqKs3oxvRgepxSmNtTe4R+blQfniIzfigAkLoEdTLz8FgT8SMck+PwQ/VfhuXjweaW+mvHb/JP6MIrVFQS7BR3JA/XFNzHiCq9tT/CKY/K/54jua069QBPeWPzM/wADEXx85f04PxexVcEl/NLy3JrxItOsytTJJAIYhTBHTzGBuT164DyWY5AjmJJ6CahvHaFB+OJ9fo6ztRVqFqTBlBE1GnzCRuvrh6h9HueUqIpaZE+cXAM9seXNRyyc5ziu5FY8Vw+OOmLT8WVmvxTVNnb+0wQf4UEn4nDNDNwd9Hflosx/aJnHfavh7KNM5agTO/KT/twO3hXJH/01D/417e7EFm4frFv4nJ+bromvI4VVzIncuOgqCWH99TOCsvxTTILOD2MVF+Jsw+Zx2l/CORj/AFal/h/dhDeCsiZnLU/hqH6HBLNw75Jo1eloPmm/I4rnqRq3Qo0wYRuwIurAGb7e/Fg8L0qaUtAYGobuNiD2g3gD9uCvGnguquYH1PKtytC3ST5pM3JntiAPh7iAictWaNtSM357/njo4aTxS9ZGn3XTOuWXDnxrevIt+jGtOKpT4rWpPy3WpTZfaVgagFuqt5xv+LErk/ECtYgH+wb/ABR4I+BOPWh6RxPadx8f3OaXB5Ocafh+xLacaKYCqcfyws1Qg9ijg/8ALhqn4lyxAJeD20sY+OnHR+Kw+8vMh6nJ7rJLRjWnALeIcqP6Uf4W/djX8osr/tf+F/8Atw34nF7y8w9XPsYcUxWOPcbIfl0mjT7TC9+ww/xvxInL00WlmtMEaR3uN8VFN8ebx3HfoxvxaOrBg/VJHWaR1AEEGexkfA9RhejA+UzisdIg36EWtqnfYyP/ABiQCY78eRTjaOKSaYzoxWM/wHM18ywy7UtRAkF0pmYtAdpJIG4EW72xbtOKB4zRxmiwsAqid+nb+NscXpLfEvE6uBk1k27CXX6JeLMZakpveayf92MP0XcUUR9XTf8A2lCfmWnFebxBnqcHn1lBFhreLWtf9uCOHccz5YkZnNHf+leLkD8W8kD4j4ePi4ieJbJfFHpUpPeyXb6M+KA/6rNv9rR7R/tO+G//APOeJxH1Of79I/8AXhKeJuIeX7auZYWNWr5vZtZpvqXYg7bE4kMl4szgCg1q4b+095nfUx/yuRcTjofpTNXKPl/sFhi31JVE8QoNIoHSBCjRRNhYCx7YcOZ8QiP5qT/ul7+hw0PE+aHmNfMxubtFp9bAwbDeDaxwVT8XZgxOYrQL26i47X2+cdcc/wCNXXFHyJvgML6LyQhc7x4KScm0giByTfedj7sNjjfHR/8Arz/8FX9jYOPijNaTGZqG+8j02tHf4YL4J4pzVWpSp82pFZgurSsrMSygi5g9ZG9sJ+Ki/wDziZ+X4exEAfFHG134c3xy2Y/7sZ/LLiwJnh5I/wD4Zgf9WLPnvF2Zp1aq8wwtllVAO/muJ+6fidsZlvHtcrOpJnrHy2nB+Jh/bXzM/LsL6IrI8ecQEBsgf8FUY030jZoe1kP/ALB+q4umV8e1dID6NV7gj9NPu69cKoeN60+Y0yPQx7v2fPA+Jwtf015sX8sw9hwzj3EjXzNSsy6C9yszp8oG5A7Yj2cR398Htju+c8c5ks2k0tI2BVmPz1X22HcdxgSv4zzQN6WXPY6G94vr7fqO4npfpNOOnRt4/wCjpjw1bJnFefvcwNgfMPjPphJqUyRqTT30H9h/Ycdj/lhUb2stlTeD5dRPqAW39PdgHiXiunoIfIZRgTc6EFrQYgmTO35nHLPPCfKFfEqoSXN34nMPqlNgTTLMQJgCT8V7eoJwy3DqgpGsylUDaJIIloBgGImDMdsX3wBWoV+LU4RaAEsnKLUtRUTpYazIMbCAQIIviL+lnj7ZnP1acjl5d2Sna4gKHk9ZdDiam9WnusnPfeqKVhVPCcKp4qTOqcKVgAOXpEkQCNPyjUALiIEExHXEqhmY6fx+zHK6WcqBgNTWiJH3WtMTF5G8zO/e7eFM+1WmV5qGCQoK6XiLGNVxM2/df1OF4pfyff0PPz4GvaLDpxRvFRb635TflrtIP3429e+L8iGBO/WMU/jufanmqmnSdKLYojGSvdlnYzvFzbD+kZfwfiHAK8oz4mztSlSoIGIdaCA2BHmRZN76iWJn1+bHhnP13LhqsECYKrqjV0kX32/gn8Q49UqUgStMn2TNGkbTAnyxtGJbhtErBFKmJg+VEAF+2n3fLHgXtR7GncmeJZt0o0tRUtpYsdIv5rD5T88bAbl0jNyhdtMCfO5GwvawHZcLI5qMKgU6UBp+VbS4+BnUd8RdfjVUNy0CQkrdQJAJMDSRaZxNlUr2Dn4kALuR2PlLGR0nc3i2N8LqE06jErIqIoIp05iKhIup3t8sLoUyV1GnSAO86jb/ABdMO0nU0yKNNB5w+sFlpsQvSSxeBHs+X1BnAlYrVCqlXSPMkgWtTpH8tMR1+WG8lxQLUXl8tOv+jpowIkW0qPmDscNvTLUWaprZlO0wIIEEKtt5EMXi18N5PjtNEqU6tSnRVklQSqeZSPujeVL+/G0ZYfma61HNR1ps7bsUhmANpvqNsBllDwEpATtDgz0+9t29+E8P49QNJUSulQEsSoaSAAAo0kzeW6dMG5IJUVnMLojzCwn1G0RNhFxvjGgXahqgKb6i1GkImPa1GJmfNb5Yyjw/Lmuv2IGsIfaqWZkBP3o3PbGZXLlTIEyTcRcGPWwnvIHfEjm05dRW5alkVNILPBKqN4Mdtp22wI1kDToU3amq0h9oC5JL+VQRIPm38ww4chR5rJpBKICx+0A8w/FMTCj1sPTBtNEEakUEiAoNQ9Np1CRfsJwNmGpU6jqtGmLKDep5pUG/n9YxlM0GHCcuaWpaQlmdSNbfdVCIPT2u33Rit8QytFNSnKyFH+1YTJ76Sdj19O2LbR4gugUxRpoqywCawJIAOz9lGMFLLtVSk1EEVWAch3DKW3AljJwbmqiu/Roqrn9SZSqwahUGgVKTsfNTkk1TTTSIba/n64iPpA8DZulmKuYTK1uRUdnBhXZNRLMr8pnCgGYJNxHWcWv6Ncwh4jQFOkKYKVvvOxjTIksb7DHayMMp6XZKcVdHi4jG6ePVniHwLw/OEtXy66z/AEiTTc/2isav704pHFvoOy5g5bM1KZm4qhagj006SD7ycVWePUl6tnGhkpbSkkkgAQD7XdujAmIje2DKHBs5TPMp0XlAp1BDKyAwJgWN4v3IxHU60OpYeyZO3RpBA2/yxceCeLq6VHqO1NuYotGnT5jpWmogCNbTuY3Iw8m1uhNuoRwLxpMrml0lYBqAQJP403B90+4YezmXp18w7I6EsoghgZVQtwO09b4rnijPNXqandnWxAPl0Ajbr0AN73Nu5PhjhjluYkxcAwSYn539emKZeJnkxKMhcGKMcmqJNcW4JylUPXpD2Zs/3gGFgh7j5YsWQRSAeYpgCSA0T0IlfTAfivJan0mRHLERtCKIi1rYeyVAqoAF7dI6/wCeOU7eZKU6igEBwCQsWboZNoHT9cReY4JUSoYNNmBgKD5h+KewEzPr64MCM7hFHnj3aY6k9ALfkMCcb499VqanuzEmoxEH5DYXsPf6krVmptMMzqilHOIa/sx9mpGxC/fPq1rAgDEN4i8aUKaldRqVVMaV2IMxLbKRt1NxbFN8UeM6uZhE8iDqLO3vI2Hp8+kVXFlj7SEsnYT/ABLxdmamoK3KRhBVCRI/rNudhtAttiBJ641jMUSS5E27MxNcM8T5miuhX1U5ko/mE+h3G3Q4hcZgaT5gnR1fwr42y7uvMJpOoPkN0dibaWtHeDHYTizV8trk0zpJM6D7LG1/6hN5K9zIOOBYtvhHxo+WZUrTVogRpnzKOmk/hmLdtoxKWP3SscnvHSMlkyza3qxpElIlhJ3PcEC0fsjC2RK1Rir/AHRbRP8Ao6Y1fe38pwweIrmVSorC6ylQCYm2mPw2AKHsNiAQxwQMuZembMA8r2lGhhO6HofeLEEYlRSwyjkkB9s37pH/AF401KjSqJVeo2lXViAlyAwMTqO8dsR4rnUZJETvgPOHUAD/ABvhGyyiw7wW2Up8Uoct6hao1XQDT0iGRiR7R272x2cY89JlqoqBssxWvMI43We3wkfHHduApUXL01qVDUdRpaobGoVJBYjpMThZVROS3D2ONT/E45RmeFcYNZwOJuqGqQoCFiF1kDp2j9+OmcIDCjSDtqcU1DtF2YKAzH3kE4V10dip30PInMG35/G/7sLy7jaBqve3p8BEG474VTRQxuTB+7sRJBva378KqUoLQra4kWNlg6mgiY2IM2v8PROQIeooK6dLfiU+h2J6m24nf0xZeAVoo+YarWgtsSY2tYRv2OKxkwrEapA6wIPvF4+PT3bXLhDtTpINGpQAZsDBWdWkiIA7H9MTnyHxrcdzHEGBimTG+/xIB6TiwcLqNGolrCANiSSLA95IHrOI8pS5royMSGZSfLEj3jEtl4WGp6lMwmqLGAGby9ADpHqWnpiXQu1TJLKSC5YiV9szawkLJjyqJ7TM45D418SHNVNCmaVMnQYgtPX3dp6H4CyfSJ4pqcv6qpGqp5qrCzFfuqf7Vz6iOjY5ti0I9WSnLojMZjMZihMzGYdyuWeo606as7sYVVBZmJ2AAuTiyH6PeIBA5oROyl01GPTVa/QwbYDUmyrYzBfEOG1qB01abIfUWPuOx+GBMBhmMxmMwAWPwZ4lOTq+YaqTbjfSejgdSO3W3YY6YmZD1UrJUAcAkNutRWX2W38ptfpjiGLn4F8UcgGkUDH+jZr6OpCjudwel7Xsk49R4PodPXMAmOWl+hRZEEyDHUEEH3YbDI9ZaXKQqUcmVHRGIjtcDbAfCc2leHdiGKw0blh7JJO0jykmdkwQ1SjRrBylVmAMCVAMqR2kb455HSmQWVQcxanLVUVpXTqDEat9WrtG2O05YWMfjf8A52xxPjGYHIqAKV8hAOoQp07mF2G9u2O05JvL8f1v+3EpLYHdlP4s+XXOkFnD85SBzHCkyp9jVp0mRaLzi55X2fczD5MR+zHFvpCzS0+KP9sqMHpPBDkxopGLKRe956+/HaMmbH+3U/8AsbCaWlb6ixe55BLKJlZPvtuOg+PzwoZlx5gWBiJ7gkk3+OB23xlzj0zlHEvubfkMdO4VUVqFABpPJQQLk+UA7Y5jTUXm0D88dg4FlVbKUJEg0lv2lBMHof3Yjm5IpidMbzuWIzFUaCJqsVYyAdROkA7XMD44luJvQpURUOpRTQiSdWuLkjqCStzffAHBHqGo9NnZghJAciSBAE/Fww/s4jvpMzIp5RVFzVYLNwNK3IHxAHxxNR3orKRzDP5tqtRqrnzOZPp2A9AIA9BgfGYzHUcxmJjw3SyRfVnalVaax5KKBnfe2okBBte592+IjGKsmMAHXuH+NuA5dkajkaoZCCr8tCwI2Opq0zbfHVeF5/L1stTzAcBKi6gSQsBiTDXibwR6Y8n8owx/D+3HqbwBk1ThmSESTQRr/wBca/8AqxLNKlY+PmI4lnsk6MtRkqqdwgaoD6QgOOZ+KfAOXq+fJpWpsxsHp8umffrK6R0BAg+px3EUx2GGKtWmntFF95A/XEFnoq05Hkbi3C6uWqGlWQo46EbjoynqpjcYDx6h8b+HclxCgabvSSqL0qoK6kaOsG6Hqv7QDjzPxLIvQqvRqAB0YqYIIt1BFiDuD1Bx0Y8imiUoOPMGwqm5BBFiDIPqMJxmKCHXvCmWR6a1TWvUWdKCSvS5NgVb33AwXnMlWaG0jqp8wFwTMAmYBtt0xUfo8StUBFME8tr9gCQf1n88Xjj1GpaUa/mIUFo+7FtvYnHLkVbHXjduwFeFVNSI9OOYyjzKWHmIEleq3+Ix0ClwrPr/AOupxPTLr2A6se2KrnFI5MnSVSnciyeRDJ2sIncbdMT31rKn/S8XRpEQmYo0l99mLA+urEna5DSd8xriHgl6zmrWrUXqNA1PlaLEwIAv6DbFk4FlKtNCK1bmsTIOlUgHcQu95Mnviqpl+DLP87olj/SNnSzqRsUdqpKMO4jC/wCWlKh5XzNDNLELUpZjLLV/3qPURP7yG/4Rg9qW30F2R5vbfGThddYO4PqMIUTjvOQJRl0ksG1HYzY95ntI2x1jhebalkqboGZhl6ZCSomVWbxYXk+gxyFz0JsNoH8el8dB4RmIpKtTOU9LU00qUU6AoFheSbET3HpGJZSmKNsluE8WqZmhr0BZZEt5jfmHqLXCt0vGKv8ASTWbmUqZ2VSQOlyBPbdTizZKrlaQNKkzNTJJKpzCCSqgSTqPl0kj+16XpXi/MK9ddRYqKcA7t7TXMgfphIVrKTg9JW8HcFyi1a9Om7aUJ8xNoUXN+lhvjB9X/wDe/wCDGA0BdWrA+5f34vZHT3noDLeGci6AladULeQAwgAeWCNoifd8MCDwjwlwWOXNzI006qi8WACbXB73xxHL5mmGE1K8SLWg9gTq2mOmOoeFMlUWirktUco3mdqhjVEDSz+WxExEgDHN6qt3JlvWSfPcJoeCeGOSHyz0yJB01apltMxAVi3QysAKZgxJuXBc1oOWy4zBqaPJo5ToYSkwlpgBQVgWA95xVsxSAJDBQxGnVBDk7apDSGMDbbHNvFHD1WoeZUquLspudKki2qo0sOsjqThtKltYnI9PB8VrxRkatR1NJdQ5ZU/aBBed1JGqx6480IMr1Nf4BPh1whly8WNWfVV/fgjhSd7lMeVwlezO5/yVzFrLb/3afeb3vik/SV4Nq0qQzZA8pC1CHVjBgKYB6G1h94dsc/00fxVP8K/vwkLS/E/+EH/qxRRplc3EvLHS4x+F/uD4mfBlBamfyqOAVauisCJEFgDI64jIp92+Q/fid8EwM/ljTGtxVXSr+RSRsCwDEX6wcM3scijuSPgPL6a2ZoPuBB/uPB/M4vrBqVDyVCAKxU6fLEopAt8T8Tik8NzCUuK5s1WWmC9UNE1FBNUEqpUSQL3gbbDFyzXE8m1Lliu8moGM0+ylfLEdNO/bHNl5nTiT08gR6T1W01KtXQ1j5yYDWJHwPXBFX6HMqRK5mssjqFeDHoqzgStnqIpuadYFghADgoSYMRvPTHTeA5pa+Xp1gbVFDSV0nzXusmNxaTiblKKtMZxTdSRymt9DDfczqN76TD9GOI6r9EOdB8tXLsP7VRT8jTx29qd7fx/EYQDGwwLiMgvqYHlN6ZuRcA79OsfOMJImSBbt2/bGHnqMF2gG0xGoTMHvdR8sMM89BjvOMf54iGEgj7tjufatf/xib8OZollDPTCqQqh2vHoJ2AMzF9utq8i74lvDZIdvOVgDYjebbn34WS2Nit9jpXEuIilRJp1KCuQBOoW914mLCbbn0xybO13qOSx1EDcXEL29Os46DxLjM0dLEt6iol/eD64586trIECfXeT7/dhMXJj5IuPMZZO17XsbX/j54XRprI5msKeqgGfdJA74MoZKCV1K34gtyAN58thuPQx6YdbMwSGkAAaYhSLey5WTHTfYzvs+rsI2KyKZECajZnUAD5VpKJ3a7MbREWviZyPjxqQKCijKIC2CWBmCqjTE3j0GIGjRpBA+oVGJI5MVBAEENqAvbUIkEb+mBc5lkQWqrUafuBtMR3ZRefTrjWkx1aLm30jFhJy6a5FxsQJmTv2+ZHXEBxHxGazA8qmkKQ3kVy5tcswnVAHmmbDENlPa+7YMfNpIspOzAj/Pa+GcYoJBqYbXbLx5RVJvJJRQbmCFCmLRaT1wdkW4dB5y5sGbaGpER66lF5xD0kkgSB6nBNfI6YIYFTEG3XcEAnb4i2+NMJfVwr8Oe/xUP+3Aec+o/wBF9aHo/LP5iP0wPkckSyEiQXQQOuot6/1DjWYyR11I2Uvvb2CJsST94Y2gsCYXxNeCcqKufytMkgNWUEqWVom8MvmBjqPmN8O+OOAfUszyhJR6aVKZO+mosx8G1D4YsH0LcH52e559nLjV73cMqD/mP90YWT9mzUtxn6TfDh4fnBUpWpVpalv5SCAyXJJIlTJ31e/EMufkLrNM2npfrBn3R8cdq+mDIpX4ewkCpSdKiSY3flke46/mBjl9DIoEKVMxSQkDUNSwO4Bm/wAI+OJRncd+ZZweqlyIR+JtSokU3SajnUNCN5QOkgwJJ7TNtsS3DPpS4hRpinrSoF2aompzAAEsCCbACTfA/FeG0F4dzUZHrHOBZVgSKfKaAVDGJcMfWBisZrKPTgOpWRIntiiUZLcR6ky8H6XeIT/QD/dn9rYYP0p8RJs9NfdSU/rOKPhVPB6uHYLrl2jtYyJ2jpsLfG5uMJy9MswUCSdhIEnoL+uHc3kXpgFwF1bDUuq4kSoMixG4wwUIg9/2YcUMy9KOZTaVYgCCAOoN2PsjY232xO+A8rQq1nFVF0pSnzEwW1qoNu+sCPdiHWieWrENreVWwIZbAkajM+0BG57Rec8Js1OoTCiE0ltfJKqKg1azcgwu0TcYnJ7MFLc6RnvCuT0ScuhsbyQdrbHHHlpKr1l1BVDkBW9o6S0aSbA2i/f0x13jviJEVwoLFYBFwp1bgNtqAiAdyQBc25JmMxT11fKpPMaDG/nYzN/TaMTxtuxsrvkPDNosDRp1DYwBt6Wi4366pwJxGkT5gkDrJ83U6j6EdcN1KAli/lBEhQIgmYEdrG+MyhddyYYdbyIMTfaLfH0xRKt0Rqt0IzdJtKt92LTAPyn/ACwFiYq0NY0o8L+EkXgQGgxc/wATGI58qwBO4Bie/uwyYyY1TUkwN8Jw5QWW2mxMTGwJ3/P4YVSy7MCVUwvtHoPeTYe7DDC01KNa+yLXAME+hmMTWYzyNUZmWmuvemqKEUkCAogBB5ZPaesiIzKUpjUs7BR8d4i/X8sE5rMopKFdhvBB7iNjvG/qbYnJ26Eb3HBXLSacDadJ0jyixAiFFuv7btPnILhgHBDktI1E1Qm2+2m3aTjEq7coAtctfT0mJ6i46zI9cIoONPmW0TG8X3gm3+Q3wJtGLYtv0vrLZGqDapk0gAQB127nX+WJP6C1M5og3mkI/tCsJ94/bjnfEq5YLJkeyBfyhAsAekMOgxM+BqrIazoxVhoAgld2ILFgIUKJYk2gGx6bXs0VUq3L54/Ytm+U0kHLva+2mqxDQf8A2/gQMSFLw/lVgLlqMW3QH9cROZfMOhqPlKutqTprqKwZUagzOxAUA6bqZA0kkbERZqTWB7x+g/diGS0ki2KVts55444Yo0BFWmG0ElRC6gXHsi0mbmJsPjWuPZQ6EbUxCrB1dWESV9P3YvvjcH7GO9x6Blv8J/PFV8Q0vszE6QCdo+PTBCe6HlW6KdhVPCcKp46jlHM05LnVMgxfe2JXL8NYpNRdFvKW1ABerSbGIgCfvbdQfxjKvnG58BKhQSgUqrBVUSv4fdt674Zp5Wsh5aKUcKXeRq1FQxkk2sAe0T1O827VRFk+wEqZEr1JVhP3BA+7uZ63ECP0LyOfag9mAQAqs2Gkm5NoLXkgdj6YG+ruFaqKTSsKWCzLMrkt3Hst0tHScP0OD12VQUcq8NvF3LLIT8Q0selhfA1a9ozxJrhWcWsGJbSwJVbwtXUG1KQf6O2oE3B2OICtQDN5acuWLHUJXcmJ6g7YtnDuHaFK8pGptAaAxKwIU+YSfOywNxJMkXxS2ytQEOVbls7AGDeCsyImPtFA99sJCLt0NJbczbVeVMoNTbwTpgi47/LaBvhVGpNgBoPQmSNzt+lsN5nhNXm8sAltGrYiBp1Xt2/O2BVyNXQ1TS2lGAJ7EhyPly2ntGK6BUkHV0O+i3RQSeoi0z0iAe5HfEonD6StNR3JqinoWpOpRU0yzGwJW48wEi46EQ9DK10el5fM4HLm4uxUSDtcGx23wWatdpBVitEhzINjqRSR3ksD3g9rYzTLkFPkHJwoGnqGgqq7GFqHWW0lfai7L7XmO1rEhJW5INMqCDMnTBFyu8yDIImxEHfEwciVptWCssyC4BksroP2jb0wniXAXmogpMGpM41CCIVtTQY6rqO89IvjGr2YupPZkDVrFgYnuFU6RbVEgdRaOg+OGRSMKQ2pzuGF1BEyATBsZntgr/8AE1V1O1NlQELaZBI1C1z92PeQMPHgzEpSFNtb6dEyYFTSQZAt7UG1sbVBdANKgFU6yb7qFE+UiLnpfp+eHcxWLHUzaYPlgXDC9wDsCTjKWWrMtRuX5aayZWCATEi1zvv3w7/+MzGhG5RAeYgRADMsG020nfpF74yurB94Bm0V5ZTAA9bnrvt7h/4J4FmCiVzeNK6gNiNUXEiY1SOxwXl/D9bW9JqZLUtcmwUBDBItcXm4wmtw+qirUWkwBcoYWDKhGglfunmLB9PTB3DKS5BWa4yzKh11DAYAEQDr1iAJ7MdrCIvaOo5etNNfVR+mOfUPD7lQjXqadUXMfZu6KJjVKAenlI9964XSY0kMWCqD3uD/ANpxGavkWwyW+5B+Lsk1Y5ZliEZyVOzDymLeqx8Tiu8Uzso9M09J0MP+GRHp+7HRfqclVIEkHT/eIA/XFQz3DqhqU6yW5bQxuDDkC36e9hGFSdpNF1KFN2UGrwauqB2pOFO1rx3I3A9SIwFTx116FQaLe31/vMpn1lTirZnwbWzGdqUqIRDpLnWYWVZVaIBO7Dp1OOiE3J00QmoxVpklWTIJQpuRmgtUM2vWusgEoy1PJtM2HqR6nZrOZT69mBozPOpiuag5iCm2mjUVmA5cToJA9/zh+JV1Sll0YhfszKlCFaK1X2b/AGZIH3YIm0CIcqV6Zzmcip7C5iDphlJDj2k8zBZFievlA6UUldnJSfzN5TP5QZNylHOGmcwigc9NWsJVYBTyz5RqNjvqxI5zOZY5jIqadcM4pCmRXRABzCaYqIKUmGMbd74rec4hTXJnlM0nMgFtCLKrTmyiBMmZgbj34kk4hT+tZCno0kDLyNAiWFGdLE6xYEWPTrtgTdhp3slOD57Lsc060syuimwYtVUjz1kJ5cUbE1IM9BHQWiczmskcrQL0s1oapWKRXTUpAoh5PIBIslr7fKe4dXHJqssxyhp8qzapTsfxGAR5p269abnOJgZXLEEhtVWToXTY0wp07LAkeUA9ovO6r5DaN/vsLNUzGV+v1E5WY5wRiTz6ehtOVbYciQdEie++InL5vIjI1GFHMcvnUgy/WE1atFfTpPJsI1mP63zTmeIIM/WHm0qla0CVAy9Q2cHUYYTExfob4j6OfX6rUYFiefTBOhIgpX3WNJvBkjr7o0NH0J761lOfkENHMFnSjyz9YSApqkoHHIuQ3/nDC57IxnCuXzDFaf2wbMKNU5ijOiKJjzwbRYbfhRUzEZjImSysKGohVuxZS0Nukgiwj2TuBiLyXEgVzPtWpjT5FkfzigL/AI7GPNP7CWCiXDilfKJSXmZeuVYVyNNefvUmqyeULEhSP2bYmuJ5zLLmKymi7OVrFhzbGMuxcaeX1pmBbr63rnE883KywXVLpVnyr5iKFPSQDtGsbR7PTBuezVNszUpKG16axixA/m9QEki8SqRJ+9EQQca30Jab+fUjH4plTkqjHLVQgzCrpOZIZm0tDhzSkDRPz+ZIzuV+uZIDLVNbJl+U31gQikJolBTg6QLn037DcUz6rRqtLmMwokBSYFOpKiTa4vYkHUPUNZfiP86yd3KsMtNl85YJqLCSRP8AwxInCN0NSoTwnjWTFLNuuUqKqImsHMEl/tAFAmn5YYk26dOzma4zkxQyTNlKhDK/LUV7pFVp1RT88uZggzNweotHOIaVezSFQam0gKOcgJWNj5iI9Ad8BcU4iEo5eHeStUMw0EvFR41TuBMQI1ehwqkmCjFv77C0txfKjN51eQ5dErGo/OMOF1Fwq6YEnY74iK3HcocpSc5IhDXqAU+e+4WiWcsACwMIL9U9BhrM8WRs7m0JeAM1pWFZFISqZA6wFm+5JnAed4tGVENUDDMMNUgPHLp2LAXBiekwBsJwxscaX/S4UOJ5f69yhlwXaiHNQ1HgfzURKbew2jULySPfPcBzSNllIoBB5fLqcwdLddUkgWxz7h3Eh9fooAwQ06J5YI0GcrTgkEXMkGf6oAEbWfw5x6mcqGNQkjQCWMsLOBsLe4YSboaGP6dSy5vMor0fsl1EgKdTDSZiwm5ABPSADiu5jiFELVH1aFU0yRzGOqayKsw5iPa32w9xTi66aBRh7YZlk+ZRUfVIG+xj1APS9f4nniGrk6gVUBFt5VGZoSUkQCIAt/V6iy6va5/dCuNSr695MZ7iVILl3+qqSZCDXUGiHbaD5iSxa/7cKTi9Onn62jL00YB1NcvUGqKns+1Aky0DePTEHxDiS8hLuJaqDBEtanGokeYAPtsfywH4orCpXf7N3Ad4UMgAkgzDqV2O8Sb33l45Kd390Uli28+veM16oLZfW0Myr94kEmvUIBXtDMJ0xJt0w0K7CpmHX2mSq2r/AHwCiwkXYbHr3nAjsRm8rTAsVy4gi/mZXv2Pmm36YDyYmjm6pmGS0R1zOXJE7gx3HX5qoJGKKRtqWuhTXVP29UkkH7tOjuBfr64KyrKmfytpM5YEGLQlEKQ0EGY1AjoRiNWkzZakEkE1q032BTLC57XxM0qFMZ6kC5YqtDTp2Jp5amQ59JFvccNyY3Jha1lOXrRlyg5a+06gEa0JHmSLfxfFd4ik0Mt0Giq0Dp9o/wD2jBGTrIKFd1GkA0R5TquGdp83qgt+/GqmS5lKhey0ajDoxAr1PZE3PSJ69YxvJDSlv99hur/r+Z9Bmvyo1sD5CppyjEKG/nNOzCQfs6vT44nqmWD53MutIhV+tK5mJlKgnWQQDJ6iFkb41Q4FR+qlWrMqtVV/ZBYQjSIDG+lifhhXOPUVNB3D+LURXy/MV9TDLgBNGhSQpEKTIudxbbsMHZV8iMu9SllGeUUnSRzJ5tKBAcsDqg2t5fXAmV4XkHzGWYV6ocCgVVtAkBaeke8kjb3YluH0stQp1Go1WrDQsK1TmqoDoPKADBFh8B78JJxjuGyVkLxUs9Ci1NdAVKgKGPLqo01C+bsRH64neApT+u54tHlKxPTXRqBgJ/sbf1RiL41n1qLSRhao76iPKCAIMH3kCZgXwJmaevOZh1crBzIIJ8obkVANu1yLbMe2GjkXUjLdV98wPPNo+sU1J0fWqWm0nz0a8kT1On4X64TQqgV8oYJkZUtYabEBY62M/PBvDMgBlylVhrWpSJhiAIp1WSdRC7MNrbdsZQpU1bKF9ILJQVQHltQYmSJsgZTfck/LXJPkVq0QHD8yCmYDCEWms6QJMZqj1I3i15/Zidr8YyL0KPMyVm1hTzHkQwna99Ux02xEcJpo31mnUqBQKcTcqB9ZptJg/igWPXFrHhOkKNGn9ZIVWd1YaZJbT3ta3zwrlFbDKPYRnFKWUOazHLSotbRmPvgoxehWJMESOuxtIxE5fhj/AFYmoNSjMA2MgjQ4Pm2glQAdj8sXir4Zo1K1QrWvpcMsKfbpOhM+0BFQmJAm+GM/w80qDIayKrFVgLFONNSQbNIIBPTbfCyyPobWxWadJDm8qywCPqtupUpRSPf0+O56F8MoVaNOoDUMlabToDR5lEAsDP8ApBZhIHvw1XroM7ldIVmf6vBHsrFRboep8hG33u+xHC8uKlAu9NmDUkGpmZw0VaYgIpACBrwADuOhw+9G4rXy/wAjeazLMtGqaxARGkCnTliK1aBqT2ZgDoPWTgXifM52cBcOgWtoI+6VqKxRuxAXr8MGcXyQFIUzRpbVAp01F0nUSvL9bkwTc9YnDHFMsqZysdJ865ksDMGaVRpt2K9OkdQZxVdhkTu2C1cwWy6NJjnVAIJ6pQ/aDhnj4FStBP3KbTP4qVM9o+9h36vT+rHS4ha09fv0vZFrmE39MMcUoorrqKwaFEifSjTA/wCXC2PWrbxLfSphc5REJ5VoyJPMkJSFp6WmSSd97kwVOsnKzDAUSopJ5gCVU86jaom0HSdtV1MXsV16ObOaFenkq7OpADDVDaRoViNE2AidvS+Efydz4FRV4fW01QocTYhCCoFpEEWvh4xSds5o4+rGzlUGTpSaSEu8OZ0OGalcDeYp6TqgWOqMF1NC8RMKnkU/ZAfaAJQiA2xACht9USNt1cR8OZ16a0VyFYqk6JIQCTLHe8setrDrgzL8A4iKzVzkDqdG1NqW8qRp0h4M2Gr4nrjVKtxtL3IjhVPVl6wQ0nPMpAMqGFgVj5l3uLeUEDddjBWcy+lcohegjmnsUPnD1q0EAeyIb70XXvOHl8J8RWm9OnkPs3ZTpNSGldWmTzNgGawPUeuCU8McUbS7ZVdVJPsyWUkkszFD9tES7G9v2q5+QaXY6VQ5vMrqpFQtdmQ0hqGvWCS0QwEX6mL9hHulJsmWapR89ez8my+UQumx1QdUnuRtiSo+GuJMz1jltNWpZ/tFIZSPN/S+Xc2w2PCPEeUtE5ZIB1aTVaBZRIIeZtt+s41SRqi0Ly2XoDPZaGSRToW5Sy8qmltQMLIWwi026YGyugUazCsDOg6hTUFAa9KIixsALdb74MTwvxTmLV5FEMoQKebMCnZQBMEAAb4bpeCuJCmUFHLgMAGmoSCAwaN+6j5YHJM1QZqtVTRQJqaQuvQeXqlrS0MbFY7mdR74Y+uN9er7DTzm06V8h5FXzcze/tGVie8EYKXwLxJgqNTymhZ0gvUtq3gjrh+t4D4iarVkXJ6jqhiz6yGBUyYiYJ27+7C7IV42yHTO0vq9RmaFNakC5piQQlcwU6yBY6rD3QZJOTqyjFib0tBWmsODVIBYkeXUS1ulvfjf8geJFeWRk9LFSwLOw8gIWFIsQGb5jtgpPBHERyyRldVOAh/CFaQFOkm3TaDjVpRqxtEVkqlI1s4hUg8qfYQMq86mCQwDar6QBAsBvZgjPZ1Fy1Bi7gJWqKGKoWNqWrUpUaQJOxJEizbCXp+BuITUEZfS4v5iNRLAkvC+h26gX7ON9H+d5SoWyx0tq0wNF2BJEobkAfxuWupul2BU8wg4g4Mh3SdMKFH831eV9yQvmgKBJmemI2jxekaFRhqKLVpK5GnU0jMD2RMg2JJa8T0hrBS8EcQ1moz0AxEF0u7dLkp+EDr0w0Po+z0aebS06tRBVYsSQYFMDVfcz+kDcWGh0R2a4lR52THnlhTZAukr/rDAGoY6sBMe7aDgXhlf7TMpzXOgGZKqKYXNUQwpxve0tpEQNjIseY8AZxmQ82kppiFfSC48xKlTy/KBPsiOt4wul4BzIVg1ZZZwXKgLqGsMZ8kloFj0ON1oFBkPx7iVMZemGqMAWcSmkElVTUZJISA6xEkajHXD1XMj621PWTUZXhb6ELZViIYAkQpmO5JE4langOuTaqsC6g6bE7mOVE2GB18D5wVBU5tMtMEnSWK7adRpzAEe8jApJI2cG/mVrJ8QSnl3YmoyLVpeY2ZiVr2VQAAognzH2gSYgYI4v4hoouXY85S9AMppspIXUywxcbkpeN4GLL/IOvpKl6cAyu1jeSfs4PvIPXfDR8BVWjWtB4EBSTpW8+WUsJJtffe1819pigy/B6QPtJ8xjYzNP8S/MYBWuP4GMNfC0U1BrZyn+IYb+vp/W94UxgcPO2MFQjqcFG6gxc0p7/4TjKmaQfdb4Kf3YCWodyT88aatg0hqDGzfZGPwxsZzry2+QwItXCiZxlBqCRn/AOown3fsxhzzdEPzAwLqwqcFG2FHNt+A/Mfvxi5tvw/8QwLhOrGUGoNOdb8I+eN/XG7D54EVsaNQbY0LCTmn/q/GcJNdz1X3X+WBw+MapgMsMOYPp+eM+sH0wKreuElsBthD136MvyP78IObPcfLDIOMIBwGGmzVST5ljpa/64dSq+5b3+X9L2w0VxrAwtjnNqfj/wCH/PChXbv+WGTjJwUFgPMw4pnCBglcOTQ2ScJ1HD56Y0MBo3JxtQcPJtjTfx+eABAONtUGMXG3xgGlcYWTGFJhx9vj+wYDbBzUwoVBGG6m+N9MFBYvWMZqw1T3wUuAENzhFQH0w622G8FGsQhIxt2xjYwez/HfAZ0GuccKNY4bfCqW2ALFiv3w5rGBxh6lt8/1wUCNlsaBxvGxjKNP/9k='}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/4892479625" // Test ID, Replace with your-admob-unit-id
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
              adUnitID="ca-app-pub-5888738492049923/6124959804" // Test ID, Replace with your-admob-unit-id
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
