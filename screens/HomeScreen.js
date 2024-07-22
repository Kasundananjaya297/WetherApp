import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView,ActivityIndicator,Alert} from 'react-native';
import Modal from "react-native-modal";
import React, {useEffect, useState} from 'react'
import { StatusBar } from 'expo-status-bar'
import { Theme } from '../Theme'
import * as Location from 'expo-location';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import {MapPinIcon} from 'react-native-heroicons/solid'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faThermometer0 } from '@fortawesome/free-solid-svg-icons/faThermometer0'
import { faThermometer3 } from '@fortawesome/free-solid-svg-icons/faThermometer3'
import {CalendarDaysIcon} from 'react-native-heroicons/outline'
import {ClockIcon} from 'react-native-heroicons/outline'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {debounce} from "lodash";
import {callAutoComplete, selectedCity} from '../API/api'




export default function HomeScreen() {
  const [showSearch,toggleSearch]=useState(false);
  const [locations,setLocations]=useState([]);
  const indexArray24H = [];
  var value=0.2;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const[seletetedTime,setTime]=useState((new Date()).getHours());
  const[selectedMonth,setSelectedMonth]=useState(new Date().toLocaleString('default', { month: 'short' }));
  const[seletedDate,setSeletedDate] = useState(new Date().toLocaleString('default', { day: 'numeric' }));
  const [enteredLocation,setEnteredLocation] = useState('');
  const [selectedCityFromClick,setSelectedCity] = useState("Athurugiriya");
  const [weatherCondition,setWeatherCondition] = useState([]);
  const [forcastData,setForcastData] = useState([]);
  const [latitude,setLatitude] = useState(0);
  const [longitude,setLongitude] = useState(0);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const [completedLocation,setCompletedLocation] = useState([]);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    setSelectedMonth(date.toLocaleString('default', { month: 'short' }));
    setSeletedDate(date.toLocaleString('default', { day: 'numeric' }));
    hideDatePicker();
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const handleTimePicker = (time) => {
    const hours = time.getHours();
    let minutes = time.getMinutes();
    if (minutes >= 30) {
    minutes = 0;}
      const selectedHour = hours < 10 ? `0${hours}` : `${hours}`;
      const selectedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      console.log("A time has been picked: ", `${selectedHour}:${selectedMinutes}`);
      setTime(new Date().getHours());
      hideTimePicker();
  };
    const fetchLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                Alert.alert('Permission to access', 'Permission to access location was denied', [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'Retry',
                        onPress: () => fetchLocation(),
                    },
                ]);
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
            console.log("Current location:", location.coords.latitude, location.coords.longitude);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, [forcastData]);
    useEffect(() => {
        const fetch = async() =>{
            try{
                console.log("Selected Location",selectedCityFromClick);
                const response = await selectedCity(1,selectedCityFromClick);
                setWeatherCondition(response?.data)
                setForcastData(response?.data?.forecast?.forecastday)
                setLocations([]);
            }catch (error) {
                console.error("An error occurred:", error);
            }
        }
        if(selectedCityFromClick?.length>0){
            fetch()
        }

    }, [selectedCityFromClick]);
    useEffect(() => {
        console.log("Weather Condition",weatherCondition);
    }, [weatherCondition]);

  const handleLocation = debounce((text) => {
      setEnteredLocation(text);
  }, 400);

  function generateTemperatureData() {
      const currentTime = new Date().getHours();
    for (let i = currentTime; i <= 23; i++) {
      const time = i < 10 ? '0' + i : '' + i;
      console.log("forecast_data",forcastData)
      indexArray24H.push({ time, temperature: 30});
    }
    return indexArray24H;
  }
  generateTemperatureData();

    useEffect(() => {
            const fetch = async () => {
                try {
                    const response = await callAutoComplete(enteredLocation);
                    setLocations(response?.data);
                    setForcastData(response?.data?.forecast?.forecastday)
                }catch (error) {
                    console.error("An error occurred:", error);
                }
            }
        if(enteredLocation?.length>0){
            fetch()
        }
    }, [enteredLocation]);

    if(!weatherCondition?.current){
        return (
            <View className="flex-1 justify-center items-center">
                <Image blurRadius={0.9} source={require('../assets/Backgroun.png')} className="absolute h-full w-full"/>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        )
    }
  return (
   <View className="flex-1 relative">
    <StatusBar style="light"/>
    <Image blurRadius={0.9} source={require('../assets/Backgroun.png')} className="absolute h-full w-full"/>
    <SafeAreaView className="flex flex-1">
      <View style={{height:'7%'}} className="mx-6 relative z-50 mt-1" >
        <View className="flex-row justify-end items-center rounded-full"
        style={{backgroundColor:showSearch? Theme.white(0.2):Theme.white(0)}}>
          {
            showSearch ? (
              <TextInput
              placeholder="Enter city for weather forecasting..."
              placeholderTextColor="lightgray"
              className="pl-10 h-10 flex-base text-sm flex-1 text-white"
              onChangeText={(text)=>{handleLocation(text)}}
            />
            ) : null
          }
          <TouchableOpacity
          onPress={()=>toggleSearch(!showSearch)}
          style={{backgroundColor:Theme.white(0.3)}}
          className="rounded-full p-3 m-1 "
          >
          <MagnifyingGlassIcon size="25" color='white'/>
          </TouchableOpacity>

        </View>
            {
              locations?.length>0  && showSearch?(
                <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                  {
                    locations?.map((loc,index)=>{
                      var showBorder = index +1 != locations?.length;
                      var borderClass = showBorder?'border-b-2 border-b-gray-400':'';
                      return (
                        <TouchableOpacity
                        key={index}
                        className={"flex-row items-center border-0 p-3 px-4 mb-1 "+borderClass}
                        onPress={()=>{setSelectedCity(loc?.name);toggleSearch(false)}}
                        >
                          <MapPinIcon size="22" color="gray"/>
                          <Text className="text-base text-black ml-4">{loc?.name}, {loc?.country}</Text>
                        </TouchableOpacity>
                      )
                    })
                  }
                </View>
               ) : null
            }
      </View>
            <View className="mx-4 flex justify-around flex-0 mb-6 items-center mt-16">
              <Image source={require('../assets/images/partlycloudy.png')} className="h-40 w-40"/>
              <View className="space-y-2 items-center">
                  <View className="space-y-0 items-center">
                      <Text className="text-white text-center  text-7xl ml-6 mb-0">{weatherCondition?.current?.temp_c}&#176;</Text>
                      <Text className="text-white text-center text-3xl mb-1">{selectedCityFromClick}</Text>
                      <View className="flex-row pl-1 items-center">
                      <FontAwesomeIcon icon={ faThermometer0 } color='white' size={22}/>
                          <Text className="text-white text-center text-xl pr-6 pl-3" >Min.:{weatherCondition?.current?.dewpoint_c}&#176;</Text>
                          <FontAwesomeIcon icon={ faThermometer3 } color='white' size={22}/>
                          <Text className="text-white text-center text-xl pl-3">Max.:{weatherCondition?.current?.heatindex_c}&#176;</Text>
                    </View>
                  </View>
              </View>
           </View>
           <View className="mx-1 relative z-50 mt-2 items-center">
           <View className="flex-row justify-start items-center rounded-full"
            style={{backgroundColor: Theme.white(0.2)}}>
              <Image source={require('../assets/icons/rains.png')}  className="h-6 w-6 ml-8 mt-3 mb-3 mr-3" />
              <Text className=" text-white text-xl items-center font-bold mr-2">{weatherCondition?.current?.humidity}%</Text>
              <Image source={require('../assets/icons/Hummidity.png')}  className="h-6 w-6 ml-4 m-3" />
              <Text className=" text-white text-xl items-center font-bold mr-2">{weatherCondition?.current?.humidity}%</Text>
              <Image source={require('../assets/icons/wind.png')}  className="h-6 w-6 ml-4 m-3" />
              <Text className=" text-white text-xl items-center font-bold mr-6">{weatherCondition?.current?.vis_km}km/h</Text>
        </View>
        </View>

        <View className="mx-4 relative z-50 mt-4">
            <View className="rounded-3xl pt-1" style={{ backgroundColor: Theme.white(0.2) }}>
              <View className="flex-row justify-between mt-2">
                <View className="flex-row items-center mx-4">
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)} className="ml-1 rounded-full p-1"
              style={{ backgroundColor: Theme.white(0.3)}}>
                <CalendarDaysIcon color="white" size={22}/>
                {/*calenader*/}
                <View className="flex-row">
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    minimumDate={new Date()}
                />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTimePickerVisibility(true)} className="ml-3 rounded-full p-1"
              style={{ backgroundColor: Theme.white(0.3) }} >
                <ClockIcon color="white" size={22} />
                {/*Time Selector*/}
                <View className="flex-row">
                  <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    minuteInterval={30}
                    onConfirm={handleTimePicker}
                    onCancel={hideTimePicker}
                    minimumDate={new Date()}
                    display="spinner"
                    locale="en_GB"
                    is24Hour={true}
                />
                </View>
              </TouchableOpacity>
                      <Text className="text-white text-light text-lg pl-12 font-semibold font-base ml-2">Forecast</Text>
                </View>
                      <Text className="text-white font-light text-lg mr-4">{selectedMonth}, {seletedDate}</Text>
              </View>
              {/*Scroll view*/}
              <View className="flex-row items-center mt-2 ml-4 mr-6">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                >
                {indexArray24H.map((item, index) => (
                <View key={index} style={{ backgroundColor: Theme.white(index==seletetedTime?0.2:0) }}
                 className="flex-1 justify-center items-center w-20 rounded-2xl  py-3 pt-1 pb-2 space-y-3 mb-3 ml-0 mt-2" >
                  <Text className="text-white text-lg pb-3 ">{item.temperature}&#176;C</Text>
                  <Image source={require(`../assets/images/heavyrain.png`)} className="h-12 w-12" />
                  <Text className="text-white text-lg pt-2">{item.time}:00</Text>
                </View>
                      ))}
                </ScrollView>
                </View>
            </View>
        </View>
    </SafeAreaView>
   </View>
  )
}