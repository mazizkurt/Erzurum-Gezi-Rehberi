import React from 'react';
import { Platform,View,Text,Image } from 'react-native';
import { createStackNavigator, createBottomTabNavigator,createDrawerNavigator,DrawerItems } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';

import { Ionicons,FontAwesome,Feather, SimpleLineIcons,MaterialIcons,AntDesign   } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import KisTurizmScreen from '../screens/KisTurizmScreen';
import KayakMerkezleriScreen from '../screens/KayakMerkezleriScreen';
import MedreselerScreen from '../screens/MedreselerScreen';
import KalelerScreen from '../screens/KalelerScreen';
import kumbetlerScreen from '../screens/kumbetlerScreen';
import CamilerScreen from '../screens/CamilerScreen';
import ErzurumkongresiScreen from '../screens/ErzurumkongresiScreen';
import TashanScreen from '../screens/TashanScreen';
import MuzelerScreen from '../screens/MuzelerScreen';
import TurbelerScreen from '../screens/TurbelerScreen';
import TabyalarScreen from '../screens/TabyalarScreen';
import HanlarScreen from '../screens/HanlarScreen';
import HamamlarScreen from '../screens/HamamlarScreen';
import CesmelerScreen from '../screens/CesmelerScreen';
import NarmanScreen from '../screens/NarmanScreen';
import KiliselerScreen from '../screens/KiliselerScreen';
import GollerScreen from '../screens/GollerScreen';
import TortumScreen from '../screens/TortumSelaleScreen';
import HinisKamyonlari from '../screens/HinisKanyonlari';
import CoruhNehriScreen from '../screens/CoruhNehriScreen';
import CobanDedeKoprusuScreen from '../screens/CobanDedeKoprusuScreen';
import ErzurumMutfagiScreen from '../screens/ErzurumMutfagiScreen';
import HalkOyunlarıScreen from '../screens/HalkOyunlarıScreen';


const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  
  title:'Anasayfa',
  
  drawerIcon: ({ tintColor }) => (
    <FontAwesome
      name="home"
      size={25}
      color="gray"
    />
  ),
  
};

const Kis_TurizmiStack = createStackNavigator({
  Kis_Turizmi: {
    screen: KisTurizmScreen,
  },
 
});
Kis_TurizmiStack.navigationOptions = {
  title: 'Kış Turizmi',  
  drawerIcon: ({ tintColor }) => (
    <FontAwesome
      name="snowflake-o"
      size={25}
      color="gray"
    />
  ),  
  
}

const P_Kayak_MerkeziStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: KayakMerkezleriScreen,
  },
 
});
P_Kayak_MerkeziStack.navigationOptions = {
  title: 'Kayak Merkezleri',  
  drawerIcon: ({ tintColor }) => (
    <Ionicons
      name="ios-flag"
      size={25}
      color="gray"
    />
  ),  
     
}
const MedreselerStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: MedreselerScreen,
  },
 
});
MedreselerStack.navigationOptions = {
  title: 'Medreseler',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/medrese.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const KalelerStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: KalelerScreen,
  },
 
});
KalelerStack.navigationOptions = {
  title: 'Kaleler',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/castle.png')}
        style={{width:20,height:20}}
        
    />
  ),  
     
}
const KumbetlerStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: kumbetlerScreen,
  },
 
});
KumbetlerStack.navigationOptions = {
  title: 'Kümbetler',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/kumbet.png')}
        style={{width:25,height:25}}
        
    />
  ),  
     
}
const CamilerStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: CamilerScreen,
  },
 
});
CamilerStack.navigationOptions = {
  title: 'Camiler',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/cami.png')}
        style={{width:25,height:25}}
        
    />
  ),  
     
}
const KongrelerStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: ErzurumkongresiScreen,
  },
 
});
KongrelerStack.navigationOptions = {
  title: 'Erzurum Kongresi',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/pasam.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}

const DashanStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: TashanScreen,
  },
 
});
DashanStack.navigationOptions = {
  title: 'Taşhan',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/tesbih.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}

const MuzelerStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: MuzelerScreen,
  },
 
});
MuzelerStack.navigationOptions = {
  title: 'Müzeler',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/muze.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const TurbelerStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: TurbelerScreen,
  },
 
});
TurbelerStack.navigationOptions = {
  title: 'Türbeler',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/turbe.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const TabyalarStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: TabyalarScreen,
  },
 
});
TabyalarStack.navigationOptions = {
  title: 'Tabyalar',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/tabya.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const HanlarStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: HanlarScreen,
  },
 
});
HanlarStack.navigationOptions = {
  title: 'Hanlar',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/hanlar.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const HamamStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: HamamlarScreen,
  },
 
});
HamamStack.navigationOptions = {
  title: 'Hamamlar',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/hamam.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const CesmeStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: CesmelerScreen,
  },
 
});
CesmeStack.navigationOptions = {
  title: 'Çeşmeler',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/cesme.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const PeriStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: NarmanScreen,
  },
 
});
PeriStack.navigationOptions = {
  title: 'Narman Peri Bacaları',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/baca.jpg')}
        style={{width:30,height:30,borderRadius:15}}
        
    />
  ),  
     
}
const KiliseStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: KiliselerScreen,
  },
 
});
KiliseStack.navigationOptions = {
  title: 'Kiliseler',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/kilise.jpg')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const GollerStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: GollerScreen,
  },
 
});
GollerStack.navigationOptions = {
  title: 'Göller',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/gol.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const SelaleStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: TortumScreen,
  },
 
});
SelaleStack.navigationOptions = {
  title: 'Tortum Şelalesi',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/selale.jpg')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const KanyonStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: HinisKamyonlari,
  },
 
});
KanyonStack.navigationOptions = {
  title: 'Hınıs Kanyonları',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/kanyon.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const CoruhStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: CoruhNehriScreen,
  },
 
});
CoruhStack.navigationOptions = {
  title: 'Çoruh Nehri',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/nehir.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const CobanDedeStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: CobanDedeKoprusuScreen,
  },
 
});
CobanDedeStack.navigationOptions = {
  title: 'Çoban Dede Köprüsü',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/kopru.png')}
        style={{width:30,height:30}}
        
    />
  ),  
     
}
const ErzurumMutfagiStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: ErzurumMutfagiScreen,
  },
 
});
ErzurumMutfagiStack.navigationOptions = {
  title: 'Erzurum Mutfağı',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/mutfak.png')}
        style={{width:25,height:25}}
        
    />
  ),  
     
}
const OyunlarStack = createStackNavigator({
  P_Kayak_Merkezi: {
    screen: HalkOyunlarıScreen,
  },
 
});
OyunlarStack.navigationOptions = {
  title: 'Erzurum Kültürü',  
  drawerIcon: ({ tintColor }) => (
    <Image
        source={require('../assets/images/oyun.png')}
        style={{width:35,height:35}}
        
    />
  ),  
     
}


const DrawerContent = (props) => (
  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

 <Image
        source={require('../assets/images/baslik.png')}
        style={{width:150,height:150}}
        
    />      
    <View style={{marginTop:10}}></View>
    <ScrollView > 
    <DrawerItems {...props} />
    </ScrollView>
  </View>
)


export default createDrawerNavigator({
  HomeStack,
  Kis_TurizmiStack,
  P_Kayak_MerkeziStack,
  MedreselerStack,
  KalelerStack,
  KumbetlerStack,
  CamilerStack,
  KongrelerStack,
  DashanStack,
  MuzelerStack,
  TurbelerStack,
  TabyalarStack,
  HanlarStack,
  HamamStack,
  CesmeStack,
  PeriStack,
  KiliseStack,
  GollerStack,
  SelaleStack,
  KanyonStack,
  CoruhStack,
  CobanDedeStack,
  ErzurumMutfagiStack,
  OyunlarStack
  
},

{
  
  contentOptions: {
    labelStyle: { fontFamily:'baslik',color:'gray' }
  },
  contentComponent:DrawerContent,
  drawerType:'back', 
        
}
);
