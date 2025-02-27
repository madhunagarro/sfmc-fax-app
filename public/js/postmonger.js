!function(e, t) {
    "function" == typeof define && define.amd ? define([], t) : "object" == typeof module && module.exports ? module.exports = t() : e.Postmonger = t();
  }(this, function() {
    var e = {}, t = function() {
      var e = {};
      return {
        on: function(t, n) {
          e[t] || (e[t] = []);
          e[t].push(n);
        },
        off: function(t, n) {
          if (e[t]) {
            var r = e[t].indexOf(n);
            -1 !== r && e[t].splice(r, 1);
          }
        },
        trigger: function(t) {
          if (e[t]) {
            for (var n = Array.prototype.slice.call(arguments, 1), r = 0; r < e[t].length; r++) {
              e[t][r].apply(null, n);
            }
          }
        }
      };
    };
    return e.Session = function() {
      return t();
    }, e;
  });
  