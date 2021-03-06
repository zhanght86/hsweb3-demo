importResource("/admin/css/common.css");

importMiniui(function () {
    mini.parse();
    require(["miniui-tools"], function (tools) {
        window.tools = tools;
        var grid = window.grid = mini.get("menu-grid");
        tools.initGrid(grid);
        grid.setUrl(API_BASE_PATH + "menu?paging=false");
        $(".search-button").on("click", function () {
            var keyword = mini.getbyName("keyword").getValue();
            var param = {};
            if (keyword && keyword.length > 0) {
                require(["request"], function (request) {
                    param = request.createQuery().where()
                        .like("name", "%" + keyword + "%")
                        .or().like("permissionId", "%" + keyword + "%")
                        .or().like("url", "%" + keyword + "%")
                        .getParams();
                    grid.load(param);
                });
            } else {
                grid.load(param);
            }
        });
    });
})


window.renderAction = function (e) {
    var html = [];
    var row = e.record;
    html.push(tools.createActionButton("添加子菜单", "icon-add", function () {
        var sortIndex = row.sortIndex ? (row.sortIndex + "0" + (row.chidren ? row.chidren.length + 1 : 1)) : 1;
        grid.addNode({sortIndex: sortIndex}, row.chidren ? row.chidren.length : 0, row);
    }));

    if (row._state == "added" || row._state == "modified") {
        html.push(tools.createActionButton("保存", "icon-save", function () {
            var api = "menu/";
            require(["request", "message"], function (request, message) {
                var loading = message.loading("保存中...");
                request.patch(api, row, function (res) {
                    loading.close();
                    if (res.status == 200) {
                        request.get(api + res.result, function (data) {
                            grid.updateNode(row, data.result);
                            grid.acceptRecord(row);
                            message.showTips("保存成功!");
                        });
                    } else {
                        message.showTips("保存失败:" + res.message, "danger");
                    }
                })
            });
        }));
    }
    return html.join("");
}