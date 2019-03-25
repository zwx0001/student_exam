import React, { Component } from "react";
import "./index.scss";
import http from "../../utils/http";
import CodeMirror from "react-codemirror"; //在组件中导入引用
import "codemirror/lib/codemirror.css"; //在组件中导入样式
import "codemirror/mode/sql/sql"; //导入语言类型
import "codemirror/addon/hint/show-hint.css"; //按ctrl+空格进行提示功能：
import "codemirror/addon/hint/show-hint.js"; //按ctrl+空格进行提示功能：
import "codemirror/addon/hint/sql-hint.js"; //导入提示语言类型
import "codemirror/addon/comment/comment";
import "codemirror/keymap/sublime";
import "codemirror/theme/ambiance.css"; //导入theme文件
import MarkdownIt from "markdown-it";
import hoc from "../../hoc";

let md = new MarkdownIt();

class Test extends Component {
  state = {
    userInfo: {},
    data: "",
    questions: [],
    count: 0,
    lastTime: "",
    code: "// Write your code", //select * from AAA
    timer: null,
    style_width: ["con_left width_1", "con_left width_3", "con_left width_2"],
    style_width_idx: 0,
    title_idx: 0,
    flag: false,
    answer: []
  };
  render() {
    let { count } = this.state;

    let ques = this.state.questions[count];
    const options = {
      lineNumbers: true, //显示行号
      mode: { name: "text/x-mysql" }, //定义mode
      extraKeys: { Ctrl: "autocomplete" }, //自动提示配置
      theme: "ambiance", //选中的theme
      autofocus: true,
      showCursorWhenSelecting: true,
      keyMap: "sublime",
      indentUnit: 4,
      tabSize: 4
    };
    let result = ques && md.render(ques.questions_stem);
    let userInfo = this.state.userInfo;
    return (
      <div className="test">
        {userInfo && ques ? (
          <div>
            <div className="title">
              <p>八维研修学院</p>
              <p>用户名:{userInfo.student_name}</p>
            </div>
            <div className="title tit">
              <p style={{ width: "70%" }}>
                第{count + 1}题:{ques.title}
                <span style={{ fontSize: "14px", marginLeft: "10px" }}>
                  ({ques.questions_type_text})
                </span>
              </p>
              <p>剩余时间: {this.state.lastTime}</p>
            </div>
            <div className="scale">
              <span>调试比例:</span>
              <button onClick={() => this.onChangeScale(0)}>1:1</button>
              <button onClick={() => this.onChangeScale(1)}>2:1</button>
              <button onClick={() => this.onChangeScale(2)}>1:2</button>
            </div>
            <div className="content">
              <div
                className={this.state.style_width[this.state.style_width_idx]}
              >
                <div className="question_title">
                  <span className="active">题目描述</span>
                  <span>其他</span>
                  <span>评论</span>
                </div>
                <p dangerouslySetInnerHTML={{ __html: result }} />
              </div>
              <div className="con_right">
                <p>答题框:</p>
                <CodeMirror
                  ref="editorsql"
                  value={this.state.code}
                  onChange={code => this.updateCode(code)}
                  options={options}
                />
              </div>
            </div>
            <div className="bottom">
              <div className="btn_list">
                <button onClick={this.toggle}>题目列表</button>
                <div className="btn_button">
                  <button className="prev" onClick={this.prev}>
                    上一题
                  </button>
                  <button
                    className="next"
                    style={{ marginLeft: "10px" }}
                    onClick={this.next}
                  >
                    下一题
                  </button>
                </div>
              </div>
              <button className="submit" onClick={this.submit}>
                提交
              </button>
              {this.state.flag ? (
                <div className="titlelist">
                  {this.state.questions &&
                    this.state.questions.map((item, index) => (
                      <p
                        className={
                          this.state.title_idx === index ? "active" : ""
                        }
                        key={index}
                        onClick={() => this.goTitle(index)}
                      >
                        {index + 1}.{item.title}
                      </p>
                    ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
  updateCode = newCode => {
    let { count, answer } = this.state;
    answer[count] = newCode;
    this.setState({
      code: newCode,
      answer
    });
  };

  componentDidMount() {
    let that = this;
    http.get("/student/info").then(
      data => {
        if (data.code === 1) {
          let userInfo = data.data[0];
          that.setState({
            userInfo
          });

          http.get(`/exam/unstart/${userInfo.exam_exam_id}`).then(
            data => {
              if (data.code === 1) {
                that.setState({
                  data: data.data,
                  questions: data.data.questions
                });
              } else {
                alert(data.msg);
              }
            },
            err => {
              alert(err);
            }
          );

          let { start_time, end_time } = userInfo;
          let remain = end_time - start_time;
          this.state.timer = setInterval(() => {
            remain -= 1000;
            let h = parseInt((remain / 1000 / 60 / 60) % 24);
            let m = parseInt((remain / 1000 / 60) % 60);
            let s = parseInt((remain / 1000) % 60);
            that.setState({
              lastTime: `${h}时${m}分${s}秒`
            });
            if (remain === 0) {
              clearInterval(this.state.timer);
            }
          }, 1000);
        }
      },
      err => {
        alert(err);
      }
    );
  }
  onChangeScale = params => {
    //切换比列
    this.setState({
      style_width_idx: params
    });
  };
  next = () => {
    //切换下一题
    let { count, answer } = this.state;
    const editor = this.refs.editorsql.getCodeMirror();
    let len = this.state.questions.length;
    count++;
    if (count >= len) {
      count = len - 1;
      alert("已经做到最后一题了！");
    }
    if (answer[count]) {
      editor.setValue(answer[count]);
    } else {
      editor.setValue("");
    }
    this.setState({
      count,
      // answer,
      title_idx: count
    });
  };
  prev = () => {
    //切换上一题
    let { count, answer } = this.state;
    const editor = this.refs.editorsql.getCodeMirror();
    let len = this.state.questions.length;
    count--;
    if (count < 0) {
      count = 0;
      alert("已经到一题了！");
    }
    if (answer[count]) {
      editor.setValue(answer[count]);
    } else {
      editor.setValue("");
    }
    this.setState({
      count,
      title_idx: count
    });
  };
  submit = () => {
    let sure = confirm("确定提交试卷嘛？");
    if (sure) {
      let { exam_exam_id, start_time, end_time, questions } = this.state.data;
      let { answer } = this.state;
      let that = this;
      answer.map((item, index) => {
        questions[index].student_answer = item;
      });

      start_time = Number(start_time);
      end_time = Number(end_time);

      http
        .post("/exam/student", {
          //提交试卷
          exam_exam_id,
          start_time,
          end_time,
          questions
        })
        .then(
          data => {
            if (data.code === 1) {
              alert(data.msg);
              that.props.history.push("/");
            } else {
              alert(data.msg);
            }
          },
          err => {
            alert(err);
          }
        );
    }
  };
  goTitle = idx => {
    const editor = this.refs.editorsql.getCodeMirror();

    this.setState(
      {
        title_idx: idx,
        count: idx
      },
      () => {
        let { count, answer } = this.state;
        if (answer[count]) {
          editor.setValue(answer[count]);
        } else {
          editor.setValue("");
        }
      }
    );
  };
  toggle = () => {
    this.setState({
      flag: !this.state.flag
    });
  };
  componentWillUnmount() {
    //销毁定时器
    clearTimeout(this.state.timer);
  }
}

export default hoc(Test);
