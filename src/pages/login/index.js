import React, { Component } from "react";
import "./index.scss";
import http from "../../utils/http";
import { connect } from "dva";
import Loading from "../../components/loading";
class Login extends Component {
  render() {
    let { loading } = this.props;
    return (
      <div className="login">
        <div className="form">
          <input
            type="text"
            placeholder="请输入学号"
            ref="user"
            defaultValue="162601000144"
          />
          <input
            style={{ margin: "10px 0" }}
            type="password"
            placeholder="请输入密码"
            ref="pwd"
            defaultValue="Wang1997*"
          />
          <div>
            <button onClick={this.reset}>重置</button>
            <button
              style={{ background: "#3F9EFF", color: "#fff" }}
              onClick={this.goload}
            >
              登录
            </button>
          </div>
        </div>
        {loading.global ? <Loading /> : null}
      </div>
    );
  }
  reset = () => {
    this.refs.user.value = "";
    this.refs.pwd.value = "";
  };
  goload = () => {
    let student_id = this.refs.user.value.trim();
    let student_pwd = this.refs.pwd.value.trim();

    if (student_id && student_pwd) {
      let { goload } = this.props;
      goload({ student_id, student_pwd, ...this.props });
    } else {
      alert("您输入的信息不完整");
    }
  };
}

export default connect(
  state => {
    return {
      loading: state.loading
    };
  },
  dispatch => {
    return {
      goload: params => {
        dispatch({
          type: "load/goload",
          payload: params
        });
      }
    };
  }
)(Login);
