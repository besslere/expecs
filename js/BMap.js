/*
 * 快邮科技--JAVASCRIPT
 * @Author:ZouYuan
 * @Date:2017-08-01
 */

/*公司地址*/
$(function () {
    ShowMap('114.0660527287,22.6109788894', '深圳市快邮口岸科技有限公司', '广东省深圳市龙岗区梅坂大道与雅宝路交叉口', '0755-82779949', 'james@expecs.com', '20');
    function getInfo(id) {
        $.ajax({
            type: "POST",
            url: "WebUserControl/Contact/GetInfo.ashx",
            cache: false,
            async: false,
            data: { ID: id },
            success: function (data) {
                data = eval(data);
                var length = data.length;
                if (length > 0) {
                    ShowMap(data[0]["Image"], data[0]["NewsTitle"], data[0]["Address"], data[0]["Phone"], data[0]["NewsTags"], data[0]["NewsNum"]);
                }
            }
        });
    }
    function ShowMap(zuobiao, name, addrsee, phone, email, zoom) {
        var arrzuobiao = zuobiao.split(',');
        var map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point(arrzuobiao[0], arrzuobiao[1]), zoom);
        map.addControl(new BMap.NavigationControl());
        var marker = new BMap.Marker(new BMap.Point(arrzuobiao[0], arrzuobiao[1]));
        map.addOverlay(marker);
        var infoWindow = new BMap.InfoWindow('<p style="color: #bf0008;font-size:14px;">' + name + '</p><p>地址：' + addrsee + '</p><p>电话：' + phone + '</p><p>邮箱：' + email + '</p>');
        marker.addEventListener("click", function () {
            this.openInfoWindow(infoWindow);
        });
        marker.openInfoWindow(infoWindow);
    }
});