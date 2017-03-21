#### JavaScript Data Structure Library
# CircularArray
This is a JavaScript implementation of circular buffer (or cyclic buffer, or ring buffer) data structure.
It is implemented using a single, fixed-size built-in array as if it were connected end-to-end.
It provides a bounded storage well suited for keeping a list of the most recent N objects.

## Usage

    const CircularArray = require('jsds-circular-array');
    var buf = new CircularArray(5);

    buf.push('a'); // returns 1
    buf.push('b'); // returns 2
    buf.push('c'); // returns 3
    buf.push('d'); // returns 4
    buf.push('e'); // returns 5
    buf.push('f'); // returns 5

    var first = buf.get(0);  // returns 'b'
