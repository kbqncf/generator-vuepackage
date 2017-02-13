import {CONFIG} from './config';
let _host=CONFIG.debugger?'http://mdev.zhaoyl.com':'http://m.zhaoyl.com';
let httpUrl={
  'sava':_host+'/wx/studentCard/save',
  'get':_host+'/wx/studentCard/get'
};
let WXhttp = {
  'checkOpenId':_host+'/wx/vote/redirect',
  'getWxAuthor':_host+'/ticket/get',
  'getUser':_host + '/wx/vote/getUser',
  'appId':CONFIG.debugger?'wxae3969df6f1d76fd':'wxef743b6a29c2f4d8'
};
export {httpUrl,WXhttp}