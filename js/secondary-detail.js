$('#back').click(function() {
    if (document.referrer == '') {
        $('#back').attr('href', '/index.html')
    }
});

$('#buy-vip').click(function() {
    showVipPops();
});
// 下载弹窗
$('#download').click(function() {
    popsOn();
    $('#download-pop').css('display', 'flex');
});
$('#download-pop').on('click', '.close', function() {
    $('#download-pop').hide();
    popsOff();
});

// 收藏
$('#collect').on('click' ,function() {
    if ($(this).hasClass('active')) {
        // 取消收藏
    } else {
        popsOn();
        $('#collect-pop').css('display', 'flex');
    }
});
$('#collect-pop').on('click', '.close', function() {
    $('#collect-pop').hide();
    popsOff();
});

$(window).load(function() {
    $('#Masonary').masonry({
        itemSelector: '.Masonary-item',
        gutter: '.gutter-sizer',
        percentPosition: true
    });
});