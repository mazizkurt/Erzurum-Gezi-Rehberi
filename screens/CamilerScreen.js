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
import { WebBrowser,DangerZone,PublisherBanner,MapView , Location, Permissions,Constants,AdMobInterstitial,Audio } from 'expo';
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
export default class CamilerScreen extends React.Component {
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
        medrese_adi:'Ulu Cami',
        coordinates: [
          {
            latitude: 39.9066046,
            longitude: 41.271480,
          },
          {
            latitude: 39.906360,
            longitude: 41.277697,
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
  ulucami = async () =>{
    this.setState({
        medrese_adi:'Ulu Cami',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.906360,
            longitude: 41.277697,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  lalapasacami = async () =>{
    this.setState({
        medrese_adi:'Lalapaşa Cami',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.906477,
            longitude: 41.273224,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  narmanlicami = async () =>{
    this.setState({
        medrese_adi:'Narmanlı Cami',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.906050,
            longitude: 41.279730,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  caferiyecami = async () =>{
    this.setState({
        medrese_adi:'Caferiye Cami',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.906558,
            longitude: 41.275294,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  muratpasacami = async () =>{
    this.setState({
        medrese_adi:'Murat Paşa Cami',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.904512,
            longitude: 41.269995,
          }
        ]
      })
     
      this.swipeUpDownRef.showFull()
  }
  kursunlucami = async () =>{
    this.setState({
        medrese_adi:'Kuşunlu Cami',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.908868,
            longitude: 41.275599,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  gurcukapicami = async () =>{
    this.setState({
        medrese_adi:'Gürcükapı Cami',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.911208,
            longitude: 41.274036,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  dervisagacami = async () =>{
    this.setState({
        medrese_adi:'Dervişağa Cami',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.910422,
            longitude: 41.278894,
          }
        ]
      })
     
      this.swipeUpDownRef.showFull()
  }
  ibrahimpasacami = async () =>{
    this.setState({
        medrese_adi:'İbrahim Paşa Cami',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.905005,
            longitude: 41.274439,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  seyhlercami = async () =>{
    this.setState({
        medrese_adi:'Şeyhler Cami',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.903435,
            longitude: 41.273123,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  esatpasacami = async () =>{
    this.setState({
        medrese_adi:'Esat Paşa Cami',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.907688,
            longitude: 41.274401,
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}> Caminin güzelliği sadeliğinde, süsü ise cemaatledir.</Text>
          </View>
        </View>
              
       <ScrollView >
           <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Ulu Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Ulu Cami; Saltuklu Emiri Nasreddin Aslan Mehmet tarafından 1179 yılında yaptırılmıştır. Saltuklular'ın "Atabey" isminden dolayı buraya "Atabey Camisi" de denmektedir. Yapının üst örtüsü mihrap duvarına dikey olarak inşa edilmiştir. Geniş bir orta nef ve bunun iki yanında üçer nefle birlikte toplam yedi neften oluşmaktadır. Yirmisekiz serbest "L", "T" ve dikdörtgen şekilli paye üzerine oturtulan cami, 51 x 54 m ölçülerindedir. İbadet mekânındaki üst örtüyü, on altısı duvarlara bitişik olan kırk paye taşımaktadır. Sultan 4. Murat zamanında yiyecek deposu olarak kullanılan cami, değişik tarihlerde beş kez onarılmıştır. Erzurum Valisi Hüseyin Paşa 1639'da, Ali Efendi, 1826'da camiyi onarmış; bunu 1858 ve 1860 yılında yapılan onarımlar izlemiştir. Cami, son olarak, 1957- 1964 yılları arasında Vakıflar Genel Müdürlüğü tarafından onarılmıştır. Caminin içerisinde toplam 40 sütun bulunmaktadır. Doğudaki birinci kapısının iki yanında birer mihrapçık bulunan yapının, 1860 yılında yapılan onarım kitabesi de burada yer almaktadır. Caminin ilk yapımındaki mihrap duvarı, önü hafif sivri kemerler üzerine oturan büyük pandantifli bir kubbe ile örtülmüştür. "Kırlangıç Kubbe" denilen, bindirme şeklinde inşa edilmiş bu kubbenin yapının ilk haline ait olduğu sanılmaktadır. Caminin sağ tarafında tuğladan yuvarlak gövdeli tek şerafeli minaresi bulunmaktadır. Minareye cami içerisinden çıkılmaktadır. Şerafeden yukarısı yıkılmıştır. 28 pencere ile aydınlatılan caminin, güneydeki ikinci penceresi üzerinde 1826 tarihli onarım kitabesi bulunmaktadır. "Kırlangıç Kubbe" denilen, bindirme şeklinde inşa edilmiş bu kubbenin yapının ilk haline ait olduğu sanılmaktadır.

        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ulucami}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.yenisafak.com/resim/upload/2016/06/18/10/28/dbcc41db3.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Lalapaşa Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Lala Paşa Camisi; Erzurum'da Osmanlı döneminde yapılan ilk cami özelliği taşıyan yapı, burada inşa edilen diğer Osmanlı camilerine de model olmuştur. Kanuni Sultan Süleyman'ın komutanı, Kıbrıs fatihi, Sadrazam Lala Mustafa Paşa; Erzurum Beylerbeyi görevini yürüttüğü dönemde, 1562 yılında camiyi yaptırmıştır. Mimarisi Mimar Sinan'a ait olan eserin yanında bir saray, bir de sıbyan mektebi yer almış, ancak bunlar günümüze kadar ulaşamamıştır. Lala Paşa Camisi; Şehzadebaşı, Sultan Ahmet, Eminönü Yeni Cami ve Yeni Fatih gibi İstanbul camilerinde uygulanan plan tipinde, ancak onlardan hayli küçük ölçekli olarak inşa edilmiştir. Ortada dört paye ile taşınan merkezi kubbe, dört yanda sivri kemerlerle desteklenen yarım çapraz tonozlar, köşelerde de dört küçük kubbeden oluşan merkezi planlı bir örtü biçimine sahip olan caminin iç mekânını iki sıra halinde 28 pencere aydınlatmaktadır. Alt sıradaki pencere alınlıkları üzerinde bulunan çiniler, şehrin Ruslar tarafından işgal edilmesi sırasında atılan kurşunlarla zedelenmiştir. Yapının kitabesi, yuvarlak ve mukarnaslı olan mihrabın üzerinde yer almaktadır. Pencerelerde bulunan hadisler, hat sanatından eşsiz örnekler sunar. Kare kaide üzerine kurulmuş olan cami minaresi, yuvarlak gövdeli ve tek şerefelidir. Beyaz taştan inşa edilen minare, kırmızı taşlı bileziklerle süslenmiştir. Caminin avlusunda, sekiz köşeli ahşap ve konik çatılı bir şadırvan yer almaktadır. Bu şadırvandaki sütunlar son derece güzel taş işçiliği ile bezenmiştir. Son cemaat yerindeki batı mihrabiyenin üzerinde, ters "T" şekilli mermer levhalar üzerine yazdırılmış ferman bulunmaktadır.1670 yılında yazılan bu ferman 4. Mehmed’in halka vergi muafiyeti getirdiğini anlatmaktadır. Tamamı kubbe ile örtülü son cemaat yeri de sivri kemerlerle öne ve yanlara açık bir mimari üslup gösterir. 
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.lalapasacami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://1.bp.blogspot.com/-2sn0hh6r3zI/V3WhH4qFg_I/AAAAAAAAJL4/5EUIu9s7zOgj7GbCnTQ7o9-fXpREDB2iACLcB/s1600/53.JPG'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Narmanlı Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Narmanlı Cami; Tebriz Kapı semtinde, Çifte Minareli Medrese'nin doğusunda yer almaktadır. Eser, kapı üzerindeki dört satırlık kitabeye göre 1738 yılında, Narmanlı Hacı Yusuf tarafından yaptırılmıştır. Narmanlı Cami'nin ortası büyük, yanları küçük beş kubbesi bulunmaktadır. Ayrıca, son cemaat yerinin bulunması ve şehirdeki diğer tek kubbeli camilere göre daha büyük çaplı bir kubbeye sahip olması, bu eserin önemini artırmaktadır. İçte, dört köşede tromplar üzerine oturan kubbesi, dışarıya 16 kenarlı bir kasnakla yansımaktadır. Düzgün kesme taştan yapılan cami, işçiliği ile de dikkat çekmektedir. 
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.narmanlicami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.grafimx.com/img.php?src=foto/u15/2017-07-23E32949a0f83f63246.png&w=1140'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Caferiye Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Caferiye Camisi; Cumhuriyet Caddesi üzerindedir. 1645 yılında Ebubekir Oğlu Hacı Cafer tarafından yaptırılmıştır. Yapının önünde, dört sütunun taşıdığı eğimli çatı altına gizlenmiş, öne ve yanlara açık üç kubbesi, 2006 yılındaki restorasyonda açığa çıkartılmıştır. İç mekân, köşelerde tromplar üzerine oturan tek kubbe ile örtülü olan caminin kubbesi, dıştan üç kademeli sekizgen kasnakla dışarı yansımaktadır. Caminin inşaatında, kesme taş ve moloz taş yapının malzemesini oluşturur.

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.caferiyecami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://3.bp.blogspot.com/-17el4Seb39Q/VJskdIDM0MI/AAAAAAAATMk/HyqnkcA4Dwk/s1600/caferiyecamii3.jpg'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Murat Paşa Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Murat Paşa Camisi; Bulunduğu mahalle ve caddeye adını veren cami, II. Selim’in paşalarından Kuyucu Murat Paşa tarafından 1573 yılında yaptırılmıştır. Yapı, bitişiğinde bulunan hamam, Ana Hatun Türbesi ve Ahmediye Medresesi ile bir bütünlük oluşturmaktadır. Kare planlı caminin ibadet mekânını, köşelerde tromplara oturan mukarnaslı 6 sütunun taşıdığı merkezi bir kubbe örtmektedir. Son cemaat yerinin kemerlerini ayakta tutan yuvarlak gövdeli altı sütun, depremlerde zarar gördüğünden, çevreleri madeni bileziklerle desteklenmiştir. Kubbe kasnağında 12 pencere ve altında bir ayet işlemesi yer almaktadır. Kubbe tromp ve kemerleri 19. yüzyılda alçı üzerine yağlı boya kullanılarak Avrupa üslubunda çiçek ve yaprak motifleri ile bezenmiştir. Caminin dikdörtgen bir niş içerisine alınmış mihrabı, taştan ve mukarnas süslemelidir. Ayrıca ahşap kapısı, mimberi ve pencere kapakları Osmanlı ahşap işçiliğinin en güzel örnekleri arasındadır. Caminin minaresi, yapıdan bağımsız olarak, sekizgen kaide üzerinde yükselir. Cami yanındaki Ahmediye Medresesi ile ortak kullanıma sahip bu minare, daha yüksek ve kalın gövdeli eski minarenin yerine, yakın bir tarihte inşa edilmiştir. Üç kubbe ile örtülü son cemaat yeri ile iç mekânı örten tek kubbeden ibaret caminin duvar yüzeyleri kesme taştan, taç kapı ve pervazları ise kırmızı kamber taşından inşa edilmiştir.

    </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.muratpasacami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://i.emlaktasondakika.com/Files/NewsImages2/2016/09/14/760x430/Muratpasa-Camisi_117435_f4e3e.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Kurşunlu Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Kurşunlu Cami; İç kalenin kuzeybatı eteğindedir. Kurşunlu Cami, Şeyhülislâm Feyzullah Efendi tarafından 1701 yılında yaptırılmıştır. Kubbesinin üzeri kurşunla kaplı olduğu için Kurşunlu Cami ismi sonradan verilmiştir. Kesme taştan, kare planlı olarak inşa edilen yapı, sekiz kasnak üzerine oturan bir kubbe ile örtülmüştür. Caminin son cemaat yeri dört taş sütunlu ve üç kubbelidir. Mihrabı taştan yapılı ve mukarnaslı olan yapının ahşap minberi, Türk ağaç işçiliğinin en güzel örneklerinden biridir.



        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.kursunlucami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://ranatur.com/wp-content/uploads/2017/02/narmanli-camii-ibadete-acildid832d4814e0965fbd9451.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Gürcükapı Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Gürcükapı Camisi; Erzurum'da görev yapmış Yeniçeri Ocağı ağalarından Zakreci Ali Ağa tarafından, 1608 yılında yaptırılan cami Ali Ağa Camisi olarak da bilinir. 1859 depreminde zarar gören yapının onarımını belgeleyen küçük bir kitabe, sivri kemerli kapı alınlığının üzerinde yer alır. Caminin önündeki son cemaat yeri, dört sütunun taşıdığı üç kubbe ile örtülüdür. Bu kubbeler dıştan konik bir çatı ile gizlenmiştir. İbadet mekanı kare planlı olan yapıda, köşelerdeki tromplara oturan merkezi bir kubbe kendini gösterir. Düzgün kesme taştan yapılmış olan caminin içerisi altta altı, üstte de dört pencere ile aydınlanır. Minaresi kırmızı kamber taşları ile moloz taştan inşa edilen cami, 2006 yılında onarım geçirmiştir. 


        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.gurcukapicami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.erzurumdan.com/data/media/6/Resim_300.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Dervişağa Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Tahtacılar Caddesi, Derviş Ağa Mahallesi'nde bulunan bu camiyi 1717 yılında Hacı Derviş İbrahim Ağa 1736 yılında yaptırmıştır.

Daha sonra 1845 yılında da Müderris Hacı Müştak tarafından onarılmıştır.Cami kare planlı ve tek kubbeli camiler grubundandır. Son cemaat yeri mukarnas başlıklı dört taş sütuna dayanan üç küçük kubbe ile örtülüdür. Giriş kapısı üzerinde 1845 tarihli onarım kitabesi bulunmaktadır. Caminin mukarnaslı mihrabı taştan minberi de ahşaptandır. Minare kaidesi taştan olup, gövdesi balıksırtı şeklinde tuğladan yapılmıştır.Caminin avlusunda Hacı Derviş İbrahim Ağa'nın türbesi bulunmaktadır. Bu türbe dört taş sütunun taşıdığı küçük bir kubbe ile örtülüdür.


        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.dervisagacami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://3.bp.blogspot.com/-aBQkGSbS_zs/U_4iYyc4l7I/AAAAAAAAWlo/5OAAqN4N6cA/s1600/Dervi%C5%9F%2BA%C4%9Fa%2BCamii.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >İbrahim Paşa Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        İbrahim Paşa Camii, Erzurum Merkez'de bulunan Eski Hükümet Konağı'nın çok yakınında bulunmakta… 

Şehrin tarihi ibadet mekanları arasındaki İbrahim Paşa Camii, kitabesindeki bilgiye göre 1748 yılında Erzurum Valisi Yazıcızade Hacı İbrahim Ethem Paşa tarafından inşa ettirilmiştir. Caminin mimarisi kare planlı olup, tek bir kubbesi vardır. Yapımında beyaz renkte mermer taş kullanılmıştır ve mihrabı da mermerden yapılmıştır. Erzurum İbrahim Paşa Camii'nin minaresinde ise kesme taş görülmektedir. 

Osmanlı mimarisinin tipik örneklerinden biri olan cami, günümüzde de ibadete açıktır.


        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ibrahimpasacami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://i0.wp.com/ankarayekder.com/wp-content/uploads/2016/09/09-erzurum-ibrahim_pasa_camii01.jpg?fit=896%2C600&ssl=1'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Şeyhler Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Şeyhler Mahallesi'nde bulunan Şeyhler Camisi Erzurum Müftüsü Habip Mehmet tarafından 1767 yılında yaptırılmıştır.

Cami 1950 yılında da onarılmıştır.Cami kesme taştan, kare planlı olarak yapılmış, üzerini sekizgen kasnağa oturan bir kubbe örtmüştür. Bu kubbeye geçiş içeriden tromplarla sağlanmıştır. İbadet mekânı alt sırada sekiz, ikinci sırada üç ve kubbe kasnağında da üç pencere ile aydınlatılmıştır. Son cemaat yeri Erzurum'un Kamber Taşından dört sütuna dayanan üç küçük kubbe ile örtülüdür. Bu kubbeler dışarıdan konik bir çatı ile gizlenmiştir.Giriş kapısının iki yanında üzerleri bezemeli iki gömme sütun bulunmaktadır. Mihrap taştan olup, mukarnaslı olarak sonuçlanmaktadır. Bunun yanında da gömme sütunlar vardır. Buna benzer motiflerle bezeli iki sütun da kapının yanında bulunmaktadır. 


Caminin sağında tek şerefeli minaresi bulunmakta olup, bunun üzerine de 1771 yılında Fehim Efendi tarafından güneş saati yerleştirilmiştir. 


        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.seyhlercami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.rizedeyiz.com/image/haber/haber_1/2012/11/Resim_1354085458.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/5745971265" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Esat Paşa Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Esat Paşa Camisi şehre hakim yüksek bir tepe üzerindedir. Şehir merkezinde iç kalenin güney-batısında yer alır. Kitabesine göre 1853 yılında Erzurum Valisi Esat Muhlis Paşa tarafından yaptırılmıştır. 

Caminin son cemaat yeri ahşap direklere oturan eğimli bir çatı, ibadet alanı ise üzeri sonradan çatı ile kaplanmış dam ile örtülüdür. Erzurum Valisi Zarif Mustafa Paşa tarafından 1885’de onarılmıştır. 

Cami dikdörtgene yakın kare planlı olup önünde altı ağaç sütunun taşıdığı çatılı bir son cemaat yeri vardır.

Mihrap düz kesme taştan ve sadedir, ancak minber ve vaaz kürsüsü en mükemmel Osmanlı ağaç işlemeciliğinden örnekler sunmaktadır. 

Caminin yanındaki minaresi yerel kırmızı taştan yapılmıştır.Taş kaide üzerine tek şerefelidir. Bu minarenin Erzurum'da en yüksek minare olduğu söylenir. 


        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.esatpasacami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.erzurumyenigun.com/imagestore/mansetler/manset-esat-pasa-camii-yeniden-doguyor-1530167340.jpg'}}
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}> Caminin güzelliği sadeliğinde, süsü ise cemaatledir.</Text>
          </View>
        </View>
              
       <ScrollView >
       <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Ulu Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Ulu Cami; Saltuklu Emiri Nasreddin Aslan Mehmet tarafından 1179 yılında yaptırılmıştır. Saltuklular'ın "Atabey" isminden dolayı buraya "Atabey Camisi" de denmektedir. Yapının üst örtüsü mihrap duvarına dikey olarak inşa edilmiştir. Geniş bir orta nef ve bunun iki yanında üçer nefle birlikte toplam yedi neften oluşmaktadır. Yirmisekiz serbest "L", "T" ve dikdörtgen şekilli paye üzerine oturtulan cami, 51 x 54 m ölçülerindedir. İbadet mekânındaki üst örtüyü, on altısı duvarlara bitişik olan kırk paye taşımaktadır. Sultan 4. Murat zamanında yiyecek deposu olarak kullanılan cami, değişik tarihlerde beş kez onarılmıştır. Erzurum Valisi Hüseyin Paşa 1639'da, Ali Efendi, 1826'da camiyi onarmış; bunu 1858 ve 1860 yılında yapılan onarımlar izlemiştir. Cami, son olarak, 1957- 1964 yılları arasında Vakıflar Genel Müdürlüğü tarafından onarılmıştır. Caminin içerisinde toplam 40 sütun bulunmaktadır. Doğudaki birinci kapısının iki yanında birer mihrapçık bulunan yapının, 1860 yılında yapılan onarım kitabesi de burada yer almaktadır. Caminin ilk yapımındaki mihrap duvarı, önü hafif sivri kemerler üzerine oturan büyük pandantifli bir kubbe ile örtülmüştür. "Kırlangıç Kubbe" denilen, bindirme şeklinde inşa edilmiş bu kubbenin yapının ilk haline ait olduğu sanılmaktadır. Caminin sağ tarafında tuğladan yuvarlak gövdeli tek şerafeli minaresi bulunmaktadır. Minareye cami içerisinden çıkılmaktadır. Şerafeden yukarısı yıkılmıştır. 28 pencere ile aydınlatılan caminin, güneydeki ikinci penceresi üzerinde 1826 tarihli onarım kitabesi bulunmaktadır. "Kırlangıç Kubbe" denilen, bindirme şeklinde inşa edilmiş bu kubbenin yapının ilk haline ait olduğu sanılmaktadır.

        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ulucami}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.yenisafak.com/resim/upload/2016/06/18/10/28/dbcc41db3.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Lalapaşa Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Lala Paşa Camisi; Erzurum'da Osmanlı döneminde yapılan ilk cami özelliği taşıyan yapı, burada inşa edilen diğer Osmanlı camilerine de model olmuştur. Kanuni Sultan Süleyman'ın komutanı, Kıbrıs fatihi, Sadrazam Lala Mustafa Paşa; Erzurum Beylerbeyi görevini yürüttüğü dönemde, 1562 yılında camiyi yaptırmıştır. Mimarisi Mimar Sinan'a ait olan eserin yanında bir saray, bir de sıbyan mektebi yer almış, ancak bunlar günümüze kadar ulaşamamıştır. Lala Paşa Camisi; Şehzadebaşı, Sultan Ahmet, Eminönü Yeni Cami ve Yeni Fatih gibi İstanbul camilerinde uygulanan plan tipinde, ancak onlardan hayli küçük ölçekli olarak inşa edilmiştir. Ortada dört paye ile taşınan merkezi kubbe, dört yanda sivri kemerlerle desteklenen yarım çapraz tonozlar, köşelerde de dört küçük kubbeden oluşan merkezi planlı bir örtü biçimine sahip olan caminin iç mekânını iki sıra halinde 28 pencere aydınlatmaktadır. Alt sıradaki pencere alınlıkları üzerinde bulunan çiniler, şehrin Ruslar tarafından işgal edilmesi sırasında atılan kurşunlarla zedelenmiştir. Yapının kitabesi, yuvarlak ve mukarnaslı olan mihrabın üzerinde yer almaktadır. Pencerelerde bulunan hadisler, hat sanatından eşsiz örnekler sunar. Kare kaide üzerine kurulmuş olan cami minaresi, yuvarlak gövdeli ve tek şerefelidir. Beyaz taştan inşa edilen minare, kırmızı taşlı bileziklerle süslenmiştir. Caminin avlusunda, sekiz köşeli ahşap ve konik çatılı bir şadırvan yer almaktadır. Bu şadırvandaki sütunlar son derece güzel taş işçiliği ile bezenmiştir. Son cemaat yerindeki batı mihrabiyenin üzerinde, ters "T" şekilli mermer levhalar üzerine yazdırılmış ferman bulunmaktadır.1670 yılında yazılan bu ferman 4. Mehmed’in halka vergi muafiyeti getirdiğini anlatmaktadır. Tamamı kubbe ile örtülü son cemaat yeri de sivri kemerlerle öne ve yanlara açık bir mimari üslup gösterir. 
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.lalapasacami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://1.bp.blogspot.com/-2sn0hh6r3zI/V3WhH4qFg_I/AAAAAAAAJL4/5EUIu9s7zOgj7GbCnTQ7o9-fXpREDB2iACLcB/s1600/53.JPG'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Narmanlı Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Narmanlı Cami; Tebriz Kapı semtinde, Çifte Minareli Medrese'nin doğusunda yer almaktadır. Eser, kapı üzerindeki dört satırlık kitabeye göre 1738 yılında, Narmanlı Hacı Yusuf tarafından yaptırılmıştır. Narmanlı Cami'nin ortası büyük, yanları küçük beş kubbesi bulunmaktadır. Ayrıca, son cemaat yerinin bulunması ve şehirdeki diğer tek kubbeli camilere göre daha büyük çaplı bir kubbeye sahip olması, bu eserin önemini artırmaktadır. İçte, dört köşede tromplar üzerine oturan kubbesi, dışarıya 16 kenarlı bir kasnakla yansımaktadır. Düzgün kesme taştan yapılan cami, işçiliği ile de dikkat çekmektedir. 
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.narmanlicami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.grafimx.com/img.php?src=foto/u15/2017-07-23E32949a0f83f63246.png&w=1140'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Caferiye Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Caferiye Camisi; Cumhuriyet Caddesi üzerindedir. 1645 yılında Ebubekir Oğlu Hacı Cafer tarafından yaptırılmıştır. Yapının önünde, dört sütunun taşıdığı eğimli çatı altına gizlenmiş, öne ve yanlara açık üç kubbesi, 2006 yılındaki restorasyonda açığa çıkartılmıştır. İç mekân, köşelerde tromplar üzerine oturan tek kubbe ile örtülü olan caminin kubbesi, dıştan üç kademeli sekizgen kasnakla dışarı yansımaktadır. Caminin inşaatında, kesme taş ve moloz taş yapının malzemesini oluşturur.

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.caferiyecami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://3.bp.blogspot.com/-17el4Seb39Q/VJskdIDM0MI/AAAAAAAATMk/HyqnkcA4Dwk/s1600/caferiyecamii3.jpg'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Murat Paşa Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Murat Paşa Camisi; Bulunduğu mahalle ve caddeye adını veren cami, II. Selim’in paşalarından Kuyucu Murat Paşa tarafından 1573 yılında yaptırılmıştır. Yapı, bitişiğinde bulunan hamam, Ana Hatun Türbesi ve Ahmediye Medresesi ile bir bütünlük oluşturmaktadır. Kare planlı caminin ibadet mekânını, köşelerde tromplara oturan mukarnaslı 6 sütunun taşıdığı merkezi bir kubbe örtmektedir. Son cemaat yerinin kemerlerini ayakta tutan yuvarlak gövdeli altı sütun, depremlerde zarar gördüğünden, çevreleri madeni bileziklerle desteklenmiştir. Kubbe kasnağında 12 pencere ve altında bir ayet işlemesi yer almaktadır. Kubbe tromp ve kemerleri 19. yüzyılda alçı üzerine yağlı boya kullanılarak Avrupa üslubunda çiçek ve yaprak motifleri ile bezenmiştir. Caminin dikdörtgen bir niş içerisine alınmış mihrabı, taştan ve mukarnas süslemelidir. Ayrıca ahşap kapısı, mimberi ve pencere kapakları Osmanlı ahşap işçiliğinin en güzel örnekleri arasındadır. Caminin minaresi, yapıdan bağımsız olarak, sekizgen kaide üzerinde yükselir. Cami yanındaki Ahmediye Medresesi ile ortak kullanıma sahip bu minare, daha yüksek ve kalın gövdeli eski minarenin yerine, yakın bir tarihte inşa edilmiştir. Üç kubbe ile örtülü son cemaat yeri ile iç mekânı örten tek kubbeden ibaret caminin duvar yüzeyleri kesme taştan, taç kapı ve pervazları ise kırmızı kamber taşından inşa edilmiştir.

    </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.muratpasacami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://i.emlaktasondakika.com/Files/NewsImages2/2016/09/14/760x430/Muratpasa-Camisi_117435_f4e3e.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Kurşunlu Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Kurşunlu Cami; İç kalenin kuzeybatı eteğindedir. Kurşunlu Cami, Şeyhülislâm Feyzullah Efendi tarafından 1701 yılında yaptırılmıştır. Kubbesinin üzeri kurşunla kaplı olduğu için Kurşunlu Cami ismi sonradan verilmiştir. Kesme taştan, kare planlı olarak inşa edilen yapı, sekiz kasnak üzerine oturan bir kubbe ile örtülmüştür. Caminin son cemaat yeri dört taş sütunlu ve üç kubbelidir. Mihrabı taştan yapılı ve mukarnaslı olan yapının ahşap minberi, Türk ağaç işçiliğinin en güzel örneklerinden biridir.



        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.kursunlucami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://ranatur.com/wp-content/uploads/2017/02/narmanli-camii-ibadete-acildid832d4814e0965fbd9451.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Gürcükapı Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Gürcükapı Camisi; Erzurum'da görev yapmış Yeniçeri Ocağı ağalarından Zakreci Ali Ağa tarafından, 1608 yılında yaptırılan cami Ali Ağa Camisi olarak da bilinir. 1859 depreminde zarar gören yapının onarımını belgeleyen küçük bir kitabe, sivri kemerli kapı alınlığının üzerinde yer alır. Caminin önündeki son cemaat yeri, dört sütunun taşıdığı üç kubbe ile örtülüdür. Bu kubbeler dıştan konik bir çatı ile gizlenmiştir. İbadet mekanı kare planlı olan yapıda, köşelerdeki tromplara oturan merkezi bir kubbe kendini gösterir. Düzgün kesme taştan yapılmış olan caminin içerisi altta altı, üstte de dört pencere ile aydınlanır. Minaresi kırmızı kamber taşları ile moloz taştan inşa edilen cami, 2006 yılında onarım geçirmiştir. 


        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.gurcukapicami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.erzurumdan.com/data/media/6/Resim_300.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Dervişağa Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Tahtacılar Caddesi, Derviş Ağa Mahallesi'nde bulunan bu camiyi 1717 yılında Hacı Derviş İbrahim Ağa 1736 yılında yaptırmıştır.

Daha sonra 1845 yılında da Müderris Hacı Müştak tarafından onarılmıştır.Cami kare planlı ve tek kubbeli camiler grubundandır. Son cemaat yeri mukarnas başlıklı dört taş sütuna dayanan üç küçük kubbe ile örtülüdür. Giriş kapısı üzerinde 1845 tarihli onarım kitabesi bulunmaktadır. Caminin mukarnaslı mihrabı taştan minberi de ahşaptandır. Minare kaidesi taştan olup, gövdesi balıksırtı şeklinde tuğladan yapılmıştır.Caminin avlusunda Hacı Derviş İbrahim Ağa'nın türbesi bulunmaktadır. Bu türbe dört taş sütunun taşıdığı küçük bir kubbe ile örtülüdür.


        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.dervisagacami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://3.bp.blogspot.com/-aBQkGSbS_zs/U_4iYyc4l7I/AAAAAAAAWlo/5OAAqN4N6cA/s1600/Dervi%C5%9F%2BA%C4%9Fa%2BCamii.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >İbrahim Paşa Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        İbrahim Paşa Camii, Erzurum Merkez'de bulunan Eski Hükümet Konağı'nın çok yakınında bulunmakta… 

Şehrin tarihi ibadet mekanları arasındaki İbrahim Paşa Camii, kitabesindeki bilgiye göre 1748 yılında Erzurum Valisi Yazıcızade Hacı İbrahim Ethem Paşa tarafından inşa ettirilmiştir. Caminin mimarisi kare planlı olup, tek bir kubbesi vardır. Yapımında beyaz renkte mermer taş kullanılmıştır ve mihrabı da mermerden yapılmıştır. Erzurum İbrahim Paşa Camii'nin minaresinde ise kesme taş görülmektedir. 

Osmanlı mimarisinin tipik örneklerinden biri olan cami, günümüzde de ibadete açıktır.


        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ibrahimpasacami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://i0.wp.com/ankarayekder.com/wp-content/uploads/2016/09/09-erzurum-ibrahim_pasa_camii01.jpg?fit=896%2C600&ssl=1'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Şeyhler Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Şeyhler Mahallesi'nde bulunan Şeyhler Camisi Erzurum Müftüsü Habip Mehmet tarafından 1767 yılında yaptırılmıştır.

Cami 1950 yılında da onarılmıştır.Cami kesme taştan, kare planlı olarak yapılmış, üzerini sekizgen kasnağa oturan bir kubbe örtmüştür. Bu kubbeye geçiş içeriden tromplarla sağlanmıştır. İbadet mekânı alt sırada sekiz, ikinci sırada üç ve kubbe kasnağında da üç pencere ile aydınlatılmıştır. Son cemaat yeri Erzurum'un Kamber Taşından dört sütuna dayanan üç küçük kubbe ile örtülüdür. Bu kubbeler dışarıdan konik bir çatı ile gizlenmiştir.Giriş kapısının iki yanında üzerleri bezemeli iki gömme sütun bulunmaktadır. Mihrap taştan olup, mukarnaslı olarak sonuçlanmaktadır. Bunun yanında da gömme sütunlar vardır. Buna benzer motiflerle bezeli iki sütun da kapının yanında bulunmaktadır. 


Caminin sağında tek şerefeli minaresi bulunmakta olup, bunun üzerine de 1771 yılında Fehim Efendi tarafından güneş saati yerleştirilmiştir. 


        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.seyhlercami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.rizedeyiz.com/image/haber/haber_1/2012/11/Resim_1354085458.jpg'}}
          />
        </Lightbox>
        <View style={styles.reklam}>
            <PublisherBanner
              bannerSize="largeBanner"
              adUnitID="ca-app-pub-5888738492049923/5745971265" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Esat Paşa Cami</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Esat Paşa Camisi şehre hakim yüksek bir tepe üzerindedir. Şehir merkezinde iç kalenin güney-batısında yer alır. Kitabesine göre 1853 yılında Erzurum Valisi Esat Muhlis Paşa tarafından yaptırılmıştır. 

Caminin son cemaat yeri ahşap direklere oturan eğimli bir çatı, ibadet alanı ise üzeri sonradan çatı ile kaplanmış dam ile örtülüdür. Erzurum Valisi Zarif Mustafa Paşa tarafından 1885’de onarılmıştır. 

Cami dikdörtgene yakın kare planlı olup önünde altı ağaç sütunun taşıdığı çatılı bir son cemaat yeri vardır.

Mihrap düz kesme taştan ve sadedir, ancak minber ve vaaz kürsüsü en mükemmel Osmanlı ağaç işlemeciliğinden örnekler sunmaktadır. 

Caminin yanındaki minaresi yerel kırmızı taştan yapılmıştır.Taş kaide üzerine tek şerefelidir. Bu minarenin Erzurum'da en yüksek minare olduğu söylenir. 


        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.esatpasacami}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.erzurumyenigun.com/imagestore/mansetler/manset-esat-pasa-camii-yeniden-doguyor-1530167340.jpg'}}
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
              adUnitID="ca-app-pub-5888738492049923/6971848050" // Test ID, Replace with your-admob-unit-id
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
