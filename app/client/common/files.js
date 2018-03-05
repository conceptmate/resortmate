$(document).on('change', '.btn-file :file', function(e) {
  var $input = $(this);
  var numFiles = $input.get(0).files ? $input.get(0).files.length : 1;
  var label = $input.val().replace(/\\/g, '/').replace(/.*\//, '');

  var $newInput = $input.parents('.input-group').find(':text');
  var value = numFiles > 1 ? numFiles + ' files selected' : label;
  $newInput.val(value);
});
