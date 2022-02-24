/**
 * 地图导航界面
 */
import React from 'react'
import MapView from "../mapView/MapView";
import { scaleSize, TouchAction } from "@/utils";
import { Props as HeaderProps } from "@/components/Header/Header";
import { TrafficView, MapSelectButton } from './components';
import { TouchMode } from '@/constants';
import { SMap } from 'imobile_for_reactnative';
import { EmitterSubscription, View } from 'react-native';
import { MapViewProps } from '../mapView/types';
import { getLanguage } from '@/language';
import { ImageButton } from '@/components'
import { getAssets } from '@/assets'
import styles from './styles'

type Props = {
  getLayers: (params?: number | {type: number, currentLayerIndex: number}) => Promise<SMap.LayerInfo[]>,
}

type State = {
  // currentFloorID: string,
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
      backAction: event => {
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
        // callback: this._changeRouteCancel,
        callback: () => {},
      })
      SMap.setCurrentFloorIDListener({
        callback: currentFloorID => {
          this.changeFloorID(currentFloorID)
        },
      })
    } catch (error) {
      
    }
  }

  componentWillUnmount() {
    // await SMap.closeWorkspace()
  }

  addMap = async () => {
    try {
      SMap.getCurrentFloorID().then(currentFloorID => {
        this.changeFloorID(currentFloorID)
      })
      SMap.initSpeakPlugin()
    } catch (error) {
      
    }
  }

  magntouchCallback = async (event: { LLPoint: Point }) => {
    switch (TouchAction.getTouchMode()) {
      case TouchMode.NORMAL:
        await SMap.getStartPoint(event.LLPoint.x, event.LLPoint.y, false)
        TouchAction.setTouchStartPoint({
          x: event.LLPoint.x,
          y: event.LLPoint.y,
        })
        //显示选点界面的顶部 底部组件
        // GLOBAL.MAPSELECTPOINT.setVisible(true)
        // GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
        //   button: getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_START_POINT,
        // })
        this.mapSelectButton?.setVisible(true, {
          button: getLanguage().Navigation.SET_AS_START_POINT,
        })
        //全幅
        this.showFullMap()
        //导航选点 全屏时保留mapController
        // GLOBAL.mapController && GLOBAL.mapController.setVisible(true)
        // this.props.setMapNavigation({
        //   isShow: true,
        //   name: '',
        // })
        break
      case TouchMode.NAVIGATION_TOUCH_END:
        await SMap.getEndPoint(event.LLPoint.x, event.LLPoint.y, false)
        this.mapSelectButton?.setVisible(true, {
          button: getLanguage().Navigation.SET_AS_DESTINATION,
        })
        TouchAction.setTouchEndPoint({
          x: event.LLPoint.x,
          y: event.LLPoint.y,
        })
        break
      // case TouchMode.MAP_TOPO_SPLIT_BY_POINT: {
      //   const data = ToolbarModule.getData()
      //   const point = event.screenPoint
      //   data?.actions?.pointSplitLine(point)
      //   GLOBAL.bubblePane && GLOBAL.bubblePane.clear()
      //   break
      // }
      // case TouchMode.MAP_TOPO_TRIM_LINE:
      // // case TouchMode.MAP_TOPO_EXTEND_LINE:
      // {
      //   // const data = ToolbarModule.getData()
      //   const point = event.screenPoint
      //   ToolbarModule.addData({ point })
      //   let params = {
      //     point,
      //     ...GLOBAL.INCREMENT_DATA,
      //     secondLine: true,
      //   }
      //   SMap.drawSelectedLineOnTrackingLayer(params)
      //   GLOBAL.bubblePane && GLOBAL.bubblePane.clear()
      //   break
      // }
    }
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
    this.trafficView?.setVisible(full)
  }

  renderCustomView = () => {
    return (
      <>
        {this._renderTrafficView()}
        {this._renderMapSelectButton()}
        {this._renderButtons()}
      </>
    )
  }

  /** 实时路况 */
  _renderTrafficView = () => {
    return (
      <TrafficView
        ref={ref => (this.trafficView = ref)}
        currentFloorID={this.state.currentFloorID}
        getLayers={this.props.getLayers}
        device={this.props.device}
        incrementRoad={() => {
          TouchAction.setTouchMode(TouchMode.NULL)//进入路网，触摸事件设置为空
          this.showFullMap(true)
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
          onPress={() => {
            this.showFullMap(true)
            this.mapSelectButton?.setVisible(false)
            SMap.outdoorNavigation(0)
          }}
        />
        <ImageButton
          image={getAssets().navigation.dataset_type_else_black}
          title={'模拟'}
          onPress={() => {
            this.showFullMap(true)
            this.mapSelectButton?.setVisible(false)
            SMap.outdoorNavigation(1)
          }}
        />
        <ImageButton
          image={getAssets().mapTools.icon_location}
          title={'清除'}
          onPress={() => {
            SMap.removeAllCallout()
            SMap.removePOICallout()
            SMap.clearPoint()
          }}
        />
      </View>
    )
  }
}