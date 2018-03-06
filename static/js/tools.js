var URL_domain='http://192.168.58.14';
var URL_dev=URL_domain+'/teachcourse/admin.php?m=Admin&c=Index';
var MAC=getSearch().mac||123;
var PARAMS={
  getNote:'gethandswrite',
  getSign:'getsign'
}
function getSearch(str) {
  var s = str || document.location.search;
  if (!s) return {};
  var arr = s.split('?')[1].split('&'),
    o = {};
  for (var i = 0; i < arr.length; i++) {
    var _key = arr[i].split('=')[0],
      _value = arr[i].split('=')[1];
    o[_key] = _value;
  }
  return o;
}
function arrayDel(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}
