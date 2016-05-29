var IsMobile = (function () {
    function IsMobile() {
    }
    IsMobile.any = function () {
        return (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/IEMobile/i));
    };
    return IsMobile;
}());
