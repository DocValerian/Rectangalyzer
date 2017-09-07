/**
 * rudimentary error handler
 * @param text
 */
var err = function (text) {
    alert(text);
    throw new Error(text);

};
/**
 * Array containing the required ellements for a rectangle in order
 * @type {[string,string,string,string,string]}
 */
var DATAFIELDS = ['name','topleft_x', 'topleft_y', 'width', 'height'];

$(document).ready(function () {
    /**
     * datastore object,
     * keys are used for interactability
     * data-array is ordered according to DATAFIELDS
     * @type {{string: [string,number,number,number,number]}}
     */
    var rectangels = {
        'default': ["default",0,0,200,150],
        'a': ["a",11,80,289,150],
        'b': ["b",300,0,200,150],
        'foobar': ["foobar",350,50,70,50]
    };

    // instanciate main components
    var interface   = new Interface($("#ctrl"), $("#status"), $("#analysis"));
    var geo         = new Geometry($("#canvas")[0]);
    var calc        = new Calculation();

    /**
     * run an anylisis on the current rectangles
     */
    var analze = function () {
        var check_results;
        interface.clear_analysis();

        // generate and show the analysis results
        check_results = calc.check_rectangles(rectangels);
        interface.display_analysis(check_results);
    };

    // initialize the tool interface
    interface.init(
        rectangels,
        function () { // draw callback
            interface.store_data(rectangels);
            geo.drawAll(rectangels);
            analze();
        }
        , function () { // clear callback
            rectangels = {};
            geo.clear();
            interface.update_status(rectangels);
            interface.clear_analysis();
        });

    // draw initial rectangles
    geo.drawAll(rectangels);
    analze();
});
