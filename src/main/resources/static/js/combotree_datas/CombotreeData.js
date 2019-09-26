var CombotreeData = function (id, text) {

    this.id = id;
    this.text = text;
    this.children = [];
    
    this.initData = function (results) {
        $(results).each(function (index, result) {
            var combotreeData = new CombotreeChildData(index + 1, result, id);
            this.children.push(combotreeData);
        }.bind(this))
    }

};