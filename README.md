<h1 align="center">SuperMap Mobile Demo指南</h1>

<h2>一. 安装</h2>

<a herf="https://reactnative.cn/docs/environment-setup">React Native环境搭建</a>

<h3>1. 创建项目</h3>

```
npx react-native init AwesomeProject --version X.XX.X
```

<h3>2. 必备三方库</h3>

```
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view

// ios 初始化安装必备三方库
npx pod-install ios
```

```xml
// AndroidManifest.xml 添加许可(可根据实际使用功能,增删许可)
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.REORDER_TASKS" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.KILL_BACKGROUND_PROCESSES" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_PROFILE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.VIBRATE"/>
```

```typescript
// Android高版本需要动态申请权限,在js中调用
PermissionsAndroid.requestMultiple([
  'android.permission.READ_PHONE_STATE',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
])
```

```xml
// AndroidManifest.xml 添加http
<uses-library android:name="org.apache.http.legacy" android:required="false" />
```

<h3>3. 引入imobile_for_reactnative</h3>
将imobile_for_reactnative放入node_modules中</br>
运行react-native link imobile_for_reactnative</br>

</br></br>
<h2>二. 使用imobile_for_reactnative</h2>

```typescript
import React from 'react'
import { SMMapView, SMap } from 'imobile_for_reactnative'

export default MapView extends React.Component {
  // ...

  _onGetInstance = () => {
    // ...
    SMap.openMap(mapName)
    // ...
  }

  render() {
    return (
      <SMMapView
        style={{flex: 1}}
        onGetInstance={this._onGetInstance}
      />
    )
  }
}
```

