/**
 * Implements hook_form_alter().
 */
function fivestar_form_alter(form, form_state, form_id) {
  try {
    
    //dpm(form_id);
    //dpm(form);
    
    /*
    
    // Select list (rated while editing)
    field_info_instance.widget.type == 'fivestar_select'
    
    // Stars (rated while viewing)
    field_info_instance.widget.type == 'exposed'
    
    // Stars (rated while editing)
    field_info_instance.widget.type == 'stars'
    
    */
    
    // Any entity add forms, should not have any fivestar fields on them that
    // have their widget type set to "exposed", aka "Stars (rated while viewing)".
    if (form.entity_type && !form.entity_id) {
      $.each(form.elements, function(name, element) {
          if (
            element.is_field &&
            element.type == 'fivestar' &&
            element.field_info_instance.widget.type == 'exposed'
          ) {
            form.elements[name].access = false;
            form.elements[name].required = false;
          }
      });
    }
  }
  catch (error) { console.log('fivestar_form_alter - ' + error); }
}

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
    
    
    
    
    /*dpm(form);
    dpm(form_state);
    dpm(field);
    dpm(instance);
    dpm(element);*/
    // If the entity doesn't exist yet, remove the element.
    /*if (!form.entity_id) {
      console.log('deleting ' + element.name);
      element = null;
      return;
    }*/
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