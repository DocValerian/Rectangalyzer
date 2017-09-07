/**
 * encapsulated user interface functionality
 */
var Interface = (function () {
    /**
     *
     * @param ctrl
     * @param status
     * @param analysis
     * @constructor
     */
    function Interface(ctrl, status, analysis) {
        this.ctrl = ctrl;
        this.status = status;
        this.analysis = analysis;
    }

    /**
     * Initialize the dynamic interface of our tool to allow for
     * easy extension. (ToDo: buttons could later be given as array...)
     * @param {Obj} datastore - a storage object for rectangle data
     * @param {function} draw_cb - a callback function for drawing rectangles
     * @param {function} clear_cb - a callback function for cleaning up
     */
    Interface.prototype.init = function (datastore, draw_cb, clear_cb) {
        var self = this;

        // init controls
        $.each(DATAFIELDS, function (k,v) {
            self._input(v, v);
        });
        this._button("Draw & Analyze", draw_cb);
        this._button("Clear All", clear_cb);

        // init status
        this.update_status(datastore);
        // init analysis
    };

    /**
     * Read and store rectangle data from Input to datastore
     * ToDo: more decent typing/validation of inputs
     * @param {Obj} datastore - a storage object for rectangle data
     */
    Interface.prototype.store_data = function (datastore) {
        var data = [];
        $.each(DATAFIELDS, function (k,v) {
            var value;
            var input = $("input[name="+v+"]");
            // (rudimentary) input validation
            if(input.length > 0) {
                value = input.val();
            } else {
                err("Input field " + v + " does not exist");
            }
            if(value === null || value === "") {
                err("Missing value for " + v + "");
            } else {
                data.push(value);
            }
        });
        datastore[data[0]] = data;
        this.update_status(datastore);
    };

    /**
     * Update the visual representation of the current objects in the datastore
     * and allow for modification in control panel via click
     * @param datastore
     */
    Interface.prototype.update_status = function (datastore) {
        var self = this;
        self.status.html("");
        $.each(datastore, function (name,data) {
            var rectangle = $("<div>")
                .addClass("rectangle")
                .html(name)
                .click(function () {
                    $.each(DATAFIELDS, function (k,v) {
                        $("input[name=" + v + "]").val(data[k]);
                    });
                });
            self.status.append(rectangle);
        });
    };

    /**
     * Create a visually formated representation of the analysis data
     * @param dataarray
     */
    Interface.prototype.display_analysis = function (dataarray) {
        var self = this;
        $.each(dataarray, function (k,data) {
            var inspection;
            var headline;
            var details;
            inspection = $("<div>").addClass("inspection");
            headline = $("<h4>").html("Inspecting relation of <b>"+data.current+"</b> to <b>"+data.compared+"</b>");
            details = $("<p>");
            if(data.intersection) {
                details.append(self._intersection_report(data));
            } else {
                if (data.is_adjacent) {
                    details.append("The rectangles are <b>adjacent</b>");
                } else {
                    details.append("...not related in any relevant way...")
                }
            }

            inspection.append(headline);
            inspection.append(details);
            self.analysis.append(inspection);
        });
        this.analysis.append($("<h3>").html("Analysis finished!"));
    };

    /**
     * Clear everything in the analysis DOM element.
     */
    Interface.prototype.clear_analysis = function () {
        this.analysis.html("");
    };


    /*
     * HELPERS
     *
     */

    /**
     * helper to format intersection data propperly
     * @param data
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    Interface.prototype._intersection_report = function (data) {
        var details = $("<div>");
        if(data.intersection.is_contained) {
            details.append(data.current+" <b>is entirely contained</b> by "+data.compared);
        } else if(data.intersection.is_containing){
            details.append(data.current+" <b>contains</b> "+data.compared+" entirely");
        } else if (data.intersection.is_intersecting) {
            $.each(data.intersection.int_coordinates, function (i, coords) {
                details.append("Intersection <b>i" + i +" (X:" + coords.x + "|Y:" + coords.y + ")</b><br/>");
            });
        } else { // should never trigger
            console.log(data);
            err("check calculation data");
        }
        return details;
    };

    /**
     * Helper to create uniform input fields
     * @param {string} text - the labeltext of the input field
     * @param {string} id - technical id of the input field
     * @private
     */
    Interface.prototype._input = function(text, id){
        var label = $("<label>")
            .attr('for', id)
            .text(text);
        var input = $("<input/>")
            .addClass("interface")
            .attr("id", id)
            .attr("name", id)
            .val(123);
        label.append(input);
        this.ctrl.append(label);
    };

    /**
     * Helper to create uniform buttons
     * @param: {string} text - the text of the button
     * @param: {function} callback - a function to be called upon clicking the button
     * @private
     */
    Interface.prototype._button = function(text, callback) {
        var button = $("<button/>")
            .addClass("interface")
            .html(text)
            .click(callback);
        this.ctrl.append(button);
    };

    return Interface;
}());
