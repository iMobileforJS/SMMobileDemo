import * as React from 'react';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { NavigationService } from './utils';
import { Home, MapView, NavigationView } from '@/containers';

const Stack = createStackNavigator();

export default function Root() {
  return (
    <NavigationContainer
      ref={navigatorRef => {
        NavigationService.setNavigation(navigatorRef)
      }}
    >
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={Home} />
        {/* <Stack.Screen name="MapView" component={MapView} /> */}
        <Stack.Screen name="NavigationView" component={NavigationView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
