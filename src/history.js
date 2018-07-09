var searchHistory = {
  name: "sf-css-order-no",

  add: function(orderNo) {
    if (!orderNo) {
      return;
    }
    var h = this._get();
    var has = false;
    for (var i = 0; i < h.length; i++) {
      if (orderNo === h[i]) {
        has = true;
        break;
      }
    }
    if (has) {
      return;
    }

    if (h.length < 6) {
      h.unshift(encodeURIComponent(orderNo));
    }

    localStorage.setItem(this.name, h.join());
  },

  _get: function() {
    var temp = [];
    var value = localStorage.getItem(this.name);
    if (value) {
      temp = temp.concat(value.split(","));
    }

    return temp;
  },

  get: function() {
    var temp = this._get();
    temp.map(e => {
      return decodeURIComponent(e);
    });
    return temp;
  },
  clear: function() {
    localStorage.removeItem(this.name);
  }
};

export default searchHistory;
