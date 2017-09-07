/**
 * encapsulated calculation logic functionality
 */
var Calculation = (function () {

    function Calculation() {
        var self = this;
    }

    /**
     * Helper Function to bring datastore in a usable and pre-ordered format
     * @param datastore
     * @returns {Array}
     * @private
     */
    Calculation.prototype._sort_rectangles = function(datastore){
        var rectangles = [];
        // transform datastore for usability
        // [min_x, max_x, min_y, max_y]

        $.each(datastore, function (name,data) {
            var set = {};
            set.name = name;
            set.min_x = parseInt(data[1]);
            set.max_x = parseInt(data[1]) + parseInt(data[3]);
            set.min_y = parseInt(data[2]);
            set.max_y = parseInt(data[2]) + parseInt(data[4]);
            rectangles.push(set);
        });

        rectangles.sort(function (a, b) {
            return a.min_x - b.min_x;
        });
        return rectangles;
    };

    /**
     * Main functionality to analyse a set of rectangle data and
     * return a detailed analysis in a structured array of comparisons
     * @param datastore
     * @returns {Array}
     */
    Calculation.prototype.check_rectangles = function (datastore) {
        var self = this;
        var analysis = [];
        var rectangles = [];

        // sort to safe work
        rectangles = this._sort_rectangles(datastore);
        $.each(rectangles, function (k, set) {
            var curr = set; // base for comparison
            for (i = k+1; i < rectangles.length; i++) {
                var resultmap = {};
                var comp;
                var x_overlap;
                var y_overlap;
                var intersect;
                var adjacent;

                comp = rectangles[i]; // rect to compare to
                resultmap.current = curr.name;
                resultmap.compared = comp.name;

                // if there is overlapping area in x AND y there are intersections
                x_overlap = Math.max(0, Math.min(curr.max_x, comp.max_x)
                    - Math.max(curr.min_x, comp.min_x));
                y_overlap = Math.max(0, Math.min(curr.max_y, comp.max_y)
                    - Math.max(curr.min_y, comp.min_y));
                intersect = x_overlap * y_overlap;

                // fill resultmap with details
                if(intersect) {
                    resultmap.intersection = self._intersection_detail(curr,comp);
                    resultmap.is_adjacent = false;
                } else {
                    resultmap.intersection = null;
                    resultmap.is_adjacent = self.check_adjacency(curr,comp);
                }
                analysis.push(resultmap);
            }
        });
        return analysis;

    };
    /**
     * Detailed analysis of intersections, including determination of intersection points
     * Intended to be used with 2 rectangle sets
     * Returns an object with intersection data.
     * @param curr
     * @param comp
     * @returns {{}}
     * @private
     */
    Calculation.prototype._intersection_detail = function (curr, comp) {
        var code;
        var result = {};

        // useful defaults, overridden when needed
        result.is_intersecting = true;
        result.is_containing = false;
        result.is_contained = false;
        result.int_coordinates = [];

        // comparison logic
        code = (curr.min_x < comp.min_x) ? "y" : "n";
        code += (curr.min_y < comp.min_y) ? "y" : "n";
        code += (curr.max_x < comp.max_x) ? "y" : "n";
        code += (curr.max_y < comp.max_y) ? "y" : "n";

        // there are 16 possible options
        switch (code) {
            case 'yyyy':
                result.int_coordinates.push({'x': comp.min_x, 'y': curr.max_y});
                result.int_coordinates.push({'x': curr.max_x, 'y': comp.min_y});
                break;
            case 'nyyy':
                result.int_coordinates.push({'x': curr.min_x, 'y': comp.min_y});
                result.int_coordinates.push({'x': curr.max_x, 'y': comp.min_y});
                break;
            case 'nyny':
                result.int_coordinates.push({'x': curr.min_x, 'y': comp.min_y});
                result.int_coordinates.push({'x': comp.max_x, 'y': curr.max_y});
                break;
            case 'nnny':
                result.int_coordinates.push({'x': comp.max_x, 'y': curr.min_y});
                result.int_coordinates.push({'x': comp.max_x, 'y': curr.max_y});
                break;
            case 'nnnn':
                result.int_coordinates.push({'x': comp.max_x, 'y': curr.min_y});
                result.int_coordinates.push({'x': curr.min_x, 'y': comp.max_y});
                break;
            case 'nnyn':
                result.int_coordinates.push({'x': curr.min_x, 'y': comp.max_y});
                result.int_coordinates.push({'x': curr.max_x, 'y': comp.max_y});
                break;
            case 'ynyn':
                result.int_coordinates.push({'x': comp.min_x, 'y': curr.min_y});
                result.int_coordinates.push({'x': curr.max_x, 'y': comp.max_y});
                break;
            case 'ynyy':
                result.int_coordinates.push({'x': comp.min_x, 'y': curr.min_y});
                result.int_coordinates.push({'x': comp.min_x, 'y': curr.max_y});
                break;
            case 'nnyy':
                result.is_intersecting = false;
                result.is_contained = true;
                break;
            case 'nynn':
                result.int_coordinates.push({'x': curr.min_x, 'y': comp.min_y});
                result.int_coordinates.push({'x': curr.min_x, 'y': comp.max_y});
                break;
            case 'nyyn':
                result.int_coordinates.push({'x': curr.min_x, 'y': comp.min_y});
                result.int_coordinates.push({'x': curr.min_x, 'y': comp.max_y});
                result.int_coordinates.push({'x': curr.max_x, 'y': comp.min_y});
                result.int_coordinates.push({'x': curr.max_x, 'y': comp.max_y});
                break;
            case 'ynny':
                result.int_coordinates.push({'x': comp.min_x, 'y': curr.min_y});
                result.int_coordinates.push({'x': comp.min_x, 'y': curr.max_y});
                result.int_coordinates.push({'x': comp.max_x, 'y': curr.min_y});
                result.int_coordinates.push({'x': comp.max_x, 'y': curr.max_y});
                break;
            case 'ynnn':
                result.int_coordinates.push({'x': comp.min_x, 'y': curr.min_y});
                result.int_coordinates.push({'x': comp.max_x, 'y': curr.min_y});
                break;
            case 'yynn':
                result.is_intersecting = false;
                result.is_containing = true;
                break;
            case 'yyny':
                result.int_coordinates.push({'x': comp.min_x, 'y': curr.max_y});
                result.int_coordinates.push({'x': comp.max_x, 'y': curr.max_y});
                break;
            case 'yyyn':
                result.int_coordinates.push({'x': curr.max_x, 'y': comp.min_y});
                result.int_coordinates.push({'x': curr.max_x, 'y': comp.max_y});
                break;
        }
       return result;
    };

    /**
     * checks two sets of rectangle data for adjecency,
     * returns true if they are
     * ToDo: it could determine the direction of adjecency and return (N-S-W-E)
     * @param curr
     * @param comp
     * @returns {boolean}
     */
    Calculation.prototype.check_adjacency = function (curr, comp) {
        var code = "";
        var result = "";
        code = (curr.min_x == comp.max_x || curr.min_x == comp.max_x + 1) ? "y" : "n";
        code += (curr.min_y == comp.max_y || curr.min_y == comp.max_y + 1) ? "y" : "n";
        code += (curr.max_x == comp.min_x || curr.max_x + 1 == comp.min_x) ? "y" : "n";
        code += (curr.max_y == comp.min_y || curr.max_y + 1 == comp.min_y) ? "y" : "n";
        return (code.indexOf("y") !== -1) ? true : false;
    };


    return Calculation;
}());
