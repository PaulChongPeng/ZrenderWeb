$('#input_date').datetimepicker({
  language : 'zh-CN',// 语言
  format : "yyyy-mm-dd",// 结果格式
  autoclose : true,// 选择一个时间后关闭该选择器
  minView : "month"// 所能提供的最精确的视图
});
$('#input_start_time').datetimepicker({
  language : 'zh-CN',// 语言
  format : "hh:ii:ss",// 结果格式
  autoclose : true,// 选择一个时间后关闭该选择器
  minView : "hour",// 所能提供的最精确的视图
  maxView : "day",// 最高能展示的选择范围
  startView : "day",// 首先显示的视图
  minuteStep:2//分钟间隔
}).on(
    "click",
    function(ev) {
      $('#input_start_time').datetimepicker("setStartDate",
          $('#input_data').val());
    });
$('#input_end_time').datetimepicker({
  language : 'zh-CN',// 语言
  format : "hh:ii:ss",// 结果格式
  autoclose : true,// 选择一个时间后关闭该选择器
  minView : "hour",// 所能提供的最精确的视图
  maxView : "day",// 最高能展示的选择范围
  startView : "day",// 首先显示的视图
  minuteStep:2//分钟间隔
}).on(
    "click",
    function(ev) {
      $('#input_start_time').datetimepicker("setStartDate",
          $('#input_data').val());
    });