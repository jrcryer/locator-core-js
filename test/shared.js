var shared, sinon, cookieString;

module("Shared", {
  setup: function() {
    cookieString = "locserv=1#l1#i=2653822:n=Cardiff:h=w@w1#i=4:p=Cardiff@d1#1=wa:2=w:3=w:4=44.9@n1#r=53;";
    locator.core.Shared.prototype.setCookieString = function(value) {
      document.cookie = cookieString;
    };
    var api = new locator.core.API({ palDomain: "http://localhost:9999/test/fixtures" });
    shared = new locator.core.Shared(api);
  }, teardown: function() {
    document.cookie = "";
  }
});

test("should return null if cookie not set", function() {
  equal(shared.get(), null, "Cookie was not previously set");
});

test("should return the location object if set", function() {
  expect(3);
  sinon.stub(shared, "getCookieString").returns(cookieString);
  var location = shared.get();

  equal("2653822", location.id);
  equal("Cardiff", location.name);
  equal("wales", location.nation);
});

test("should return the news object if set", function() {
  expect(2);
  sinon.stub(shared, "getCookieString").returns(cookieString);
  var location = shared.get();

  equal("53", location.news.id);
  equal("wales/south_east_wales", location.news.path);
});

test("should return the weather object if set", function() {
  expect(2);
  sinon.stub(shared, "getCookieString").returns(cookieString);
  var location = shared.get();

  equal("4", location.weather.id);
  equal("Cardiff", location.weather.name);
});

asyncTest("should correctly set cookie", function() {
  expect(2);
  shared.set("2653822", {
    success: function(location) {
      equal("2653822", location.id, "Cookie value not retrieved successfully");
      equal("Cardiff", location.name, "Cookie value not retrieved successfully");
      start();
    }
  });
});
