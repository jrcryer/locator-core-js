(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    return define(factory);
  } else {
    if (typeof locator === "undefined") {
      global.locator = { core: {}};
    }
    locator.core.Shared = factory();
  }
}(this, function() {

  "use strict";

  function Shared(api) {
    this.name = "locserv";
    this.api = api;
  }

  /**
   * Checks if the locserv cookie has been set
   *
   * @return {Boolean}
   */
  Shared.prototype.isSet = function() {
    if (this.get() !== null) {
      return true;
    }
    return false;
  };

  /**
   * Get the current users location by accessing the cookie.
   *
   * @return {Object}
   */
  Shared.prototype.get = function() {
    var cookie, domains, domain, getValues, index;

    if (this.hasParsedCoookie) {
      return this.location;
    }

    getValues = function(store) {
      var index;
      var name;
      var values;
      var value;
      var data = {};

      name = store.substr(0, 1);
      store = store.substr(3);
      values = store.split(":");
      for (index = 0; index < values.length; index++) {
        value = values[index].split("=");
        value[1] = value[1].replace(/\+/g, "%20");
        data[value[0]] = decodeURIComponent(value[1]);
      }

      return {
        name : name,
        data : data
      };
    };

    cookie = this.getCookieString().match(this.name + "=(.*?)(;|$)");
    if (!cookie || cookie.length < 2){
      return null;
    }

    this.location = {
      id      : null,
      name    : null,
      nation  : null,
      news    : null,
      weather : null
    };

    domains = cookie[1].substr(2).split("@");
    for (index = 0; index < domains.length; index++) {
      domain = getValues(domains[index]);
      if ("l" === domain.name) {
        this.location.id = domain.data.i;
        this.location.name = domain.data.n;
        if (domain.data.h) {
          this.location.nation = nationsMap[domain.data.h];
        }
      } else if ("w" === domain.name) {
        this.location.weather = {
          id   : domain.data.i,
          name : domain.data.p
        };
      } else if ("n" === domain.name) {
        this.location.news = {
          id   : domain.data.r,
          path : newsMap[domain.data.r]
        };
      }
    }

    this.hasParsedCoookie = true;

    return this.location;

  };

  /**
   * Sets the locserv cookie based on a location id.
   *
   * @param {String} locationId A valid Geoname ID or Postcode
   * @param {String} options An object containing both a 'success' and 'error' handlers
   * @return void
   */
  Shared.prototype.set = function(locationId, options) {
    options = options || {};
    var self = this;
    this.api.getCookie(locationId, {
      success: function(data) {
        var cookieString;
        cookieString = self.name + "=" + data.cookie  + "; ";
        cookieString += "expires=" + data.expires + "; ";
        cookieString += "path=." + window.location.hostname + ";";
        self.setCookieString(cookieString);
        if (typeof options.success === "function") {
          options.success(self.get());
        }
      },
      error: function(event) {
        if (typeof options.error === "function") {
          options.error(event);
        }
      }
    });
  };

  /**
   * Unsets the locserv cookie.
   *
   * @return void
   */
  Shared.prototype.unset = function() {
    document.cookie = this.name + "=0; expires=-1; domain=." + window.location.hostname + ";";
  };

  /**
   * Get the current cookie string. This is primarily used for stubbing
   * during for test purposes.
   *
   * @return {String}
   */
  Shared.prototype.getCookieString = function() {
    return document.cookie;
  };

  /**
   * Set the current cookie string. This is primarily used for stubbing
   * during for test purposes.
   *
   * @param {String} value The value to set the cookie to
   * @return void
   */
  Shared.prototype.setCookieString = function(value) {
    document.cookie = value;
  };

  var newsMap = {
    3  : "england/berkshire",
    4  : "england/birmingham_and_black_country",
    7  : "england/bristol",
    8  : "england/cambridgeshire",
    11 : "england/cornwall",
    12 : "england/coventry_and_warwickshire",
    13 : "england/cumbria",
    16 : "england/derbyshire",
    17 : "england/devon",
    18 : "england/dorset",
    19 : "scotland/edinburgh_east_and_fife",
    20 : "england/essex",
    22 : "scotland/glasgow_and_west",
    23 : "england/gloucestershire",
    26 : "world/europe/guernsey",
    27 : "england/hampshire",
    28 : "england/hereford_and_worcester",
    30 : "scotland/highlands_and_islands",
    31 : "england/humberside",
    32 : "world/europe/isle_of_man",
    33 : "world/europe/jersey",
    34 : "england/kent",
    35 : "england/lancashire",
    36 : "england/leeds_and_west_yorkshire",
    37 : "england/leicester",
    38 : "england/lincolnshire",
    39 : "england/merseyside",
    40 : "england/london",
    41 : "england/manchester",
    42 : "wales/mid_wales",
    43 : "england/norfolk",
    44 : "england/northamptonshire",
    45 : "scotland/north_east_orkney_and_shetland",
    46 : "wales/north_east_wales",
    21 : "northern_ireland",
    47 : "wales/north_west_wales",
    49 : "england/nottingham",
    50 : "england/oxford",
    57 : "england/south_yorkshire",
    51 : "england/shropshire",
    52 : "england/somerset",
    53 : "wales/south_east_wales",
    55 : "scotland/south_scotland",
    56 : "wales/south_west_wales",
    58 : "england/stoke_and_staffordshire",
    59 : "england/suffolk",
    66 : "england/surrey",
    60 : "england/sussex",
    61 : "scotland/tayside_and_central",
    62 : "england/tees",
    1  : "england/beds_bucks_and_herts",
    63 : "england/tyne_and_wear",
    65 : "england/wiltshire",
    48 : "england/york_and_north_yorkshire"
  };

  var newsRegionsMap = {
    56 : "South West Wales",
    28 : "Hereford &amp; Worcester",
    36 : "Leeds and Bradford",
    60 : "Sussex",
    61 : "Tayside &amp; Central Scotland",
    62 : "Tees",
    63 : "Tyne and Wear",
    35 : "Lancashire",
    66 : "Surrey",
    34 : "Kent",
    26 : "Guernsey",
    27 : "Hampshire",
    20 : "Essex",
    21 : "Northern Ireland",
    48 : "York &amp; North Yorkshire",
    49 : "Nottinghamshire",
    46 : "North East Wales",
    47 : "North West Wales",
    44 : "Northampton",
    45 : "North East Scotland Orkney &amp; Shetland",
    42 : "Mid Wales",
    43 : "Norfolk",
    40 : "London",
    41 : "Manchester",
    1  : "Beds Herts &amp; Bucks",
    3  : "Berkshire",
    4  : "Birmingham and Black Country",
    7  : "Bristol",
    8  : "Cambridgeshire",
    13 : "Cumbria",
    12 : "Coventry &amp; Warwickshire",
    30 : "Highlands &amp; Islands",
    58 : "Stoke &amp; Staffordshire",
    11 : "Cornwall",
    39 : "Liverpool",
    38 : "Lincolnshire",
    59 : "Suffolk",
    22 : "Glasgow &amp; West of Scotland",
    17 : "Devon",
    16 : "Derby",
    19 : "Edinburgh Fife &amp; East of Scotland",
    18 : "Dorset",
    31 : "Humberside",
    23 : "Gloucestershire",
    51 : "Shropshire",
    50 : "Oxford",
    53 : "South East Wales",
    52 : "Somerset",
    33 : "Jersey",
    55 : "South Scotland",
    37 : "Leicestershire",
    32 : "Isle of Man",
    57 : "Sheffield &amp; South Yorkshire",
    65 : "Wiltshire"
  };

  var newsTldMap = {
    56 : "southwestwales",
    42 : "midwales",
    50 : "oxford",
    60 : "sussex",
    61 : "taysideandcentralscotland",
    62 : "tees",
    63 : "tyne",
    49 : "nottingham",
    66 : "surrey",
    52 : "somerset",
    53 : "southeastwales",
    26 : "guernsey",
    27 : "hampshire",
    20 : "essex",
    21 : "northernireland",
    22 : "glasgowandwestscotland",
    23 : "gloucestershire",
    46 : "northeastwales",
    47 : "northwestwales",
    44 : "northampton",
    45 : "northeastscotlandnorthernisles",
    28 : "herefordandworcester",
    43 : "norfolk",
    40 : "london",
    41 : "manchester",
    1  : "threecounties",
    3  : "berkshire",
    4  : "birmingham",
    7  : "bristol",
    8  : "cambridgeshire",
    39 : "liverpool",
    38 : "lincolnshire",
    58 : "stoke",
    11 : "cornwall",
    51 : "shropshire",
    13 : "cumbria",
    12 : "coventry",
    59 : "suffolk",
    48 : "york",
    17 : "devon",
    16 : "derby",
    19 : "edinburghandeastscotland",
    18 : "dorset",
    31 : "humberside",
    30 : "highlandsandislands",
    37 : "leicester",
    36 : "leeds",
    35 : "lancashire",
    34 : "kent",
    33 : "jersey",
    55 : "southscotland",
    32 : "isleofman",
    57 : "sheffield",
    65 : "wiltshire"
  };

  var nationsMap = {
    e : "england",
    n : "northernireland",
    s : "scotland",
    w : "wales"
  };

  return Shared;

}));
