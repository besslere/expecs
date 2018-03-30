/*
 * 快邮科技--JAVASCRIPT
 * @Author:ZouYuan
 * @Date:2017-08-01
 */

/*AJAX HEADER AND FOOTER*/
$('#header').load('header.html');
$('#footer').load('footer.html');

/*SEARCH BOX*/
$(function(){
    var gh_input_search = $("#search"),
        form_search     = $(".form-search"),
        input_search    = $("#search");
    $(gh_input_search).focus(function(){
        $(input_search).css("width","120px");
    });
    $(gh_input_search).blur(function(){
        var this_val=$("#search").val();
        $(input_search).css("width","80px").attr("value","");
    });
});

/*TOTOP*/
!function(o){
    "use strict";
    o.fn.toTop=function(t){
        var i=this,
            e=o(window),
            s=o("html, body"),
            n=o.extend({
                autohide:!0,
                offset:420,
                speed:500,
                position:!0,
                right:25,
                bottom:50
                }, t);
        i.css({
            cursor:"pointer"
        });
        n.autohide&&i.css("display","none");
        n.position&&i.css({
            position:"fixed",
            right:n.right,
            bottom:n.bottom
        });
            i.click(function(){
                s.animate({
                    scrollTop:0
                },n.speed)
            });
            e.scroll(function(){
                    var o=e.scrollTop();
                    n.autohide&&(
                        o>n.offset?i.fadeIn(n.speed):i.fadeOut(n.speed)
                    )
                }
            )}
}(jQuery);

$(function() {
    $('.to-top').toTop();
});
$('body').append('<a class="to-top"><i class="glyphicon glyphicon-menu-up"></i></a>');


$(document).ready(function(){
    $(".login-a").click(function(){
        $('.ctn1').hide();
        $('.ctn2').show();
        $('.ctn2').addClass('animated bounceInLeft');
        setTimeout(function(){
            $('.ctn2').removeClass('bounceInLeft');
        }, 1000);
    });
    $(".login-b").click(function(){
        $('.ctn2').hide();
        $('.ctn1').show();
        $('.ctn1').addClass('animated bounceInRight');
        setTimeout(function(){
            $('.ctn1').removeClass('bounceInRight');
        }, 1000);
    });

    $(".weiXin").click(function(){
        $(".weiXin").addClass("checked");
        $(".zhiFuBao").removeClass("checked");
    });
    $(".zhiFuBao").click(function(){
        $(".weiXin").removeClass("checked");
        $(".zhiFuBao").addClass("checked");
    });

    $(".close").click(function(){
        $(".popup").hide();
        $(".popup-show").fadeOut(500);
    });
    $(".choose").click(function(){
        $("#goPAY").hide();
        $("#popup-dialog").show();
    });
});