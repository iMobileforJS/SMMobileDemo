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
import { SMap } from 'imobile_for_reactnative'
import { getAssets } from '@/assets'
import { getLanguage } from '@/language'
import { Extra } from '@/components/Container/Loading'

interface Props {
  device: Device,
  getLayers: () => Promise<SMap.LayerInfo[]>,
  incrementRoad: () => void,
  setLoading?: (loading: boolean, info?: string, extra?: Extra) => void,
  mapLoaded: boolean,
  currentFloorID: string,
}

interface State {
  left: Animated.Value,
  hasAdded: boolean,
  showIcon: boolean,
  isIndoor: boolean,
  layers: SMap.LayerInfo[],
  currentFloorID: string,
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
      currentFloorID: props.currentFloorID,
    }
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.currentFloorID !== prevState.currentFloorID) {
      if (nextProps.currentFloorID) {
        return {
          currentFloorID: nextProps.currentFloorID,
          isIndoor: true,
        }
      } else {
        return {
          currentFloorID: nextProps.currentFloorID,
          isIndoor: false,
        }
      }
    }
    return null
  }
  incrementRoad = async () => {
    let rel = await SMap.hasLineDataset()
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

  trafficChange = async () => {
    try {
      this.props.setLoading && this.props.setLoading(true, getLanguage().Navigation.CHANGING)
      if (this.state.hasAdded) {
        await SMap.removeTrafficMap('tencent@TrafficMap')
      } else {
        let layers = await this.props.getLayers()
        let baseMap = layers.filter(layer =>
          LayerUtils.isBaseLayer(layer),  
        )[0]
        if (
          baseMap &&
          baseMap.name !== 'baseMap' &&
          baseMap.isVisible
        ) {
          await SMap.openTrafficMap(ConstOnline.TrafficMap.DSParams)
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
