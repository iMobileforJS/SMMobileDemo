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
import { scaleSize, TouchAction, Toast } from "@/utils";
import { Props as HeaderProps } from "@/components/Header/Header";
import { TrafficView, MapSelectButton } from './components';
import { ConstPath, DEFAULT_USER_NAME, TouchMode } from '@/constants';
import { SMap, FileTools, SNavigation } from 'imobile_for_reactnative';
import {  View } from 'react-native';
import { MapViewProps } from '../mapView/types';
import { getLanguage } from '@/language';
import { ImageButton } from '@/components'
import { getAssets } from '@/assets'
import styles from './styles'
import { DEFAULT_DATA, DEFAULT_DATA_MAP, DEFAULT_DATA_WORKSPACE } from './config';
import NavigationAction from './NavigationAction';
import { Point2D } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData';

type Props = {
}

type State = {
  currentFloorID: number,
  licenseViewIsShow: boolean,
  isFull: boolean,
}

export default class NavigationView extends MapView<Props, State> {

  trafficView: TrafficView | undefined | null
  mapSelectButton: MapSelectButton | undefined | null
  currentFloorID: number = 0
  navigationResult: boolean = false

  constructor(props: MapViewProps & Props) {
    super(props)
    this.state = {
      currentFloorID: 0,
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

  setGestureDetectorListener = async () => {
    await SMap.setGestureDetector({
      singleTapHandler: this.touchCallback,
      longPressHandler: this.longtouchCallback,
      doubleTapHandler: this.doubleTouchCallback,
      magnPressHandler: this.magntouchCallback,
    })
  }

  backAction = async () => {
    await SMap.setGestureDetector()
    await SMap.removeAllCallouts()
  }

  componentDidMount(): void {
    try {
      this.setGestureDetectorListener()
      SMap.setIsMagnifierEnabled(true)
      // this.addFloorHiddenListener()
      
      // 二维地图导航监听
      SNavigation.setNaviListener({
        /** 导航开始回调 */
        onStartNavi: () => {
        },
        /** 导航结束回调 */
        onStopNavi:() => {
          NavigationAction.clear(this)
        },
        /** 导航抵达终点回调 */
        onArrivedDestination:() => {
        },
      })
    } catch (error) {
      
    }
  }

  componentWillUnmount() {
    SMap.setGestureDetector()
    NavigationAction.stopGuide()
    NavigationAction.clear(this)
  }

  /** 添加地图,初始化数据 */
  addMap = async () => {
    try {
      const home = await FileTools.appendingHomeDirectory()

      const path = `${home + ConstPath.ExternalData}/${DEFAULT_DATA}/${DEFAULT_DATA_WORKSPACE}.smwu`
      const mapPath = `${home + ConstPath.UserPath + DEFAULT_USER_NAME}/${ConstPath.RelativeFilePath.Map + DEFAULT_DATA_MAP}.xml`
      await this.changeMap(true, false, {name: DEFAULT_DATA_MAP,path: mapPath}, path)

      const datasourceName = 'beijing02'
      const datasetName = 'RoadNetwork'
      const modelName = 'netModel_3'

      const homePath = await FileTools.getHomeDirectory()
      const modelPath = `${homePath}/SMMobileDemo/User/Customer/Data/Datasource/${modelName}.snm`

      // 1. 设置室外导航数据和模型数据
      await SNavigation.setRouteAnalyzeData({
        networkDataset: {
          datasourceAlias: datasourceName,
          datasetName:  datasetName
        },
        modelPath: modelPath
      })
      Toast.show(getLanguage().Navigation.LONG_PRESS_ADD_START)

    } catch (error) {
      
    }
  }
  getModueId = () => {
    // 导航采集的模块ID
    return 0x20
  }

  /** 长按地图(含放大镜)选点事件回调 */
  magntouchCallback = async (event: {
    mapPoint: Point2D;
    screenPoint: Point2D;
    LLPoint: Point2D;
}) => {
    switch (TouchAction.getTouchMode()) {
      case TouchMode.NORMAL:
      case TouchMode.MAP_SELECT_START_POINT:
        SMap.removeCallout('startPoint')
        // 使用地图坐标设置起点callout
        await SMap.addCallout('startPoint', {
          x: event.mapPoint.x,
          y: event.mapPoint.y,
        }, {
          type: 'image',
          /** 内置的图片资源路径 */
          resource: 'start_point',
        })
        // 保存起点经纬度,用于导航
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
        SMap.removeCallout('endPoint')
        // 使用地图坐标设置终点callout
        await SMap.addCallout('endPoint', {
          x: event.mapPoint.x,
          y: event.mapPoint.y,
        }, {
          type: 'image',
          /** 内置的图片资源路径 */
          resource: 'destination_point',
        })
        this.mapSelectButton?.setVisible(true, {
          button: getLanguage().Navigation.SET_AS_DESTINATION,
        })
        // 保存终点经纬度,用于导航
        TouchAction.setTouchEndPoint({
          x: event.LLPoint.x,
          y: event.LLPoint.y,
        })
        break
    }
  }

  /** 判断是否可以路径分析 */
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
    if (!this.navigationResult) {
      Toast.show('请分析路线')
      return false
    }
    return true
  }

  /** 路径分析 */
  analyst = async () => {
    try {
      const startPoint = TouchAction.getTouchStartPoint()
      const endPoint = TouchAction.getTouchEndPoint()
      if (!startPoint || !endPoint) return
      this.setLoading(true)
      // 2. 设置室外导航起始点
      await SNavigation.setRouteAnalyzePoints({
        startPoint: {x: startPoint.x, y: startPoint.y},
        destinationPoint: {x: endPoint.x, y: endPoint.y}
      })
      // 3. 室外路线分析
      const rel = await SNavigation.routeAnalyst()
      this.setLoading(false)
      if (!rel) {
        this.setLoading(false)
        Toast.show(
          getLanguage().Navigation.PATH_ANALYSIS_FAILED,
        )
        return
      }
      // 路径分析成功标识,之后可以进行模拟/真实导航
      this.navigationResult = true
    } catch (e) {
      this.setLoading(false)
      Toast.show(
        getLanguage().Navigation.PATH_ANALYSIS_FAILED,
      )
      // 清除室内外数据
      SNavigation.clearPath()
      // 清除起始点标记
      SMap.removeCallout('startPoint')
      SMap.removeCallout('endPoint')
    }
    // 分析结束,重置TouchMode,使可点击屏幕开启/退出全屏模式
    TouchAction.setTouchMode(TouchMode.NORMAL)
    this.mapSelectButton?.setVisible(false)
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
        analyst={this.analyst}
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
        {/* <ImageButton
          image={getAssets().mapTools.icon_location}
          title={'中心点'}
          onPress={async () => {
            await NavigationAction.centerPoint()
          }}
        /> */}
      </View>
    )
  }
}