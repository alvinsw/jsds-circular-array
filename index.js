'use strict';

module.exports = CircularArray;

/**
 * @params opt length or array
 * If array is given, the CircularArray will assume the max size of that array.
 **/
function CircularArray(opt) {
  if (!(this instanceof CircularArray)) return new CircularArray(opt);

  if (typeof opt === 'number') {
    this._data = new Array(opt);
    this._size = 0;
  } else if (Array.isArray(opt) && opt.length) {
    this._data = opt.slice();
    this._size = opt.length;
  } else {
    throw new TypeError('Invalid or missing argument: needs a valid array size or a non-empty array');
  }
  this._start = 0;

}

var proto = CircularArray.prototype;

Object.defineProperty(proto, 'size', { enumerable: true, get : function () { return this._size } });

/** The length of the backing array, this is the maximum capacity of this Circular Array **/
Object.defineProperty(proto, 'length', { enumerable: true,
  get : function () {
    return this._data.length;
  },
  /** Set the maximum capacity of this Circular Array, same as calling reserve(val) **/
  set : function(size) {
    this.reserve(size);
  }
});

/** Add one or more elements to the end of the list. O(1) */
proto.push = function() {
  if (arguments.length === 0) return this._size;
  var i;
  var length = this._data.length;
  var next = ( this._start + this._size ) % length;
  // push one or more values to the array, overwritten existing one if capacity is full
  for (i = 0; i < arguments.length; ++i) {
    this._data[(next + i) % length] = arguments[i];
  }
  // recalculate size
  if (this._size < length) {
    this._size += i;
    if (this._size > length) this._size = length;
  }
  // recalculate start
  this._start = (length + ((next + i) % length) - this._size) % length;
  // return the size of collection
  return this._size;
};

/** Remove and return the last element. O(1) */
proto.pop = function() {
  if (this._size) {
    var end = ( this._start + this._size - 1 ) % this._data.length;
    var val = this._data[end];
    this._data[end] = null;
    --this._size;
    return val;
  }
};

/** Add one or more elements to the start of the list and return the new size. O(1) */
proto.unshift = function() {
  if (arguments.length === 0) return this._size;
  var length = this._data.length;
  // prepend one or more values to the array, overwritten existing one if capacity is full
  var i, alen = arguments.length;
  var pos = this._start;
  var offset = alen - pos;
  if (offset < 0) offset = 0;
  for (i = alen - 1; i >= offset; i--) {
    this._data[--pos] = arguments[i];
  }
  pos = length;
  for ( ; i >= 0; i--) {
    this._data[--pos] = arguments[i];
  }

  // recalculate size
  if (this._size < length) {
    this._size += alen;
    if (this._size > length) this._size = length;
  }
  // recalculate start
  this._start -= alen;
  if (this._start < 0) this._start = length + (this._start % length);
  // return the size of collection
  return this._size;
};

/** Remove and return the first element. O(1) */
proto.shift = function() {
  if (this._size) {
    var val = this._data[this._start];
    this._data[this._start] = null;
    ++this._start;
    if (this._start >= this._data.length) this._start = 0;
    --this._size;
    return val;
  }
};

proto.reserve = function(size) {
  var newsize = (size < this._size) ? this._size : size;
  var length = this._data.length;
  if (newsize < length) {
    this._data = this.toArray();
    this._start = 0;
  } else if (newsize > length) {
    var newdata = new Array(newsize);
    this.forEach(function(val, i) {
      newdata[i] = val;
    });
    this._data = newdata;
    this._start = 0;
  }
};

/** O(1) */
proto.get = function (index) {
  if (index < this._size && index >= 0) {
    return this._data[(this._start + index) % this._data.length];
  }
};

/**
 * This method is provided for inspection/convenience only.
 * It cannot be used to insert new element and it does not increase the collection size.
 * O(1)
 **/
proto.set = function (index, value) {
  if (index >= this._size) throw new TypeError('Index out of bound');
  else this._data[(this._start + index) % this._data.length] = value;
};

proto.first = function () {
  return this.get(0);
};

proto.last = function () {
  return this.get(this._size - 1);
};

proto.isEmpty = function () {
  return this._size === 0;
};

proto.isFull = function () {
  return this._size === this._data.length;
};

proto.toArray = function() {
  var result = new Array(this._size);
  this.forEach(function(val, i) {
    result[i] = val;
  });
  return result;
};

//val, index, obj
proto.forEach = function(callback, thisArg) {
  var data = this._data;
  var length = this._data.length;
  var end1 = this._start + this._size;
  var end2 = 0;
  if (end1 > length) {
    end2 = end1 - length;
    end1 = length;
  }
  var pos = this._start;
  var i = 0;
  while (pos < end1) {
    callback.call(thisArg, data[pos++], i++, this);
  }
  pos = 0;
  while (pos < end2) {
    callback.call(thisArg, data[pos++], i++, this);
  }
};

// O(n)
proto.toString = function() {
  var data = this._data, start = this._start, length = data.length, size = this._size;
  var result = (size === 0) ? '' : data[start];
  for (var i=1; i<size; ++i) {
    result += (',' + data[(start + i) % length]);
  }
  return result;
};

proto.indexOf = function(val, fromIndex_) {
  var data = this._data, start = this._start, length = data.length, size = this._size;
  var fromIndex = fromIndex_ || 0;
  for (var i=fromIndex; i<size; ++i) {
    if (data[(start + i) % length] === val) return i;
  }
  return -1;
};

proto.lastIndexOf = function(val, fromIndex_) {
  var data = this._data, start = this._start, length = data.length, size = this._size;
  var fromIndex = fromIndex_ || 0;
  var foundIndex = -1;
  for (var i=fromIndex; i<size; ++i) {
    if (data[(start + i) % length] === val) foundIndex = i;
  }
  return foundIndex;
};
