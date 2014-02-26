/**
 * Implements hook_field_formatter_view().
 */
function fivestar_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    /*dpm(entity);
    dpm(field);
    dpm(instance);
    dpm(items);*/
    var element = {};
    // Iterate over each item and assemble the element.
    $.each(items, function(delta, item) {
        var markup = 'FIVESTAR!';
        element[delta] = {
          markup: markup
        };
    });
    return element;
  }
  catch (error) { console.log('fivestar_field_formatter_view - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 */
function fivestar_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    dpm(form);
    dpm(form_state);
    dpm(field);
    dpm(instance);
    // We'll just hide the actual input, and populate it later.
    items[delta].type = 'hidden';
    // Iterate over each star and place them into a controlgroup.
    var widget = '<div data-role="controlgroup" data-type="horizontal">';
    var stars = [];
    for (var i = 1; i <= instance.settings.stars; i++) {
      var link = l(
        i,
        null,
        {
          attributes: {
            'class': 'ui-btn ui-corner-all ui-icon-star ui-btn-icon-left',
            onclick: "_fivestar_widget_click(" + i + ")"
          }
        }
      );
      widget += link;
    }
    widget += '</div>';
    items[delta].children.push({ markup: widget });
  }
  catch (error) { console.log('fivestar_field_widget_form - ' + error); }
}

/**
 *
 */
function _fivestar_widget_click(index) {
  try {
    var data = {
      /*id: ,
      rating: ,
      entity_type: ,
      tag: ,
      uid: ,
      skip_validation: ''*/
    };
    fivestar_rate({
        data: JSON.stringify(data),
        success: function(result) {
          dpm(result);
        }
    });
  }
  catch (error) { console.log('_fivestar_widget_click - ' + error); }
}

/**
 *
 */
function fivestar_rate(options) {
  try {
    options.method = 'POST';
    options.path = 'fivestar/rate.json';
    options.service = 'fivestar';
    options.resource = 'rate';
    Drupal.services.call(options);
  }
  catch (error) { console.log('fivestar_rate - ' + error); }
}