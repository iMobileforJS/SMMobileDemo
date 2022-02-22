import Container from './Container'
import { connect } from 'react-redux'

const mapStateToProps = (state: any) => {
  return {
    device: state.device.toJS(),
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    forwardRef: true,
  },
)(Container)

export { Container }
