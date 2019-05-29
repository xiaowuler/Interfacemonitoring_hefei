var App = function () {

    this.Startup = function () {
        this.ReLayout();
        window.onresize = this.ReLayout.bind(this);
    };

    this.ReLayout = function () {
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
    };
};

$(document).ready(function () {
    var app = new App();
    app.Startup();
});