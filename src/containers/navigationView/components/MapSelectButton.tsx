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
  FetchUtils,
} from '@/utils'
import { color, zIndexLevel } from '@/styles'
import { TouchMode } from '@/constants'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '@/language'
import { Extra } from '@/components/Container/Loading'
import { IndoorInfo, OutdoorInfo } from 'imobile_for_reactnative/types/interface/mapping/SMap'

interface Props {
  floorID: string,
  setLoading: (loading: boolean, info?: string, extra?: Extra) => void,
}

interface State {
  show: boolean,
  button: string,
  firstpage: boolean,
}

type DoorInfo = IndoorInfo | OutdoorInfo

export default class MapSelectButton extends React.Component<Props, State> {
  selectedData: {
    selectedDatasources: [], //选中的数据源
    selectedDatasets: [], //选中的数据集
    currentDatasource: [], //当前使用的数据源
    currentDataset: {}, //当前使用的数据集
  }
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

  //获取数组中相同的对象
  getSameInfoFromArray = (arr1: DoorInfo[], arr2: DoorInfo[]): DoorInfo[] => {
    let result: DoorInfo[] = []
    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return result
    arr1.forEach(item => {
      arr2.forEach(item2 => {
        if (item.name === item2.name) {
          result.push(item)
        }
      })
    })
    return result
  }

  /**
   * 路径分析
   * @returns {Promise<void>}
   */
  analyst = async () => {
    let startPoint = TouchAction.getTouchStartPoint()
    let endPoint = TouchAction.getTouchEndPoint()
    //起点终点都选择完成的情况下，进入路径分析
    if (startPoint.x !== undefined && endPoint.x !== undefined) {
      //重置TouchMode，显示Loading组件
      TouchAction.setTouchMode(TouchMode.NORMAL)
      this.props.setLoading(
        true,
        getLanguage().Navigation.ROUTE_ANALYSING,
      )
      let startPointInfo //起点所在室内数据源/室外数据集的数组
      let endPointInfo //终点所在室内数据源/室外数据集的数组
      try {
        //获取起点 终点 所在室内外的数据信息
        startPointInfo = await SMap.getPointBelongs(
          startPoint.x,
          startPoint.y,
        )
        endPointInfo = await SMap.getPointBelongs(endPoint.x, startPoint.y)
      } catch (e) {
        this.props.setLoading(false)
        Toast.show(' 获取数据失败')
        return
      }
      //分别获取 起点室内信息  起点室外信息 终点室内信息 终点室外信息
      let startIndoorInfo = startPointInfo.filter(item => item.isIndoor)
      let startOutdoorInfo = startPointInfo.filter(item => !item.isIndoor)
      let endIndoorInfo = endPointInfo.filter(item => item.isIndoor)
      let endOutdoorInfo = endPointInfo.filter(item => !item.isIndoor)
      //获取起点终点公共室内信息
      let commonIndoorInfo = this.getSameInfoFromArray(
        startIndoorInfo,
        endIndoorInfo,
      )
      //获取起点终点公共室外信息
      let commonOutdoorInfo = this.getSameInfoFromArray(
        startOutdoorInfo,
        endOutdoorInfo,
      )

      //获取用户选择数据
      let datasources = this.selectedData.selectedDatasources
      let datasets = this.selectedData.selectedDatasets
      //需要重新设置回MapView的四个数据
      let selectedDatasets = [] //当前选中数据集
      let selectedDatasources = [] //当前选中数据源
      let currentDataset = {} //当前使用中的数据集
      let currentDatasource = [] //当前使用中的数据源
      //用户选择了导航数据
      if (datasources.length > 0 || datasets.length > 0) {
        //使用刚才获取到的室内外公共信息，分别和用户选择的datasources(室内) datasets(室外)再重新获取公共的室内外信息
        commonIndoorInfo = this.getSameInfoFromArray(
          commonIndoorInfo,
          datasources,
        )
        commonOutdoorInfo = this.getSameInfoFromArray(
          commonOutdoorInfo,
          datasets,
        )
        //当前选中数据集 数据源 设置为用户之前选择的
        selectedDatasources = datasources
        selectedDatasets = datasets
        //如果存在公共室内信息
        if (commonIndoorInfo.length > 0) {
          //把当前使用中的数据源设置成公共室内信息，情况当前使用中的数据集
          currentDatasource = commonIndoorInfo
          currentDataset = {}
          //如果存在公共室外信息
        } else if (commonOutdoorInfo.length > 0) {
          //把当前使用中的数据集摄制为公共室外数据集的第一个 当前室内数据源置空
          currentDataset = commonOutdoorInfo[0]
          currentDatasource = []
          //如果不存在用户选中数据源
          if (datasources.length === 0) {
            //清除掉起点终点的室内信息
            startIndoorInfo = []
            endIndoorInfo = []
          } else {
            //否则把起点、终点的室内数据源添加到当前使用中的数据源
            startIndoorInfo.length > 0 &&
              currentDatasource.push(startIndoorInfo[0])
            endIndoorInfo.length > 0 && currentDatasource.push(endIndoorInfo[0])
          }
        }
        //用户没有选择导航数据
      } else {
        //存在公共室内数据
        if (commonIndoorInfo.length > 0) {
          //设置选中数据源 当前使用中的数据源 清空选中的数据集 清空当前数据集
          selectedDatasources = commonIndoorInfo
          currentDatasource = commonIndoorInfo
          selectedDatasets = []
          currentDataset = {}
          //不存在公共室内数据 但是存在公共室外数据
        } else if (commonOutdoorInfo.length > 0) {
          //设置选中数据集 当前使用中数据集   清空室内数据源 当前选中数据源
          selectedDatasets = commonOutdoorInfo
          currentDataset = commonOutdoorInfo[0]
          selectedDatasources = []
          currentDatasource = []
          //如果起点存在室内数据
          if (startIndoorInfo.length > 0) {
            //添加起点室内数据到选中数据源 当前数据源
            selectedDatasources.push(startIndoorInfo[0])
            currentDatasource.push(startIndoorInfo[0])
          }
          //如果终点存在室内数据
          if (endIndoorInfo.length > 0) {
            //添加终点室内数据到选中数据源 当前数据源
            selectedDatasources.push(endIndoorInfo[0])
            currentDatasource.push(endIndoorInfo[0])
          }
        }
      }

      //设置数据到MapView
      // this.setNavigationDatas({
      //   selectedDatasources,
      //   selectedDatasets,
      //   currentDataset,
      //   currentDatasource,
      // })
      let path, pathLength
      //有公共室内数据源，室内导航
      if (commonIndoorInfo.length > 0) {
        try {
          //添加起点
          await SMap.getStartPoint(
            startPoint.x,
            startPoint.y,
            true,
            startPoint.floorID,
          )
          //添加终点
          await SMap.getEndPoint(
            endPoint.x,
            startPoint.y,
            true,
            endPoint.floorID,
          )
          //设置室内导航参数
          await SMap.startIndoorNavigation(commonIndoorInfo[0].datasourceName)
          //进行室内导航路径分析
          let rel = await SMap.beginIndoorNavigation()
          if (!rel) {
            this.props.setLoading(false)
            Toast.show(getLanguage().Navigation.PATH_ANALYSIS_FAILED)
            return
          }
        } catch (e) {
          this.props.setLoading(false)
          Toast.show(getLanguage().Navigation.PATH_ANALYSIS_FAILED)
          return
        }
        //获取路径长度、路径详情
        pathLength = await SMap.getNavPathLength(true)
        path = await SMap.getPathInfos(true)
        //设置当前导航模式为室内
        // GLOBAL.CURRENT_NAV_MODE = 'INDOOR'
        //存在室外公共数据集
      } else if (commonOutdoorInfo.length > 0) {
        //起点和终点存在不同的室内数据源
        if (startIndoorInfo.length > 0 && endIndoorInfo.length > 0) {
          //todo 有不同的室内数据源 三段室内外一体化导航
          //todo getDoorPoint两次 获取最近的两个临界点位置，然后启动室内导航
          //只有起点存在室内数据源 两段室内外一体化导航 先室内
        } else if (startIndoorInfo.length > 0) {
          //构造参数，获取临界点
          let params = {
            startX: startPoint.x,
            startY: startPoint.y,
            endX: endPoint.x,
            endY: startPoint.y,
            datasourceName: startIndoorInfo[0].datasourceName,
          }
          let doorPoint = await SMap.getDoorPoint(params)
          //临界点获取成功，存在坐标及楼层信息
          if (doorPoint.x && doorPoint.y && doorPoint.floorID) {
            //构建分段导航相关参数
            let navParams = [
              {
                startX: startPoint.x,
                startY: startPoint.y,
                endX: doorPoint.x,
                endY: doorPoint.y,
                datasourceName: startIndoorInfo[0].datasourceName,
                startFloor: startPoint.floorID,
                endFloor: doorPoint.floorID,
                isIndoor: true,
                hasNaved: true,
              },
              {
                startX: doorPoint.x,
                startY: doorPoint.y,
                endX: endPoint.x,
                endY: startPoint.y,
                isIndoor: false,
                hasNaved: false,
                datasourceName: commonOutdoorInfo[0].datasourceName,
                datasetName: commonOutdoorInfo[0].datasetName,
                modelFileName: commonOutdoorInfo[0].modelFileName,
              },
            ]
            // 先进行室内导航
            try {
              //添加起点终点
              await SMap.getStartPoint(
                startPoint.x,
                startPoint.y,
                true,
                startPoint.floorID || doorPoint.floorID,
              )
              await SMap.getEndPoint(
                doorPoint.x,
                doorPoint.y,
                true,
                doorPoint.floorID,
              )
              //设置室内导航参数
              await SMap.startIndoorNavigation(
                startIndoorInfo[0].datasourceName,
              )
              //进行室内路径分析
              let rel = await SMap.beginIndoorNavigation()
              if (!rel) {
                this.props.setLoading(false)
                Toast.show(
                  getLanguage().Navigation.PATH_ANALYSIS_FAILED,
                )
                SMap.clearPoint()
                return
              }
              //添加引导线到跟踪层 室内导航终点到室外导航终点
              await SMap.addLineOnTrackingLayer(doorPoint, {
                x: endPoint.x,
                y: startPoint.y,
              })
            } catch (e) {
              this.props.setLoading(false)
              Toast.show(
                getLanguage().Navigation.PATH_ANALYSIS_FAILED,
              )
              return
            }

            //获取路径长度 路径信息
            pathLength = await SMap.getNavPathLength(true)
            path = await SMap.getPathInfos(true)
            //设置导航模式为室内
            // GLOBAL.CURRENT_NAV_MODE = 'INDOOR'
          } else {
            //分析失败(找不到最近的门的情况（数据问题）) 进行在线路径分析
            this.props.setLoading(false)
            // this.dialog.setDialogVisible(true)
            Toast.show('分析失败')
          }
          //终点存在室内数据源 两段室内外一体化导航 先室外
        } else if (endIndoorInfo.length > 0) {
          //构造参数获取临界点
          let params = {
            startX: startPoint.x,
            startY: startPoint.y,
            endX: endPoint.x,
            endY: startPoint.y,
            datasourceName: endIndoorInfo[0].datasourceName,
          }
          let doorPoint = await SMap.getDoorPoint(params)
          //获取成功，拿到坐标和楼层id
          if (doorPoint.x && doorPoint.y && doorPoint.floorID) {
            //构建分段导航参数
            let navParams = [
              {
                startX: startPoint.x,
                startY: startPoint.y,
                endX: doorPoint.x,
                endY: doorPoint.y,
                isIndoor: false,
                hasNaved: true,
                datasourceName: commonOutdoorInfo[0].datasourceName,
                datasetName: commonOutdoorInfo[0].datasetName,
                modelFileName: commonOutdoorInfo[0].modelFileName,
              },
              {
                startX: doorPoint.x,
                startY: doorPoint.y,
                startFloor: doorPoint.floorID,
                endX: endPoint.x,
                endY: startPoint.y,
                endFloor: endPoint.floorID || doorPoint.floorID,
                datasourceName: endIndoorInfo[0].datasourceName,
                isIndoor: true,
                hasNaved: false,
              },
            ]

            try {
              //添加起点，添加终点 设置室外导航参数 进行室外路径分析
              await SMap.getStartPoint(startPoint.x, startPoint.y, false)
              await SMap.getEndPoint(endPoint.x, startPoint.y, false)
              await SMap.startNavigation(navParams[0])
              let canNav = await SMap.beginNavigation(
                startPoint.x,
                startPoint.y,
                doorPoint.x,
                doorPoint.y,
              )
              if (!canNav) {
                Toast.show(
                  '当前选点不在路网数据集范围内,请重新选点或者重设路网数据集',
                )
                this.props.setLoading(false)
                return
              }
              //添加引导线到跟踪层 临界点到导航终点
              await SMap.addLineOnTrackingLayer(doorPoint, {
                x: endPoint.x,
                y: startPoint.y,
              })
            } catch (e) {
              this.props.setLoading(false)
              Toast.show(
                getLanguage().Navigation.PATH_ANALYSIS_FAILED,
              )
              return
            }
            //获取室外路径长度 路径信息
            pathLength = await SMap.getNavPathLength(false)
            path = await SMap.getPathInfos(false)
            //设置当前导航模式为室外
            // GLOBAL.CURRENT_NAV_MODE = 'OUTDOOR'
          } else {
            //分析失败(找不到最近的门的情况（数据问题）) 进行在线路径分析
            this.props.setLoading(false)
            // this.dialog.setDialogVisible(true)
            Toast.show('分析失败')
          }
        } else {
          //无室内数据源  室外导航
          //直接导航
          try {
            //设置室外导航相关参数，进行室外导航路径分析
            await SMap.startNavigation(commonOutdoorInfo[0])
            let result = await SMap.beginNavigation(
              startPoint.x,
              startPoint.y,
              endPoint.x,
              endPoint.y,
            )
            if (result) {
              //室外路径分析成功 获取路径长度 路径信息
              pathLength = await SMap.getNavPathLength(false)
              path = await SMap.getPathInfos(false)
              //当前全局导航模式设置为室外
              // GLOBAL.CURRENT_NAV_MODE = 'OUTDOOR'
            } else {
              //分析失败(500m范围内找不到路网点的情况)或者选择的点不在选择的路网数据集bounds范围内
              Toast.show(
                '当前选点不在路网数据集范围内,请重新选点或者重设路网数据集',
              )
              this.props.setLoading(false)
              return
            }
          } catch (e) {
            this.props.setLoading(false)
            Toast.show(getLanguage().Navigation.PATH_ANALYSIS_FAILED)
            return
          }
        }
        //无公共室内数据源 且 无公共室外数据集 在线路径分析
      } else {
        //隐藏Loaqding 显示在线路径分析弹窗
        this.props.setLoading(false)
        // this.dialog.setDialogVisible(true)
        Toast.show('分析失败')
      }
      this.props.setLoading(false)
    }

    this.setState({
      show: false,
    })
  }

  action = async () => {
    try {
      if (
        this.state.button ===
        getLanguage().Navigation.ROUTE_ANALYST
      ) {
        this.analyst()
      } else if (
        this.state.button ===
        getLanguage().Navigation.SET_AS_START_POINT
      ) {
        let startPoint = TouchAction.getTouchStartPoint()
        if (startPoint) {
          let startFloorID = await SMap.getCurrentFloorID()
          TouchAction.setTouchStartFloorID(startFloorID)
          TouchAction.setTouchMode(TouchMode.NAVIGATION_TOUCH_END)
          this.setState({
            show: false,
          })
          Toast.show('长按选择终点')
        }
      } else {
        let endPoint = TouchAction.getTouchEndPoint()
        if (endPoint) {
          let endFloorID = await SMap.getCurrentFloorID()
          TouchAction.setTouchEndFloorID(endFloorID)
          TouchAction.setTouchMode(TouchMode.NORMAL)
          this.setState({
            show: true,
            button: getLanguage().Navigation.ROUTE_ANALYST,
          })
        } else {
          Toast.show(getLanguage().Navigation.TOUCH_TO_ADD_END)
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
