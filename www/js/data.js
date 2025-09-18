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
    return this.set("paymentDetails", {
      mp_username: window.ENV.MP_USERNAME || "username",
      mp_password: window.ENV.MP_PASSWORD || "password",
      mp_merchant_ID: uniqueId(),
      mp_app_name: window.ENV.MP_APP_NAME || "appname",
      mp_verification_key: window.ENV.MP_VERIFICATION_KEY || "vkey123",
      mp_amount: window.ENV.MP_AMOUNT || "1.10",
      mp_order_ID: window.ENV.MP_ORDER_ID || "orderid123",
      mp_currency: window.ENV.MP_CURRENCY || "MYR",
      mp_country: window.ENV.MP_COUNTRY || "MY",
      mp_channel: window.ENV.MP_CHANNEL || "multi",
      mp_bill_description: window.ENV.MP_BILL_DESCRIPTION || "description",
      mp_bill_name: window.ENV.MP_BILL_NAME || "John Doe",
      mp_bill_email: window.ENV.MP_BILL_EMAIL || "johndoe@example.com",
      mp_bill_mobile: window.ENV.MP_BILL_MOBILE || "105567754",
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
