function GetCardRes() {
    var tt = false;
    var username = $.trim($("#username").val());
    var idcard = $.trim($("#idcard").val());
    var Codeyxm = $.trim($("#yzm").val());
    if (username == "") {
        $("#mes").text("请输入姓名！"); $("#error").show(); $("#idcardno").css("height", "410px");
        return tt;
    } else {
        var regexname = /[\u4E00-\u9FA5]{2,6}(?:·[\u4E00-\u9FA5]{2,6})*$/;//名字验证
        if (regexname.test(username) === false) {
            $("#mes").text("姓名输入不合法！"); $("#error").show(); $("#idcardno").css("height", "410px");
            return tt;
        }
    }
    if (idcard == "") {
        $("#mes").text("请输入身份证号码！"); $("#error").show(); $("#idcardno").css("height", "410px");
        return tt;
    } else {
        var regcard = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        //----------身份证验证是否合法-------------(1)------------------------
        if (regcard.test(idcard) === false) {
            $("#mes").text("身份证输入不合法！"); $("#error").show(); $("#idcardno").css("height", "410px");
            return tt;
        }
        //----------身份证验证是否合法-------------(2)------------------------
        var birth = idcard.substr(6, 4);
        var month = idcard.substr(10, 2);
        var day = idcard.substr(12, 2);
        var now = new Date();
        var nowYear = now.getFullYear();
        if (nowYear - parseInt(birth) > 100) {
            $("#mes").text("身份证输入不合法！"); $("#error").show(); $("#idcardno").css("height", "410px");
            return tt;// 最少15岁 最多一百年
        }
        //----------身份证验证是否合法-------------(3)------------------------
        if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
            if (day > 31) {
                $("#mes").text("身份证输入不合法！"); $("#error").show(); $("#idcardno").css("height", "410px");
                return tt;
            }
        }
        else if (month == "04" || month == "06" || month == "09" || month == "11") {
            if (day > 30) {
                $("#mes").text("身份证输入不合法！"); $("#error").show(); $("#idcardno").css("height", "410px");
                return tt;
            }
        }
        else if (month == "02") {
            if ((birth % 4 == 0 && birth % 100 != 0) || birth % 400 == 0) {
                if (day > 29) {
                    $("#mes").text("身份证输入不合法！"); $("#error").show(); $("#idcardno").css("height", "410px");
                    return tt;
                }
            }
            else {
                if (day > 28) {
                    $("#mes").text("身份证输入不合法！"); $("#error").show(); $("#idcardno").css("height", "410px");
                    return tt;
                }
            }
        }
        else {
            $("#mes").text("身份证输入不合法！"); $("#error").show(); $("#idcardno").css("height", "410px");
            return tt;
        }
    }
    if (Codeyxm == "") {
        $("#mes").text("请输入验证码！"); $("#error").show(); $("#idcardno").css("height", "410px");
        return tt;
    }
    $.ajax({
        type: "POST",
        async: false,
        url: "/Ashx/IdCardAshx.ashx",
        data: { Flag: "GetCardRes", "username": username, "idcard": idcard, "Codeyxm": Codeyxm },
        dataType: "json",
        success: function (result) {
            if (result.Error == "True") {
                $("#mes").html(result.Mess); $("#error").show(); $("#idcardno").css("height", "410px"); change();
                return tt;
            } else {
                $("#mes").html(""); $("#error").hide(); $("#idcardno").css("height", "380px");
                if (result.Status == "0") {//不是一直或者不一致 直接显示不需要充值
                    $("#name").val(username); $("#card").val(idcard); $("#detail").val(result.StateCode);
                    $("#result").modal("show");
                } else { //需要充值才显示
                    //先获取费用与手续费
                    GetMoneyField5();
                    $("#hidSerialNum").val(result.SerialNum);
                    $("#popup-dialog").modal("show");
                }
                tt = true;
            }
        },
        error: function () {
            $("#mes").html("页面异常，请联系管理员"); $("#error").show(); $("#idcardno").css("height", "410px"); change();
            return false;
        }
    });
    return tt;
}

function GetMoneyField5() {
    var Pplatform = $.trim($("#hidPplatform").val());
    //查询数据显示出来
    $.ajax({
        type: "POST",
        async: false,
        url: "/Ashx/IdCardAshx.ashx",
        data: { Flag: "GetMoneyField5", "Pplatform": Pplatform },
        dataType: "json",
        success: function (result) {
            if (result.Error == "True") {
                return false;
            } else {
                $("#lblField5").html(result.Field5); $("#lblMoney").html(result.CardMoney); $("#hMoney").val(result.CardMoney);
                return true;
            }
        },
        error: function () {
            alert("页面异常，请联系管理员");
            return false;
        }
    });
}
function GetWinXinImg() {
    var out_trade_no = $.trim($("#hidSerialNum").val());//没用他的原因是因为数据偶尔错误 貌似跟out_trade_no的长度有关
    var total_fee = $.trim($("#lblMoney").html());
    if (total_fee == "0") { return false; }
    $.ajax({
        type: "POST",
        async: false,
        url: "/Ashx/AccountAdd.ashx",
        data: { Flag: "WinXin", "out_trade_no": out_trade_no, "total_fee": total_fee },
        dataType: "json",
        success: function (result) {
            if (result.Error == "True") {
                $("#WinXinImage").attr("src", "");
                return false;
            } else {
                $("#WinXinImage").attr("src", result.url);
                $("#goPAY").modal("show");
                GetInfo();//调用方法
            }
        },
        error: function () {
            alert("页面异常，请联系管理员");
            return false;
        }
    });
}

var GInfo;
function GetInfo() {
    GInfo = window.setInterval("GetDate()", "2000");
}

function CheckData() {
    var num = $("#lblMoney").html();
    var Pplatform = $("#hidPplatform").val();
    if (Pplatform == "2") {
        GetWinXinImg();
        return false;
    } else {
        $("#Alipay").click();
    }
}

//!-----支付宝充值完后显示
function GetDate(type) {
    if (type == undefined) { type = 0; }
    var SerialNum = $.trim($("#hidSerialNum").val());
    if (SerialNum != "") {
        //查询数据显示出来
        $.ajax({
            type: "POST",
            async: false,
            url: "/Ashx/IdCardAshx.ashx",
            data: { Flag: "GetDate", "SerialNum": SerialNum, "type": type },
            dataType: "json",
            success: function (result) {
                if (result.Error == "True") {//还没付款查不出
                    if (type == "2") { alert("还没付款成功哦");}
                    return false;
                } else {
                    //跳转
                    if (type == "1") {//显示
                        $("#name").val(result.Name); $("#card").val(result.Card); $("#detail").val(result.StateCode);
                        $("#result").modal("show");
                    }
                    else if (type == "0" || type == "2") {//微信 有数据就停止循环
                        location.href = "Index.aspx?out_trade_no=" + result.SerialNum;
                        window.clearInterval(GInfo);
                    }
                    return true;
                }
            },
            error: function () {
                alert("页面异常，请联系管理员");
                return false;
            }
        });
    }
}
function CloseBtn() {
    $("#goPAY").modal("hide");
    window.clearInterval(GInfo);
}
//------------获取地址栏参数-------------
function GetQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
}
function change() {
    var imgNode = document.getElementById("vimg");
    imgNode.src = "Ashx/WaterMark.ashx?t=" + (new Date()).valueOf();  // 这里加个时间的参数是为了防止浏览器缓存的问题
}