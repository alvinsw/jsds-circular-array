'use strict';
var assert = require("assert")
var CircularArray = require('../index.js');

var testcase5 = [0,1,2,3,4];

function testStart(n, fn){
  var arr=[], arr2, instance, i, j;
  for (i=0; i<n; ++i) arr.push(i);
  for (i=0; i<n; ++i) {
    instance = CircularArray(arr);
    arr2 = [];
    for (j=i; j<i+n; ++j) {
      arr2.push(j);
    }
    // push extra to get different starting position
    for (j=n; j<n+i; ++j) {
      instance.push(j);
    }
    fn(i, instance, arr2);
  }
}

describe('CircularArray', function() {
  describe('constructor with new', function () {
    it('should return an instance of CircularArray', function () {
      var instance = new CircularArray(1);
      assert.equal(instance instanceof CircularArray, true);
      assert.equal(0, instance.size);
    });
    it('should accept array', function () {
      var instance = new CircularArray([1,2,3,4,5]);
      assert.deepEqual([1,2,3,4,5], instance._data);
      assert.equal(5, instance.size);
    });
    it('should not accept other arguments except number and array', function () {
      assert.throws(function(){
        var instance = new CircularArray();
      });
      assert.throws(function(){
        var instance = new CircularArray('test');
      });
      assert.throws(function(){
        var instance = new CircularArray({});
      });
      assert.throws(function(){
        var instance = new CircularArray([]);
      });
    });
  });
  
  describe('constructor without new', function () {
    it('should return an instance of CircularArray', function () {
      var instance = CircularArray(1);
      assert.equal(instance instanceof CircularArray, true);
      assert.equal(0, instance.size);
    });
  });
  
  describe('#push', function () {
    it('should increase the size', function () {
      var maxsize = 5;
      var instance = CircularArray(maxsize);
      assert.equal(0, instance.size, 'a1');
      for (var i = 0; i < 20; ++i) {
        var s = instance.push(i);
        assert.equal(s, instance.size);
        if (i < maxsize) {
          assert.equal(i+1, instance.size, 'a2');
        } else {
          assert.equal(maxsize, instance.size), 'a3';
        }
      }
    });
    it('should set correct start pos and data', function () {
      var s, maxsize = 5;
      var instance = CircularArray(maxsize);
      s = instance.push(0,1,2,3);
      assert.equal(0, instance._start);
      assert.deepEqual([0,1,2,3], instance._data);
      s = instance.push(4,5,6);
      assert.equal(2, instance._start);
      assert.deepEqual([5,6,2,3,4], instance._data);
      s = instance.push(7);
      assert.equal(3, instance._start);
      assert.deepEqual([5,6,7,3,4], instance._data);
      s = instance.push(8,9,10);
      assert.equal(1, instance._start);
      assert.deepEqual([10,6,7,8,9], instance._data);
    });
  });
  
  describe('#pop', function () {
    it('should decrease the size', function () {
      var testcase = [1,2,3,4,5];
      var instance = new CircularArray(testcase);
      for (var i = testcase.length; i--; ) {
        var val = instance.pop();
        assert.equal(val, testcase[i]);
        assert.equal(i, instance.size);
      }
      assert.equal(undefined, instance.pop());
      assert.equal(0, instance.size);
    });
    it('should return correct value', function () {
      var testcase = [0,1,2,3,4];
      var instance = new CircularArray(testcase);
      var s = instance.push(5,6); //[5,6,2,3,4]
      assert.equal(5, s);
      assert.equal(2, instance._start);
      assert.deepEqual([5,6,2,3,4], instance._data);
      var val;
      val = instance.pop();
      assert.equal(6, val);
      assert.equal(4, instance.size);
      assert.deepEqual([5,null,2,3,4], instance._data);
      
      val = instance.pop();
      assert.equal(5, val);
      assert.equal(3, instance.size);
      assert.deepEqual([null,null,2,3,4], instance._data);
      
      val = instance.pop();
      assert.equal(4, val);
      assert.equal(2, instance.size);
      assert.deepEqual([null,null,2,3,null], instance._data);
      
      val = instance.pop();
      assert.equal(3, val);
      assert.equal(1, instance.size);
      assert.deepEqual([null,null,2,null,null], instance._data);
      
      val = instance.pop();
      assert.equal(2, val);
      assert.equal(0, instance.size);
      assert.deepEqual([null,null,null,null,null], instance._data);
      
      val = instance.pop();
      assert.equal(null, val);
    });
  });
  
  describe('#unshift', function () {
    //TODO: it should add one, two, three elements at different positions.
    it('should handle start == 0', function () {
      var instance = CircularArray(5);
      instance.push(0,1,2);
      var s = instance.unshift(-1);
      assert.equal(4, instance.size);
      assert.equal(4, instance._start);
      assert.deepEqual([0,1,2,,-1], instance._data);
      var s = instance.unshift(-2);
      assert.equal(5, instance.size);
      assert.equal(3, instance._start);
      assert.deepEqual([0,1,2,-2,-1], instance._data);
      var s = instance.unshift(-5,-4,-3);
      assert.equal(5, instance.size);
      assert.equal(0, instance._start);
      assert.deepEqual([-5,-4,-3,-2,-1], instance._data);
    });
    
    it('should handle 0 < start < length', function () {
      var instance = CircularArray(testcase5);
      instance.push(5,6); //[5,6,2,3,4]
      var s = instance.unshift(1);
      assert.equal(1, instance._start);
      assert.deepEqual([5,1,2,3,4], instance._data);
    });
    it('should handle 0 < start < length, then start == 0', function () {
      var instance = CircularArray(testcase5);
      instance.push(5,6); //[5,6,2,3,4]
      var s = instance.unshift(0,1);
      assert.equal(0, instance._start);
      assert.deepEqual([0,1,2,3,4], instance._data);
    });
    it('should handle 0 < start < length, then start wrap', function () {
      var instance = CircularArray(testcase5);
      instance.push(5,6); //[5,6,2,3,4]
      var s = instance.unshift(-1,0,1);
      assert.equal(4, instance._start);
      assert.deepEqual([0,1,2,3,-1], instance._data);
    });
  });
  
  describe('#shift', function () {
    function test(c) {
      var instance = CircularArray(testcase5);
      for (var i=5; i<5+c; ++i) instance.push(i);
      it('should handle one element, start=' + c, function () {
        var val = instance.shift();
        assert.equal(c, val);
        assert.equal(4, instance.size);
      });
      it('should handle next 3 elements, start=' + c, function () {
        var val = instance.shift();
        assert.equal(c+1, val);
        assert.equal(3, instance.size);
        val = instance.shift();
        assert.equal(c+2, val);
        assert.equal(2, instance.size);
        val = instance.shift();
        assert.equal(c+3, val);
        assert.equal(1, instance.size);
      });
      it('should handle last element, start=' + c, function () {
        var val = instance.shift();
        assert.equal(c+4, val);
        assert.equal(0, instance.size);
      });
      it('should handle empty collection, start=' + c, function () {
        var val = instance.shift();
        assert.equal(null, val);
        assert.equal(0, instance.size);
      });
    }
    for (var c=0; c<5; ++c) test(c);
  });
  
  describe('#get', function () {
    it('should return undefined when the value is not present', function () {
      var instance = CircularArray(10);
      assert.equal(null, instance.get(0));
      assert.equal(null, instance.get(10));
    });
    it('should return correct value for each index', function () {
      var instance = CircularArray(testcase5);
      for (var i = 0; i < testcase5.length; ++i) { 
        assert.equal(testcase5[i], instance.get(i));
      }
      assert.equal(null, instance.get(10));
    });
  });
  
  describe('#set', function () {
    var instance = CircularArray(10);
    it('should throw error if index is out of bound', function () {
      assert.throws(function(){
        instance.set(0, 'a');
      });
      instance.push('a');
      assert.throws(function(){
        instance.set(1, 'a');
      });
    });
    it('should set correct value for each index', function () {
      var instance = CircularArray(testcase5);
      // offset the start
      instance.push(5,6,7);
      assert.equal(3, instance._start);
      
      for (var i = 0; i < 5; ++i) { 
        instance.set(i, 'a'+i);
        assert.equal('a'+i, instance.get(i));
      }
      assert.equal(null, instance.get(10));
    });
  });
  
  describe('#isFull', function () {
    var instance = CircularArray(5);
    it('should return false when not full', function () {
      assert.equal(false, instance.isFull());
      instance.push(0);
      assert.equal(false, instance.isFull());
    });
    it('should return true when its full', function () {
      instance.push(0,0,0,0,0,0);
      assert.equal(true, instance.isFull());
    });
  });
  
  describe('#toString', function () {
    testStart(5, function(s, instance, arr){
      it('should print correct output, start='+s, function () {
        assert.equal(instance.toString(), arr.toString());
      });
    });
  });
  
//  describe('#forEach', function () {
//  });
//  describe('#toArray', function () {
//  });
  
});