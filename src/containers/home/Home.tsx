/**
 * APP首页
 */
import React from 'react';
import {View, Text, Button} from 'react-native';

export default function Home({navigation}: any) {
  return (
    <View style={{paddingVertical: 30}}>
      <Button title="Navigation" onPress={() => navigation.navigate('NavigationView')}/>
    </View>
  );
}
