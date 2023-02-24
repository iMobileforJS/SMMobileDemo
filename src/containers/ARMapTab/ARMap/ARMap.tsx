import { Button, Container, SlideBar } from '@/components'
import { DatasetType, EngineType, FileTools, IARTransform, SARMap, SMap, SMARMapView, SScene, SAIDetectView, ARAction, GeoStyle3D } from 'imobile_for_reactnative'
import React from 'react'
import { Image, Platform, View } from 'react-native'
import ContainerType from '@/components/Container/Container'
import { Props as HeaderProps } from '@/components/Header/Header'
import { scaleSize, screen, Toast } from '@/utils'
import { ConstPath } from '@/constants'
import { color } from '@/styles'
import { getAssets } from '@/assets'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ARAttributeTable } from '@/containers/components'
import { ARAttributeType } from '@/containers/components/ARAttributeTable/ARAttributeTable'
import wangge from './wangge.json'

interface Props {
	navigation: any,
	device: Device,
}

interface State {
  isAvailable: boolean,
  isInit: boolean,
	name3D: string,
	layerName: string,
  type: '' | 'rotation',
  attribute: Array<ARAttributeType>,
}

const AR_DATASOURCE = 'ARDatasource'
const AR_DATASET = 'ARDataset'
const AR_DATASOURCE_1 = 'ARDatasource_1'
const AR_DATASET_1 = 'ARDataset_1'
const USERNAME = 'Customer'

export default class ARMap extends React.Component<Props, State> {
  container: ContainerType | undefined | null

  visible: boolean = true

  constructor(props: Props) {
		super(props)
		this.state = {
      isAvailable: false,
      isInit: false,
			name3D: '',
			layerName: '',
      type: '',
      attribute: [],
		}
	}

  async componentDidMount() {
    // ARView系统版本是否支持 Anroid Only
    const isAvailable = await SAIDetectView.checkIfAvailable()
    if (!isAvailable) {
      Toast.show('该设备不支持AR')
      return false
    }
    // ARView需要的传感器是否可用
    if (await SAIDetectView.checkIfSensorsAvailable()) {
      this.setState({
        isAvailable: true,
      })
    } else {
      Toast.show('该设备不支持AR')
      return false
    }
    // 设置位置校准
    SARMap.setPosition(0, 0, 0)

     // }
    await SARMap.addAttributeListener({
      callback: async (result: any) => {
        try {
          const arr: Array<ARAttributeType> = []
          if (result) {
            const keys = Object.keys(result)
            keys.forEach(key => {
              arr.push({
                title: key,
                value: result[key],
              })
            })
          }
          this.setState({
            attribute: arr,
          })
        } catch (error) {
          this.setState({
            attribute: [],
          })
        }
      },
    })
  }

  initSetting = () => {
    if (Platform.OS === 'android') {
      SARMap.showPointCloud(true)
    } else {
      SARMap.setMeasureMode('arCollect')
    }
  }

  /**
   * 打开AR地图
   * @param path
   * @returns
   */
  openARMap = async (path: string) => {
    return await SARMap.open(path)
  }

  /**
   * 创建AR地图
   * @param path
   * @returns
   */
  createARMap = async (datasourcePath: string, datasourceName: string, datasetName: string) => {
		try {
			let server = datasourcePath + datasourceName + '.udb'
			const exist = await FileTools.fileIsExist(server)
			let result = false

			if(!exist) {
				//不存在，创建并打开
				result = await SMap.createDatasource({
					alias: datasourceName,
					server: server,
					engineType: EngineType.UDB,
				})
			} else {
				//存在，检查是否打开
				const wsds = await SMap.getDatasources()
				const opends = wsds.filter(item => {
					return item.server === server
				})
				//未打开则在此打开
				if(opends.length === 0) {
					result = !!await SMap.openDatasource({
						alias: datasourceName,
						server: server,
						engineType: EngineType.UDB,
					}, -1)
				} else {
					result = true
				}
			}
			if(result) {
				//检查打开的数据源中是否有默认的数据集
				const dsets = await SMap.getDatasetsByDatasource({alias: datasourceName})
				const defualtDset = dsets.list.filter(item => {
					return item.datasetName === datasetName
				})
				//没有则创建
				if(defualtDset.length === 0) {
					result = await SMap.createDataset(datasourceName, datasetName, DatasetType.PointZ)
				} else {
					// //重名则创建新的数据集
					// if(newDataset) {
					// 	datasetName = await SMap.getAvailableDatasetName(datasourceName, datasetName)
					// 	result = await SMap.createDataset(datasourceName, datasetName, datastType)
					// }
				}
				if(result) {
					return {
						success: true,
						datasourceName,
						datasetName,
					}
				}
			}
			return {
				success: false,
				error: 'fail',
			}
		} catch (error) {
			return {
				success: false,
				error: 'fail',
			}
		}
  }

  /**
   * 关闭AR地图
   */
  closeARMap = async () => {
    await SARMap.close()
  }

  /**
   * 新建 和 另存为AR地图
   * @param path
   * @returns 
   */
  saveAsARMap = async (path: string) => {
    return await SARMap.saveAs(path)
  }

  /**
   * 保存AR地图
   * @returns 
   */
  saveARMap = async () => {
    return await SARMap.save()
  }

	renderButton = (title: string, action: () => void) => {
    return (
      <Button
        key={title}
        style={{
          marginTop: 10,
          backgroundColor: 'white',
        }}
        titleStyle={{color: 'black'}}
        title={title}
        onPress={action}
      />
    )
  }

	/**
   * 实景地图组件
   * @returns 
   */
  renderARView = () => {
    if (!this.state.isAvailable) return null
    return (
      <SMARMapView
        moduleId={255}
        onLoad={this.initSetting}
        onARElementTouch={element => {
          
        }}
        onCalloutTouch={tag => {
          
        }}
        onNaviLocationChange={(location, remian) => {
          
        }}
      />
    )
  }

	getHeaderProps = (): HeaderProps => {
    return {
      title: 'AR地图',
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
      backAction: async () => {
        await this.closeARMap()
        return this.props.navigation.goBack()
      },
      type: 'fix',
      isResponseHeader: true,
    }
  }

	/** 添加三维图层 */
  add3D = async (datasourceName: string, datasetName: string, name: string) => {
		const homePath = await FileTools.getHomeDirectory()
		// 得到的是工作空间所在目录 需要去找到sxwu文件路径
		try {
			// const path3d = homePath + ConstPath.ExternalData + '/ChengDuSuperMap/ChengDuSuperMap.sxwu'
			// const userPath3d = homePath + ConstPath.UserPath + USERNAME + '/' + ConstPath.RelativeFilePath.Scene + 'ChengDuSuperMap/ChengDuSuperMap.sxwu'
			const path3d = `${homePath + ConstPath.ExternalData}/${name}/${name}.sxwu`
			const userPath3d = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativeFilePath.Scene}/${name}/${name}.sxwu`
			if (!await FileTools.fileIsExist(userPath3d)) {
				const data = {server: path3d}
				await SScene.import3DWorkspace(data)
			}
			if (!await FileTools.fileIsExist(userPath3d)) {
				Toast.show('三维数据不存在')
				return
			}
			// 添加三维图层
			const addLayerName = await SARMap.addSceneLayer(datasourceName, datasetName, userPath3d)
			if(addLayerName !== ''){
				Toast.show('添加三维图层成功: ' + addLayerName)
				this.setState({
          name3D: name,
					layerName: addLayerName,
				})
			}
      SARMap.setAction(ARAction.NULL)
		} catch(e){
			Toast.show('添加失败')
		}
  }

	/** 添加Online三维图层 */
  add3DOnline = async (url: string, name: string) => {
		try {
			const addLayerName = await SARMap.addSceneLayerOnline(AR_DATASOURCE + 1, AR_DATASET + 1, url, name)
			if(addLayerName !== ''){
				Toast.show('添加三维图层成功: ' + addLayerName)
				this.setState({
					layerName: addLayerName,
				})
			}
      SARMap.setAction(ARAction.SELECT)
		} catch(e){
			Toast.show('添加失败')
		}
  }

  getOnlineSceneFromUrl = (url: string): { serverUrl: string, datasetUrl: string, sceneName: string } => {
    const pattern = /(.+\/services)\/3D-(.+)\/rest\/realspace\/scenes\/(.+)/
    const result = url.match(pattern)
    let servicesUrl = ''
    let workspaceName = ''
    let sceneName = ''
    if (result) {
      servicesUrl = result[1]
      workspaceName = result[2]
      sceneName = result[3]
      const pat2 = /(.+)\.openrealspace$/
      const result2 = sceneName.match(pat2)
      if (result2) {
        sceneName = result2[1]
      }
    }
    return {
      //http://192.168.11.117:8090/iserver/services/3D-pipe3D/rest/realspace
      serverUrl: servicesUrl + `/3D-${workspaceName}/rest/realspace`,
      //http://192.168.11.117:8090/iserver/services/data-DataSource2/rest/data/datasources/AR_SCENE/datasets/AR_SCENE'
      datasetUrl: servicesUrl + `/data-${workspaceName}/rest/data/datasources/AR_SCENE/datasets/AR_SCENE111`,
      sceneName, //: 'pipe3D',
    }
  }


  /**
   * 右边按钮
   * @returns 
   */
  renderButtons = () => {
    return (
      <View
        style={{
          position: 'absolute',
          right: 10,
          top: 60 + screen.getIphonePaddingTop(),
          backgroundColor: 'transparent',
        }}
      >
				{this.renderButton('初始化地图', async() => {
					const homePath = await FileTools.getHomeDirectory()
					const datasourcePath = homePath + ConstPath.CustomerPath + ConstPath.RelativePath.ARDatasource
					const datasourceName = AR_DATASOURCE
					const datasetName = AR_DATASET
					const createResult = await this.createARMap(datasourcePath, datasourceName, datasetName)

          const wgPath = homePath + ConstPath.CustomerPath + ConstPath.RelativePath.Scene + '/地砖模型03/wangge'
          const r = await SMap.openDatasource({
            server: wgPath + '.udb',
            engineType: EngineType.UDB,
            alias: 'wangge',
          }, 0)
          console.warn('打开wangge', r ? '成功' : '失败')

					// await this.createARMap(datasourcePath, datasourceName + 1, datasetName + 1)
          if (createResult.success) {
            this.setState({
              isInit: true,
            }, () => {
              Toast.show('初始化地图成功')
            })
          } else {
            Toast.show('初始化地图失败')
          }
				})}
        {/* {this.renderButton('添加大厦', async() => {
          if (!this.state.isInit) {
            Toast.show('请先初始化地图')
            return
          }
          /this.add3D(AR_DATASOURCE, AR_DATASET, 'ChengDuSuperMap')
          const { serverUrl, sceneName, datasetUrl } = this.getOnlineSceneFromUrl("http://10.10.3.106:8090/iserver/services/3D-DiZhuanMoXing03/rest/realspace/scenes/地砖模型03")
          const addLayerName = await SARMap.addSceneLayerOnline(AR_DATASOURCE_1, AR_DATASET_1, serverUrl, sceneName)
        })} */}
        {this.renderButton('添加地砖', async() => {
          if (!this.state.isInit) {
            Toast.show('请先初始化地图')
            return
          }
          this.add3D(AR_DATASOURCE, AR_DATASET, '地砖模型03')
        })}
        {/* {this.renderButton('添加Online', async() => {
          if (!this.state.isInit) {
            Toast.show('请先初始化地图')
            return
          }
          // this.add3D(AR_DATASOURCE + 1, AR_DATASET + 1, '地砖模型03')
          const url = 'http://10.10.3.106:8090/iserver/services/3D-DiZhuanMoXing03/rest/realspace/scenes/地砖模型03'
			    const sceneName = url.substring(url.lastIndexOf('/') + 1)
          this.add3DOnline('http://192.168.11.21:8090/iserver/services/3D-DiZhuanMoXing03/rest/realspace', sceneName)
        })} */}
        {this.renderButton('编辑图层', async() => {
					if (!this.state.layerName) {
						Toast.show('请先添加三位图层')
						return
					}
          await SARMap.appointEditAR3DLayer(this.state.layerName)
          this.setState({
            type: 'rotation',
          })
					
        })}
        {this.renderButton('添加KML图层', async() => {
          if (!this.state.layerName) {
            Toast.show('请先添加三位图层')
            return
          }
          const layerName = 'OverlayKML'

          const geometries = wangge.geometries

          // 自定义颜色示例
          // for(const geometrie of geometries) {
          //   const style = new GeoStyle3D()
          //   style.setAltitudeMode(2)
          //   style.setFillForeColor(255, 0, 0, 1)
          //   geometrie.style = style
          // }

          const dataJson = {
            layerName: layerName,
            geometries: geometries,
          }
          const homePath = await FileTools.getHomeDirectory()
          const kmlPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativeFilePath.Scene}/${this.state.name3D}/kml/files/${this.state.name3D}.kml`


          const _layerName = await SARMap.addSceneLayerKMLByJson(JSON.stringify(dataJson), kmlPath, 'OverlayKML')
          console.warn('添加成功', _layerName)
        })}
        {this.renderButton('移除KML图层', async() => {
					if (!this.state.layerName) {
						Toast.show('请先添加三位图层')
						return
					}
          // this.visible = !this.visible
          // await SARMap.setLayerVisible(this.state.layerName, this.visible)
          await SARMap.removeSceneLayer('OverlayKML')
					
        })}
        {this.renderButton('保存KML', async() => {

          const homePath = await FileTools.getHomeDirectory()
          const kmlPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativeFilePath.Scene}/${this.state.name3D}/kml/files/${this.state.name3D}.kml`
          await SARMap.saveSceneLayerKML('OverlayKML', kmlPath)
					
        })}
        {this.renderButton('保存地图', async() => {
          // if (!this.state.isInit) {
          //   Toast.show('请先初始化地图')
          //   return
          // }
					// if (!this.state.layerName) {
					// 	Toast.show('请先添加三维图层')
					// 	return
					// }
		      const homePath = await FileTools.getHomeDirectory()
          // const arMapPath = homePath + ConstPath.UserPath + USERNAME + '/' + ConstPath.RelativePath.ARMap + 'ChengDuSuperMap/ChengDuSuperMap.arxml'
          const arMapPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativePath.ARMap + this.state.layerName}/${this.state.layerName}.arxml`
					const result = await this.saveAsARMap(arMapPath)

					Toast.show('保存地图' + (result ? '成功' : '失败'))
					
        })}
      </View>
    )
  }

  /** 编辑指滑界面 */
  renderSliderBar = () => {
    return (
      <View
        style={{
          // flex: 1,
          position: 'absolute',
          height: scaleSize(100),
          // width: '90%',
          backgroundColor: color.WHITE,
          justifyContent: 'center',
          // alignItems: 'center',
          bottom: scaleSize(30),
          left: scaleSize(10),
          right: scaleSize(10),
          borderRadius: scaleSize(20),
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        <SlideBar
          style={{
            flex: 1,
            height: scaleSize(100),
            marginHorizontal: scaleSize(20),
          }}
          range={[-180, 180]}
          defaultMaxValue={0}
          onMove={loc => {
            const transformData: IARTransform = {
              layerName: this.state.layerName,
              id: -1,
              type: 'rotation',
              positionX: 0,
              positionY: 0,
              positionZ: 0,
              rotationX: loc,
              rotationY: 0,
              rotationZ: 0,
              scale: 1,
              touchType: 0,
            }
            SARMap.setARElementTransform(transformData)
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: color.WHITE,
            justifyContent: 'center',
            alignItems: 'center',
            width: scaleSize(100),
            height: scaleSize(100),
          }}
          onPress={() => {
            this.setState({
              type: '',
            })
          }}
        >
          <Image
            style={{
              width: scaleSize(40),
              height: scaleSize(40),
            }}
            source={getAssets().mapTools.icon_input_clear}
          />
        </TouchableOpacity>
      </View>
    )
  }

  /** 属性表 */
  renderARAttribute = () => {
    if (this.state.attribute.length <= 0) return null
    return (
      <ARAttributeTable attribute={this.state.attribute} />
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
        {/* <View style={{flex: 1, backgroundColor:'yellow'}}></View> */}
        {this.renderARView()}
        {this.renderButtons()}
        {this.renderARAttribute()}
        {this.state.type === 'rotation' && this.renderSliderBar()}
      </Container>
    )
  }
}