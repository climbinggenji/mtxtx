eruda.init();
        var masonry_options = {
            itemSelector: '.Masonary-item',
            gutter: '.gutter-sizer',
            percentPosition: true
        }
        var $grid = $('#Masonary').masonry(masonry_options);
        $(window).load(function() {
            $grid.masonry()
        });
            //文档高度
        function getDocumentTop() {
            var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
            if (document.body) {
                bodyScrollTop = document.body.scrollTop;
            }
            if (document.documentElement) {
                documentScrollTop = document.documentElement.scrollTop;
            }
            scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
            return scrollTop;
        }
        //可视窗口高度

        function getWindowHeight() {
            var windowHeight = 0;
            if (document.compatMode == "CSS1Compat") {
                windowHeight = document.documentElement.clientHeight;
            } else {
                windowHeight = document.body.clientHeight;
            }
            return windowHeight;
        }
        //滚动条滚动高度
        function getScrollHeight() {
            var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
            if (document.body) {
                bodyScrollHeight = document.body.scrollHeight;
            }
            if (document.documentElement) {
                documentScrollHeight = document.documentElement.scrollHeight;
            }
            scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
            return scrollHeight;
        }
        window.onscroll = function () {
            //监听事件内容
            if (getScrollHeight() + 10 < getWindowHeight() + getDocumentTop()) {
                //当滚动条到底时,这里是触发内容
                // 异步请求数据,局部刷新dom
                if (!loading) {
                    $.ajax({
                        type: 'get',
                        url: common_api.more_list,
                        data: {},
                        dataType: 'json',
                        beforeSend: function() {
                            loading = true
                            $('#loading').show();
                        },
                        success: function(res) {
                            if (res.code == 200) {
                                let data = res.data.data
                                for (let i = 0; i < data.length; i++) {
                                    const element = data[i];
                                    let $html = $($.parseHTML(`
                                    <div class="Masonary-item">
                                        <a href="secondary-detail.html">
                                            <div class="Masonary-item-box">
                                                <div class="img">
                                                    <img src="${element.src}">
                                                </div>
                                                <div class="text">
                                                    ${element.title}
                                                </div>
                                            </div>
                                        </a>
                                    </div>`))
                                    $html.find('img').load(function() {
                                        $grid.append($html).masonry('appended', $html)
                                    })
                                }
                            } else {
                                // 请求错误
                            }
                        },
                        complete: function() {
                            loading = false
                            $('#loading').hide();
                        }
                    })
                }
            }
        };