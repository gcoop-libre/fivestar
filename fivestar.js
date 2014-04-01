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
    
    // Only modify entity forms.
    if (!form.entity_type) { return; }
    
    // Make potential alterations to any entity form that has a fivestar field
    // on it. There are modifications to both entity add and edit forms.
    var new_entity = false;
    if (form.entity_type && !form.entity_id) { new_entity = true; }
    
    $.each(form.elements, function(name, element) {
        if (element.is_field && element.type == 'fivestar') {
          if (new_entity) {
            // Remove fivestar element(s) that have their widget type set to
            // "exposed", aka "Stars (rated while viewing)". Because a rating
            // can't happen until the entity has been created.
            if (element.field_info_instance.widget.type == 'exposed') {
              form.elements[name].access = false;
              form.elements[name].required = false;
            }
          }
          else {
            // Existing entity...
          }
        }
    });
    
    
    
    
  }
  catch (error) { console.log('fivestar_form_alter - ' + error); }
}

/**
 * Implements hook_assemble_form_state_into_field().
 */
function fivestar_assemble_form_state_into_field(entity_type, bundle,
  form_state_value, field, instance, langcode, delta, field_key) {
  try {
    field_key.use_key = false;
    var result = {
      rating: form_state_value,
      target: null
    };
    return result;
  }
  catch (error) {
    console.log('fivestar_assemble_form_state_into_field - ' + error);
  }
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
    // Fivestar uses a value system based on 100, so let's figure out our base value.
    var base_value = 100/instance.settings.stars;
    // Iterate over each star and place them into a controlgroup.
    var widget = '<div data-role="controlgroup" data-type="horizontal">';
    var stars = [];
    for (var i = 1; i <= instance.settings.stars; i++) {
      var value = base_value*i;
      var options = {
        attributes: {
          'class': 'ui-btn ui-corner-all ui-icon-star ui-btn-icon-left',
          onclick: "_fivestar_widget_click('" + items[delta].id  + "', " + i + ", " + value + ")"
        }
      };
      widget += l(i, null, options);
    }
    widget += '</div>';
    items[delta].children.push({ markup: widget });
  }
  catch (error) { console.log('fivestar_field_widget_form - ' + error); }
}

/**
 *
 */
function _fivestar_widget_click(id, index, value) {
  try {
    // Set the 'fivestar' attribute equal to the the star number that was
    // clicked, and set the value equal to the rating value.
    $('#' + id).attr('fivestar', index).val(value);
    /*var data = {
      id: ,
      rating: ,
      entity_type: ,
      tag: ,
      uid: ,
      skip_validation: ''
    };
    fivestar_rate({
        data: JSON.stringify(data),
        success: function(result) {
          dpm(result);
        }
    });*/
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
