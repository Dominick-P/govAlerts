var alertsAccord = $("#alertsAccord");
var alertTemplate = $("#alertTemplate");
var alertsSpinner = $("#alertsSpinner");
var url = new URL(window.location.href);
var geoLocation = url.searchParams.get("c");

(() => {
    if (!geoLocation) return;

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