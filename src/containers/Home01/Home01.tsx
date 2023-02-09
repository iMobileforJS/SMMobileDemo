/**
 * 二级根页面
 */
import navigation from "@/assets/navigation";
import License from "@/components/License";
import { LicenseUtil, scaleSize, screen, Toast } from "@/utils";
import React, { Component } from "react";
import { View, Button, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from './styles'

interface Props {
  navigation: any,
}

interface State {
  licenseViewIsShow: boolean,
}

class Home01 extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      licenseViewIsShow: false,
    }
  }

  /** 申请许可 */
  license = () => {
    this.showLicense(true)
  }

  /** 归还许可 */
  recycleLicense = () => {
    LicenseUtil.recycleLicense()
  }

  /** 进入模块选择页面（无许可进入时，部分功能不可用） */
  noLicense = () => {
    this.props.navigation.navigate('Home')
  }

  /** 许可申请面板是否显示 */
  showLicense = (show: boolean) => {
    this.setState({
      licenseViewIsShow: show,
    })
  }

  /** 许可申请面板渲染 */
  renderLicense = () => {
    return (
     <License
        close = {async () => {
          this.showLicense(false)
          let licenseType = await LicenseUtil.getLicenseType()
          if(licenseType) {
            this.props.navigation.navigate('Home')
          }
        }}
     >
     </License>
    )
  }

  render() {
    return (
      <View style = {[styles.container, {paddingTop: screen.getIphonePaddingTop()}]}>
        <TouchableOpacity
          style = {[styles.Btn]}
          onPress = {this.license}
        >
          <Text style={[styles.BtnText]}>{'申请许可'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style = {[styles.Btn]}
          onPress = {this.recycleLicense}
        >
          <Text style={[styles.BtnText]}>{'归还许可'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style = {[styles.Btn]}
          onPress = {this.noLicense}
        >
          <Text style={[styles.BtnText]}>{'示例'}</Text>
        </TouchableOpacity>

        {this.state.licenseViewIsShow && this.renderLicense()}
    </View>
    )
  }
}

export default Home01;