import http from "../utils/http";
export function goloading(params) {
  //学生登录请求
  return http.post("/student/login", params);
}
// export function getUserInfo() {
//   //获取用户信息
//   return http.get("/student/info");
// }
