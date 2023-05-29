#include <assert.h>
#include <bare.h>
#include <js.h>
#include <uv.h>

typedef struct {
  uv_signal_t signal;

  js_env_t *env;
  js_ref_t *ctx;
  js_ref_t *on_signal;
  js_ref_t *on_close;
} bare_signal_t;

static void
on_signal (uv_signal_t *uv_handle, int signum) {
  int err;

  bare_signal_t *handle = (bare_signal_t *) uv_handle;

  js_env_t *env = handle->env;

  js_handle_scope_t *scope;
  err = js_open_handle_scope(env, &scope);
  assert(err == 0);

  js_value_t *on_signal;
  err = js_get_reference_value(env, handle->on_signal, &on_signal);
  assert(err == 0);

  js_value_t *ctx;
  err = js_get_reference_value(env, handle->ctx, &ctx);
  assert(err == 0);

  js_call_function(env, ctx, on_signal, 0, NULL, NULL);

  err = js_close_handle_scope(env, scope);
  assert(err == 0);
}

static void
on_close (uv_handle_t *uv_handle) {
  int err;

  bare_signal_t *handle = (bare_signal_t *) uv_handle;

  js_env_t *env = handle->env;

  js_handle_scope_t *scope;
  err = js_open_handle_scope(env, &scope);
  assert(err == 0);

  js_value_t *on_close;
  err = js_get_reference_value(env, handle->on_close, &on_close);
  assert(err == 0);

  js_value_t *ctx;
  err = js_get_reference_value(env, handle->ctx, &ctx);
  assert(err == 0);

  js_call_function(env, ctx, on_close, 0, NULL, NULL);

  err = js_close_handle_scope(env, scope);
  assert(err == 0);

  err = js_delete_reference(env, handle->on_signal);
  assert(err == 0);

  err = js_delete_reference(env, handle->on_close);
  assert(err == 0);

  err = js_delete_reference(env, handle->ctx);
  assert(err == 0);
}

static js_value_t *
bare_signals_init (js_env_t *env, js_callback_info_t *info) {
  int err;

  size_t argc = 3;
  js_value_t *argv[3];

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  assert(argc == 3);

  js_value_t *arraybuffer;

  bare_signal_t *handle;
  err = js_create_arraybuffer(env, sizeof(bare_signal_t), (void **) &handle, &arraybuffer);
  if (err < 0) return NULL;

  uv_loop_t *loop;
  js_get_env_loop(env, &loop);

  err = uv_signal_init(loop, (uv_signal_t *) handle);

  if (err < 0) {
    js_throw_error(env, uv_err_name(err), uv_strerror(err));
    return NULL;
  }

  handle->env = env;

  err = js_create_reference(env, argv[0], 1, &handle->ctx);
  assert(err == 0);

  err = js_create_reference(env, argv[1], 1, &handle->on_signal);
  assert(err == 0);

  err = js_create_reference(env, argv[2], 1, &handle->on_close);
  assert(err == 0);

  return arraybuffer;
}

static js_value_t *
bare_signals_close (js_env_t *env, js_callback_info_t *info) {
  int err;

  size_t argc = 1;
  js_value_t *argv[1];

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  assert(argc == 1);

  bare_signal_t *handle;
  err = js_get_arraybuffer_info(env, argv[0], (void **) &handle, NULL);
  assert(err == 0);

  uv_close((uv_handle_t *) handle, on_close);

  return NULL;
}

static js_value_t *
bare_signals_start (js_env_t *env, js_callback_info_t *info) {
  int err;

  size_t argc = 2;
  js_value_t *argv[2];

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  assert(argc == 2);

  bare_signal_t *handle;
  err = js_get_arraybuffer_info(env, argv[0], (void **) &handle, NULL);
  assert(err == 0);

  int32_t signum;
  err = js_get_value_int32(env, argv[1], &signum);
  assert(err == 0);

  err = uv_signal_start((uv_signal_t *) handle, on_signal, signum);

  if (err < 0) {
    js_throw_error(env, uv_err_name(err), uv_strerror(err));
    return NULL;
  }

  return NULL;
}

static js_value_t *
bare_signals_stop (js_env_t *env, js_callback_info_t *info) {
  int err;

  size_t argc = 1;
  js_value_t *argv[1];

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  assert(argc == 1);

  bare_signal_t *handle;
  err = js_get_arraybuffer_info(env, argv[0], (void **) &handle, NULL);
  assert(err == 0);

  err = uv_signal_stop((uv_signal_t *) handle);

  if (err < 0) {
    js_throw_error(env, uv_err_name(err), uv_strerror(err));
    return NULL;
  }

  return NULL;
}

static js_value_t *
bare_signals_send (js_env_t *env, js_callback_info_t *info) {
  int err;

  size_t argc = 2;
  js_value_t *argv[2];

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  assert(argc == 2);

  uint32_t signum;
  err = js_get_value_uint32(env, argv[0], &signum);
  assert(err == 0);

  uint32_t pid;
  err = js_get_value_uint32(env, argv[1], &pid);
  assert(err == 0);

  err = uv_kill(pid, signum);

  if (err < 0) {
    js_throw_error(env, uv_err_name(err), uv_strerror(err));
  }

  return NULL;
}

static js_value_t *
init (js_env_t *env, js_value_t *exports) {
#define V(name, fn) \
  { \
    js_value_t *val; \
    js_create_function(env, name, -1, fn, NULL, &val); \
    js_set_named_property(env, exports, name, val); \
  }
  V("init", bare_signals_init)
  V("close", bare_signals_close)
  V("start", bare_signals_start)
  V("stop", bare_signals_stop)
  V("send", bare_signals_send)
#undef V

#define V(name) \
  { \
    js_value_t *val; \
    js_create_uint32(env, name, &val); \
    js_set_named_property(env, exports, #name, val); \
  }
#ifdef SIGHUP
  V(SIGHUP);
#endif

#ifdef SIGINT
  V(SIGINT);
#endif

#ifdef SIGQUIT
  V(SIGQUIT);
#endif

#ifdef SIGILL
  V(SIGILL);
#endif

#ifdef SIGTRAP
  V(SIGTRAP);
#endif

#ifdef SIGABRT
  V(SIGABRT);
#endif

#ifdef SIGIOT
  V(SIGIOT);
#endif

#ifdef SIGBUS
  V(SIGBUS);
#endif

#ifdef SIGFPE
  V(SIGFPE);
#endif

#ifdef SIGKILL
  V(SIGKILL);
#endif

#ifdef SIGUSR1
  V(SIGUSR1);
#endif

#ifdef SIGSEGV
  V(SIGSEGV);
#endif

#ifdef SIGUSR2
  V(SIGUSR2);
#endif

#ifdef SIGPIPE
  V(SIGPIPE);
#endif

#ifdef SIGALRM
  V(SIGALRM);
#endif

  V(SIGTERM);

#ifdef SIGCHLD
  V(SIGCHLD);
#endif

#ifdef SIGSTKFLT
  V(SIGSTKFLT);
#endif

#ifdef SIGCONT
  V(SIGCONT);
#endif

#ifdef SIGSTOP
  V(SIGSTOP);
#endif

#ifdef SIGTSTP
  V(SIGTSTP);
#endif

#ifdef SIGBREAK
  V(SIGBREAK);
#endif

#ifdef SIGTTIN
  V(SIGTTIN);
#endif

#ifdef SIGTTOU
  V(SIGTTOU);
#endif

#ifdef SIGURG
  V(SIGURG);
#endif

#ifdef SIGXCPU
  V(SIGXCPU);
#endif

#ifdef SIGXFSZ
  V(SIGXFSZ);
#endif

#ifdef SIGVTALRM
  V(SIGVTALRM);
#endif

#ifdef SIGPROF
  V(SIGPROF);
#endif

#ifdef SIGWINCH
  V(SIGWINCH);
#endif

#ifdef SIGIO
  V(SIGIO);
#endif

#ifdef SIGPOLL
  V(SIGPOLL);
#endif

#ifdef SIGLOST
  V(SIGLOST);
#endif

#ifdef SIGPWR
  V(SIGPWR);
#endif

#ifdef SIGINFO
  V(SIGINFO);
#endif

#ifdef SIGSYS
  V(SIGSYS);
#endif

#ifdef SIGUNUSED
  V(SIGUNUSED);
#endif
#undef V

  return exports;
}

BARE_MODULE(bare_signals, init)
