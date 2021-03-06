function getDefaultProperties(other) {
    var properties = [
        {
            "id": "name",
            "text": "名称",
            "editor": "text"
        },
        {
            "id": "require",
            "text": "不能为空",
            "editor": "select",
            "value ": "否",
            "data": [
                {text: "是", id: "是"},
                {text: "否", id: "否"}
            ]
        }
    ];
    for (var i = 0; i < other.length; i++) {
        properties.push(other[i]);
    }
    return properties;
}

var widgets = [
    {
        "name": "文本标签",
        "type": "label",
        "html": "<span>新建标签</span>",
        "properties": [
            {
                "id": "widget-type",
                "text": "控件类型",
                "value": "文本标签"
            }
        ]
    },
    {
        "name": "文本输入框",
        "type": "text",
        "properties": getDefaultProperties([
            {
                "id": "widget-type",
                "text": "控件类型",
                "value": "文本输入框"
            }
        ])
    },
    {
        "name": "下拉列表",
        "type": "select",
        "properties": getDefaultProperties([
            {
                "id": "widget-type",
                "text": "控件类型",
                "value": "下拉列表"
            },
            {
                "id": "data",
                "text": "可选项目",
                "editor": "textarea",
                "column": [{title: "项目名称"}]
            }
        ])
    },
    {
        "name": "单选框",
        "type": "radio",
        "properties": getDefaultProperties([
            {
                "id": "widget-type",
                "text": "控件类型",
                "value": "单选框"
            },
            {

                "id": "data",
                "text": "可选项目",
                "editor": "textarea",
                "column": [{title: "项目名称"}]
            }
        ])
    },
    {
        "name": "多选框",
        "type": "checkbox",
        "properties": getDefaultProperties([
            {
                "id": "widget-type",
                "text": "控件类型",
                "value": "多选框"
            },
            {
                "id": "data",
                "text": "可选项目",
                "editor": "textarea",
                "column": [{title: "项目名称"}]
            }
        ])
    },
    {
        "name": "文件上传",
        "type": "upload-file",
        "properties": getDefaultProperties([
            {
                "id": "widget-type",
                "text": "控件类型",
                "value": "文件上传"
            },
            {
                "id": "multiple",
                "text": "可上传多个文件",
                "editor": "select",
                "data": [
                    {text: "是", id: "是"},
                    {text: "否", id: "否"}
                ]
            }
        ])
    }
];

var chooseWidgets = {};
var editor;
var nowEditId;
function insertWidget(widget) {
    var id = randomChar(5);
    var newWidget = mini.clone(widget);
    newWidget.id = id;
    chooseWidgets[id] = newWidget
    var html = newWidget.html ? newWidget.html : "<input>"

    html = $("<div>").append($(html).attr("widget-id", id)).html();
    editor.execCommand('insertHtml', html);
}

function initEditor() {
    editor.addListener('selectionchange', function () {
        var focusNode = editor.selection.getStart();
        var id = $(focusNode).attr("widget-id");
        // if(id){
        nowEditId = id;
        initWidgetProperties();
        //}
    });
}
function getEditor(row) {
    var editor = mini.get('widget-editor-' + row.editor);
    if (editor) {
        if (editor.setData && row.data) {
            editor.setData(row.data);
        }
        return editor;
    }
    return {type: "textbox"};
}
function initPropertiesGrid() {
    var grid = mini.get("properties-grid");
    grid.on("cellbeginedit", function (e) {
        if (e.field == "value") {
            var editor = getEditor(e.record);
            if (!editor) {
                e.cancel = true;
            } else {
                e.editor = editor;
                e.column.editor = editor;
            }
        }
    });
}
function initWidgetProperties() {
    var grid = mini.get("properties-grid");
    if (!nowEditId) grid.setData([]);
    else {
        var wg = chooseWidgets[nowEditId];
        grid.setData(wg.properties);
    }

}
importMiniui(function () {
    mini.parse();
    window.UEDITOR_HOME_URL = "/plugins/ueditor/";
    initPropertiesGrid();
    require(["ueditor.config.js", "plugin/ueditor/ueditor.all.min"], function () {
        require(["plugin/ueditor/lang/zh-cn/zh-cn"]);
        editor = UE.getEditor("container");
        initEditor();
    });

    var tree = mini.get("leftTree");
    tree.loadList(widgets);

    tree.on("nodedblclick", function (e) {
        var node = e.node;
        insertWidget(node);
    });
    $('.write-source-button').on("click", function () {
        var html = editor.getContent();
        require(["jquery", "../parser/parser-miniui", "plugin/formatter/html-formatter"],
            function ($, parser, formatter) {
                var win = window.open("about:blank");
                var textarea = $("<textarea>")
                    .val(formatter(parser.parse(html, mini.clone(chooseWidgets))));
                textarea.css({width: window.innerWidth, height: window.innerHeight});
                $(win.document.body).append(textarea);
            });
    });
    $(".preview-button").on("click", function () {
        require(["jquery", "../parser/parser-miniui"], function ($, parser) {
            var win = window.open("preview.html");

            $(win.document).ready(function () {
                win.ready = function () {
                    win.init("miniui", parser.parse(editor.getContent(), mini.clone(chooseWidgets)));
                }
            })
        });
    });
});

function randomChar(len) {
    var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var s = "";
    for (var i = 0; i < len; i++) {
        var rand = Math.floor(Math.random() * str.length);
        s += str.charAt(rand);
    }
    return s;
}