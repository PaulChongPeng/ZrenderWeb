head();
function head() {
  document.writeln("<div class=\"head\">");
  document.writeln("    <div class=\"head_left\">");
  document
      .writeln("        <img src=\"/BraceletS/images/ic_logo_homepage.png\">");
  document.writeln("    </div>");
  document.writeln("    <div class=\"head_right\">");
  document.writeln("      <div class=\"welcome\">");
  document.writeln("        <a id=\"welcome_user\"></a>");

  document.writeln("        <img src=\"/BraceletS/images/line_fg.png\">");
  document.writeln("      </div>");
  document.writeln("      <div class=\"resetpsw\">");
  document
      .writeln("        <a href=\"/BraceletS/html/modfiypassword.html\">修改密码</a>");
  document.writeln("        <img src=\"/BraceletS/images/line_fg.png\">");
  document.writeln("      </div>");
  document.writeln("      <div class=\"loginout\">");
  document.writeln("        <form method=\"post\" action=\"logout\">");
  document.writeln("          <input type=\"submit\" id=\"\" value=\"注销\" />");
  document.writeln("        </form>");
  document.writeln("      </div>");
  document.writeln("    </div>");
  document.writeln("");
  document.writeln("  </div>");
  document.writeln("<div class=\"menu\" id=\"tabs_nav\">");
  document.writeln("    <ul>");
  document
      .writeln("        <li><a href=\"/BraceletS/html/homepage.html\" class=\"on\">首&nbsp;&nbsp;页</a></li>");
  document
      .writeln("        <li><a href=\"/BraceletS/html/attendancerecord.html\">考勤记录</a></li>");
  document
      .writeln("        <li><a href=\"/BraceletS/html/heart.html\">实时心率</a></li>");
  document
      .writeln("        <li><a href=\"/BraceletS/html/steps.html\">计&nbsp;&nbsp;步</a></li>");
  document
      .writeln("        <li><a href=\"/BraceletS/html/attendancerecordab.html\">异常信息</a></li>");
  document
      .writeln("        <li id=\"li_location\"><a href=\"/BraceletS/html/location.html\">轨&nbsp;&nbsp;迹</a></li>");
  document
      .writeln("        <li id=\"li_identityau\"><a href=\"/BraceletS/html/IdentityAuthentication.html\">身份认证</a></li>");
  document.writeln("    </ul>");
  document.writeln("</div>");
}