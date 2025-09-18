/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);

function syntaxHighlight(data, indent = 2) {
  let json;

  // If it's already a string, use it directly
  if (typeof data === "string") {
    try {
      // try to parse — if it's valid JSON string, pretty print
      const parsed = JSON.parse(data);
      json = JSON.stringify(parsed, null, indent);
    } catch (e) {
      // it's just a raw string, not JSON
      json = `"${data}"`;
    }
  } else {
    // normal object/array/number/boolean/null
    json = JSON.stringify(data, null, indent);
  }

  json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;");

  return json.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "number";
      if (match[0] === '"') cls = /:$/.test(match) ? "key" : "string";
      else if (/true|false/.test(match)) cls = "boolean";
      else if (/null/.test(match)) cls = "null";
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

function payProcess(paymentDetails) {
  let paymentDetailTemps = {
    ...paymentDetails,
    mp_enable_fullscreen: false,
    mp_closebutton_display: true,
    // mp_express_mode: true,
    // mp_channel: "TNG-EWALLET"
  };

  var consolePayment = document.getElementById("console-payment");
  try {
    XdkFiuuCordova.startPayment(
      paymentDetailTemps,
      function (result) {
        console.log("xdebug: startPayment result: " + result);
        consolePayment.innerHTML = syntaxHighlight(result, 2);
      },
      function (error) {
        console.error("xdebug: startPayment error: ", error);
        consolePayment.innerHTML = syntaxHighlight(error, 2);
      }
    );
  } catch (error) {
    console.error("xdebug: startPayment error: ", error);
    consolePayment.innerHTML = syntaxHighlight(error, 2);
  }
}

function onDeviceReady() {
  console.log("onDeviceReady index.js");
  // StatusBar.backgroundColorByHexString("#4CAF50"); // green
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE
  // document.getElementById("contentBox").scrollTo({ top: 0, behavior: 'smooth' });

  // if (device.platform === "iOS") {
  //   XdkFiuuCordova.setColor("#000000");
  // }

  var validBtn = document.getElementById("validBtn");
  var missingBtn = document.getElementById("missingBtn");
  var btnSettings = document.getElementById("btnSettings");

  validBtn.addEventListener("click", () =>
    payProcess({ ..._details.get("paymentDetails") })
  );
  missingBtn.addEventListener("click", () =>
    payProcess({ ..._details.getExclude() })
  );
  btnSettings.addEventListener("click", () => {
    PlatformNavigator.pushUrl("config.html");
  });
}
