/** 
 * 许可申请面板组件
 * 
 * 结构：
 *   index： 导出为其他组件引用
 *   License：许可申请面板组件结构渲染文档
 *   styles：许可申请面板样式文档
 * 其他：
 *   在其他组件引用此组件，需要传入一个关闭的方法
 */
import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import styles from './styles'
import { Toast, LicenseUtil } from '@/utils';
import { getAssets } from '@/assets'

interface Props {
  close?:() => void
}

interface State {
  /** 是否选择了云许可 true表示选择了云许可 false表示选择了离线许可 */
  isCloud: boolean,
  /** 云许可登录用户名 */
  userName: string,
  /** 云许可登录密码 */
  password: string,
  /** 离线许可序列码 */
  offlineCode: string,
}

class License extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isCloud: true, // 默认是云许可
      userName: '',
      password: '',
      offlineCode: '',
    }
  }

  /** 改变云许可账号 */
  cloudChangeName = (text:string) => {
    this.setState({
      userName: text,
    })
  }

  /** 改变云许可密码 */
  cloudChangePwd = (text: string) => {
    this.setState({
      password: text,
    })
  }

  /** 改变离线许可序列码 */
  offlineCodeChange = (text: string) => {
    this.setState({
      offlineCode: text,
    })
  }

  /** 登录云许可 */
  logingCloud = async () => {
    let user = this.state.userName
    let pwd = this.state.password

    const result = await LicenseUtil.loginCloudLicense(user, pwd)
    if(result) {
      this.setState({
        userName: '',
        password: '',
        offlineCode: '',
      })
      this.close()
    } else {
      this.setState({
        password: '',
        offlineCode: '',
      })
    }
  }

  /** 激活离线许可 */
  activeOffline = async () => {
    const result = await LicenseUtil.activateLicense(this.state.offlineCode)
    if(result) {
      this.setState({
        userName: '',
        password: '',
        offlineCode: '',
      })
      this.close()
    } else {
      this.setState({
        password: '',
        offlineCode: '',
      })
    }
  }

  /** 关闭许可面板 */
  close = () => {
    try {
      this.props.close && this.props.close()
    } catch (error) {
      Toast.show("关闭许可面板失败")
    }
  }

  /** 云许可模块渲染 */
  renderCloud = () => {
    return (
      <View style = {[styles.cloudView]}>
        {/* <Text>{"我是在线模块儿"}</Text> */}
        <TextInput
          style = {[styles.cloudInput]}
          placeholder = {'账号'}
          value = {this.state.userName}
          onChangeText = {this.cloudChangeName}
        />
        <TextInput
          style = {[styles.cloudInput]}
          multiline={false}
          textContentType = {'password'}
          secureTextEntry = {true}
          placeholder = {'密码'}
          value = {this.state.password}
          onChangeText = {this.cloudChangePwd}
        />

        <TouchableOpacity
          style = {[styles.cloudButton]}
          onPress = {this.logingCloud}
        >
          <Text style = {[styles.cloudButtonText]}>{"登录"}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** 离线许可模块渲染 */
  renderOffline = () => {
    return (
      <View style = {[styles.offlineView]}>
        <Text>{'请输入离线许可序列码：'}</Text>
        <TextInput
          style = {[styles.offlineInput]}
          multiline={false}
          value = {this.state.offlineCode}
          onChangeText = {this.offlineCodeChange}
        />

        <TouchableOpacity
          style = {[styles.cloudButton]}
          onPress = {this.activeOffline}
        >
          <Text style = {[styles.cloudButtonText]}>{"激活"}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** 许可模式的切换头 */
  renderTitle = () => {
    return (
      <View style = {[styles.titleView]}>
        <TouchableOpacity 
          style = {[styles.titleContent, styles.titleContentLeft, this.state.isCloud && styles.titlecontentSelected]}
          onPress={() => {
            this.setState({
              isCloud: true,
            })
          }}
        >
          <Text style = {[styles.title, this.state.isCloud && styles.titleSelected]}>{"云许可"}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style = {[styles.titleContent, styles.titleContentRight, !this.state.isCloud && styles.titlecontentSelected]}
          onPress={() => {
            this.setState({
              isCloud: false,
            })
          }}
        >
          <Text style = {[styles.title, !this.state.isCloud && styles.titleSelected]}>{"离线许可"}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** 关闭许可面板按钮 */
  renderClose = () => {
    return (
      <TouchableOpacity
        style = {[styles.closeBtn]}
        onPress={this.close}
      >
        <Image style={styles.closeBtnImg} source={getAssets().poi.icon_tool_cancel} />
      </TouchableOpacity>
    )
  }

  renderContent = () => {
    return (
      <View style = {[styles.content]}>
        {this.renderTitle()}
        {this.renderClose()}
        {this.state.isCloud ? this.renderCloud() : this.renderOffline()}
      </View>
    )
  }

  render() {
    return (  
      <View style = {[styles.container]}>
        <View style = {[styles.mask]}></View>
        {this.renderContent()}
      </View>
    )
  }
}

export default License;