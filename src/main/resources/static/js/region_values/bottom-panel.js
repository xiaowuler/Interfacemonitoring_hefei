var BottomPanel = function(){

    this.MapInfo = new MapInfo();

    this.Startup = function () {

        this.MapInfo.CreateEasyMap();
        this.MapInfo.Startup();

    }

}