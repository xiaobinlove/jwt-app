import http from './fetch'
// 获取任务详情
const getUserTaskDetails = (params) => {
  return http.post('/service-mjcj/mjcjJjdb/getUserTaskDetails', {}, {
    params: params
  })
}
// 签收，到达现场，完成
const taskCoupleBack = (params) => {
  return http.post('/service-mjcj/mjcjCjdb/taskCoupleBack', {}, {
    params: params
  })
}
// 未处理列表
const getPendingUserTask = (params) => {
  return http.post('/service-mjcj/mjcjJjdb/getPendingUserTask', {}, {
    params: params
  })
}
// 修改案发地址
const changeCaseAdress = (params) => {
  return http.post('/service-mjcj/mjcjJjdb/updateJcjJjdb', {}, {
    params: params
  })
}
export {getUserTaskDetails, taskCoupleBack, getPendingUserTask, changeCaseAdress}
