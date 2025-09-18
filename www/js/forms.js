document.addEventListener("deviceready", function () {

  initiateFormValid();
  initiateFormInvalid();
  triggerOtpForm();

  var btnSettings = document.getElementById("btnSettings");
  btnSettings.addEventListener("click", () => {
    // window.location.href = "index.html";
    PlatformNavigator.replaceUrl("index.html");
  });

  PlatformNavigator.disableBackButton(() => {
    PlatformNavigator.replaceUrl("index.html");
  });
});

function loadTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE
  document
    .getElementById("contentBox")
    .scrollTo({ top: 0, behavior: "smooth" });
}

function setField(root, name, value) {
  const els = root.querySelectorAll(`[name="${name}"]`);
  if (!els.length) return;

  const el = els[0];
  const tag = el.tagName.toLowerCase();
  const type = (el.type || "").toLowerCase();

  if (type === "checkbox") {
    // single checkbox or a group with same name
    els.forEach(
      (cb) =>
        (cb.checked = Array.isArray(value) ? value.includes(cb.value) : !!value)
    );
  } else if (type === "radio") {
    els.forEach((r) => (r.checked = r.value == value));
  } else if (tag === "select") {
    if (el.multiple && Array.isArray(value)) {
      Array.from(el.options).forEach(
        (opt) => (opt.selected = value.includes(opt.value))
      );
    } else {
      el.value = value;
    }
  } else {
    el.value = value ?? "";
  }

  // fire events so validators/listeners react
  els.forEach((e) => {
    e.dispatchEvent(new Event("input", { bubbles: true }));
    e.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

function changeEvent(className) {
  let validBox = document.querySelector(".form-valid");
  let invalidBox = document.querySelector(".form-invalid");
  validBox.classList.add("d-none");
  invalidBox.classList.add("d-none");
  document.querySelector(`.${className}`).classList.remove("d-none");
}

function triggerOtpForm(init = false) {
  let otpBox = document.querySelector(".btn-check");

  document.querySelectorAll(".btn-check").forEach((radio) => {
    radio.addEventListener("change", changeEvent.bind(this, radio.id));
  });

  changeEvent("form-valid");
}

function appendForm(
  form,
  { field, label, value = null, type = "text" },
  withGroupFn = null
) {
  let fieldTemplate = document.querySelector(".form-template-field");
  const newField = fieldTemplate.cloneNode(true);
  newField.classList.remove("d-none", "form-template-field");
  newField.querySelector("label").textContent = label;
  newField.querySelector("label").setAttribute("for", field);

  const valueTemplate = newField.querySelector(
    withGroupFn != null ? ".input-with-group input" : ".input-with-value"
  );
  const el = newField.querySelector(
    withGroupFn == null ? ".input-with-group" : ".input-with-value"
  );
  if (el && el.parentNode) {
    el.parentNode.removeChild(el); // older but works everywhere
  }

  valueTemplate.setAttribute("name", field);
  valueTemplate.setAttribute("id", field);
  valueTemplate.setAttribute("type", type);
  if (value) valueTemplate.value = value;
  form.append(newField);

  if (withGroupFn != null) {
    const btn = newField.querySelector(".generate-id");
    if (btn) {
      btn.addEventListener("click", withGroupFn.bind(this, form, field));
    }
  }
}

function appendFormInvalid(form, { field, label }) {
  let fieldTemplate = document.querySelector(".form-invalid-template-field");
  const newField = fieldTemplate.cloneNode(true);
  newField.classList.remove("d-none", "form-invalid-template-field");
  newField.querySelector("label").innerHTML = label;
  newField.querySelector("label").setAttribute("for", `radio-${field}`);
  newField.querySelector("input[type=checkbox]").setAttribute("name", field);
  newField
    .querySelector("input[type=checkbox]")
    .setAttribute("id", `radio-${field}`);
  newField.querySelector("input[type=checkbox]").setAttribute("value", field);
  //   if (value) newField.querySelector("input").value = value;
  form.append(newField);
}

function generateTransactionId(form, field) {
  let el = form.querySelector(`#${field}`);
  if (el) {
    el.value = uniqueId();
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function initiateFormValid() {
  let btnTemplate = document.querySelector(".form-template-btn");
  const form = document.querySelector(".form-valid .form-floating");
  // console.info("Form initialized:", form);
  appendForm(form, { field: "mp_username", label: "Mp Username" });
  appendForm(form, {
    field: "mp_password",
    label: "Mp Password",
    type: "password",
  });
  appendForm(form, { field: "mp_merchant_ID", label: "Mp Merchant ID" });
  appendForm(form, { field: "mp_app_name", label: "Mp App Name" });
  appendForm(form, {
    field: "mp_verification_key",
    label: "Mp Verification Key",
  });
  appendForm(form, { field: "mp_amount", label: "Mp Amount" });
  appendForm(
    form,
    { field: "mp_order_ID", label: "Mp Order ID" },
    generateTransactionId
  );
  appendForm(form, { field: "mp_currency", label: "Mp Currency" });
  appendForm(form, { field: "mp_country", label: "Mp Country" });
  appendForm(form, { field: "mp_channel", label: "Mp Channel" });
  appendForm(form, {
    field: "mp_bill_description",
    label: "Mp Bill Description",
  });
  appendForm(form, { field: "mp_bill_name", label: "Mp Bill Name" });
  appendForm(form, {
    field: "mp_bill_email",
    label: "Mp Bill Email",
    type: "email",
  });
  appendForm(form, { field: "mp_bill_mobile", label: "Mp Bill Mobile" });
  appendForm(form, {
    field: "mp_closebutton_display",
    label: "Mp Close Button Display",
  });

  let btnSubmit = btnTemplate.cloneNode(true);
  btnSubmit.classList.remove("d-none", "form-template-btn");
  form.append(btnSubmit);

  Object.entries(_details.get()).forEach(([field, value]) => {
    setField(form, field, value);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log("Form submitted:", data);

    _details.setBulk(data, "paymentDetails");
    window.location.href = "index.html";
  });
}

function initiateFormInvalid() {
  let btnTemplate = document.querySelector(".form-template-btn");
  const form = document.querySelector(".form-invalid .form-floating");
  // console.info("Form initialized:", form);
  appendFormInvalid(form, { field: "mp_username", label: "Mp Username" });
  appendFormInvalid(form, {
    field: "mp_password",
    label: "Mp Password",
  });
  appendFormInvalid(form, { field: "mp_merchant_ID", label: "Mp Merchant ID" });
  appendFormInvalid(form, { field: "mp_app_name", label: "Mp App Name" });
  appendFormInvalid(form, {
    field: "mp_verification_key",
    label: "Mp Verification Key",
  });
  appendFormInvalid(form, { field: "mp_amount", label: "Mp Amount" });
  appendFormInvalid(form, { field: "mp_order_ID", label: "Mp Order ID" });
  appendFormInvalid(form, { field: "mp_currency", label: "Mp Currency" });
  appendFormInvalid(form, { field: "mp_country", label: "Mp Country" });
  appendFormInvalid(form, { field: "mp_channel", label: "Mp Channel" });
  appendFormInvalid(form, {
    field: "mp_bill_description",
    label: "Mp Bill Description",
  });
  appendFormInvalid(form, { field: "mp_bill_name", label: "Mp Bill Name" });
  appendFormInvalid(form, { field: "mp_bill_email", label: "Mp Bill Email" });
  appendFormInvalid(form, { field: "mp_bill_mobile", label: "Mp Bill Mobile" });
  appendFormInvalid(form, {
    field: "mp_closebutton_display",
    label: "Mp Close Button Display",
  });
  let btnSubmit = btnTemplate.cloneNode(true);
  btnSubmit.classList.remove("d-none", "form-template-btn");
  form.append(btnSubmit);

  Object.entries(_details.get("exclude")).forEach(([field, value]) => {
    setField(form, field, value);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    _details.setBulk(
      Object.fromEntries(
        Object.keys(_details.get("exclude")).map((k) => [k, k in data])
      ),
      "exclude"
    );
    // navigator.app.backHistory();

    // window.location.href = "index.html";
    PlatformNavigator.replaceUrl("index.html");
  });
}

// document.addEventListener(
//   "backbutton",
//   function (e) {
//     console.log("backbutton");
//     e.preventDefault();
//     window.location.href = "index.html";
//     PlatformNavigator.replaceUrl("index.html");
//   },
//   false
// );
