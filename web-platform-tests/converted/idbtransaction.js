require("../../build/global");
const Event = require("../../build/lib/FakeEvent").default;
const {
    add_completion_callback,
    assert_array_equals,
    assert_equals,
    assert_false,
    assert_key_equals,
    assert_not_equals,
    assert_throws,
    assert_true,
    async_test,
    createdb,
    createdb_for_multiple_tests,
    fail,
    format_value,
    indexeddb_test,
    promise_test,
    setup,
    step_timeout,
    test,
} = require("../support-node");

const document = {};
const window = global;


async_test(function(t) {
  var open_rq = indexedDB.open("idbtransaction-" + document.location + t.name);

  open_rq.onblocked = t.unreached_func('open_rq.onblocked');
  open_rq.onerror = t.unreached_func('open_rq.onerror');

  open_rq.onupgradeneeded = t.step_func(function(e) {
    t.add_cleanup(function() {
      open_rq.onerror = function(e) {
        e.preventDefault();
      };
      open_rq.result.close();
      indexedDB.deleteDatabase(open_rq.result.name);
    });

    assert_equals(e.target, open_rq, "e.target is reusing the same IDBOpenDBRequest");
    assert_equals(e.target.transaction, open_rq.transaction, "IDBOpenDBRequest.transaction");

    assert_true(e.target.transaction instanceof IDBTransaction, "transaction instanceof IDBTransaction");
    t.done();
  });

}, document.title + " - request gotten by the handler");

async_test(function(t) {
  var open_rq = indexedDB.open("idbtransaction-" + document.location + t.name);

  assert_equals(open_rq.transaction, null, "IDBOpenDBRequest.transaction");
  assert_equals(open_rq.source, null, "IDBOpenDBRequest.source");
  assert_equals(open_rq.readyState, "pending", "IDBOpenDBRequest.readyState");

  assert_true(open_rq instanceof IDBOpenDBRequest, "open_rq instanceof IDBOpenDBRequest");
  assert_equals(open_rq + "", "[object IDBOpenDBRequest]", "IDBOpenDBRequest (open_rq)");

  open_rq.onblocked = t.unreached_func('open_rq.onblocked');
  open_rq.onerror = t.unreached_func('open_rq.onerror');

  open_rq.onupgradeneeded = t.step_func(function() {
    t.add_cleanup(function() {
      open_rq.onerror = function(e) {
        e.preventDefault();
      };
      open_rq.result.close();
      indexedDB.deleteDatabase(open_rq.result.name);
    });
    t.done();
  });

}, document.title + " - request returned by open()");
