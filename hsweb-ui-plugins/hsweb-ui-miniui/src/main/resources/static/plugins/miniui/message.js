define(function () {
    return {
        loading: function (message) {
            mini.mask({
                el: document.body,
                cls: 'mini-mask-loading',
                html: message
            });
            function hide() {
                mini.unmask(document.body);
            }

            return {
                close: hide,
                hide: hide
            };
        },
        showTips: function (msg, state, timeout) {
            mini.showTips({
                content: msg,
                state: state || 'success',
                x: 'center',
                y: 'top',
                timeout: timeout || 3000
            });
        },
        confirm: function (message, onOk, onCancel) {
            mini.confirm(message, "确定？",
                function (action) {
                    if (action == "ok") {
                        if (onOk) onOk();
                    } else {
                        if (onCancel) onCancel();
                    }
                }
            );
        }
    }
});