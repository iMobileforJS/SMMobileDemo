/**
 * 地图导航界面
 * 结构：
 *   index：地图导航的入口文件
 *   NavigationAction ：导航采集界面的功能文件
 *   NavigationView：地图导航的界面结构和渲染
 *   styles：地图导航界面的样式
 *   component文件夹: 里面放地图导航界面的相关组件
 */
import React from 'react'
import MapView from "../mapView/MapView";
import { scaleSize, TouchAction, Toast, LicenseUtil } from "@/utils";
import { Props as HeaderProps } from "@/components/Header/Header";
import { TrafficView, MapSelectButton } from './components';
import { ConstPath, DEFAULT_USER_NAME, TouchMode } from '@/constants';
import { SMap, CustomTools, FileTools, WorkspaceType } from 'imobile_for_reactnative';
import { EmitterSubscription, View } from 'react-native';
import { MapViewProps } from '../mapView/types';
import { getLanguage } from '@/language';
import { ImageButton } from '@/components'
import { getAssets } from '@/assets'
import styles from './styles'
import { DEFAULT_DATA, DEFAULT_DATA_MAP, DEFAULT_DATA_WORKSPACE } from './config';
import NavigationAction from './NavigationAction';

type Props = {
  // getLayers: (params?: number | {type: number, currentLayerIndex: number}) => Promise<SMap.LayerInfo[]>,
}

type State = {
  currentFloorID: string,
  licenseViewIsShow: boolean,
  isFull: boolean,
}

export default class NavigationView extends MapView<Props, State> {

  trafficView: TrafficView | undefined | null
  floorHiddenListener: EmitterSubscription | undefined | null
  mapSelectButton: MapSelectButton | undefined | null
  currentFloorID = ''

  constructor(props: MapViewProps & Props) {
    super(props)
    this.state = {
      currentFloorID: '',
      licenseViewIsShow: false,
      isFull: true,
    }
  }

  getHeaderProps = (): HeaderProps => {
    return {
      title: '导航',
      navigation: this.props.navigation,
      headerTitleViewStyle: {
        textAlign: 'left',
      },
      headerStyle: {
        right:
          this.props.device.orientation.indexOf('LANDSCAPE') >= 0
            ? scaleSize(96)
            : 0,
      },
      backAction: () => {
        // this.backPositon = {
        //   x: event.nativeEvent.pageX,
        //   y: event.nativeEvent.pageY,
        // }
        return this.back()
      },
      type: 'fix',
      // headerCenter: () => (
      //   <PoiTopSearchBar
      //     device={this.props.device}
      //     // ref={ref => (GLOBAL.PoiTopSearchBar = ref)}
      //     // setMapNavigation={this.props.setMapNavigation}
      //     navigation={this.props.navigation}
      //   />
      // ),
      isResponseHeader: true,
    }
  }

  /**
   * 设置楼层id
   * @param {string} currentFloorID 楼层id
   * @param {*} cb 完成回调
   */
  changeFloorID = (currentFloorID: string, cb?: () => void) => {
    if (currentFloorID !== this.state.currentFloorID) {
      this.setState(
        {
          currentFloorID,
        },
        () => {
          cb && cb()
        },
      )
    }
  }

  setGestureDetectorListener = async () => {
    await SMap.setGestureDetector({
      singleTapHandler: this.touchCallback,
      longPressHandler: this.longtouchCallback,
      doubleTapHandler: this.doubleTouchCallback,
      magnPressHandler: this.magntouchCallback,
    })
  }

  backAction = async () => {
    await SMap.deleteGestureDetector()
    await SMap.removeAllCallout()
  }

  componentDidMount(): void {
    try {
      this.setGestureDetectorListener()
      SMap.setIsMagnifierEnabled(true)
      this.addFloorHiddenListener()
      SMap.setIndustryNavigationListener({
        callback: async () => {},
      })
      SMap.setStopNavigationListener({
        callback: () => {
          NavigationAction.clear(this)
        },
      })
      SMap.setCurrentFloorIDListener({
        callback: currentFloorID => {
          this.changeFloorID(currentFloorID)
        },
      })
      Toast.show('长按选择起点')
    } catch (error) {
      
    }
  }

  componentWillUnmount() {
    SMap.deleteGestureDetector()
    NavigationAction.stopGuide()
    NavigationAction.clear(this)
  }

  addMap = async () => {
    try {

      // 初始化导航采集数据
      // await this.initData(DEFAULT_DATA)

      const home = await FileTools.appendingHomeDirectory()

      const path = `${home + ConstPath.ExternalData}/${DEFAULT_DATA}/${DEFAULT_DATA_WORKSPACE}.smwu`
      const mapPath = `${home + ConstPath.UserPath + DEFAULT_USER_NAME}/${ConstPath.RelativeFilePath.Map + DEFAULT_DATA_MAP}.xml`
      this.changeMap(true, false, {name: DEFAULT_DATA_MAP,path: mapPath}, path)


      // SMap.getCurrentFloorID().then(currentFloorID => {
      //   this.changeFloorID(currentFloorID)
      // })
      // 初始化导航语音
      SMap.initSpeakPlugin()
    } catch (error) {
      
    }
  }
  getModueId = () => {
    // 导航采集的模块ID
    return 0x20
  }

  magntouchCallback = async (event: { LLPoint: Point }) => {
    switch (TouchAction.getTouchMode()) {
      case TouchMode.NORMAL:
      case TouchMode.MAP_SELECT_START_POINT:
        await SMap.getStartPoint(event.LLPoint.x, event.LLPoint.y, false)
        TouchAction.setTouchStartPoint({
          x: event.LLPoint.x,
          y: event.LLPoint.y,
        })
        this.mapSelectButton?.setVisible(true, {
          button: getLanguage().Navigation.SET_AS_START_POINT,
        })
        TouchAction.setTouchMode(TouchMode.MAP_SELECT_START_POINT)
        //全幅
        this.showFullMap(true)
        break
      case TouchMode.MAP_SELECT_END_POINT:
        await SMap.getEndPoint(event.LLPoint.x, event.LLPoint.y, false)
        this.mapSelectButton?.setVisible(true, {
          button: getLanguage().Navigation.SET_AS_DESTINATION,
        })
        TouchAction.setTouchEndPoint({
          x: event.LLPoint.x,
          y: event.LLPoint.y,
        })
        break
    }
  }

  navigateAble = () => {
    const startPoint = TouchAction.getTouchStartPoint()
    const endPoint = TouchAction.getTouchEndPoint()
    if (!startPoint) {
      Toast.show('请选择起点')
      return false
    }
    if (!endPoint) {
      Toast.show('请选择终点')
      return false
    }
    if (!this.mapSelectButton?.navigationResult) {
      Toast.show('请分析路线')
      return false
    }
    return true
  }
  
  /** 添加楼层显隐监听 */
  addFloorHiddenListener = () => {
    this.floorHiddenListener = SMap.addFloorHiddenListener(async result => {
      //在选点过程中/路径分析界面 不允许拖放改变FloorList、MapController的状态
      // 使用this.currentFloorID 使ID发生变化时只渲染一次
      if (result.currentFloorID !== this.currentFloorID) {
        this.currentFloorID = result.currentFloorID
        let guideInfo = await SMap.isGuiding()
        if (!guideInfo.isOutdoorGuiding) {
          this.setState({
            currentFloorID: result.currentFloorID,
          })
        } else {
          this.currentFloorID = this.state.currentFloorID
        }
      }
    })
  }

  showFullMapAction = (full: boolean) => {
    try {
      this.trafficView?.setVisible(full)
      this.setState({isFull: full})
    } catch (error) {
      console.warn('地图浏览全屏拓展方法出错')
    }
  }

  renderCustomView = () => {
    return (
      <>
        {this._renderTrafficView()}
        {this._renderMapSelectButton()}
        {this.state.isFull && this._renderButtons()}
      </>
    )
  }

  /** 实时路况 */
  _renderTrafficView = () => {
    return (
      <TrafficView
        ref={ref => (this.trafficView = ref)}
        currentFloorID={this.state.currentFloorID}
        getLayers={this._getLayers}
        device={this.props.device}
        incrementRoad={() => {
          this.showFullMap(true)
          TouchAction.setTouchMode(TouchMode.NULL)//进入路网，触摸事件设置为空
        }}
        mapLoaded={true}
        setLoading={this.setLoading}
      />
    )
  }

  _renderMapSelectButton = () => {
    return (
      <MapSelectButton
        ref={ref => (this.mapSelectButton = ref)}
        setLoading={this.setLoading}
        floorID={this.state.currentFloorID}
      />
    )
  }

  _renderButtons = () => {
    return (
      <View style={styles.buttons}>
        <ImageButton
          image={getAssets().navigation.icon_navigation}
          title={'真实'}
          onPress={async () => {
            await NavigationAction.actual(this)
          }}
        />
        <ImageButton
          image={getAssets().navigation.dataset_type_else_black}
          title={'模拟'}
          onPress={async () => {
            await NavigationAction.simulate(this)
          }}
        />
        <ImageButton
          image={getAssets().mapTools.icon_delete}
          title={'清除'}
          onPress={async () => {
            await NavigationAction.clearCallout(this)
          }}
        />
        <ImageButton
          image={getAssets().mapTools.icon_location}
          title={'中心点'}
          onPress={async () => {
            await NavigationAction.centerPoint()
          }}
        />
      </View>
    )
  }
}