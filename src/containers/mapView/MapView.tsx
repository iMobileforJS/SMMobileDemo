import React from 'react'
import { SMMapView, SMap, FileTools, WorkspaceType } from 'imobile_for_reactnative'
import { ConstPath, DEFAULT_USER_NAME, TouchMode } from '@/constants'
import { Container } from '@/components'
import { Props as HeaderProps } from '@/components/Header/Header'
import ContainerType from '@/components/Container/Container'
import { MapController } from './components'
import { scaleSize, TouchAction } from '@/utils'
import { Extra } from '@/components/Container/Loading'
import { MapViewProps } from './types'

type State = {
  currentFloorID: string,
}

export default class MapView<P, S> extends React.Component<MapViewProps & P, State & S> {

  container: ContainerType | undefined | null
  mapController: MapController | undefined | null

  fullMap = false

  constructor(props: MapViewProps & P) {
    super(props)
  }

  componentDidMount() {
    this.setGestureDetectorListener()
    SMap.setIsMagnifierEnabled(true)
  }

  componentWillUnmount() {
    // await SMap.closeWorkspace()
    SMap.deleteGestureDetector()
  }

  _onGetInstance = () => {
    this._addMap()
  }

  /** 加载地图，mapview加载完成后调用 */
  _addMap = async () => {
    try {
      const home = await FileTools.appendingHomeDirectory()

      const exampleMapName = 'beijing'

      const path = `${home + ConstPath.ExternalData}/Navigation_EXAMPLE/${exampleMapName}.smwu`
      const mapPath = `${home + ConstPath.UserPath + DEFAULT_USER_NAME}/${ConstPath.RelativeFilePath.Map + exampleMapName}.xml`

      const data = {
        server: path,
        type: WorkspaceType.SMWU,
      }
      let result: string[] = []
      let defaultDataExist = await FileTools.fileIsExist(path)
      let mapFileExist = await FileTools.fileIsExist(mapPath)
      if (defaultDataExist && !mapFileExist) {
        result = await SMap.importWorkspaceInfo(data)
      }
      if (result) {
        let mapInfo = await this.props.openMap({
          name: 'beijing',
          path: mapPath,
        })
        // await SMap.openDatasource(ConstOnline.TrafficMap.DSParams, ConstOnline.TrafficMap.layerIndex, false)
        const mapInfo2 = await SMap.getMapInfo()
      }

      // SMap.viewEntire()
    } catch(e) {

    }
  }

  addMap = async () => {}

  /**
   * 显示全屏
   * @param {boolean} isFull
   */
  showFullMap = (isFull?: boolean) => {
    if (isFull === this.fullMap) return
    let full = isFull === undefined ? !this.fullMap : !isFull
    this.container && this.container.setHeaderVisible(full)
    this.container && this.container.setBottomVisible(full)
    this.mapController && this.mapController.setVisible(full)
    this.showFullMapAction(full)

    this.fullMap = !full
  }

  /**
   * 显示全屏继承方法,在子类中拓展showFullMap
   */
  showFullMapAction = (full: boolean) => {}

  /** 设置Container的loading */
  setLoading = (loading = false, info?: string, extra?: Extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setGestureDetectorListener = async () => {
    await SMap.setGestureDetector({
      singleTapHandler: this.touchCallback,
      longPressHandler: this.longtouchCallback,
      doubleTapHandler: this.doubleTouchCallback,
    })
  }

  touchCallback = async () => {
    switch(TouchAction.getTouchMode()) {
      case TouchMode.NORMAL: {
        if (!(await TouchAction.isDoubleTouchComing())) {
          this.showFullMap(!this.fullMap)
        }
        break
      }
    }
  }
  longtouchCallback = () => {}
  doubleTouchCallback = () => {}

  backAction = async () => {}

  back = async () => {
    await SMap.exitMap()
    await this.backAction()
    this.props.navigation.goBack()
  }

  getHeaderProps = (): HeaderProps => {
    return {
      title: '地图',
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
      isResponseHeader: true,
    }
  }

  /** 地图控制器，放大缩小等功能 **/
  renderMapController = () => {
    return (
      <MapController
        ref={ref => (this.mapController = ref)}
        device={this.props.device}
        currentFloorID={this.state.currentFloorID}
      />
    )
  }

  renderCustomView = () => {}

  render() {
    return (
      <Container
        // withoutHeader={true}
        ref={(ref: ContainerType) => (this.container = ref)}
        navigation={this.props.navigation}
        showFullInMap={true}
        hideInBackground={false}
        headerProps={this.getHeaderProps()}
      >
        <SMMapView
          style={{flex: 1}}
          onGetInstance={this._onGetInstance}
        />
        {this.renderCustomView()}
        {this.renderMapController()}
      </Container>
    )
  }
}
