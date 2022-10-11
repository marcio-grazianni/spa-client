$(document).ready ->

  allSet = ->
    fname = ($("input#first-name").val() != '')
    lname = ($("input#last-name").val() != '')
    pw = ($("input#pw").val() != '')
    return (fname and lname and pw)

  $("input#tos").change ->
    if $(this).attr("checked")
      $("button#licenseContinue").removeClass("btn-disabled").prop("disabled", false)
    else
      $("button#licenseContinue").addClass("btn-disabled").prop("disabled", true)
  
  $("button#licenseContinue").click ->
    if $(this).hasClass("btn-disabled")
      return false
    else
      $("div#license").hide()
      $("div#password").show()
      $("ul.steps li#step1").removeClass("active").addClass("complete")
      $("ul.steps li#step2").addClass("active")
      $("ul.steps div.progress").css({width: "50%"})

  $("input#first-name").keyup ->
    if $(this).val() != ''
      if allSet()
        $("input[type='submit']").removeClass("btn-disabled").prop("disabled", false)
    else
      $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)

  $("input#last-name").keyup ->
    if $(this).val() != ''
      if allSet()
        $("input[type='submit']").removeClass("btn-disabled").prop("disabled", false)
    else
      $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)

  $("input#pw").keyup ->
    if $(this).val() != ''
      if allSet()
        $("input[type='submit']").removeClass("btn-disabled").prop("disabled", false)
    else
      $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)


  $("input[type='submit']").click ->
    if $(this).hasClass("btn-disabled")
      return false

