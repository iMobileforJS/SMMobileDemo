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
import { SData, AppInfo, FileTools, SLocation } from 'imobile_for_reactnative'
import Root from '@/Root'
import { ConstPath, DEFAULT_USER_NAME } from '@/constants'
import Orientation from 'react-native-orientation'
import { setShow } from '@/redux/reducers/device'
import { Dialog, SimpleDialog } from '@/components';
import Loading from '@/components/Container/Loading';
import { DialogUtil, LicenseUtil, Toast } from '@/utils';
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
  Loading: Loading | null | undefined
  constructor(props: Props) {
    super(props)
    this.state = {
      isInit: Platform.OS === 'ios' ? 'done' : 'permission',
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
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO',
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
        // 申请权限后，调用SData.setPermission(true)
        // 注: 调用SData.setPermission，只需要读写权限，android11以上使用AppUtils.requestStoragePermissionR()
        await SData.setPermission(true)
        await this.init()
      } else {
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
      // Platform.OS === 'android' && await SData.setPermisson(true) // 权限申请
      await this.initEnvironment() // 初始化环境
      SData.setModuleListener(this.onInvalidModule)
      SData.setLicenseListener(this.onInvalidLicense)
      // await SData.initMapView() // 初始化唯一地图组件
      await this.initLocation() // 打开GPS
      await this.openWorkspace() // 打开工作空间

      // 重新加载已经激活的离线许可
      LicenseUtil.reloadLocalLicense() 

      this.setState({
        isInit: 'done',
      }, () => {
        this.Loading?.setLoading(false)
      })
    } catch (error) {
      this.Loading?.setLoading(false)
      console.warn('init error')
    }
  }

  onInvalidModule = () => {
    Toast.show('当前模块许可无效，不能进行此操作。')
  }

  onInvalidLicense = () => {
    Toast.show('许可无效，不能进行此操作。')
  }

  /**
   * 初始化环境
   */
  initEnvironment = async () => {
    try {
      await AppInfo.setRootPath('/' + ConstPath.AppPath.replace(/\//g, '')) // 设置根目录名
      await AppInfo.setUserName(DEFAULT_USER_NAME) // 初始化用户
      await AppInfo.initUserEnvironment(DEFAULT_USER_NAME) // 初始化文件目录
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
      const home = await FileTools.appendingHomeDirectory()
      const result = await SData.initUserWorkspace()

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
        <SimpleDialog ref={ref => ref && DialogUtil.setDialog(ref)}/>
        <Loading ref={ref => this.Loading = ref} initLoading={false} />
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
