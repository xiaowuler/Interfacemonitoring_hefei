var App = function () {

    this.Startup = function () {
        this.ReLayout();
        this.BindInputEvent();
        window.onresize = this.ReLayout.bind(this);
    };

    this.ReLayout = function () {
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
    };

    this.BindInputEvent = function () {
        $('.port-detail').find('.port-des').each(function () {
            $(this).find('span').children('input').hover(function () {
                $(this).focus();
            })
        });
    };
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});