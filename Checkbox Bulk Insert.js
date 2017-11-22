// - adds record for each check but record values are not copied.

var addCheckboxes = function(view) {

    // add the checkbox to to the header to select/unselect all
    $('#' + view.key + '.kn-table thead tr').prepend('<th><input type="checkbox"></th>');

    $('#' + view.key + '.kn-table thead input').change(function() {
        $('.' + view.key + '.kn-table tbody tr input').each(function() {
            $(this).attr('checked', $('#' + view.key + '.kn-table thead input').attr('checked') != undefined);
        });
    });

    // add a checkbox to each row in the table body
    $('#' + view.key + '.kn-table tbody tr').each(function() {
        $(this).prepend('<td><input type="checkbox"></td>');
    });
}



  var myDelay = 100;
var insertRecords = function(id, record_ids, data) {

  $.ajax({
    url: 'https://api.knackhq.com/v1/objects/object_11/records',// + id,
    type: 'POST',
    /***** CHANGE TO YOUR OWN APPID AND API KEY HERE *****/
    headers: {'X-Knack-Application-ID': '58c2dd83fde87a27c6be653b',
              'X-Knack-REST-API-Key': 'c652baa0-373e-11e7-96f0-0718f1e63503'},
    data: data,
    success: function(response) {
      if ( record_ids.length > 0) {
        // Every time a call is made, the array is shifted by 1.
        // If the array still has a length, re-run updateRecords()

        //insertRecords(record_ids.shift(), record_ids, data);
        setTimeout(InsertRecords(record_ids.shift(), record_ids, data), myDelay);

      } else {
        // We know all records are processed when length = 0
        alert("Records Inserted");
        location.reload();
        Knack.hideSpinner();
      }
    }
  })
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
    var record_ids = [];
    // Populate the record IDs using all checked rows
    $('#' + view.key + ' tbody input[type=checkbox]:checked').each(function() {
      record_ids.push($(this).closest('tr').attr('id')); // record id
    });

    Knack.showSpinner();

    var BuyerName = Knack.models['view_34'].toJSON().field_130_raw;


    // Define the fields you want to update
    var data = {
      field_132: "Test",
      field_134: record_ids.field_134,
      //field_751: record_ids.field_276,
      //field_751: [record_ids.id],

      field_130: BuyerName,
    };

    // Use the first ID in the array, then pass in the rest of the array
    insertRecords(record_ids.shift(), record_ids, data);

    $('#update').remove();

  })
});
