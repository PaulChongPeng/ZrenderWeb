//获取div下面所有的a标签（返回节点对象）
var myNav = document.getElementById("tabs_nav").getElementsByTagName("a");
// 获取当前窗口的url
var myURL = document.location.href;
// 循环div下面所有的链接，
for (var i = 1; i < myNav.length; i++) {
  // 获取每一个a标签的herf属性
  var links = myNav[i].getAttribute("href");
  var myURL = document.location.href;
  // 查看div下的链接是否包含当前窗口，如果存在，则给其添加样式
  if (myURL.indexOf(links) != -1) {
    myNav[i].className = "on";
    myNav[0].className = "";
  }
}