# README - Rectangalyzer
This is a small little tool to draw and analyze rectangles :)
It is intended to be fairly lightweight and simple,
so it only uses Javascript and JQuery without fancy extras.

## key features
The Rectangalyzer tool has 4 main features:
* Draw a set of named rectangles by: x,y,width,height
* Calculate intersection coordinates (if existing)
* Find containment
* Find adjecencies

It works with a unlimited number of rectangles. 
However, comparisons only happen between two individual elements.

**Notice:** Allthough, this tool allows for unlimited rectangles,
performance and efficiency was not it's main focus. It is build to be reasonably performant,
but does not use higher efficiency algorithms like sweeping lines. 

## how to
Upon startup the tool is initialized with a default set of rectangles.

To **add** a new rectangle, fill the fields on the *Cintrols* panel and **click Draw & Analyze**.
The rectangle will be drawn and analyzed against other existing rectangles. 

To **delete** the data, click the **Clear All** button.

To **modify** the data, **click on the name** of the rectangle under *Current Elements*. 
The data will be loaded into the *Controls* panel. 
Upon Drawing, the original data will be overridden by the new set (unless the name is changed!)   

## testing
If you like to test the code, just open the test/test.html in your browser.

**Notice:**  the tests are only demonstrational and not extensive. 
