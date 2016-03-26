var testBrowser = appInfo();
console.log(" testBrowser.appname = " + testBrowser.appname);
console.log(" testBrowser.version = " + testBrowser.version);
if (testBrowser.appname == "msie" && testBrowser.version < 10.0) {
  alert("不兼容IE10以下版本的浏览器!");
}

function appInfo(){
  var browser = {appname: 'unknown', version: 0},
      userAgent = window.navigator.userAgent.toLowerCase();
  //IE,firefox,opera,chrome,netscape
  if ( /(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test( userAgent ) ){
    browser.appname = RegExp.$1;
    browser.version = RegExp.$2;
  } else if ( /version\D+(\d[\d.]*).*safari/.test( userAgent ) ){ // safari
    browser.appname = 'safari';
    browser.version = RegExp.$2;
  }
  return browser;
}
