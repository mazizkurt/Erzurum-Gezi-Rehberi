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
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 39.878582;
const LONGITUDE = 41.269779;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyCYvMpmVhFc0ydILEuXGJNYNGFnBoKPCL8';
console.disableYellowBox = true;
export default class KalelerScreen extends React.Component {
  static navigationOptions = {
    header: null,
   
  };
  constructor(props) {
    super(props);
    this.state = {
        bekle:false,
        footer:110,
        location: null,
        mesafe:null,
        dakika:null,
        sayac:0,
        maksimum_sicaklik:null,
        minimum_sicaklik:null,
        medrese_adi:'Erzurum Kalesi',
        coordinates: [
          {
            latitude: 39.9066046,
            longitude: 41.271480,
          },
          {
            latitude: 39.907701,
            longitude: 41.277064,
          },
        ],
    };
    this.mapView = null;
  }

  componentDidMount() {
    
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
  erzurumkalesi = async () =>{
    this.setState({
        medrese_adi:'Erzurum Kalesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.907701,
            longitude: 41.277064,
          }
        ]
      })
    
      this.swipeUpDownRef.showFull()
  }
  pasinler = async () =>{
    this.setState({
        medrese_adi:'Pasinler Kalesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.979371,
            longitude: 41.681197,
          }
        ]
      })
     
      this.swipeUpDownRef.showFull()
  }
  oltu = async () =>{
    this.setState({
        medrese_adi:'Oltu Kalesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 40.544090,
            longitude: 41.993116,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  tortum = async () =>{
    this.setState({
        medrese_adi:'Tortum Kalesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 40.341122,
            longitude: 41.469938,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  enguzek = async () =>{
    this.setState({
        medrese_adi:'Engüzek Kalesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 40.510999,
            longitude: 41.526326,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  ispir = async () =>{
    this.setState({
        medrese_adi:'İspir Kalesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 40.484522,
            longitude: 41.997134,
          }
        ]
      })
     
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>Sabırla, tevekkülle insanın kazanamayacağı kalp, fethedemeyeceği kale yoktur</Text>

          </View>
        </View>
              
       <ScrollView >
           <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Erzurum Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Kalesi'nin yapılışı, MÖ binli yıllarda bölgeye hâkim olan Urartulara kadar uzanmaktadır. Bugün varlığını koruyan kalenin ilk halini ise 415 yılında Bizans İmparatoru Theodosius inşa ettirmiştir.

Erzurum Kalesi, biri şehrin güvenliğini sağlayan muhafız askerlerin bulunduğu iç kale diğeri de halkın ikamet ettiği cadde, sokak ve mahalleleri de içine alan dış kaleden oluşmaktadır. İç kalenin avlusunda tuğladan bir hamam ve oda halinde mekânlar yer almaktadır. Osmanlı İmparatorluğu döneminde iç kalenin kuzey duvarı bitişiğinde İç Kale Mescidi yapılmıştır. Kırklar Türbesi, Ebu İshak-ı Kâzerûnî Türbesi ve Ali Ağa Çeşmesi de bu yapılara eklenmiştir. Günümüzde dış kalenin surları büyük ölçüde yıkılmış olup yalnızca dört yöne açılan kapıların isimleri bilinmektedir. Bunlar, Tebriz Kapısı, Erzincan Kapısı, Gürcü Kapısı ile sonradan açılan İstanbul Kapısı ve Yeni Kapı'dır.

Çeşitli dönemlerde onarım geçiren kale, son olarak 16. yüzyılda Kanuni Sultan Süleyman ve 19. yüzyılda II. Mahmut tarafından iki defa onarılmıştır.

        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.erzurumkalesi}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://cdnuploads.aa.com.tr/uploads/Contents/2018/09/26/thumbs_b_c_e5af5594fa916a45f0cf92cfe017034f.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Pasinler Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Hasankale, Erzurum'un 38 km doğusunda yer alan Pasinler İlçe merkezinin kuzeydoğusunda, Hasan Dağı'nın güney kısmında bulunmaktadır.

Kale, İlhanlı Emiri Hacı Toğay'ın oğlu Haşan Bey tarafından 1339 yılında yaptırılmıştır. Bir yanı dağa dayalı Kale, ovaya hâkim konumuyla stratejik bir öneme sahiptir. Kale, iç ve dış olmak üzere iki bölümden oluşmaktadır.
Kalenin güney yönün­deki duvarları, arazi konumundan ötürü diğerlerinden çok daha yüksek yapıl­mıştır. Yaklaşık 125 metre uzunluğunda, ortası 20 metre genişliğinde olan iç kale, kuzeye doğru daralan üçgen bir forma sahiptir. İç kalenin batıya bakan ana girişinin önündeki uzun dikdörtgen alan, kademeli surlarla takviye edil­miştir. Buradaki Demir Kapı ve Erzurum Kapısı ile doğuda Gizli (Oğrun) Kapı, Kalenin yer aldığı Haşan Dağı'nın ovaya uzanan en dik burnunu teşkil etmek­tedir. İç kaleden gizli bir yol, güneydeki Hasankale çayına kadar uzanıyor, kuşatmalar sırasında buradan gizlice su temin ediliyordu.

Kale, kuzeyde sarp kayalıklara dayanmaktadır. Kale iç ve dış olmak üzere İki bölümden yapılmıştır. Kesme taş ile moloz taşın kullanıldığı kalenin İç Kale kapısı ile duvarları günümüze gelebilmiştir. Evliya Çelebi kalenin çevresinin bin adım olduğundan ve etrafında hendek bulunmadığından söz etmektedir.

Kalenin güney yönündeki duvarları arazi konumundan ötürü diğerlerinden çok daha yüksek yapılmıştır. Kalenin Erzurum Kapısı batı yönünde olup Evliya Çelebi’den öğrenildiğine göre burada demir kanatlı büyük bir kapısı bulun­maktaymış.

15. yüzyılda Akkoyunlu Hasan'dan adını alan Hasankale'nin Türklerle ilk tanış­ması, Büyük Selçuklularla Bizanslılar arasında 1048 yılında yapılan "Hasankale Savaşı” ile gerçekleşmiştir. Savaşı kazanan Selçuklu kuvvetlerinin komutanı İbrahim Yınal daha sonra Erzurum'a yürümüş ve şehri yakarak adının "Kara Erzen” olarak anılmasına sebep olmuştur.

Kanuni Sultan Süleyman, 16. yüzyılda onarttığı kaleye bir cami ekletmiştir. 4. Murat da Revan Seferi sırasında (1634) kaleye bir köşk yaptırmıştır. Ancak köşk ve cami günümüze ulaşamamıştır.
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.pasinler}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://mapio.net/images-p/34490202.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Oltu Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Oltu Kalesi; Oltu ilçe merkezinde, Oltu Çayı kıyısındaki tepe üzerinde bulunan kale, M.Ö 4. yüzyılda Urartular tarafından yaptırılmıştır. Oltu'nun mahallelerini çevreleyen dış kale surları günümüze ulaşamazken, doğal kayalıklar üzerinde yer alan iç kale, sağlamlığı ve bütün ihtişamıyla dikkat çekmektedir, iç kalenin çevresi, yüksek ve kalın sur duvarları ve burçlarla takviye edilmiştir. "Ehmedek" de denilen iç kale üzerinde, sarnıçlar, bir türbe, bir şapel ile kale muhafızlarına ait mekânlar bulunmaktadır. Kalenin kuzeybatıdaki burç ve sınır duvarlarının geçmişte çok daha görkemli bir nitelik taşıdığı anlaşılmaktadır. Ehmedek'ten Oltu Çayı’na inen gizli bir suyolu da bulunmaktadır. İç Kalenin doğu eteğinde, aslı Selçuklulara kadar uzanan ve künklerle iç kaleye bağlı olan Selçuklu Hamamı ile kale organik bir bütünlük oluşturmaktadır. Osmanlı döneminde bir süre kervansaray olarak da kullanılan Oltu Kalesi, 3000 m2'lik bir alanın üstüne kurulmuştur. Kesme taştan yapılan kale, Bizans, Selçuklu, Akkoyunlu, Karakoyunlu ve Osmanlı dönemlerinde onarım geçirmiş, son olarak 1998-1999 yıllarında restore edilmiş ve sağlamlaştırılmıştır. Oltu Kalesi’ndeki Şapel: İç Kalenin kuzeydoğu köşesindeki, dik ve yüksek burcun üzerinde, temel seviyesinde kalmış bir şapel bulunmaktadır. Altı yapraklı yonca planına sahip olan şapel,10 11.yüzyıllarda,yörede hâkimiyeti ellerinde bulunduran Gürcüler tarafından yaptırılmıştır. Temel seviyesinde profili, yer yer süslemeli blok taşların kullanıldığı yapıda,güneş saati motifi dikkat çekmektedir. Şapelin batıdan bir girişi, doğu yönde de apsis yuvarlağı yer almaktadır.               

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.oltu}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://cdn2.neredekal.com/hotel/3/Bjv/600x400/pyeR.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Tortum Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Tortum ilçe merkezinden 14 km. uzaklıktaki Tortum Kale Köyünde bulunan Tortum kalesinin yapıldığı tarih  ve yaptıran ile ilgili hiç bir bilgi yoktur ancak,  Yapısal olarak kale bir orta çağ kalesidir 

Tortum Kalesi iç ve dış kaleden meydana gelmiştir ve bir de sur ile çevrilidir. Kalenin kuzeyindeki duvarları oldukça iyi durumdadır, ayakta olan kale surlarında harç kullanılmış olduğu görülmektedir. Ayrıca yer yer kale surları ahşap hatıllarla güçlendirilmiştir.  

Evliya Çelebi bu kalede Kanuni Sultan Süleyman’ın yaptırdığı bir cami olduğundan söz etmektedir, ancak bu konuda hiç bir iz yoktur.

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.tortum}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://1.bp.blogspot.com/-htd3OBX4Ihs/VATKSqvawQI/AAAAAAAAWp0/XQDwE9nP7vA/s1600/Tortum%2Bkale%2BKilisesi.jpg'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Engüzek Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>

Uzundere ilçe merkezine 3 km mesafede, Dikyar köyü sınırları içerisinde ve Tortum yolu üzerinde yer alan  ve Ortaçağ'da bölgede hüküm süren Türk beyleri tarafından yaptırıldığı düşünülen, buram buram tarih kokan Engüzek Kalesi... Yalnızca tarihe ilgisi olanlar için değil doğa sporları meraklılarına özellikle tavsiye edebileceğimiz, kaya tırmanışının yanı sıra eşsiz manzaraları yüksek noktadan gözlemleyebileceğiniz, cennetten bir köşe arayanlara Engüzek Kalesi gezi rotasını öneriyoruz.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.enguzek}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://uzundereninsesi.com/wp-content/uploads/2017/05/eng%C3%BCzek-kale.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >İspir Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        İspir Kalesi; İspir ilçesinde bulunan kalenin 12. yüzyılda bu bölgede hüküm süren İlhanlılar tarafından yapıldığı sanılmaktadır. Kalede, günümüze kadar gelebilen bir kitabe bulunmadığından yapım tarihi ile ilgili net bir bilgi elde edilememiştir. Kale, 16. yüzyılda Osmanlı Padişahı Kanuni Sultan Süleyman tarafından onartılmıştır. Kalenin temeli, çoruh nehrinden toplanan taşlardan yapılırken, üst duvarların inşasında blok kesme taş kullanılmıştır. Kale içerisinde bulunan mescidin minaresi, aynı zamanda kalenin gözetleme kulesi olarak hizmet vermiştir.




        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ispir}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://2.bp.blogspot.com/-s3AS0jm3j3Y/VeQz1cQ7fAI/AAAAAAAAhrg/zTDFnK3cczM/s1600/ispirkalesi.gif'}}
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>Sabırla, tevekkülle insanın kazanamayacağı kalp, fethedemeyeceği kale yoktur</Text>
          </View>
        </View>
              
       <ScrollView >
       <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Erzurum Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Kalesi'nin yapılışı, MÖ binli yıllarda bölgeye hâkim olan Urartulara kadar uzanmaktadır. Bugün varlığını koruyan kalenin ilk halini ise 415 yılında Bizans İmparatoru Theodosius inşa ettirmiştir.

Erzurum Kalesi, biri şehrin güvenliğini sağlayan muhafız askerlerin bulunduğu iç kale diğeri de halkın ikamet ettiği cadde, sokak ve mahalleleri de içine alan dış kaleden oluşmaktadır. İç kalenin avlusunda tuğladan bir hamam ve oda halinde mekânlar yer almaktadır. Osmanlı İmparatorluğu döneminde iç kalenin kuzey duvarı bitişiğinde İç Kale Mescidi yapılmıştır. Kırklar Türbesi, Ebu İshak-ı Kâzerûnî Türbesi ve Ali Ağa Çeşmesi de bu yapılara eklenmiştir. Günümüzde dış kalenin surları büyük ölçüde yıkılmış olup yalnızca dört yöne açılan kapıların isimleri bilinmektedir. Bunlar, Tebriz Kapısı, Erzincan Kapısı, Gürcü Kapısı ile sonradan açılan İstanbul Kapısı ve Yeni Kapı'dır.

Çeşitli dönemlerde onarım geçiren kale, son olarak 16. yüzyılda Kanuni Sultan Süleyman ve 19. yüzyılda II. Mahmut tarafından iki defa onarılmıştır.

        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.erzurumkalesi}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://cdnuploads.aa.com.tr/uploads/Contents/2018/09/26/thumbs_b_c_e5af5594fa916a45f0cf92cfe017034f.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Pasinler Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Hasankale, Erzurum'un 38 km doğusunda yer alan Pasinler İlçe merkezinin kuzeydoğusunda, Hasan Dağı'nın güney kısmında bulunmaktadır.

Kale, İlhanlı Emiri Hacı Toğay'ın oğlu Haşan Bey tarafından 1339 yılında yaptırılmıştır. Bir yanı dağa dayalı Kale, ovaya hâkim konumuyla stratejik bir öneme sahiptir. Kale, iç ve dış olmak üzere iki bölümden oluşmaktadır.
Kalenin güney yönün­deki duvarları, arazi konumundan ötürü diğerlerinden çok daha yüksek yapıl­mıştır. Yaklaşık 125 metre uzunluğunda, ortası 20 metre genişliğinde olan iç kale, kuzeye doğru daralan üçgen bir forma sahiptir. İç kalenin batıya bakan ana girişinin önündeki uzun dikdörtgen alan, kademeli surlarla takviye edil­miştir. Buradaki Demir Kapı ve Erzurum Kapısı ile doğuda Gizli (Oğrun) Kapı, Kalenin yer aldığı Haşan Dağı'nın ovaya uzanan en dik burnunu teşkil etmek­tedir. İç kaleden gizli bir yol, güneydeki Hasankale çayına kadar uzanıyor, kuşatmalar sırasında buradan gizlice su temin ediliyordu.

Kale, kuzeyde sarp kayalıklara dayanmaktadır. Kale iç ve dış olmak üzere İki bölümden yapılmıştır. Kesme taş ile moloz taşın kullanıldığı kalenin İç Kale kapısı ile duvarları günümüze gelebilmiştir. Evliya Çelebi kalenin çevresinin bin adım olduğundan ve etrafında hendek bulunmadığından söz etmektedir.

Kalenin güney yönündeki duvarları arazi konumundan ötürü diğerlerinden çok daha yüksek yapılmıştır. Kalenin Erzurum Kapısı batı yönünde olup Evliya Çelebi’den öğrenildiğine göre burada demir kanatlı büyük bir kapısı bulun­maktaymış.

15. yüzyılda Akkoyunlu Hasan'dan adını alan Hasankale'nin Türklerle ilk tanış­ması, Büyük Selçuklularla Bizanslılar arasında 1048 yılında yapılan "Hasankale Savaşı” ile gerçekleşmiştir. Savaşı kazanan Selçuklu kuvvetlerinin komutanı İbrahim Yınal daha sonra Erzurum'a yürümüş ve şehri yakarak adının "Kara Erzen” olarak anılmasına sebep olmuştur.

Kanuni Sultan Süleyman, 16. yüzyılda onarttığı kaleye bir cami ekletmiştir. 4. Murat da Revan Seferi sırasında (1634) kaleye bir köşk yaptırmıştır. Ancak köşk ve cami günümüze ulaşamamıştır.
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.pasinler}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://mapio.net/images-p/34490202.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Oltu Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Oltu Kalesi; Oltu ilçe merkezinde, Oltu Çayı kıyısındaki tepe üzerinde bulunan kale, M.Ö 4. yüzyılda Urartular tarafından yaptırılmıştır. Oltu'nun mahallelerini çevreleyen dış kale surları günümüze ulaşamazken, doğal kayalıklar üzerinde yer alan iç kale, sağlamlığı ve bütün ihtişamıyla dikkat çekmektedir, iç kalenin çevresi, yüksek ve kalın sur duvarları ve burçlarla takviye edilmiştir. "Ehmedek" de denilen iç kale üzerinde, sarnıçlar, bir türbe, bir şapel ile kale muhafızlarına ait mekânlar bulunmaktadır. Kalenin kuzeybatıdaki burç ve sınır duvarlarının geçmişte çok daha görkemli bir nitelik taşıdığı anlaşılmaktadır. Ehmedek'ten Oltu Çayı’na inen gizli bir suyolu da bulunmaktadır. İç Kalenin doğu eteğinde, aslı Selçuklulara kadar uzanan ve künklerle iç kaleye bağlı olan Selçuklu Hamamı ile kale organik bir bütünlük oluşturmaktadır. Osmanlı döneminde bir süre kervansaray olarak da kullanılan Oltu Kalesi, 3000 m2'lik bir alanın üstüne kurulmuştur. Kesme taştan yapılan kale, Bizans, Selçuklu, Akkoyunlu, Karakoyunlu ve Osmanlı dönemlerinde onarım geçirmiş, son olarak 1998-1999 yıllarında restore edilmiş ve sağlamlaştırılmıştır. Oltu Kalesi’ndeki Şapel: İç Kalenin kuzeydoğu köşesindeki, dik ve yüksek burcun üzerinde, temel seviyesinde kalmış bir şapel bulunmaktadır. Altı yapraklı yonca planına sahip olan şapel,10 11.yüzyıllarda,yörede hâkimiyeti ellerinde bulunduran Gürcüler tarafından yaptırılmıştır. Temel seviyesinde profili, yer yer süslemeli blok taşların kullanıldığı yapıda,güneş saati motifi dikkat çekmektedir. Şapelin batıdan bir girişi, doğu yönde de apsis yuvarlağı yer almaktadır.               

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.oltu}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://cdn2.neredekal.com/hotel/3/Bjv/600x400/pyeR.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Tortum Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Tortum ilçe merkezinden 14 km. uzaklıktaki Tortum Kale Köyünde bulunan Tortum kalesinin yapıldığı tarih  ve yaptıran ile ilgili hiç bir bilgi yoktur ancak,  Yapısal olarak kale bir orta çağ kalesidir 

Tortum Kalesi iç ve dış kaleden meydana gelmiştir ve bir de sur ile çevrilidir. Kalenin kuzeyindeki duvarları oldukça iyi durumdadır, ayakta olan kale surlarında harç kullanılmış olduğu görülmektedir. Ayrıca yer yer kale surları ahşap hatıllarla güçlendirilmiştir.  

Evliya Çelebi bu kalede Kanuni Sultan Süleyman’ın yaptırdığı bir cami olduğundan söz etmektedir, ancak bu konuda hiç bir iz yoktur.

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.tortum}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://1.bp.blogspot.com/-htd3OBX4Ihs/VATKSqvawQI/AAAAAAAAWp0/XQDwE9nP7vA/s1600/Tortum%2Bkale%2BKilisesi.jpg'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Engüzek Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>

Uzundere ilçe merkezine 3 km mesafede, Dikyar köyü sınırları içerisinde ve Tortum yolu üzerinde yer alan  ve Ortaçağ'da bölgede hüküm süren Türk beyleri tarafından yaptırıldığı düşünülen, buram buram tarih kokan Engüzek Kalesi... Yalnızca tarihe ilgisi olanlar için değil doğa sporları meraklılarına özellikle tavsiye edebileceğimiz, kaya tırmanışının yanı sıra eşsiz manzaraları yüksek noktadan gözlemleyebileceğiniz, cennetten bir köşe arayanlara Engüzek Kalesi gezi rotasını öneriyoruz.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.enguzek}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://uzundereninsesi.com/wp-content/uploads/2017/05/eng%C3%BCzek-kale.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >İspir Kalesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        İspir Kalesi; İspir ilçesinde bulunan kalenin 12. yüzyılda bu bölgede hüküm süren İlhanlılar tarafından yapıldığı sanılmaktadır. Kalede, günümüze kadar gelebilen bir kitabe bulunmadığından yapım tarihi ile ilgili net bir bilgi elde edilememiştir. Kale, 16. yüzyılda Osmanlı Padişahı Kanuni Sultan Süleyman tarafından onartılmıştır. Kalenin temeli, çoruh nehrinden toplanan taşlardan yapılırken, üst duvarların inşasında blok kesme taş kullanılmıştır. Kale içerisinde bulunan mescidin minaresi, aynı zamanda kalenin gözetleme kulesi olarak hizmet vermiştir.




        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ispir}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://2.bp.blogspot.com/-s3AS0jm3j3Y/VeQz1cQ7fAI/AAAAAAAAhrg/zTDFnK3cczM/s1600/ispirkalesi.gif'}}
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
              adUnitID="ca-app-pub-5888738492049923/8136045474" // Test ID, Replace with your-admob-unit-id
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
