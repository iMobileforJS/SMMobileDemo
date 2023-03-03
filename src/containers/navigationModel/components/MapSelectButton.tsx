/**
 * Copyright © SuperMap. All rights reserved.
 * Author: ysl
 * 导航底部按钮
 */

import * as React from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import {
  scaleSize,
  Toast,
  setSpText,
  TouchAction,
} from '@/utils'
import { color, zIndexLevel } from '@/styles'
import { TouchMode } from '@/constants'
import { getLanguage } from '@/language'

interface Props {
  analyst: () => void,
}

interface State {
  show: boolean,
  button: string,
  firstpage: boolean,
}

export default class MapSelectButton extends React.Component<Props, State> {
  selectedData: {
    selectedDatasources: [], //选中的数据源
    selectedDatasets: [], //选中的数据集
    currentDatasource: [], //当前使用的数据源
    currentDataset: {}, //当前使用的数据集
  }
  navigationResult = false
  constructor(props: Props) {
    super(props)
    this.state = {
      show: false,
      button: '',
      firstpage: true,
    }

    //  导航选中的数据
    this.selectedData = {
      selectedDatasources: [], //选中的数据源
      selectedDatasets: [], //选中的数据集
      currentDatasource: [], //当前使用的数据源
      currentDataset: {}, //当前使用的数据集
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props) !== JSON.stringify(nextProps)
  }

  setVisible = (isShow: boolean, params?: { button: string }) => {
    this.setState({ show: isShow, button: params?.button || this.state.button })
  }

  /** 按钮事件 */
  action = async () => {
    try {
      if (
        this.state.button ===
        getLanguage().Navigation.ROUTE_ANALYST
      ) {
        this.props.analyst?.()
      } else if (
        this.state.button ===
        getLanguage().Navigation.SET_AS_START_POINT
      ) {
        let startPoint = TouchAction.getTouchStartPoint()
        if (startPoint) {
          TouchAction.setTouchMode(TouchMode.MAP_SELECT_END_POINT)
          this.setState({
            show: false,
          })
          Toast.show(getLanguage().Navigation.LONG_PRESS_ADD_END)
        }
      } else {
        let endPoint = TouchAction.getTouchEndPoint()
        if (endPoint) {
          TouchAction.setTouchMode(TouchMode.MAP_NAVIGATION)
          this.setState({
            show: true,
            button: getLanguage().Navigation.ROUTE_ANALYST,
          })
        } else {
          Toast.show(getLanguage().Navigation.LONG_PRESS_ADD_END)
        }
      }
    } catch (error) {

    }
  }

  render() {
    if (this.state.show) {
      return (
        <View
          style={{
            position: 'absolute',
            bottom: scaleSize(30),
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: zIndexLevel.FOUR,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              width: 200,
              height: scaleSize(60),
              borderRadius: 50,
              backgroundColor: color.blue,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.action}
          >
            <Text
              style={{
                fontSize: setSpText(20),
                color: color.white,
              }}
            >
              {this.state.button}
            </Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return <View />
    }
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
