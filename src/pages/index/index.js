// 引入jQuery（最新版）
import $ from 'jquery';
// 引入Bootstrap JS（依赖Popper）
import 'bootstrap';

import '@/common/style/common.bootstrap.self.scss'
import './index.self.less'

// jQuery业务逻辑
$(document).ready(() => {
  $('#btn').click(() => {
    $('#jquery-demo').text('jQuery事件触发成功！Bootstrap样式生效');
  });
});