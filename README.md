<h1 align="center">SuperMap iMobile for RN 示范工程部署指南</h1>

### 一. 初始化Demo
#### 1. 下载
```
git clone https://github.com/iMobileforJS/SMMobileDemo.git
```
#### 2. 初始化项目

```
// 项目根目录执行以下命令
// react-native使用最新版本,可能会和其他三方库版本不匹配导致npm install失败,推荐使用yarn install
yarn install

// for iOS
npm install -g npx (已安装npx可跳过)
// pod install时间可能比较久,或因超时失败,可多次尝试
npx pod-install ios
// 或到SMMobileDemo/ios目录中运行
pod install

// 若某个三方库没有添加到Android工程中,则执行以下命令(可跳过)
react-native link xxx(三方库名字)
```

#### 3. 下载imobile_for_reactnative相关包和示范数据

因aar包和示范数据过大,从云盘下载后,放入指定位置

地址: <a herf="https://pan.baidu.com/s/1V9S3j6eL0-qvyVYrZHCTYw">https://pan.baidu.com/s/1V9S3j6eL0-qvyVYrZHCTYw</a>

提取码: 6xzc

<b>for Android:</b>
1. Navigation_EXAMPLE.zip 和 Map_EXAMPLE.zip 放入/SMMobileDemo/android/app/src/main/assets/中
2. 下载imobile_for_reactnative.aar 和 mediapipe_hand_tracking.aar 放入/SMMobileDemo/node_modules/imobile_for_reactnative/android/libs/中(libs目录需用户创建）

<b>for iOS:</b>
1. Navigation_EXAMPLE.zip, Map_EXAMPLE.zip, SuperMap.bundle 解压后放入/SMMobileDemo/ios/assets/中
2. iPhoneOS.sdk 解压后放入/SMMobileDemo/ios/

#### 4. 项目配置

<b>for Android:</b>

Android权限及许可配置
```xml
// AndroidManifest.xml 添加许可(可根据实际使用功能,增删许可)
// 注：文件读取权限、手机状态权限、网络权限为必须（以下4项）
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.INTERNET" />

<uses-permission android:name="android.permission.REORDER_TASKS" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.KILL_BACKGROUND_PROCESSES" />
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

<b>for iOS:</b>
```objc
// AppDelegate.m
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  [[RCTBundleURLProvider sharedSettings] setJsLocation:@"xxx.xxx.xxx.xxx"]; // 本地IP,用于Debug调试
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
```

#### 5. 运行Demo

1) 启动服务
```
// 项目根目录执行以下命令
react-native start
```
2) 安装Demo

<b>注：Android版本请使用Android Studio 4.2及以上版本</b>

<1>使用Android Studio直接安装

<2>安装过程中若出现报错Execution failed for task ':app:validateSigningDebug'.
可在工程目录下命令行执行以下命令
keytool -genkey -v -keystore debug.keystore -alias androiddebugkey -keyalg RSA -validity 10000；

密码在app/build/build.gradle中keyPassword;

```
signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
    }
}
```

<3>命令执行后在工程目录中生成文件debug.keystore，将该文件拷贝到工程/android/app下，再次运行即可

<4>运行后未正常申请权限，退出app重启即可
</br>

### 二. MapView 地图公共类简介
MapView 搭建了地图显示页面的公共的一些方法
#### 1. 子类必须要实现的方法
1. getModueId：获取模块ID 由子类实现 返回一个数字类型
> 地图浏览：0x10
> 导航采集：0x20

2. getHeaderProps：页面头的信息

#### 2. 子类可选择实现（重写）的继承方法
2. **renderCustomView**：可以放子类独有的页面显示，子类一般都会重写这个方法
3. backAction：子类返回时，可以放特有的一些处理
4. addMap：子类在打开地图时需要进行的操作
（注：模块有数据的话，要在子类的此方法里打开地图之前，调用initData方法初始化模块数据）
5. showFullMapAction：显示全屏继承方法,在子类中拓展showFullMap
6. setGestureDetectorListener：手势监听
7. longtouchCallback：长按监听，需要看setGestureDetectorListener里是否监听了此手势
8. doubleTouchCallback： 双击监听，需要看setGestureDetectorListener里是否监听了此手势

#### 3. 子类可直接调用的继承方法
1. initData： 初始化模块数据（模块数据在子类里，打开地图之前调用，确保有地图数据可以打开）
```ts
/**
 * 初始化模块数据 在addMap里的最前面调用
 * @param name 数据所在文件夹的名字
 * @returns
 */
initData = async (name: string): Promise<void>
```
2. openWorkspace：打开工作空间
3. changeMap： 切换或打开地图
```ts
 /**
 * 切换地图或者是打开地图
 * @param {boolean} isMap 是否是离线地图
 * @param {boolean} isChange 是否是切换地图 true表示切换地图 false表示仅仅打开地图
 * @param {itemType | Array<itemType02>} item 地图参数
 * @param {string} dataPath 可选参数，有默认值，当为离线地图时，需要传数据所在工作空间的路径，为在线地图时，可不传
 * @returns 
 */
changeMap = async (isMap: boolean, isChange: boolean, item: itemType | Array<itemType02>, dataPath: string = '')
```
4. _openDatasource：打开数据源
```ts
/**
 * 打开数据源
 * @param {itemType02} wsData 数据源部分
 * @param {number} index 添加到地图的数据集序号
 * @param {boolean} toHead 是否添加到图层顶部
 */
_openDatasource = async (wsData: itemType02, index = -1, toHead = true)
```
5. _openMap：打开地图
```ts
/**
 * 打开地图
 * @param {MapInfo} params 地图的参数
 * @returns 
 */
_openMap = async (params: MapInfo)
```
6. _closeMap：关闭地图
7. _getLayers： 获取图层列表
```ts
/**
 * 获取图层列表
 * @param {number | {type: number, currentLayerIndex: number}} params  图层参数
 * @param cb 回调函数
 * @returns 
 */
_getLayers = async (params?: number | {type: number, currentLayerIndex: number}, cb = (layers: Array<SMap.LayerInfo>) => {}):Promise<SMap.LayerInfo[] | null> 
```
8. _setCurrentLayer： 设为当前图层
```ts
/**
 * 设置为当前图层
 * @param {SMap.LayerInfo} params 图层参数
 */
_setCurrentLayer = async (params: SMap.LayerInfo)
```
9. setLoading：数据加载动画
```ts
/**
 * 设置Container的loading
 * @param loading 是否显示动画，true显示，false不显示
 * @param info 显示动画时的文字信息
 * @param extra 其他
 */
setLoading = (loading = false, info?: string, extra?: Extra)
```

#### 4. 其他方法
1. renderMapController： 地图放大缩小和定位的控件渲染方法

#### 5. 子类继承方式
形式如下所示
```tsx
class NavigationView extends MapView<Props, State>{
  // ...
  getModueId = () => {}
  getHeaderProps = () => {}
  // ...
}
```

### 三. 导航示例简介
#### 1.导航采集文件夹目录结构
导航采集文件夹路径为 “SMMOBILEDEMO/src/containers/navigationModel"

navigationModel文件夹下的目录结构如下；
> index.ts ：导航采集界面的入口文件
>  NavigationAction.ts ：导航采集界面的功能文件
>  NavigationView.tsx ： 导航采集的界面结构渲染文件
> styles.ts ： 导航采集界面结构的样式文件
> config.ts ：导航采集模块的数据配置文件
> components：导航采集相关组件的文件夹

components文件夹下的主要文件：（navigationModel/components）
>> MapSelectButton.tsx ：选择起点或终点以及路径分析的按钮组件
>> TrafficView.tsx ：实时路况的组件

#### 2.导航数据
注：如果需要替换自有数据，可以在项目工程里导航采集模块的“config.ts”,替换数据名、工作空间、以及地图名。
文件路径：SMMOBILEDEMO/src/containers/navigationModel/config.ts
如下格式：
``` ts
/** 默认导航示范地图包名 */
const DEFAULT_DATA = 'Navigation_EXAMPLE'
/** 默认导航示范地图工作空间名 */
const DEFAULT_DATA_WORKSPACE = 'beijing'
/** 默认导航示范地图名 */
const DEFAULT_DATA_MAP = 'beijing'

export {
    DEFAULT_DATA,
    DEFAULT_DATA_WORKSPACE,
    DEFAULT_DATA_MAP,
}
```

#### 3. 导航采集主要文件简介
1. NavigationView.tsx
导航采集的界面结构渲染文件，是导航采集页面的主体部分，样式由styles.ts文件提供，功能由NavigationAction.ts提供，渲染的组件导出到index.ts里
2. NavigationAction.ts
导航采集界面的功能文件，包含的功能如下所示：
```ts
// 停止导航
async function stopGuide(): Promise<void>

/**
 * 清除
 * @param {NavigationView} that NavigationView组件实例的一个句柄 
 */
async function clear(that: NavigationView): Promise<void>

/**
 * 真实导航
 * @param {NavigationView} that NavigationView组件实例的一个句柄
 */
async function actual(that: NavigationView):Promise<void>

/**
 * 模拟导航
 * @param {NavigationView} that NavigationView组件实例的一个句柄
 */
async function simulate(that: NavigationView):Promise<void>

/**
 * 清理地图上的标注
 * @param {NavigationView} that NavigationView组件实例的一个句柄
 */
async function clearCallout(that: NavigationView):Promise<void>

// 中心点
async function centerPoint(): Promise<void>

```
3. MapSelectButton.tsx
选择起点或终点以及路径分析的按钮组件，路径分析功能的实现在此文件的 **analys** 方法里
4. TrafficView.tsx
实时路况的组件，实时路况的切换功能实现在此文件的 **trafficChange** 方法里

#### 3. 其他
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


### 四. 地图浏览示例简介
#### 1. mapBrowsingmodel的目录结构
地图浏览文件夹路径为 “SMMOBILEDEMO/src/containers/mapBrowsingmodel”

mapBrowsingmodel文件夹下的目录结构如下；
> index.ts ：地图浏览界面的入口文件
> mapBrowsingAction.ts ：地图浏览界面的功能文件
> MapBrowsingView.tsx ： 地图浏览的界面结构渲染文件
> config.ts ：地图浏览模块的数据配置文件
> styles.ts ： 地图浏览界面结构的样式文件

#### 2. 地图浏览模块各文件的简介
1.  index.ts
是将地图浏览界面组件导出的文件，这个组件若要在其他地方导入，导入的路径就是这个index.ts文件的路径。
2. mapBrowsingAction.ts
是地图浏览的功能文件，包含了所有地图浏览模块的功能,包含功能如下所示：

```TypeScript
// 全幅
export function fullScreen(): void

// 打开湖南地图
export async function openHunanMap(that: MapBrowsingView): Promise<void>

// 打开成都地图
export async function openChenduMap(that: MapBrowsingView): Promise<void>

// 打开天地图
export function openTiandituMap(that: MapBrowsingView, isChange: boolean): void

// 打开BingMap地图
export function openBingMap(that: MapBrowsingView): void
```

若要在其他文件使用这个模块儿的方法，本例采用的方法是将导出路径填写为此文件的路径，然后将要使用的方法从里面解析出来，在需要调用的地方直接调用即可（本例使用文件为与该文件同一目录下的MapBrowsingView.tsx文件）

```tsx
// MapBrowsingView.tsx文件
// 导入
import { openHunanMap, openChenduMap, openTiandituMap, openBingMap, fullScreen } from './mapBrowsingAction'
// ...
// 使用
openHunanMap(this)
// ...
```
3. MapBrowsingView.tsx
地图浏览的界面结构渲染文件，是地图浏览组件的主体部分，其内组件样式由styles.ts提供，功能由mapBrowsingAction.ts提供，此文件渲染的组件导出给index.ts

```TypeScript
export default class MapBrowsingView extends MapView<Props, State>
```
MapBrowsingView继承自MapView，需要实现MapView内的一些方法，也可以使用MapView内的一些方法
4. confid.ts 
地图浏览模块的数据配置文件，现有一些路径数据配置在里面

5. styles.ts
地图浏览界面结构的样式文件，主要作用就是给MapBrowsingView.tsx文件内的各组件提供样式的文件，本例使用方式如下所示：
```tsx
// MapBrowsingView.tsx文件
// 导入
import styles from './styles'
// ...
// 使用
<View style={styles.rightBottomButtons}></View>
// ...
```


### 五. 许可模块简介
许可模块由两部分组成，一是许可的工具类，二是许可申请的界面。
#### 1. 许可的工具类
LicenseUtil.ts 许可相关功能的文件, 文件路径是“SMMOBILEDEMO/src/utils/LicenseUtil.ts”
包含功能如下所示：

```ts
/**
 * 获取当前许可的类型
 * @returns 三种返回值 , null 表示当前没有有效许可， cloud 表示当前许可为云许可， offline 表示当前许可为离线许可
 */
function getLicenseType (): string | null


/**
 * 激活离线许可
 * @param {string} code 离线许可激活码（形式： xxxxx-xxxxx-xxxxx-xxxxx-xxxxx）
 * @returns {Promise<boolean>} 返回一个布尔类型，true表示激活成功，false表示激活失败
 */
async function activateLicense(code: string): Promise<boolean>

/**
 * 重新加载已激活的离线许可 （在激活离线许可后，退出app，再次进入app需要调这个方法来重新加载已激活的离线许可）
 * @returns
 */
async function reloadLocalLicense(): Promise<void>

/**
 * 登录云许可 （登录云许可 --> 查询云许可 --> 激活云许可）
 * @param {string} user 云许可账号
 * @param {string} pwd 云许可账号对应的密码
 * @returns {Promise<boolean>} 返回一个布尔类型，true表示激活成功，false表示激活失败
 */
async function loginCloudLicense(user: string, pwd: string): Promise<boolean>

/**
 * 查询许可（登录云许可 --> 查询云许可 --> 激活云许可）
 * @returns 返回查询到的许可信息
 */
async function queryCloudLicense(): Promise<licenseResultType | null | undefined>


/**
 * 激活云许可（登录云许可 --> 查询云许可 --> 激活云许可）
 * @returns 返回一个布尔值，可用于判断云许可是否激活成功
 */
async function applyCloudTrialLicense(): Promise<boolean>

// 归还许可
async function recycleLicense(): Promise<void>

// 登出云许可
async function logoutCloudLicense(): Promise<void>

```
其他文件使用此文件内的方法，本例使用的位置之一是License组件（SMMOBILEDEMO/src/components/License/License.tsx）
```tsx
import { LicenseUtil } from '@/utils';
// ...
// 使用
await LicenseUtil.activateLicense('离线许可序列码')
// ...
```
云许可使用流程提示：
>登录云许可 --> 查询云许可 --> 激活云许可 --> 归还云许可 --> 登出云许可

离线许可使用流程提示：
>  激活离线许可 --> 归还离线许可

#### 2. 许可申请的界面
License文件夹的路径是：SMMOBILEDEMO/src/components/License
1. License文件目录结构
> index.ts 许可申请面板的入口文件
> License.tsx 许可申请面板的渲染文件
> styles.ts 许可申请面板的样式文件

2. 许可申请面板的使用简介
本例使用位置之一Home01.tsx文件（SMMOBILEDEMO/src/containers/Home01.tsx）
License组件的close是必须要传的参数，参数类型是一个函数
```tsx
// Home01.tsx
// 引入
import License from "@/components/License"
// ...
// 使用
<License
  close = {() => {
    // ...
  }}
>
</License>
//...

```

