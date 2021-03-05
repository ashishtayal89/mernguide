import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Landing from "./Landing";
import { fetchUserThunk, fetchUser } from "../../actions";

const mapStateToProps = ({ user }) => {
  return {
    user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchUser,
      fetchUserThunk
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
