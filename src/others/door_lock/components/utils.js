export default {
    debounce(action, idle) {
        var last;
        return function() {
            var ctx = this,
                args = arguments;
            clearTimeout(last);
            last = setTimeout(function() {
                action.apply(ctx, args);
            }, idle);
        };
    }
};
