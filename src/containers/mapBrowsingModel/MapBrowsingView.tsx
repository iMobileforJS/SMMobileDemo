/**
 * 地图浏览界面
 * 
 * 结构：
 *   index 地图浏览界面组件的入口
 *   MapBrowsingView 地图浏览的界面结构渲染
 *   MapBrowsingAction 地图浏览的功能文件
 *   styles 界面结构的样式文件
 * 作用：渲染界面
 */
 import React from 'react'
 import MapView from "../mapView/MapView";
 import { scaleSize } from "@/utils";
 import { Props as HeaderProps } from "@/components/Header/Header";
 import { SMap } from 'imobile_for_reactnative';
 import { Text, View } from 'react-native';
 import { MapViewProps } from '../mapView/types';
 import { ImageButton } from '@/components'
 import { getAssets } from '@/assets'
 import styles from './styles'
 import { openHunanMap, openChenduMap, openTiandituMap, openBingMap, fullScreen } from './mapBrowsingAction'
import { DEFAULT_DATA_MAP_FILE } from './config';
 
 type Props = {
  //  getLayers: (params?: number | {type: number, currentLayerIndex: number}) => Promise<SMap.LayerInfo[]>,
 }
 
 type State = {
   currentFloorID: string,
   licenseViewIsShow: boolean,
   isFull: boolean,
 }
 
 export default class MapBrowsingView extends MapView<Props, State> {
 
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
       title: '地图浏览',
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
       isResponseHeader: true,
     }
   }

   getModueId = () => {
    // 地图浏览的模块ID
    return 0x10
  }
 
   setGestureDetectorListener = async () => {
     await SMap.setGestureDetector({
       singleTapHandler: this.touchCallback,
       longPressHandler: this.longtouchCallback,
       doubleTapHandler: this.doubleTouchCallback,
     })
   }
 
   backAction = async () => {
     await SMap.deleteGestureDetector()
   }
 
   componentDidMount(): void {
     try {
       this.setGestureDetectorListener()
     } catch (error) {
       
     }
   }
 
   componentWillUnmount() {
     SMap.deleteGestureDetector()
   }


   addMap = async () => {
    try {
      // await this.initData(DEFAULT_DATA_MAP_FILE)
      openTiandituMap(this, false)
    } catch (error) {
      
    }
  }

  /**
   * 拓展父类的全屏方法
   * @param full 
   */
  showFullMapAction = (full: boolean) => {
    try {
      this.setState({isFull: full})
    } catch (error) {
      console.warn('地图浏览全屏拓展方法出错')
    }
  }

  _renderLocalMapButtons = () => {
    return (
      <View style={styles.buttons}>
        <ImageButton
          image={getAssets().mapBrowsing.my_map}
          title={'湖南'}
          onPress={async () => {
            openHunanMap(this)
          }}
        />

        <ImageButton
          image={getAssets().mapBrowsing.icon_map01}
          title={'成都'}
          onPress={async () => {
            openChenduMap(this)
          }}
        />
        <ImageButton
          image={getAssets().mapBrowsing.icon_map02}
          title={'天地图'}
          onPress={() => {
            openTiandituMap(this, true)
          }}
        />

        <ImageButton
          image={getAssets().mapBrowsing.icon_map03}
          title={'BingMap'}
          onPress={() => {
            openBingMap(this)
          }}
        />
       
      </View>
    )
  }

  _renderRightBottomButtons = () => {
    return (
      <View style={styles.rightBottomButtons}>
        <ImageButton
          image={getAssets().mapBrowsing.icon_tool_full}
          onPress={() => {
            // 全幅
            fullScreen()
          }}
        />
      </View>
    )
  }


   renderCustomView = () => {
     return (
       <>
        {this.state.isFull && this._renderLocalMapButtons()}
        {this.state.isFull && this._renderRightBottomButtons()}
       </>
     )
   }
 }