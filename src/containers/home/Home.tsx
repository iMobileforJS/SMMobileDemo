/**
 * APP首页
 */
import { getAssets } from '@/assets';
import { scaleSize, screen } from '@/utils';
import React from 'react';
import {View, Button, Text, Image, Platform} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Home({navigation}: any) {
  const paddingVerticalvalue = Platform.OS === 'android' ? 20 : 30
  return (
    <View style={{paddingVertical: scaleSize(paddingVerticalvalue), paddingTop: screen.getIphonePaddingTop()}}>
      <View>
        <TouchableOpacity
          style = {[
            {
              width: '100%',
              height: scaleSize(60),
              borderBottomColor: '#333',
              borderBottomWidth: scaleSize(1),
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
          ]}
          onPress={() => {
            navigation.navigate('Home01')
          }}
        >
          <Image
            style = {[{width: scaleSize(40), height: scaleSize(40)}]}
            source={getAssets().nav.icon_nav_back}
          />
        </TouchableOpacity>
      </View>

      <View style ={{marginTop: scaleSize(20)}}>
        <Button title="地图浏览" onPress={() => navigation.navigate('MapBrowsingView')}/>
      </View>
      <View style ={{marginTop: scaleSize(20)}}>
        <Button title="导航采集" onPress={() => navigation.navigate('NavigationView')}/>
      </View>
      <View style ={{marginTop: scaleSize(20)}}>
        <Button title="AR地图" onPress={() => navigation.navigate('ARMap')}/>
      </View>
    </View>
  );
}


