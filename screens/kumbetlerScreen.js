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
export default class kumbetlerScreen extends React.Component {
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
        medrese_adi:'Üç Kümbetler',
        coordinates: [
          {
            latitude: 39.9066046,
            longitude: 41.271480,
          },
          {
            latitude: 39.904076,
            longitude: 41.278527,
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
  uckumbetler = async () =>{
    this.setState({
        medrese_adi:'Üç Kümbetler',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.904076,
            longitude: 41.278527,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  karanlıkkumbet = async () =>{
    this.setState({
        medrese_adi:'Karanlık Kümbet',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.910472,
            longitude: 41.278905,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  rabiahatunkumbet = async () =>{
    this.setState({
        medrese_adi:'Rabia Hatun Kümbeti',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.901796,
            longitude: 41.283661,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  gumuslukumbet = async () =>{
    this.setState({
        medrese_adi:'Gümüşlü Kümbet',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.906622,
            longitude: 41.292966,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  mehdiabbaskumbet = async () =>{
    this.setState({
        medrese_adi:'Mehdi Abbas Kümbeti',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.905144,
            longitude: 41.280095,
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>Bu kubbe altındaki bin bir belayı gör; dostlar gideli boşalan dünyayı gör;  tek soluk yitirme kendini bilmeden;  bırak yarını, dünü, yaşadığın anı gör. 

</Text>
          </View>
        </View>
              
       <ScrollView >
           <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Üç Kümbetler</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Üç Kümbetler, Anadolu’da bulunan anıt mezarların en güzel örnekleri arasında yer almaktadır. Üç kümbetten en büyüğünün Emir Saltuk’a ait olduğu ve 12. yüzyılın sonlarında yapıldığı sanılmaktadır. Diğer kümbetlerin kime ait oldukları bilinmezken bunlarında 14. yüzyılda inşa edildikleri tahmin edilmektedir. Kümbetlerin yanında bulunan kare şeklindeki küçük yapının ne olduğu konusunda ise farklı görüşler bulunmaktadır. Bunun da bir kümbet veya mescit olduğu belirtilmektedir. Üç kümbetler, Milli Eğitim Bakanlığı tarafından 1956 yılında onarılmıştır.

Emir Saltuk Kümbeti, kesme taştan yapılmıştır. Sekizgen gövdeli, yüksek kasnaklı ve üzeri kubbe ile konik karışımı basık bir külahla örtülüdür. İki renkli kesme taştan yapılan kümbetin üçgen alınlıklarında, yuvarlak kemerli, kasnak nişlerinde boğa, yılan, yarasa, kartal gibi hayvan kabartmaları bulunmaktadır. Bu kabartmalar, Orta Asya Türk takvimlerinde yer alan burç figürlerini andırmaktadır. Nişlerden birinin içerisindeki boğa boynuzları arasında insan başı işlemesi dikkat çekmektedir. Emir Saltuk Kümbeti'nin sekiz cephesinin dört yüzünde birer çift pencere yer almaktadır. Kümbetin, kuzey yönünde bulunan giriş kapısının saçakları üzerinde geometrik bezeme ile çiçek ve hayvan figürleri görülmektedir.

Emir Saltuk Kümbeti'nin güneydoğusunda bulunan ikinci kümbetin alt kısmı, kare planlı ve on iki cephelidir. Bu kümbet gri renkte bir taştan yapılmıştır. Üstte bir küçük, altta ise bezemeli üç büyük penceresi bulunmaktadır. Bu kümbetin güney cephesindeki penceresi aynı zamanda mihrap görünümündedir. İkinci kümbete 4 metre uzaklıktaki üçüncü kümbet yöresel keyek taşından yapılmıştır. Üçüncü kümbet, on iki cepheli ve dört pencerelidir. Kuzey yönünde giriş kapısı bulunan kümbetin, iç kısmında oldukça güzel bezenmiş mihrabı yer almaktadır. Kümbetin üzerini örten konik külahın kasnağında Emir Saltuk Kümbeti'ne benzeyen süslemelere yer verilmiştir.
        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.uckumbetler}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://cdn.islamansiklopedisi.org.tr/madde/42/uc-kumbetler-1.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Karanlık Kümbet</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Derviş Ağa Camisi'nin karşısında bulunan bu kümbet bir Mo­ğol eseridir.

Güneye bakan pencere üstündeki kitabeye göre 1309 yılında Sadrettin Türkbey tarafından yaptırılmıştır.
Kuzeyde yer alan kapısı ile bir evin bah­çesinde yer alan bu kümbet, altta bir kriptaya sahiptir. Kare tabanlı mumyalık üstünde yükselen gövde, içten silindirik, dıştan on iki gendir. Her yüzde çifte sütunca formunda silmeler bulunur.

Güneydeki kitabe üzerinde Tercan Mama Türbesindeki gibi şifreli harflerle yazılmış, beş köşeli yıldız biçiminde ikinci kitabe yer almaktadır. 1954 yılında Vakıflar Genel Müdürlüğü'nce restore edilmiştir.
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.karanlıkkumbet}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.ikolsoftware.com/public/resized/high/image_data/original/570572df50d16d10a291454551d3e9b155b7ce4c/58e0cb75404ff.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Rabia Hatun Kümbeti</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Hasan Basri Mahallesi'nde, Üç Kümbetlerin 200 m kadar güneydoğusunda yer almaktadır.

Rabia Hatun'a ait olduğu belirtilen kümbet 13. yüzyıla tarihlenmektedir.
Kümbetin dıştan on iki gen, içten silindirik planı dikkat çeker. Altta mumyalık kısmı bulunmaktadır. Düzgün kesme taştan yapılan küm­betin bazı orijinal bezemeli taşları yok edilmiştir.

1980’li yıllarda yapılan onarımda, kuzeydeki giriş kapısının iki yanına basamaklar yaptırılarak bir sahanlık oluşturulmuş, üzeri de içten ahşap, dıştan çinko kaplamalı konikal bir külahla örtülmüştür.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.rabiahatunkumbet}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://c1.staticflickr.com/8/7415/12138003224_48cb0937c2_b.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Gümüşlü Kümbet</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum'da Karskapı dışındaki meydanda tahminen XIV. yüzyıla ait kümbet.Evliya Çelebi'ye göre adını kubbesinin gümüşle kaplı olmasından, diğer bir ri­vayete göre ise konik külahında büyük bir gümüş parçası asılı olduğu için al­mıştır. 1877-1878 Osmanlı-Rus Savaşı sırasında bu gümüşlerin Ruslar tarafın­dan götürüldüğü rivayet edilir.Yapının kitabesi tamamen ortadan kalktığından mimarı ve banisi hakkında bilgi bulunmamaktadır. Evliya Çelebi, o dönemde mevcut olan lahdin üzerinde "Sultan Mahmud" ibaresini okuduğu için yanlış olarak Gazneli Mahmud'un bura­da yattığını söylemiştir. Arşiv belgelerin­den hareketle burada zaviye şeyhi Kö­se Gıyâseddin Dede'nin gömülü olduğu ileri sürülmüştür.Tamamıyla kesme taştan inşa edilen yapı itinalı bir işçilik gösterir. Köşeleri üçgen yüzeyler şeklinde pahlanmış kare bir kaide üzerine oturan onikigen göv­desi, duvarlara yapıştırılmış ikiz sütunçeler ve yuvarlak kemerlerle bölümlere ayrılarak hareketlendirilmistir. Konik kü­lahın hemen altında, Erzurum'daki me­zar anıtlarında sıkça kullanılan, kırmızı renkli taşlardan zencirek motifi işlenmistir. Mukarnaslı sivri kemer içine alın­mış iki adet pencere ile aydınlanan küm­betin alt katındaki cenazelik bölümü ise üç havalandırma menfezi ve yukarıdaki sanduka kısmına açılan bir delikle ay­dınlanmaktadır.Bütün bu Özellikleriyle Üç Kümbetler, Karanlık Kümbet ve Râbia Hatun Küm­beti gibi Erzurum'daki diğer mezar anıt­larıyla büyük benzerlikler gösteren Gü­müşlü Kümbet XIV. yüzyılın başlarına tarihlendirilebilir.Çok sağlam bir yapıya sahip olduğu için bir zamanlar su deposu olarak da kullanılan yapı son yıllarda onarılarak eski görünümüne kavuşturulmuştur.

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.gumuslukumbet}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://c1.staticflickr.com/8/7386/9717460329_fe3a5d65b1_b.jpg'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Mehdi Abbas Kümbeti</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Tebriz Kapı semtinde, Emir Şeyh Camisi'nin güneyinde, Kümbet Sokak'ta yer almaktadır.Kubbesi olmayan yapının 14.-15. yüzyıl­lardan kaldığı sanılmaktadır. Yapı 1978 yılında onarım geçirmiştir.
İçten sekiz dıştan onaltıgen plana sahip olan türbenin beden duvarları kısa tutulmuş son onarımda düzgün kesme taşlarla yenilenerek üzerine konikal çatı yerleştirilmiştir. Mumyalığı olmayan türbenin içinde üç sanduka bulunmaktadır.
      
      
      </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.mehdiabbaskumbet}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://1.bp.blogspot.com/_VgvUFEQICes/TRdwJ7r4-oI/AAAAAAAAIDg/ptlchjBWeUY/s1600/Mehdi+Abbas+T%25C3%25BCrbesi.jpg'}}
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>Bu kubbe altındaki bin bir belayı gör; dostlar gideli boşalan dünyayı gör;  tek soluk yitirme kendini bilmeden;  bırak yarını, dünü, yaşadığın anı gör. 

</Text>
          </View>
        </View>
              
       <ScrollView >
       <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Üç Kümbetler</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Üç Kümbetler, Anadolu’da bulunan anıt mezarların en güzel örnekleri arasında yer almaktadır. Üç kümbetten en büyüğünün Emir Saltuk’a ait olduğu ve 12. yüzyılın sonlarında yapıldığı sanılmaktadır. Diğer kümbetlerin kime ait oldukları bilinmezken bunlarında 14. yüzyılda inşa edildikleri tahmin edilmektedir. Kümbetlerin yanında bulunan kare şeklindeki küçük yapının ne olduğu konusunda ise farklı görüşler bulunmaktadır. Bunun da bir kümbet veya mescit olduğu belirtilmektedir. Üç kümbetler, Milli Eğitim Bakanlığı tarafından 1956 yılında onarılmıştır.

Emir Saltuk Kümbeti, kesme taştan yapılmıştır. Sekizgen gövdeli, yüksek kasnaklı ve üzeri kubbe ile konik karışımı basık bir külahla örtülüdür. İki renkli kesme taştan yapılan kümbetin üçgen alınlıklarında, yuvarlak kemerli, kasnak nişlerinde boğa, yılan, yarasa, kartal gibi hayvan kabartmaları bulunmaktadır. Bu kabartmalar, Orta Asya Türk takvimlerinde yer alan burç figürlerini andırmaktadır. Nişlerden birinin içerisindeki boğa boynuzları arasında insan başı işlemesi dikkat çekmektedir. Emir Saltuk Kümbeti'nin sekiz cephesinin dört yüzünde birer çift pencere yer almaktadır. Kümbetin, kuzey yönünde bulunan giriş kapısının saçakları üzerinde geometrik bezeme ile çiçek ve hayvan figürleri görülmektedir.

Emir Saltuk Kümbeti'nin güneydoğusunda bulunan ikinci kümbetin alt kısmı, kare planlı ve on iki cephelidir. Bu kümbet gri renkte bir taştan yapılmıştır. Üstte bir küçük, altta ise bezemeli üç büyük penceresi bulunmaktadır. Bu kümbetin güney cephesindeki penceresi aynı zamanda mihrap görünümündedir. İkinci kümbete 4 metre uzaklıktaki üçüncü kümbet yöresel keyek taşından yapılmıştır. Üçüncü kümbet, on iki cepheli ve dört pencerelidir. Kuzey yönünde giriş kapısı bulunan kümbetin, iç kısmında oldukça güzel bezenmiş mihrabı yer almaktadır. Kümbetin üzerini örten konik külahın kasnağında Emir Saltuk Kümbeti'ne benzeyen süslemelere yer verilmiştir.
        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.uckumbetler}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://cdn.islamansiklopedisi.org.tr/madde/42/uc-kumbetler-1.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Karanlık Kümbet</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Derviş Ağa Camisi'nin karşısında bulunan bu kümbet bir Mo­ğol eseridir.

Güneye bakan pencere üstündeki kitabeye göre 1309 yılında Sadrettin Türkbey tarafından yaptırılmıştır.
Kuzeyde yer alan kapısı ile bir evin bah­çesinde yer alan bu kümbet, altta bir kriptaya sahiptir. Kare tabanlı mumyalık üstünde yükselen gövde, içten silindirik, dıştan on iki gendir. Her yüzde çifte sütunca formunda silmeler bulunur.

Güneydeki kitabe üzerinde Tercan Mama Türbesindeki gibi şifreli harflerle yazılmış, beş köşeli yıldız biçiminde ikinci kitabe yer almaktadır. 1954 yılında Vakıflar Genel Müdürlüğü'nce restore edilmiştir.
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.karanlıkkumbet}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.ikolsoftware.com/public/resized/high/image_data/original/570572df50d16d10a291454551d3e9b155b7ce4c/58e0cb75404ff.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Rabia Hatun Kümbeti</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Hasan Basri Mahallesi'nde, Üç Kümbetlerin 200 m kadar güneydoğusunda yer almaktadır.

Rabia Hatun'a ait olduğu belirtilen kümbet 13. yüzyıla tarihlenmektedir.
Kümbetin dıştan on iki gen, içten silindirik planı dikkat çeker. Altta mumyalık kısmı bulunmaktadır. Düzgün kesme taştan yapılan küm­betin bazı orijinal bezemeli taşları yok edilmiştir.

1980’li yıllarda yapılan onarımda, kuzeydeki giriş kapısının iki yanına basamaklar yaptırılarak bir sahanlık oluşturulmuş, üzeri de içten ahşap, dıştan çinko kaplamalı konikal bir külahla örtülmüştür.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.rabiahatunkumbet}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://c1.staticflickr.com/8/7415/12138003224_48cb0937c2_b.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Gümüşlü Kümbet</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum'da Karskapı dışındaki meydanda tahminen XIV. yüzyıla ait kümbet.Evliya Çelebi'ye göre adını kubbesinin gümüşle kaplı olmasından, diğer bir ri­vayete göre ise konik külahında büyük bir gümüş parçası asılı olduğu için al­mıştır. 1877-1878 Osmanlı-Rus Savaşı sırasında bu gümüşlerin Ruslar tarafın­dan götürüldüğü rivayet edilir.Yapının kitabesi tamamen ortadan kalktığından mimarı ve banisi hakkında bilgi bulunmamaktadır. Evliya Çelebi, o dönemde mevcut olan lahdin üzerinde "Sultan Mahmud" ibaresini okuduğu için yanlış olarak Gazneli Mahmud'un bura­da yattığını söylemiştir. Arşiv belgelerin­den hareketle burada zaviye şeyhi Kö­se Gıyâseddin Dede'nin gömülü olduğu ileri sürülmüştür.Tamamıyla kesme taştan inşa edilen yapı itinalı bir işçilik gösterir. Köşeleri üçgen yüzeyler şeklinde pahlanmış kare bir kaide üzerine oturan onikigen göv­desi, duvarlara yapıştırılmış ikiz sütunçeler ve yuvarlak kemerlerle bölümlere ayrılarak hareketlendirilmistir. Konik kü­lahın hemen altında, Erzurum'daki me­zar anıtlarında sıkça kullanılan, kırmızı renkli taşlardan zencirek motifi işlenmistir. Mukarnaslı sivri kemer içine alın­mış iki adet pencere ile aydınlanan küm­betin alt katındaki cenazelik bölümü ise üç havalandırma menfezi ve yukarıdaki sanduka kısmına açılan bir delikle ay­dınlanmaktadır.Bütün bu Özellikleriyle Üç Kümbetler, Karanlık Kümbet ve Râbia Hatun Küm­beti gibi Erzurum'daki diğer mezar anıt­larıyla büyük benzerlikler gösteren Gü­müşlü Kümbet XIV. yüzyılın başlarına tarihlendirilebilir.Çok sağlam bir yapıya sahip olduğu için bir zamanlar su deposu olarak da kullanılan yapı son yıllarda onarılarak eski görünümüne kavuşturulmuştur.

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.gumuslukumbet}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://c1.staticflickr.com/8/7386/9717460329_fe3a5d65b1_b.jpg'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Mehdi Abbas Kümbeti</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Tebriz Kapı semtinde, Emir Şeyh Camisi'nin güneyinde, Kümbet Sokak'ta yer almaktadır.Kubbesi olmayan yapının 14.-15. yüzyıl­lardan kaldığı sanılmaktadır. Yapı 1978 yılında onarım geçirmiştir.
İçten sekiz dıştan onaltıgen plana sahip olan türbenin beden duvarları kısa tutulmuş son onarımda düzgün kesme taşlarla yenilenerek üzerine konikal çatı yerleştirilmiştir. Mumyalığı olmayan türbenin içinde üç sanduka bulunmaktadır.
      
      
      </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.mehdiabbaskumbet}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://1.bp.blogspot.com/_VgvUFEQICes/TRdwJ7r4-oI/AAAAAAAAIDg/ptlchjBWeUY/s1600/Mehdi+Abbas+T%25C3%25BCrbesi.jpg'}}
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
