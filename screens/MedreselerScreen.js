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
export default class MedreselerScreen extends React.Component {
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
        medrese_adi:'Çifte Minerali Medrese',
        coordinates: [
          {
            latitude: 39.9066046,
            longitude: 41.271480,
          },
          {
            latitude: 39.905962,
            longitude: 41.278325,
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
  cifte = async () =>{
    this.setState({
        medrese_adi:'Çifte Minareli Medresesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.905962,
            longitude: 41.278325,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  yakutiye = async () =>{
    this.setState({
        medrese_adi:'Yakutiye Medresesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.906563,
            longitude: 41.272176,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  kursunlu = async () =>{
    this.setState({
        medrese_adi:'Kurşunlu Medresesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.908732,
            longitude: 41.275540,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  seyhler = async () =>{
    this.setState({
        medrese_adi:'Şeyhler Medresesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.903421,
            longitude: 41.273123,
          }
        ]
      })
      //this._getLocationAsync();
      this.swipeUpDownRef.showFull()
  }
  ahmediye = async () =>{
    this.setState({
        medrese_adi:'Ahmediye Medresesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.904754,
            longitude: 41.269947,
          }
        ]
      })
      
      this.swipeUpDownRef.showFull()
  }
  pervizoglu = async () =>{
    this.setState({
        medrese_adi:'Pervizoğlu Medresesi',
        bekle:true,
        coordinates:[
            {
                latitude:this.state.coordinates[0].latitude,
                longitude:this.state.coordinates[0].longitude
            },
          {
       
            latitude: 39.909452,
            longitude: 41.269947,
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>
          Şu medrese öyle bir nimettir ki başınızı seccadeden kaldırmasanız yine şükrünü ödeyemezsiniz.

</Text>
          </View>
        </View>
              
       <ScrollView >
           <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Çifte Minareli Medrese</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
              Hatuniye medresesi olarakta anılan çifte minerali medrese; Erzurum'un yüzyıllar boyu eğitim merkezi olmasında büyük rol oynamıştır.
              Türk islam mimarisinde dört eyvanlı ve açık avlulu medreselerin en önemli örneklerinden biridir. Selçuklu sultanı Alaeddin Keykubat'ın
              kızı tarafından yaptırılmış olan yapının kitabesi bunulmadığından yapım tarihi hakkında da net bir bilgi bulunmamaktadır.
              {'\n'}
              Medrese iki minaresinin birbirinden farklı olması ile dikkat çekmektedir. Sağ yarıdaki sütunlar, duvar kenarları ve diğer detaylar çok daha sade yapıda 
              iken sol yarıdaki detaylar daha gösterişli ve incelikli bir şekilde işlenmiştir
              {'\n'}
              35x46 Metre boyutlarında olan Medrese eşsiz güzellikteki süslemeleri ve göz kamaştırıcı estetiği ile şehrin en önemli tarihi eserlerinden biridir.
              4. Muratın emri ile bir süre kışla olarak kullanıldığı kaydedilmiştir.
              {'\n'}
              Günümüzde ise müze ve sergi salonu olarak hizmet vermektedir.

        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.cifte}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://cdn.turkmedya.com.tr/aksam/imgsdisk/2018/08/12/120820182027260759566.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Yakutiye Medresesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Yakutiye Medresesi; İlhanlı hükümdarı Sultan Olcayto döneminde Gazan Han ve Bolugan Hatun adına, Hoca Yakut Gazani tarafından 1310 yılında yaptırılmıştır. Anadolu'daki kapalı avlulu medreselerin en büyüğü olan Yakutiye Medresesi, plan düzeni, dengeli mimarisi ve iri motifli süslemeleri ile Erzurum'un en gösterişli yapılarından biridir. Yapının taç kapısı cepheden dışa taşmaktadır. Dört eyvanlı iç mekân da bulunan dikdörtgen avlunun orta bölümü mukarnaslı bir kubbe ile diğer kısımları ise sivri kemerli beşik tonozlarla örtülüdür. Taç kapının yan yüzlerinde, silme kemerle çevrili nişler içinde pars ve kartal motifleri dikkat çekmektedir. Ajurlu bir küreden çıkan hurma yaprakları, iki pars ve kartal figürlerinden oluşan hayat ağacı Orta Asya Türklerinin önemli simgelerini bir araya getirmektedir. Basık kemerli ve oymalı olan taç kapının her tarafını kaplayan bezemeler, muhteşem bir görüntü oluşturmaktadır. Yakutiye Medresesi'nin doğu duvarına bitişik inşa edilen kümbet, tuğladan yapılmıştır. Üzerinde üç penceresi bulunan yapı, külah ile örtülüdür. Avlunun sağ ve solunda karşılıklı beşik tonozlu altışar oda sıralanmıştır. Bunlardan sağ köşedeki odadan aynı zamanda minareye çıkılmaktadır. Güneydeki tonozun üzerinde ise bu medreseye vakfedilmiş altı köyün ismini içeren vakfiye, mermer üzerine sülüs yazı ile asılmıştır, iç içe geçmiş geometrik motifler ve çinilerle bezeli minare, kabartma kordonlarla hareketli bir görünüm kazanmıştır. Köşelerde yer alan kalın gövdeli minarelerden biri çok önceden yıkılmış veya hiç yapılmamıştır. Bu minarenin kaidesi konik bir külahla kapatılmıştır. Öğrenci ve hocaların odaları sınıf ve derecelerine göre belirlenmiştir. Bu nedenle her odanın girişinde farklı bir işleme dikkat çekmektedir. 1995 yılında restore edilen medrese, günümüzde Türk-İslâm Eserleri ve Etnografya Müzesi olarak kullanılmaktadır. 

              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.yakutiye}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.kulturportali.gov.tr/Common/GetFoto.aspx?f=MjAxNjEyMTQxMDI4NDk2NzZfRVJaVVJVTSBZYWt1dGl5ZSBNZWRyZXNlc2kgVHVyayBJc2xhbSBFc2VybGVyaSBNdXplc2kgIDAyNzYuanBn&d=U2VoaXJSZWhiZXJpXFxHZXppbGVjZWtZZXJc&s=bGFyZ2U%3D'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Kurşunlu Medresesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Kurşunlu Medresesi; Kurşunlu Camisi'nin yanında bulunan Medrese, Şeyhülislam Feyzullah Efendi tarafından 1701 yılında yaptırılmıştır. Feyziye Medresesi olarak da anılan yapı, Kurşunlu Camisi ile birlikte bir külliye oluşturmaktadır. Düzgün kesme taştan inşa edilen medresenin on üç hücresi günümüze gelebilmiştir. Güneydoğu köşesindeki üç hücre sonraki yıllarda yapılan onarımlarda buraya eklenmiştir. Doğu duvarına paralel olarak uzanan sekiz hücrenin üstü beşik tonozlarla örtülmüştür. Hücrelerin her birisinin batı yönüne açılan bir veya iki penceresi bulunmaktadır. Medrese, 2006 yılında restore edilmiştir.        
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.kursunlu}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://4.bp.blogspot.com/_VgvUFEQICes/TRuXidC0GUI/AAAAAAAAID4/oYkgEgKvrAk/s1600/Kur%25C5%259Funlu+Medresesi.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Şeyhler Medresesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>

Şeyhler Camisi'nin batısında, ka­reye yakın dikdörtgen alan üze­rine, doğusundaki cami, çeşme ve kuzeyindeki hamamla birlikte 1760 yılında Erzurum Müftüsü Şeyh Mustafa Efendi tarafından yap­tırılmıştır.

Kitabesinde adı Darüs- sefa olarak geçmektedir.
Doğuya açılan kapıdan girildikten sonra hücresiz, revaksız bir avluya ulaşılmaktadır. Avlunun dört yanı, yan yana on bir hücre ile göste­rişsiz bir mimari ortaya koymak­tadır.

Güneyde kemerle birleşti­rilmiş uzun, dikdörtgen bir hücre vardır. Hücrelerin tamamı beşik tonoz örtülüdür. Hücrelerin, av­luya bakan birer kapı ve pencere açıklığı bulunmaktadır. 2002 yılından bu yana lokanta olarak faaliyet göstermektedir              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.seyhler}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://1.bp.blogspot.com/-2-IGfS-0jVA/U_YCuM7xg5I/AAAAAAAAWfY/Zht-BOC0IT0/s1600/%C5%9Eeyhler%2BMedresesi.jpg'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Ahmediye Medresesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>

Ahmediye Medresesi; İlhanlı Devleti zamanında Ahmet bin Ali bin Yusuf tarafından 1314 yılında yaptırılmıştır. 13 ve 14. yüzyıl dönemi kapalı avlulu medrese tipinin bir örneğidir. Medrese, 16.50 x 9.75 m. ölçülerinde dikdörtgen planlıdır. Üzeri manastır tonozları ile örtülü avlunun her kenarında ikişer medrese odası yer almaktadır. Avluya açılan iki eyvanın köşelerine yerleştirilen sütunların bitkisel bezemelerle kaplandığı medrese, bu yönüyle Yakutiye ile büyük bir benzerlik göstermektedir. Girişin karşısına gelen eyvanda bir mihrabın bulunması, bu yapının aynı zamanda mescit olarak kullanıldığını, kuzey cephe duvarında görülen mihrabın da burada daha önce bir caminin bulunduğuna işaret etmektedir.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ahmediye}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://3.bp.blogspot.com/_VgvUFEQICes/TRuYpppQ26I/AAAAAAAAID8/TG74Ty_RZio/s1600/ahmediye+medresesi.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Pervizoğlu Medresesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>

İç kalenin kuzeyindeki eğimli arazi üze­rinde, 1716 yılında Hacı Mehmed tara­fından Pervizoğlu Camisi ile birlikte yaptırılmıştır.

Ayazpaşa Mahallesi'ndedir. Pervizoğlu camiine bitişiktir. 
1995 yılında onarılarak sağlamlaştırılan medresenin ön cephe duvarları kesme taştan, arka duvarlar moloz taştan inşa edilmiştir. L şeklinde düzenlenmiş hücrelerin üzeri, beşik tonoz örtülüdür.



        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.pervizoglu}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://4.bp.blogspot.com/-xciy5J06r5Y/U_71q-I8UHI/AAAAAAAAWm8/qpRRFPhUCMY/s1600/Pervizo%C4%9Flu%2BCamii.jpg'}}
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
          Şu medrese öyle bir nimettir ki başınızı seccadeden kaldırmasanız yine şükrünü ödeyemezsiniz.

</Text>
          </View>
        </View>
              
       <ScrollView >
       <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}} onPress={this.cifte}>Çifte Minareli Medrese</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
              Hatuniye medresesi olarakta anılan çifte minerali medrese; Erzurum'un yüzyıllar boyu eğitim merkezi olmasında büyük rol oynamıştır.
              Türk islam mimarisinde dört eyvanlı ve açık avlulu medreselerin en önemli örneklerinden biridir. Selçuklu sultanı Alaeddin Keykubat'ın
              kızı tarafından yaptırılmış olan yapının kitabesi bunulmadığından yapım tarihi hakkında da net bir bilgi bulunmamaktadır.
              {'\n'}
              Medrese iki minaresinin birbirinden farklı olması ile dikkat çekmektedir. Sağ yarıdaki sütunlar, duvar kenarları ve diğer detaylar çok daha sade yapıda 
              iken sol yarıdaki detaylar daha gösterişli ve incelikli bir şekilde işlenmiştir
              {'\n'}
              35x46 Metre boyutlarında olan Medrese eşsiz güzellikteki süslemeleri ve göz kamaştırıcı estetiği ile şehrin en önemli tarihi eserlerinden biridir.
              4. Muratın emri ile bir süre kışla olarak kullanıldığı kaydedilmiştir.
              {'\n'}
              Günümüzde ise müze ve sergi salonu olarak hizmet vermektedir.

        </Text>
        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.cifte}>Yol tarifi için tıklayın...</Text>

        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://cdn.turkmedya.com.tr/aksam/imgsdisk/2018/08/12/120820182027260759566.jpg'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Yakutiye Medresesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Yakutiye Medresesi; İlhanlı hükümdarı Sultan Olcayto döneminde Gazan Han ve Bolugan Hatun adına, Hoca Yakut Gazani tarafından 1310 yılında yaptırılmıştır. Anadolu'daki kapalı avlulu medreselerin en büyüğü olan Yakutiye Medresesi, plan düzeni, dengeli mimarisi ve iri motifli süslemeleri ile Erzurum'un en gösterişli yapılarından biridir. Yapının taç kapısı cepheden dışa taşmaktadır. Dört eyvanlı iç mekân da bulunan dikdörtgen avlunun orta bölümü mukarnaslı bir kubbe ile diğer kısımları ise sivri kemerli beşik tonozlarla örtülüdür. Taç kapının yan yüzlerinde, silme kemerle çevrili nişler içinde pars ve kartal motifleri dikkat çekmektedir. Ajurlu bir küreden çıkan hurma yaprakları, iki pars ve kartal figürlerinden oluşan hayat ağacı Orta Asya Türklerinin önemli simgelerini bir araya getirmektedir. Basık kemerli ve oymalı olan taç kapının her tarafını kaplayan bezemeler, muhteşem bir görüntü oluşturmaktadır. Yakutiye Medresesi'nin doğu duvarına bitişik inşa edilen kümbet, tuğladan yapılmıştır. Üzerinde üç penceresi bulunan yapı, külah ile örtülüdür. Avlunun sağ ve solunda karşılıklı beşik tonozlu altışar oda sıralanmıştır. Bunlardan sağ köşedeki odadan aynı zamanda minareye çıkılmaktadır. Güneydeki tonozun üzerinde ise bu medreseye vakfedilmiş altı köyün ismini içeren vakfiye, mermer üzerine sülüs yazı ile asılmıştır, iç içe geçmiş geometrik motifler ve çinilerle bezeli minare, kabartma kordonlarla hareketli bir görünüm kazanmıştır. Köşelerde yer alan kalın gövdeli minarelerden biri çok önceden yıkılmış veya hiç yapılmamıştır. Bu minarenin kaidesi konik bir külahla kapatılmıştır. Öğrenci ve hocaların odaları sınıf ve derecelerine göre belirlenmiştir. Bu nedenle her odanın girişinde farklı bir işleme dikkat çekmektedir. 1995 yılında restore edilen medrese, günümüzde Türk-İslâm Eserleri ve Etnografya Müzesi olarak kullanılmaktadır. 

              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.yakutiye}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.kulturportali.gov.tr/Common/GetFoto.aspx?f=MjAxNjEyMTQxMDI4NDk2NzZfRVJaVVJVTSBZYWt1dGl5ZSBNZWRyZXNlc2kgVHVyayBJc2xhbSBFc2VybGVyaSBNdXplc2kgIDAyNzYuanBn&d=U2VoaXJSZWhiZXJpXFxHZXppbGVjZWtZZXJc&s=bGFyZ2U%3D'}}
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


                 <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Kurşunlu Medresesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Kurşunlu Medresesi; Kurşunlu Camisi'nin yanında bulunan Medrese, Şeyhülislam Feyzullah Efendi tarafından 1701 yılında yaptırılmıştır. Feyziye Medresesi olarak da anılan yapı, Kurşunlu Camisi ile birlikte bir külliye oluşturmaktadır. Düzgün kesme taştan inşa edilen medresenin on üç hücresi günümüze gelebilmiştir. Güneydoğu köşesindeki üç hücre sonraki yıllarda yapılan onarımlarda buraya eklenmiştir. Doğu duvarına paralel olarak uzanan sekiz hücrenin üstü beşik tonozlarla örtülmüştür. Hücrelerin her birisinin batı yönüne açılan bir veya iki penceresi bulunmaktadır. Medrese, 2006 yılında restore edilmiştir.        
              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.kursunlu}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://4.bp.blogspot.com/_VgvUFEQICes/TRuXidC0GUI/AAAAAAAAID4/oYkgEgKvrAk/s1600/Kur%25C5%259Funlu+Medresesi.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Şeyhler Medresesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>

Şeyhler Camisi'nin batısında, ka­reye yakın dikdörtgen alan üze­rine, doğusundaki cami, çeşme ve kuzeyindeki hamamla birlikte 1760 yılında Erzurum Müftüsü Şeyh Mustafa Efendi tarafından yap­tırılmıştır.

Kitabesinde adı Darüs- sefa olarak geçmektedir.
Doğuya açılan kapıdan girildikten sonra hücresiz, revaksız bir avluya ulaşılmaktadır. Avlunun dört yanı, yan yana on bir hücre ile göste­rişsiz bir mimari ortaya koymak­tadır.

Güneyde kemerle birleşti­rilmiş uzun, dikdörtgen bir hücre vardır. Hücrelerin tamamı beşik tonoz örtülüdür. Hücrelerin, av­luya bakan birer kapı ve pencere açıklığı bulunmaktadır. 2002 yılından bu yana lokanta olarak faaliyet göstermektedir              

        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.seyhler}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://1.bp.blogspot.com/-2-IGfS-0jVA/U_YCuM7xg5I/AAAAAAAAWfY/Zht-BOC0IT0/s1600/%C5%9Eeyhler%2BMedresesi.jpg'}}
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
    
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Ahmediye Medresesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>

Ahmediye Medresesi; İlhanlı Devleti zamanında Ahmet bin Ali bin Yusuf tarafından 1314 yılında yaptırılmıştır. 13 ve 14. yüzyıl dönemi kapalı avlulu medrese tipinin bir örneğidir. Medrese, 16.50 x 9.75 m. ölçülerinde dikdörtgen planlıdır. Üzeri manastır tonozları ile örtülü avlunun her kenarında ikişer medrese odası yer almaktadır. Avluya açılan iki eyvanın köşelerine yerleştirilen sütunların bitkisel bezemelerle kaplandığı medrese, bu yönüyle Yakutiye ile büyük bir benzerlik göstermektedir. Girişin karşısına gelen eyvanda bir mihrabın bulunması, bu yapının aynı zamanda mescit olarak kullanıldığını, kuzey cephe duvarında görülen mihrabın da burada daha önce bir caminin bulunduğuna işaret etmektedir.
        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.ahmediye}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://3.bp.blogspot.com/_VgvUFEQICes/TRuYpppQ26I/AAAAAAAAID8/TG74Ty_RZio/s1600/ahmediye+medresesi.jpg'}}
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
              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray',marginTop:50}} >Pervizoğlu Medresesi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>

İç kalenin kuzeyindeki eğimli arazi üze­rinde, 1716 yılında Hacı Mehmed tara­fından Pervizoğlu Camisi ile birlikte yaptırılmıştır.

Ayazpaşa Mahallesi'ndedir. Pervizoğlu camiine bitişiktir. 
1995 yılında onarılarak sağlamlaştırılan medresenin ön cephe duvarları kesme taştan, arka duvarlar moloz taştan inşa edilmiştir. L şeklinde düzenlenmiş hücrelerin üzeri, beşik tonoz örtülüdür.



        </Text>


        <Text style={{fontFamily:'baslik1',fontSize:15,color:'gray',marginTop:15}} onPress={this.pervizoglu}>Yol tarifi için tıklayın...</Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://4.bp.blogspot.com/-xciy5J06r5Y/U_71q-I8UHI/AAAAAAAAWm8/qpRRFPhUCMY/s1600/Pervizo%C4%9Flu%2BCamii.jpg'}}
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
              adUnitID="ca-app-pub-5888738492049923/7163419742" // Test ID, Replace with your-admob-unit-id
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
