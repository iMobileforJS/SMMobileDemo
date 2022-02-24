<h1 align="center">SuperMap Mobile Demo指南</h1>

<h3>一. 初始化Demo</h3>
<h4>1. 安装三方库</h4>

```
// 项目根目录执行以下命令
npm install

// 若某个三方库没有添加到Android工程中,则执行以下命令
react-native link xxx(三方库名字)
```
<h4>2. 下载imobile_for_reactnative aar包和示范数据 </h4>
因aar包和示范数据过大,从云盘下载后,放入指定位置

1. Navigation_EXAMPLE.zip 放入/SMMobileDemo/android/app/src/main/assets/中
2. imobile_for_reactnative.aar 放入/SMMobileDemo/node_modules/imobile_for_reactnative/android/libs/中

<h4>3. Android权限及许可配置 </h4>

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
// Android 6.0及其以上版本需要动态申请权限,在js中调用
PermissionsAndroid.requestMultiple([
  'android.permission.READ_PHONE_STATE',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
])
```

```xml
<application
  <!-- 适配Android Q以上版本,文件储存闻之 -->
  android:requestLegacyExternalStorage="true"
>
  <!-- 省略 -->
</application>

// AndroidManifest.xml 添加http
<uses-library android:name="org.apache.http.legacy" android:required="false" />
```

<h4>4. 运行Demo</h4>

1) 启动服务
```
// 项目根目录执行以下命令
react-native start
```
2) 安装Demo
使用Android Studio直接安装

</br>
<h3>二. 使用imobile_for_reactnative进行导航示例</h3>

```typescript
import React from 'react'
import { SMMapView, SMap, FileTools, WorkspaceType } from 'imobile_for_reactnative'

export default MapView extends React.Component {
  // ...

  _onGetInstance = () => {
    try {
      const home = await FileTools.appendingHomeDirectory()

      const exampleMapName = 'beijing'

      const path = `${home + ConstPath.ExternalData}/Navigation_EXAMPLE/${exampleMapName}.smwu`
      const mapPath = `${home + ConstPath.UserPath + DEFAULT_USER_NAME}/${ConstPath.RelativeFilePath.Map + exampleMapName}.xml`

      const data = {
        server: path,
        type: WorkspaceType.SMWU,
      }
      let result: string[] = []
      let defaultDataExist = await FileTools.fileIsExist(path)
      let mapFileExist = await FileTools.fileIsExist(mapPath)
      if (defaultDataExist && !mapFileExist) {
        // 导入地图数据
        result = await SMap.importWorkspaceInfo(data)
      }
      if (result) {
        // 打开地图
        let mapInfo = await this.props.openMap({
          name: 'beijing',
          path: mapPath,
        })
        // await SMap.openDatasource(ConstOnline.TrafficMap.DSParams, ConstOnline.TrafficMap.layerIndex, false)
        // 获取地图信息
        const mapInfo2 = await SMap.getMapInfo()
      }

      // 显示全副地图
      // SMap.viewEntire()
    } catch(e) {

    }
  }

  /** 路径分析 */
  analystRoat = async () => {
    try {
      //添加起点，添加终点 设置室外导航参数 进行室外路径分析
      await SMap.getStartPoint(startPoint.x, startPoint.y, false)
      await SMap.getEndPoint(endPoint.x, startPoint.y, false)
      await SMap.startNavigation(navParams[0])
      const result = await SMap.beginNavigation(
        startPoint.x,
        startPoint.y,
        doorPoint.x,
        doorPoint.y,
      )
    } catch(e) {

    }
  }

  /** 导航 */
  navigate = () => {
    try {
      // 导航类型 0:真实导航 1:模拟导航
      SMap.outdoorNavigation(1)
    } catch(e) {

    }
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

