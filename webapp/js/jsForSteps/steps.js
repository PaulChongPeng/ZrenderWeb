var arr1 = [];
var arr2 = [];
var myChart = echarts.init(document.getElementById('main'));
var time = document.getElementById("input_data").value;
// 指定图表的配置项和数据
function drawchart() {
  myChart.clear();
  var option = {
    tooltip : {
      trigger : 'axis'
    },
    title : {
      show : true,
      x : 'center',
      y : 'top',
      text : '步数：' + arr2[arr2.length - 1],

    },
    toolbox : {
      show : true,
      feature : {
        dataZoom : {
          show : true
        },
        mark : {
          show : true
        },
        dataView : {
          show : false,
          readOnly : false
        },
        magicType : {
          show : true,
          type : [ 'line', 'bar' ]
        },
        restore : {
          show : true
        },
        saveAsImage : {
          show : false
        }
      }
    },
    calculable : true,
    xAxis : [ {
      type : 'category',
      boundaryGap : false,
      axisLabel : {
        show : true,
        interval : 30

      },
      data : arr1
    } ],
    yAxis : [ {
      type : 'value'
    } ],
    series : [ {
      name : '计步',
      type : 'line',
      smooth : true,
      itemStyle : {
        normal : {
          areaStyle : {
            type : 'default'
          }
        }
      },
      data : arr2
    } ]
  };
  myChart.setOption(option);
  if (time != "") {
    if (new Date(time).toDateString() != new Date().toDateString()) {
      console.log("myChart 222 time =" + time);
      var option2 = {
        title : {
          show : false,
        }

      }
      myChart.setOption(option2, false);
    }
  }

}
// 使用刚指定的配置项和数据显示图表。

function initxAxis() {
  time = document.getElementById("input_data").value;
  var inputemployid = document.getElementById("input_id").value;
  if (inputemployid == "") {

    var empid = selectedMemberId;
    console.log("querycurrent empid  =" + empid);
  } else
    var empid = inputemployid;
  console.log("querycurrent selectedMemberId  =" + selectedMemberId);
  console.log("querycurrent time =" + time);
  $.ajax({
    type : "post",
    async : false,
    url : "/BraceletS/stepsquery.action",
    data : {
      time : time,
      empId : empid
    },
    dataType : "json", // 返回数据形式为json
    success : function(result) {
      myChart.showLoading({
        text : '正在努力的读取数据中...', // loading话术
      });
      var count = result.heartbeatList.length;
      console.log("count=" + count);
      if (count == 0) {
        myChart.hideLoading();
        myChart.clear();
        arr1.length = 0;
        arr2.length = 0;
        // drawchart();
        alert("没有查询到当天的数据!");
      } else {
        if (result) {
          arr1.length = 0;
          arr2.length = 0;
          myChart.hideLoading();
          arr1.length = 0;
          arr2.length = 0;

          for (var i = 0; i < count; i++) {
            console.log(result.heartbeatList[i].time);
            console.log(result.heartbeatList[i].steps);
            arr1.push(result.heartbeatList[i].time);
            arr2.push(result.heartbeatList[i].steps);

          }
        }

        drawchart();
      }
    },
    error : function(errorMsg) {
      alert("不好意思，大爷，图表请求数据失败啦!");
      myChart.hideLoading();

    }
  })
}

function querycurrent(id) {
  var empId = id;
  time = document.getElementById("input_data").value;

  $.ajax({
    type : "post",
    async : false,
    url : "/BraceletS/stepsquery.action",
    data : {
      time : time,
      empId : empId
    },
    dataType : "json", // 返回数据形式为json
    success : function(result) {
      var count = result.heartbeatList.length;
      console.log("count=" + count);
      if (count == 0) {

        arr1.length = 0;
        arr2.length = 0;
        // drawchart();
        myChart.clear();
        alert("没有查询到当天的数据!");
      } else {
        if (result) {
          arr1.length = 0;
          arr2.length = 0;
          for (var i = 0; i < count; i++) {
            arr1.push(result.heartbeatList[i].time);
            arr2.push(result.heartbeatList[i].steps);
            console.log(arr1[i]);
            console.log(arr2[i]);
          }
        }
        drawchart();
      }
    },
    error : function(errorMsg) {
      alert("不好意思，大爷，图表请求数据失败啦!");
      myChart.hideLoading();
    }
  })

}
function exceloutsteps() {
  var url = "/BraceletS/excleoutstepsfile.action";
  var emp_id = 2309326;
  time = document.getElementById("input_data").value;
  var inputemployid = document.getElementById("input_id").value;
  console.log("steps query begin");
  $.ajax({
    type : "post",
    url : url,
    data : {

      time : time
    },
    dataType : "JSON",
    success : function(result) {
      console.log("ajax success");
      console.log(result);

    },
    error : function(result) {
      alert("Server error !");
    }
  })
}

function exportSteps() {
  var url = "/BraceletS/exceloutheartbeatfile.action";
  var id = 0;
  var name = "";
  var employeeid = "";
  var date = "";
  var querytime = "";
  var steps = 0;
  var empId;// 工号
  time = document.getElementById("input_data").value;
  var inputemployid = document.getElementById("input_id").value;
  if (inputemployid == "") {

    var empid = selectedMemberId;
    console.log("querycurrent empid  =" + empid);
  } else
    var empid = inputemployid;
  console.log(time);
  console.log("exportHeartbeat  time=" + time);
  console.log("exportHeartbeat  selectedMemberId=" + selectedMemberId);
  //empId = selectedMemberId;
  // console.log("emp_id:"+emp_id+", time:"+time);
  $.ajax({
    type : "post",
    url : url,
    data : {
      empId : empid,
      time : time
    },
    dataType : "JSON",
    success : function(result) {
      var _str = "序号,工号,姓名,日期,时间,步数\n";
      var count = result.heartbeatList.length;
      if (count > 0) {
        for (var i = 0; i < count; i++) {
          id = i;
          console.log("export heartbeat i =" + i);
          employeeid = result.heartbeatList[i].empId;
          console.log("export heartbeat employeeid =" + employeeid);
          console.log("export heartbeat result.heartbeatList[i].empId ="
              + result.heartbeatList[i].empId);
          name = result.heartbeatList[i].name;
          date = result.heartbeatList[i].date;
          querytime = result.heartbeatList[i].time;
          steps = result.heartbeatList[i].steps;
          _str += id + "," + employeeid + "," + name + "," + date + ","
              + querytime + "," + steps + "\n";

        }

        var BB = self.Blob;
        var localtime = new Date();
        if (time == "")
          time = localtime.toLocaleDateString();
        saveAs(new BB([ "\ufeff" + _str ] // \ufeff防止utf8 bom防止中文乱码
        , {
          type : "text/plain;charset=utf8"
        }), empid +'_'+ name + "_" + time+ "_"+"计步"+ ".xls");
      }else{
        alert("没有查询到当天数据");
      }
    },
    error : function(result) {
      alert("Server error !");
    }
  })
}
