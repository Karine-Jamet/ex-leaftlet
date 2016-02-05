$(document).ready(function() {





  var file = $.getJSON("tweet.json", function(json) {
    var coor = json.shift();

    var map = L.map('map').setView([coor.lat, coor.long], 5);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);


    var tweet = json.map(function(a) {
      console.log(a.name);
      var marker = L.marker([a.gps[0], a.gps[1]]).addTo(map);
      marker.bindPopup('<p>' + a.text + '</p><em>' + a.name + '</em>').openPopup();
    });


    var marker = L.marker([coor.lat, coor.long]).addTo(map);
    marker.bindPopup('<p>Ma position</p><em>SIMPLonMARS</em>').openPopup();
  });




});
