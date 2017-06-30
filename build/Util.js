define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Util = (function () {
        function Util() {
        }
        Util.drawBitmapCenteredWithRotation = function (context, bitmap, x, y, angle) {
            context.save();
            context.translate(x, y);
            context.rotate(angle);
            context.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
            context.restore();
        };
        Util.colorRect = function (context, leftX, topY, width, height, drawColor) {
            context.fillStyle = drawColor;
            context.fillRect(leftX, topY, width, height);
        };
        Util.colorCircle = function (context, centerX, centerY, radius, drawColor) {
            context.fillStyle = drawColor;
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            context.fill();
        };
        Util.colorText = function (context, showWords, textX, textY, fillColor) {
            context.fillStyle = fillColor;
            context.fillText(showWords, textX, textY);
        };
        return Util;
    }());
    exports.Util = Util;
});
//# sourceMappingURL=Util.js.map