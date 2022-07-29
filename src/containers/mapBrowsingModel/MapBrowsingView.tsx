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
 import { openHunanMap, openChenduMap, openTiandituMap, openBingMap } from './mapBrowsingAction'
 
 type Props = {
  //  getLayers: (params?: number | {type: number, currentLayerIndex: number}) => Promise<SMap.LayerInfo[]>,
 }
 
 type State = {
   currentFloorID: string,
 }
 
 export default class MapBrowsingView extends MapView<Props, State> {
 
   constructor(props: MapViewProps & Props) {
     super(props)
     this.state = {
      currentFloorID: '',
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
      openTiandituMap(this, false)
    } catch (error) {
      
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
            // fullScreen
            SMap.viewEntire()
          }}
        />
      </View>
    )
  }


   renderCustomView = () => {
     return (
       <>
        {this._renderLocalMapButtons()}
        {this._renderRightBottomButtons()}
       </>
     )
   }
 }