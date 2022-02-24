/*global GLOBAL*/
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './src/redux'
import {
  StyleSheet,
  PermissionsAndroid,
  Platform,
  NativeModules,
  View,
  Button,
} from 'react-native';
import { SMap, AppInfo, FileTools, SLocation } from 'imobile_for_reactnative'
import Root from '@/Root'
import { ConstPath, DEFAULT_USER_NAME, DEFAULT_LANGUAGE } from '@/constants'
import Orientation from 'react-native-orientation'
import { setShow } from '@/redux/reducers/device'
import { Toast } from '@/utils';
import { Dialog } from '@/components';
import Loading from '@/components/Container/Loading';
let AppUtils = NativeModules.AppUtils

interface Props {
  device: Device,
  setShow: (params: {orientation: string}) => Promise<void>,
}

interface State {
  isInit: INIT_STATUS,
}

type INIT_STATUS = 'permission' | 'init' | 'done'

class AppRoot extends React.Component<Props, State> {
  dialog: Dialog | null | undefined
  Loading: Loading | null | undefined
  constructor(props: Props) {
    super(props)
    this.state = {
      isInit: 'permission',
    }
  }

  async componentDidMount() {
    try {
      if (Platform.OS === 'android') {
        this.requestPermission()
      } else {
        await this.init()
      }
    } catch (error) {
      console.warn('componentDidMount error')
    }
  }

  /**
   * Android申请权限
   */
  requestPermission = async () => {
    try {
      this.Loading?.setLoading(true, '权限申请中')
      const results: any = await PermissionsAndroid.requestMultiple([
        'android.permission.READ_PHONE_STATE',
        // 'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        // 'android.permission.CAMERA',
        // 'android.permission.RECORD_AUDIO',
      ])
      let isAllGranted = true
      for (let key in results) {
        isAllGranted = results[key] === 'granted' && isAllGranted
      }
      this.Loading?.setLoading(false)
      //申请 android 11 读写权限
      let permisson11 = await AppUtils.requestStoragePermissionR()
      console.warn(isAllGranted, permisson11)
      if (isAllGranted && permisson11) {
        await this.init()
      } else {
        // this.dialog?.setDialogVisible(true)
        this.requestPermission()
      }
    } catch (error) {
      this.Loading?.setLoading(false)
      console.warn('requestPermission error: ' + error)
    }
  }

  /**
   * App初始化
   */
  init = async () => {
    try {
      this.Loading?.setLoading(true, '初始化中')
      this.initOrientation()
      await SMap.setPermisson(true) // 权限申请
      await this.initEnvironment() // 初始化环境
      await SMap.initMapView() // 初始化唯一地图组件
      await SMap.setCurrentModule(255) // 设置模块权限
      await this.initLocation() // 打开GPS
      await this.openWorkspace() // 打开工作空间

      let result = await SMap.applyTrialLicense()
      if (!result) {
        await SMap.activateLicense('5DC4B-F3774-304B4-E93DA-D2F00') // 许可激活码 xxxxx-xxxxx-xxxxx-xxxxx-xxxxx
      }
      if (Platform.OS === 'android') {
        // 初始化数据,数据保存在SMMobileDemo/android/app/src/main/assets
        const toPath = await FileTools.appendingHomeDirectory(ConstPath.ExternalData + '/')
        await AppUtils.copyAssetFileToSDcard('Navigation_EXAMPLE.zip', toPath)

        this.setState({
          isInit: 'done',
        }, () => {
          this.Loading?.setLoading(false)
        })
      } else {
        this.Loading?.setLoading(false)
      }
      Toast.show(result ? '激活成功' : '激活失败')
    } catch (error) {
      this.Loading?.setLoading(false)
      console.warn('init error')
    }
  }

  /**
   * 初始化环境
   */
  initEnvironment = async () => {
    try {
      await SMap.initEnvironment(ConstPath.AppPath) // 初始化环境
      await AppInfo.setRootPath('/' + ConstPath.AppPath.replace(/\//g, '')) // 设置根目录名
      await AppInfo.setUserName(DEFAULT_USER_NAME) // 初始化用户
      await FileTools.initUserDefaultData(DEFAULT_USER_NAME) // 初始化文件目录
    } catch (error) {
      console.warn('initEnvironment error')
    }
  }

  /**
   * 打开GPS
   */
  initLocation = async () => {
    try {
      await SLocation.openGPS()
    } catch (error) {
      console.warn('initLocation error')
    }
  }

  //初始化横竖屏显示方式
  initOrientation = async () => {
    if (Platform.OS === 'ios') {
      Orientation.getSpecificOrientation((e: any, orientation: string) => {
        this.props.setShow({ orientation: orientation })
      })
      Orientation.removeSpecificOrientationListener(this.orientation)
      Orientation.addSpecificOrientationListener(this.orientation)
    } else {
      Orientation.getOrientation((e: any, orientation: string) => {
        this.props.setShow({ orientation: orientation })
      })
      Orientation.removeOrientationListener(this.orientation)
      Orientation.addOrientationListener(this.orientation)
    }
  }

  orientation = (o: string) => {
    // iOS横屏时为LANDSCAPE-LEFT 或 LANDSCAPE-RIGHT，此时平放，o为LANDSCAPE，此时不做处理
    this.props.setShow({
      orientation: o,
    })
  }

  /**
   * 打开工作空间
   */
  openWorkspace = async () => {
    try {
      let wsPath = ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace[DEFAULT_LANGUAGE], path = await FileTools.getHomeDirectory() + wsPath

      if (await FileTools.fileIsExist(path)) {
        const result = await SMap.openWorkspace({ server: path })
      }

    } catch(e) {
      console.warn('openWorkspace error')
    }
  }

  getDevice = (): Device => {
    return this.props.device
  }

  renderInitView = () => {
    return (
      <View style={{paddingVertical: 30}}>
        <Button title={this.state.isInit === 'permission' ? '申请权限' : '激活'} onPress={this.requestPermission}/>
      </View>
    )
  }

  render() {
    return (
      <>
        {
          this.state.isInit === 'done' ? <Root /> : this.renderInitView()
        }
        <Loading ref={ref => this.Loading = ref} initLoading={false} />
        {/* <Dialog
          ref={ref => this.dialog = ref}
          title={'111111'}
          confirmAction={this.requestPermission}
        >

        </Dialog> */}
      </>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    device: state.device.toJS().device,
  }
}

const AppRootWithRedux = connect(mapStateToProps, {
  setShow,
})(AppRoot)

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <AppRootWithRedux />
      </PersistGate>
    </Provider>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
