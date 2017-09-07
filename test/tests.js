/**
 * Test cases for rectangalizer
 * --- Tests only for demonstration purposes, not extensive to the last option
 */
var calc        = new Calculation();

QUnit.test( "check_adjacency test", function( assert ) {
    var curr;
    // a 98x98 rectangle 102px from each axis
    curr = {'name': 'a','min_x':102,'max_x':200,'min_y':102,'max_y':200};

    // top-left
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':0,'max_x':100,'min_y':0,'max_y':100}), false, "a rectangle top-left of the original - 2px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':0,'max_x':101,'min_y':0,'max_y':101}), true,  "a rectangle top-left of the original - 1px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':0,'max_x':102,'min_y':0,'max_y':102}), true,  "a rectangle top-left of the original - 0px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':0,'max_x':103,'min_y':0,'max_y':103}), false, "a rectangle top-left of the original - -1px away" );
    // top
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':102,'max_x':200,'min_y':0,'max_y':100}), false, "a rectangle top of the original - 2px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':102,'max_x':200,'min_y':0,'max_y':101}), true,  "a rectangle top of the original - 1px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':102,'max_x':200,'min_y':0,'max_y':102}), true,  "a rectangle top of the original - 0px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':102,'max_x':200,'min_y':0,'max_y':103}), false, "a rectangle top of the original - -1px away" );
    // top-right
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':202,'max_x':302,'min_y':0,'max_y':100}), false, "a rectangle top-right of the original - 2px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':201,'max_x':301,'min_y':0,'max_y':101}), true,  "a rectangle top-right of the original - 1px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':200,'max_x':300,'min_y':0,'max_y':102}), true,  "a rectangle top-right of the original - 0px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':199,'max_x':299,'min_y':0,'max_y':103}), false, "a rectangle top-right of the original - -1px away" );
    // right
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':202,'max_x':300,'min_y':102,'max_y':200}), false, "a rectangle right of the original - 2px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':201,'max_x':300,'min_y':102,'max_y':200}), true,  "a rectangle right of the original - 1px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':200,'max_x':300,'min_y':102,'max_y':200}), true,  "a rectangle right of the original - 0px away" );
    assert.deepEqual( calc.check_adjacency(curr, {'name': 'b','min_x':199,'max_x':300,'min_y':102,'max_y':200}), false, "a rectangle right of the original - -1px away" );
    // bottom-right
    //...
    // bottom
    //...
    // bottom-left
    //...
    //left
    //...
});

QUnit.test( "check_rectangles test", function( assert ) {
    var datastore, expect;

    // empty data
    datastore = {};
    expect = [];
    assert.deepEqual( calc.check_rectangles(datastore), expect, "empty datastore" );

    // one rectangle
    datastore = {
        'a': ["a",0,0,100,100]
    };
    expect = [];
    assert.deepEqual( calc.check_rectangles(datastore), expect, "one rectangle" );

    // two non related rectangles
    datastore = {
        'a': ["a",0,0,100,100],
        'b': ["b",200,200,100,100]
    };
    expect = [
        {
            "compared": "b",
            "current": "a",
            "intersection": null,
            "is_adjacent": false
        }
    ];
    assert.deepEqual( calc.check_rectangles(datastore), expect, "two non related rectangles" );

    // two intersecting rectangles
    datastore = {
        'a': ["a",0,0,100,100],
        'b': ["b",50,50,100,100]
    };
    expect = [
        {
            "compared": "b",
            "current": "a",
            "intersection": {
                "int_coordinates": [
                    {
                        "x": 50,
                        "y": 100
                    },
                    {
                        "x": 100,
                        "y": 50
                    }
                ],
                "is_contained": false,
                "is_containing": false,
                "is_intersecting": true
            },
            "is_adjacent": false
        }
    ];
    assert.deepEqual( calc.check_rectangles(datastore), expect, "two intersecting rectangles" );


    // two containing rectangles
    datastore = {
        'a': ["a",0,0,100,100],
        'b': ["b",50,50,40,40]
    };
    expect = [
        {
            "compared": "b",
            "current": "a",
            "intersection": {
                "int_coordinates": [],
                "is_contained": false,
                "is_containing": true,
                "is_intersecting": false
            },
            "is_adjacent": false
        }
    ];
    assert.deepEqual( calc.check_rectangles(datastore), expect, "two containing rectangles" );

    // two containing rectangles
    datastore = {
        'a': ["a",55,55,5,5],
        'b': ["b",50,50,40,40]
    };
    expect = [
        {
            "compared": "a",
            "current": "b",
            "intersection": {
                "int_coordinates": [],
                "is_contained": false,
                "is_containing": true,
                "is_intersecting": false
            },
            "is_adjacent": false
        }
    ];
    assert.deepEqual( calc.check_rectangles(datastore), expect, "two containing rectangles2" );

    // two  rectangles with 4 intersections
    datastore = {
        'a': ["a",0,55,100,5],
        'b': ["b",50,50,40,40]
    };
    expect = [
        {
            "compared": "b",
            "current": "a",
            "intersection": {
                "int_coordinates": [
                    {
                        "x": 50,
                        "y": 55
                    },
                    {
                        "x": 50,
                        "y": 60
                    },
                    {
                        "x": 90,
                        "y": 55
                    },
                    {
                        "x": 90,
                        "y": 60
                    }
                ],
                "is_contained": false,
                "is_containing": false,
                "is_intersecting": true
            },
            "is_adjacent": false
        }
    ];
    assert.deepEqual( calc.check_rectangles(datastore), expect, "two  rectangles with 4 intersections" );

    // three rectangles
    datastore = {
        'a': ["a",0,0,100,100],
        'b': ["b",50,50,400,400],
        'c': ["c",300,0,400,400]
    };
    expect = [
        {
            "compared": "b",
            "current": "a",
            "intersection": {
                "int_coordinates": [
                    {
                        "x": 50,
                        "y": 100
                    },
                    {
                        "x": 100,
                        "y": 50
                    }
                ],
                "is_contained": false,
                "is_containing": false,
                "is_intersecting": true
            },
            "is_adjacent": false
        },
        {
            "compared": "c",
            "current": "a",
            "intersection": null,
            "is_adjacent": false
        },
        {
            "compared": "c",
            "current": "b",
            "intersection": {
                "int_coordinates": [
                    {
                        "x": 300,
                        "y": 50
                    },
                    {
                        "x": 450,
                        "y": 400
                    }
                ],
                "is_contained": false,
                "is_containing": false,
                "is_intersecting": true
            },
            "is_adjacent": false
        }
    ];
    assert.deepEqual( calc.check_rectangles(datastore), expect, "three rectangles" );

    // test with full default set
    datastore = {
        'default': ["default",0,0,200,150],
        'a': ["a",11,80,289,150],
        'b': ["b",300,0,200,150],
        'foobar': ["foobar",350,50,70,50]
    };
    expect =
        [
            {
                "compared": "a",
                "current": "default",
                "intersection": {
                    "int_coordinates": [
                        {
                            "x": 11,
                            "y": 150
                        },
                        {
                            "x": 200,
                            "y": 80
                        }
                    ],
                    "is_contained": false,
                    "is_containing": false,
                    "is_intersecting": true
                },
                "is_adjacent": false
            },
            {
                "compared": "b",
                "current": "default",
                "intersection": null,
                "is_adjacent": false
            },
            {
                "compared": "foobar",
                "current": "default",
                "intersection": null,
                "is_adjacent": false
            },
            {
                "compared": "b",
                "current": "a",
                "intersection": null,
                "is_adjacent": true
            },
            {
                "compared": "foobar",
                "current": "a",
                "intersection": null,
                "is_adjacent": false
            },
            {
                "compared": "foobar",
                "current": "b",
                "intersection": {
                    "int_coordinates": [],
                    "is_contained": false,
                    "is_containing": true,
                    "is_intersecting": false
                },
                "is_adjacent": false
            }
        ];
    assert.deepEqual( calc.check_rectangles(datastore), expect, "test with full default set, 4 rectangles" );

});
