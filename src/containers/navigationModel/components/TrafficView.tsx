/**
 * 地图左上角导航交通按钮
 */

import * as React from 'react'
import { StyleSheet, TouchableOpacity, Image, Animated } from 'react-native'

import {
  scaleSize,
  LayerUtils,
  Toast,
  screen,
} from '@/utils'
import { color } from '@/styles'
import { ConstNumber, ConstOnline } from '@/constants'
import { SData, SMap } from 'imobile_for_reactnative'
import { getAssets } from '@/assets'
import { getLanguage } from '@/language'
import { Extra } from '@/components/Container/Loading'
import { DatasetType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'

interface Props {
  device: Device,
  getLayers: () => Promise<SMap.LayerInfo[] | null> ,
  incrementRoad: () => void,
  setLoading?: (loading: boolean, info?: string, extra?: Extra) => void,
  mapLoaded: boolean,
}

interface State {
  left: Animated.Value,
  hasAdded: boolean,
  showIcon: boolean,
  isIndoor: boolean,
  layers: SMap.LayerInfo[],
}

export default class TrafficView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      left: new Animated.Value(scaleSize(20)),
      hasAdded: false,
      showIcon: true,
      isIndoor: false,
      layers: [],
    }
  }
  incrementRoad = async () => {
    let rel = false
    const datasources = await SData._getDatasetsByWorkspaceDatasource()
    datasources.forEach(item => {
      item.data.forEach(item2 => {
        if(item2.datasetType === DatasetType.LINE){
          rel = true
        }
      })
    })
    if (rel) {
      this.props.incrementRoad()
    } else {
      Toast.show(getLanguage().Navigation.NO_LINE_DATASETS)
    }
  }

  setVisible = (visible: boolean, immediately?: boolean) => {
    if (visible) {
      Animated.timing(this.state.left, {
        toValue: scaleSize(20),
        duration: immediately ? 0 : ConstNumber.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(this.state.left, {
        toValue: scaleSize(-200),
        duration: immediately ? 0 : ConstNumber.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
    }
  }

  /**
   * 开启/关闭交通路网
   */
  trafficChange = async () => {
    try {
      this.props.setLoading && this.props.setLoading(true, getLanguage().Navigation.CHANGING)
      if (this.state.hasAdded) {
        await SMap.removeLayer('tencent@TrafficMap')
      } else {
        const layers = await SMap.getLayersInfo()
        let baseMap = layers.filter(layer =>
          LayerUtils.isBaseLayer(layer),
        )[0]
        if (
          baseMap &&
          baseMap.name !== 'baseMap' &&
          baseMap.isVisible
        ) {
          if(!await SData.isDatasourceOpened(ConstOnline.TrafficMap.DSParams.alias)) {
            await SData.openDatasource(ConstOnline.TrafficMap.DSParams)
          }
          const scale = await SMap.getMapScale()
          const center = await SMap.getMapCenter()
          await SMap.addLayer({datasource: ConstOnline.TrafficMap.DSParams.alias, dataset: 0})
          await SMap.setMapScale(1 / parseFloat(scale))
          await SMap.setMapCenter(center.x, center.y)
          SMap.refreshMap()
        }
      }
      let hasAdded = !this.state.hasAdded
      this.setState({
        hasAdded,
      })
      this.props.setLoading && this.props.setLoading(false)
    } catch (error) {
      this.props.setLoading && this.props.setLoading(false)
    }
  }

  render() {
    if (!this.props.mapLoaded) return null
    let trafficImg = this.state.hasAdded
      ? getAssets().navigation.icon_traffic_on
      : getAssets().navigation.icon_traffic_off
    let networkImg = getAssets().navigation.icon_plot_new
    return (
      <Animated.View
        style={[
          styles.container,
          {
            left: this.state.left,
            top: scaleSize(143) + screen.getIphonePaddingTop(),
          },
        ]}
      >
        {!this.state.isIndoor ? (
          <TouchableOpacity
            style={{
              flex: 1,
            }}
            onPress={this.trafficChange}
          >
            <Image source={trafficImg} style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              flex: 1,
            }}
            onPress={this.incrementRoad}
          >
            <Image source={networkImg} style={styles.icon} />
          </TouchableOpacity>
        )}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: scaleSize(60),
    height: scaleSize(60),
    backgroundColor: color.white,
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    flex: 1,
    width: scaleSize(50),
    height: scaleSize(50),
  },
  text: {
    fontSize: scaleSize(20),
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})
