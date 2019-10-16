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
export default class HamamlarScreen extends React.Component {
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
        medrese_adi:'Erzurum Hamamı',
        coordinates: [
          {
            latitude: 39.9066046,
            longitude: 41.271480,
          },
          {
            latitude: 39.910537,
            longitude: 41.273384,
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
  erzurumhamami = async () =>{
    this.setState({
        medrese_adi:'Erzurum Hamamı',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.910537,
            longitude: 41.273384,
          }
        ]
      })
     
      this.swipeUpDownRef.showFull()
  }
  hanimhamami = async () =>{
    this.setState({
        medrese_adi:'Hanım Hamamı',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.907256,
            longitude: 41.274825,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  boyahanehamami = async () =>{
    this.setState({
        medrese_adi:'Boyahane Hamamı',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.908040,
            longitude: 41.272496,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  ciftegobekhamami = async () =>{
    this.setState({
        medrese_adi:'Çifte Göbek Hamamı',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.912630,
            longitude: 41.279025,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  lalapasahamami = async () =>{
    this.setState({
        medrese_adi:'Lala Paşa Hamamı',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.907207,
            longitude: 41.279316,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  kirkcesmehamami = async () =>{
    this.setState({
        medrese_adi:'Kırk Çeşme Hamamı',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.908952,
            longitude: 41.274815,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  muratpasahamami = async () =>{
    this.setState({
        medrese_adi:'Murat Paşa Hamamı',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.903878,
            longitude: 41.270214,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  gumrukhamami = async () =>{
    this.setState({
        medrese_adi:'Gümrük Hamamı',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.913082,
            longitude: 41.280183,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  seyhlerhamami = async () =>{
    this.setState({
        medrese_adi:'Şeyhler Hamamı',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.903582,
            longitude: 41.272691,
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>Beden temizIiği nezaket, ruh temizIiği zarafet sebebidir. </Text>
          </View>
        </View>
              
       <ScrollView >
           <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Erzurum Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Gürcü Kapı semtinde bulunan hamam, mimari özellikleri bakımından 17. yüzyılı yansıtmaktadır. Hamamın girişi düz atkı taşlı ve üst kısmı yuvarlak kemerlidir. Soyunmalık kısmının ortasında mermerden yapılmış sekizgen planlı bir şadırvan bulunmaktadır.
        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.erzurumhamami}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.erzurumyenigun.com/imagestore/diger/dokuman-mnuvnm3yetdtsxnhg755.JPG'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Hanım Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
       Hamamın üzerinde bir kitabe bulunmamaktadır. Vakıflar Genel Müdürlüğündeki kayıtlara göre Raziye Hanım tarfından yaptırılmıştır. Üst Kısmı kubbe ile kapatılmış ve kubbenin üzerinde bir aydıtlatma penceresi bırakılmıştır. Hamamın ortasında bir adet süs havuzu bulunmaktadır.

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.hanimhamami}>Yol tarifi için tıklayın...</Text>
        
       
              <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/6971848050" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Boyahane Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum, Boyahane Mahallesi’nde bulunan Boyahane Hamamı, yanındaki İlyas Ağa’nın 1620-1621 tarihlerinde yaptırdığı caminin yanındadır. Kitabesinden öğrenildiğine göre l566-l567 yılında Hacı Emin Paşa tarafından yaptırılmıştır. Boyahane Hamamı plan düzeni olarak birbirine benzeyen iki bölümden meydan gelen çifte hamamdır. Doğu yönündeki küçük bir kapıdan soyunmalık kısmına girilmektedir. Soyunmalık ile ılıklık arasında küçük bir bölüm bulunmaktadır. Sivri kemerli bir kapıdan geçilen ılıklık pandantiflerin taşıdığı üç kubbe ile örtülmüştür. Sıcaklık haçvari plana göre yerleştirilmiştir. Burası dört tonozlu eyvan ve merkezi bir kubbeden oluşmuştur. Halvet hücreleri sekizgen planlıdır. Hamamın batısındaki soyunmalığı, sonraki yıllarda camiye eklenmiştir. Hamamın kadınlar ve erkekler kısmının su deposu müşterektir.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.boyahanehamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://1.bp.blogspot.com/-HwQmsO9uCUE/U_71L6CYgHI/AAAAAAAAWm0/0CVXFpbbr_M/s1600/Boyahane%2BHamam%C4%B1.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Çifte Göbek Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Yeğenağa Mahallesi’nde bulunan Çifte Göbek Hamamı XVIII.yüzyılda yapılmıştır Kitabesi bulunmamaktadır. Bakırcı Camisi’nin vakıfları arasındadır. Değişik dönemlerde yapılan onarım ve değişikliklere rağmen yine de Erzurum’un en ilginç hamamları arasındadır. Osmanlı Hamam mimarisinin ilginç örnekleri arasında olup soyunmalık, ılıklık, sıcaklık ve halvet bölümlerinden meydana gelmiştir. Moloz taş ve yer yer blok taş kullanılmıştır. Hamamın kapı ve pencere sövelerinde tuğlalar, duvar aralarında da tuğla hatıllar kullanılmıştır. Hamamın doğu duvarına sonraki yıllarda açılmış bir kapıdan soyunmalığa girilmektedir. Soyunmalık tromplu bir kubbe ile örtülmüş batı yönünde iki sütuna oturan üç kemerle biraz daha genişletilmiştir. Buradaki iki sütun arasında kalan bölümün bir kısmı kubbe, diğeri de sivri kemerli bir tonoz ile örtülüdür. Büyük olasılıkla ılıklık ilk yapılışında beş kubbe ile örtülü bulunuyordu. Bugün bunlardan yalnızca ikisi görülebilmektedir. Sıcaklık kare şeklinde iki sütun ile birbirinden ayrılmış tromplu kubbe ile örtülüdür. Hamam günümüze iyi bir durumda gelmiştir.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ciftegobekhamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://hamamlar.com/wp-content/uploads/2013/10/%C3%A7ifte-g%C3%B6bek-hamam%C4%B1.png'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Lala Paşa Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Tebriz Kapısı mevkiinde bulunan Lala Paşa Hamamının Lala Mustafa Paşa tarafından cami ile birlikte 1562 yılında yaptırıldığı sanılmaktadır. Lala Paşa Camisinin mimarı Mimar Sinan olduğuna göre bu hamamın da onun tarafından yaptırılmış olmalıdır. Hamam yapı üslubu yönünden de Klasik Osmanlı Dönemi hamamlarının plan düzenindedir. Bununla beraber haç planlı hamam planı burada uygulanmıştır. Halk arasında anlaşılamayan bir nedenle Çöplük Hamamı olarak da isimlendirilen bu hamam soyunmalık, ılıklık, sıcaklık ve halvet bölümlerinden meydana gelmiştir. Soyunmalık kısmı trompların taşıdığı bir kubbe ile örtülüdür. Dikdörtgen olan ılıklık bir kubbe ile örtülmüş, yanlarındaki iki mekan da tonozludur. Sıcaklık merkezi bir kubbe ile örtülü olup yanlarında tonozlu üç eyvan bulunmaktadır. Güneydoğu ve güneybatı köşelerinde kubbeli birer halvet hücresi yerleştirilmiştir. Kesme taş ve tuğladan meydana gelen hamamın her bölümü kubbelerle örtülüdür. Bu kubbeleri köşe trompları ile duvarlar üzerine oturmuştur. Ayrıca halvet bölümünün arksında külhan ve su depoları bulunmaktadır.
      
      </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.lalapasahamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://1.bp.blogspot.com/-qIWX76AKufI/UWZs71oXG4I/AAAAAAAAOrQ/FdKHv98yKvo/s1600/Lala+Pa%C5%9Fa+Hamam%C4%B1.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Kırk Çeşme Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum, Kırk Çeşme Hamamının kitabesi bulunmamakla beraber yapı üslubundan ve plan düzeninden XVI yüzyılda yapıldığı sanılmaktadır. Değişik zamanlarda yapılan onarımlarla hamam büyük değişikliğe uğramıştır.Yalnızca sıcaklık orijinal konumunu korumuştur. Hamam tarih boyunca bir kaç kez onarılmasından ötürü orijinalliğinden büyük ölçüde uzaklaşmıştır. Kesme taş ve moloz taştan yapılan hamam soyunmalık, ılıklık, sıcaklık ve halvet kısımlarından meydana gelmiştir. Bunlardan yalnızca sıcaklık bölümü ortada kubbeli merkezi bir mekanla haçvari dört eyvandan meydana gelmiştir. Köşelerinde de üzerleri kubbeli birer halvet hücresi vardır. Haç plan düzeninde yapılan Hamamın ana mekanının ortası pandantifli bir kubbe ile örülmüştür. Hamamın bölümleri arasındaki yuvarlak kemerli kapıları ve duvarları kaplayan mermerlerin bazıları orijinalliğini koruyabilmiştir.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.kirkcesmehamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.turkulerleerzurum.com/wp-content/uploads/2011/12/K%C4%B1rk%C3%A7e%C5%9Fme-hamam%C4%B1...jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Murat Paşa Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum, Murad Paşa Mahallesi’nde bulunan bu hamamı Sultan II.Selim döneminde Erzurum Beylerbeyi Kuyucu Murad Paşa l573-1574 yıllarında Murad Paşa Camisi ile birlikte yapılmıştır. Klasik Osmanlı hamamları plan düzeninde yapılan bu hamam da soyunmalık, ılıklık, sıcaklık ve halvet bölümlerinden meydana gelmiştir. Moloz taş ve yer yer de kesme taştan yapılmıştır. Oldukça gösterişli bir kapıdan üzeri kubbeli kare bir mekana oradan da tromplar üzerine oturmuş kubbeli soyunmalığa geçilmektedir. Soyunmalığın güney duvarından dikdörtgen plan düzeninde üzerinde üç küçük kubbe bulunan ılıklığa geçilmektedir. Bu bölümün iki yanında da birer tonoz bulunmaktadır. Sıcaklığın üzeri merkezi bir kubbe ile örtülmüştür. Köşelerde de sekizgen planlı kubbeli halvet hücreleri bulunmaktadır.Bu bölümlerin arkasında da külhan ve su depoları bulunmaktadır.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.muratpasahamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://4.bp.blogspot.com/-g92lLgcZvUQ/TaNBhQQl07I/AAAAAAAAIow/ABrLEbNA9T8/s1600/Murat+Pa%25C5%259Fa+Hamam%25C4%25B1.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Gümrük Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Kongre Meydanı’nda, Mahalle Başına giden yol üzerinde bulunan Hacı Bektaş oğlu Derviş Hacı İbrahim’in l717’de yaptırdığı Gümrük Camisi’nin vakfı olan Gümrük Hamamı moloz taş ve yer de tuğladan yapılmıştır. Klasik Osmanlı hamam planları düzeninde olup, haçvari plandadır. Erzurum hamamları arasında değişik bir plan türünü yansıtmaktadır. Moloz taş ve yer yer de tuğla hatılların kullanıldığı hamam soyunmalık, ılıklık, sıcaklık ve halvet bölümlerinden meydana gelmiştir. Hamamın bugünkü girişi ana eksen yerine yandan sonradan açılmıştır. Soyunmalık trompların taşıdığı bir kubbe ile örtülmüştür. İlk yapılışında üç kubbeli olan ılıklığın kenarlarındaki kubbelerin altında kalan kısımlar sonradan birer kapı ile sıcaklığa eklenmiştir. Bu arada sağdaki kubbe de yeniden yapılmıştır. Sıcaklık Osmanlı hamamlarındaki haçvari plan düzeninin değişik bir uygulaması olarak burada karşımıza çıkmaktadır. Giriş eyvanı ile iki yanındaki kubbeli halvet hücreleri kaldırılmış ve böylece üç eyvanlı bir plan ortaya çıkarılmıştır. Köşelerdeki halvet hücreleri de en dipte olan eyvana açılmıştır. Soğukluk ve sıcaklık bölümleri yakın tarihlerde onarılmış olmasına rağmen orijinalliğini yitirmemiştir.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.gumrukhamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://3.bp.blogspot.com/-AKrqcfiTYSQ/UlhMnXjgoOI/AAAAAAAAS3c/3jdVCYlbtfY/s1600/G%C3%BCmr%C3%BCk+Hamam%C4%B1.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/8136045474" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Şeyhler Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Şeyhler Mahallesi’nde, Şeyhler Medresesi’nin yanında, Şeyhler Camisi’nin de karşısındadır. XVIII.yüzyılda, Habib Efendi tarafından Şeyhler Camisi’ne vakıf olarak yaptırılmıştır. Klasik Osmanlı hamam planı düzenindeki hamam soyunmalık, ılıklık, sıcaklık ve halvet bölümlerinden meydana gelmiştir. Moloz ve kesme taşın kullanıldığı hamam duvarlarında yer yer tuğla hatıllara yer verilmiştir. Hamamın soyunmalık kısmı tromplu büyük bir kubbe ile örtülüdür. Buradan doğu duvarına açılmış bir kapıyla ılıklığa geçilmektedir. Ilıklık yan yana üç küçük kubbeli ve kenarlarda da tonoz örtülü bölümlerden meydana gelmiştir. Sıcaklık kubbeli bir orta mekan ve yanlarda haçvari düzende dört eyvandan meydana gelmiştir. Bunun köşelerinde de sekizgen planlı kubbeli halvet hücreleri bulunmaktadır. Hamamı oluşturan bölümlerin hepsi içten Türk üçgenli ve tromplu, dıştan da kasnak üzerine oturan kubbelerle örtülmüştür. Şeyhler Hamamı günümüze iyi bir durumda gelebilmiştir.       </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.seyhlerhamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://2.bp.blogspot.com/-PA3nFt918LU/U_YBPRttzgI/AAAAAAAAWfQ/kvLlfanSqZY/s1600/%C5%9Eehyler%2BHamam%C4%B1.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/6560784512" // Test ID, Replace with your-admob-unit-id
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>Beden temizIiği nezaket, ruh temizIiği zarafet sebebidir. </Text>
          </View>
        </View>
              
       <ScrollView >
       <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Erzurum Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Gürcü Kapı semtinde bulunan hamam, mimari özellikleri bakımından 17. yüzyılı yansıtmaktadır. Hamamın girişi düz atkı taşlı ve üst kısmı yuvarlak kemerlidir. Soyunmalık kısmının ortasında mermerden yapılmış sekizgen planlı bir şadırvan bulunmaktadır.
        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.erzurumhamami}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.erzurumyenigun.com/imagestore/diger/dokuman-mnuvnm3yetdtsxnhg755.JPG'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Hanım Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
       Hamamın üzerinde bir kitabe bulunmamaktadır. Vakıflar Genel Müdürlüğündeki kayıtlara göre Raziye Hanım tarfından yaptırılmıştır. Üst Kısmı kubbe ile kapatılmış ve kubbenin üzerinde bir aydıtlatma penceresi bırakılmıştır. Hamamın ortasında bir adet süs havuzu bulunmaktadır.

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.hanimhamami}>Yol tarifi için tıklayın...</Text>
        
       
              <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/6971848050" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Boyahane Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum, Boyahane Mahallesi’nde bulunan Boyahane Hamamı, yanındaki İlyas Ağa’nın 1620-1621 tarihlerinde yaptırdığı caminin yanındadır. Kitabesinden öğrenildiğine göre l566-l567 yılında Hacı Emin Paşa tarafından yaptırılmıştır. Boyahane Hamamı plan düzeni olarak birbirine benzeyen iki bölümden meydan gelen çifte hamamdır. Doğu yönündeki küçük bir kapıdan soyunmalık kısmına girilmektedir. Soyunmalık ile ılıklık arasında küçük bir bölüm bulunmaktadır. Sivri kemerli bir kapıdan geçilen ılıklık pandantiflerin taşıdığı üç kubbe ile örtülmüştür. Sıcaklık haçvari plana göre yerleştirilmiştir. Burası dört tonozlu eyvan ve merkezi bir kubbeden oluşmuştur. Halvet hücreleri sekizgen planlıdır. Hamamın batısındaki soyunmalığı, sonraki yıllarda camiye eklenmiştir. Hamamın kadınlar ve erkekler kısmının su deposu müşterektir.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.boyahanehamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://1.bp.blogspot.com/-HwQmsO9uCUE/U_71L6CYgHI/AAAAAAAAWm0/0CVXFpbbr_M/s1600/Boyahane%2BHamam%C4%B1.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Çifte Göbek Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Yeğenağa Mahallesi’nde bulunan Çifte Göbek Hamamı XVIII.yüzyılda yapılmıştır Kitabesi bulunmamaktadır. Bakırcı Camisi’nin vakıfları arasındadır. Değişik dönemlerde yapılan onarım ve değişikliklere rağmen yine de Erzurum’un en ilginç hamamları arasındadır. Osmanlı Hamam mimarisinin ilginç örnekleri arasında olup soyunmalık, ılıklık, sıcaklık ve halvet bölümlerinden meydana gelmiştir. Moloz taş ve yer yer blok taş kullanılmıştır. Hamamın kapı ve pencere sövelerinde tuğlalar, duvar aralarında da tuğla hatıllar kullanılmıştır. Hamamın doğu duvarına sonraki yıllarda açılmış bir kapıdan soyunmalığa girilmektedir. Soyunmalık tromplu bir kubbe ile örtülmüş batı yönünde iki sütuna oturan üç kemerle biraz daha genişletilmiştir. Buradaki iki sütun arasında kalan bölümün bir kısmı kubbe, diğeri de sivri kemerli bir tonoz ile örtülüdür. Büyük olasılıkla ılıklık ilk yapılışında beş kubbe ile örtülü bulunuyordu. Bugün bunlardan yalnızca ikisi görülebilmektedir. Sıcaklık kare şeklinde iki sütun ile birbirinden ayrılmış tromplu kubbe ile örtülüdür. Hamam günümüze iyi bir durumda gelmiştir.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ciftegobekhamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://hamamlar.com/wp-content/uploads/2013/10/%C3%A7ifte-g%C3%B6bek-hamam%C4%B1.png'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Lala Paşa Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Tebriz Kapısı mevkiinde bulunan Lala Paşa Hamamının Lala Mustafa Paşa tarafından cami ile birlikte 1562 yılında yaptırıldığı sanılmaktadır. Lala Paşa Camisinin mimarı Mimar Sinan olduğuna göre bu hamamın da onun tarafından yaptırılmış olmalıdır. Hamam yapı üslubu yönünden de Klasik Osmanlı Dönemi hamamlarının plan düzenindedir. Bununla beraber haç planlı hamam planı burada uygulanmıştır. Halk arasında anlaşılamayan bir nedenle Çöplük Hamamı olarak da isimlendirilen bu hamam soyunmalık, ılıklık, sıcaklık ve halvet bölümlerinden meydana gelmiştir. Soyunmalık kısmı trompların taşıdığı bir kubbe ile örtülüdür. Dikdörtgen olan ılıklık bir kubbe ile örtülmüş, yanlarındaki iki mekan da tonozludur. Sıcaklık merkezi bir kubbe ile örtülü olup yanlarında tonozlu üç eyvan bulunmaktadır. Güneydoğu ve güneybatı köşelerinde kubbeli birer halvet hücresi yerleştirilmiştir. Kesme taş ve tuğladan meydana gelen hamamın her bölümü kubbelerle örtülüdür. Bu kubbeleri köşe trompları ile duvarlar üzerine oturmuştur. Ayrıca halvet bölümünün arksında külhan ve su depoları bulunmaktadır.
      
      </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.lalapasahamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://1.bp.blogspot.com/-qIWX76AKufI/UWZs71oXG4I/AAAAAAAAOrQ/FdKHv98yKvo/s1600/Lala+Pa%C5%9Fa+Hamam%C4%B1.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Kırk Çeşme Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum, Kırk Çeşme Hamamının kitabesi bulunmamakla beraber yapı üslubundan ve plan düzeninden XVI yüzyılda yapıldığı sanılmaktadır. Değişik zamanlarda yapılan onarımlarla hamam büyük değişikliğe uğramıştır.Yalnızca sıcaklık orijinal konumunu korumuştur. Hamam tarih boyunca bir kaç kez onarılmasından ötürü orijinalliğinden büyük ölçüde uzaklaşmıştır. Kesme taş ve moloz taştan yapılan hamam soyunmalık, ılıklık, sıcaklık ve halvet kısımlarından meydana gelmiştir. Bunlardan yalnızca sıcaklık bölümü ortada kubbeli merkezi bir mekanla haçvari dört eyvandan meydana gelmiştir. Köşelerinde de üzerleri kubbeli birer halvet hücresi vardır. Haç plan düzeninde yapılan Hamamın ana mekanının ortası pandantifli bir kubbe ile örülmüştür. Hamamın bölümleri arasındaki yuvarlak kemerli kapıları ve duvarları kaplayan mermerlerin bazıları orijinalliğini koruyabilmiştir.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.kirkcesmehamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.turkulerleerzurum.com/wp-content/uploads/2011/12/K%C4%B1rk%C3%A7e%C5%9Fme-hamam%C4%B1...jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Murat Paşa Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum, Murad Paşa Mahallesi’nde bulunan bu hamamı Sultan II.Selim döneminde Erzurum Beylerbeyi Kuyucu Murad Paşa l573-1574 yıllarında Murad Paşa Camisi ile birlikte yapılmıştır. Klasik Osmanlı hamamları plan düzeninde yapılan bu hamam da soyunmalık, ılıklık, sıcaklık ve halvet bölümlerinden meydana gelmiştir. Moloz taş ve yer yer de kesme taştan yapılmıştır. Oldukça gösterişli bir kapıdan üzeri kubbeli kare bir mekana oradan da tromplar üzerine oturmuş kubbeli soyunmalığa geçilmektedir. Soyunmalığın güney duvarından dikdörtgen plan düzeninde üzerinde üç küçük kubbe bulunan ılıklığa geçilmektedir. Bu bölümün iki yanında da birer tonoz bulunmaktadır. Sıcaklığın üzeri merkezi bir kubbe ile örtülmüştür. Köşelerde de sekizgen planlı kubbeli halvet hücreleri bulunmaktadır.Bu bölümlerin arkasında da külhan ve su depoları bulunmaktadır.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.muratpasahamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://4.bp.blogspot.com/-g92lLgcZvUQ/TaNBhQQl07I/AAAAAAAAIow/ABrLEbNA9T8/s1600/Murat+Pa%25C5%259Fa+Hamam%25C4%25B1.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Gümrük Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Kongre Meydanı’nda, Mahalle Başına giden yol üzerinde bulunan Hacı Bektaş oğlu Derviş Hacı İbrahim’in l717’de yaptırdığı Gümrük Camisi’nin vakfı olan Gümrük Hamamı moloz taş ve yer de tuğladan yapılmıştır. Klasik Osmanlı hamam planları düzeninde olup, haçvari plandadır. Erzurum hamamları arasında değişik bir plan türünü yansıtmaktadır. Moloz taş ve yer yer de tuğla hatılların kullanıldığı hamam soyunmalık, ılıklık, sıcaklık ve halvet bölümlerinden meydana gelmiştir. Hamamın bugünkü girişi ana eksen yerine yandan sonradan açılmıştır. Soyunmalık trompların taşıdığı bir kubbe ile örtülmüştür. İlk yapılışında üç kubbeli olan ılıklığın kenarlarındaki kubbelerin altında kalan kısımlar sonradan birer kapı ile sıcaklığa eklenmiştir. Bu arada sağdaki kubbe de yeniden yapılmıştır. Sıcaklık Osmanlı hamamlarındaki haçvari plan düzeninin değişik bir uygulaması olarak burada karşımıza çıkmaktadır. Giriş eyvanı ile iki yanındaki kubbeli halvet hücreleri kaldırılmış ve böylece üç eyvanlı bir plan ortaya çıkarılmıştır. Köşelerdeki halvet hücreleri de en dipte olan eyvana açılmıştır. Soğukluk ve sıcaklık bölümleri yakın tarihlerde onarılmış olmasına rağmen orijinalliğini yitirmemiştir.        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.gumrukhamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://3.bp.blogspot.com/-AKrqcfiTYSQ/UlhMnXjgoOI/AAAAAAAAS3c/3jdVCYlbtfY/s1600/G%C3%BCmr%C3%BCk+Hamam%C4%B1.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/8136045474" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Şeyhler Hamamı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Şeyhler Mahallesi’nde, Şeyhler Medresesi’nin yanında, Şeyhler Camisi’nin de karşısındadır. XVIII.yüzyılda, Habib Efendi tarafından Şeyhler Camisi’ne vakıf olarak yaptırılmıştır. Klasik Osmanlı hamam planı düzenindeki hamam soyunmalık, ılıklık, sıcaklık ve halvet bölümlerinden meydana gelmiştir. Moloz ve kesme taşın kullanıldığı hamam duvarlarında yer yer tuğla hatıllara yer verilmiştir. Hamamın soyunmalık kısmı tromplu büyük bir kubbe ile örtülüdür. Buradan doğu duvarına açılmış bir kapıyla ılıklığa geçilmektedir. Ilıklık yan yana üç küçük kubbeli ve kenarlarda da tonoz örtülü bölümlerden meydana gelmiştir. Sıcaklık kubbeli bir orta mekan ve yanlarda haçvari düzende dört eyvandan meydana gelmiştir. Bunun köşelerinde de sekizgen planlı kubbeli halvet hücreleri bulunmaktadır. Hamamı oluşturan bölümlerin hepsi içten Türk üçgenli ve tromplu, dıştan da kasnak üzerine oturan kubbelerle örtülmüştür. Şeyhler Hamamı günümüze iyi bir durumda gelebilmiştir.       </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.seyhlerhamami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://2.bp.blogspot.com/-PA3nFt918LU/U_YBPRttzgI/AAAAAAAAWfQ/kvLlfanSqZY/s1600/%C5%9Eehyler%2BHamam%C4%B1.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/6560784512" // Test ID, Replace with your-admob-unit-id
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
              adUnitID="ca-app-pub-5888738492049923/5745971265" // Test ID, Replace with your-admob-unit-id
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
