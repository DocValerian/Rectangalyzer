/**
 * encapsulated geometry functionality
 */
var Geometry = (function () {
    /**
     * Constructor, initializes the given canvas ctx and config
     * @param {DOMobj} canvas - a canvas DOM object
     * @constructor
     */
    function Geometry(canvas) {
        var style = {
            LINE_WIDTH : 1,
            FONT : '12px Arial',
            FILL_STYLE : 'red'
        }
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.lineWidth = style.LINE_WIDTH;
        //this.ctx.font = style.FONT;
        this.ctx.fillStyle = style.FILL_STYLE;
    }

    /**
     * Draw a single rectangle on the canvas and add its name as text
     * @param {string} name - the name of the rectangle
     * @param {int} x - x position of top_left corner
     * @param {int} y - y position of top_left corner
     * @param {int} width - width of the rectangle
     * @param {int} height - height of the rectangle
     */
    Geometry.prototype.drawRectangle = function (name, x, y, width, height) {
        this.ctx.strokeRect(x, y, width, height);
        this.ctx.fillText(name, parseInt(x) + 10, parseInt(y) + 15);
    };

    /**
     * Draw all rectangles currently stored in the provided data object
     * @param {obj} datastore - an object containing rectangle data
     */
    Geometry.prototype.drawAll = function (datastore) {
        var self = this;

        this.clear();
        $.each(datastore, function (name,data) {
            self.drawRectangle(data[0], data[1], data[2], data[3], data[4]);
        });
    };

    /**
     * Cleanup the canvas
     */
    Geometry.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    return Geometry;
}());
