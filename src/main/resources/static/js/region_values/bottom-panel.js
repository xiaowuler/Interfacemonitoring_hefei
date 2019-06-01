var BottomPanel = function(){

    this.MapInfo = new MapInfo();

    this.Startup = function () {

        this.MapInfo.CreateEasyMap();
        this.MapInfo.Startup();
        this.ReLayout();
    }

    this.ReLayout = function () {
        var windowHeight = $(window).height();
        $('.aside').height(windowHeight - 70);
        $('.return-content li, .describe').height(windowHeight - 612);
    };
}