import { Button, Container, Dialog, SlideBar } from '@/components'
import { FileTools, SARMap, SData, SMARMapView, SScene, SAIDetectView, PrjCoordSysType } from 'imobile_for_reactnative'
import React from 'react'
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import ContainerType from '@/components/Container/Container'
import { Props as HeaderProps } from '@/components/Header/Header'
import { DialogUtil, scaleSize, screen, Toast } from '@/utils'
import { ConstPath } from '@/constants'
import { color } from '@/styles'
import { getAssets } from '@/assets'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ARAttributeTable } from '@/containers/components'
import { ARAttributeType } from '@/containers/components/ARAttributeTable/ARAttributeTable'
import wangge from './wangge.json'
import { DatasetType, EngineType, Vector3 } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'
import { ARAction, IARTransform } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'

const styles = StyleSheet.create({
  positionDialog: {
    flexDirection: 'column',
  },
  positionRow: {
    flexDirection: 'row',
    height: scaleSize(100),
    alignItems: 'center',
    paddingHorizontal: scaleSize(15),
  },
  rowTitle: {
    width: scaleSize(80),
    fontSize: scaleSize(30),
    textAlign: 'center',
  },
  rowInput: {
    flex: 1,
    height: scaleSize(80),
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: scaleSize(8),
  },
})

interface Props {
	navigation: any,
	device: Device,
}

interface State {
  isAvailable: boolean,
	name3D: string,
	layerName: string,
	kmlLayerName: string,
  type: '' | 'rotation',
  attribute: Array<ARAttributeType>,
  /** 用于记录当前三维图层的经纬度坐标 */
  position: Vector3,
  /** 用于记录校准经纬度坐标 */
  calibratePostion: Vector3,
}

const AR_DATASOURCE = 'ARDatasource'
const AR_DATASET = 'ARDataset'
const USERNAME = 'Customer'
const DEMO_NAME = '地砖模型03'

export default class ARMap extends React.Component<Props, State> {
  container: ContainerType | undefined | null
  visible: boolean = true
  position = { x: 0, y: 0, z: 0}
  positionDialog: Dialog | undefined | null
  isInit = false // 是否初始化
  isCalibrate = false // 是否校准
  isOpenMap = false // 是否打开地图

  constructor(props: Props) {
		super(props)
		this.state = {
      isAvailable: false,
			name3D: '',
			layerName: '',
			kmlLayerName: '',
      type: '',
      attribute: [],
      position: {x: 0, y: 0, z: 0},
      calibratePostion: {x: 0, y: 0, z: 0},
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
    // 设置点击对象显示属性监听
    await SARMap.setScene3DAttributeListener(
      async (result: any) => {
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
    )
  }

  initSetting = () => {
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
   * 初始化AR地图数据
   * @param path
   * @returns
   */
  initARData = async (datasourcePath: string, datasourceName: string, datasetName: string) => {
		try {
			let server = datasourcePath + datasourceName + '.udb'
			const exist = await FileTools.fileIsExist(server)
			let result = false

			if(!exist) {
				//不存在，创建并打开
				datasourceName = await SData.createDatasource({
					alias: datasourceName,
					server: server,
					engineType: EngineType.UDB,
				})
        result = true
			} else {
				//存在，检查是否打开
				const wsds = await SData.getDatasources()
				const opends = wsds.filter(item => {
					return item.server === server
				})
				//未打开则在此打开
				if(opends.length === 0) {
					result = !!await SData.openDatasource({
						alias: datasourceName,
						server: server,
						engineType: EngineType.UDB,
					})
				} else {
					result = true
				}
			}
			if(result) {
				//检查打开的数据源中是否有默认的数据集
				const dsets = await SData.getDatasetsByDatasource({alias: datasourceName})
				const defualtDset = dsets.filter(item => {
					return item.datasetName === datasetName
				})
				//没有则创建
				if(defualtDset.length === 0) {
					result = await SData.createDataset(datasourceName, datasetName, DatasetType.PointZ)
				}
				if(result) {
          this.isInit = true
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
        moduleId={0x10}
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
    if (!this.isInit) {
      Toast.show('请先初始化地图')
      return
    }
		const homePath = await FileTools.getHomeDirectory()
		// 得到的是工作空间所在目录 需要去找到sxwu文件路径
		try {
			const path3d = `${homePath + ConstPath.ExternalData}/${name}/${name}.sxwu`
			const userPath3d = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativeFilePath.Scene}${name}/${name}.sxwu`
			if (!await FileTools.fileIsExist(userPath3d)) {
				const data = {server: path3d}
				const result = await SScene.import3DWorkspace(data)
			}
			if (!await FileTools.fileIsExist(userPath3d)) {
				Toast.show('三维数据不存在')
				return
			}
			// 添加三维图层
			const addLayerName = await SARMap.addSceneLayer({datasourceName, datasetName}, userPath3d,undefined,{childCoordSysType:1})
			if(addLayerName !== ''){
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
			const addLayerName = await SARMap.addSceneLayerOnline({
        datasourceName: AR_DATASOURCE + 1,
        datasetName: AR_DATASET + 1,
      }, url, name)
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

  /** 清除之前的数据 */
  clearData = async () => {
    try {
      const homePath = await FileTools.getHomeDirectory()
      await SARMap.close()
      const arMapPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativePath.ARMap + DEMO_NAME}`
      await FileTools.deleteFile(arMapPath)

      const dsPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativePath.ARDatasource + AR_DATASOURCE}`
      await FileTools.deleteFile(dsPath + '.udb')
      await FileTools.deleteFile(dsPath + '.udd')
    } catch (e) {
      
    }
  }

  // getOnlineSceneFromUrl = (url: string): { serverUrl: string, datasetUrl: string, sceneName: string } => {
  //   const pattern = /(.+\/services)\/3D-(.+)\/rest\/realspace\/scenes\/(.+)/
  //   const result = url.match(pattern)
  //   let servicesUrl = ''
  //   let workspaceName = ''
  //   let sceneName = ''
  //   if (result) {
  //     servicesUrl = result[1]
  //     workspaceName = result[2]
  //     sceneName = result[3]
  //     const pat2 = /(.+)\.openrealspace$/
  //     const result2 = sceneName.match(pat2)
  //     if (result2) {
  //       sceneName = result2[1]
  //     }
  //   }
  //   return {
  //     //http://192.168.11.117:8090/iserver/services/3D-pipe3D/rest/realspace
  //     serverUrl: servicesUrl + `/3D-${workspaceName}/rest/realspace`,
  //     //http://192.168.11.117:8090/iserver/services/data-DataSource2/rest/data/datasources/AR_SCENE/datasets/AR_SCENE'
  //     datasetUrl: servicesUrl + `/data-${workspaceName}/rest/data/datasources/AR_SCENE/datasets/AR_SCENE111`,
  //     sceneName, //: 'pipe3D',
  //   }
  // }

  /** 打开地图 */
  openMap = async() => {
    const homePath = await FileTools.getHomeDirectory()
    // 得到的是工作空间所在目录 需要去找到sxwu文件路径
    try {
      const arMapPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativePath.ARMap}${DEMO_NAME}/${DEMO_NAME}.arxml`
      if (await FileTools.fileIsExist(arMapPath)) {
        await SARMap.open(arMapPath)
        await SARMap.setAction(ARAction.NULL)
        const layers = await SARMap.getLayers()
        this.isInit = true // 直接打开地图成功,说明数据完整,设置为初始化成功
        this.setState({
          layerName: layers[0]?.name || '',
        })
      } else {
        Toast.show('打开地图失败,请检查数据是否存在')
      }
    } catch(e) {
      Toast.show('打开地图失败,请检查数据是否存在')
    }
  }

  /** 关闭地图 */
  closeMap = async() => {
    if (!this.isOpenMap && !this.state.layerName) {
      Toast.show('请先打开地图')
      return
    }
    try {
      await SARMap.close()
      this.setState({
        layerName: '',
        attribute: [],
        type: '',
      })
      this.isOpenMap = false
    } catch(e) {
      
    }
  }

  /** 添加场景图层 */
  addScenceLayer = async() => {
    if (!this.isCalibrate) {
      Toast.show('请先校准')
      return
    }
    const homePath = await FileTools.getHomeDirectory()
    const dsParentPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativePath.ARDatasource}`
    const dsPath = dsParentPath + AR_DATASOURCE
    if (await FileTools.fileIsExist(dsPath + '.udb')) {
      // 若地图存在,仍然继续添加地砖,需要删除之前的数据,新建数据集和地图
      DialogUtil.getDialog()?.set({
        text: '添加地砖,会删除之前的地图数据,是否执行?',
        confirmAction: async () => {
          await this.clearData()
          this.isInit = false
          const createResult = await this.initARData(dsParentPath, AR_DATASOURCE, AR_DATASET)
          createResult.success && await this.add3D(AR_DATASOURCE, AR_DATASET, DEMO_NAME)

          DialogUtil.getDialog()?.setVisible(false)
        },
        cancelAction: () => {
          DialogUtil.getDialog()?.setVisible(false)
        }
      })
      DialogUtil.getDialog()?.setVisible(true)
    } else {
      const createResult = await this.initARData(dsParentPath, AR_DATASOURCE, AR_DATASET)
      if(createResult.success) {
        await this.add3D(AR_DATASOURCE, AR_DATASET, DEMO_NAME)
      }
    }
    // await this.add3D(AR_DATASOURCE, AR_DATASET, DEMO_NAME)
  }

  /** 编辑图层 */
  editLayer = async() => {
    if (!this.state.layerName) {
      Toast.show('请先添加三位图层')
      return
    }
    await SARMap.appointEditAR3DLayer(this.state.layerName)
    this.setState({
      type: 'rotation',
    })
    
  }

  /** 添加KML */
  addKML = async () => {
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
    // const kmlPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativeFilePath.Scene}/${this.state.name3D}/kml/files/${this.state.name3D}.kml`
    const kmlPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativeFilePath.Scene}${this.state.name3D}/kml/files/wangge.kml`


    // const _layerName = await SARMap.addSceneLayerKMLByJson(JSON.stringify(dataJson), kmlPath, 'OverlayKML')
    const _layerName = await SARMap.add3DLayer(this.state.layerName, 'OverlayKML', kmlPath)
    console.warn('添加成功', _layerName, this.state.layerName, kmlPath)
    this.setState({
      kmlLayerName: _layerName,
    })
  }

  /** 移除KML */
  removeKML = async () => {
    if (!this.state.layerName) {
      Toast.show('请先添加三位图层')
      return
    }
    // this.visible = !this.visible
    // await SARMap.setLayerVisible(this.state.layerName, this.visible)
    // await SARMap.removeSceneLayer('OverlayKML')
    await SARMap.removeARLayer('OverlayKML')
  }

  /** 保存KML */
  saveKML = async() => {
    const homePath = await FileTools.getHomeDirectory()
    const kmlPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativeFilePath.Scene}${this.state.name3D}/kml/files/wangge${new Date().toUTCString()}.kml`
    // await SARMap.saveSceneLayerKML('OverlayKML', kmlPath)
    await SARMap.save3DLayerAsKml('OverlayKML', kmlPath)
  }

  /** 保存地图 */
  saveMap = async() => {
    if (!this.isInit && !this.isOpenMap) {
      Toast.show('请先初始化或打开地图')
      return
    }
    if (!this.state.layerName) {
      Toast.show('请先添加三维图层')
      return
    }
    // 用于修改坐标后,保存提交
    await SARMap.submit()
    const homePath = await FileTools.getHomeDirectory()
    await FileTools.createDirectory(`${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativePath.ARMap + this.state.layerName}`)
    const arMapPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativePath.ARMap + this.state.layerName}/${this.state.layerName}.arxml`
    const result = await this.saveAsARMap(arMapPath)

    Toast.show('保存地图' + (result ? '成功' : '失败'))
    
  }

  /** 修改KML位置 */
  changeKMLPosition = async() => {

    // _position记录当前修改后的经纬度位置,并保存到this.state.position中
    // 示例:位置可来回切换
    const _position = Object.assign({}, this.state.position)
    _position.x = _position.x === (this.state.calibratePostion.x + 0.00002) ? this.state.calibratePostion.x : (this.state.calibratePostion.x + 0.00002)
    _position.y = _position.y === (this.state.calibratePostion.y + 0.00002) ? this.state.calibratePostion.y : (this.state.calibratePostion.y + 0.00002)
    _position.z = _position.z === (this.state.calibratePostion.z + 0.5) ? this.state.calibratePostion.z : (this.state.calibratePostion.z + 0.5)


    const mapPrj = await SARMap.getPrjCoordSys()
    const mapPrjObj = await SData.prjCoordSysFromXml(mapPrj)

    let moveToPosition

    // 若地图坐标系是墨卡托，则需要先把经纬度转成墨卡托
    if (mapPrjObj?.type === PrjCoordSysType.PCS_SPHERE_MERCATOR) {
      // 获取墨卡托XML
      const merctorXml = await SData.prjCoordSysToXml({type: PrjCoordSysType.PCS_SPHERE_MERCATOR, name: 'Sphere_Mercator', coordUnit: 10000, distanceUnit: 10000})
      // 经纬度转墨卡托
      const gpsPoints = await SData.CoordSysTranslatorGPSToPrj(merctorXml, [{x: _position.x, y: _position.y}])
      const gpsPoint = gpsPoints[0]
      moveToPosition = {x: gpsPoint.x, y: gpsPoint.y, z: gpsPoint.z}
    } else {
      moveToPosition = {x: _position.x, y: _position.y, z: _position.z}
    }

    // 墨卡托转AR坐标
    const arPoint = await SARMap.CoordSysTranslatorMapPrjToAR([{x: moveToPosition.x, y: moveToPosition.y, z: moveToPosition.z}])
    
    // 指定要编辑的三维图层
    await SARMap.appointEditAR3DLayer('地砖模型@wangge#1')
    // 以下是修改位置的三种方式
    // 1. 设置 AR 3维图层 (AR3DLayer) 相对于场景图层（ARSceneLayer）的局部坐标
    // await SARMap.setAR3DLayerLocalPosition('地砖模型@wangge#1', arPoint[0])

    // 2. 设置 AR 3维图层 (AR3DLayer) 的AR坐标
    await SARMap.setAR3DLayerPosition('地砖模型@wangge#1', arPoint[0])
    // await SARMap.setAR3DLayerPosition('OverlayKML', arPoint[0])

    // 3. 设置 AR 场景图层 (ARSceneLayer) 的AR坐标
    // 指定要编辑的三维场景图层
    // await SARMap.appointEditAR3DLayer(this.state.layerName)
    // await SARMap.setARSceneLayerPosition(this.state.layerName, arPoint[0])
    //提交更改,若不调该方法，修改将不会持久化
    await SARMap.submit()
    this.setState({
      // 记录修改后经纬度的位置
      position: _position,
    })
  }

  /**
   * 右边按钮
   * @returns 
   */
  renderButtons = () => {
    return (
      <ScrollView
        style={{
          position: 'absolute',
          right: 10,
          top: 60 + screen.getIphonePaddingTop(),
          bottom: 0,
          backgroundColor: 'transparent',
        }}
      >
        {this.renderButton('位置校准', async() => {
          this.positionDialog?.setDialogVisible(true)
        })}
        {/* {this.renderButton('初始化', async() => {
          const homePath = await FileTools.getHomeDirectory()
          const dsParentPath = `${homePath + ConstPath.UserPath + USERNAME}/${ConstPath.RelativePath.ARDatasource}`
          const createResult = await this.initARData(dsParentPath, AR_DATASOURCE, AR_DATASET)
          console.warn(createResult)
        })} */}
        {this.renderButton('打开地图', this.openMap)}
        {this.renderButton('关闭地图', this.closeMap)}
        {this.renderButton('添加地砖', this.addScenceLayer)}
        {this.renderButton('编辑图层', this.editLayer)}
        {this.renderButton('添加KML', this.addKML)}
        {this.renderButton('移除KML', this.removeKML)}
        {this.renderButton('保存KML', this.saveKML)}
        {this.renderButton('保存地图', this.saveMap)}
        {this.renderButton('修改坐标', this.changeKMLPosition)}
      </ScrollView>
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

  /** 位置校准dialog */
  _renderPositionDialog = () => {
    return (
      <Dialog
        ref={ref => this.positionDialog = ref}
        confirmAction={async () => {
          // 位置校准
          await SARMap.calibrate(this.position.x, this.position.y, this.position.z)
          this.positionDialog?.setDialogVisible(false)
          this.isCalibrate = true
          this.setState({
            calibratePostion: {...this.position},
          })
        }}
        cancelAction={() => {
          this.positionDialog?.setDialogVisible(false)
        }}
      >
        <View style={styles.positionDialog}>
          <View style={styles.positionRow}>
            <Text style={styles.rowTitle}>x</Text>
            <TextInput
              style={styles.rowInput}
              defaultValue={this.state.calibratePostion.x + ''}
              onChangeText={(text: string) => {
                if (isNaN(parseFloat(text))) return
                this.position.x = parseFloat(text)
              }}
              keyboardType={'numeric'}
            />
          </View>
          <View style={styles.positionRow}>
            <Text style={styles.rowTitle}>y</Text>
            <TextInput
              style={styles.rowInput}
              defaultValue={this.state.calibratePostion.y + ''}
              onChangeText={(text: string) => {
                if (isNaN(parseFloat(text))) return
                this.position.y = parseFloat(text)
              }}
              keyboardType={'numeric'}
            />
          </View>
          <View style={styles.positionRow}>
            <Text style={styles.rowTitle}>z</Text>
            <TextInput
              style={styles.rowInput}
              defaultValue={this.state.calibratePostion.z + ''}
              onChangeText={(text: string) => {
                if (isNaN(parseFloat(text))) return
                this.position.z = parseFloat(text)
              }}
              keyboardType={'numeric'}
            />
          </View>
        </View>
      </Dialog>
    )
  }

  render() {
    return (
      <Container
        ref={(ref: ContainerType) => (this.container = ref)}
        navigation={this.props.navigation}
        showFullInMap={true}
        hideInBackground={false}
        headerProps={this.getHeaderProps()}
      >
        {this.renderARView()}
        {this.renderButtons()}
        {this.renderARAttribute()}
        {this.state.type === 'rotation' && this.renderSliderBar()}
        {this._renderPositionDialog()}
      </Container>
    )
  }
}