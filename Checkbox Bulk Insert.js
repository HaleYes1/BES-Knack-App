var addCheckboxes = function (view) {

    // add the checkbox to to the header to select/unselect all
    $('#' + view.key + '.kn-table thead tr').prepend('<th><input type="checkbox"></th>');

    $('#' + view.key + '.kn-table thead input').change(function () {
        $('.' + view.key + '.kn-table tbody tr input').each(function () {
            $(this).attr('checked', $('#' + view.key + '.kn-table thead input').attr('checked') != undefined);
        });
    });

    // add a checkbox to each row in the table body
    $('#' + view.key + '.kn-table tbody tr').each(function () {
        $(this).prepend('<td><input type="checkbox"></td>');
    });
}


/**** CHANGE VIEW_ID TO YOUR OWN VIEW ID ****/
$(document).on('knack-view-render.view_34', function (event, view) {

    // Add an update button
    $('<button id="update"">Update</button>').insertAfter('.view-header');

    // Add checkboxes to our table
    addCheckboxes(view);

    // Click event for the update button
    $('#update').click(function () {

        // We need an array of record IDs
        var checkedRecords = [];

        // Populate the record IDs using all checked rows
        $('#' + view.key + ' tbody input[type=checkbox]:checked').each(function () {
            checkedRecords.push($(this).closest('tr').attr('id')); // record id
        });

        Knack.showSpinner();

        Knack.models['view_34'].data.toJSON();

        //populate table records from view
        var data_view_34 = Knack.models['view_34'].data.toJSON();

        var url = "https://api.knackhq.com/v1/objects/object_11/records"
        headers = {
            "X-Knack-Application-Id": '58c2dd83fde87a27c6be653b',
            "X-Knack-REST-API-Key": 'c652baa0-373e-11e7-96f0-0718f1e63503'
        }

        var filters = [{
            field: 'field_131', //filter by SP to get all Service Orders
            operator: 'is',
            value: "" //Knack.models['view_34'].data.toJSON()[0].field_131
        }]

        get_url = url + '?filters=' + encodeURIComponent(JSON.stringify(filters))
        //doing GET api call to get the data
        $.ajax({
            url: get_url,
            type: 'GET',
            headers: headers,
            success: function (data) {

                var checkedRecordObjects = [];

                $(checkedRecords).each(function (index) {
                    checkedRecordObjects.push(data_view_34.filter(function (obj) {
                        return obj.id == checkedRecords[index]; // record id
                    }));
                });

                var recordData = {}

                var insertRecord = checkedRecordObjects[0];
				debugger;
                var recordData = {
                    field_135: insertRecord[0].field_135_raw[0].id, // If field is connection, we need to match the ID field
                    field_130: insertRecord[0].field_130,
                    field_132: insertRecord[0].field_132,
                    field_134: insertRecord[0].field_131,
                    field_139: insertRecord[0].field_139_raw
                };

                //call updateRecords function
                $(function () {
                    updateRecords(checkedRecordObjects, checkedRecordObjects, recordData);
                });

                // seet the delay to prevent hitting API rate limit (milliseconds)
                var myDelay = 100;

                function updateRecords(id, records, data) {

                    insertRecord = checkedRecordObjects[0];

                    recordData = {
                        field_135: insertRecord[0].field_135_raw[0].id, // If field is connection, we need to match the ID field
                        field_130: insertRecord[0].field_130,
                        field_132: insertRecord[0].field_132,
                        field_134: insertRecord[0].field_131,
                      	field_139: insertRecord[0].field_139_raw
                    };

                    var selectedRecords = checkedRecords.length

                    $.ajax({
                        //CHANGE OBJECT_ID TO YOUR OWN OBJECT ID
                        url: 'https://api.knackhq.com/v1/objects/object_11/records/',
                        type: 'POST',
                        /***** CHANGE TO YOUR OWN APPID AND API KEY HERE *****/
                        headers: {
                            'X-Knack-Application-ID': '58c2dd83fde87a27c6be653b',
                            'X-Knack-REST-API-Key': 'c652baa0-373e-11e7-96f0-0718f1e63503'
                        },
                        data: recordData,
                        success: function (response) {
                            if (checkedRecordObjects.length > 1) {
                                // Every time a call is made, the array is shifted by 1.
                                // If the array still has a length, re-run updateRecords()
                                setTimeout(updateRecords(checkedRecordObjects.shift(), checkedRecordObjects, recordData), myDelay);
                            } else {
                                alert(selectedRecords + " Updated");
                                Knack.hideSpinner();
                                location.reload();
                            }
                        }
                    })
                }
            }
        });
    })
});
