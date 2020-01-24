$(function () {
  OnLoad()
  $.ajaxSetup({
    contentType: "application/json"
  });
  var API_URL
  function OnLoad() {
    API_URL = "http://localhost:5000/api/"
    if (window.localStorage.getItem('token') !== "") {
      $("#login-li").hide()
      $("#registration-li").hide()
      $("#signout-li").show()
      $(".main-section").show()
      GetEvents()
      GetSettlements()
    }
    else {
      $("#login-li").show()
      $("#registration-li").show()
      $("#signout-li").hide()
      $(".main-section").hide()
    }
  }

  function GetEvents() {
    $.ajaxSetup({
      headers: {
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      }
    })
    $.get(API_URL + "Event", function (data, status, xhr) {
      if (xhr.status == 200) {
        var events = JSON.parse(JSON.stringify(data.response))
        SetEventsInTable(events)
      }
      else {
        alert("Error while getting events")
      }
    });
  }

  function GetSettlements() {
    $.get(API_URL + "Settlement", function (data, status, xhr) {
      if (xhr.status == 200) {
        var settlements = JSON.parse(JSON.stringify(data.response))
        SetSettlementsInSelector(settlements)
      }
      else {
        alert("Error while getting settlements")
      }
    });
  }

  function SetEventsInTable(events) {
    var k = '<tbody>'
    for (i = 0; i < events.length; i++) {
      k += '<tr>';
      k += '<td>' + events[i].description + '</td>';
      k += '<td>' + events[i].address + '</td>';
      k += '<td>' + events[i].settlement.name + '</td>';
      k += '</tr>';
    }
    k += '</tbody>';
    document.getElementById('tableData').innerHTML = k;
  }

  function SetSettlementsInSelector(settlements) {
    var k = '<option value="0">Choose settlement</option>'
    for (i = 0; i < settlements.length; i++) {
      k += '<option value=' + settlements[i].id + '>' + settlements[i].name + ', ' + settlements[i].postalCode + '</option>';
    }
    document.getElementById('settlements-select').innerHTML = k;
  }

  function SignOut() {
    window.localStorage.setItem('token', "")
    OnLoad()
  }

  $("#signout-li").click(function () {
    SignOut();
  });

  $("#login-form").submit(function (event) {
    event.preventDefault()
    var _email = $('#signin-email').val();
    var _password = $('#signin-password').val();
    $.post(API_URL + "Auth/login", JSON.stringify({ "email": _email, "password": _password })
    ).done(function (data) {
      if (data.code == 200) {
        window.localStorage.setItem('token', data.response.token)
        $("#user-modal").removeClass('cd-signin-modal--is-visible');
        OnLoad()
      } else {
        alert("Login failed!")
      }
    })
  })

  $("#registration-form").submit(function (event) {
    event.preventDefault()
    var _email = $('#signup-email').val();
    var _password = $('#signup-password').val();
    var _firstName = $('#signup-first-name').val();
    var _lastName = $('#signup-last-name').val();
    var _pin = $('#signup-pin').val();
    $.post(API_URL + "Auth/registration", JSON.stringify(
      {
        "email": _email,
        "password": _password,
        "firstName": _firstName,
        "lastName": _lastName,
        "pin": _pin,
      }
    )
    ).done(function (data) {
      if (data.code == 200) {
        $("#user-modal").removeClass('cd-signin-modal--is-visible');
        OnLoad()
      }
    })
  })

  $("#event-form").submit(function (event) {
    event.preventDefault()
    var _description = $('#event-description').val();
    var _address = $('#event-address').val();
    var _settlementId = $('#settlements-select').val();
    if(_settlementId == "0"){
      alert("Choose settlement")
      return
    }
    var createEventJson = JSON.stringify({
      "description": _description,
      "address": _address,
      "settlementId": parseInt(_settlementId)
    })
    $.post(API_URL + "QueueSender", createEventJson)
    .done(function (data) {
      if (data.code == 200) {
        alert("Event reported")
        OnLoad()
      }
    }) 
  })

  // function SendMessageToQueue(message) {
  //   // var amqp
  //   // var amqp = require('amqplib/callback_api');
  //   require([require, '../node_modules/amqplib/callback_api.js'], function (require) {
  //      var amqp = require('../node_modules/amqplib/callback_api.js');
  //      console.log(typeof(amqp))
  //      console.log(amqp)
  //      amqp.connect('amqp://user.username:user.password@localhost:5672', function (error0, connection) {
  //        if (error0) {
  //          throw error0;
  //        }
  //        connection.createChannel(function (error1, channel) {
  //          if (error1) {
  //            throw error1;
  //          }
   
  //          var queue = 'queueInput';
   
  //          channel.assertQueue(queue, {
  //            durable: false
  //          });
  //          channel.sendToQueue(queue, Buffer.from(message));
   
  //          console.log(" [x] Sent %s", message);
  //          alert("Event succesfully sended")
  //        });
  //        setTimeout(function () {
  //          connection.close();
  //          process.exit(0);
  //        }, 500);
  //      });
  //   });
  //   require([require, 'node_modules/lib/connect.js'], function (require) {
  //     var connect = require('node_modules/lib/connect.js');
  //  });
    // define(function (require) {
    //   amqp = require('amqplib/callback_api');
    // });
    // console.log(typeof(amqp))
    // console.log(amqp)
    // amqp.connect('amqp://user.username:user.password@localhost:5672', function (error0, connection) {
    //   if (error0) {
    //     throw error0;
    //   }
    //   connection.createChannel(function (error1, channel) {
    //     if (error1) {
    //       throw error1;
    //     }

    //     var queue = 'queueInput';

    //     channel.assertQueue(queue, {
    //       durable: false
    //     });
    //     channel.sendToQueue(queue, Buffer.from(message));

    //     console.log(" [x] Sent %s", message);
    //     alert("Event succesfully sended")
    //   });
    //   setTimeout(function () {
    //     connection.close();
    //     process.exit(0);
    //   }, 500);
    // });
  // }
});