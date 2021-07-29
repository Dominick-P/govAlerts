var alertsAccord = $("#alertsAccord");
var alertTemplate = $("#alertTemplate");
var alertsSpinner = $("#alertsSpinner");
var url = new URL(window.location.href);
var geoLocation = url.searchParams.get("c");
var zipCode = url.searchParams.get("zip");

function setZip(postalCode) {
    var locationData = await axios.get(`https://api.promaptools.com/service/us/zip-lat-lng/get/?zip=${postalCode}&key=17o8dysaCDrgv1c`);

    if (locationData.data && locationData.data.output) {
        window.location = `/alerts?c=${locationData.data.output.latitude},${locationData.data.output.longitude}`
    }
}

$("#submitPostal").on("click", function () {
    setZip($("#inputPostal").val());
});

if (zipCode) {
    setZip(postalCode);
    $("#inputPostal").val(postalCode);
}

(async () => {
    if (!geoLocation) {
        var locationData = await axios.get("https://ipapi.co/json/");

        if (locationData.data) {
            geoLocation = locationData.data.latitude + "," + locationData.data.longitude;
            $("#mainTitle").text(locationData.data.city + " Weather Alerts")
        }
    }

    geoLocation = geoLocation.split(",");

    function getAlertsFromPoint(lat, long) {
        return new Promise((resolve, reject) => {
            axios.get(`https://api.weather.gov/alerts/active?point=${lat},${long}`).then(response => {
                if (response.data) {
                    resolve(response.data);
                }
            });
        });
    }

    getAlertsFromPoint(geoLocation[0], geoLocation[1]).then(data => {
        var count = 0

        alertsSpinner.remove();

        if (data.features.length == 0) {
            $("#noAlerts").attr("style", "");
        }

        data.features.forEach(alert => {
            var template = alertTemplate.clone();
            var alertButton = template.find(".accordion-button");
            var alertHeader = template.find(".accordion-header");
            var alertCollapse = template.find(".accordion-collapse");
            var alertBody = template.find(".accordion-body");

            count++;

            template.attr("id", "alert" + count);

            alertButton.attr("data-bs-target", "#collapse" + count);
            alertButton.attr("aria-controls", "#collapse" + count);

            alertHeader.attr("id", "heading" + count);
            alertCollapse.attr("aria-labelledby", "heading" + count);

            alertCollapse.attr("id", "collapse" + count);
            alertBody.html(`<strong>${alert.properties.headline}</strong><br><br>${alert.properties.instruction}`);
            alertButton.html(`${alert.properties.event}`);

            alertCollapse.attr("data-bs-parent", "#alert" + count);

            template.attr("style", "");
            template.appendTo(alertsAccord);
        });
    });
})();