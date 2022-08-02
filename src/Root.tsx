import * as React from 'react';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { NavigationService } from './utils';
import { Home, MapView, NavigationView ,MapBrowsingView, Home01} from '@/containers';

const Stack = createStackNavigator();

export default function Root() {
  return (
    <NavigationContainer
      ref={navigatorRef => {
        NavigationService.setNavigation(navigatorRef)
      }}
    >
      <Stack.Navigator
        initialRouteName="Home01"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown: false,
          // 禁止侧滑返回
          gestureEnabled: false,
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Home01" component={Home01} />
        {/* <Stack.Screen name="MapView" component={MapView} /> */}
        <Stack.Screen name="NavigationView" component={NavigationView} />
        <Stack.Screen name="MapBrowsingView" component={MapBrowsingView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
