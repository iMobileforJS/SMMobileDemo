/**
 * 地图的公共组件
 * 
 * 作用：
 *   地图的所有公共的方法和属性
 *   具体的地图页面通过继承这个组件来获取和实现里面的方法
 * 其他：
 *   地图的缩放按钮和定位按钮以及功能在此文件实现
 * 
 */
import React from 'react'
import { SMMapView, SMap, FileTools, SMediaCollector, RNFS as fs, SData } from 'imobile_for_reactnative'
import { DEFAULT_USER_NAME, TouchMode } from '@/constants'
import { Container } from '@/components'
import { Props as HeaderProps } from '@/components/Header/Header'
import ContainerType from '@/components/Container/Container'
import { MapController } from './components'
import { scaleSize, TouchAction } from '@/utils'
import { Extra } from '@/components/Container/Loading'
import { MapViewProps } from './types'
import Toast from 'react-native-root-toast'
import License  from '../../components/License'
import { WorkspaceType, DatasetType, DatasourceConnectionInfo } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'

// 离线地图数据类型
interface itemType {
  name: string,
  path: string,
}
// 在线地图数据类型
interface itemType02 {
  type: string,
  DSParams: DatasourceConnectionInfo,
  layerIndex: number,
  mapName: string,
}

// 地图的基本信息
interface MapInfo {
  name: string,
  path: string,
}

type State = {
  currentFloorID: number,
  licenseViewIsShow: boolean,
}

export default class MapView<P, S> extends React.Component<MapViewProps & P, State & S> {

  container: ContainerType | undefined | null
  mapController: MapController | undefined | null
  licenseRef: License | null | undefined

  fullMap = false
  currentMap:MapInfo
  currentLayer: SMap.LayerInfo | null
  layers: Array<SMap.LayerInfo> | null
  constructor(props: MapViewProps & P) {
    super(props)
    this.currentMap = {name: '', path: ''}
    this.currentLayer = null
    this.layers = null
  }

  componentDidMount() {
    this.setGestureDetectorListener()
    SMap.setIsMagnifierEnabled(true)

    console.warn('toPath')
  }

  componentWillUnmount() {
    // 移除所有手势监听
    SMap.setGestureDetector()
  }

  /** 获取模块ID 由子类实现 返回一个数字类型 */
  getModueId = () => {
    return 255
  }
  _onGetInstance = () => {
    this._addMap()
  }
  openWorkspace = async () => {
    try {
      return await SData.initUserWorkspace()
    } catch(e) {
      console.warn('openWorkspace error')
    }
  }

  /** 加载地图，mapview加载完成后调用 */
  _addMap = async () => {
    try {
      this.addMap()
    } catch(e) {

    }
  }

  /**
   * 初始化模块数据 在addMap里的最前面调用
   * @param name 数据所在文件夹的名字
   * @returns
   */
  // initData = async (name: string): Promise<void> => {
  //   // 初始化数据,数据保存在SMMobileDemo/android/app/src/main/assets
  //   const toPath = await FileTools.appendingHomeDirectory(ConstPath.ExternalData + '/')
  //   // 拷贝之后解压到 SMMobileDemo/ExternalData/（指定名字name文件夹里）
  //   await AppUtils.copyAssetFileTo(`${name}.zip`, toPath)
  // }

  addMap = async () => {}

  /**
   * 切换地图或者是打开地图
   * @param {boolean} isMap 是否是离线地图
   * @param {boolean} isChange 是否是切换地图 true表示切换地图 false表示仅仅打开地图
   * @param {itemType | Array<itemType02>} item 地图参数
   * @param {string} dataPath 可选参数，有默认值，当为离线地图时，需要传数据所在工作空间的路径，为在线地图时，可不传
   * @returns 
   */
  changeMap = async (isMap: boolean, isChange: boolean, item: itemType | Array<itemType02>, dataPath: string = '') => {  
    try {
      let text = '加载中'
      if(isChange) text = "正在切换地图"
      if(isMap){
        // 切换为离线地图的情况
        if(item instanceof Array) return
        if (this.currentMap && this.currentMap.path === item.path) {
          Toast.show("该地图已打开")
          return
        }
        let defaultDataExist = await FileTools.fileIsExist(dataPath)
        let exist = await FileTools.fileIsExist(item.path)
        let result
        this.container?.setLoading(true, text)
        if(defaultDataExist && !exist){
          const data = {
            server: dataPath,
            type: WorkspaceType.SMWU,
          }
          // 导入地图数据
          result = await SData.importWorkspace(data)
        }
        exist = await FileTools.fileIsExist(item.path)
        if(!exist){
          Toast.show("该地图不存在")
          this.container?.setLoading(false)
          return
        }
        // 关闭地图
        await this._closeMap()
        // 移除地图上所有callout
        SMediaCollector.removeMedias()
        // this.clearMapData()
        const mapInfo = await this._openMap({...item})
        if (mapInfo) {
          if(isChange){
            Toast.show("切换成功")
          }
          
          await SMap._openTaggingDataset(DEFAULT_USER_NAME)
          await this._getLayers(layers => {
            let _currentLayer = null
            // 默认设置第一个可见图层为当前图层
            for (let layer of layers) {
              if (
                layer.isVisible &&
                layer.type !== DatasetType.IMAGE &&
                layer.type !== DatasetType.MBImage
              ) {
                _currentLayer = layer
                break
              }
            }
            if(_currentLayer){
              this._setCurrentLayer(_currentLayer)
            }
          })
  
          this.container?.setLoading(false)
        } else {
          await this._getLayers(layers => {
            const currentLayer = layers.length > 0 && layers[0]
            if(currentLayer){
              this._setCurrentLayer(currentLayer)
            }
          })
          
          if(isChange){
            Toast.show("切换地图失败")
          }
          this.container?.setLoading(false)
        }
      } else {
        // 切换为在线地图的情况
        if(!(item instanceof Array)){
          return
        }
        this.container?.setLoading(true, text)
        const mapInfo = await SMap.getMapCenter()
        if(mapInfo){
          // 当前有地图打开了
          // 关闭当前打开的地图
          await this._closeMap()
        }
        // 打开数据源
        for (const element of item) {
          if(element === null) continue
          if(element.type === 'Datasource'){
            await this._openDatasource(
              element,
              element.layerIndex,
            )
          }
        }
        this.currentLayer = null
        this.layers = null
        if(isChange){
          Toast.show("切换成功")
        }
        this.container?.setLoading(false)

      }
    } catch (e) {
      if(isChange){
        Toast.show("切换地图失败")
      }
      this.container?.setLoading(false)
    }
  }

  /**
   * 打开数据源
   * @param {itemType02} wsData 数据源部分
   * @param {number} index 添加到地图的数据集序号
   * @param {boolean} toHead 是否添加到图层顶部
   */
  _openDatasource = async (wsData: itemType02, index = -1) => {
    if (!wsData.DSParams || !wsData.DSParams.server) {
      this.container?.setLoading(false)
      Toast.show('没有找到地图')
      return
    }
    try {
      await SMap.openMapWithDatasource(wsData.DSParams, index)
    } catch (e) {
      this.container?.setLoading(false)
    }
  }

  /**
   * 打开地图
   * @param {MapInfo} params 地图的参数
   * @returns 
   */
  _openMap = async (params: MapInfo) => {
    try {
      const absolutePath = await FileTools.appendingHomeDirectory(params.path)
      const fileName = params.name
      // 打开地图
      const openMapResult = await SMap.openMapName(fileName)
      // 地图信息文件.exp
      const expFilePath = `${absolutePath.substr(
        0,
        absolutePath.lastIndexOf('.'),
      )}.exp`
      // const currentMapInfo = await SMap.getMapInfo()
      const mName = await SMap.getMapName()
      if (openMapResult) {
        const expIsExist = await FileTools.fileIsExist(expFilePath)
        if (expIsExist) {
          const data = await fs.readFile(expFilePath)
          
   
          const mapInfo: MapInfo = {
            name: mName,
            path: params.path
          }
          // const mapInfo: MapInfo = Object.assign(currentMapInfo, JSON.parse(data), { path: params.path })
          this.currentMap = {...params}
          return mapInfo
        } else {
          this.currentMap = {...params}
          return {name: mName}
        }
      } else {
        return undefined
      }
    } catch (e) {
      return undefined
    }
  }

  /** 关闭地图 */
  _closeMap = async () => {
    try{
      await SMap.exitMap()
      this.currentMap = {name: '', path: ''}
    }catch(e){
      Toast.show("关闭地图失败")
    }
  }

  /**
   * 获取图层列表
   * @param {number | {type: number, currentLayerIndex: number}} params  图层参数
   * @param cb 回调函数
   * @returns 
   */
  _getLayers = async (cb = (layers: Array<SMap.LayerInfo>) => {}):Promise<SMap.LayerInfo[] | null> => {
   try {
    this.layers = await SMap.getLayersInfo(-1)
    
    cb && cb(this.layers)
    return this.layers
   } catch (error) {
    return null
   }
  }

  /**
   * 设置为当前图层
   * @param {SMap.LayerInfo} params 图层参数
   */
  _setCurrentLayer = async (params: SMap.LayerInfo) => {
    try {
      if (params && params.path) {
        !params.isVisible && await SMap.setLayerVisible(params.path, true)
      }
      this.currentLayer = {...params}
    } catch (error) {
      Toast.show("设置为当前图层失败")
    }
  }

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

  /**
   * 设置Container的loading
   * @param loading 是否显示动画，true显示，false不显示
   * @param info 显示动画时的文字信息
   * @param extra 其他
   */
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
      backAction: () => {
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

  closeLicense = () => {
    this.setState({
      licenseViewIsShow: false,
    })
  }

  renderLicense = () => {
    return (
     <License
        close = {this.closeLicense}
     >
     </License>
    )
  }

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
          // style={{flex: 1}}
          moduleId={this.getModueId()}
          onGetInstance={this._onGetInstance}
        />
        {this.renderCustomView()}
        {this.renderMapController()}
        {this.state.licenseViewIsShow && this.renderLicense()}
        
      </Container>
    )
  }
}
