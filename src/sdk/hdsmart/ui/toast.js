export default function (message, delay) {
    delay = delay || 3000;
    HdIot.UI.toast(message, delay);
};