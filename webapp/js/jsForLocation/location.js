var zr;
var mapImage;// 地图
var mLocationShape;// 人
var mLinkShape;// 连线对象
var mGroup;// 所有位置点的集合
var mMode;// 模式
var mModeText;// 模式名
var timer;// 定时器
var empId;// 工号
var empName;// 姓名
var mDate;// 日期
var startTime;// 起始查询时间
var endTime;// 结束查询时间
var currentTime;// 当前时间
/**
 * 轨迹数组 [x方向物理坐标, y方向物理坐标, 时间, mapId, 地图的x方向物理尺寸,地图的x方向物理尺寸,地图的名称]
 */
var mPositionArray;
var mCurrentPosition;// 当前坐标的索引
var count;// 共有多少个位置点
var x;// 相对于初始位置的x轴偏移
var y;// 相对于初始位置的Y轴偏移
var speed;// 人的初始移动速度
var speedLevel;// 速度等级
var currentSpeed;// 人的移动速度
var isStarted;// 是否开始了
var isCompleted;// 是否播放完成
var isPlaying;// 当前播放状态
var isFirstQuery = true;// 是否是首次查询
var isError = false;// 是否有error
var scaleX;// x方向比例尺
var scaleY;// y方向比例尺
var scale=1;//比例尺
var mouseX0=0;//缩放原点x坐标
var mouseY0=0;//缩放原点y坐标
var currentPosition=[0,0];//当前位置点

// init();
initCanvas();

/**
 * 初始化画布 config zrender的js库路径 初始化地图 绘制mLocationShape 刷新StartButton
 */
function initCanvas() {
  console.log("initCanvas");
  // config zrender的js库路径
  require.config({
    packages : [ {
      name : 'zrender',
      location : '/BraceletS/js/3rdPartyLibrary/zrender',
      main : 'zrender'
    } ]
  });

  require([ 'zrender/zrender' ], function(zrender) {
    console.log("begin");
    // 获取可绘制的div
    zr = zrender.init(document.getElementById("locationpic"));
    initImage();
    addCircle();
    refreshStartButton(false,true);
  });
}

/**
 * 刷新开始按钮
 * 
 * @param arg1
 *            true 暂停 false 开始
 * @param arg2
 *            true :enable false: disable
 */
function refreshStartButton(arg1,arg2) { 
  console.log("refreshStartButton");
  if(arg1){
    if(arg2){
      document.getElementById("startbutton").style.backgroundImage ="url('/BraceletS/images/bg_btn_pause_enable.png')" ;
    }else{
      document.getElementById("startbutton").style.backgroundImage ="url('/BraceletS/images/bg_btn_pause_disable.png')" ;
    }
  }else{
    if(arg2){
      document.getElementById("startbutton").style.backgroundImage ="url('/BraceletS/images/bg_btn_start_enable.png')" ;
    }else{
      document.getElementById("startbutton").style.backgroundImage ="url('/BraceletS/images/bg_btn_start_disable.png')" ;
    }
  }
}

/**
 * 初始化 初始化画布 初始化查询参数 初始化轨迹数组
 */
function init() {
  console.log("init");
  // 检查画布是否已经初始化
  if (isFirstQuery) {
    //initCanvas();
    mapImage.style.opacity=1;
    zr.refresh();
    isFirstQuery = false;
  }

  initQueryParameters();
  if (isError) {
    isError = false;
  } else {
    initFlags();
    adjustMode(mMode);
    refreshModeSeleted(mMode);
    refreshSpeedSeleted(2);
    initPositionArray();
  }

}

/**
 * 初始化各种标志位及动画参数
 */
function initFlags() {
  console.log("initFlags");
  mMode = 0;
  mModeText = "动态显示";
  mCurrentPosition = 0;
  count = 0;
  x = 0;
  y = 0;
  speed = 500;
  speedLevel = 1;
  currentSpeed = speed * speedLevel;
  isStarted = false;
  isCompleted = false;
  isPlaying = false;
  scale=1;
  mouseX0=0;
  mouseY0=0;
  currentPosition=[0,0];
}

/**
 * 初始化地图
 */
function initImage() {
  console.log("initImage begin");
  require([ 'zrender/shape/Image' ], function(ImageShape) {
    mapImage = new ImageShape({
      style : {
        image : '/BraceletS/images/404.jpg',
        x : 1,
        y : 1,
        width : 900,
        height : 500,
        opacity : 0
      },
      clickable : true,
      onmousewheel : function(params) {
        //滚轮事件响应，对地图进行缩放
        console.log(params);
        var eventTool = require('zrender/tool/event');
        //获取是放大还是缩小
        var delta = eventTool.getDelta(params.event);
        //获取鼠标坐标
        var mouseX=eventTool.getX(params.event);
        var mouseY=eventTool.getY(params.event);
        console.log(delta);
        console.log(mouseX);
        console.log(mouseY);
        //计算鼠标坐标对应的原图坐标
        if(scale==1){
          mouseX0=mouseX;
          mouseY0=mouseY;
        }else{
          mouseX0=mouseX0+(mouseX-mouseX0)/scale;
          mouseY0=mouseY0+(mouseY-mouseY0)/scale;
        }
        
        if(delta>0){
          if(scale<6){
            scale++;
          }else{
            return;
          }
        }else{
          if(scale>1){
            scale--;
          }else{
            return;
          }
        }
        //对地图进行缩放
        mapImage.scale=[scale,scale,mouseX0,mouseY0];
        zr.modShape(mapImage);
        
        //刷新Canvas
        refreshCanvas();
        
        //拦截网页的滚动
        eventTool.stop(params.event);
      }
    });
    mapImage.zlevel = 0;
    mapImage.z = 0;
    // 鼠标在地图范围内时，地图不会高亮
    mapImage.hoverable = false;
    zr.addShape(mapImage);
    zr.render;
  });
}

/**
 * 绘制mLocationShape
 */
function addCircle() {
  console.log("addCircle begin");
  require([ 'zrender/shape/Circle' ], function(CircleShape) {
    mLocationShape = new CircleShape({
      style : {
        x : -3,
        y : -3,
        r : 5,
        color : 'rgba(220, 20, 60, 1)',
        text : '0 X:0 Y:0'
      }
    });
    mLocationShape.zlevel = 0;
    mLocationShape.z = 0;
    zr.addShape(mLocationShape);
    currentPosition=mLocationShape.position;
    zr.render;
    // startLocationAnimation();
    console.log("addCircle end");
  });
}

/**
 * 真正开始播放动画，刷新mLocationShape
 */
function startLocationAnimation() {
  console.log("startLocationAnimation begin");
  // 检查是否需要切换地图
  if (checkMap(mCurrentPosition)) {
    // 切换地图，计算比例尺
    switchMap(mPositionArray[mCurrentPosition][3]);
    computeScale(mPositionArray[mCurrentPosition][4], mPositionArray[mCurrentPosition][5]);
  }

  // 根据比例尺换算出像素坐标
  x = computeX(mPositionArray[mCurrentPosition][0] / scaleX);
  y = computeY(mPositionArray[mCurrentPosition][1] / scaleY);

  console.log("mCurrentPosition =" + mCurrentPosition);
  console.log("x0 =" + mPositionArray[mCurrentPosition][0]);
  console.log("y0 =" + mPositionArray[mCurrentPosition][1]);
  console.log("time =" + mPositionArray[mCurrentPosition][2]);
  console.log("x =" + x);
  console.log("y =" + y);

  // 移动mLocationShape
  mLocationShape.position = [ x, y ];
  currentPosition=mLocationShape.position;
  // 添加文字
  mLocationShape.style.text = mPositionArray[mCurrentPosition][2] + "\n" + "X" + mPositionArray[mCurrentPosition][0] + "\n" + "Y"
      + mPositionArray[mCurrentPosition][1];
  zr.modElement(mLocationShape);

  // 检查是否播放结束
  if (mCurrentPosition < count - 1) {
    mCurrentPosition++;
  } else {
    isCompleted = true;
    pauseAnimation();
  }
}

/**
 * 开始播放动画，进行状态检查，刷新StartButton
 */
function startAnimation() {
  console.log("StartButton become start");
  // 检查是否有位置数据
  if (count < 1) {
    alert("There is no location information !")
    return;
  }
  // 刷新StartButton
  refreshStartButton(true,true);
  // 检查是否是已经播放结束，如果是，重新播放
  if (isCompleted) {
    mCurrentPosition = 0;
    isCompleted = false;

  }
  // 根据currentSpeed定时刷新mLocationShape
  timer = setInterval(startLocationAnimation, currentSpeed);
  isPlaying = true;
}

/**
 * 暂停播放动画，刷新StartButton
 */
function pauseAnimation() {
  console.log("StartButton become pause");
  refreshStartButton(false,true);
  // 取消刷新mLocationShape
  clearInterval(timer);
  isPlaying = false;
}

/**
 * 调整动画播放速率
 */
function adjustSpeed(arg) {
  console.log("adjustSpeed");
  // 检查是否处于播放状态
  if (isPlaying) {
    // 处于播放状态，先暂停播放
    pauseAnimation();
    // 调整速率等级
    adjustSpeedLevel(arg);
    // 刷新当前播放速率
    currentSpeed = speed / speedLevel;
    // 重新播放动画
    startAnimation();
  } else {
    // 调整速率等级，刷新当前播放速率
    adjustSpeedLevel(arg);
    currentSpeed = speed / speedLevel;
  }
}

/**
 * 调整速率等级
 */
function adjustSpeedLevel(arg) {
  console.log("adjustSpeedLevel arg=" + arg);
  // 根据当前速率等级调整速率
  switch (Number(arg)) {
  case 1:
    // 0.2倍速率
    speedLevel = 0.2;
    break;
  case 2:
    // 0.5倍速率
    speedLevel = 0.5;
    break;
  case 3:
    // 正常速率
    speedLevel = 1;
    break;
  case 4:
    // 2倍速率
    speedLevel = 2;
    break;
  case 5:
    // 5倍速率
    speedLevel = 5;
    break;
  default:
    break;
  }
}

/**
 * 调整显示模式
 * 
 * @param arg
 *            要显示的模式
 */
function adjustMode(arg) {
  clearCanvas();
  console.log("adjustMode arg=" + arg);
  // 根据arg切换显示模式
  switch (Number(arg)) {
  case 0:
    // 切换为动态显示模式
    enableAnimation();
    mMode = 0;
    break;
  case 1:
    // 切换为静态图点模式
    addAllLocation();
    mMode = 1;
    break;
  case 2:
    // 切换为线连轨迹模式
    linkAllLocation();
    mMode = 2;
    break;
  default:
    console.log("no mode=" + arg);
    break;
  }
}

/**
 * 清除画布
 */
function clearCanvas() {
  console.log("clearMode mMode=" + mMode);
  // 根据当前显示模式clear
  switch (mMode) {
  case 0:
    // clear动态显示
    disableAnimation();
    break;
  case 1:
    // clear静态图点
    clearAllLocation();
    break;
  case 2:
    // clear线连轨迹
    clearLinkShape();
    break;
  default:
    break;
  }
}

/**
 * 初始化查询参数 工号 时间
 */
function initQueryParameters() {

  // 获取empId
  if(privilege == 1||privilege ==2){
    empId = document.getElementById("input_id").value;
  }else{
    empId=selectedMemberId;
  }
  
  mDate = document.getElementById("input_date").value;
  startTime = mDate + " " + document.getElementById("input_start_time").value;
  endTime = mDate + " " + document.getElementById("input_end_time").value;

  if (!checkQueryParameters()) {
    isError = true;
  }

  console.log("empId" + empId);
  console.log("mDate" + mDate);
  console.log("startTime" + startTime);
  console.log("endTime" + endTime);
}

/**
 * 检查查询参数是否正确
 * 
 * @returns {Boolean} 查询参数是否正确
 */
function checkQueryParameters() {
  if (mDate == "") {
    alert("请选择日期！");
    return false;
  } else if (startTime == (mDate + " ") || endTime == (mDate + " ")) {
    alert("起止时间不能为空，请重新输入！");
    return false;
  } else if (startTime > endTime) {
    alert("截止时间需晚于开始时间，请重新输入！");
    return false;
  } else if (empId == ""||empId =="请输入工号") {
    alert("请检查工号！");
    return false;
  } else {
    return true;
  }
}

/**
 * 初始化轨迹数组
 */
function initPositionArray() {
  console.log("initPositionArray begin");
  mPositionArray = new Array(7);

  $.ajax({
    type : "POST",
    url : "/BraceletS/queryLocation.action",
    data : {
      empId : empId,
      startTime : startTime,
      endTime : endTime
    },
    dataType : "JSON",
    success : function(result) {
      // 查询成功

      // 检查姓名信息是否为空
      if (result.empName != null) {
        empName = result.empName;
      }else{
        empName="工号不存在";
      }

      console.log("ajax success");
      console.log(result);
      count = result.location.length;
      console.log("count=" + count);
      if (count >= 1) {
        for (var i = 0; i < count; i++) {
          var braceletId = result.location[i].braceletId;
          var locX = result.location[i].locX;
          var locY = result.location[i].locY;
          var time = result.location[i].time;
          var mapId = result.location[i].mapId.mapId;
          var phyX = result.location[i].mapId.phyX;
          var phyY = result.location[i].mapId.phyY;
          var areaName = result.location[i].mapId.areaName;
          // console.log(braceletId);
          // console.log(locX);
          // console.log(locY);
          // console.log(time);

          mPositionArray[i] = [ locX, locY, time, mapId, phyX, phyY, areaName ];
        }
        updateMembersList();
        updateInformation(false, true);
        onStartButtonClicked();
      } else {
        // 移动mLocationShape
        switchMap(404);
        mLocationShape.position = [ -5, -5 ];
        currentPosition=mLocationShape.position;
        zr.modElement(mLocationShape);
        alert(updateInformation(false, false));
      }

    },
    error : function(result) {
      // 查询失败
      alert("Server error !");
    }
  });
}

/**
 * 根据输入的参数（empId，startTime，endTime），查询对应员工该时间段的位置信息
 */
function queryLocation() {
  clearCanvas();
  if(scale!=1){
    mapImage.scale=[1,1,0,0];
    zr.modShape(mapImage);
  }
  // 检查是否处于播放状态
  if (isPlaying) {
    // 暂停播放
    pauseAnimation();
    mLocationShape.position = [ -5, -5 ];
    currentPosition=mLocationShape.position;
    zr.modElement(mLocationShape);
  }
  // 初始化，初始化完成后就可以点击播放从而播放动画

  init();
}

/**
 * 根据empId查询该员工最近的一次位置信息
 */
function queryCurrentLocation() {
  console.log("queryCurrentLocation");
  if(scale!=1){
    mapImage.scale=[1,1,0,0];
    zr.modShape(mapImage);
  }
  // 检查是否需要初始化画布
  if (isFirstQuery) {
    //initCanvas();
    mapImage.style.opacity=1;
    zr.refresh();
    isFirstQuery = false;
  }

  // 获取empId
  if(privilege == 1||privilege ==2){
    empId = document.getElementById("input_id").value;
    if(empId=="请输入工号"||empId==""){
      alert("请检查工号！");
      return;
    }
  }else{
    empId=selectedMemberId;
  }
  
  //获取currentTime
  currentTime = getNowFormatDate();
  $.ajax({
    type : "POST",
    url : "/BraceletS/currentLocation.action",
    data : {
      empId : empId,
      time : currentTime
    },
    dataType : "JSON",
    success : function(result) {
      // 查询成功
      console.log("ajax success");
      console.log(result);

      // 检查姓名信息是否为空
      if (result.empName != null) {
        empName = result.empName;
      }else{
        empName="工号不存在";
      }

      // 检查位置信息是否为空
      if (result.currentLocation != null) {
        var braceletId = result.currentLocation.braceletId;
        var locX = result.currentLocation.locX;
        var locY = result.currentLocation.locY;
        var time = result.currentLocation.time;
        var mapId = result.currentLocation.mapId.mapId;
        var phyX = result.currentLocation.mapId.phyX;
        var phyY = result.currentLocation.mapId.phyY;
        var areaName = result.currentLocation.mapId.areaName;
        // 检查当前是否正在播放动画
        if (isPlaying) {
          pauseAnimation();
        }
        // 检查当前播放模式，看是否需要清除一些图像并enableAnimation
        if (mMode != 0) {
          adjustMode(0);
          refreshModeSeleted(mMode);
        }

        // 初始化各种标志位及动画参数
        initFlags();
        refreshSpeedSeleted(2);

        // 切换地图，计算比例尺
        switchMap(mapId);
        computeScale(phyX, phyY);

        // 根据比例尺得到像素坐标
        mLocationShape.position = [ computeX(locX / scaleX), computeY(locY / scaleY) ];
        currentPosition=mLocationShape.position;
        console.log(computeX(locX / scaleX));
        console.log(computeY(locY / scaleY));

        // 添加文字
        mLocationShape.style.text = time + "\n" + "X" + locX + "\n" + "Y" + locY;

        // 移动mLocationShape
        zr.modElement(mLocationShape);
        console.log(mLocationShape);

        // 刷新下属列表
        updateMembersList();
        // 刷新提示信息
        updateInformation(true, true);
      } else {
        // 检查当前是否正在播放动画
        if (isPlaying) {
          pauseAnimation();
        }
        // 检查当前播放模式，看是否需要清除一些图像并enableAnimation
        if (mMode != 0) {
          adjustMode(0);
          refreshModeSeleted(mMode);
        }

        // 初始化各种标志位及动画参数
        initFlags();
        refreshSpeedSeleted(2);

        // 切换地图
        switchMap(404);
        // 没有位置信息
        
        // 移动mLocationShape
        mLocationShape.position = [ -5, -5 ];
        currentPosition=mLocationShape.position;
        zr.modElement(mLocationShape);
        
        
        alert(updateInformation(true, false));
      }
    },
    error : function(result) {
      // 查询失败
      alert("Server error !");
    }
  });

}

/**
 * 刷新下属列表
 */
function updateMembersList() {
  console.log("updateMembersList");
  // 检查是否需要刷新
  if (empId != selectedMemberId) {
    console.log("empId != selectedMemberId");
    console.log("empId = " + empId);
    console.log("selectedMemberId = " + selectedMemberId);
    // 恢复之前选中人的姓名颜色
    document.getElementById(selectedMemberId).style.color = "#0986ff";
    // 检查当前查询人员是否在下属列表
    if (document.getElementById(empId) != null) {
      console.log("document.getElementById(empId) != null");
      // 在下属列表置黑当前查询人员的姓名
      document.getElementById(empId).style.color = "#000000";
      selectedMemberId = empId;
    }
  }
}

/**
 * 获取当前时间
 * 
 * @returns {String}
 */
function getNowFormatDate() {
  console.log("getNowFormatDate");
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
  console.log(currentdate);
  return currentdate;
}

/**
 * 更新查询结果提示信息 工号 时间
 * 
 * @param arg0
 *            是否只有一个时间点
 * @param arg1
 *            是否有数据
 * @returns {String}
 */
function updateInformation(arg0, arg1) {
  console.log("updateInformation");
  var name = empName;
  var time1 = startTime + " ";
  var seperator1 = "- ";
  var time2 = endTime + " ";
  var location1 = "的最新位置如下：";
  var location2 = "的位置轨迹如下：";
  var location3 = " 无定位信息";
  var location4 = " 无轨迹信息";
  if (arg1) {
    if (arg0) {
      var locationInformation = location1;
      var timeInformation = "";
    } else {
      var locationInformation = location2;
      var timeInformation = time1 + seperator1 + time2;
    }
  } else {
    if (arg0) {
      var locationInformation = location3;
      var timeInformation = currentTime;
    } else {
      var locationInformation = location4;
      var timeInformation = time1 + seperator1 + time2;
    }
  }

  $("#information").empty();
  if(name=="工号不存在"){
    $("#information").append(name);
    return name;
  }else{
    $("#information").append(name + timeInformation + locationInformation);
    return name + timeInformation + locationInformation;
  }
  
}

/**
 * 计算比例尺
 * 
 * @param arg0
 *            地图x方向的物理尺寸
 * @param arg1
 *            地图y方向的物理尺寸
 */
function computeScale(arg0, arg1) {
  console.log("computeScale");
  scaleX = arg0 / 900;
  scaleY = arg1 / 500;
}


/**
 * 计算x坐标
 * @param x 原地图上的x坐标
 * @returns x 缩放后的x坐标
 */
function computeX(x){
  console.log("computeX");
  x=(x-mouseX0)*scale+mouseX0;
  return x;
}

/**
 * 计算y坐标
 * @param y 原地图上的y坐标
 * @returns y 缩放后的y坐标
 */
function computeY(y){
  console.log("computeY");
  y=(y-mouseY0)*scale+mouseY0;
  return y;
}

/**
 * 切换地图
 * 
 * @param arg0
 *            需要切换的地图的ID
 */
function switchMap(arg0) {
  console.log("switchMap");
  zr.modShape(mapImage, {
    style : {
      image : '/BraceletS/images/' + arg0 + '.jpg',
    }
  });
  //zr.refresh();
}

/**
 * 与之前的点相比，检查是否需要切换地图
 * 
 * @param arg
 *            要检查的点在mPositionArray中的索引
 * @returns {Boolean} 是否需要切换地图
 */
function checkMap(arg) {
  console.log("checkMap");
  if (arg == 0) {
    return true;
  }
  var map1 = mPositionArray[arg][3];
  var map2 = mPositionArray[arg - 1][3];
  if (map1 != map2) {
    return true;
  } else {
    return false;
  }
}

/**
 * enable动画
 */
function enableAnimation() {
  console.log("enableAnimation");
  // 复原 SpeedSelect StartButton的颜色
  document.getElementById("select_speed").disabled = false;
  document.getElementById("select_speed").style.backgroundImage ="url('/BraceletS/images/bg_select_speed.png')" ;
  refreshStartButton(false,true);
  // 显示mLocationShape
  zr.modShape(mLocationShape, {
    style : {
      color : 'rgba(220, 20, 60, 1)'
    }
  });
  //zr.refresh();
}

/**
 * disable动画
 */
function disableAnimation() {
  console.log("disableAnimation");
  // 检查是否需要暂停动画
  if (isPlaying) {
    pauseAnimation();
  }
  // 置灰SpeedSelect和StartButton,并隐藏mLocationShape
  document.getElementById("select_speed").disabled = true;
  document.getElementById("select_speed").style.backgroundImage ="url('/BraceletS/images/bg_select_speed_disable.png')" ;
  refreshStartButton(false,false);
  zr.modShape(mLocationShape, {
    style : {
      color : 'rgba(220, 20, 60, 0)'
    }
  });
  //zr.refresh();
}

/**
 * 清除mLinkShape
 */
function clearLinkShape() {
  console.log("clearLinkShape");
  // 检查是否有mLinkShape需要清除
  if (mLinkShape == null) {
    return;
  }
  // 忽略mLinkShape的绘制
  console.log("mLinkShape.ignore = true");
  mLinkShape.ignore = true;
  zr.refresh();
}

/**
 * 清除所有静态图点
 */
function clearAllLocation() {
  console.log("clearAllLocation");
  // 检查有没有图点需要清除
  if (mGroup == null) {
    return;
  }
  // 忽略mGroup的绘制
  console.log("mGroup.ignore = true");
  mGroup.ignore = true;
  zr.refresh();
}

/**
 * 绘制所有的位置点
 */
function addAllLocation() {
  console.log("addAllLocation begin");
  // 检查是否有位置信息
  if (count < 1) {
    alert("There is no location information !");
    return;
  }
  // 获取位置点数组
  var AllLocationList = getAllLocationList();
  if (AllLocationList != null) {
    // 多张地图的位置点绘制暂时未完成，目前只绘制第一段连续位置
    // 切换到第一张地图,绘制第一张图上的点
    switchMap(AllLocationList[0][1]);
    var mGroupList = AllLocationList[0][0];
    require([ 'zrender/Group' ], function(GroupShape) {
      // 检查mGroup是否需要clear
      if (mGroup != null) {
        // 清除之前绘制的点
        console.log("mGroup.clearChildren");
        mGroup.clearChildren();
      }
      mGroup = new GroupShape();
      require([ 'zrender/shape/Circle' ], function(CircleShape) {
        for (var i = 0; i < mGroupList.length; i++) {
          mGroup.addChild(new CircleShape({
            style : {
              x : mGroupList[i][0],
              y : mGroupList[i][1],
              r : 3,
              color : 'rgba(220, 20, 60, 1)'
            }
          }));
        }
      });
      mGroup.zlevel = 0;
      mGroup.z = 0;
      console.log("mGroup.ignore = false");
      mGroup.ignore = false;
      zr.addShape(mGroup);
      zr.render;
    });

  } else {
    alert("There is no location information !");
    return;
  }
}

/**
 * 绘制所有的位置点并连续
 */
function linkAllLocation() {
  console.log("linkAllLocation");
  // 检查是否有位置信息
  if (count < 1) {
    alert("There is no location information !");
    return;
  }
  // 获取位置点数组
  var AllLocationList = getAllLocationList();
  if (AllLocationList != null) {
    console.log(AllLocationList);
    // 多张地图的位置点绘制暂时未完成，目前只绘制第一段连续位置
    // 切换到第一张地图,绘制第一张图上的点
    switchMap(AllLocationList[0][1]);
    require([ 'zrender/shape/Polyline' ], function(PolylineShape) {
      // 检查是否需要初始化
      if (mLinkShape != null) {
        zr.delShape(mLinkShape.id);
      }
      mLinkShape = new PolylineShape({
        style : {
          pointList : AllLocationList[0][0],
          lineWidth : 1,
          strokeColor : 'rgba(220, 20, 60, 1)',
        }
      });

      mLinkShape.zlevel = 0;
      mLinkShape.z = 0;
      // 取消鼠标覆盖时高亮
      mLinkShape.hoverable = false;
      zr.addShape(mLinkShape);
      zr.render;

    });

  } else {
    alert("There is no location information !");
    return;
  }
}

/**
 * 获取所有位置信息的数组
 * 
 * @returns
 */
function getAllLocationList() {
  console.log("getAllLocationList");
  // 检查是否有位置
  if (count < 1) {
    alert("There is no location information !");
    return null;
  }

  var listWithMap = new Array(2);// [该地图上的连续的位置，地图id]
  var list = new Array(2);// [x方向的像素坐标，y方向的像素坐标]
  var mapCount = 0;// 切换地图的数量
  var j = 0;
  var x0;
  var y0;

  // 每当切换地图时，将接下来的位置信息存入一个新的数组
  for (var i = 0; i < count; i++) {
    if (checkMap(i)) {
      if (mapCount != 0) {
        listWithMap[mapCount - 1] = [ list, mPositionArray[i - 1][3] ];
        list = new Array(2);
        j = 0;
      }
      mapCount++;
    }
    x0=mPositionArray[i][0] / (mPositionArray[i][4] / 900);
    y0=mPositionArray[i][1] / (mPositionArray[i][5] / 500);
    list[j] = [ computeX(x0), computeY(y0) ];
    j++;
  }
  listWithMap[mapCount - 1] = [ list, mPositionArray[count - 1][3] ];
  return listWithMap;
}

/**
 * 开始按钮点击响应事件
 */
function onStartButtonClicked() {
  // 点击事件触发
  console.log("onStartButtonClicked");
  if (mMode == 0) {
    // 当前处于动态显示模式
    if (isPlaying) {
      // 正在播放中，暂停动画
      pauseAnimation();
    } else {
      // 开始播放动画
      startAnimation();
    }
  }
}

/**
 * 刷新模式选择器
 * 
 * @param arg
 *            要显示的模式
 */
function refreshModeSeleted(arg) {
  console.log("refreshModeSeleted");
  document.getElementById("select_mode").selectedIndex = arg;
}

/**
 * 刷新速度选择器
 * 
 * @param arg
 *            要显示的速度
 */
function refreshSpeedSeleted(arg) {
  console.log("refreshSpeedSeleted");
  document.getElementById("select_speed").selectedIndex = arg;
}


/**
 * 刷新Canvas
 */
function refreshCanvas(){
  switch (mMode) {
  case 0:
    // 刷新位置点
    if(!isPlaying){
      if(mLocationShape!=null){
        mLocationShape.position=[computeX(currentPosition[0]),computeY(currentPosition[1])];
      }
    }
    break;
  case 1:
    // 刷新静态图点
    addAllLocation();
    break;
  case 2:
    // 刷新线连轨迹
    linkAllLocation();
    break;
  default:
    console.log("no mode=" + mMode);
    break;
  }
}
