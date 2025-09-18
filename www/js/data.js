var _data = {
  get: function (field) {
    return localStorage.getItem(field);
  },
  set: function (field, value = null) {
    if (value) localStorage.setItem(field, value);
    return this.get(field);
  },
  remove: function (field) {
    localStorage.removeItem(field);
  },
};

var _details = {
  init: function () {
    const env = window.ENV || {};

    return this.set("paymentDetails", {
      mp_username: env.MP_USERNAME || "username",
      mp_password: env.MP_PASSWORD || "password",
      mp_merchant_ID: env.MP_MERCHANT_ID || "merchantid123",
      mp_app_name: env.MP_APP_NAME || "appname",
      mp_verification_key: env.MP_VERIFICATION_KEY || "vkey123",
      mp_amount: env.MP_AMOUNT || "1.10",
      mp_order_ID: env.MP_ORDER_ID || uniqueId(),
      mp_currency: env.MP_CURRENCY || "MYR",
      mp_country: env.MP_COUNTRY || "MY",
      mp_channel: env.MP_CHANNEL || "multi",
      mp_bill_description: env.MP_BILL_DESCRIPTION || "description",
      mp_bill_name: env.MP_BILL_NAME || "John Doe",
      mp_bill_email: env.MP_BILL_EMAIL || "johndoe@example.com",
      mp_bill_mobile: env.MP_BILL_MOBILE || "105567754",
      mp_enable_fullscreen: env.MP_ENABLE_FULLSCREEN || false,
      mp_closebutton_display: env.MP_CLOSEBUTTON_DISPLAY || true,
      mp_sandbox_mode: env.MP_SANDBOX_MODE || false,
      mp_uat_mode: env.MP_UAT_MODE || false,
      mp_classic_webcore: env.MP_CLASSIC_WEBCORE || false,
    });
  },
  get: function (type) {
    type = type || "paymentDetails";
    if (_data.get(type)) return JSON.parse(_data.get(type));
    else {
      this.setBulk(
        Object.fromEntries(Object.keys(this.init()).map((k) => [k, false])),
        "exclude"
      );
      return this.init();
    }
  },
  getExclude: function(){
    let list = this.get();
    return Object.fromEntries(Object.entries(this.get("exclude")).filter(([k,v]) => v).map(([k,v]) => [k,list[k]]));
  },
  setBulk: function (data, type) {
    type = type || "paymentDetails";
    if (data) _data.set(type, JSON.stringify(data));
    return this.get(type);
  },
  set: function (field, value = null) {
    if (value) _data.set(field, JSON.stringify(value));
    return this.get(field);
  },
  remove: function (field) {
    _data.remove(field);
  },
};
