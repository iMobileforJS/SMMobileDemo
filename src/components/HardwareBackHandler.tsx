import React from "react"
import { BackHandler } from "react-native"


interface Props {
  /**
   * 物理返回监听回调
   *
   * 返回 true 则拦截此事件
   *
   * 返回 false 则交由下一个监听处理此事件
   */
  onBackPress: () => void
}

/**
 *  监听安卓物理返回
 *
 * 用法：
 *
 * 1.在需要监听的组件的 render 方法内添加此组件，
 * 指定返回监听回调：
 *
 *      render() {
 *        return (
 *          <View>
 *            <HardwareBackHandler onBackPress={this.onBack}/>
 *          </View>
 *        )
 *      }
 *
 * 组件会在 componentDidMount 添加监听；
 * 在 componentWillUnmount 移除监听
 *
 * 2.若组件 mount 后不会 unmount，使用 visible 等控制显隐，
 * 则在隐藏时应该在回调返回 false 交由其他组件或系统处理返回事件：
 *
 *      onBack = () => {
 *        if(this.state.visible) {
 *          //do something
 *          return true
 *        } else {
 *          return false
 *        }
 *      }
 */
class HardwareBackHandler extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
  }

  onBackPress = () => {
    return this.props.onBackPress()
  }

  render() {
    return null
  }
}

export default HardwareBackHandler