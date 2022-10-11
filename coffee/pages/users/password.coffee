isValidPassword = (password)  ->
  pattern = new RegExp("^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z!@#\$%\^\&*\)\(+=._-]{8,128}$")
  return pattern.test(password)

$(document).ready ->
  $("input#id_new_password1").keyup ->
    pw = $(this).val()
    if isValidPassword(pw)
      if $("input#id_new_password2").val() == pw
        $("input[type='password']").addClass("valid")
        $("#pwCorrect").removeClass("hidden")
        $("#confirmCorrect").removeClass("hidden")
        $("input[type='submit']").removeClass("btn-disabled").prop("disabled", false)
      else
        $(this).addClass("valid")
        $("#pwCorrect").removeClass("hidden")
        $("input#id_new_password2").removeClass("valid")
        $("#confirmCorrect").addClass("hidden")
        $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)
    else
      $("input[type='password']").removeClass("valid")
      $("#pwCorrect").addClass("hidden")
      $("#confirmCorrect").addClass("hidden")
      $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)

  $("input#id_new_password2").keyup ->
    pwValue = $("input#id_new_password1").val()
    if isValidPassword(pwValue)
      if $(this).val() == pwValue
        $(this).addClass("valid")
        $("#confirmCorrect").removeClass("hidden")
        $("input[type='submit']").removeClass("btn-disabled").prop("disabled", false)
      else
        $(this).removeClass("valid")
        $("#confirmCorrect").addClass("hidden")
        $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)
    else
      $(this).removeClass("valid")
      $("#confirmCorrect").addClass("hidden")
      $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)