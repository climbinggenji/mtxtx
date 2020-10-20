var bodyscroll = 0;
var loading = false;

var base_obj = {
    url: 'http://192.168.3.5:8888/'
}

const common_api = {
    more_list: base_obj.url + 'test/list/more'
}

// throttle
function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function() {
        var now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    };

    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = null;
    };

    return throttled;
}

// ajax请求封装
var http = {
    post: function(url, params, successCallback) {
        $.ajax({
            type: 'POST',
            url: url,
            data: params,
            dataType: 'json',
            success: function(res) {
                if (res.code == 200) {
                } else {
                    // tips(res.msg, 'error');
                }
                if (successCallback) {
                    successCallback(res);
                }
            }
        });
    },
    get: function(url, params, successCallback) {
        $.ajax({
            type: 'GET',
            url: url,
            data: params,
            dataType: 'json',
            success: function(res) {
                if (res.code == 200) {
                    console.log(132)
                    if (successCallback) {
                        successCallback(res);
                    }
                } else {
                    // tips(res.msg, 'error');
                }
            }
        })
    }
}

function showTop() {
    let top = $('body, html').scrollTop();
    let start_top = document.documentElement.getBoundingClientRect().width / 1080 * 100 * 1.5
    if (top > start_top) {
        $('#header').addClass('header-fixed');
        $('#header-seat').show();
    } else {
        $('#header').removeClass('header-fixed');
        $('#header-seat').hide();
    }
}

window.onscroll = throttle(function() {
    showTop();
}, 50)

function setHfs() {
    var docElem = document.documentElement;
    docElem.style.fontSize = docElem.getBoundingClientRect().width / 1080 * 100 + "px";
}

$(window).resize(function() {
    setHfs();
});

function showVipPops() {
    // vip弹窗
    popsOn();
    $('#vip-pay').show();
    // $('#vip-pay-main').animate({top: ($(window).innerHeight()-$('#vip-pay-main').height())+'px'})
    $('#vip-pay-main').animate({bottom: '0'});
}

function hideVipPops() {
    $('#vip-pay-main').animate({bottom: '-12rem'}, function() {
        $('#vip-pay').hide();
    });
    popsOff();
}

// 阻止弹窗出现底部能滚动的情况
function popsOn() {
    bodyscroll = -$(window).scrollTop();
    $("body").addClass('fixed');
    $("body").css("top",bodyscroll);
}

function popsOff() {
    $("body").removeClass('fixed');
    $(window).scrollTop(-bodyscroll);
}

// 瀑布流初始化
function initMasonry() {
    $('#Masonary').masonry({
        itemSelector: '.Masonary-item',
        gutter: '.gutter-sizer',
        percentPosition: true
    });
}

$().ready(function() {
    // 顶部菜单
    $('#handle-menu').click(function() {
        popsOn();
        $('#mask').show();
        $('#menu').animate({left: '0'});
    })
    $('#menu').on('click', '.icon-cha', function() {
        popsOff();
        $('#mask').hide();
        $('#menu').animate({left: '-'+$('#menu').css('width')});
    });
    $('#menu-list').on('click', '.text', function() {
        $(this).toggleClass('active');
        $(this).siblings().slideToggle(500);
    });
    // 用户菜单
    $('#handle-user').click(function() {
        popsOn();
        $('#mask').show();
        $('#user').animate({right: '0'})
    })
    $('#user').on('click', '.icon-cha', function() {
        popsOff();
        $('#mask').hide();
        $('#user').animate({right: '-'+$('#menu').css('width')});
    });
    // vip弹窗
    $('#vip-desc').click(function() {
        $('#mask').hide();
        $('#menu').animate({left: '-'+$('#menu').css('width')});
        showVipPops();
    });
    $('#vip-pay').click(function() {
        hideVipPops();
    });
    $('#vip-pay-main').click(function(e) {
        e.stopPropagation();
    });
    $('#vip-tabs').on('click', 'div', function() {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');
            if ($(this).index() == 0) {
                $('#vip-tabs-content').animate({left: '0'});
            } else if ($(this).index() == 1) {
                $('#vip-tabs-content').animate({left: '-100vw'});
            }
        }
    });
    $('#vip-pay-main').on('click', '.pay-type', function() {
        console.log($(this).parents('.box').data('type'))
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');
            if ($(this).parents('.box').data('type') == 'svip') {
                // svip选项卡
            }
        }
    });
    $('#vip-pay-main').on('click', '.check-box', function() {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');
        }
    });
    // vip会员服务协议
    $('#vip-pay-main').on('click', '.pay-agreement', function() {
        $('#vip-service').css('display', 'flex');
        $('#vip-service').animate({top: '0'});
    });
    $('#vip-service').on('click', '.iconfont', function() {
        $('#vip-service').animate({top: '100vh'}, function() {
            $('#vip-service').hide();
        });
    });

    // jquery ajax 错误处理
    $(document).ajaxError(
        //所有ajax请求异常的统一处理函数，处理
        function (event, xhr, options, exc) {
            if (xhr.status == 'undefined') {
                return;
            }
            switch (xhr.status) {
                case 403:
                    // 未授权异常
                    console.log("系统拒绝：您没有访问权限。");
                    break;

                case 404:
                    console.log("您访问的资源不存在。");
                    break;

                default:
                    // tips(xhr.statusText);
                    break;
            }
        }
    );
});

$(window).load(function() {
    setHfs();
})