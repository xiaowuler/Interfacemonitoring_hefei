var App = function () {

    this.Startup = function () {
        this.ReLayout();
        this.BindInputEvent();
        $('.return-title ul li').on('click', this.PortCallTab.bind(this));
        window.onresize = this.ReLayout.bind(this);

        $(".return-content li").eq(0).show();
    };

    this.ReLayout = function () {
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
        $('.return-content li, .describe').height(windowHeight - 611);
    };

    this.BindInputEvent = function () {
        $('.port-detail').find('.port-des').each(function () {
            $(this).find('span').children('input').hover(function () {
                $(this).focus();
            })
        });
    };

    this.PortCallTab = function (event) {
        $('.return-title ul li').removeClass("active");
        $(event.target).addClass("active");

        var index = $(event.target).index();
        $(".return-content li").eq(index).css("display","block").siblings().css("display","none");

    };
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});