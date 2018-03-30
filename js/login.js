$(function () {
    $.ajax({
        type: "POST",
        async: false,
        url: "/Ashx/MemberCenter.ashx",
        dataType: "json",
        data: { "Flag": "DeleteSession" },
        success: function (result) {
        },
        error: function () {
            $("#mes1").text("页面异常，赶快联系管理员吧"); $("#error1").show(); $("#login").css("height", "410px");
            return false;
        }
    });
});
function ChangeCode1() {
    var imgNode = document.getElementById("vimg1");
    imgNode.src = "../Ashx/WaterMark.ashx?t=" + (new Date()).valueOf();  // 这里加个时间的参数是为了防止浏览器缓存的问题
}

function Login() {
    var use = $.trim($(".username").val());
    var psw = $.trim($(".password").val());
    if (use == "" || psw == "") {
        $("#mes1").text("用户名密码不能为空！");$("#error1").show(); $("#login").css("height", "410px");
        return false;
    }
    var ValideCode = $.trim($(".Valide").val());
    if (ValideCode == "") {
        $("#mes1").text("请填写验证码！");$("#error1").show(); $("#login").css("height", "410px");
        return false;
    }
    login_ID(use, psw, ValideCode);
    return false;
}
function login_ID(use, psw, valitxt) {
    var ltyle = "";
    var reg = /^[0-9]*$/; //数字
    if (!reg.test(use)) {
        ltyle = "1";//name
    } else {
        ltyle = "2";//name or code
    }
    psw = base64encode(psw);
    $.ajax({
        url: "../Ashx/Login.ashx",
        type: 'POST', //GET
        async: true,    //或false,是否异步
        data: { "loginsname": use, "loginspwd": psw, "Codeyxm": valitxt, "ltyle": ltyle },
        dataType: "json",  //返回的数据格式：json/xml/html/script/jsonp/text
        success: function (result) {
            if (result.rest == "0")//完善数据
            {
                $("#mes1").text("完善数据"); $("#error1").show(); $("#login").css("height", "410px");
                ChangeCode1();
                return false;
            }
            if (result.rest == "1")//待审核
            {
                $("#mes1").text("用户名认证中,请联系客服"); $("#error1").show(); $("#login").css("height", "410px");
                ChangeCode1();
                return false;
            }
            if (result.rest == "2")//审核未通过
            {
                $("#mes1").text("认证未通过,请联系客服"); $("#error1").show(); $("#login").css("height", "410px");
                ChangeCode1();
                return false;
            }
            if (result.rest == "3")//审核通过
            {
                $("#mes1").text(""); $("#error1").hide(); $("#login").css("height", "380px");
                document.cookie = "ExpCusCode=" + result.CustomerID + ";path=/";
                document.cookie = "ExpName=" + result.UserName + ";path=/";
                $("#loginregist").hide();
                $("#usersession").show();
                location.href = "MemberCenter.aspx";
            }
            if (result.rest == "4")//用户名作废
            {
                $("#mes1").text("用户名以作废,请联系客服"); $("#error1").show(); $("#login").css("height", "410px");
                ChangeCode1();
                return false;
            }
            if (result.rest == "5")//验证码输入错误
            {
                $("#mes1").text("验证码输入错误！"); $("#error1").show(); $("#login").css("height", "410px");
                ChangeCode1();
                return false;
            }
            if (result.rest == "6")//用户名或密码错误
            {
                $("#mes1").text("用户名或密码输入错误！"); $("#error1").show(); $("#login").css("height", "410px");
                ChangeCode1();
                return false;
            }
        },
        error: function () {
            $("#mes1").text("页面异常，请刷新后重新提交"); $("#error1").show(); $("#login").css("height", "410px");
            return false;
        }
    });
}
//----------------------New Code---------------------
//base64加密
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
/**
 * base64编码
 * @param {Object} str
 */
function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}