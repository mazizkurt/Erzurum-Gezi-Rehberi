import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,Button,
  View,ScroolView,SafeAreaView,Dimensions,TouchableHighlight,Linking,Alert,ActivityIndicator
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
export default class CobanDedeKoprusuScreen extends React.Component {
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
        coordinates: [
          {
            latitude: 39.9066046,
            longitude: 41.271480,
          },
          {
            latitude: 39.985216,
            longitude: 41.884005,
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
        },
        {
            latitude: 39.985216,
            longitude: 41.884005,
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
		Alert.alert(errorMessage);
  }
  _reklam_site =async () => {
    WebBrowser.openBrowserAsync('https://www.dedeman.com/TR/7-Oteller/278-Dedeman-Palandoken/');
  };
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
          <Text style={{fontWeight:'bold',fontFamily:'space-mono',textAlign:'center',color:'grey'}}>Yüzyılların ardından kopup gelen bir vakar,
Kahramanlık, yiğitlik, erlik destanıdır bar.</Text>
          </View>
        </View>
              
       <ScrollView >
       <View style={{flex:1,marginTop:200,width:'98%',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}}>Erzurum Evleri</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum evlerinin mimarisi,tamamiyle iklime bağlı,geleneksel yapı tiplerinden oluşmuştur.Şehrin,deniz seviyesinden ortalama 1850 m yüksekte bulunması,dağların kuşattığı ovanın güneyinde kurulmuş olması,uzun soğuk geçen kışlarla,sıcak ve kısa süreli yazlar,bazen de çok kısa süren bahar,yapılaşmada ve ev mimarisinde belirleyici rol oynamıştır.Erzurum evleri,şehrin bulunduğu zengin coğrafya,tarih ve kültür ortamının bir eseridir.Özellikle içlerinde yaşanan hayat,iklim ve yapı malzemesi evlerin tasarımını etkilemiştir.
Erzurum evleri,esas olarak Türk ev mimarisine uyan fakat kendine has özellikleri bulunan bir konut türü olarak ortaya çıkmıştır.Doğu Anadolu’nun soğuk iklimi 
çoğunlukla iki katlı olan evlerin zemin katlarını esas hayatın geçtiği alan haline getirmiştir.Zemin katta çoğunlukla kadınların yaşadığı,yemek pişirdiği tandır evine kışlık odalar açılmaktadır.Avlu-taşlık kapalı bir mekan haline gelirken üst katta sofa küçülmüş ve önemini yitirmiştir.Bu bakımdan Erzurum evleri sofasız,iç avlulu ve tandır evli yeni plan tipini oluşturmuştur.Erzurum evleri bu plan  farklılığının dışında,yaşama alanları,süsleme özellikleri bakımındanTürk evlerinin diğer bölgelerdeki örneklerine benzerlik göstermektedir.

        </Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://www.yesiltopuklar.com/wp-content/uploads/2013/08/Alkols%C3%BCz-Mekanlar-Erzurum-Evleri-3.jpg'}}
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
              <View style={{marginTop:30}}></View>

              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}}>Tandır Evi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Hemen hemen her hanede pişen tandır ekmeği
Erzurum şehrinde ve köylerinde, ahalinin önemli bir kısmı ekmeklerini kendi hânelerinde pişirirlerdi. Bunlar tandırlarda pişirildiği için “tandır ekmeği” denirdi. Bunlar, Ramazan pidelerinden daha büyük ve daha ince ekmeklerdi. Hatta bunu kağıttan ince bir hale getirenler vardı.

Tandır ekmekleri günlük pişirilmez!

Tandır ekmekleri bolca yapılır ve evin bir haftalık ekmek ihtiyacı bir seferde pişirilirdi. 
        </Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://3.bp.blogspot.com/-LLvn4NzryoQ/TxXskDCEIlI/AAAAAAAAC9k/I3g7Ldo526k/s1600/DSC_1411.JPG'}}
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
              <View style={{marginTop:30}}></View>

              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}}>Cirit</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Geleneksel spor dallarımızdan en heyecanlısı olan cirit Erzurum'da eski canlılığı ile yaşatılmaktadır. Atla, insanın birlikte mücadelesine dayanan ve erliğin bir göstergesi olarak kabul edilen cirit için Erzurum'da özel sahalar bulunmaktadır. İlçe ve köylerde geniş çayırlık alanlarda, özellikle hafta sonları düzenlenen karşılaşmalarda oyuncular kadar özleyenlerde büyük heyecan duyarlar. Günümüzde Orta Asya'dan geldiği şekli ile nesillerden intikal ederek gelen bu ata yadigarı sporumuz, yabancılarında büyük ilgisini çekmektedir. Cengiz Han Zamanında Anadolu'ya geldiği tahmin edilen bu sporun ülkemizde başka yörelerde oynanmasına karşılık, bu işe en çok gönül verilen yer Erzurum dur.
        </Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Two_men_playing_cirid.jpg'}}
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
              <View style={{marginTop:30}}></View>

              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}}>Bardız Kilimi</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Erzurum Şenkaya ilçesinde üretilen Bardız Kilimi; Odalara ve çadırların zeminine serilmek veya divan ve sedir örtüsü olarak kullanılmak üzere hazırlanan, genel olarak renkli ve desenli, tüysüz, ince dokumalardır. 
Halılar gibi tezgâhta dokunan kilimler, ev döşemelerinde olduğu gibi özel biçimler verilerek heybe, çuval ve namazlık olarak da kullanılmaktadır.
        </Text>
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
              adUnitID="ca-app-pub-5888738492049923/8942694831" // Test ID, Replace with your-admob-unit-id
              testDeviceID="EMULATOR"
              onDidFailToReceiveAdWithError={this.bannerError}
              onAdMobDispatchAppEvent={this.adMobEvent} />
              </View>
              <View style={{marginTop:30}}></View>

              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}}>Oltu Taşı İşlemeciliği</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Oltu, tarih ve kültür bakımından zengin bir ilçedir. Güzel bir el sanatı olan Oltu Taşı işletmeciliği bu zengin kültür ilçesinde kendine has bir yeri vardır. Oltu Taşı kıymetli bir maden taşı olup, sadece Oltu ve çevresinden çıkmaktadır. 3213 sayılı Maden Kanunu'nda kıymetli taşlar arasında olduğunun tescili dahi yapılmıştır. Çıkarılması, zor, rezervi az, fakat işlenmesi kolaydır. Oltu'nun sembolü olup yüzlerce ailenin ekmek teknesidir.

        </Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.aniyuzuk.com/925-ayar-yogun-gumus-islemeli-erzurum-oltu-tasi-tesbih-oltu-ta-tesbihler-25339-68-B.jpg'}}
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
              <View style={{marginTop:30}}></View>

              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}}>Aşıklık Geleneği</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Âşıklık geleneği ve âşık edebiyatı, bağımsız bir sosyo-kültürel kurum kimliğiyle ortaya çıktığı 16. yüzyıldan günümüze kadar, Türk kültür yaşamı içinde yer alan bütün ögeleri içine alan Türk kültürünün bütün katmanlarınca özümsenen ve çağlar süren toplumun ortak kültür kodlarını oluşturan önemli bir kurum olmuştur. Türk sosyo-kültürel yapısı içinde oluşan serbest ve zorunlu kültür değişmeleri toplumsal dokuyu şekillendirmiş, yapısal ve işlevsel yönden âşıklık geleneğine önemli kaynak olmuştur 

        </Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://www.salakfilozof.com/wp-content/uploads/2019/01/erzurumlu-emrah.jpg'}}
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
              <View style={{marginTop:30}}></View>

              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}}>Erzurum Barı</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        9. yüzyıldan sonra Oğuz Türkleri, birçok akınlarla Doğu Anadolu’ya gelmişlerdir. Buralarda büyük medeniyetler kuran Türkler, birçok medeniyetleri geride bırakmışlardır. Daha sonra 1071 yılından itibaren Anadolu’nun muhtelif köşelerinde büyük kültür merkezleri kurulmuştur. 
Yapılan arkeolojik kazılarda Erzurum Ovası’nda Karaz, Tufanç ve Pulur köylerinde bir takım eski Türk medeniyetinin kalıntılarına rastlanmıştır. 
Folklor kelime anlamı ile ‘Halk Bilimi’ demektir. Yerleşik hayata geçen Türk halkı, sosyal faaliyetlerini arttırmışlar ve böylece folklorun bir kolu olan Halk Oyunları da doğmuştur. İslamiyetin doğuşundan önce Türkler, Totem’lere inanmaktaydılar. Uzun müddet totemizmin etkisi altında kaldılar. Yani bazı hayvanları sembolleştirerek onlara taparlar ve onlar için ayinler tertip ederlerdi. Bu ‘Totezmizm’ in etkisi islamiyetin kabülünden sonra da devam etmiştir Bu bizleri Türklerin vermiş oldukları sanat eserlerinde açıkça görebiliriz. Selçuklular ve Saltuklulardan kalan eserler incelendiğinde, bu eserlerin üzerinde aslan, kartal, ejderha resimleri göze çarpar. Erzurum’da bulunan Yakutiye Medresesi, Üç Kümbetler, muhtelif kümbetler ve Çifte Minarelerde bunların bariz örneklerini görmek mümkündür.

        </Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'http://3.bp.blogspot.com/-OcoQju-QuWQ/Tu0Lc9UwYWI/AAAAAAAAJgQ/bFIy-PdzFCE/s1600/Dada%25C5%259F.jpg'}}
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
              <View style={{marginTop:30}}></View>

              <Text style={{fontFamily:'baslik',fontSize:25,color:'gray'}}>Çay Kültürü</Text>
        <Text></Text>
        <Text style={{fontFamily:'space-mono',fontSize:12,color:'#b5b5b5',textAlign:'center'}}>
        Güzel şehrimizde çay da çay içmekte bir kültürdür. Öyle ki gelen misafire çay ikram etmek ve çayın yanına limon koymak çayın değerini artıran bir özellik. Karadeniz bölgesinde çay üretiminin yapılması o bölgenin insanları tarafından bizim çay demlemeyi bilmediğimiz söylense de her yiğidin bir yoğurt yiyişi olduğunu unutulmamalıdır.        </Text>
        <Lightbox underlayColor="white">
          <Image
            style={{marginTop: 30,
              height: 300,
            width:width,justifyContent:'center',alignItems:'center',shadowColor: '#000',
            shadowOffset: { width: 2, height: 9 },
            shadowOpacity: 0.4,
            shadowRadius: 2,}}
            resizeMode="contain"
            source={{uri: 'https://metinakgun.files.wordpress.com/2015/02/demlik.jpg'}}
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
              <View style={{marginTop:150}}></View>

        </View>
        </ScrollView>
        

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
