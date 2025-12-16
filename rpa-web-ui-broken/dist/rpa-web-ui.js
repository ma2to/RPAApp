import { pushScopeId as un, popScopeId as dn, nextTick as ie, withScopeId as hn, createBlock as ge, openBlock as P, markRaw as fn, shallowReactive as gn, h as Pt, resolveComponent as Wt, resolveDirective as pn, withDirectives as at, createElementBlock as j, normalizeClass as Ee, createCommentVNode as ue, createVNode as Ne, renderSlot as _e, resolveDynamicComponent as bo, normalizeStyle as We, withCtx as Le, Fragment as Ke, renderList as Qe, mergeProps as Dt, toHandlers as mn, normalizeProps as Oo, guardReactiveProps as No, ref as M, computed as te, unref as A, reactive as oo, onMounted as St, onUnmounted as ao, inject as Ie, defineComponent as He, toRefs as kt, provide as Ge, onBeforeUnmount as Ct, createElementVNode as L, toDisplayString as Te, watch as Oe, Teleport as Lt, Transition as vn, createSlots as Wo, useSlots as Lo, render as yo, withModifiers as ct, createTextVNode as wt, vModelText as no, vModelRadio as Co, vModelCheckbox as wn, onBeforeMount as bn } from "vue";
import { defineStore as yn, storeToRefs as Cn, createPinia as _n } from "pinia";
function Sn() {
  var t = window.navigator.userAgent, e = t.indexOf("MSIE ");
  if (e > 0)
    return parseInt(t.substring(e + 5, t.indexOf(".", e)), 10);
  var o = t.indexOf("Trident/");
  if (o > 0) {
    var s = t.indexOf("rv:");
    return parseInt(t.substring(s + 3, t.indexOf(".", s)), 10);
  }
  var r = t.indexOf("Edge/");
  return r > 0 ? parseInt(t.substring(r + 5, t.indexOf(".", r)), 10) : -1;
}
let Vt;
function so() {
  so.init || (so.init = !0, Vt = Sn() !== -1);
}
var Ut = {
  name: "ResizeObserver",
  props: {
    emitOnMount: {
      type: Boolean,
      default: !1
    },
    ignoreWidth: {
      type: Boolean,
      default: !1
    },
    ignoreHeight: {
      type: Boolean,
      default: !1
    }
  },
  emits: [
    "notify"
  ],
  mounted() {
    so(), ie(() => {
      this._w = this.$el.offsetWidth, this._h = this.$el.offsetHeight, this.emitOnMount && this.emitSize();
    });
    const t = document.createElement("object");
    this._resizeObject = t, t.setAttribute("aria-hidden", "true"), t.setAttribute("tabindex", -1), t.onload = this.addResizeHandlers, t.type = "text/html", Vt && this.$el.appendChild(t), t.data = "about:blank", Vt || this.$el.appendChild(t);
  },
  beforeUnmount() {
    this.removeResizeHandlers();
  },
  methods: {
    compareAndNotify() {
      (!this.ignoreWidth && this._w !== this.$el.offsetWidth || !this.ignoreHeight && this._h !== this.$el.offsetHeight) && (this._w = this.$el.offsetWidth, this._h = this.$el.offsetHeight, this.emitSize());
    },
    emitSize() {
      this.$emit("notify", {
        width: this._w,
        height: this._h
      });
    },
    addResizeHandlers() {
      this._resizeObject.contentDocument.defaultView.addEventListener("resize", this.compareAndNotify), this.compareAndNotify();
    },
    removeResizeHandlers() {
      this._resizeObject && this._resizeObject.onload && (!Vt && this._resizeObject.contentDocument && this._resizeObject.contentDocument.defaultView.removeEventListener("resize", this.compareAndNotify), this.$el.removeChild(this._resizeObject), this._resizeObject.onload = null, this._resizeObject = null);
    }
  }
};
const kn = /* @__PURE__ */ hn("data-v-b329ee4c");
un("data-v-b329ee4c");
const Rn = {
  class: "resize-observer",
  tabindex: "-1"
};
dn();
const xn = /* @__PURE__ */ kn((t, e, o, s, r, n) => (P(), ge("div", Rn)));
Ut.render = xn;
Ut.__scopeId = "data-v-b329ee4c";
Ut.__file = "src/components/ResizeObserver.vue";
function Ot(t) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Ot = function(e) {
    return typeof e;
  } : Ot = function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ot(t);
}
function In(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function En(t, e) {
  for (var o = 0; o < e.length; o++) {
    var s = e[o];
    s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s);
  }
}
function $n(t, e, o) {
  return e && En(t.prototype, e), t;
}
function _o(t) {
  return Tn(t) || An(t) || Mn(t) || Hn();
}
function Tn(t) {
  if (Array.isArray(t)) return ro(t);
}
function An(t) {
  if (typeof Symbol < "u" && Symbol.iterator in Object(t)) return Array.from(t);
}
function Mn(t, e) {
  if (t) {
    if (typeof t == "string") return ro(t, e);
    var o = Object.prototype.toString.call(t).slice(8, -1);
    if (o === "Object" && t.constructor && (o = t.constructor.name), o === "Map" || o === "Set") return Array.from(t);
    if (o === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)) return ro(t, e);
  }
}
function ro(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var o = 0, s = new Array(e); o < e; o++) s[o] = t[o];
  return s;
}
function Hn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Pn(t) {
  var e;
  return typeof t == "function" ? e = {
    callback: t
  } : e = t, e;
}
function Dn(t, e) {
  var o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, s, r, n, l = function(d) {
    for (var p = arguments.length, c = new Array(p > 1 ? p - 1 : 0), y = 1; y < p; y++)
      c[y - 1] = arguments[y];
    if (n = c, !(s && d === r)) {
      var u = o.leading;
      typeof u == "function" && (u = u(d, r)), (!s || d !== r) && u && t.apply(void 0, [d].concat(_o(n))), r = d, clearTimeout(s), s = setTimeout(function() {
        t.apply(void 0, [d].concat(_o(n))), s = 0;
      }, e);
    }
  };
  return l._clear = function() {
    clearTimeout(s), s = null;
  }, l;
}
function Uo(t, e) {
  if (t === e) return !0;
  if (Ot(t) === "object") {
    for (var o in t)
      if (!Uo(t[o], e[o]))
        return !1;
    return !0;
  }
  return !1;
}
var zn = /* @__PURE__ */ function() {
  function t(e, o, s) {
    In(this, t), this.el = e, this.observer = null, this.frozen = !1, this.createObserver(o, s);
  }
  return $n(t, [{
    key: "createObserver",
    value: function(o, s) {
      var r = this;
      if (this.observer && this.destroyObserver(), !this.frozen) {
        if (this.options = Pn(o), this.callback = function(a, d) {
          r.options.callback(a, d), a && r.options.once && (r.frozen = !0, r.destroyObserver());
        }, this.callback && this.options.throttle) {
          var n = this.options.throttleOptions || {}, l = n.leading;
          this.callback = Dn(this.callback, this.options.throttle, {
            leading: function(d) {
              return l === "both" || l === "visible" && d || l === "hidden" && !d;
            }
          });
        }
        this.oldResult = void 0, this.observer = new IntersectionObserver(function(a) {
          var d = a[0];
          if (a.length > 1) {
            var p = a.find(function(y) {
              return y.isIntersecting;
            });
            p && (d = p);
          }
          if (r.callback) {
            var c = d.isIntersecting && d.intersectionRatio >= r.threshold;
            if (c === r.oldResult) return;
            r.oldResult = c, r.callback(c, d);
          }
        }, this.options.intersection), ie(function() {
          r.observer && r.observer.observe(r.el);
        });
      }
    }
  }, {
    key: "destroyObserver",
    value: function() {
      this.observer && (this.observer.disconnect(), this.observer = null), this.callback && this.callback._clear && (this.callback._clear(), this.callback = null);
    }
  }, {
    key: "threshold",
    get: function() {
      return this.options.intersection && typeof this.options.intersection.threshold == "number" ? this.options.intersection.threshold : 0;
    }
  }]), t;
}();
function jo(t, e, o) {
  var s = e.value;
  if (s)
    if (typeof IntersectionObserver > "u")
      console.warn("[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill");
    else {
      var r = new zn(t, s, o);
      t._vue_visibilityState = r;
    }
}
function Fn(t, e, o) {
  var s = e.value, r = e.oldValue;
  if (!Uo(s, r)) {
    var n = t._vue_visibilityState;
    if (!s) {
      Go(t);
      return;
    }
    n ? n.createObserver(s, o) : jo(t, {
      value: s
    }, o);
  }
}
function Go(t) {
  var e = t._vue_visibilityState;
  e && (e.destroyObserver(), delete t._vue_visibilityState);
}
var Bn = {
  beforeMount: jo,
  updated: Fn,
  unmounted: Go
};
function Vn(t) {
  return { all: t = t || /* @__PURE__ */ new Map(), on: function(e, o) {
    var s = t.get(e);
    s && s.push(o) || t.set(e, [o]);
  }, off: function(e, o) {
    var s = t.get(e);
    s && s.splice(s.indexOf(o) >>> 0, 1);
  }, emit: function(e, o) {
    (t.get(e) || []).slice().map(function(s) {
      s(o);
    }), (t.get("*") || []).slice().map(function(s) {
      s(e, o);
    });
  } };
}
var On = {
  itemsLimit: 1e3
}, Nn = /(auto|scroll)/;
function qo(t, e) {
  return t.parentNode === null ? e : qo(t.parentNode, e.concat([t]));
}
var Zt = function(e, o) {
  return getComputedStyle(e, null).getPropertyValue(o);
}, Wn = function(e) {
  return Zt(e, "overflow") + Zt(e, "overflow-y") + Zt(e, "overflow-x");
}, Ln = function(e) {
  return Nn.test(Wn(e));
};
function So(t) {
  if (t instanceof HTMLElement || t instanceof SVGElement) {
    for (var e = qo(t.parentNode, []), o = 0; o < e.length; o += 1)
      if (Ln(e[o]))
        return e[o];
    return document.scrollingElement || document.documentElement;
  }
}
function io(t) {
  "@babel/helpers - typeof";
  return io = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, io(t);
}
var Ko = {
  items: {
    type: Array,
    required: !0
  },
  keyField: {
    type: String,
    default: "id"
  },
  direction: {
    type: String,
    default: "vertical",
    validator: function(e) {
      return ["vertical", "horizontal"].includes(e);
    }
  },
  listTag: {
    type: String,
    default: "div"
  },
  itemTag: {
    type: String,
    default: "div"
  }
};
function Jo() {
  return this.items.length && io(this.items[0]) !== "object";
}
var lo = !1;
if (typeof window < "u") {
  lo = !1;
  try {
    var Un = Object.defineProperty({}, "passive", {
      get: function() {
        lo = !0;
      }
    });
    window.addEventListener("test", null, Un);
  } catch {
  }
}
let jn = 0;
var co = {
  name: "RecycleScroller",
  components: {
    ResizeObserver: Ut
  },
  directives: {
    ObserveVisibility: Bn
  },
  props: {
    ...Ko,
    itemSize: {
      type: Number,
      default: null
    },
    gridItems: {
      type: Number,
      default: void 0
    },
    itemSecondarySize: {
      type: Number,
      default: void 0
    },
    minItemSize: {
      type: [Number, String],
      default: null
    },
    sizeField: {
      type: String,
      default: "size"
    },
    typeField: {
      type: String,
      default: "type"
    },
    buffer: {
      type: Number,
      default: 200
    },
    pageMode: {
      type: Boolean,
      default: !1
    },
    prerender: {
      type: Number,
      default: 0
    },
    emitUpdate: {
      type: Boolean,
      default: !1
    },
    updateInterval: {
      type: Number,
      default: 0
    },
    skipHover: {
      type: Boolean,
      default: !1
    },
    listTag: {
      type: String,
      default: "div"
    },
    itemTag: {
      type: String,
      default: "div"
    },
    listClass: {
      type: [String, Object, Array],
      default: ""
    },
    itemClass: {
      type: [String, Object, Array],
      default: ""
    }
  },
  emits: [
    "resize",
    "visible",
    "hidden",
    "update",
    "scroll-start",
    "scroll-end"
  ],
  data() {
    return {
      pool: [],
      totalSize: 0,
      ready: !1,
      hoverKey: null
    };
  },
  computed: {
    sizes() {
      if (this.itemSize === null) {
        const t = {
          "-1": { accumulator: 0 }
        }, e = this.items, o = this.sizeField, s = this.minItemSize;
        let r = 1e4, n = 0, l;
        for (let a = 0, d = e.length; a < d; a++)
          l = e[a][o] || s, l < r && (r = l), n += l, t[a] = { accumulator: n, size: l };
        return this.$_computedMinItemSize = r, t;
      }
      return [];
    },
    simpleArray: Jo,
    itemIndexByKey() {
      const { keyField: t, items: e } = this, o = {};
      for (let s = 0, r = e.length; s < r; s++)
        o[e[s][t]] = s;
      return o;
    }
  },
  watch: {
    items() {
      this.updateVisibleItems(!0);
    },
    pageMode() {
      this.applyPageMode(), this.updateVisibleItems(!1);
    },
    sizes: {
      handler() {
        this.updateVisibleItems(!1);
      },
      deep: !0
    },
    gridItems() {
      this.updateVisibleItems(!0);
    },
    itemSecondarySize() {
      this.updateVisibleItems(!0);
    }
  },
  created() {
    this.$_startIndex = 0, this.$_endIndex = 0, this.$_views = /* @__PURE__ */ new Map(), this.$_unusedViews = /* @__PURE__ */ new Map(), this.$_scrollDirty = !1, this.$_lastUpdateScrollPosition = 0, this.prerender && (this.$_prerender = !0, this.updateVisibleItems(!1)), this.gridItems && !this.itemSize && console.error("[vue-recycle-scroller] You must provide an itemSize when using gridItems");
  },
  mounted() {
    this.applyPageMode(), this.$nextTick(() => {
      this.$_prerender = !1, this.updateVisibleItems(!0), this.ready = !0;
    });
  },
  activated() {
    const t = this.$_lastUpdateScrollPosition;
    typeof t == "number" && this.$nextTick(() => {
      this.scrollToPosition(t);
    });
  },
  beforeUnmount() {
    this.removeListeners();
  },
  methods: {
    addView(t, e, o, s, r) {
      const n = fn({
        id: jn++,
        index: e,
        used: !0,
        key: s,
        type: r
      }), l = gn({
        item: o,
        position: 0,
        nr: n
      });
      return t.push(l), l;
    },
    unuseView(t, e = !1) {
      const o = this.$_unusedViews, s = t.nr.type;
      let r = o.get(s);
      r || (r = [], o.set(s, r)), r.push(t), e || (t.nr.used = !1, t.position = -9999);
    },
    handleResize() {
      this.$emit("resize"), this.ready && this.updateVisibleItems(!1);
    },
    handleScroll(t) {
      if (!this.$_scrollDirty) {
        if (this.$_scrollDirty = !0, this.$_updateTimeout) return;
        const e = () => requestAnimationFrame(() => {
          this.$_scrollDirty = !1;
          const { continuous: o } = this.updateVisibleItems(!1, !0);
          o || (clearTimeout(this.$_refreshTimout), this.$_refreshTimout = setTimeout(this.handleScroll, this.updateInterval + 100));
        });
        e(), this.updateInterval && (this.$_updateTimeout = setTimeout(() => {
          this.$_updateTimeout = 0, this.$_scrollDirty && e();
        }, this.updateInterval));
      }
    },
    handleVisibilityChange(t, e) {
      this.ready && (t || e.boundingClientRect.width !== 0 || e.boundingClientRect.height !== 0 ? (this.$emit("visible"), requestAnimationFrame(() => {
        this.updateVisibleItems(!1);
      })) : this.$emit("hidden"));
    },
    updateVisibleItems(t, e = !1) {
      const o = this.itemSize, s = this.gridItems || 1, r = this.itemSecondarySize || o, n = this.$_computedMinItemSize, l = this.typeField, a = this.simpleArray ? null : this.keyField, d = this.items, p = d.length, c = this.sizes, y = this.$_views, u = this.$_unusedViews, f = this.pool, m = this.itemIndexByKey;
      let h, g, v, b, _;
      if (!p)
        h = g = b = _ = v = 0;
      else if (this.$_prerender)
        h = b = 0, g = _ = Math.min(this.prerender, d.length), v = null;
      else {
        const U = this.getScroll();
        if (e) {
          let q = U.start - this.$_lastUpdateScrollPosition;
          if (q < 0 && (q = -q), o === null && q < n || q < o)
            return {
              continuous: !0
            };
        }
        this.$_lastUpdateScrollPosition = U.start;
        const Z = this.buffer;
        U.start -= Z, U.end += Z;
        let oe = 0;
        if (this.$refs.before && (oe = this.$refs.before.scrollHeight, U.start -= oe), this.$refs.after) {
          const q = this.$refs.after.scrollHeight;
          U.end += q;
        }
        if (o === null) {
          let q, Y = 0, de = p - 1, ae = ~~(p / 2), we;
          do
            we = ae, q = c[ae].accumulator, q < U.start ? Y = ae : ae < p - 1 && c[ae + 1].accumulator > U.start && (de = ae), ae = ~~((Y + de) / 2);
          while (ae !== we);
          for (ae < 0 && (ae = 0), h = ae, v = c[p - 1].accumulator, g = ae; g < p && c[g].accumulator < U.end; g++) ;
          for (g === -1 ? g = d.length - 1 : (g++, g > p && (g = p)), b = h; b < p && oe + c[b].accumulator < U.start; b++) ;
          for (_ = b; _ < p && oe + c[_].accumulator < U.end; _++) ;
        } else {
          h = ~~(U.start / o * s);
          const q = h % s;
          h -= q, g = Math.ceil(U.end / o * s), b = Math.max(0, Math.floor((U.start - oe) / o * s)), _ = Math.floor((U.end - oe) / o * s), h < 0 && (h = 0), g > p && (g = p), b < 0 && (b = 0), _ > p && (_ = p), v = Math.ceil(p / s) * o;
        }
      }
      g - h > On.itemsLimit && this.itemsLimitError(), this.totalSize = v;
      let $;
      const x = h <= this.$_endIndex && g >= this.$_startIndex;
      if (x)
        for (let U = 0, Z = f.length; U < Z; U++)
          $ = f[U], $.nr.used && (t && ($.nr.index = m[$.item[a]]), ($.nr.index == null || $.nr.index < h || $.nr.index >= g) && this.unuseView($));
      const E = x ? null : /* @__PURE__ */ new Map();
      let F, J, W;
      for (let U = h; U < g; U++) {
        F = d[U];
        const Z = a ? F[a] : F;
        if (Z == null)
          throw new Error(`Key is ${Z} on item (keyField is '${a}')`);
        if ($ = y.get(Z), !o && !c[U].size) {
          $ && this.unuseView($);
          continue;
        }
        J = F[l];
        let oe = u.get(J), q = !1;
        if (!$)
          x ? oe && oe.length ? $ = oe.pop() : $ = this.addView(f, U, F, Z, J) : (W = E.get(J) || 0, (!oe || W >= oe.length) && ($ = this.addView(f, U, F, Z, J), this.unuseView($, !0), oe = u.get(J)), $ = oe[W], E.set(J, W + 1)), y.delete($.nr.key), $.nr.used = !0, $.nr.index = U, $.nr.key = Z, $.nr.type = J, y.set(Z, $), q = !0;
        else if (!$.nr.used && ($.nr.used = !0, q = !0, oe)) {
          const Y = oe.indexOf($);
          Y !== -1 && oe.splice(Y, 1);
        }
        $.item = F, q && (U === d.length - 1 && this.$emit("scroll-end"), U === 0 && this.$emit("scroll-start")), o === null ? ($.position = c[U - 1].accumulator, $.offset = 0) : ($.position = Math.floor(U / s) * o, $.offset = U % s * r);
      }
      return this.$_startIndex = h, this.$_endIndex = g, this.emitUpdate && this.$emit("update", h, g, b, _), clearTimeout(this.$_sortTimer), this.$_sortTimer = setTimeout(this.sortViews, this.updateInterval + 300), {
        continuous: x
      };
    },
    getListenerTarget() {
      let t = So(this.$el);
      return window.document && (t === window.document.documentElement || t === window.document.body) && (t = window), t;
    },
    getScroll() {
      const { $el: t, direction: e } = this, o = e === "vertical";
      let s;
      if (this.pageMode) {
        const r = t.getBoundingClientRect(), n = o ? r.height : r.width;
        let l = -(o ? r.top : r.left), a = o ? window.innerHeight : window.innerWidth;
        l < 0 && (a += l, l = 0), l + a > n && (a = n - l), s = {
          start: l,
          end: l + a
        };
      } else o ? s = {
        start: t.scrollTop,
        end: t.scrollTop + t.clientHeight
      } : s = {
        start: t.scrollLeft,
        end: t.scrollLeft + t.clientWidth
      };
      return s;
    },
    applyPageMode() {
      this.pageMode ? this.addListeners() : this.removeListeners();
    },
    addListeners() {
      this.listenerTarget = this.getListenerTarget(), this.listenerTarget.addEventListener("scroll", this.handleScroll, lo ? {
        passive: !0
      } : !1), this.listenerTarget.addEventListener("resize", this.handleResize);
    },
    removeListeners() {
      this.listenerTarget && (this.listenerTarget.removeEventListener("scroll", this.handleScroll), this.listenerTarget.removeEventListener("resize", this.handleResize), this.listenerTarget = null);
    },
    scrollToItem(t) {
      let e;
      const o = this.gridItems || 1;
      this.itemSize === null ? e = t > 0 ? this.sizes[t - 1].accumulator : 0 : e = Math.floor(t / o) * this.itemSize, this.scrollToPosition(e);
    },
    scrollToPosition(t) {
      const e = this.direction === "vertical" ? { scroll: "scrollTop", start: "top" } : { scroll: "scrollLeft", start: "left" };
      let o, s, r;
      if (this.pageMode) {
        const n = So(this.$el), l = n.tagName === "HTML" ? 0 : n[e.scroll], a = n.getBoundingClientRect(), p = this.$el.getBoundingClientRect()[e.start] - a[e.start];
        o = n, s = e.scroll, r = t + l + p;
      } else
        o = this.$el, s = e.scroll, r = t;
      o[s] = r;
    },
    itemsLimitError() {
      throw setTimeout(() => {
        console.log("It seems the scroller element isn't scrolling, so it tries to render all the items at once.", "Scroller:", this.$el), console.log("Make sure the scroller has a fixed height (or width) and 'overflow-y' (or 'overflow-x') set to 'auto' so it can scroll correctly and only render the items visible in the scroll viewport.");
      }), new Error("Rendered items limit reached");
    },
    sortViews() {
      this.pool.sort((t, e) => t.nr.index - e.nr.index);
    }
  }
};
const Gn = {
  key: 0,
  ref: "before",
  class: "vue-recycle-scroller__slot"
}, qn = {
  key: 1,
  ref: "after",
  class: "vue-recycle-scroller__slot"
};
function Kn(t, e, o, s, r, n) {
  const l = Wt("ResizeObserver"), a = pn("observe-visibility");
  return at((P(), j(
    "div",
    {
      class: Ee(["vue-recycle-scroller", {
        ready: r.ready,
        "page-mode": o.pageMode,
        [`direction-${t.direction}`]: !0
      }]),
      onScrollPassive: e[0] || (e[0] = (...d) => n.handleScroll && n.handleScroll(...d))
    },
    [
      t.$slots.before ? (P(), j(
        "div",
        Gn,
        [
          _e(t.$slots, "before")
        ],
        512
        /* NEED_PATCH */
      )) : ue("v-if", !0),
      (P(), ge(bo(o.listTag), {
        ref: "wrapper",
        style: We({ [t.direction === "vertical" ? "minHeight" : "minWidth"]: r.totalSize + "px" }),
        class: Ee(["vue-recycle-scroller__item-wrapper", o.listClass])
      }, {
        default: Le(() => [
          (P(!0), j(
            Ke,
            null,
            Qe(r.pool, (d) => (P(), ge(bo(o.itemTag), Dt({
              key: d.nr.id,
              style: r.ready ? {
                transform: `translate${t.direction === "vertical" ? "Y" : "X"}(${d.position}px) translate${t.direction === "vertical" ? "X" : "Y"}(${d.offset}px)`,
                width: o.gridItems ? `${t.direction === "vertical" && o.itemSecondarySize || o.itemSize}px` : void 0,
                height: o.gridItems ? `${t.direction === "horizontal" && o.itemSecondarySize || o.itemSize}px` : void 0
              } : null,
              class: ["vue-recycle-scroller__item-view", [
                o.itemClass,
                {
                  hover: !o.skipHover && r.hoverKey === d.nr.key
                }
              ]]
            }, mn(o.skipHover ? {} : {
              mouseenter: () => {
                r.hoverKey = d.nr.key;
              },
              mouseleave: () => {
                r.hoverKey = null;
              }
            })), {
              default: Le(() => [
                _e(t.$slots, "default", {
                  item: d.item,
                  index: d.nr.index,
                  active: d.nr.used
                })
              ]),
              _: 2
              /* DYNAMIC */
            }, 1040, ["style", "class"]))),
            128
            /* KEYED_FRAGMENT */
          )),
          _e(t.$slots, "empty")
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["style", "class"])),
      t.$slots.after ? (P(), j(
        "div",
        qn,
        [
          _e(t.$slots, "after")
        ],
        512
        /* NEED_PATCH */
      )) : ue("v-if", !0),
      Ne(l, { onNotify: n.handleResize }, null, 8, ["onNotify"])
    ],
    34
    /* CLASS, HYDRATE_EVENTS */
  )), [
    [a, n.handleVisibilityChange]
  ]);
}
co.render = Kn;
co.__file = "src/components/RecycleScroller.vue";
var uo = {
  name: "DynamicScroller",
  components: {
    RecycleScroller: co
  },
  provide() {
    return typeof ResizeObserver < "u" && (this.$_resizeObserver = new ResizeObserver((t) => {
      requestAnimationFrame(() => {
        if (Array.isArray(t)) {
          for (const e of t)
            if (e.target && e.target.$_vs_onResize) {
              let o, s;
              if (e.borderBoxSize) {
                const r = e.borderBoxSize[0];
                o = r.inlineSize, s = r.blockSize;
              } else
                o = e.contentRect.width, s = e.contentRect.height;
              e.target.$_vs_onResize(e.target.$_vs_id, o, s);
            }
        }
      });
    })), {
      vscrollData: this.vscrollData,
      vscrollParent: this,
      vscrollResizeObserver: this.$_resizeObserver
    };
  },
  inheritAttrs: !1,
  props: {
    ...Ko,
    minItemSize: {
      type: [Number, String],
      required: !0
    }
  },
  emits: [
    "resize",
    "visible"
  ],
  data() {
    return {
      vscrollData: {
        active: !0,
        sizes: {},
        keyField: this.keyField,
        simpleArray: !1
      }
    };
  },
  computed: {
    simpleArray: Jo,
    itemsWithSize() {
      const t = [], { items: e, keyField: o, simpleArray: s } = this, r = this.vscrollData.sizes, n = e.length;
      for (let l = 0; l < n; l++) {
        const a = e[l], d = s ? l : a[o];
        let p = r[d];
        typeof p > "u" && !this.$_undefinedMap[d] && (p = 0), t.push({
          item: a,
          id: d,
          size: p
        });
      }
      return t;
    }
  },
  watch: {
    items() {
      this.forceUpdate();
    },
    simpleArray: {
      handler(t) {
        this.vscrollData.simpleArray = t;
      },
      immediate: !0
    },
    direction(t) {
      this.forceUpdate(!0);
    },
    itemsWithSize(t, e) {
      const o = this.$el.scrollTop;
      let s = 0, r = 0;
      const n = Math.min(t.length, e.length);
      for (let a = 0; a < n && !(s >= o); a++)
        s += e[a].size || this.minItemSize, r += t[a].size || this.minItemSize;
      const l = r - s;
      l !== 0 && (this.$el.scrollTop += l);
    }
  },
  beforeCreate() {
    this.$_updates = [], this.$_undefinedSizes = 0, this.$_undefinedMap = {}, this.$_events = Vn();
  },
  activated() {
    this.vscrollData.active = !0;
  },
  deactivated() {
    this.vscrollData.active = !1;
  },
  unmounted() {
    this.$_events.all.clear();
  },
  methods: {
    onScrollerResize() {
      this.$refs.scroller && this.forceUpdate(), this.$emit("resize");
    },
    onScrollerVisible() {
      this.$_events.emit("vscroll:update", { force: !1 }), this.$emit("visible");
    },
    forceUpdate(t = !1) {
      (t || this.simpleArray) && (this.vscrollData.sizes = {}), this.$_events.emit("vscroll:update", { force: !0 });
    },
    scrollToItem(t) {
      const e = this.$refs.scroller;
      e && e.scrollToItem(t);
    },
    getItemSize(t, e = void 0) {
      const o = this.simpleArray ? e ?? this.items.indexOf(t) : t[this.keyField];
      return this.vscrollData.sizes[o] || 0;
    },
    scrollToBottom() {
      if (this.$_scrollingToBottom) return;
      this.$_scrollingToBottom = !0;
      const t = this.$el;
      this.$nextTick(() => {
        t.scrollTop = t.scrollHeight + 5e3;
        const e = () => {
          t.scrollTop = t.scrollHeight + 5e3, requestAnimationFrame(() => {
            t.scrollTop = t.scrollHeight + 5e3, this.$_undefinedSizes === 0 ? this.$_scrollingToBottom = !1 : requestAnimationFrame(e);
          });
        };
        requestAnimationFrame(e);
      });
    }
  }
};
function Jn(t, e, o, s, r, n) {
  const l = Wt("RecycleScroller");
  return P(), ge(l, Dt({
    ref: "scroller",
    items: n.itemsWithSize,
    "min-item-size": o.minItemSize,
    direction: t.direction,
    "key-field": "id",
    "list-tag": t.listTag,
    "item-tag": t.itemTag
  }, t.$attrs, {
    onResize: n.onScrollerResize,
    onVisible: n.onScrollerVisible
  }), {
    default: Le(({ item: a, index: d, active: p }) => [
      _e(t.$slots, "default", Oo(No({
        item: a.item,
        index: d,
        active: p,
        itemWithSize: a
      })))
    ]),
    before: Le(() => [
      _e(t.$slots, "before")
    ]),
    after: Le(() => [
      _e(t.$slots, "after")
    ]),
    empty: Le(() => [
      _e(t.$slots, "empty")
    ]),
    _: 3
    /* FORWARDED */
  }, 16, ["items", "min-item-size", "direction", "list-tag", "item-tag", "onResize", "onVisible"]);
}
uo.render = Jn;
uo.__file = "src/components/DynamicScroller.vue";
var Xo = {
  name: "DynamicScrollerItem",
  inject: [
    "vscrollData",
    "vscrollParent",
    "vscrollResizeObserver"
  ],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    item: {
      required: !0
    },
    watchData: {
      type: Boolean,
      default: !1
    },
    /**
     * Indicates if the view is actively used to display an item.
     */
    active: {
      type: Boolean,
      required: !0
    },
    index: {
      type: Number,
      default: void 0
    },
    sizeDependencies: {
      type: [Array, Object],
      default: null
    },
    emitResize: {
      type: Boolean,
      default: !1
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  emits: [
    "resize"
  ],
  computed: {
    id() {
      if (this.vscrollData.simpleArray) return this.index;
      if (this.vscrollData.keyField in this.item) return this.item[this.vscrollData.keyField];
      throw new Error(`keyField '${this.vscrollData.keyField}' not found in your item. You should set a valid keyField prop on your Scroller`);
    },
    size() {
      return this.vscrollData.sizes[this.id] || 0;
    },
    finalActive() {
      return this.active && this.vscrollData.active;
    }
  },
  watch: {
    watchData: "updateWatchData",
    id(t, e) {
      if (this.$el.$_vs_id = this.id, this.size || this.onDataUpdate(), this.$_sizeObserved) {
        const o = this.vscrollData.sizes[e], s = this.vscrollData.sizes[t];
        o != null && o !== s && this.applySize(o);
      }
    },
    finalActive(t) {
      this.size || (t ? this.vscrollParent.$_undefinedMap[this.id] || (this.vscrollParent.$_undefinedSizes++, this.vscrollParent.$_undefinedMap[this.id] = !0) : this.vscrollParent.$_undefinedMap[this.id] && (this.vscrollParent.$_undefinedSizes--, this.vscrollParent.$_undefinedMap[this.id] = !1)), this.vscrollResizeObserver ? t ? this.observeSize() : this.unobserveSize() : t && this.$_pendingVScrollUpdate === this.id && this.updateSize();
    }
  },
  created() {
    if (!this.$isServer && (this.$_forceNextVScrollUpdate = null, this.updateWatchData(), !this.vscrollResizeObserver)) {
      for (const t in this.sizeDependencies)
        this.$watch(() => this.sizeDependencies[t], this.onDataUpdate);
      this.vscrollParent.$_events.on("vscroll:update", this.onVscrollUpdate);
    }
  },
  mounted() {
    this.finalActive && (this.updateSize(), this.observeSize());
  },
  beforeUnmount() {
    this.vscrollParent.$_events.off("vscroll:update", this.onVscrollUpdate), this.unobserveSize();
  },
  methods: {
    updateSize() {
      this.finalActive ? this.$_pendingSizeUpdate !== this.id && (this.$_pendingSizeUpdate = this.id, this.$_forceNextVScrollUpdate = null, this.$_pendingVScrollUpdate = null, this.computeSize(this.id)) : this.$_forceNextVScrollUpdate = this.id;
    },
    updateWatchData() {
      this.watchData && !this.vscrollResizeObserver ? this.$_watchData = this.$watch("item", () => {
        this.onDataUpdate();
      }, {
        deep: !0
      }) : this.$_watchData && (this.$_watchData(), this.$_watchData = null);
    },
    onVscrollUpdate({ force: t }) {
      !this.finalActive && t && (this.$_pendingVScrollUpdate = this.id), (this.$_forceNextVScrollUpdate === this.id || t || !this.size) && this.updateSize();
    },
    onDataUpdate() {
      this.updateSize();
    },
    computeSize(t) {
      this.$nextTick(() => {
        if (this.id === t) {
          const e = this.$el.offsetWidth, o = this.$el.offsetHeight;
          this.applyWidthHeight(e, o);
        }
        this.$_pendingSizeUpdate = null;
      });
    },
    applyWidthHeight(t, e) {
      const o = ~~(this.vscrollParent.direction === "vertical" ? e : t);
      o && this.size !== o && this.applySize(o);
    },
    applySize(t) {
      this.vscrollParent.$_undefinedMap[this.id] && (this.vscrollParent.$_undefinedSizes--, this.vscrollParent.$_undefinedMap[this.id] = void 0), this.vscrollData.sizes[this.id] = t, this.emitResize && this.$emit("resize", this.id);
    },
    observeSize() {
      this.vscrollResizeObserver && (this.$_sizeObserved || (this.vscrollResizeObserver.observe(this.$el), this.$el.$_vs_id = this.id, this.$el.$_vs_onResize = this.onResize, this.$_sizeObserved = !0));
    },
    unobserveSize() {
      this.vscrollResizeObserver && this.$_sizeObserved && (this.vscrollResizeObserver.unobserve(this.$el), this.$el.$_vs_onResize = void 0, this.$_sizeObserved = !1);
    },
    onResize(t, e, o) {
      this.id === t && this.applyWidthHeight(e, o);
    }
  },
  render() {
    return Pt(this.tag, this.$slots.default());
  }
};
Xo.__file = "src/components/DynamicScrollerItem.vue";
function Yo() {
  const t = M(null);
  function e(a, d, p) {
    return d.type === "simple" ? o(a, d, p) : s(a, d, p);
  }
  function o(a, d, p) {
    let c;
    if (d.columnName === "__checkbox" && p)
      c = p.isRowChecked(a.rowId);
    else {
      const u = a.cells.find((f) => f.columnName === d.columnName);
      c = u == null ? void 0 : u.value;
    }
    const y = d.value;
    switch (d.operator) {
      case "Equals":
        return c === y;
      case "NotEquals":
        return c !== y;
      case "GreaterThan":
        return Number(c) > Number(y);
      case "LessThan":
        return Number(c) < Number(y);
      case "GreaterThanOrEquals":
        return Number(c) >= Number(y);
      case "LessThanOrEquals":
        return Number(c) <= Number(y);
      case "Contains":
        return String(c).toLowerCase().includes(String(y).toLowerCase());
      case "StartsWith":
        return String(c).toLowerCase().startsWith(String(y).toLowerCase());
      case "EndsWith":
        return String(c).toLowerCase().endsWith(String(y).toLowerCase());
      case "IsEmpty":
        return c == null || String(c).trim() === "";
      case "IsNotEmpty":
        return c != null && String(c).trim() !== "";
      default:
        return !0;
    }
  }
  function s(a, d, p) {
    if (!d.left || !d.right)
      return console.error("[evaluateCompositeFilter] Invalid filter structure - missing children:", d), !0;
    const c = e(a, d.left, p);
    if (d.operator === "AND" && !c)
      return !1;
    if (d.operator === "OR" && c)
      return !0;
    const y = e(a, d.right, p);
    return d.operator === "AND" ? c && y : c || y;
  }
  function r(a, d, p) {
    return d ? a.filter((c) => e(c, d, p)) : a;
  }
  function n(a) {
    t.value = a;
  }
  function l() {
    t.value = null;
  }
  return {
    currentFilter: t,
    filterRows: r,
    setFilter: n,
    clearFilter: l,
    evaluateFilter: e
  };
}
function Xn(t) {
  const e = M(""), o = M("Contains"), s = M([]), r = M(-1);
  function n(u, f, m = {}) {
    if (!u) {
      s.value = [], r.value = -1;
      return;
    }
    const h = [], g = m.caseSensitive ?? !1, v = m.fuzzyThreshold ?? 3;
    for (const b of t.value)
      for (const _ of b.cells) {
        const $ = String(_.value || "");
        let x = !1;
        const E = g ? $ : $.toLowerCase(), F = g ? u : u.toLowerCase();
        switch (f) {
          case "Exact":
            x = g ? $ === u : $.toLowerCase() === u.toLowerCase();
            break;
          case "Contains":
            x = E.includes(F);
            break;
          case "StartsWith":
            x = E.startsWith(F);
            break;
          case "EndsWith":
            x = E.endsWith(F);
            break;
          case "Regex":
            try {
              const J = g ? "" : "i";
              x = new RegExp(u, J).test($);
            } catch {
              x = !1;
            }
            break;
          case "Fuzzy":
            x = l($, u, v);
            break;
        }
        x && h.push({
          rowId: b.rowId,
          columnName: _.columnName,
          value: $
        });
      }
    s.value = h, r.value = h.length > 0 ? 0 : -1;
  }
  function l(u, f, m) {
    return a(u.toLowerCase(), f.toLowerCase()) <= m;
  }
  function a(u, f) {
    const m = [];
    for (let h = 0; h <= f.length; h++)
      m[h] = [h];
    for (let h = 0; h <= u.length; h++)
      m[0][h] = h;
    for (let h = 1; h <= f.length; h++)
      for (let g = 1; g <= u.length; g++)
        f.charAt(h - 1) === u.charAt(g - 1) ? m[h][g] = m[h - 1][g - 1] : m[h][g] = Math.min(
          m[h - 1][g - 1] + 1,
          // substitution
          m[h][g - 1] + 1,
          // insertion
          m[h - 1][g] + 1
          // deletion
        );
    return m[f.length][u.length];
  }
  function d() {
    r.value < s.value.length - 1 && r.value++;
  }
  function p() {
    r.value > 0 && r.value--;
  }
  function c() {
    e.value = "", s.value = [], r.value = -1;
  }
  function y(u, f) {
    return s.value.some(
      (m) => m.rowId === u && m.columnName === f
    );
  }
  return {
    searchTerm: e,
    searchMode: o,
    searchResults: s,
    currentResultIndex: r,
    searchInRows: n,
    goToNextResult: d,
    goToPreviousResult: p,
    clearSearch: c,
    isSearchMatch: y
  };
}
const jt = (t = "dataGrid") => yn(t, () => {
  const e = M(/* @__PURE__ */ new Map()), o = M([]), s = M([]), r = M(/* @__PURE__ */ new Set()), n = M([]), l = M(100), a = M(1), d = M(/* @__PURE__ */ new Map()), p = M([]), c = M(null), y = M(""), u = M({
    pageSize: 100,
    enableSort: !0,
    enableFilter: !0,
    enableSearch: !0,
    enableValidation: !0,
    autoValidate: !0,
    // Default: validate automatically on every change
    showRowNumber: !1,
    showCheckbox: !1,
    showValidationAlerts: !0,
    showDeleteButton: !1,
    showInsertButton: !1
  }), f = M(null), m = M(!1), h = M(!1), g = M(!1), v = M(/* @__PURE__ */ new Set()), b = M(/* @__PURE__ */ new Set()), _ = te(() => o.value.map((S) => e.value.get(S)).filter(Boolean)), $ = te(() => p.value.map((S) => {
    const B = d.value.get(S);
    return {
      columnName: S,
      direction: B.direction
    };
  }));
  function x(S) {
    return e.value.get(S);
  }
  function E(S) {
    return e.value.has(S);
  }
  const { filterRows: F, evaluateFilter: J } = Yo(), { searchResults: W, isSearchMatch: U } = Xn(_), Z = te(() => o.value.length), oe = te(() => Math.ceil(Z.value / l.value)), q = te(() => {
    let S = _.value;
    if (c.value) {
      const N = {
        checkedRows: n.value,
        isRowChecked: (X) => n.value.includes(X)
      };
      S = F(S, c.value, N);
    }
    if (y.value && W.value.length > 0) {
      const N = new Set(W.value.map((X) => X.rowId));
      S = S.filter((X) => N.has(X.rowId));
    }
    $.value.length > 0 && (S = xe(S, $.value));
    const B = (a.value - 1) * l.value, O = B + l.value;
    return S.slice(B, O);
  });
  function Y(S) {
    var N;
    console.log("[dataGridStore] loadRows:", {
      rowCount: S.length,
      columnCount: s.value.length,
      autoValidate: u.value.autoValidate
    });
    const B = /* @__PURE__ */ new Map(), O = [];
    S.forEach((X, le) => {
      const ne = X.__rowId || z(), he = X.__rowHeight || 40, fe = {
        rowId: ne,
        rowIndex: le,
        height: he,
        cells: s.value.map((Se) => ({
          rowId: ne,
          columnName: Se.name,
          value: X[Se.name],
          isSelected: !1,
          isValidationError: !1
        }))
      };
      B.set(ne, fe), O.push(ne);
    }), e.value = B, o.value = O, console.log("[dataGridStore] loadRows complete:", {
      loadedRows: o.value.length,
      firstRowId: o.value[0],
      firstRowCells: (N = B.get(o.value[0])) == null ? void 0 : N.cells.length
    });
  }
  function de(S, B, O) {
    const N = x(S);
    if (N) {
      const X = N.cells.find((le) => le.columnName === B);
      if (X) {
        const le = X.value;
        X.value = O, console.log("[dataGridStore] updateCell:", {
          rowId: S,
          columnName: B,
          oldValue: le,
          newValue: O,
          autoValidate: u.value.autoValidate
        });
        const ne = `${S}:${B}`;
        b.value.add(ne);
      } else
        console.warn("[dataGridStore] updateCell: cell not found", { rowId: S, columnName: B });
    } else
      console.warn("[dataGridStore] updateCell: row not found", { rowId: S });
  }
  function ae(S, B) {
    const O = x(S);
    if (O) {
      const N = O.height;
      O.height = B, console.log("[dataGridStore] updateRowHeight:", {
        rowId: S,
        oldHeight: N,
        newHeight: B,
        autoRowHeightEnabled: g.value
      });
    } else
      console.warn("[dataGridStore] updateRowHeight: row not found", { rowId: S });
  }
  function we(S) {
    console.log(`[dataGridStore] setAutoRowHeightEnabled: oldValue=${g.value}, newValue=${S}`), g.value = S;
  }
  function xe(S, B) {
    return B.length === 0 ? S : [...S].sort((O, N) => {
      for (const { columnName: X, direction: le } of B) {
        const ne = O.cells.find((i) => i.columnName === X), he = N.cells.find((i) => i.columnName === X), fe = ne == null ? void 0 : ne.value, Se = he == null ? void 0 : he.value, Ve = Ae(fe, Se);
        if (Ve !== 0)
          return le === "asc" ? Ve : -Ve;
      }
      return 0;
    });
  }
  function Ae(S, B) {
    return S == null && B == null ? 0 : S == null ? -1 : B == null ? 1 : typeof S == "number" && typeof B == "number" ? S - B : String(S).localeCompare(String(B));
  }
  function ze(S, B, O = !1) {
    if (!O)
      d.value.clear(), p.value = [S], d.value.set(S, { direction: B, order: 1 });
    else if (d.value.has(S)) {
      const N = d.value.get(S);
      d.value.set(S, { direction: B, order: N.order });
    } else {
      const N = p.value.length + 1;
      d.value.set(S, { direction: B, order: N }), p.value.push(S);
    }
  }
  function H() {
    d.value.clear(), p.value = [];
  }
  function G(S) {
    l.value = S, a.value = 1;
  }
  function ce(S) {
    S >= 1 && S <= oe.value && (a.value = S);
  }
  function z() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  function T(S) {
    if (E(S)) {
      console.log("[dataGridStore] deleteRow:", {
        rowId: S,
        rowsBefore: o.value.length,
        wasChecked: n.value.includes(S)
      }), e.value.delete(S), o.value = o.value.filter((O) => O !== S);
      const B = n.value.indexOf(S);
      B > -1 && n.value.splice(B, 1), o.value.forEach((O, N) => {
        const X = e.value.get(O);
        X && (X.rowIndex = N);
      }), console.log("[dataGridStore] deleteRow complete:", {
        rowsAfter: o.value.length
      });
    } else
      console.warn("[dataGridStore] deleteRow: row not found", { rowId: S });
  }
  function K(S) {
    const B = o.value.indexOf(S), O = z();
    console.log("[dataGridStore] insertRow:", {
      afterRowId: S,
      index: B,
      newRowId: O,
      rowsBefore: o.value.length
    });
    const N = {
      rowId: O,
      rowIndex: B + 1,
      height: 32,
      cells: s.value.filter((X) => !X.specialType).map((X) => ({
        rowId: O,
        columnName: X.name,
        value: null,
        isSelected: !1,
        isValidationError: !1
      }))
    };
    e.value.set(O, N), o.value.splice(B + 1, 0, O), o.value.forEach((X, le) => {
      const ne = e.value.get(X);
      ne && (ne.rowIndex = le);
    }), console.log("[dataGridStore] insertRow complete:", {
      rowsAfter: o.value.length
    });
  }
  function D(S, B, O) {
    const N = o.value.indexOf(S);
    if (N === -1) {
      console.warn("[dataGridStore] insertMultipleRows: row not found", { rowId: S });
      return;
    }
    console.log("[dataGridStore] insertMultipleRows:", {
      rowId: S,
      count: B,
      position: O,
      index: N,
      rowsBefore: o.value.length
    });
    const X = O === "above" ? N : N + 1, le = [];
    for (let ne = 0; ne < B; ne++) {
      const he = z(), fe = {
        rowId: he,
        rowIndex: X + ne,
        height: 32,
        cells: s.value.filter((Se) => !Se.specialType).map((Se) => ({
          rowId: he,
          columnName: Se.name,
          value: null,
          isSelected: !1,
          isValidationError: !1
        }))
      };
      e.value.set(he, fe), le.push(he);
    }
    o.value.splice(X, 0, ...le), o.value.forEach((ne, he) => {
      const fe = e.value.get(ne);
      fe && (fe.rowIndex = he);
    }), console.log("[dataGridStore] insertMultipleRows complete:", {
      rowsAfter: o.value.length,
      newRowIds: le
    });
  }
  function Fe(S, B) {
    if (console.log("[toggleCheckbox] Called:", { rowId: S, checked: B, currentCount: n.value.length }), B)
      n.value.includes(S) || n.value.push(S);
    else {
      const O = n.value.indexOf(S);
      O > -1 && n.value.splice(O, 1);
    }
    console.log("[toggleCheckbox] After:", { count: n.value.length, checkboxState: Pe.value });
  }
  function ye(S) {
    return n.value.includes(S);
  }
  function pe() {
    const S = n.value.length, B = _.value.length;
    console.log("[toggleAllCheckboxes] BEFORE:", { currentCount: S, totalCount: B, checkboxState: Pe.value }), n.value.length === _.value.length ? (console.log("[toggleAllCheckboxes] ACTION: Unchecking all (was all checked)"), n.value = []) : (console.log("[toggleAllCheckboxes] ACTION: Checking all (was not all checked)"), n.value = _.value.map((X) => X.rowId));
    const O = n.value.length, N = Pe.value;
    console.log("[toggleAllCheckboxes] AFTER:", { newCount: O, totalCount: B, newState: N });
  }
  const Pe = te(() => {
    const S = n.value.length;
    return S === 0 ? "none" : S === _.value.length ? "all" : "some";
  });
  function et(S) {
    console.log("[dataGridStore] setConfig:", {
      newConfig: S,
      oldAutoValidate: u.value.autoValidate,
      newAutoValidate: S.autoValidate
    }), u.value = { ...u.value, ...S }, S.pageSize && (l.value = S.pageSize), console.log("[dataGridStore] setConfig complete:", {
      autoValidate: u.value.autoValidate,
      enableValidation: u.value.enableValidation
    });
  }
  function ft(S) {
    var X, le;
    const B = S || l.value;
    console.log("[dataGridStore] initializeEmptyRows:", {
      requestedCount: S,
      rowCount: B,
      currentRowsLength: _.value.length,
      columnsLength: s.value.length
    });
    const O = /* @__PURE__ */ new Map(), N = [];
    for (let ne = 0; ne < B; ne++) {
      const he = z(), fe = {
        rowId: he,
        rowIndex: ne,
        height: 32,
        cells: s.value.filter((Se) => !Se.specialType).map((Se) => ({
          rowId: he,
          columnName: Se.name,
          value: null,
          isSelected: !1,
          isValidationError: !1
        }))
      };
      O.set(he, fe), N.push(he);
    }
    e.value = O, o.value = N, console.log("[dataGridStore] initializeEmptyRows complete:", {
      newRowsLength: _.value.length,
      firstRowCellsCount: (le = (X = _.value[0]) == null ? void 0 : X.cells) == null ? void 0 : le.length
    });
  }
  function Rt(S) {
    console.log("[dataGridStore] setFilter:", { filter: S }), c.value = S;
  }
  function xt() {
    console.log("[dataGridStore] clearFilter"), c.value = null;
  }
  function gt(S) {
    y.value = S;
  }
  function it() {
    y.value = "";
  }
  function $e(S, B, O) {
    const N = `${S}:${B}`;
    console.log("[dataGridStore] selectCell:", {
      rowId: S,
      columnName: B,
      isCtrlPressed: O,
      wasSelected: r.value.has(N),
      currentSelectionCount: r.value.size
    }), O ? (h.value = !0, f.value = null, m.value = !1, r.value.has(N) ? (r.value.delete(N), console.log("[dataGridStore] selectCell: toggled OFF", { cellKey: N })) : (r.value.add(N), console.log("[dataGridStore] selectCell: toggled ON", { cellKey: N }))) : (h.value = !1, f.value = { rowId: S, columnName: B }, m.value = !1, r.value.clear(), r.value.add(N), console.log("[dataGridStore] selectCell: single select", { cellKey: N })), console.log("[dataGridStore] selectCell complete:", {
      newSelectionCount: r.value.size
    });
  }
  function tt(S, B) {
    f.value && (m.value = !0, r.value.clear(), nt(S, B));
  }
  function nt(S, B) {
    if (!f.value || !m.value) return;
    console.log("[dataGridStore] expandDragSelection:", {
      pressedCell: f.value,
      currentRowId: S,
      currentColumnName: B
    });
    const O = _.value.findIndex((i) => i.rowId === f.value.rowId), N = _.value.findIndex((i) => i.rowId === S);
    if (O === -1 || N === -1) return;
    const X = s.value.filter(
      (i) => !i.specialType || i.specialType === "ValidationAlerts"
    ).map((i) => i.name);
    console.log("[dataGridStore] expandDragSelection: selectableColumns", {
      total: X.length,
      columns: X
    });
    const le = X.indexOf(f.value.columnName), ne = X.indexOf(B);
    if (le === -1 || ne === -1) {
      console.warn("[dataGridStore] expandDragSelection: column not found in selectableColumns", {
        pressedColumn: f.value.columnName,
        currentColumn: B,
        pressedColIndex: le,
        currentColIndex: ne
      });
      return;
    }
    const he = Math.min(O, N), fe = Math.max(O, N), Se = Math.min(le, ne), Ve = Math.max(le, ne);
    console.log("[dataGridStore] expandDragSelection: bounds", {
      rowRange: [he, fe],
      colRange: [Se, Ve],
      cellsToSelect: (fe - he + 1) * (Ve - Se + 1)
    }), r.value.clear();
    for (let i = he; i <= fe; i++) {
      const w = _.value[i].rowId;
      for (let C = Se; C <= Ve; C++) {
        const k = X[C], I = `${w}:${k}`;
        r.value.add(I);
      }
    }
    console.log("[dataGridStore] expandDragSelection complete:", {
      selectedCellsCount: r.value.size
    });
  }
  function pt() {
    f.value = null, m.value = !1;
  }
  function It(S, B) {
    const O = `${S}:${B}`;
    return r.value.has(O);
  }
  const mt = [
    "__rowNumber",
    "__checkbox",
    "__validationAlerts",
    "__deleteRow",
    "__insertRow"
  ];
  function ot(S) {
    const B = S.filter((N) => !N.specialType).filter((N) => mt.includes(N.name)).map((N) => N.name);
    if (B.length > 0)
      throw new Error(
        `Column name conflict: The following column names are reserved for special columns and cannot be used: ${B.join(", ")}. Reserved names: ${mt.join(", ")}`
      );
    const O = Be(S);
    s.value = O, console.log("[dataGridStore] setColumns:", {
      originalCount: S.length,
      uniqueCount: O.length,
      columnNames: O.map((N) => N.name)
    });
  }
  function Be(S) {
    const B = /* @__PURE__ */ new Map();
    return S.map((O) => {
      const N = O.name, X = B.get(N) || 0;
      return B.set(N, X + 1), X > 0 ? {
        ...O,
        name: `${N}_${X + 1}`
      } : O;
    }).map((O, N, X) => {
      const le = O.name.replace(/_\d+$/, "");
      return X.filter(
        (he) => he.name === le || he.name.startsWith(`${le}_`)
      ).length > 1 && O.name === le ? { ...O, name: `${le}_1` } : O;
    });
  }
  function Je() {
    for (const S of _.value) {
      if (S.cells.every(
        (N) => N.value === null || N.value === void 0 || N.value === ""
      ))
        continue;
      if (S.cells.some((N) => N.isValidationError))
        return !1;
    }
    return !0;
  }
  function qt(S, B) {
    const O = `${S}:${B}`;
    console.log("[dataGridStore] markCellValidated:", {
      rowId: S,
      columnName: B,
      cellKey: O,
      validatedCount: v.value.size
    }), v.value.add(O), b.value.delete(O);
  }
  function Kt() {
    console.log("[dataGridStore] clearValidationTracking:", {
      clearedValidatedCount: v.value.size,
      clearedChangedCount: b.value.size
    }), v.value.clear(), b.value.clear();
  }
  function Jt() {
    console.log("[getCellsNeedingValidation] 🔍 START", {
      totalRows: _.value.length,
      validatedCellsCount: v.value.size,
      changedCellsCount: b.value.size
    });
    const S = new Set(
      s.value.filter((ne) => ne.visibleForGrid !== !1).map((ne) => ne.name)
    ), B = [];
    let O = 0, N = 0, X = 0, le = 0;
    for (const ne of _.value) {
      if (ne.cells.every(
        (fe) => fe.value === null || fe.value === void 0 || fe.value === ""
      )) {
        O++;
        continue;
      }
      for (const fe of ne.cells) {
        if (!S.has(fe.columnName))
          continue;
        const Se = `${fe.rowId}:${fe.columnName}`, Ve = v.value.has(Se), i = b.value.has(Se);
        !Ve || i ? (B.push({
          rowId: fe.rowId,
          columnName: fe.columnName
        }), Ve ? i && X++ : le++) : N++;
      }
    }
    return console.log("[getCellsNeedingValidation] 📊 RESULT:", {
      cellsToValidate: B.length,
      neverValidated: le,
      changedSinceValidation: X,
      alreadyValidated: N,
      emptyRowsSkipped: O,
      sampleCells: B.slice(0, 3).map((ne) => `${ne.rowId}:${ne.columnName}`)
    }), B;
  }
  return {
    // State
    rows: _,
    columns: s,
    selectedCells: r,
    checkedRows: n,
    pageSize: l,
    currentPage: a,
    sortColumns: $,
    filterExpression: c,
    searchQuery: y,
    searchResults: W,
    config: u,
    pressedCell: f,
    isDragging: m,
    wasCtrlPressed: h,
    isAutoRowHeightEnabled: g,
    // Computed
    visibleRows: q,
    totalRows: Z,
    totalPages: oe,
    checkboxState: Pe,
    // Actions
    loadRows: Y,
    updateCell: de,
    updateRowHeight: ae,
    setAutoRowHeightEnabled: we,
    addSort: ze,
    clearSort: H,
    setPageSize: G,
    goToPage: ce,
    deleteRow: T,
    insertRow: K,
    insertMultipleRows: D,
    toggleCheckbox: Fe,
    isRowChecked: ye,
    toggleAllCheckboxes: pe,
    setConfig: et,
    initializeEmptyRows: ft,
    setFilter: Rt,
    clearFilter: xt,
    setSearchQuery: gt,
    clearSearch: it,
    selectCell: $e,
    startDragSelection: tt,
    expandDragSelection: nt,
    endDragSelection: pt,
    isCellSelected: It,
    setColumns: ot,
    ensureUniqueColumnNames: Be,
    areNonEmptyRowsValid: Je,
    markCellValidated: qt,
    clearValidationTracking: Kt,
    getCellsNeedingValidation: Jt
  };
});
function ko(t) {
  return typeof t == "function" ? t() : A(t);
}
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Ro = () => {
};
function Yn(t, e) {
  function o(...s) {
    return new Promise((r, n) => {
      Promise.resolve(t(() => e.apply(this, s), { fn: e, thisArg: this, args: s })).then(r).catch(n);
    });
  }
  return o;
}
function Zn(t, e = {}) {
  let o, s, r = Ro;
  const n = (a) => {
    clearTimeout(a), r(), r = Ro;
  };
  return (a) => {
    const d = ko(t), p = ko(e.maxWait);
    return o && n(o), d <= 0 || p !== void 0 && p <= 0 ? (s && (n(s), s = null), Promise.resolve(a())) : new Promise((c, y) => {
      r = e.rejectOnCancel ? y : c, p && !s && (s = setTimeout(() => {
        o && n(o), s = null, c(a());
      }, p)), o = setTimeout(() => {
        s && n(s), s = null, c(a());
      }, d);
    });
  };
}
function Qn(t, e = 200, o = {}) {
  return Yn(
    Zn(e, o),
    t
  );
}
function es() {
  const t = M(/* @__PURE__ */ new Map()), e = oo({}), o = M(0), s = M(0);
  function r() {
    o.value = Object.keys(e).length;
  }
  function n(u) {
    const f = t.value.get(u.columnName) || [];
    f.push(u), t.value.set(u.columnName, f), console.log("[useValidation] addValidationRule:", {
      columnName: u.columnName,
      ruleType: u.ruleType,
      severity: u.severity,
      totalRulesForColumn: f.length
    }), s.value++;
  }
  function l(u, f, m) {
    const h = t.value.get(f) || [];
    console.log("[useValidation] validateCell:", {
      rowId: u,
      columnName: f,
      value: m,
      ruleCount: h.length,
      isEmpty: m == null || m === ""
    });
    const g = m == null || m === "";
    for (const v of h) {
      if (v.ruleType === "Required" && g)
        return console.log("[useValidation] validateCell FAILED: Required", {
          rowId: u,
          columnName: f,
          error: v.errorMessage,
          severity: v.severity
        }), {
          isValid: !1,
          error: v.errorMessage,
          severity: v.severity
        };
      if (!g) {
        if (v.ruleType === "Regex" && v.regexPattern && !new RegExp(v.regexPattern).test(String(m)))
          return console.log("[useValidation] validateCell FAILED: Regex", {
            rowId: u,
            columnName: f,
            value: m,
            pattern: v.regexPattern,
            error: v.errorMessage
          }), {
            isValid: !1,
            error: v.errorMessage,
            severity: v.severity
          };
        if (v.ruleType === "Range") {
          const b = Number(m);
          if (isNaN(b))
            return console.log("[useValidation] validateCell FAILED: Range (not a number)", {
              rowId: u,
              columnName: f,
              value: m
            }), {
              isValid: !1,
              error: "Value must be a number",
              severity: v.severity
            };
          if (v.minValue != null && b < v.minValue)
            return console.log("[useValidation] validateCell FAILED: Range (below min)", {
              rowId: u,
              columnName: f,
              value: b,
              minValue: v.minValue
            }), {
              isValid: !1,
              error: v.errorMessage,
              severity: v.severity
            };
          if (v.maxValue != null && b > v.maxValue)
            return console.log("[useValidation] validateCell FAILED: Range (above max)", {
              rowId: u,
              columnName: f,
              value: b,
              maxValue: v.maxValue
            }), {
              isValid: !1,
              error: v.errorMessage,
              severity: v.severity
            };
        }
        if (v.ruleType === "Custom" && v.customValidator && !v.customValidator(m))
          return console.log("[useValidation] validateCell FAILED: Custom", {
            rowId: u,
            columnName: f,
            value: m,
            error: v.errorMessage
          }), {
            isValid: !1,
            error: v.errorMessage,
            severity: v.severity
          };
      }
    }
    return console.log("[useValidation] validateCell PASSED", {
      rowId: u,
      columnName: f,
      value: m
    }), { isValid: !0 };
  }
  function a(u) {
    return u.every((f) => f.value == null || f.value === "");
  }
  const d = Qn(
    (u, f, m, h) => {
      if (console.log("[useValidation] validateCellThrottled:", {
        rowId: u,
        columnName: f,
        value: m,
        hasRowCells: !!h,
        rowCellsCount: h == null ? void 0 : h.length
      }), h && a(h)) {
        console.log("[useValidation] validateCellThrottled: Row is completely empty, clearing errors", {
          rowId: u
        }), delete e[u], r();
        return;
      }
      const g = l(u, f, m), v = e[u] || [];
      if (g.isValid) {
        r();
        const b = v.filter((_) => _.columnName !== f);
        b.length > 0 ? (e[u] = b, console.log("[useValidation] validateCellThrottled: Cleared error for column, other errors remain", {
          rowId: u,
          columnName: f,
          remainingErrors: b.length
        })) : (r(), delete e[u], console.log("[useValidation] validateCellThrottled: Cleared all errors for row", {
          rowId: u
        }));
      } else {
        const b = v.findIndex(($) => $.columnName === f), _ = {
          rowId: u,
          columnName: f,
          message: g.error,
          severity: g.severity
        };
        b >= 0 ? (v[b] = _, console.log("[useValidation] validateCellThrottled: Updated existing error", {
          rowId: u,
          columnName: f,
          error: _.message
        })) : (v.push(_), console.log("[useValidation] validateCellThrottled: Added new error", {
          rowId: u,
          columnName: f,
          error: _.message
        })), e[u] = v;
      }
      r();
    },
    300
  );
  async function p(u) {
    var _, $;
    console.log("[useValidation] validateAll START:", {
      rowCount: u.length
    }), Object.keys(e).forEach((x) => delete e[x]);
    let f = 0, m = 0;
    const h = 50, g = Math.ceil(u.length / h);
    for (let x = 0; x < g; x++) {
      const E = x * h, F = Math.min(E + h, u.length), J = u.slice(E, F);
      console.log(`[useValidation] Processing batch ${x + 1}/${g} (rows ${E}-${F - 1})`);
      for (const W of J) {
        if (m < 3 && console.log("[useValidation] validateAll: Examining row", {
          rowId: W.rowId,
          rowIndex: m,
          cellCount: ((_ = W.cells) == null ? void 0 : _.length) || 0
        }), m++, !W.cells || !Array.isArray(W.cells)) {
          console.log("[useValidation] validateAll: Skipping row without cells", {
            rowId: W.rowId,
            hasCells: !!W.cells,
            isArray: Array.isArray(W.cells)
          });
          continue;
        }
        if (a(W.cells)) {
          console.log("[useValidation] validateAll: Skipping empty row", {
            rowId: W.rowId,
            cellCount: (($ = W.cells) == null ? void 0 : $.length) || 0
          });
          continue;
        }
        for (const U of W.cells) {
          const Z = l(W.rowId, U.columnName, U.value);
          if (!Z.isValid) {
            const oe = e[W.rowId] || [];
            oe.push({
              rowId: W.rowId,
              columnName: U.columnName,
              message: Z.error,
              severity: Z.severity
            }), e[W.rowId] = oe, f++;
          }
        }
      }
      await ie();
    }
    console.log("[useValidation] validateAll - loop FINISHED, processed", m, "rows"), console.log("[useValidation] validateAll - totalErrors:", f);
    const v = Object.keys(e).length;
    console.log("[useValidation] validateAll - rowsWithErrors:", v), console.log("[useValidation] validateAll complete - SUCCESS"), console.log("[useValidation] validateAll - calling updateErrorCount..."), r(), console.log("[useValidation] validateAll - updateErrorCount DONE"), console.log("[useValidation] validateAll - building errors array...");
    const b = [];
    for (const x in e) {
      const E = e[x];
      E && Array.isArray(E) && b.push(...E);
    }
    return console.log("[useValidation] validateAll - errors array built, count:", b.length), console.log("[useValidation] validateAll - returning result..."), {
      isValid: f === 0,
      totalErrors: f,
      errors: b
    };
  }
  function c(u) {
    return e[u] || [];
  }
  function y() {
    const u = Object.keys(e).length;
    console.log("[useValidation] clearValidationErrors:", {
      clearedCount: u
    }), Object.keys(e).forEach((f) => delete e[f]), r();
  }
  return {
    validationRules: t,
    validationErrors: e,
    errorCount: o,
    ruleCount: s,
    addValidationRule: n,
    validateCell: l,
    validateCellThrottled: d,
    validateAll: p,
    getValidationErrors: c,
    clearValidationErrors: y
  };
}
function ts() {
  const t = M("");
  function e(c) {
    return !c || !(c.includes("	") || c.includes(`
`) || c.includes("\r") || c.includes('"')) ? c : `"${c.replace(/"/g, '""')}"`;
  }
  function o(c, y, u = {}) {
    const f = [];
    u.includeHeaders && f.push(y.map(e).join("	"));
    for (const m of c) {
      const h = y.map((g) => {
        const v = m.cells.find((_) => _.columnName === g), b = v == null ? void 0 : v.value;
        return e((b == null ? void 0 : b.toString()) ?? "");
      });
      f.push(h.join("	"));
    }
    return f.join(`
`);
  }
  function s(c) {
    const y = [], u = [];
    let f = "", m = !1, h = !0, g = [];
    for (let v = 0; v < c.length; v++) {
      const b = c[v], _ = v + 1 < c.length ? c[v + 1] : null;
      if (b === '"')
        m && _ === '"' ? (f += '"', v++) : m = !m;
      else if (b === "	" && !m)
        u.push(f), f = "";
      else if ((b === `
` || b === "\r") && !m) {
        if (b === "\r" && _ === `
` && v++, f.length > 0 || u.length > 0) {
          if (u.push(f), f = "", h) {
            if (r(u))
              g = [...u];
            else {
              g = u.map((x, E) => `Column${E + 1}`);
              const $ = {};
              for (let x = 0; x < Math.min(g.length, u.length); x++)
                $[g[x]] = u[x] || null;
              y.push($);
            }
            h = !1;
          } else {
            const $ = {};
            for (let x = 0; x < Math.min(g.length, u.length); x++)
              $[g[x]] = u[x] || null;
            y.push($);
          }
          u.length = 0;
        }
      } else
        f += b;
    }
    if (f.length > 0 || u.length > 0) {
      if (u.push(f), h && g.length === 0)
        if (r(u))
          g = [...u];
        else {
          g = u.map((b, _) => `Column${_ + 1}`);
          const v = {};
          for (let b = 0; b < Math.min(g.length, u.length); b++)
            v[g[b]] = u[b] || null;
          y.push(v);
        }
      else if (g.length > 0) {
        const v = {};
        for (let b = 0; b < Math.min(g.length, u.length); b++)
          v[g[b]] = u[b] || null;
        y.push(v);
      }
    }
    return { headers: g, rows: y };
  }
  function r(c) {
    return c.some((y) => y && isNaN(Number(y)));
  }
  async function n(c, y, u) {
    var f;
    try {
      if (c.size === 0)
        return {
          success: !1,
          message: "No cells selected for copy"
        };
      console.log("[useCopyPaste] copySelectedCells:", {
        selectedCount: c.size,
        selectedCells: Array.from(c)
      });
      const m = [];
      if (c.forEach((x) => {
        const [E, F] = x.split(":"), J = y.find((Z) => Z.rowId === E);
        if (!J) return;
        const W = u.findIndex((Z) => Z.name === F);
        if (W === -1) return;
        const U = J.cells.find((Z) => Z.columnName === F);
        m.push({
          rowId: E,
          rowIndex: J.rowIndex,
          columnName: F,
          columnIndex: W,
          value: U == null ? void 0 : U.value
        });
      }), m.length === 0)
        return {
          success: !1,
          message: "No valid cells to copy"
        };
      const h = Math.min(...m.map((x) => x.rowIndex)), g = Math.max(...m.map((x) => x.rowIndex)), v = Math.min(...m.map((x) => x.columnIndex)), b = Math.max(...m.map((x) => x.columnIndex));
      console.log("[useCopyPaste] copySelectedCells bounds:", {
        minRowIndex: h,
        maxRowIndex: g,
        minColIndex: v,
        maxColIndex: b,
        rows: g - h + 1,
        cols: b - v + 1
      });
      const _ = [];
      for (let x = h; x <= g; x++) {
        const E = [];
        for (let F = v; F <= b; F++) {
          const J = m.find((W) => W.rowIndex === x && W.columnIndex === F);
          if (J) {
            const W = ((f = J.value) == null ? void 0 : f.toString()) ?? "";
            E.push(e(W));
          } else
            E.push("");
        }
        _.push(E.join("	"));
      }
      const $ = _.join(`
`);
      return console.log("[useCopyPaste] copySelectedCells TSV:", {
        lineCount: _.length,
        preview: $.substring(0, 200)
      }), await navigator.clipboard.writeText($), t.value = $, {
        success: !0,
        message: `Copied ${m.length} cells to clipboard`,
        processedRows: m.length
      };
    } catch (m) {
      return console.error("[useCopyPaste] Copy failed:", m), {
        success: !1,
        message: `Copy failed: ${m}`
      };
    }
  }
  async function l(c, y, u = {}) {
    try {
      if (c.length === 0)
        return {
          success: !1,
          message: "No data selected for copy"
        };
      const f = o(c, y, u);
      return await navigator.clipboard.writeText(f), t.value = f, {
        success: !0,
        message: `Copied ${c.length} rows to clipboard`,
        processedRows: c.length
      };
    } catch (f) {
      return console.error("Copy failed:", f), {
        success: !1,
        message: `Copy failed: ${f}`
      };
    }
  }
  async function a() {
    try {
      let c = "";
      try {
        c = await navigator.clipboard.readText();
      } catch {
        c = t.value;
      }
      if (!c)
        return {
          success: !1,
          message: "No data available in clipboard"
        };
      const { headers: y, rows: u } = s(c);
      return {
        success: !0,
        message: `Pasted ${u.length} rows from clipboard`,
        processedRows: u.length,
        rows: u,
        headers: y
      };
    } catch (c) {
      return console.error("Paste failed:", c), {
        success: !1,
        message: `Paste failed: ${c}`
      };
    }
  }
  function d() {
    return !!t.value;
  }
  function p() {
    t.value = "";
  }
  return {
    copyToClipboard: l,
    copySelectedCells: n,
    pasteFromClipboard: a,
    canPaste: d,
    clearClipboard: p
  };
}
var Zo = /* @__PURE__ */ ((t) => (t.Append = "append", t.Replace = "replace", t.Merge = "merge", t))(Zo || {});
function Wi() {
  function t(s, r, n = {}) {
    try {
      const {
        includeHiddenColumns: l = !1,
        includeSpecialColumns: a = !1,
        onlySelectedRows: d = !1,
        prettify: p = !0
      } = n;
      let c = s;
      d && (c = s);
      const y = c.map((g) => {
        const v = {};
        for (const b of Object.keys(g))
          b.startsWith("__") || r.includes(b) && (v[b] = g[b]);
        return v;
      }), u = p ? JSON.stringify(y, null, 2) : JSON.stringify(y), f = new Blob([u], { type: "application/json" }), m = URL.createObjectURL(f), h = document.createElement("a");
      return h.href = m, h.download = `grid-export-${Date.now()}.json`, document.body.appendChild(h), h.click(), document.body.removeChild(h), URL.revokeObjectURL(m), {
        success: !0,
        rowsExported: y.length,
        message: `Successfully exported ${y.length} rows to JSON`
      };
    } catch (l) {
      return console.error("Export to JSON failed:", l), {
        success: !1,
        rowsExported: 0,
        message: `Export failed: ${l instanceof Error ? l.message : "Unknown error"}`
      };
    }
  }
  async function e(s, r, n, l = {
    mode: "append"
    /* Append */
  }) {
    try {
      const a = await s.text();
      let d;
      try {
        d = JSON.parse(a);
      } catch {
        return {
          success: !1,
          rowsImported: 0,
          rowsSkipped: 0,
          errors: ["Invalid JSON format"],
          message: "Failed to parse JSON file"
        };
      }
      if (!Array.isArray(d))
        return {
          success: !1,
          rowsImported: 0,
          rowsSkipped: 0,
          errors: ["JSON must be an array of objects"],
          message: "Invalid JSON structure"
        };
      const p = [];
      let c = 0;
      if (l.validateSchema && d.length > 0) {
        const u = d[0], f = Object.keys(u), m = n.filter((h) => !f.includes(h));
        m.length > 0 && p.push(`Missing columns in import data: ${m.join(", ")}`);
      }
      let y = [];
      switch (l.mode) {
        case "replace":
          y = d.map((f, m) => ({
            ...f,
            __rowId: f.__rowId || `imported-${Date.now()}-${m}`,
            __rowIndex: m
          }));
          break;
        case "append":
          y = [
            ...r,
            ...d.map((f, m) => ({
              ...f,
              __rowId: f.__rowId || `imported-${Date.now()}-${m}`,
              __rowIndex: r.length + m
            }))
          ];
          break;
        case "merge":
          const u = new Map(
            r.map((f) => [f.__rowId, f])
          );
          d.forEach((f, m) => {
            const h = f.__rowId || `imported-${Date.now()}-${m}`;
            if (u.has(h)) {
              const g = u.get(h);
              Object.assign(g, f, { __rowId: h });
            } else
              u.set(h, {
                ...f,
                __rowId: h,
                __rowIndex: u.size
              });
          }), y = Array.from(u.values());
          break;
      }
      return y.forEach((u, f) => {
        u.__rowIndex = f;
      }), {
        success: !0,
        rowsImported: d.length,
        rowsSkipped: c,
        errors: p,
        message: `Successfully imported ${d.length} rows using ${l.mode} mode`,
        rows: y
      };
    } catch (a) {
      return console.error("Import from JSON failed:", a), {
        success: !1,
        rowsImported: 0,
        rowsSkipped: 0,
        errors: [a instanceof Error ? a.message : "Unknown error"],
        message: "Import failed"
      };
    }
  }
  function o(s, r, n = {
    mode: "append"
    /* Append */
  }) {
    return new Promise((l) => {
      const a = document.createElement("input");
      a.type = "file", a.accept = ".json,application/json", a.onchange = async (d) => {
        var y;
        const p = (y = d.target.files) == null ? void 0 : y[0];
        if (!p) {
          l({
            success: !1,
            rowsImported: 0,
            rowsSkipped: 0,
            errors: ["No file selected"],
            message: "Import cancelled"
          });
          return;
        }
        const c = await e(p, s, r, n);
        l(c);
      }, a.oncancel = () => {
        l({
          success: !1,
          rowsImported: 0,
          rowsSkipped: 0,
          errors: ["User cancelled"],
          message: "Import cancelled"
        });
      }, a.click();
    });
  }
  return {
    exportToJson: t,
    importFromJson: e,
    openImportDialog: o,
    ImportMode: Zo
  };
}
const os = {
  minHeight: 32,
  // 32px default row height (matches default in store)
  maxHeight: 400,
  // Default fallback (will be overridden by 70% of container height)
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: 14,
  // MUST match CSS font-size in .grid-cell
  enableWrapping: !0,
  padding: 16
  // 8px left + 8px right (horizontal padding for width calculation)
};
function ns(t = os) {
  let e = null, o = null;
  function s() {
    if (e || (e = document.createElement("canvas"), o = e.getContext("2d")), !o)
      throw new Error("Failed to get canvas context");
    return o.font = `${t.fontSize}px ${t.fontFamily}`, o;
  }
  function r(c, y) {
    if (!c) return t.minHeight;
    const u = s();
    if (!t.enableWrapping)
      return t.minHeight;
    const f = c.toString().split(`
`);
    let m = t.fontSize * 1.5, h = 0;
    for (const b of f) {
      if (!b || b.trim() === "") {
        h++;
        continue;
      }
      const _ = b.split(" ");
      let $ = "", x = 1;
      for (const E of _) {
        const F = $ ? `${$} ${E}` : E;
        u.measureText(F).width > y - t.padding ? ($ && x++, $ = E) : $ = F;
      }
      h += x;
    }
    const v = h * m + 10;
    return Math.max(t.minHeight, Math.min(t.maxHeight, Math.ceil(v)));
  }
  function n(c, y) {
    try {
      let u = t.minHeight;
      for (const f of y) {
        if (f.specialType && f.specialType !== "ValidationAlerts")
          continue;
        let m = null;
        if (c.cells && Array.isArray(c.cells)) {
          const v = c.cells.find((b) => b.columnName === f.name);
          m = v == null ? void 0 : v.value;
        } else
          m = c[f.name];
        if (m == null) continue;
        const h = String(m), g = r(h, f.width);
        u = Math.max(u, g);
      }
      return {
        rowId: c.__rowId || c.rowId,
        calculatedHeight: u,
        isSuccess: !0
      };
    } catch (u) {
      return console.error("Row height calculation failed:", u), {
        rowId: c.__rowId || c.rowId,
        calculatedHeight: t.minHeight,
        isSuccess: !1
      };
    }
  }
  function l(c, y) {
    return c.map((u) => n(u, y));
  }
  async function a(c, y) {
    let u = 0, f = 0;
    const m = 50, h = Math.ceil(c.length / m);
    for (let g = 0; g < h; g++) {
      const v = g * m, b = Math.min(v + m, c.length), _ = c.slice(v, b);
      console.log(`[AutoRowHeight] Processing batch ${g + 1}/${h} (rows ${v}-${b - 1})`);
      for (const $ of _) {
        const x = n($, y);
        x.isSuccess && ($.height = x.calculatedHeight, u += x.calculatedHeight, f++);
      }
      await new Promise(($) => setTimeout($, 0));
    }
    return {
      totalRowsUpdated: f,
      averageHeight: f > 0 ? u / f : t.minHeight
    };
  }
  function d(c, y, u) {
    let f = 0;
    for (const m of c)
      if (y.includes(m.rowId)) {
        const h = n(m, u);
        h.isSuccess && (m.height = h.calculatedHeight, f++);
      }
    return f;
  }
  function p(c) {
    t.maxHeight = c, console.log(`[useAutoRowHeight] maxHeight updated to: ${c}px`);
  }
  return {
    calculateRowHeight: n,
    calculateRowHeights: l,
    applyAutoRowHeight: a,
    recalculateRows: d,
    measureTextHeight: r,
    updateMaxHeight: p
    // NEW: Allow dynamic maxHeight updates
  };
}
var Qo = /* @__PURE__ */ ((t) => (t.Normal = "normal", t.Editing = "editing", t.Selection = "selection", t.Any = "any", t))(Qo || {});
function ss(t = {}) {
  const e = /* @__PURE__ */ new Map(), o = t.context || "normal";
  function s(h) {
    const g = [];
    return h.ctrl && g.push("Ctrl"), h.shift && g.push("Shift"), h.alt && g.push("Alt"), h.meta && g.push("Meta"), g.push(h.key.toUpperCase()), g.join("+");
  }
  function r(h, g) {
    return h.key.toUpperCase() === g.key.toUpperCase() && !!h.ctrlKey == !!g.ctrl && !!h.shiftKey == !!g.shift && !!h.altKey == !!g.alt && !!h.metaKey == !!g.meta;
  }
  function n(h, g) {
    return h === "any" || h === g || g === "any";
  }
  async function l(h) {
    if (!t.enabled && t.enabled !== void 0)
      return;
    const g = Array.from(e.values()).filter((b) => b.enabled !== !1 && r(h, b.key) && n(b.context || "normal", o));
    if (g.length === 0)
      return;
    g.sort((b, _) => (_.priority || 0) - (b.priority || 0));
    const v = g[0];
    h.preventDefault(), h.stopPropagation();
    try {
      await v.handler(h);
    } catch (b) {
      console.error(`Shortcut execution failed for ${v.name}:`, b);
    }
  }
  function a(h) {
    const g = s(h.key);
    e.has(g) && console.warn(`Shortcut ${g} is already registered. Overwriting.`), e.set(g, {
      ...h,
      enabled: h.enabled !== !1,
      context: h.context || "normal",
      priority: h.priority || 0
    });
  }
  function d(h) {
    h.forEach(a);
  }
  function p(h) {
    const g = s(h);
    return e.delete(g);
  }
  function c(h) {
    const g = Array.from(e.entries()).find(([v, b]) => b.name === h);
    return g ? (e.delete(g[0]), !0) : !1;
  }
  function y(h, g) {
    const v = Array.from(e.entries()).find(([b, _]) => _.name === h);
    v && (v[1].enabled = g);
  }
  function u() {
    return Array.from(e.values());
  }
  function f(h) {
    return Array.from(e.values()).filter(
      (g) => g.context === h || g.context === "any"
      /* Any */
    );
  }
  function m() {
    e.clear();
  }
  return St(() => {
    t.enabled !== !1 && document.addEventListener("keydown", l);
  }), ao(() => {
    document.removeEventListener("keydown", l);
  }), {
    registerShortcut: a,
    registerShortcuts: d,
    unregisterShortcut: p,
    unregisterShortcutByName: c,
    setShortcutEnabled: y,
    getShortcuts: u,
    getShortcutsByContext: f,
    clearShortcuts: m,
    handleKeyDown: l
  };
}
const De = {
  ctrl: (t) => ({ key: t, ctrl: !0 }),
  shift: (t) => ({ key: t, shift: !0 }),
  alt: (t) => ({ key: t, alt: !0 }),
  ctrlShift: (t) => ({ key: t, ctrl: !0, shift: !0 }),
  ctrlAlt: (t) => ({ key: t, ctrl: !0, alt: !0 }),
  single: (t) => ({ key: t })
};
function rs(t) {
  const e = [];
  return t.onCopy && e.push({
    name: "Copy",
    key: De.ctrl("c"),
    handler: t.onCopy,
    description: "Copy selected cells",
    priority: 100
  }), t.onPaste && e.push({
    name: "Paste",
    key: De.ctrl("v"),
    handler: t.onPaste,
    description: "Paste from clipboard",
    priority: 100
  }), t.onCut && e.push({
    name: "Cut",
    key: De.ctrl("x"),
    handler: t.onCut,
    description: "Cut selected cells",
    priority: 100
  }), t.onDelete && e.push({
    name: "Delete",
    key: De.single("Delete"),
    handler: t.onDelete,
    description: "Delete selected cells",
    priority: 100
  }), t.onSelectAll && e.push({
    name: "SelectAll",
    key: De.ctrl("a"),
    handler: t.onSelectAll,
    description: "Select all cells",
    priority: 100
  }), t.onFind && e.push({
    name: "Find",
    key: De.ctrl("f"),
    handler: t.onFind,
    description: "Open find dialog",
    priority: 100
  }), t.onUndo && e.push({
    name: "Undo",
    key: De.ctrl("z"),
    handler: t.onUndo,
    description: "Undo last action",
    priority: 100
  }), t.onRedo && e.push({
    name: "Redo",
    key: De.ctrlShift("z"),
    handler: t.onRedo,
    description: "Redo last undone action",
    priority: 100
  }), t.onEscape && e.push({
    name: "Escape",
    key: De.single("Escape"),
    handler: t.onEscape,
    description: "Cancel current operation",
    priority: 100
  }), t.onEnter && e.push({
    name: "Enter",
    key: De.single("Enter"),
    handler: t.onEnter,
    description: "Confirm edit and move to next row",
    context: "editing",
    priority: 100
  }), t.onTab && e.push({
    name: "Tab",
    key: De.single("Tab"),
    handler: t.onTab,
    description: "Move to next cell",
    priority: 100
  }), t.onArrowUp && e.push({
    name: "ArrowUp",
    key: De.single("ArrowUp"),
    handler: t.onArrowUp,
    description: "Move selection up",
    priority: 50
  }), t.onArrowDown && e.push({
    name: "ArrowDown",
    key: De.single("ArrowDown"),
    handler: t.onArrowDown,
    description: "Move selection down",
    priority: 50
  }), t.onArrowLeft && e.push({
    name: "ArrowLeft",
    key: De.single("ArrowLeft"),
    handler: t.onArrowLeft,
    description: "Move selection left",
    priority: 50
  }), t.onArrowRight && e.push({
    name: "ArrowRight",
    key: De.single("ArrowRight"),
    handler: t.onArrowRight,
    description: "Move selection right",
    priority: 50
  }), e;
}
const yt = M([]), ho = M(!1), is = 50, ls = 100;
let Tt = null;
function as() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function Et(t, e, o, s) {
  const r = {
    timestamp: as(),
    level: t,
    category: e,
    message: o,
    data: s !== void 0 ? JSON.parse(JSON.stringify(s)) : void 0
  };
  yt.value.push(r), ho.value || cs();
}
function cs() {
  Tt === null && (ho.value = !0, Tt = window.setInterval(() => {
    us();
  }, ls));
}
function en() {
  Tt !== null && (window.clearInterval(Tt), Tt = null), ho.value = !1;
}
function us() {
  if (yt.value.length === 0) {
    en();
    return;
  }
  const t = yt.value.splice(0, is);
  for (const e of t)
    tn(e);
}
function tn(t) {
  const o = `${`[${t.timestamp}] [${t.level}] [${t.category}]`} ${t.message}`;
  switch (t.level) {
    case "DEBUG":
      t.data !== void 0 ? console.debug(o, t.data) : console.debug(o);
      break;
    case "INFO":
      t.data !== void 0 ? console.log(o, t.data) : console.log(o);
      break;
    case "WARN":
      t.data !== void 0 ? console.warn(o, t.data) : console.warn(o);
      break;
    case "ERROR":
    case "FATAL":
      t.data !== void 0 ? console.error(o, t.data) : console.error(o);
      break;
  }
}
function ds(t = "App") {
  return {
    debug(e, o) {
      Et("DEBUG", t, e, o);
    },
    info(e, o) {
      Et("INFO", t, e, o);
    },
    warn(e, o) {
      Et("WARN", t, e, o);
    },
    error(e, o) {
      Et("ERROR", t, e, o);
    },
    fatal(e, o) {
      Et("FATAL", t, e, o);
    },
    /**
     * Flushes all pending logs immediately (synchronously)
     */
    flush() {
      for (; yt.value.length > 0; ) {
        const e = yt.value.shift();
        tn(e);
      }
      en();
    },
    /**
     * Gets current queue size
     */
    getQueueSize() {
      return yt.value.length;
    }
  };
}
const hs = "http://localhost:5000/api/grid";
class fs {
  constructor() {
    this.isHostMode = !1, this.isHostMode = this.detectHostMode(), console.log(`Grid API Mode: ${this.isHostMode ? "Host Objects" : "HTTP"}`);
  }
  /**
   * Detect if running in WebView2 with gridApi bridge
   */
  detectHostMode() {
    return !!window.gridApi;
  }
  /**
   * Call gridApi method (WebView2 mode with postMessage bridge)
   */
  async callHostApi(e, ...o) {
    try {
      if (!window.gridApi)
        throw new Error("Grid API not available");
      const r = await window.gridApi[e](...o);
      return JSON.parse(r);
    } catch (s) {
      return console.error("Grid API call failed:", s), {
        success: !1,
        error: s instanceof Error ? s.message : "Unknown error"
      };
    }
  }
  /**
   * HTTP request (development mode)
   */
  async request(e, o) {
    try {
      const s = await fetch(`${hs}${e}`, {
        ...o,
        headers: {
          "Content-Type": "application/json",
          ...o == null ? void 0 : o.headers
        },
        credentials: "include"
      });
      return s.ok ? await s.json() : {
        success: !1,
        error: (await s.json().catch(() => ({ error: s.statusText }))).error || `HTTP ${s.status}: ${s.statusText}`
      };
    } catch (s) {
      return console.error("API request failed:", s), {
        success: !1,
        error: s instanceof Error ? s.message : "Unknown error"
      };
    }
  }
  /**
   * Get grid data from backend
   */
  async getData() {
    return this.isHostMode ? this.callHostApi("GetData") : this.request("/data");
  }
  /**
   * Import data to backend (replaces existing data)
   */
  async importData(e) {
    if (this.isHostMode) {
      const o = JSON.stringify({ data: e });
      return this.callHostApi("ImportData", o);
    } else
      return this.request("/import", {
        method: "POST",
        body: JSON.stringify({ data: e })
      });
  }
  /**
   * Export data from backend
   */
  async exportData(e) {
    if (this.isHostMode) {
      const o = JSON.stringify({
        OnlyFiltered: (e == null ? void 0 : e.onlyFiltered) ?? !1,
        FilteredRowIds: (e == null ? void 0 : e.filteredRowIds) ?? null,
        ColumnNames: (e == null ? void 0 : e.columnNames) ?? null
      });
      return this.callHostApi("ExportData", o);
    } else {
      const o = new URLSearchParams();
      e != null && e.onlyFiltered && o.append("onlyFiltered", "true"), e != null && e.filteredRowIds && o.append("filteredRowIds", JSON.stringify(e.filteredRowIds)), e != null && e.columnNames && o.append("columnNames", JSON.stringify(e.columnNames));
      const s = o.toString() ? `?${o.toString()}` : "";
      return this.request(`/export${s}`);
    }
  }
  /**
   * Get grid configuration
   */
  async getConfig() {
    return this.isHostMode ? this.callHostApi("GetConfig") : this.request("/config");
  }
  /**
   * Set validation rules
   */
  async setValidationRules(e) {
    if (this.isHostMode) {
      const o = JSON.stringify({ rules: e });
      return this.callHostApi("SetValidationRules", o);
    } else
      return this.request("/validation-rules", {
        method: "POST",
        body: JSON.stringify({ rules: e })
      });
  }
  /**
   * Get validation rules
   */
  async getValidationRules() {
    return this.isHostMode ? this.callHostApi("GetValidationRules") : this.request("/validation-rules");
  }
  /**
   * Get column definitions with full metadata
   */
  async getColumns() {
    return this.isHostMode ? this.callHostApi("GetColumns") : this.request("/columns/definitions");
  }
  /**
   * Get current data (alias for getData)
   */
  async getCurrentData() {
    return this.isHostMode ? this.callHostApi("GetCurrentData") : this.getData();
  }
  /**
   * Get all column names (data columns + checkbox special column)
   */
  async getColumnNames() {
    var e;
    if (this.isHostMode) {
      const o = await this.callHostApi("GetColumnNames");
      return {
        success: o.success,
        data: (e = o.data) == null ? void 0 : e.columnNames,
        error: o.error
      };
    } else
      return this.request("/columns");
  }
  /**
   * Health check
   */
  async healthCheck() {
    try {
      return this.isHostMode ? (await this.callHostApi("HealthCheck")).success : (await fetch("http://localhost:5000/health")).ok;
    } catch {
      return !1;
    }
  }
}
const Qt = new fs(), Xe = {
  cellColors: {
    defaultBackground: "#ffffff",
    defaultForeground: "#212529",
    hoverBackground: "#f8f9fa",
    hoverForeground: "#212529",
    focusedBackground: "#e3f2fd",
    focusedForeground: "#0d6efd",
    disabledBackground: "#e9ecef",
    disabledForeground: "#6c757d",
    readOnlyBackground: "#f8f9fa",
    readOnlyForeground: "#495057"
  },
  rowColors: {
    evenRowBackground: "#ffffff",
    oddRowBackground: "#f8f9fa",
    hoverBackground: "#e3f2fd",
    selectedBackground: "#0d6efd",
    selectedForeground: "#ffffff",
    selectedInactiveBackground: "#e9ecef",
    selectedInactiveForeground: "#495057"
  },
  headerColors: {
    background: "#f1f3f5",
    foreground: "#212529",
    hoverBackground: "#e9ecef",
    pressedBackground: "#dee2e6",
    sortIndicatorColor: "#0d6efd"
  },
  validationColors: {
    errorBackground: "#ffebee",
    errorForeground: "#c62828",
    errorBorder: "#ef5350",
    warningBackground: "#fff3e0",
    warningForeground: "#e65100",
    warningBorder: "#ff9800",
    infoBackground: "#e3f2fd",
    infoForeground: "#1565c0",
    infoBorder: "#2196f3"
  },
  selectionColors: {
    selectionBorder: "#0d6efd",
    selectionFill: "rgba(13, 110, 253, 0.1)",
    multiSelectionBackground: "#bbdefb",
    multiSelectionForeground: "#0d6efd"
  },
  borderColors: {
    cellBorder: "#e0e0e0",
    rowBorder: "#e0e0e0",
    columnBorder: "#dee2e6",
    gridBorder: "#ced4da",
    focusedCellBorder: "#0d6efd"
  },
  specialColumnColors: {
    rowNumberBackground: "#f5f5f5",
    rowNumberForeground: "#666666",
    checkboxBorder: "#ced4da",
    checkboxBackground: "#ffffff",
    checkboxForeground: "#212529",
    deleteRowBackground: "transparent",
    deleteRowForeground: "#dc3545",
    deleteRowHoverBackground: "#ffebee",
    insertRowBackground: "transparent",
    insertRowForeground: "#28a745",
    insertRowBorder: "transparent",
    insertRowHoverBackground: "#e8f5e9",
    insertRowHoverForeground: "#1b5e20",
    validationAlertsErrorBackground: "#ffebee",
    validationAlertsErrorForeground: "#c62828"
  },
  uiControlColors: {
    resizeGripColor: "#adb5bd",
    menuBackground: "#ffffff",
    menuForeground: "#212529",
    menuHoverBackground: "#f8f9fa",
    dialogBackground: "#ffffff",
    dialogForeground: "#212529",
    dialogBorder: "#dee2e6",
    placeholderColor: "#6c757d",
    searchPanelBackground: "#f8f9fa",
    searchPanelForeground: "#212529",
    searchPanelBorder: "#ced4da",
    filterRowBackground: "#f8f9fa",
    filterRowForeground: "#212529",
    filterRowBorder: "#dee2e6",
    paginationBackground: "#ffffff",
    paginationForeground: "#212529",
    paginationBorder: "#dee2e6",
    paginationButtonHoverBackground: "#e9ecef"
  }
}, bt = {
  itemColors: {
    defaultBackground: "#ffffff",
    defaultForeground: "#212529",
    hoverBackground: "#f8f9fa",
    hoverForeground: "#212529",
    selectedBackground: "#e3f2fd",
    selectedForeground: "#0d6efd",
    selectedHoverBackground: "#bbdefb",
    selectedHoverForeground: "#0d6efd",
    disabledBackground: "#e9ecef",
    disabledForeground: "#6c757d"
  },
  containerColors: {
    background: "#ffffff",
    border: "#ced4da",
    focusedBorder: "#0d6efd",
    titleForeground: "#212529"
  },
  checkboxColors: {
    border: "#ced4da",
    background: "#ffffff",
    checkedBackground: "#0d6efd",
    checkedBorder: "#0d6efd",
    hoverBorder: "#adb5bd"
  },
  scrollbarColors: {
    trackBackground: "#f1f1f1",
    thumbBackground: "#c1c1c1",
    thumbHoverBackground: "#a8a8a8"
  }
}, gs = Symbol("theme");
function Li() {
  return Ie(gs, {
    dataGridTheme: M(Xe),
    listBoxTheme: M(bt)
  });
}
function ps(t) {
  return {
    // Cell Colors
    "--dg-cell-bg": t.cellColors.defaultBackground,
    "--dg-cell-fg": t.cellColors.defaultForeground,
    "--dg-cell-hover-bg": t.cellColors.hoverBackground,
    "--dg-cell-hover-fg": t.cellColors.hoverForeground,
    "--dg-cell-focused-bg": t.cellColors.focusedBackground,
    "--dg-cell-focused-fg": t.cellColors.focusedForeground,
    "--dg-cell-disabled-bg": t.cellColors.disabledBackground,
    "--dg-cell-disabled-fg": t.cellColors.disabledForeground,
    "--dg-cell-readonly-bg": t.cellColors.readOnlyBackground,
    "--dg-cell-readonly-fg": t.cellColors.readOnlyForeground,
    // Row Colors
    "--dg-row-even-bg": t.rowColors.evenRowBackground,
    "--dg-row-odd-bg": t.rowColors.oddRowBackground,
    "--dg-row-hover-bg": t.rowColors.hoverBackground,
    "--dg-row-selected-bg": t.rowColors.selectedBackground,
    "--dg-row-selected-fg": t.rowColors.selectedForeground,
    "--dg-row-selected-inactive-bg": t.rowColors.selectedInactiveBackground,
    "--dg-row-selected-inactive-fg": t.rowColors.selectedInactiveForeground,
    // Header Colors
    "--dg-header-bg": t.headerColors.background,
    "--dg-header-fg": t.headerColors.foreground,
    "--dg-header-hover-bg": t.headerColors.hoverBackground,
    "--dg-header-pressed-bg": t.headerColors.pressedBackground,
    "--dg-header-sort-indicator": t.headerColors.sortIndicatorColor,
    // Validation Colors
    "--dg-validation-error-bg": t.validationColors.errorBackground,
    "--dg-validation-error-fg": t.validationColors.errorForeground,
    "--dg-validation-error-border": t.validationColors.errorBorder,
    "--dg-validation-warning-bg": t.validationColors.warningBackground,
    "--dg-validation-warning-fg": t.validationColors.warningForeground,
    "--dg-validation-warning-border": t.validationColors.warningBorder,
    "--dg-validation-info-bg": t.validationColors.infoBackground,
    "--dg-validation-info-fg": t.validationColors.infoForeground,
    "--dg-validation-info-border": t.validationColors.infoBorder,
    // Selection Colors
    "--dg-selection-border": t.selectionColors.selectionBorder,
    "--dg-selection-fill": t.selectionColors.selectionFill,
    "--dg-multi-selection-bg": t.selectionColors.multiSelectionBackground,
    "--dg-multi-selection-fg": t.selectionColors.multiSelectionForeground,
    // Border Colors
    "--dg-border-cell": t.borderColors.cellBorder,
    "--dg-border-row": t.borderColors.rowBorder,
    "--dg-border-column": t.borderColors.columnBorder,
    "--dg-border-grid": t.borderColors.gridBorder,
    "--dg-border-focused-cell": t.borderColors.focusedCellBorder,
    // Special Column Colors
    "--dg-special-rownumber-bg": t.specialColumnColors.rowNumberBackground,
    "--dg-special-rownumber-fg": t.specialColumnColors.rowNumberForeground,
    "--dg-special-checkbox-border": t.specialColumnColors.checkboxBorder,
    "--dg-special-checkbox-bg": t.specialColumnColors.checkboxBackground,
    "--dg-special-checkbox-fg": t.specialColumnColors.checkboxForeground,
    "--dg-special-delete-bg": t.specialColumnColors.deleteRowBackground,
    "--dg-special-delete-fg": t.specialColumnColors.deleteRowForeground,
    "--dg-special-delete-hover-bg": t.specialColumnColors.deleteRowHoverBackground,
    "--dg-special-insert-bg": t.specialColumnColors.insertRowBackground,
    "--dg-special-insert-fg": t.specialColumnColors.insertRowForeground,
    "--dg-special-insert-border": t.specialColumnColors.insertRowBorder,
    "--dg-special-insert-hover-bg": t.specialColumnColors.insertRowHoverBackground,
    "--dg-special-insert-hover-fg": t.specialColumnColors.insertRowHoverForeground,
    "--dg-special-validation-error-bg": t.specialColumnColors.validationAlertsErrorBackground,
    "--dg-special-validation-error-fg": t.specialColumnColors.validationAlertsErrorForeground,
    // UI Control Colors
    "--dg-ui-resize-grip": t.uiControlColors.resizeGripColor,
    "--dg-ui-menu-bg": t.uiControlColors.menuBackground,
    "--dg-ui-menu-fg": t.uiControlColors.menuForeground,
    "--dg-ui-menu-hover-bg": t.uiControlColors.menuHoverBackground,
    "--dg-ui-dialog-bg": t.uiControlColors.dialogBackground,
    "--dg-ui-dialog-fg": t.uiControlColors.dialogForeground,
    "--dg-ui-dialog-border": t.uiControlColors.dialogBorder,
    "--dg-ui-placeholder": t.uiControlColors.placeholderColor,
    "--dg-ui-search-bg": t.uiControlColors.searchPanelBackground,
    "--dg-ui-search-fg": t.uiControlColors.searchPanelForeground,
    "--dg-ui-search-border": t.uiControlColors.searchPanelBorder,
    "--dg-ui-filter-bg": t.uiControlColors.filterRowBackground,
    "--dg-ui-filter-fg": t.uiControlColors.filterRowForeground,
    "--dg-ui-filter-border": t.uiControlColors.filterRowBorder,
    "--dg-ui-pagination-bg": t.uiControlColors.paginationBackground,
    "--dg-ui-pagination-fg": t.uiControlColors.paginationForeground,
    "--dg-ui-pagination-border": t.uiControlColors.paginationBorder,
    "--dg-ui-pagination-button-hover-bg": t.uiControlColors.paginationButtonHoverBackground
  };
}
function ms(t) {
  return {
    // Item Colors
    "--lb-item-bg": t.itemColors.defaultBackground,
    "--lb-item-fg": t.itemColors.defaultForeground,
    "--lb-item-hover-bg": t.itemColors.hoverBackground,
    "--lb-item-hover-fg": t.itemColors.hoverForeground,
    "--lb-item-selected-bg": t.itemColors.selectedBackground,
    "--lb-item-selected-fg": t.itemColors.selectedForeground,
    "--lb-item-selected-hover-bg": t.itemColors.selectedHoverBackground,
    "--lb-item-selected-hover-fg": t.itemColors.selectedHoverForeground,
    "--lb-item-disabled-bg": t.itemColors.disabledBackground,
    "--lb-item-disabled-fg": t.itemColors.disabledForeground,
    // Container Colors
    "--lb-container-bg": t.containerColors.background,
    "--lb-container-border": t.containerColors.border,
    "--lb-container-focused-border": t.containerColors.focusedBorder,
    "--lb-title-fg": t.containerColors.titleForeground,
    // Checkbox Colors
    "--lb-checkbox-border": t.checkboxColors.border,
    "--lb-checkbox-bg": t.checkboxColors.background,
    "--lb-checkbox-checked-bg": t.checkboxColors.checkedBackground,
    "--lb-checkbox-checked-border": t.checkboxColors.checkedBorder,
    "--lb-checkbox-hover-border": t.checkboxColors.hoverBorder,
    // Scrollbar Colors
    "--lb-scrollbar-track-bg": t.scrollbarColors.trackBackground,
    "--lb-scrollbar-thumb-bg": t.scrollbarColors.thumbBackground,
    "--lb-scrollbar-thumb-hover-bg": t.scrollbarColors.thumbHoverBackground
  };
}
let st = null;
function vs() {
  return st !== null;
}
function ws(t) {
  st && on(), st = t;
}
function xo(t) {
  t === st && (st = null);
}
function on() {
  st && (st.closeMenu(), st = null);
}
const Ze = {
  defaultDirection: "br",
  defaultMinWidth: 100,
  defaultMaxWidth: 600,
  defaultZindex: 100,
  defaultZoom: 1,
  defaultAdjustPadding: {
    x: 0,
    y: 10
  }
};
function At(t, e) {
  let o = t.offsetTop;
  return t.offsetParent != null && t.offsetParent != e && (o -= t.offsetParent.scrollTop, o += At(t.offsetParent, e)), o;
}
function Mt(t, e) {
  let o = t.offsetLeft;
  return t.offsetParent != null && t.offsetParent != e && (o -= t.offsetParent.scrollLeft, o += Mt(t.offsetParent, e)), o;
}
function bs(t, e, o, s) {
  return {
    x: Mt(t, s) + e,
    y: At(t, s) + o
  };
}
const eo = "mx-menu-default-container", ys = "mx-menu-container-";
let Cs = 0;
function nn(t) {
  const { getContainer: e, zIndex: o } = t;
  if (e) {
    const r = typeof e == "function" ? e() : e;
    if (r) {
      let n = r.getAttribute("id");
      return n || (n = ys + Cs++, r.setAttribute("id", n)), {
        eleId: n,
        container: r,
        isNew: !1
      };
    }
  }
  let s = document.getElementById(eo);
  return s || (s = document.createElement("div"), s.setAttribute("id", eo), s.setAttribute("class", "mx-menu-ghost-host fullscreen"), document.body.appendChild(s)), s.style.zIndex = (o == null ? void 0 : o.toString()) || Ze.defaultZindex.toString(), {
    eleId: eo,
    container: s,
    isNew: !0
  };
}
function _s(t) {
  let e = 0;
  for (let o = 0; o < t.length; o++) {
    const s = t.charCodeAt(o);
    e = (e << 5) - e + s, e |= 0;
  }
  return e;
}
function Io(t) {
  return typeof t == "number" ? `${t}px` : t;
}
const Ye = He({
  props: {
    /**
     * Can be VNode or (data: unknown) => VNode
     */
    vnode: {
      type: null
    },
    /**
     * If vnode is a callback, this data will be passed to the callback first parameter.
     * @default null
     */
    data: {
      type: null,
      default: null
    }
  },
  setup(t) {
    const { vnode: e, data: o } = kt(t);
    return () => typeof e.value == "function" ? e.value(o.value) : e.value;
  }
});
function Ss(t, e) {
  const o = { ...t };
  return delete o[e], o;
}
var ks = Object.defineProperty, Rs = (t, e, o) => e in t ? ks(t, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[e] = o, Eo = (t, e, o) => Rs(t, typeof e != "symbol" ? e + "" : e, o);
class $o {
  constructor(e, o) {
    Eo(this, "x", 0), Eo(this, "y", 0), this.x = e || 0, this.y = o || 0;
  }
  set(e, o) {
    this.x = e, this.y = o;
  }
  substract(e) {
    this.x -= e.x, this.y -= e.y;
  }
}
function To(t) {
  const { onDown: e, onMove: o, onUp: s } = t, r = new $o(), n = new $o();
  let l;
  function a(p) {
    p.stopPropagation(), n.set(p.x, p.y), n.substract(r), o(r, n, p, l);
  }
  function d(p) {
    s(p, l), r.set(0, 0), document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", d);
  }
  return (p, c) => e(p, c) ? (l = c, r.set(p.x, p.y), document.addEventListener("mousemove", a), document.addEventListener("mouseup", d), p.stopPropagation(), !0) : !1;
}
function xs(t, e) {
  let o = 0;
  return {
    start() {
      o > 0 && clearInterval(o), o = setInterval(() => {
        o = 0, e();
      }, t);
    },
    stop() {
      o > 0 && (clearInterval(o), o = 0);
    }
  };
}
const $t = [], Ao = xs(100, () => {
  for (const t of $t)
    t();
});
function Is(t, e, o, s) {
  let r = 0, n = 0;
  function l() {
    t.value && (e && r !== t.value.offsetWidth && e(t.value.offsetWidth), o && n !== t.value.offsetHeight && o(t.value.offsetHeight), r = t.value.offsetWidth, n = t.value.offsetHeight);
  }
  return {
    startResizeChecker() {
      Ao.start(), $t.push(l);
    },
    stopResizeChecker() {
      const a = $t.indexOf(l);
      a >= 0 && $t.splice(a, 1), $t.length === 0 && Ao.stop();
    }
  };
}
const Mo = 140, Es = 70, $s = /* @__PURE__ */ He({
  __name: "ScrollRect",
  props: {
    /**
     * Scroll direction
     * 
     * * both : Scroll in both directions
     * * vertical : Scroll only in vertical direction
     * * horizontal : Scroll only in horizontal direction
     * * none : Disable scroll
     * 
     * @default both
     */
    scroll: {
      type: String,
      default: "both"
    },
    /**
     * Show scroll bar always, otherwise show scroll bar when mouse over
     * @default false
     */
    scrollBarAlwaysShow: {
      type: Boolean,
      default: !1
    },
    /**
     * Is able to click scroll bar background to set scroll position? (When `scrollBarAlwaysShow` is true)
     * @default true
     */
    scrollBarBackgroundClickable: {
      type: Boolean,
      default: !1
    },
    height: {
      type: Number,
      default: void 0
    },
    width: {
      type: Number,
      default: void 0
    },
    /**
     * 
     */
    maxHeight: {
      type: Number,
      default: void 0
    },
    maxWidth: {
      type: Number,
      default: void 0
    },
    /**
     * CSS class of inner container
     */
    containerClass: {
      type: String,
      default: ""
    },
    /**
     * Container style
     */
    containerStyle: {
      type: null
    }
  },
  emits: ["scroll", "resized"],
  setup(t, { expose: e, emit: o }) {
    const s = t, r = o, n = M(), l = M(), a = M(), d = M(), p = M(), c = M(), y = M(!1), u = te(() => s.scroll === "horizontal" || s.scroll === "both"), f = te(() => s.scroll === "vertical" || s.scroll === "both"), m = oo({
      show: !1,
      size: 0,
      sizeRaw: 0,
      pos: 0
    }), h = oo({
      show: !1,
      size: 0,
      sizeRaw: 0,
      pos: 0
    });
    let g = 0, v = 0, b = 0, _ = 0, $ = null;
    const x = { attributes: !0, childList: !0 };
    function E() {
      if (n.value) {
        if (m.show) {
          const T = n.value.offsetWidth / n.value.scrollWidth;
          m.sizeRaw = T * n.value.offsetWidth, m.size = T * 100, m.pos = n.value.scrollLeft / (n.value.scrollWidth - n.value.offsetWidth) * (100 - m.size), T >= 1 && (m.show = !1);
        }
        if (h.show) {
          const T = n.value.offsetHeight / n.value.scrollHeight;
          h.sizeRaw = T * n.value.offsetHeight, h.size = T * 100, h.pos = n.value.scrollTop / (n.value.scrollHeight - n.value.offsetHeight) * (100 - h.size), T >= 1 && (h.show = !1);
        }
        r("scroll", n.value.scrollLeft, n.value.scrollTop);
      }
    }
    function F(T = !1) {
      if (!n.value)
        return;
      let K = u.value, D = f.value;
      const Fe = K && (g !== n.value.scrollWidth || b !== n.value.offsetWidth), ye = f && (v !== n.value.scrollHeight || _ !== n.value.offsetHeight);
      if (!T && !Fe && !ye)
        return;
      const pe = window.getComputedStyle(n.value);
      (pe.overflow === "hidden" || pe.overflowX === "hidden") && (K = !1), (pe.overflow === "hidden" || pe.overflowY === "hidden") && (D = !1), m.show = K, h.show = D, E(), b = n.value.offsetWidth, _ = n.value.offsetHeight, g = n.value.scrollWidth, v = n.value.scrollHeight, r("resized", g, v);
    }
    function J(T) {
      var K;
      s.scroll == "horizontal" && (T.deltaMode == 0 && ((K = n.value) == null || K.scrollTo({
        left: n.value.scrollLeft + (T.deltaY > 0 ? Mo : -140),
        behavior: "smooth"
      })), T.preventDefault(), T.stopPropagation());
    }
    function W(T) {
      var K;
      T.deltaMode == 0 && ((K = n.value) == null || K.scrollTo({
        left: n.value.scrollLeft + (T.deltaY > 0 ? Mo : -140),
        behavior: "smooth"
      }), T.preventDefault(), T.stopPropagation());
    }
    function U(T) {
      var K;
      T.deltaMode == 0 && ((K = n.value) == null || K.scrollTo({
        top: n.value.scrollTop + (T.deltaY > 0 ? Es : -70),
        behavior: "smooth"
      }), T.preventDefault(), T.stopPropagation());
    }
    let Z = 0, oe = 0, q = 0, Y = 0;
    const de = To({
      onDown(T) {
        return !a.value || !p.value ? !1 : (Z = T.offsetX, oe = T.x - T.offsetX - p.value.offsetLeft, T.preventDefault(), y.value = !0, !0);
      },
      onMove(T, K, D) {
        n.value && a.value && (Ae(D.x - Z - oe), D.preventDefault(), D.stopPropagation());
      },
      onUp() {
        y.value = !1;
      }
    }), ae = To({
      onDown(T) {
        return !d.value || !c.value ? !1 : (q = T.offsetY, Y = T.y - T.offsetY - c.value.offsetTop, T.preventDefault(), y.value = !0, !0);
      },
      onMove(T, K, D) {
        n.value && d.value && (ze(D.y - q - Y), D.preventDefault(), D.stopPropagation());
      },
      onUp() {
        y.value = !1;
      }
    });
    function we(T) {
      n.value && (n.value.scrollLeft = T / 100 * (n.value.scrollWidth - n.value.offsetWidth));
    }
    function xe(T) {
      n.value && (n.value.scrollLeft = T / 100 * (n.value.scrollHeight - n.value.offsetHeight));
    }
    function Ae(T) {
      n.value && (n.value.scrollLeft = T / (n.value.offsetWidth - m.sizeRaw) * (n.value.scrollWidth - n.value.offsetWidth));
    }
    function ze(T) {
      n.value && (n.value.scrollTop = T / (n.value.offsetHeight - h.sizeRaw) * (n.value.scrollHeight - n.value.offsetHeight));
    }
    function H(T) {
      s.scrollBarBackgroundClickable && Ae(T.offsetX - m.sizeRaw / 2);
    }
    function G(T) {
      s.scrollBarBackgroundClickable && ze(T.offsetY - h.sizeRaw / 2);
    }
    const {
      startResizeChecker: ce,
      stopResizeChecker: z
    } = Is(
      n,
      () => F(),
      () => F()
    );
    return St(() => {
      ie(() => {
        setTimeout(() => F(!0), 200), F(!0), ce(), $ = new MutationObserver(() => F()), $.observe(n.value, x);
      });
    }), Ct(() => {
      z(), $ && ($.disconnect(), $ = null);
    }), e({
      refreshScrollState() {
        F(!0);
      },
      getScrollContainer() {
        return n.value;
      },
      scrollTo(T, K) {
        var D;
        (D = n.value) == null || D.scrollTo(T, K);
      },
      scrollToTop() {
        var T;
        (T = n.value) == null || T.scrollTo(0, 0);
      },
      scrollToBottom() {
        var T;
        (T = n.value) == null || T.scrollTo(n.value.scrollWidth, n.value.scrollHeight);
      }
    }), (T, K) => (P(), j("div", {
      ref_key: "scrollrect",
      ref: l,
      class: Ee([
        "vue-scroll-rect",
        t.scrollBarAlwaysShow ? "always-show-scrollbar" : "",
        t.scrollBarBackgroundClickable ? "background-clickable" : "",
        y.value ? "dragging" : ""
      ]),
      style: We({
        width: t.width ? `${t.width}px` : void 0,
        height: t.height ? `${t.height}px` : void 0
      }),
      onWheel: J
    }, [
      L("div", {
        ref_key: "container",
        ref: n,
        class: Ee(["scroll-content", t.scroll, t.containerClass]),
        style: We({
          maxWidth: t.maxWidth ? `${t.maxWidth}px` : void 0,
          maxHeight: t.maxHeight ? `${t.maxHeight}px` : void 0,
          ...t.containerStyle
        }),
        onScroll: E
      }, [
        _e(T.$slots, "default")
      ], 38),
      m.show ? _e(T.$slots, "scrollBarX", {
        key: 0,
        scrollBarValue: m,
        onScroll: we
      }, () => [
        L("div", {
          ref_key: "scrollBarRefX",
          ref: a,
          class: "scrollbar horizontal",
          onClick: H,
          onWheel: W
        }, [
          L("div", {
            class: "thumb",
            ref_key: "scrollBarThumbRefX",
            ref: p,
            style: We({ left: `${m.pos}%`, width: `${m.size}%` }),
            onMousedown: K[0] || (K[0] = //@ts-ignore
            (...D) => A(de) && A(de)(...D)),
            onWheel: W
          }, null, 36)
        ], 544)
      ]) : ue("", !0),
      h.show ? _e(T.$slots, "scrollBarY", {
        key: 1,
        scrollBarValue: h,
        onScroll: xe
      }, () => [
        h.show ? (P(), j("div", {
          key: 0,
          ref_key: "scrollBarRefY",
          ref: d,
          class: "scrollbar vertical",
          onClick: G,
          onWheel: U
        }, [
          L("div", {
            class: "thumb",
            ref_key: "scrollBarThumbRefY",
            ref: c,
            style: We({ top: `${h.pos}%`, height: `${h.size}%` }),
            onMousedown: K[1] || (K[1] = //@ts-ignore
            (...D) => A(ae) && A(ae)(...D)),
            onWheel: U
          }, null, 36)
        ], 544)) : ue("", !0)
      ]) : ue("", !0)
    ], 38));
  }
}), fo = (t, e) => {
  const o = t.__vccOpts || t;
  for (const [s, r] of e)
    o[s] = r;
  return o;
}, Ts = {}, As = {
  class: "mx-checked-mark",
  "aria-hidden": "true",
  viewBox: "0 0 1024 1024"
}, Ms = /* @__PURE__ */ L("path", { d: "M129.3,428.6L52,512l345,372.5l575-620.8l-69.5-75L400.4,718.2L129.3,428.6z" }, null, -1), Hs = [
  Ms
];
function Ps(t, e) {
  return P(), j("svg", As, Hs);
}
const Ds = /* @__PURE__ */ fo(Ts, [["render", Ps]]), zs = {}, Fs = {
  class: "mx-right-arrow",
  "aria-hidden": "true",
  viewBox: "0 0 1024 1024"
}, Bs = /* @__PURE__ */ L("path", { d: "M307.018 49.445c11.517 0 23.032 4.394 31.819 13.18L756.404 480.18c8.439 8.438 13.181 19.885 13.181 31.82s-4.741 23.38-13.181 31.82L338.838 961.376c-17.574 17.573-46.065 17.573-63.64-0.001-17.573-17.573-17.573-46.065 0.001-63.64L660.944 512 275.198 126.265c-17.574-17.573-17.574-46.066-0.001-63.64C283.985 53.839 295.501 49.445 307.018 49.445z" }, null, -1), Vs = [
  Bs
];
function Os(t, e) {
  return P(), j("svg", Fs, Vs);
}
const Ns = /* @__PURE__ */ fo(zs, [["render", Os]]), Ws = { class: "mx-item-row" }, Ls = ["xlink:href"], Us = {
  key: 1,
  class: "label"
}, js = { class: "mx-item-row" }, Gs = { class: "mx-shortcut" }, go = /* @__PURE__ */ He({
  __name: "ContextMenuItem",
  props: {
    /**
     * Is this menu disabled? 
     */
    disabled: {
      type: Boolean,
      default: !1
    },
    /**
     * Is this menu hidden? 
     */
    hidden: {
      type: Boolean,
      default: !1
    },
    customRender: {
      type: Function,
      default: null
    },
    /**
     * Custom css class for submenu
     */
    customClass: {
      type: String,
      default: ""
    },
    clickHandler: {
      type: Function,
      default: null
    },
    /**
     * Menu label
     */
    label: {
      type: [String, Object, Function],
      default: ""
    },
    /**
     * Menu icon (for icon class)
     */
    icon: {
      type: [String, Object, Function],
      default: ""
    },
    /**
     * Custom icon library font class name.
     * 
     * Only for css font icon, If you use the svg icon, you do not need to use this.
     */
    iconFontClass: {
      type: String,
      default: "iconfont"
    },
    /**
     * Is this menu item checked?
     * 
     * The check mark are displayed on the left side of the icon, so it is not recommended to display the icon at the same time.
     */
    checked: {
      type: Boolean,
      default: !1
    },
    /**
     * Shortcut key text display on the right.
     * 
     * The shortcut keys here are only for display. You need to handle the key events by yourself.
     */
    shortcut: {
      type: String,
      default: ""
    },
    /**
     * Display icons use svg symbol (`<use xlink:href="#icon-symbol-name">`) ， only valid when icon attribute is empty.
     */
    svgIcon: {
      type: String,
      default: ""
    },
    /**
     * The user-defined attribute of the svg tag, which is valid when using `svgIcon`.
     */
    svgProps: {
      type: Object,
      default: null
    },
    /**
     * Should a fixed-width icon area be reserved for menu items without icon. (this item)
     * 
     * Default is true .
     * 
     * The width of icon area can be override with css var `--mx-menu-placeholder-width`.
     */
    preserveIconWidth: {
      type: Boolean,
      default: !0
    },
    /**
     * Show right arrow on this menu?
     */
    showRightArrow: {
      type: Boolean,
      default: !1
    },
    hasChildren: {
      type: Boolean,
      default: !1
    },
    /**
     * Should close menu when Click this menu item ?
     */
    clickClose: {
      type: Boolean,
      default: !0
    },
    /**
     * When there are subitems in this item, is it allowed to trigger its own click event? Default is false
     */
    clickableWhenHasChildren: {
      type: Boolean,
      default: !1
    },
    rawMenuItem: {
      type: Object,
      default: void 0
    }
  },
  emits: [
    "click",
    "subMenuOpen",
    "subMenuClose"
  ],
  setup(t, { expose: e, emit: o }) {
    const s = t, r = o, {
      clickHandler: n,
      clickClose: l,
      clickableWhenHasChildren: a,
      disabled: d,
      hidden: p,
      label: c,
      icon: y,
      iconFontClass: u,
      showRightArrow: f,
      shortcut: m,
      hasChildren: h
    } = kt(s), g = M(!1), v = M(!1), b = M(), _ = Ie("globalOptions"), $ = Ie("globalHasSlot"), x = Ie("globalRenderSlot"), E = Ie("globalCloseMenu"), F = Ie("menuContext"), J = te(() => typeof c.value == "string" ? c.value : typeof c.value == "function" ? _s(c.value.toString()) : "MenuItem[unknow]");
    Ge("MenuItemName", J);
    const W = {
      getSubMenuInstance: () => {
      },
      showSubMenu: () => g.value ? (F.markActiveMenuItem(W, !0), !0) : h.value ? (Z(), !0) : !1,
      hideSubMenu: () => {
        F.closeOtherSubMenu();
      },
      isDisabledOrHidden: () => d.value || p.value,
      getElement: () => b.value,
      focus: () => v.value = !0,
      blur: () => v.value = !1,
      click: U
    };
    Ge("menuItemInstance", W), St(() => {
      F.isMenuItemDataCollectedFlag() ? ie(() => {
        let Y = 0;
        const de = F.getElement();
        if (de) {
          let ae = 0;
          for (let we = 0; we < de.children.length; we++) {
            const xe = de.children[we];
            if (xe.getAttribute("data-type") === "ContextMenuItem") {
              if (xe === b.value) {
                Y = ae;
                break;
              }
              ae++;
            }
          }
        }
        F.addChildMenuItem(W, Y);
      }) : F.addChildMenuItem(W);
    }), Ct(() => {
      F.removeChildMenuItem(W);
    });
    function U(Y) {
      if (!d.value) {
        if (Y) {
          const de = Y.target;
          if (de.classList.contains("mx-context-no-clickable") || _.value.ignoreClickClassName && de.classList.contains(_.value.ignoreClickClassName))
            return;
          if (_.value.clickCloseClassName && de.classList.contains(_.value.clickCloseClassName)) {
            Y.stopPropagation(), E(s.rawMenuItem);
            return;
          }
        }
        h.value ? a.value ? (typeof n.value == "function" && n.value(Y), r("click", Y)) : g.value || Z() : (typeof n.value == "function" && n.value(Y), r("click", Y), l.value && E(s.rawMenuItem));
      }
    }
    function Z(Y) {
      v.value = !1, F.checkCloseOtherSubMenuTimeOut() || F.closeOtherSubMenu(), d.value || (F.markActiveMenuItem(W), h.value && (Y || F.markThisOpenedByKeyBoard(), F.addOpenedSubMenu(oe), g.value = !0, ie(() => r("subMenuOpen", W))));
    }
    function oe() {
      v.value = !1, g.value = !1, r("subMenuClose", W);
    }
    function q() {
      return {
        disabled: d.value,
        label: c.value,
        icon: y.value,
        iconFontClass: u.value,
        showRightArrow: f.value,
        clickClose: l.value,
        clickableWhenHasChildren: a.value,
        shortcut: m.value,
        theme: _.value.theme,
        isOpen: g,
        hasChildren: h,
        onClick: U,
        onMouseEnter: Z,
        closeMenu: E
      };
    }
    return e(W), (Y, de) => A(p) ? ue("", !0) : (P(), j("div", {
      key: 0,
      class: "mx-context-menu-item-wrapper",
      ref_key: "menuItemRef",
      ref: b,
      "data-type": "ContextMenuItem"
    }, [
      A($)("itemRender") ? (P(), ge(A(Ye), {
        key: 0,
        vnode: () => A(x)("itemRender", q())
      }, null, 8, ["vnode"])) : t.customRender ? (P(), ge(A(Ye), {
        key: 1,
        vnode: t.customRender,
        data: q()
      }, null, 8, ["vnode", "data"])) : (P(), j("div", {
        key: 2,
        class: Ee([
          "mx-context-menu-item",
          A(d) ? "disabled" : "",
          v.value ? "keyboard-focus" : "",
          t.customClass ? " " + t.customClass : "",
          g.value ? "open" : ""
        ]),
        onClick: U,
        onMouseenter: Z
      }, [
        _e(Y.$slots, "default", {}, () => [
          L("div", Ws, [
            L("div", {
              class: Ee([
                "mx-icon-placeholder",
                t.preserveIconWidth ? "preserve-width" : ""
              ])
            }, [
              _e(Y.$slots, "icon", {}, () => [
                A($)("itemIconRender") ? (P(), ge(A(Ye), {
                  key: 0,
                  vnode: () => A(x)("itemIconRender", q())
                }, null, 8, ["vnode"])) : typeof t.svgIcon == "string" && t.svgIcon ? (P(), j("svg", Dt({
                  key: 1,
                  class: "icon svg"
                }, t.svgProps), [
                  L("use", { "xlink:href": t.svgIcon }, null, 8, Ls)
                ], 16)) : typeof A(y) != "string" ? (P(), ge(A(Ye), {
                  key: 2,
                  vnode: A(y),
                  data: A(y)
                }, null, 8, ["vnode", "data"])) : typeof A(y) == "string" && A(y) !== "" ? (P(), j("i", {
                  key: 3,
                  class: Ee(A(y) + " icon " + A(u) + " " + A(_).iconFontClass)
                }, null, 2)) : ue("", !0)
              ]),
              t.checked ? _e(Y.$slots, "check", { key: 0 }, () => [
                A($)("itemCheckRender") ? (P(), ge(A(Ye), {
                  key: 0,
                  vnode: () => A(x)("itemCheckRender", q())
                }, null, 8, ["vnode"])) : ue("", !0),
                Ne(Ds)
              ]) : ue("", !0)
            ], 2),
            _e(Y.$slots, "label", {}, () => [
              A($)("itemLabelRender") ? (P(), ge(A(Ye), {
                key: 0,
                vnode: () => A(x)("itemLabelRender", q())
              }, null, 8, ["vnode"])) : typeof A(c) == "string" ? (P(), j("span", Us, Te(A(c)), 1)) : (P(), ge(A(Ye), {
                key: 2,
                vnode: A(c),
                data: A(c)
              }, null, 8, ["vnode", "data"]))
            ])
          ]),
          L("div", js, [
            A(m) || Y.$slots.shortcut ? _e(Y.$slots, "shortcut", { key: 0 }, () => [
              A($)("itemShortcutRender") ? (P(), ge(A(Ye), {
                key: 0,
                vnode: () => A(x)("itemShortcutRender", q())
              }, null, 8, ["vnode"])) : ue("", !0),
              L("span", Gs, Te(A(m)), 1)
            ]) : ue("", !0),
            A(f) ? _e(Y.$slots, "rightArrow", { key: 1 }, () => [
              A($)("itemRightArrowRender") ? (P(), ge(A(Ye), {
                key: 0,
                vnode: () => A(x)("itemRightArrowRender", q())
              }, null, 8, ["vnode"])) : ue("", !0),
              Ne(Ns)
            ]) : ue("", !0)
          ])
        ])
      ], 34)),
      _e(Y.$slots, "submenu", {
        context: W,
        show: g.value
      })
    ], 512));
  }
}), qs = He({
  name: "ContextMenuSperator",
  components: {
    VNodeRender: Ye
  },
  setup() {
    const t = Ie("globalHasSlot"), e = Ie("globalRenderSlot");
    return {
      globalHasSlot: t,
      globalRenderSlot: e
    };
  }
}), Ks = {
  key: 1,
  class: "mx-context-menu-item-sperator mx-context-no-clickable"
};
function Js(t, e, o, s, r, n) {
  const l = Wt("VNodeRender");
  return t.globalHasSlot("separatorRender") ? (P(), ge(l, {
    key: 0,
    vnode: () => t.globalRenderSlot("separatorRender", {})
  }, null, 8, ["vnode"])) : (P(), j("div", Ks));
}
const Ht = /* @__PURE__ */ fo(qs, [["render", Js]]), po = /* @__PURE__ */ He({
  __name: "ContextSubMenu",
  props: {
    /**
     * Items from options
     */
    items: {
      type: Object,
      default: null
    },
    /**
     * Show
     */
    show: {
      type: Boolean,
      default: !1
    },
    /**
     * Max height for this submenu
     */
    maxHeight: {
      type: Number,
      default: 0
    },
    /**
     * Max width for this submenu
     */
    maxWidth: {
      type: [String, Number],
      default: 0
    },
    /**
     * Min width for this submenu
     */
    minWidth: {
      type: [String, Number],
      default: 0
    },
    /**
     * Specifies should submenu adjust it position
     * when the menu exceeds the screen. The default is true
     */
    adjustPosition: {
      type: Boolean,
      default: !0
    },
    /**
     * Menu direction
     */
    direction: {
      type: String,
      default: "br"
    },
    parentMenuItemContext: {
      type: Object,
      default: null
    }
  },
  emits: ["closeAnimFinished"],
  setup(t, { expose: e, emit: o }) {
    const s = t, r = o, n = M(!1), l = Ie("globalGetMenuHostId", ""), a = Ie("menuContext"), d = Ie("globalOptions");
    Ie("globalHasSlot"), Ie("globalRenderSlot");
    const p = M("UnknowOrRoot"), c = Ie("MenuItemName", p), { zIndex: y, getParentWidth: u, getParentHeight: f, getZoom: m } = a, { adjustPosition: h } = kt(s), g = M(), v = M(), b = M(), _ = [], $ = Ie("globalSetCurrentSubMenu"), x = [];
    let E = null, F = 0;
    function J() {
      E && E.blur();
    }
    function W(z, T) {
      if (z) {
        for (let K = T !== void 0 ? T : 0; K < x.length; K++)
          if (!x[K].isDisabledOrHidden()) {
            U(K);
            break;
          }
      } else
        for (let K = T !== void 0 ? T : x.length - 1; K >= 0; K--)
          if (!x[K].isDisabledOrHidden()) {
            U(K);
            break;
          }
    }
    function U(z) {
      if (E && J(), z !== void 0 && (E = x[Math.max(0, Math.min(z, x.length - 1))]), !E)
        return;
      E.focus();
      const T = E.getElement();
      T && T.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "nearest"
      });
    }
    function Z() {
      $(oe);
    }
    const oe = {
      el: b,
      name: c,
      isTopLevel: () => a.getParentContext() === null,
      closeSelfAndActiveParent: () => {
        const z = de.getParentContext();
        if (z) {
          z.closeOtherSubMenu();
          const T = z.getSubMenuInstanceContext();
          if (T)
            return T.focusCurrentItem(), !0;
        }
        return !1;
      },
      closeCurrentSubMenu: () => {
        var z;
        return (z = de.getParentContext()) == null ? void 0 : z.closeOtherSubMenu();
      },
      moveCurrentItemFirst: () => W(!0),
      moveCurrentItemLast: () => W(!1),
      moveCurrentItemDown: () => W(!0, E ? x.indexOf(E) + 1 : 0),
      moveCurrentItemUp: () => W(!1, E ? x.indexOf(E) - 1 : 0),
      focusCurrentItem: () => U(),
      openCurrentItemSubMenu: () => E ? E == null ? void 0 : E.showSubMenu() : !1,
      triggerCurrentItemClick: (z) => E == null ? void 0 : E.click(z)
    };
    let q = !1, Y = !1;
    const de = {
      zIndex: y + 1,
      container: a.container,
      adjustPadding: d.value.adjustPadding || Ze.defaultAdjustPadding,
      getParentWidth: () => {
        var z;
        return ((z = b.value) == null ? void 0 : z.offsetWidth) || 0;
      },
      getParentHeight: () => {
        var z;
        return ((z = b.value) == null ? void 0 : z.offsetHeight) || 0;
      },
      getPositon: () => [H.value.x, H.value.y],
      getZoom: () => d.value.zoom || Ze.defaultZoom,
      addOpenedSubMenu(z) {
        _.push(z);
      },
      closeOtherSubMenu() {
        _.forEach((z) => z()), _.splice(0, _.length), $(oe);
      },
      checkCloseOtherSubMenuTimeOut() {
        return F ? (clearTimeout(F), F = 0, !0) : !1;
      },
      closeOtherSubMenuWithTimeOut() {
        F = setTimeout(() => {
          F = 0, this.closeOtherSubMenu();
        }, 200);
      },
      addChildMenuItem: (z, T) => {
        T === void 0 ? x.push(z) : x.splice(T, 0, z);
      },
      removeChildMenuItem: (z) => {
        x.splice(x.indexOf(z), 1), z.getSubMenuInstance = () => {
        };
      },
      markActiveMenuItem: (z, T = !1) => {
        J(), E = z, T && U();
      },
      markThisOpenedByKeyBoard: () => {
        q = !0;
      },
      isOpenedByKeyBoardFlag: () => q ? (q = !1, !0) : !1,
      isMenuItemDataCollectedFlag: () => Y,
      getElement: () => b.value || null,
      getParentContext: () => a,
      getSubMenuInstanceContext: () => oe
    };
    Ge("menuContext", de);
    const ae = {
      getChildItem: (z) => x[z],
      getMenuDimensions: () => v.value ? {
        width: v.value.offsetWidth,
        height: v.value.offsetHeight
      } : { width: 0, height: 0 },
      getSubmenuRoot: () => v.value,
      getMenu: () => b.value,
      getScrollValue: () => {
        var z, T;
        return ((T = (z = g.value) == null ? void 0 : z.getScrollContainer()) == null ? void 0 : T.scrollTop) || 0;
      },
      setScrollValue: (z) => {
        var T;
        return (T = g.value) == null ? void 0 : T.scrollTo(0, z);
      },
      getScrollHeight: () => xe.value,
      adjustPosition: () => {
        G();
      },
      getMaxHeight: () => Ae.value,
      getPosition: () => H.value,
      setPosition: (z, T) => {
        H.value.x = z, H.value.y = T;
      }
    }, we = Ie("menuItemInstance", void 0);
    we && (we.getSubMenuInstance = () => ae);
    const xe = M(0), Ae = M(0), ze = M(!1), H = M({ x: 0, y: 0 });
    function G() {
      ie(() => {
        const z = b.value, T = v.value;
        if (z && T && g.value) {
          const { container: K } = a, D = (u == null ? void 0 : u()) ?? 0, Fe = (f == null ? void 0 : f()) ?? 0, ye = getComputedStyle(T), pe = parseFloat(ye.paddingLeft), Pe = parseFloat(ye.paddingTop), et = Fe > 0 ? Pe : 0, ft = document.documentElement.scrollHeight / m(), Rt = document.documentElement.scrollWidth / m(), xt = Math.min(Rt, K.offsetWidth), gt = Math.min(ft, K.offsetHeight);
          let it = Mt(z, K), $e = At(z, K);
          s.direction.includes("l") ? H.value.x -= z.offsetWidth + pe : s.direction.includes("r") ? H.value.x += D + pe : (H.value.x += D / 2, H.value.x -= (z.offsetWidth + pe) / 2), s.direction.includes("t") ? H.value.y -= (z.offsetHeight + Pe * 2) / m() : s.direction.includes("b") ? H.value.y -= Pe / m() : H.value.y -= (z.offsetHeight + Pe) / 2 / m(), ie(() => {
            var tt, nt;
            it = Mt(z, K), $e = At(z, K);
            const pt = ((nt = (tt = g.value) == null ? void 0 : tt.getScrollContainer()) == null ? void 0 : nt.scrollHeight) || 0, It = s.maxHeight;
            xe.value = s.maxHeight ? Math.min(pt, s.maxHeight) : pt;
            const mt = it + z.offsetWidth - xt, ot = $e + xe.value + et * 2 - gt;
            if (ze.value = ot > 0, h.value && mt > 0) {
              const Be = D + z.offsetWidth - pe, Je = it;
              Be > Je ? H.value.x -= Je : H.value.x -= Be;
            }
            if (ze.value) {
              if (h.value) {
                const Be = ot, Je = $e;
                Be > Je ? H.value.y -= Je - et : H.value.y -= Be - et;
              }
              Ae.value = gt - (H.value.y + Pe);
            } else
              Ae.value = It || 0;
          });
        }
      });
    }
    function ce() {
      var z;
      const T = (z = s.parentMenuItemContext) == null ? void 0 : z.getElement();
      if (T) {
        const K = Mt(T, a.container), D = At(T, a.container);
        H.value.x = K, H.value.y = D;
      } else {
        const [K, D] = a.getPositon();
        H.value.x = K, H.value.y = D;
      }
      ie(() => {
        var K;
        $(oe), (K = b.value) == null || K.focus({ preventScroll: !0 }), a.isOpenedByKeyBoardFlag() && ie(() => W(!0)), Y = !0;
      }), G();
    }
    return Oe(() => s.show, (z) => {
      z && ce();
    }), St(() => {
      n.value = !0, s.show ? ce() : G();
    }), Ct(() => {
      n.value = !1, we && (we.getSubMenuInstance = () => {
      });
    }), e(ae), (z, T) => {
      const K = Wt("ContextSubMenu", !0);
      return n.value ? (P(), ge(Lt, {
        key: 0,
        to: `#${A(l)}`
      }, [
        Ne(vn, Dt({ appear: "" }, A(d).menuTransitionProps || {
          duration: 10
        }, {
          onAfterLeave: T[0] || (T[0] = (D) => r("closeAnimFinished"))
        }), {
          default: Le(() => [
            t.show ? (P(), j("div", Dt({
              key: 0,
              ref_key: "submenuRoot",
              ref: v
            }, z.$attrs, {
              class: [
                "mx-context-menu",
                A(d).customClass ? A(d).customClass : "",
                A(d).theme ?? ""
              ],
              style: {
                maxWidth: t.maxWidth ? A(Io)(t.maxWidth) : `${A(Ze).defaultMaxWidth}px`,
                minWidth: t.minWidth ? A(Io)(t.minWidth) : `${A(Ze).defaultMinWidth}px`,
                zIndex: A(y),
                left: `${H.value.x}px`,
                top: `${H.value.y}px`
              },
              "data-type": "ContextSubMenu",
              onClick: Z
            }), [
              Ne(A($s), {
                ref_key: "scrollRectRef",
                ref: g,
                scroll: "vertical",
                maxHeight: Ae.value,
                containerClass: "mx-context-menu-scroll"
              }, {
                default: Le(() => [
                  L("div", {
                    class: Ee(["mx-context-menu-items"]),
                    ref_key: "menu",
                    ref: b
                  }, [
                    _e(z.$slots, "default", {}, () => [
                      (P(!0), j(Ke, null, Qe(t.items, (D, Fe) => (P(), j(Ke, { key: Fe }, [
                        D.hidden !== !0 && D.divided === "up" ? (P(), ge(Ht, { key: 0 })) : ue("", !0),
                        D.hidden !== !0 && D.divided === "self" ? (P(), ge(Ht, { key: 1 })) : (P(), ge(go, {
                          key: 2,
                          clickHandler: D.onClick ? (ye) => D.onClick(ye) : void 0,
                          disabled: typeof D.disabled == "object" ? D.disabled.value : D.disabled,
                          hidden: typeof D.hidden == "object" ? D.hidden.value : D.hidden,
                          icon: D.icon,
                          iconFontClass: D.iconFontClass,
                          svgIcon: D.svgIcon,
                          svgProps: D.svgProps,
                          label: D.label,
                          customRender: D.customRender,
                          customClass: D.customClass,
                          checked: typeof D.checked == "object" ? D.checked.value : D.checked,
                          shortcut: D.shortcut,
                          clickClose: D.clickClose,
                          clickableWhenHasChildren: D.clickableWhenHasChildren,
                          preserveIconWidth: D.preserveIconWidth !== void 0 ? D.preserveIconWidth : A(d).preserveIconWidth,
                          showRightArrow: D.children && D.children.length > 0,
                          hasChildren: D.children && D.children.length > 0,
                          rawMenuItem: D,
                          onSubMenuOpen: (ye) => {
                            var pe;
                            return (pe = D.onSubMenuOpen) == null ? void 0 : pe.call(D, ye);
                          },
                          onSubMenuClose: (ye) => {
                            var pe;
                            return (pe = D.onSubMenuClose) == null ? void 0 : pe.call(D, ye);
                          }
                        }, Wo({ _: 2 }, [
                          D.children && D.children.length > 0 ? {
                            name: "submenu",
                            fn: Le(({ context: ye, show: pe }) => [
                              Ne(K, {
                                show: pe,
                                parentMenuItemContext: ye,
                                items: D.children,
                                maxWidth: D.maxWidth,
                                minWidth: D.minWidth,
                                maxHeight: D.maxHeight,
                                adjustPosition: D.adjustSubMenuPosition !== void 0 ? D.adjustSubMenuPosition : A(d).adjustPosition,
                                direction: D.direction !== void 0 ? D.direction : A(d).direction
                              }, null, 8, ["show", "parentMenuItemContext", "items", "maxWidth", "minWidth", "maxHeight", "adjustPosition", "direction"])
                            ]),
                            key: "0"
                          } : void 0
                        ]), 1032, ["clickHandler", "disabled", "hidden", "icon", "iconFontClass", "svgIcon", "svgProps", "label", "customRender", "customClass", "checked", "shortcut", "clickClose", "clickableWhenHasChildren", "preserveIconWidth", "showRightArrow", "hasChildren", "rawMenuItem", "onSubMenuOpen", "onSubMenuClose"])),
                        D.hidden !== !0 && (D.divided === "down" || D.divided === !0) ? (P(), ge(Ht, { key: 3 })) : ue("", !0)
                      ], 64))), 128))
                    ])
                  ], 512)
                ]),
                _: 3
              }, 8, ["maxHeight"])
            ], 16)) : ue("", !0)
          ]),
          _: 3
        }, 16)
      ], 8, ["to"])) : ue("", !0);
    };
  }
}), sn = /* @__PURE__ */ He({
  __name: "ContextSubMenuWrapper",
  props: {
    /**
     * Menu options
     */
    options: {
      type: Object,
      default: null
    },
    /**
     * Show menu?
     */
    show: {
      type: null,
      default: null
    },
    /**
     * Current container, For calculation only
     */
    container: {
      type: Object,
      default: null
    },
    /**
     * Make sure is user set the custom container.
     */
    isFullScreenContainer: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["close", "closeAnimFinished"],
  setup(t, { expose: e, emit: o }) {
    const s = t, r = o, n = Lo(), l = M(), {
      options: a,
      show: d,
      container: p
    } = kt(s);
    St(() => {
      d.value && u();
    }), Ct(() => {
      g();
    }), Oe(d, (E) => {
      E ? u() : (xo(c), g());
    });
    const c = {
      closeMenu: f,
      isClosed: m,
      getMenuRef: () => l.value,
      getMenuDimensions: () => {
        var E;
        return ((E = l.value) == null ? void 0 : E.getMenuDimensions()) ?? { width: 0, height: 0 };
      }
    };
    let y = !1;
    function u() {
      h(), ws(c);
    }
    function f(E) {
      y = !0, r("close", E), a.value.menuTransitionProps || r("closeAnimFinished"), xo(c);
    }
    function m() {
      return y;
    }
    function h() {
      setTimeout(() => {
        document.addEventListener("click", $, !0), document.addEventListener("contextmenu", $, !0), document.addEventListener("scroll", _, !0), !s.isFullScreenContainer && p.value && p.value.addEventListener("scroll", _, !0), a.value.keyboardControl !== !1 && document.addEventListener("keydown", b, !0);
      }, 50);
    }
    function g() {
      document.removeEventListener("contextmenu", $, !0), document.removeEventListener("click", $, !0), document.removeEventListener("scroll", _, !0), !s.isFullScreenContainer && p.value && p.value.removeEventListener("scroll", _, !0), a.value.keyboardControl !== !1 && document.removeEventListener("keydown", b, !0);
    }
    const v = M();
    Ge("globalSetCurrentSubMenu", (E) => v.value = E), Ge("globalGetMenuHostId", p.value.id);
    function b(E) {
      var F, J, W, U, Z, oe, q, Y, de, ae, we, xe, Ae;
      let ze = !0;
      switch (E.key) {
        case "Escape": {
          ((F = v.value) == null ? void 0 : F.isTopLevel()) === !1 ? (J = v.value) == null || J.closeCurrentSubMenu() : f();
          break;
        }
        case "ArrowDown":
          (W = v.value) == null || W.moveCurrentItemDown();
          break;
        case "ArrowUp":
          (U = v.value) == null || U.moveCurrentItemUp();
          break;
        case "Home":
          (Z = v.value) == null || Z.moveCurrentItemFirst();
          break;
        case "End":
          (oe = v.value) == null || oe.moveCurrentItemLast();
          break;
        case "ArrowLeft": {
          (q = v.value) != null && q.closeSelfAndActiveParent() || (de = (Y = a.value).onKeyFocusMoveLeft) == null || de.call(Y);
          break;
        }
        case "ArrowRight":
          (ae = v.value) != null && ae.openCurrentItemSubMenu() || (xe = (we = a.value).onKeyFocusMoveRight) == null || xe.call(we);
          break;
        case "Enter":
          (Ae = v.value) == null || Ae.triggerCurrentItemClick(E);
          break;
        default:
          ze = !1;
          break;
      }
      ze && v.value && (E.stopPropagation(), E.preventDefault());
    }
    function _(E) {
      a.value.closeWhenScroll !== !1 && x(E.target, null);
    }
    function $(E) {
      x(E.target, E);
    }
    function x(E, F) {
      for (var J, W; E; ) {
        if (E.classList && E.classList.contains("mx-context-menu"))
          return;
        E = E.parentNode;
      }
      F ? a.value.clickCloseOnOutside !== !1 ? (g(), f()) : (W = (J = a.value).onClickOnOutside) == null || W.call(J, F) : (g(), f());
    }
    return Ge("globalOptions", a), Ge("globalCloseMenu", f), Ge("globalIsFullScreenContainer", s.isFullScreenContainer), Ge("globalHasSlot", (E) => n[E] !== void 0), Ge("globalRenderSlot", (E, F) => _e(n, E, { ...F }, () => [Pt("span", "Render slot failed")], !1)), Ge("menuContext", {
      zIndex: a.value.zIndex || Ze.defaultZindex,
      container: p.value,
      adjustPadding: { x: 0, y: 0 },
      getZoom: () => a.value.zoom || Ze.defaultZoom,
      getParentWidth: () => 0,
      getParentHeight: () => 0,
      getPositon: () => [a.value.x, a.value.y],
      closeOtherSubMenuWithTimeOut: () => {
      },
      checkCloseOtherSubMenuTimeOut: () => !1,
      addOpenedSubMenu: () => {
      },
      closeOtherSubMenu: () => {
      },
      getParentContext: () => null,
      getSubMenuInstanceContext: () => null,
      getElement: () => null,
      addChildMenuItem: () => {
      },
      removeChildMenuItem: () => {
      },
      markActiveMenuItem: () => {
      },
      markThisOpenedByKeyBoard: () => {
      },
      isOpenedByKeyBoardFlag: () => !1,
      isMenuItemDataCollectedFlag: () => !1
    }), e(c), (E, F) => (P(), ge(po, {
      ref_key: "submenuInstance",
      ref: l,
      show: A(d),
      items: A(a).items,
      adjustPosition: A(a).adjustPosition,
      maxWidth: A(a).maxWidth || A(Ze).defaultMaxWidth,
      minWidth: A(a).minWidth || A(Ze).defaultMinWidth,
      maxHeight: A(a).maxHeight,
      direction: A(a).direction || A(Ze).defaultDirection,
      onCloseAnimFinished: F[0] || (F[0] = (J) => r("closeAnimFinished"))
    }, {
      default: Le(() => [
        _e(E.$slots, "default")
      ]),
      _: 3
    }, 8, ["show", "items", "adjustPosition", "maxWidth", "minWidth", "maxHeight", "direction"]));
  }
}), Xs = /* @__PURE__ */ He({
  __name: "ContextMenu",
  props: {
    /**
     * Menu options
     */
    options: {
      type: Object,
      default: null
    },
    /**
     * Show menu?
     */
    show: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["update:show", "close"],
  setup(t, { expose: e, emit: o }) {
    const s = o, r = t, { options: n, show: l } = kt(r), { isNew: a, container: d, eleId: p } = nn(n.value), c = M(null), y = Lo();
    function u(f) {
      var m, h;
      s("update:show", !1), s("close"), (h = (m = n.value).onClose) == null || h.call(m, f);
    }
    return e({
      closeMenu: () => s("update:show", !1),
      isClosed: () => !l.value,
      getMenuRef: () => {
        var f;
        return (f = c.value) == null ? void 0 : f.getMenuRef();
      },
      getMenuDimensions: () => {
        var f;
        return ((f = c.value) == null ? void 0 : f.getMenuDimensions()) ?? { width: 0, height: 0 };
      }
    }), (f, m) => (P(), ge(Lt, {
      to: `#${A(p)}`
    }, [
      Ne(sn, {
        ref_key: "menuRef",
        ref: c,
        options: A(n),
        show: A(l),
        container: A(d),
        isFullScreenContainer: !A(a),
        onClose: u
      }, Wo({ _: 2 }, [
        Qe(A(y), (h, g) => ({
          name: g,
          fn: Le((v) => [
            _e(f.$slots, g, Oo(No(v)))
          ])
        }))
      ]), 1032, ["options", "show", "container", "isFullScreenContainer"])
    ], 8, ["to"]));
  }
}), Ys = He({
  name: "ContextMenuGroup",
  props: {
    /**
    * Is this menu disabled? 
    */
    disabled: {
      type: Boolean,
      default: !1
    },
    /**
    * Is this menu hidden? 
    */
    hidden: {
      type: Boolean,
      default: !1
    },
    /**
     * Is this menu disabled? 
     */
    clickHandler: {
      type: Function,
      default: null
    },
    /**
     * Menu label
     */
    label: {
      type: String,
      default: ""
    },
    /**
     * Menu icon (for icon class)
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * Custom icon library font class name.
     * 
     * Only for css font icon, If you use the svg icon, you do not need to use this.
     */
    iconFontClass: {
      type: String,
      default: "iconfont"
    },
    /**
     * Is this menu item checked?
     * 
     * The check mark are displayed on the left side of the icon, so it is not recommended to display the icon at the same time.
     */
    checked: {
      type: Boolean,
      default: !1
    },
    /**
     * Shortcut key text display on the right.
     * 
     * The shortcut keys here are only for display. You need to handle the key events by yourself.
     */
    shortcut: {
      type: String,
      default: ""
    },
    /**
     * Display icons use svg symbol (`<use xlink:href="#icon-symbol-name">`) ， only valid when icon attribute is empty.
     */
    svgIcon: {
      type: String,
      default: ""
    },
    /**
     * The user-defined attribute of the svg tag, which is valid when using `svgIcon`.
     */
    svgProps: {
      type: Object,
      default: null
    },
    /**
     * Should a fixed-width icon area be reserved for menu items without icon. (this item)
     * 
     * Default is true .
     * 
     * The width of icon area can be override with css var `--mx-menu-placeholder-width`.
     */
    preserveIconWidth: {
      type: Boolean,
      default: !0
    },
    /**
     * Show right arrow on this menu?
     */
    showRightArrow: {
      type: Boolean,
      default: !1
    },
    /**
     * Should close menu when Click this menu item ?
     */
    clickClose: {
      type: Boolean,
      default: !0
    },
    /**
     * By default, the submenu will automatically adjust its position to prevent it overflow the container.
     * 
     * If you allow menu overflow containers, you can set this to false.
     * 
     * Default is inherit from `MenuOptions.adjustPosition`  .
     */
    adjustSubMenuPosition: {
      type: Boolean,
      default: void 0
    },
    /**
     * Max height of submenu
     */
    maxHeight: {
      type: [String, Number],
      default: 0
    },
    /**
     * Max width of submenu
     */
    maxWidth: {
      type: [String, Number],
      default: 0
    },
    /**
     * Min width of submenu
     */
    minWidth: {
      type: [String, Number],
      default: 0
    }
  },
  setup(t, e) {
    const o = Ie("globalOptions"), { adjustSubMenuPosition: s, maxWidth: r, minWidth: n, maxHeight: l } = kt(t), a = typeof s.value < "u" ? s.value : o.value.adjustPosition, d = M(), p = M();
    return e.expose({
      getSubMenuRef: () => d.value,
      getMenuItemRef: () => p.value
    }), () => Pt(go, {
      ...t,
      ref: p,
      showRightArrow: !0,
      maxWidth: void 0,
      minWidth: void 0,
      maxHeight: void 0,
      adjustSubMenuPosition: void 0,
      hasChildren: typeof e.slots.default !== void 0
    }, e.slots.default ? {
      //Create SubMenu
      submenu: (c) => Pt(po, {
        ref: d,
        show: c.show,
        maxWidth: r.value,
        minWidth: n.value,
        maxHeight: l.value,
        adjustPosition: a,
        parentMenuItemContext: c.context
      }, {
        default: e.slots.default
      }),
      //Add other slots
      ...Ss(e.slots, "default")
    } : e.slots);
  }
});
function Zs(t, e, o, s) {
  const r = M(!0), n = Pt(sn, {
    options: t,
    show: r,
    container: e,
    isFullScreenContainer: !o,
    onCloseAnimFinished: () => {
      yo(null, e);
    },
    onClose: (l) => {
      var a;
      (a = t.onClose) == null || a.call(t, l), r.value = !1;
    }
  }, s);
  return yo(n, e), n.component;
}
function Ho(t, e) {
  const o = nn(t);
  return Zs(t, o.container, o.isNew, e).exposed;
}
const rn = {
  /**
   * For Vue install
   * @param app 
   */
  install(t) {
    t.config.globalProperties.$contextmenu = Ho, t.component("ContextMenu", Xs), t.component("ContextMenuItem", go), t.component("ContextMenuGroup", Ys), t.component("ContextMenuSperator", Ht), t.component("ContextMenuSeparator", Ht), t.component("ContextSubMenu", po);
  },
  /**
   * Show a ContextMenu in page, same as `this.$contextmenu`
   * 
   * For example:
   * 
   * ```ts
   * onContextMenu(e : MouseEvent) {
   *   //prevent the browser's default menu
   *   e.preventDefault();
   *   //show your menu
   *   ContextMenu.showContextMenu({
   *     x: e.x,
   *     y: e.y,
   *     items: [
   *       { 
   *         label: "A menu item", 
   *         onClick: () => {
   *           alert("You click a menu item");
   *         }
   *       },
   *       { 
   *         label: "A submenu", 
   *         children: [
   *           { label: "Item1" },
   *           { label: "Item2" },
   *           { label: "Item3" },
   *         ]
   *       },
   *     ]
   *   }); 
   * }
   * ```
   * 
   * You can pass customSlots to custom rendering this menu.
   * 
   * For example, custom rendering #itemRender and #separatorRender:
   * ```ts
   *   ContextMenu.showContextMenu({
   *     ...
   *   } as MenuOptions, {
   *     //Use slot in function mode
   *     itemRender: ({ disabled, label, icon, showRightArrow, onClick, onMouseEnter }) => [  h('div', { 
   *       class: 'my-menu-item'+(disabled?' disabled':''),
   *       onMouseenter: onMouseEnter,
   *       onClick: onClick,
   *     }, [
   *       icon ? h('img', { src: icon }) : h('div', { class: 'icon-place-holder' }),
   *       h('span', label),
   *       showRightArrow ? h('span', { class: 'right-arraw' }, '>>') : h('div'),
   *     ]) ],
   *     separatorRender: () => [ h('div', { class: 'my-menu-sperator' }) ]
   *   })
   * ```
   * 
   * @param options The options of ContextMenu
   * @param customSlots You can provide some custom slots to customize the rendering style of the menu. These slots are the same as the slots of component ContextMenu.
   * @returns Menu instance 
   */
  showContextMenu(t, e) {
    return Ho(t, e);
  },
  /**
   * Get if there is a menu open now.
   */
  isAnyContextMenuOpen() {
    return vs();
  },
  /**
   * Close the currently open menu
   */
  closeContextMenu: on,
  //Tools
  transformMenuPosition: bs
}, Qs = ["onClick", "onContextmenu"], er = {
  key: 0,
  class: "checkbox-icon"
}, tr = {
  key: 1,
  class: "checkbox-icon"
}, or = {
  key: 1,
  class: "header-text"
}, nr = {
  key: 0,
  class: "sort-order"
}, sr = ["onMousedown"], rr = /* @__PURE__ */ He({
  __name: "DataGridHeader",
  props: {
    columns: {},
    gridTemplateColumns: {},
    gridId: {},
    isGridReady: { type: Boolean },
    isProcessing: { type: Boolean }
  },
  emits: ["sort", "resize", "hideColumn", "autoFitColumn", "showFilter"],
  setup(t, { emit: e }) {
    const o = t, s = e, r = jt(o.gridId), n = M(null), l = M(0), a = M(0), d = te(() => {
      const v = /* @__PURE__ */ new Map();
      return r.sortColumns.forEach((b, _) => {
        v.set(b.columnName, {
          direction: b.direction,
          order: _ + 1,
          isPrimary: _ === 0
        });
      }), v;
    });
    function p(v) {
      return d.value.get(v) ?? null;
    }
    function c(v, b) {
      if (b.specialType !== "Checkbox") {
        if (b.isSortable && v.shiftKey) {
          u(b, !0);
          return;
        }
        g(v, b);
      }
    }
    function y() {
      r.toggleAllCheckboxes();
    }
    function u(v, b = !1) {
      if (!v.isSortable) return;
      const _ = p(v.name);
      if (_) {
        const x = _.direction === "asc" ? "desc" : "asc";
        r.addSort(v.name, x, b);
      } else
        r.addSort(v.name, "asc", b);
      const $ = p(v.name);
      $ && s("sort", v.name, $.direction);
    }
    function f(v, b) {
      n.value = v, l.value = b.clientX, a.value = v.width, window.addEventListener("mousemove", m), window.addEventListener("mouseup", h);
    }
    function m(v) {
      if (!n.value) return;
      const b = v.clientX - l.value, _ = Math.max(
        n.value.minWidth,
        Math.min(n.value.maxWidth, a.value + b)
      );
      s("resize", n.value.name, _);
    }
    function h() {
      n.value = null, window.removeEventListener("mousemove", m), window.removeEventListener("mouseup", h);
    }
    function g(v, b) {
      if (o.isGridReady === !1) {
        console.error("[showHeaderContextMenu] Grid not ready yet");
        return;
      }
      if (!r) {
        console.error("[showHeaderContextMenu] Store not initialized yet");
        return;
      }
      if (o.isProcessing) {
        console.error("[showHeaderContextMenu] Grid is currently processing data");
        return;
      }
      const _ = [...r.sortColumns], $ = r.filterExpression, x = [];
      if (b.isSortable) {
        const E = p(b.name), F = _.length > 0;
        x.push(
          {
            label: "Sort Ascending",
            icon: "▲",
            onClick: () => {
              r.addSort(b.name, "asc", !1), s("sort", b.name, "asc");
            }
          },
          {
            label: "Sort Descending",
            icon: "▼",
            onClick: () => {
              r.addSort(b.name, "desc", !1), s("sort", b.name, "desc");
            }
          }
        ), F && x.push(
          { divided: !0 },
          {
            label: "Add to Sort (Asc)",
            icon: "▲+",
            onClick: () => {
              r.addSort(b.name, "asc", !0);
            }
          },
          {
            label: "Add to Sort (Desc)",
            icon: "▼+",
            onClick: () => {
              r.addSort(b.name, "desc", !0);
            }
          }
        ), E && x.push(
          { divided: !0 },
          {
            label: `Remove from Sort (Order ${E.order})`,
            icon: "✖",
            onClick: () => {
              const J = _.filter((W) => W.columnName !== b.name);
              r.sortColumns = J;
            }
          }
        ), F && x.push(
          {
            label: "Clear All Sorts",
            icon: "🗑",
            onClick: () => {
              r.clearSort();
            }
          }
        ), x.push({ divided: !0 });
      }
      b.isFilterable && (x.push(
        {
          label: "Filter...",
          icon: "🔍",
          onClick: () => s("showFilter", b.name)
        }
      ), $ !== null && x.push(
        {
          label: "Clear All Filters",
          icon: "🗑",
          onClick: () => {
            r.clearFilter();
          }
        }
      ), x.push({ divided: !0 })), b.specialType || x.push(
        {
          label: "Auto-fit Column",
          icon: "↔️",
          onClick: () => s("autoFitColumn", b.name)
        },
        {
          label: "Hide Column",
          icon: "👁️",
          onClick: () => s("hideColumn", b.name)
        }
      ), rn.showContextMenu({
        x: v.x,
        y: v.y,
        items: x
      });
    }
    return (v, b) => (P(), j("div", {
      class: "grid-header",
      style: We({ gridTemplateColumns: t.gridTemplateColumns })
    }, [
      (P(!0), j(Ke, null, Qe(t.columns, (_) => {
        var $, x, E, F;
        return P(), j("div", {
          key: _.name,
          class: Ee(["header-cell", { "header-cell--auto-width": _.autoWidth }]),
          onClick: (J) => c(J, _),
          onContextmenu: ct((J) => g(J, _), ["prevent"])
        }, [
          _.specialType === "Checkbox" ? (P(), j("div", {
            key: 0,
            class: Ee(["custom-checkbox", {
              "checkbox-none": A(r).checkboxState === "none",
              "checkbox-some": A(r).checkboxState === "some",
              "checkbox-all": A(r).checkboxState === "all"
            }]),
            onClick: ct(y, ["stop"]),
            title: "Toggle all checkboxes"
          }, [
            A(r).checkboxState === "all" ? (P(), j("span", er, "✓")) : A(r).checkboxState === "some" ? (P(), j("span", tr, "−")) : ue("", !0)
          ], 2)) : (P(), j("span", or, Te(_.header), 1)),
          _.isSortable && p(_.name) ? (P(), j("span", {
            key: 2,
            class: Ee(["sort-icon", ($ = p(_.name)) != null && $.isPrimary ? "sort-icon--primary" : "sort-icon--secondary"])
          }, [
            wt(Te(((x = p(_.name)) == null ? void 0 : x.direction) === "asc" ? "▲" : "▼") + " ", 1),
            (E = p(_.name)) != null && E.order && p(_.name).order > 1 ? (P(), j("span", nr, Te((F = p(_.name)) == null ? void 0 : F.order), 1)) : ue("", !0)
          ], 2)) : ue("", !0),
          L("div", {
            class: "resize-grip",
            onMousedown: ct((J) => f(_, J), ["stop"])
          }, null, 40, sr)
        ], 42, Qs);
      }), 128))
    ], 4));
  }
}), rt = (t, e) => {
  const o = t.__vccOpts || t;
  for (const [s, r] of e)
    o[s] = r;
  return o;
}, ir = /* @__PURE__ */ rt(rr, [["__scopeId", "data-v-baf5d093"]]), lr = ["innerHTML"], ar = /* @__PURE__ */ He({
  __name: "DataGridCell",
  props: {
    cell: {},
    column: {},
    isSelected: { type: Boolean },
    gridId: {}
  },
  emits: ["editComplete", "cellInput", "copy", "cut", "paste", "delete", "insertAbove", "insertBelow"],
  setup(t, { emit: e }) {
    const o = t, s = e, r = jt(o.gridId), { isAutoRowHeightEnabled: n } = Cn(r), l = Ie("validation", null), a = (l == null ? void 0 : l.validateCellThrottled) || (() => {
    }), d = (l == null ? void 0 : l.validationErrors) || {}, p = M(), c = M(), y = M(!1), u = M(o.cell.value), f = M(null), m = M(!1), h = M(null), g = M(!1), v = te(() => o.cell.value == null ? "" : String(o.cell.value)), b = te(() => v.value.includes(`
`)), _ = te(() => {
      const H = v.value, G = r.searchQuery;
      if (!G || !H)
        return $(H);
      try {
        const ce = G.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), z = new RegExp(`(${ce})`, "gi");
        return $(H).replace(
          z,
          '<mark class="search-highlight">$1</mark>'
        );
      } catch {
        return $(H);
      }
    });
    function $(H) {
      const G = document.createElement("div");
      return G.textContent = H, G.innerHTML;
    }
    const x = te(() => (d[o.cell.rowId] || []).find((G) => G.columnName === o.cell.columnName)), E = te(() => {
      var H, G, ce, z;
      return {
        "cell--selected": o.isSelected,
        "cell--editing": y.value,
        "cell--validation-error": ((H = x.value) == null ? void 0 : H.severity) === "Error" || ((G = x.value) == null ? void 0 : G.severity) === "Critical",
        "cell--validation-warning": ((ce = x.value) == null ? void 0 : ce.severity) === "Warning" || ((z = x.value) == null ? void 0 : z.severity) === "Info",
        "cell--readonly": o.column.isReadOnly,
        "cell--auto-height": n.value,
        // Special case: has newlines but AutoRowHeight is OFF - still wrap by newlines only
        "cell--has-newlines": b.value && !n.value
      };
    }), F = te(() => ({}));
    function J(H) {
      if (H.button !== 0) return;
      const G = H.ctrlKey;
      console.log("[DataGridCell] MouseDown:", { rowId: o.cell.rowId, columnName: o.cell.columnName, isEditing: y.value }), r.selectCell(o.cell.rowId, o.cell.columnName, G);
    }
    function W(H) {
      if (m.value = !0, p.value) {
        const ce = p.value.getBoundingClientRect();
        h.value = {
          left: ce.left,
          top: ce.top - 4
          // 4px above the cell
        };
      }
      if (H.ctrlKey || r.wasCtrlPressed)
        return;
      const G = H.buttons === 1;
      if (r.pressedCell && !r.isDragging && G) {
        if (o.cell.rowId === r.pressedCell.rowId && o.cell.columnName === r.pressedCell.columnName)
          return;
        r.startDragSelection(o.cell.rowId, o.cell.columnName);
      } else r.isDragging && G && r.expandDragSelection(o.cell.rowId, o.cell.columnName);
    }
    function U() {
      m.value = !1, h.value = null;
    }
    function Z(H) {
      !y.value && o.isSelected && H.key === "Enter" && !o.column.isReadOnly && (H.preventDefault(), oe());
    }
    async function oe() {
      var H, G;
      o.column.isReadOnly || (console.log("[DataGridCell] enterEditMode:", {
        rowId: o.cell.rowId,
        columnName: o.cell.columnName,
        currentCellValue: o.cell.value,
        storingAsOriginal: o.cell.value
      }), f.value = o.cell.value, y.value = !0, u.value = o.cell.value, await ie(), (H = c.value) == null || H.focus(), (G = c.value) == null || G.select());
    }
    async function q() {
      console.log("[DataGridCell] handleDoubleClick:", {
        rowId: o.cell.rowId,
        columnName: o.cell.columnName,
        currentValue: o.cell.value
      }), oe();
    }
    function Y() {
      const H = r.rows.find((G) => G.rowId === o.cell.rowId);
      if (H)
        return H.cells.map((G) => ({ columnName: G.columnName, value: G.value }));
    }
    function de() {
      if (console.log("[DataGridCell] handleInput:", {
        rowId: o.cell.rowId,
        columnName: o.cell.columnName,
        newValue: u.value,
        autoValidate: r.config.autoValidate
      }), r.config.autoValidate && r.config.enableValidation) {
        const H = Y();
        a(o.cell.rowId, o.cell.columnName, u.value, H);
      }
      s("cellInput", o.cell.rowId, o.cell.columnName, u.value);
    }
    function ae() {
      if (console.log("[DataGridCell] confirmEdit:", {
        rowId: o.cell.rowId,
        columnName: o.cell.columnName,
        confirmedValue: u.value,
        originalWas: f.value
      }), g.value = !0, r.config.autoValidate && r.config.enableValidation) {
        const H = Y();
        a(o.cell.rowId, o.cell.columnName, u.value, H);
      }
      s("editComplete", o.cell.rowId, o.cell.columnName, u.value), y.value = !1, f.value = null, ie(() => {
        try {
          console.log(`[DataGridCell] confirmEdit - Attempting to restore focus to cell: rowId=${o.cell.rowId}, column=${o.cell.columnName}`), p.value ? (p.value.focus(), console.log("[DataGridCell] confirmEdit - Focus restored successfully")) : console.log("[DataGridCell] confirmEdit - WARNING: cellRef.value is null/undefined");
        } catch (H) {
          console.log(`[DataGridCell] confirmEdit - ERROR restoring focus: ${H}`);
        }
      }), setTimeout(() => {
        g.value = !1;
      }, 100);
    }
    function we(H) {
      if (console.log("[DataGridCell] handleKeyDown:", {
        rowId: o.cell.rowId,
        columnName: o.cell.columnName,
        key: H.key,
        shift: H.shiftKey,
        ctrl: H.ctrlKey
      }), H.key === "Escape") {
        H.preventDefault(), H.stopPropagation(), xe();
        return;
      }
      if (H.key === "Enter" && !H.shiftKey) {
        H.preventDefault(), H.stopPropagation(), ae();
        return;
      }
      if (H.key === "Tab") {
        H.preventDefault();
        const G = H.target, ce = G.selectionStart, z = G.selectionEnd;
        u.value = u.value.substring(0, ce) + "	" + u.value.substring(z), ie(() => {
          G.selectionStart = G.selectionEnd = ce + 1;
        });
      }
    }
    function xe() {
      if (console.log("[DataGridCell] cancelEdit:", {
        rowId: o.cell.rowId,
        columnName: o.cell.columnName,
        originalValue: f.value,
        currentEditValue: u.value
      }), u.value = f.value, y.value = !1, s("editComplete", o.cell.rowId, o.cell.columnName, f.value), r.config.autoValidate && r.config.enableValidation) {
        const H = Y();
        a(o.cell.rowId, o.cell.columnName, f.value, H);
      }
      f.value = null, ie(() => {
        try {
          console.log(`[DataGridCell] cancelEdit - Attempting to restore focus to cell: rowId=${o.cell.rowId}, column=${o.cell.columnName}`), p.value ? (p.value.focus(), console.log("[DataGridCell] cancelEdit - Focus restored successfully")) : console.log("[DataGridCell] cancelEdit - WARNING: cellRef.value is null/undefined");
        } catch (H) {
          console.log(`[DataGridCell] cancelEdit - ERROR restoring focus: ${H}`);
        }
      });
    }
    function Ae() {
      console.log("[DataGridCell] handleBlur:", {
        rowId: o.cell.rowId,
        columnName: o.cell.columnName,
        isEditing: y.value,
        isConfirming: g.value
      }), y.value && !g.value && xe();
    }
    function ze(H) {
      if (!H.ctrlKey)
        return;
      H.preventDefault();
      const G = /* @__PURE__ */ new Map();
      r.selectedCells.forEach((ye) => {
        const [pe] = ye.split(":"), Pe = r.rows.find((et) => et.rowId === pe);
        Pe && G.set(pe, Pe.rowIndex);
      });
      const ce = G.size, z = Array.from(G.values()), T = z.length > 0 ? Math.min(...z) : 0, K = z.length > 0 ? Math.max(...z) : 0, D = r.rows.find((ye) => ye.rowIndex === T), Fe = r.rows.find((ye) => ye.rowIndex === K);
      rn.showContextMenu({
        x: H.x,
        y: H.y,
        items: [
          {
            label: "Copy",
            icon: "📋",
            onClick: () => s("copy"),
            disabled: !o.isSelected
          },
          {
            label: "Cut",
            icon: "✂️",
            onClick: () => s("cut"),
            disabled: !o.isSelected || o.column.isReadOnly
          },
          {
            label: "Paste",
            icon: "📄",
            onClick: () => s("paste"),
            disabled: o.column.isReadOnly
          },
          { divided: !0 },
          {
            label: "Delete",
            icon: "🗑️",
            onClick: () => s("delete"),
            disabled: !o.isSelected || o.column.isReadOnly
          },
          { divided: !0 },
          {
            label: `Insert ${ce} row(s) above`,
            icon: "⬆️",
            // Insert above the MINIMUM selected row index
            onClick: () => s("insertAbove", (D == null ? void 0 : D.rowId) || o.cell.rowId, ce || 1),
            disabled: o.column.isReadOnly
          },
          {
            label: `Insert ${ce} row(s) below`,
            icon: "⬇️",
            // Insert below the MAXIMUM selected row index
            onClick: () => s("insertBelow", (Fe == null ? void 0 : Fe.rowId) || o.cell.rowId, ce || 1),
            disabled: o.column.isReadOnly
          }
        ]
      });
    }
    return (H, G) => (P(), j("div", {
      ref_key: "cellRef",
      ref: p,
      class: Ee(["grid-cell", E.value]),
      style: We(F.value),
      onMousedown: J,
      onMouseenter: W,
      onMouseleave: U,
      onDblclick: q,
      onKeydown: Z,
      onContextmenu: ze,
      tabindex: "0"
    }, [
      y.value ? at((P(), j("textarea", {
        key: 1,
        ref_key: "inputRef",
        ref: c,
        "onUpdate:modelValue": G[0] || (G[0] = (ce) => u.value = ce),
        class: "cell-input",
        onInput: de,
        onBlur: Ae,
        onKeydown: we
      }, null, 544)), [
        [no, u.value]
      ]) : (P(), j("div", {
        key: 0,
        class: "cell-text",
        innerHTML: _.value
      }, null, 8, lr)),
      (P(), ge(Lt, { to: "body" }, [
        x.value && (m.value || t.isSelected) && h.value ? (P(), j("div", {
          key: 0,
          class: Ee(["validation-tooltip", {
            "validation-tooltip--error": x.value.severity === "Error" || x.value.severity === "Critical",
            "validation-tooltip--warning": x.value.severity === "Warning" || x.value.severity === "Info"
          }]),
          style: We({
            position: "fixed",
            left: h.value.left + "px",
            top: h.value.top + "px"
          })
        }, Te(x.value.message), 7)) : ue("", !0)
      ]))
    ], 38));
  }
}), cr = /* @__PURE__ */ rt(ar, [["__scopeId", "data-v-ee25e5d3"]]), ur = {
  key: 0,
  class: "row-number"
}, dr = ["checked"], hr = ["title"], fr = { class: "validation-message" }, gr = ["disabled"], pr = 300, mr = /* @__PURE__ */ He({
  __name: "SpecialColumnCell",
  props: {
    specialType: {},
    rowId: {},
    rowIndex: {},
    column: {},
    isChecked: { type: Boolean }
  },
  emits: ["checkboxChange", "deleteRow", "insertRow"],
  setup(t, { emit: e }) {
    const o = t, s = e;
    Oe(() => o.isChecked, (b, _) => {
      o.specialType === "Checkbox" && console.log("[SpecialColumnCell] isChecked prop changed:", { rowId: o.rowId, newVal: b, oldVal: _ });
    }, { immediate: !0 });
    const r = Ie("validation", null), n = (r == null ? void 0 : r.validationErrors) || {}, l = M(!1), a = M(0), d = te(() => o.rowIndex + 1), p = te(() => n[o.rowId] || []), c = te(() => p.value.some((b) => b.severity === "Error" || b.severity === "Critical")), y = te(() => p.value.some((b) => b.severity === "Warning")), u = te(() => {
      const b = p.value;
      return b.length === 0 ? "" : b.map((_) => `${_.columnName}: ${_.message}`).join("; ");
    }), f = te(() => ({
      "special-cell--row-number": o.specialType === "RowNumber",
      "special-cell--checkbox": o.specialType === "Checkbox",
      "special-cell--validation": o.specialType === "ValidationAlerts",
      "special-cell--delete": o.specialType === "DeleteRow",
      "special-cell--insert": o.specialType === "InsertRow"
    })), m = te(() => ({}));
    function h(b) {
      const _ = b.target;
      console.log("[SpecialColumnCell] Checkbox change:", { rowId: o.rowId, checked: _.checked, currentProp: o.isChecked }), s("checkboxChange", o.rowId, _.checked);
    }
    function g() {
      const b = Date.now();
      b - a.value < pr || (a.value = b, confirm("Are you sure you want to delete this row?") && (l.value = !0, s("deleteRow", o.rowId), setTimeout(() => {
        l.value = !1;
      }, 1e3)));
    }
    function v() {
      s("insertRow", o.rowId);
    }
    return (b, _) => (P(), j("div", {
      class: Ee(["special-cell", f.value]),
      style: We(m.value),
      onMousedown: _[0] || (_[0] = ct(() => {
      }, ["stop"])),
      onMouseenter: _[1] || (_[1] = ct(() => {
      }, ["stop"]))
    }, [
      t.specialType === "RowNumber" ? (P(), j("span", ur, Te(d.value), 1)) : t.specialType === "Checkbox" ? (P(), j("input", {
        key: 1,
        type: "checkbox",
        class: "checkbox-input",
        checked: t.isChecked,
        onChange: h
      }, null, 40, dr)) : t.specialType === "ValidationAlerts" ? (P(), j("div", {
        key: 2,
        class: Ee(["validation-alerts", { "has-errors": c.value || y.value }]),
        title: u.value
      }, [
        L("span", fr, Te(u.value), 1)
      ], 10, hr)) : t.specialType === "DeleteRow" ? (P(), j("button", {
        key: 3,
        class: "delete-button",
        disabled: l.value,
        onClick: g,
        title: "Delete row"
      }, " 🗑️ ", 8, gr)) : t.specialType === "InsertRow" ? (P(), j("button", {
        key: 4,
        class: "insert-button",
        onClick: v,
        title: "Insert new row"
      }, " ➕ ")) : ue("", !0)
    ], 38));
  }
}), vr = /* @__PURE__ */ rt(mr, [["__scopeId", "data-v-05f3e471"]]), wr = /* @__PURE__ */ He({
  __name: "DataGridRow",
  props: {
    row: {},
    columns: {},
    gridTemplateColumns: {},
    gridId: {}
  },
  emits: ["cellEditComplete", "cellInput", "checkboxChange", "deleteRow", "insertRow", "insertAbove", "insertBelow"],
  setup(t, { emit: e }) {
    const o = t, s = e, r = jt(o.gridId), n = te(() => {
      const m = r.isRowChecked(o.row.rowId);
      return console.log("[DataGridRow] Row checked state:", { rowId: o.row.rowId, checked: m }), m;
    });
    function l(m) {
      const h = o.row.cells.find((g) => g.columnName === m);
      return h || {
        rowId: o.row.rowId,
        columnName: m,
        value: null,
        isSelected: !1,
        isValidationError: !1
      };
    }
    function a(m, h, g) {
      s("cellEditComplete", m, h, g);
    }
    function d(m, h, g) {
      s("cellInput", m, h, g);
    }
    function p(m, h) {
      s("checkboxChange", m, h);
    }
    function c(m) {
      s("deleteRow", m);
    }
    function y(m) {
      s("insertRow", m);
    }
    function u(m, h) {
      s("insertAbove", m, h);
    }
    function f(m, h) {
      s("insertBelow", m, h);
    }
    return (m, h) => (P(), j("div", {
      class: "grid-row",
      style: We({ height: t.row.height + "px", gridTemplateColumns: t.gridTemplateColumns })
    }, [
      (P(!0), j(Ke, null, Qe(t.columns, (g) => (P(), j(Ke, {
        key: `${t.row.rowId}:${g.name}`
      }, [
        g.specialType ? (P(), ge(vr, {
          key: 0,
          "special-type": g.specialType,
          "row-id": t.row.rowId,
          "row-index": t.row.rowIndex,
          column: g,
          "is-checked": g.specialType === "Checkbox" ? n.value : void 0,
          onCheckboxChange: p,
          onDeleteRow: c,
          onInsertRow: y
        }, null, 8, ["special-type", "row-id", "row-index", "column", "is-checked"])) : (P(), ge(cr, {
          key: 1,
          cell: l(g.name),
          column: g,
          "is-selected": A(r).isCellSelected(t.row.rowId, g.name),
          "grid-id": t.gridId,
          onEditComplete: a,
          onCellInput: d,
          onInsertAbove: u,
          onInsertBelow: f
        }, null, 8, ["cell", "column", "is-selected", "grid-id"]))
      ], 64))), 128))
    ], 4));
  }
}), br = /* @__PURE__ */ rt(wr, [["__scopeId", "data-v-82316d34"]]), yr = { class: "pagination" }, Cr = ["disabled"], _r = ["disabled"], Sr = { class: "page-numbers" }, kr = ["onClick"], Rr = ["disabled"], xr = ["disabled"], Ir = { class: "page-info" }, Er = ["value"], $r = ["value"], Tr = /* @__PURE__ */ He({
  __name: "PaginationControl",
  props: {
    currentPage: {},
    pageSize: {},
    totalRows: {},
    pageSizeOptions: { default: () => [50, 100, 200, 500] }
  },
  emits: ["pageChange", "pageSizeChange"],
  setup(t, { emit: e }) {
    const o = t, s = e, r = te(() => {
      const d = [...o.pageSizeOptions];
      return d.includes(o.pageSize) || d.push(o.pageSize), d.sort((p, c) => p - c);
    }), n = te(() => Math.ceil(o.totalRows / o.pageSize)), l = te(() => {
      const d = n.value, p = o.currentPage, c = 20;
      if (d <= c) {
        const f = [];
        for (let m = 1; m <= d; m++)
          f.push(m);
        return f;
      }
      const y = Math.ceil(d / c), u = /* @__PURE__ */ new Set();
      u.add(1), u.add(d), u.add(p), p > 1 && u.add(p - 1), p < d && u.add(p + 1);
      for (let f = 1; f <= d; f += y)
        u.add(f);
      return Array.from(u).sort((f, m) => f - m);
    });
    function a(d) {
      const p = d.target;
      s("pageSizeChange", Number(p.value));
    }
    return (d, p) => (P(), j("div", yr, [
      L("button", {
        onClick: p[0] || (p[0] = (c) => s("pageChange", 1)),
        disabled: t.currentPage === 1
      }, " First ", 8, Cr),
      L("button", {
        onClick: p[1] || (p[1] = (c) => s("pageChange", t.currentPage - 1)),
        disabled: t.currentPage === 1
      }, " Previous ", 8, _r),
      L("div", Sr, [
        (P(!0), j(Ke, null, Qe(l.value, (c) => (P(), j("button", {
          key: c,
          class: Ee({ "page-number": !0, active: c === t.currentPage }),
          onClick: (y) => s("pageChange", c)
        }, Te(c), 11, kr))), 128))
      ]),
      L("button", {
        onClick: p[2] || (p[2] = (c) => s("pageChange", t.currentPage + 1)),
        disabled: t.currentPage === n.value
      }, " Next ", 8, Rr),
      L("button", {
        onClick: p[3] || (p[3] = (c) => s("pageChange", n.value)),
        disabled: t.currentPage === n.value
      }, " Last ", 8, xr),
      L("span", Ir, " (" + Te(t.totalRows) + " rows) ", 1),
      L("select", {
        value: t.pageSize,
        onChange: a
      }, [
        (P(!0), j(Ke, null, Qe(r.value, (c) => (P(), j("option", {
          key: c,
          value: c
        }, Te(c), 9, $r))), 128))
      ], 40, Er)
    ]));
  }
}), Ar = /* @__PURE__ */ rt(Tr, [["__scopeId", "data-v-d81ea122"]]), Mr = { class: "filter-header" }, Hr = { class: "filter-title" }, Pr = { class: "filter-mode" }, Dr = {
  key: 0,
  class: "filter-content"
}, zr = { class: "filter-values" }, Fr = ["onUpdate:modelValue"], Br = { class: "value-text" }, Vr = {
  key: 0,
  class: "no-values"
}, Or = {
  key: 1,
  class: "filter-content"
}, Nr = { class: "regex-label" }, Wr = /* @__PURE__ */ He({
  __name: "FilterFlyout",
  props: {
    visible: { type: Boolean },
    columnName: {},
    position: {},
    uniqueValues: {},
    currentMode: {},
    currentPattern: {}
  },
  emits: ["close", "applyCheckbox", "applyRegex", "clearFilter"],
  setup(t, { emit: e }) {
    const o = t, s = e, r = M(o.currentMode || "checkbox"), n = M(""), l = M(o.currentPattern || ""), a = M([]);
    Oe(() => o.uniqueValues, (h) => {
      a.value = h.map((g) => ({ ...g }));
    }, { immediate: !0, deep: !0 }), Oe(() => o.currentPattern, (h) => {
      h && (l.value = h);
    }, { immediate: !0 });
    const d = te(() => {
      if (!n.value)
        return a.value;
      const h = n.value.toLowerCase();
      return a.value.filter(
        (g) => g.value.toLowerCase().includes(h)
      );
    }), p = (h) => h.count > 0 ? `${h.value} (${h.count})` : h.value;
    function c() {
      d.value.forEach((h) => {
        h.isSelected = !0;
      });
    }
    function y() {
      d.value.forEach((h) => {
        h.isSelected = !1;
      });
    }
    function u() {
      if (r.value === "checkbox") {
        const h = a.value.filter((g) => g.isSelected).map((g) => g.value);
        s("applyCheckbox", h);
      } else
        s("applyRegex", l.value);
      m();
    }
    function f() {
      s("clearFilter"), m();
    }
    function m() {
      s("close");
    }
    return (h, g) => (P(), ge(Lt, { to: "body" }, [
      t.visible ? (P(), j("div", {
        key: 0,
        class: "filter-flyout-overlay",
        onClick: ct(m, ["self"])
      }, [
        L("div", {
          class: "filter-flyout",
          style: We({ top: t.position.y + "px", left: t.position.x + "px" })
        }, [
          L("div", Mr, [
            L("h3", Hr, "Filter: " + Te(t.columnName), 1),
            L("button", {
              class: "close-button",
              onClick: m
            }, "✕")
          ]),
          L("div", Pr, [
            L("label", null, [
              at(L("input", {
                type: "radio",
                value: "checkbox",
                "onUpdate:modelValue": g[0] || (g[0] = (v) => r.value = v),
                name: "filterMode"
              }, null, 512), [
                [Co, r.value]
              ]),
              g[4] || (g[4] = L("span", null, "Checkbox", -1))
            ]),
            L("label", null, [
              at(L("input", {
                type: "radio",
                value: "regex",
                "onUpdate:modelValue": g[1] || (g[1] = (v) => r.value = v),
                name: "filterMode"
              }, null, 512), [
                [Co, r.value]
              ]),
              g[5] || (g[5] = L("span", null, "Regex", -1))
            ])
          ]),
          r.value === "checkbox" ? (P(), j("div", Dr, [
            at(L("input", {
              "onUpdate:modelValue": g[2] || (g[2] = (v) => n.value = v),
              type: "text",
              class: "filter-search",
              placeholder: "Search values..."
            }, null, 512), [
              [no, n.value]
            ]),
            L("div", { class: "filter-actions" }, [
              L("button", {
                class: "action-button",
                onClick: c
              }, "Select All"),
              L("button", {
                class: "action-button",
                onClick: y
              }, "Deselect All")
            ]),
            L("div", zr, [
              (P(!0), j(Ke, null, Qe(d.value, (v) => (P(), j("label", {
                key: v.value,
                class: Ee(["value-item", { "value-item--selected": v.isSelected }])
              }, [
                at(L("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": (b) => v.isSelected = b,
                  class: "value-checkbox"
                }, null, 8, Fr), [
                  [wn, v.isSelected]
                ]),
                L("span", Br, Te(v.displayText || p(v)), 1)
              ], 2))), 128)),
              d.value.length === 0 ? (P(), j("div", Vr, " No values found ")) : ue("", !0)
            ])
          ])) : (P(), j("div", Or, [
            L("label", Nr, [
              g[6] || (g[6] = L("span", null, "Regex Pattern:", -1)),
              at(L("input", {
                "onUpdate:modelValue": g[3] || (g[3] = (v) => l.value = v),
                type: "text",
                class: "regex-input",
                placeholder: "^test.*|.*example$"
              }, null, 512), [
                [no, l.value]
              ])
            ]),
            g[7] || (g[7] = L("div", { class: "regex-help" }, [
              L("details", null, [
                L("summary", null, "Regex Examples"),
                L("ul", null, [
                  L("li", null, [
                    L("code", null, "^test"),
                    wt(' - Starts with "test"')
                  ]),
                  L("li", null, [
                    L("code", null, "example$"),
                    wt(' - Ends with "example"')
                  ]),
                  L("li", null, [
                    L("code", null, "^test.*example$"),
                    wt(' - Starts with "test" and ends with "example"')
                  ]),
                  L("li", null, [
                    L("code", null, "test|example"),
                    wt(' - Contains "test" OR "example"')
                  ]),
                  L("li", null, [
                    L("code", null, "\\d{3}"),
                    wt(" - Contains exactly 3 digits")
                  ])
                ])
              ])
            ], -1))
          ])),
          L("div", { class: "filter-footer" }, [
            L("button", {
              class: "footer-button footer-button--apply",
              onClick: u
            }, " Apply Filter "),
            L("button", {
              class: "footer-button footer-button--clear",
              onClick: f
            }, " Clear Filter "),
            L("button", {
              class: "footer-button footer-button--cancel",
              onClick: m
            }, " Cancel ")
          ])
        ], 4)
      ])) : ue("", !0)
    ]));
  }
}), Lr = /* @__PURE__ */ rt(Wr, [["__scopeId", "data-v-459a16a1"]]), Ur = {
  key: 0,
  class: "processing-overlay"
}, jr = { class: "processing-content" }, Gr = { class: "processing-text" }, qr = {
  key: 1,
  class: "hidden-columns-panel"
}, Kr = ["onClick", "title"], Jr = { class: "grid-container" }, Xr = /* @__PURE__ */ He({
  __name: "DataGrid",
  props: {
    config: {},
    columns: {},
    gridId: {},
    theme: {},
    minTableWidth: {},
    width: {},
    height: {},
    autoRowHeightEnabled: { type: Boolean }
  },
  setup(t, { expose: e }) {
    var Ve;
    const o = t, s = o.gridId || `grid-${Math.random().toString(36).substr(2, 9)}`, r = ds(`DataGrid[${s}]`);
    r.info("⚙️ Component initializing", {
      gridId: s,
      hasConfig: !!o.config,
      hasColumns: !!o.columns,
      columnCount: ((Ve = o.columns) == null ? void 0 : Ve.length) || 0
    });
    const n = jt(s);
    r.debug("📦 Store created", { instanceId: s }), o.autoRowHeightEnabled !== void 0 && (n.setAutoRowHeightEnabled(o.autoRowHeightEnabled), r.info(`🔧 AutoRowHeight initialized to: ${o.autoRowHeightEnabled}`));
    const l = es();
    Ge("validation", l);
    const a = ts(), { filterRows: d, evaluateFilter: p } = Yo(), c = M(!1), y = M(!1), u = M(800), f = te(() => {
      const i = Math.max(32, Math.floor(u.value * 0.7));
      return console.log(`[AutoRowHeight] Computed maxHeight: ${i}px (container: ${u.value}px)`), i;
    }), m = ns({
      minHeight: 32,
      maxHeight: f.value,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: 14,
      enableWrapping: !0,
      padding: 16
    });
    Oe(f, async (i) => {
      console.log(`[AutoRowHeight] maxHeight changed to: ${i}px`), m.updateMaxHeight(i), n.isAutoRowHeightEnabled && n.rows.length > 0 && (console.log("[AutoRowHeight] maxHeight changed - recalculating all row heights..."), await S());
    });
    const h = () => {
      if (!_.value) {
        console.log("[AutoRowHeight] Cannot measure: scrollerRef is null");
        return;
      }
      if (!_.value.$el) {
        console.log("[AutoRowHeight] Cannot measure: scrollerRef.$el is undefined");
        return;
      }
      const i = _.value.$el.clientHeight;
      i > 0 ? (u.value = i, console.log(`[AutoRowHeight] Container height measured: ${i}px`)) : console.log("[AutoRowHeight] Container height is 0, keeping default");
    };
    St(async () => {
      if (r.info("========== ✅ Component mounted - START initialization ==========", {
        gridId: o.gridId,
        autoRowHeight: n.isAutoRowHeightEnabled,
        rowCount: n.rows.length,
        columnCount: n.columns.length
      }), document.addEventListener("mouseup", xe), document.addEventListener("keydown", Y), r.debug("🎯 Event listeners registered (mouseup, keydown)"), o.columns && o.columns.length > 0 && n.rows.length === 0) {
        r.info("🔧 Auto-initializing empty rows from provided columns", {
          columnCount: o.columns.length
        });
        try {
          n.setColumns(o.columns), n.initializeEmptyRows(), r.info(`✅ Auto-initialized ${n.rows.length} empty rows`);
        } catch (i) {
          r.error("❌ Failed to set columns:", i), alert(`Column configuration error: ${i instanceof Error ? i.message : "Unknown error"}`);
        }
      }
      if (X(), await ie(), r.debug("⏰ DOM ready after nextTick"), h(), n.isAutoRowHeightEnabled && n.rows.length > 0) {
        r.info("📏 AutoRowHeight enabled - applying heights..."), await ie();
        try {
          await S(), r.info("✅ AutoRowHeight applied successfully on mount");
        } catch (i) {
          r.error("❌ AutoRowHeight ERROR on mount:", i);
        }
      } else
        r.debug(`⏭️ Skipping AutoRowHeight: enabled=${n.isAutoRowHeightEnabled}, rowCount=${n.rows.length}`);
      window.addEventListener("resize", h), r.debug("🎯 Resize listener registered"), await ie(), c.value = !0, r.info("========== ✅ Grid marked as READY for user interaction ==========");
    }), Ct(() => {
      window.removeEventListener("resize", h), document.removeEventListener("mouseup", xe), document.removeEventListener("keydown", Y), r.info("🧹 Cleanup: All event listeners removed");
    });
    const g = M(!1), v = M(!1), b = M(!1), _ = M(), $ = () => {
      const i = Array.from(n.selectedCells);
      if (i.length === 0) return [];
      const w = new Set(i.map((C) => C.split(":")[0]));
      return n.rows.filter((C) => w.has(C.rowId));
    }, x = () => q.value.filter((i) => !i.specialType).map((i) => i.name), E = async () => {
      const i = $();
      if (i.length === 0) {
        console.warn("No rows selected for copy");
        return;
      }
      const w = x(), C = await a.copyToClipboard(i, w, { includeHeaders: !0 });
      C.success ? console.log(C.message) : console.error(C.message);
    }, F = async () => {
      const i = await a.pasteFromClipboard();
      if (i.success && i.rows && i.rows.length > 0) {
        const w = Array.from(n.selectedCells);
        let C = n.rows.length;
        if (w.length > 0) {
          const I = w[0].split(":")[0], V = n.rows.findIndex((re) => re.rowId === I);
          V >= 0 && (C = V);
        }
        i.rows.forEach((k, I) => {
          var V;
          if (C + I < n.rows.length) {
            const re = n.rows[C + I];
            Object.keys(k).forEach((ee) => {
              q.value.some((se) => se.name === ee) && n.updateCell(re.rowId, ee, k[ee]);
            });
          } else {
            const re = (V = n.rows[n.rows.length - 1]) == null ? void 0 : V.rowId;
            if (re) {
              n.insertRow(re);
              const ee = n.rows[n.rows.length - 1];
              Object.keys(k).forEach((se) => {
                q.value.some((me) => me.name === se) && n.updateCell(ee.rowId, se, k[se]);
              });
            }
          }
        }), console.log(i.message);
      } else
        console.error(i.message);
    }, J = async () => {
      await E(), Array.from(n.selectedCells).forEach((w) => {
        var I;
        const [C, k] = w.split(":");
        (I = q.value.find((V) => V.name === k)) != null && I.isReadOnly || n.updateCell(C, k, null);
      });
    }, W = () => {
      Array.from(n.selectedCells).forEach((w) => {
        var I;
        const [C, k] = w.split(":");
        (I = q.value.find((V) => V.name === k)) != null && I.isReadOnly || n.updateCell(C, k, null);
      });
    }, U = () => {
      n.rows.forEach((i) => {
        q.value.forEach((w) => {
          w.specialType || n.selectCell(i.rowId, w.name, !0);
        });
      });
    }, Z = ss({ enabled: !0, context: Qo.Normal });
    Z.registerShortcuts(rs({
      onCopy: E,
      onPaste: F,
      onCut: J,
      onDelete: W,
      onSelectAll: U,
      onFind: () => console.log("Find not implemented yet")
    }));
    const oe = te(() => n.visibleRows), q = te(() => o.columns || n.columns);
    function Y(i) {
      !i.ctrlKey && !i.metaKey || ((i.key === "c" || i.key === "C") && (i.preventDefault(), console.log("[DataGrid] Ctrl+C pressed - copying selected cells"), de()), (i.key === "v" || i.key === "V") && (i.preventDefault(), console.log("[DataGrid] Ctrl+V pressed - pasting from clipboard"), ae()));
    }
    async function de() {
      if (n.selectedCells.size === 0) {
        console.warn("[DataGrid] No cells selected for copy");
        return;
      }
      console.log("[DataGrid] Copying selected cells:", {
        selectedCount: n.selectedCells.size,
        selectedCells: Array.from(n.selectedCells)
      });
      const i = await a.copySelectedCells(
        n.selectedCells,
        n.rows,
        G.value
      );
      i.success ? console.log("[DataGrid] Copy successful:", i.message) : console.error("[DataGrid] Copy failed:", i.message);
    }
    async function ae() {
      const i = await a.pasteFromClipboard();
      if (i.success && i.rows && i.rows.length > 0) {
        console.log("[DataGrid] Paste successful:", {
          rowCount: i.rows.length,
          headers: i.headers
        });
        let w = 0, C = 0;
        if (n.selectedCells.size > 0) {
          const k = Array.from(n.selectedCells)[0], [I, V] = k.split(":"), re = n.rows.find((se) => se.rowId === I), ee = G.value.findIndex((se) => se.name === V);
          re && ee !== -1 && (w = re.rowIndex, C = ee);
        }
        console.log("[DataGrid] Pasting at position:", {
          targetRowIndex: w,
          targetColIndex: C
        }), i.rows.forEach((k, I) => {
          const V = w + I;
          if (V >= n.rows.length) {
            console.warn("[DataGrid] Paste row out of bounds:", { pasteRowIndex: V, maxRows: n.rows.length });
            return;
          }
          const re = n.rows[V];
          Object.keys(k).forEach((ee, se) => {
            const me = C + se;
            if (me >= G.value.length) {
              console.warn("[DataGrid] Paste column out of bounds:", { pasteColIndex: me, maxCols: G.value.length });
              return;
            }
            const je = G.value[me], ke = k[ee];
            n.updateCell(re.rowId, je.name, ke), console.log("[DataGrid] Pasted cell:", {
              row: V,
              col: me,
              columnName: je.name,
              value: ke
            });
          });
        }), console.log("[DataGrid] Paste complete");
      } else
        console.error("[DataGrid] Paste failed:", i.message);
    }
    bn(() => {
      r.info("🔄 Component before mount");
    }), Ct(() => {
      r.info("🔄 Component before unmount");
    }), ao(() => {
      r.info("🗑️ Component unmounted - final cleanup"), r.info("👋 Component cleanup complete");
    });
    async function we() {
      if (console.log("[validateAllCellsInBatches] 🔍 START", {
        enableValidation: n.config.enableValidation,
        hasValidation: !!l,
        totalRows: n.rows.length,
        totalColumns: n.columns.length
      }), !n.config.enableValidation || !l) {
        console.log("[validateAllCellsInBatches] ⚠️ SKIPPED - validation not enabled or not available");
        return;
      }
      const i = n.getCellsNeedingValidation();
      if (console.log("[validateAllCellsInBatches] 📋 Cells needing validation:", {
        count: i.length,
        sample: i.slice(0, 5).map((k) => `${k.rowId}:${k.columnName}`)
      }), i.length === 0) {
        console.log("[validateAllCellsInBatches] ✅ NO CELLS NEED VALIDATION - all cells already validated");
        return;
      }
      const w = 20;
      let C = 0;
      console.log("[validateAllCellsInBatches] Starting batch validation...", {
        totalCells: i.length,
        batchSize: w,
        estimatedBatches: Math.ceil(i.length / w)
      });
      for (let k = 0; k < i.length; k += w) {
        const I = i.slice(k, k + w), V = Math.floor(k / w) + 1;
        console.log(`[validateAllCellsInBatches] 📦 Processing batch ${V}:`, {
          batchSize: I.length,
          from: k,
          to: k + I.length
        });
        for (const { rowId: re, columnName: ee } of I) {
          const se = n.rows.find((ke) => ke.rowId === re);
          if (!se) {
            console.warn("[validateAllCellsInBatches] ⚠️ Row not found:", re);
            continue;
          }
          const me = se.cells.find((ke) => ke.columnName === ee);
          if (!me) {
            console.warn("[validateAllCellsInBatches] ⚠️ Cell not found:", { rowId: re, columnName: ee });
            continue;
          }
          const je = se.cells.map((ke) => ({ columnName: ke.columnName, value: ke.value }));
          await l.validateCellThrottled(re, ee, me.value, je), n.markCellValidated(re, ee), C++;
        }
        await ie(), console.log(`[validateAllCellsInBatches] ✓ Batch ${V} complete:`, {
          validated: C,
          total: i.length,
          progress: `${Math.round(C / i.length * 100)}%`
        });
      }
      console.log("[validateAllCellsInBatches] 🎉 COMPLETE:", {
        totalValidated: C,
        totalRequested: i.length,
        success: C === i.length
      });
    }
    Oe(() => n.config.autoValidate, async (i, w) => {
      console.log("[DataGrid] autoValidate changed:", { wasEnabled: w, enabled: i }), i && !w && n.config.enableValidation && (console.log("[DataGrid] Auto-validation enabled - validating all unvalidated cells"), await we());
    });
    function xe() {
      (n.isDragging || n.pressedCell) && n.endDragSelection();
    }
    const Ae = te(() => {
      const i = [], w = n.config;
      return w.showRowNumber && i.push({
        name: "__rowNumber",
        header: "#",
        width: 50,
        minWidth: 40,
        maxWidth: 80,
        isVisible: !0,
        isReadOnly: !0,
        isSortable: !1,
        isFilterable: !1,
        specialType: "RowNumber"
      }), w.showCheckbox && i.push({
        name: "__checkbox",
        header: "☑",
        width: 40,
        minWidth: 40,
        maxWidth: 40,
        isVisible: !0,
        isReadOnly: !0,
        isSortable: !1,
        isFilterable: !0,
        // ✅ FIX: Povoliť filtrovanie pre Checkbox stĺpec
        specialType: "Checkbox"
      }), i;
    }), ze = te(() => {
      const i = [];
      return n.config.showValidationAlerts && i.push({
        name: "__validationAlerts",
        header: "⚠ Validation",
        width: 200,
        // Default width (only used if autoWidth is false)
        minWidth: 150,
        maxWidth: 9999,
        // No maximum - can grow as needed
        autoWidth: !0,
        // Use 1fr to fill remaining space to full width
        isVisible: !0,
        isReadOnly: !0,
        isSortable: !1,
        isFilterable: !1,
        specialType: "ValidationAlerts"
      }), i;
    }), H = te(() => {
      const i = [], w = n.config;
      return w.showInsertButton && i.push({
        name: "__insertRow",
        header: "Insert",
        width: 60,
        minWidth: 50,
        maxWidth: 80,
        isVisible: !0,
        isReadOnly: !0,
        isSortable: !1,
        isFilterable: !1,
        specialType: "InsertRow"
      }), w.showDeleteButton && i.push({
        name: "__deleteRow",
        header: "Delete",
        width: 60,
        minWidth: 50,
        maxWidth: 80,
        isVisible: !0,
        isReadOnly: !0,
        isSortable: !1,
        isFilterable: !1,
        specialType: "DeleteRow"
      }), i;
    }), G = te(() => [
      ...Ae.value,
      ...q.value.filter((i) => !i.specialType && i.isVisible && i.visibleForGrid !== !1),
      // Only visible non-special columns that are shown in grid
      ...ze.value,
      ...H.value
    ]), ce = te(() => {
      const i = G.value.map((w) => w.autoWidth ? "1fr" : `${w.width}px`).join(" ");
      return console.log("[GridTemplate] All Columns:", G.value.map((w) => ({
        name: w.name,
        header: w.header,
        width: w.width,
        autoWidth: w.autoWidth,
        specialType: w.specialType
      }))), console.log("[GridTemplate] Generated Template:", i), i;
    });
    Oe(() => o.config, (i) => {
      i && n.setConfig(i);
    }, { immediate: !0, deep: !0 }), Oe(() => o.columns, (i) => {
      if (console.log("[DataGrid] Columns watch triggered:", {
        hasColumns: i == null ? void 0 : i.length,
        rowsLength: n.rows.length,
        willInitialize: i && i.length > 0 && n.rows.length === 0
      }), i && i.length > 0)
        try {
          n.setColumns(i), console.log("[DataGrid] After setColumns, rowsLength:", n.rows.length), n.rows.length === 0 ? (console.log("[DataGrid] Calling initializeEmptyRows..."), n.initializeEmptyRows(), console.log("[DataGrid] After initializeEmptyRows, rowsLength:", n.rows.length)) : console.log("[DataGrid] SKIPPED initializeEmptyRows - rows already exist!");
        } catch (w) {
          console.error("[DataGrid] Failed to set columns:", w), alert(`Column configuration error: ${w instanceof Error ? w.message : "Unknown error"}`);
        }
    }, { immediate: !0, deep: !0 }), Oe(() => {
      var i;
      return ((i = l == null ? void 0 : l.ruleCount) == null ? void 0 : i.value) ?? 0;
    }, async (i, w) => {
      var k, I;
      const C = ((I = (k = l == null ? void 0 : l.validationRules) == null ? void 0 : k.value) == null ? void 0 : I.size) || 0;
      if (console.log("[WATCHER] Validation rules changed!", {
        ruleCount: i,
        oldCount: w,
        hasRules: C > 0,
        hasData: n.rows.length > 0,
        autoValidateEnabled: n.config.autoValidate
      }), C === 0 || n.rows.length === 0 || !n.config.autoValidate) {
        console.log("[WATCHER] Skipping auto-validation:", {
          noRules: C === 0,
          noData: n.rows.length === 0,
          autoValidateDisabled: !n.config.autoValidate
        });
        return;
      }
      console.log("[WATCHER] Triggering auto-validation for all rows...");
      try {
        await ie(), console.log("[WATCHER] First nextTick done"), await ie(), console.log("[WATCHER] Second nextTick done"), await l.validateAll(n.rows), console.log("[WATCHER] ✅ Auto-validation completed after adding rules");
      } catch (V) {
        console.error("[WATCHER] ❌ Error during auto-validation:", V);
      }
    }), Oe(() => n.rows.length, async (i, w) => {
      var k, I, V;
      console.log("[WATCHER] Rows length changed!", {
        newLength: i,
        oldLength: w,
        hasRules: ((I = (k = l == null ? void 0 : l.validationRules) == null ? void 0 : k.value) == null ? void 0 : I.size) || 0,
        autoValidateEnabled: n.config.autoValidate
      });
      const C = ((V = l == null ? void 0 : l.validationRules) == null ? void 0 : V.value) && l.validationRules.value.size > 0;
      if (i <= w || !C || !n.config.autoValidate) {
        console.log("[WATCHER] Skipping auto-validation:", {
          rowsNotAdded: i <= w,
          noRules: !C,
          autoValidateDisabled: !n.config.autoValidate
        });
        return;
      }
      console.log("[WATCHER] Triggering auto-validation for newly loaded rows..."), y.value = !0;
      try {
        await ie(), console.log("[WATCHER] First nextTick done - rows mounted"), await ie(), console.log("[WATCHER] Second nextTick done - scroller ready"), await new Promise((re) => setTimeout(re, 50)), console.log("[WATCHER] Delay done - starting validation"), await l.validateAll(n.rows), console.log("[WATCHER] ✅ Auto-validation completed after loading data");
      } finally {
        y.value = !1;
      }
    }, { immediate: !1 }), Oe(() => {
      var i;
      return ((i = l == null ? void 0 : l.errorCount) == null ? void 0 : i.value) ?? 0;
    }, async (i, w) => {
      const C = l == null ? void 0 : l.validationErrors;
      if (console.log("[WATCHER] Validation errors changed!", {
        errorCount: i,
        oldErrorCount: w,
        hasErrors: i > 0,
        isAutoRowHeightEnabled: n.isAutoRowHeightEnabled,
        validationErrorsKeys: C ? Object.keys(C) : []
      }), console.log("[WATCHER] Updating validationErrorCount for all rows..."), n.rows.forEach((k) => {
        const I = C && C[k.rowId] ? C[k.rowId].length : 0;
        k.validationErrorCount = I, (I > 0 || k.validationErrorCount !== I) && console.log("[WATCHER] Updated validationErrorCount:", { rowId: k.rowId, count: I });
      }), !C || i === 0) {
        console.log("[WATCHER] No validation errors, heights updated, done.");
        return;
      }
      await ie(), n.isAutoRowHeightEnabled ? (console.log("[WATCHER] AutoRowHeight is ON, calling applyAutoRowHeightToAll..."), await S(), console.log("[WATCHER] applyAutoRowHeightToAll completed")) : (console.log("[WATCHER] AutoRowHeight is OFF, calling resetAllRowHeights..."), await B(), console.log("[WATCHER] resetAllRowHeights completed"));
    });
    function z(i, w) {
      const C = n.columns.find((k) => k.name === i);
      if (!C) {
        console.error(`[handleSort] Column not found: ${i}`);
        return;
      }
      if (!C.isSortable) {
        console.warn(`[handleSort] Column '${i}' is not sortable`);
        return;
      }
      if (C.visibleForGrid === !1) {
        console.warn(`[handleSort] Column '${i}' has visibleForGrid=false, sorting not allowed`);
        return;
      }
      n.addSort(i, w, !1);
    }
    function T(i, w) {
      const C = n.columns.find((k) => k.name === i);
      C && (C.width = w);
    }
    async function K(i, w, C) {
      if (console.log(`[DataGrid] handleCellEditComplete: rowId=${i}, columnName=${w}, newValue=${C}, autoValidate=${n.config.autoValidate}, autoRowHeight=${n.isAutoRowHeightEnabled}`), n.updateCell(i, w, C), n.config.autoValidate && n.config.enableValidation && l) {
        const k = n.rows.find((V) => V.rowId === i), I = k == null ? void 0 : k.cells.map((V) => ({ columnName: V.columnName, value: V.value }));
        await l.validateCellThrottled(i, w, C, I), console.log("[DataGrid] Cell validated after edit:", { rowId: i, columnName: w, hasErrors: l.validationErrors.value.has(i) });
      }
      n.isAutoRowHeightEnabled ? (console.log("[DataGrid] Recalculating row height:", { rowId: i }), await O(i), await ie()) : (console.log("[DataGrid] Recalculating height for newlines (AutoRowHeight OFF):", { rowId: i }), await N(i));
    }
    async function D(i, w, C) {
      console.log("[handleCellInput] Called:", { rowId: i, columnName: w, value: C, autoRowHeightEnabled: n.isAutoRowHeightEnabled }), n.updateCell(i, w, C), n.isAutoRowHeightEnabled ? (await O(i), await ie()) : C != null && String(C).includes(`
`) && await N(i);
    }
    function Fe(i, w) {
      n.toggleCheckbox(i, w);
    }
    function ye(i) {
      n.deleteRow(i);
    }
    function pe(i) {
      n.insertRow(i);
    }
    function Pe(i, w) {
      n.insertMultipleRows(i, w, "above");
    }
    function et(i, w) {
      n.insertMultipleRows(i, w, "below");
    }
    const ft = te(() => q.value.filter((i) => !i.isVisible && !i.specialType && i.visibleForGrid !== !1));
    function Rt(i) {
      const w = q.value.find((C) => C.name === i);
      w && !w.specialType && (w.isVisible = !1, console.log(`Hidden column: ${i}`));
    }
    function xt(i) {
      const w = q.value.find((C) => C.name === i);
      w && (w.isVisible = !0, console.log(`Shown column: ${i}`));
    }
    function gt() {
      q.value.forEach((i) => {
        i.specialType || (i.isVisible = !0);
      }), console.log("Shown all columns");
    }
    function it(i) {
      const w = q.value.find((ee) => ee.name === i);
      if (!w) return;
      const k = document.createElement("canvas").getContext("2d");
      if (!k) return;
      k.font = "14px system-ui, -apple-system, sans-serif";
      let I = 0;
      const V = k.measureText(w.header).width;
      I = Math.max(I, V + 40), n.rows.forEach((ee) => {
        const se = ee.cells.find((ke) => ke.columnName === i), me = se == null ? void 0 : se.value, je = (me == null ? void 0 : me.toString()) ?? "";
        if (je) {
          const ke = k.measureText(je).width;
          I = Math.max(I, ke + 24);
        }
      });
      const re = Math.max(
        w.minWidth,
        Math.min(w.maxWidth, Math.ceil(I))
      );
      w.width = re, console.log(`Auto-fit column ${i}: ${re}px (measured: ${Math.ceil(I)}px)`);
    }
    const $e = M({
      visible: !1,
      columnName: "",
      position: { x: 0, y: 0 },
      uniqueValues: [],
      mode: "checkbox",
      pattern: ""
    });
    function tt(i, w) {
      if (i == null) return null;
      if (i.type === "simple")
        return i.columnName === w ? null : i;
      const C = i;
      if (!C.left || !C.right)
        return console.error("[extractFiltersExceptColumn] Invalid composite filter - missing children:", C), null;
      const k = tt(C.left, w), I = tt(C.right, w);
      return !k && !I ? null : k ? I ? {
        type: "composite",
        left: k,
        right: I,
        operator: C.operator
      } : k : I;
    }
    function nt(i, w) {
      const C = /* @__PURE__ */ new Set();
      if (i == null) return C;
      function k(I) {
        if (I.type === "simple") {
          const V = I;
          V.columnName === w && V.operator === "Equals" && C.add(String(V.value));
        } else {
          const V = I;
          k(V.left), k(V.right);
        }
      }
      return k(i), C;
    }
    function pt(i) {
      try {
        if (console.log(`[getUniqueValues] Starting for column: ${i}`), !n || !n.rows)
          return console.warn("[getUniqueValues] Store or rows not initialized yet, returning empty array"), [];
        if (i === "__checkbox") {
          const ee = tt(n.filterExpression, i);
          console.log(`[getUniqueValues] Checkbox - Has filters to apply: ${!!ee}`);
          const se = n.rows;
          console.log(`[getUniqueValues] Checkbox - Total rows before filtering: ${se.length}`);
          const me = ee ? d(se, ee, n) : se;
          console.log(`[getUniqueValues] Checkbox - Total rows after filtering: ${me.length}`);
          const je = Math.min(3, me.length);
          for (let vt = 0; vt < je; vt++) {
            const lt = me[vt].cells.find((cn) => cn.columnName === "__checkbox");
            console.log(`[getUniqueValues] Checkbox - Row ${vt}: cell=${!!lt}, value=${lt == null ? void 0 : lt.value}, type=${typeof (lt == null ? void 0 : lt.value)}`);
          }
          const ke = me.filter((vt) => n.isRowChecked(vt.rowId)).length, Xt = me.length - ke, Yt = nt(n.filterExpression, i);
          return console.log(`[getUniqueValues] Checkbox column: true=${ke}, false=${Xt}, selected=${Array.from(Yt)}`), [
            {
              value: "true",
              isSelected: Yt.has("true"),
              count: ke,
              displayText: `☑ Checked (${ke})`
            },
            {
              value: "false",
              isSelected: Yt.has("false"),
              count: Xt,
              displayText: `☐ Unchecked (${Xt})`
            }
          ];
        }
        const w = /* @__PURE__ */ new Map(), C = tt(n.filterExpression, i);
        console.log(`[getUniqueValues] Has filters to apply for '${i}': ${!!C}`);
        const k = n.rows, I = C ? d(k, C, n) : k;
        console.log(`[getUniqueValues] Column=${i}, AllRows=${k.length}, FilteredRows=${I.length}`), I.forEach((ee) => {
          var je;
          const se = ee.cells.find((ke) => ke.columnName === i), me = ((je = se == null ? void 0 : se.value) == null ? void 0 : je.toString()) ?? "";
          w.set(me, (w.get(me) || 0) + 1);
        });
        const V = nt(n.filterExpression, i);
        console.log(`[getUniqueValues] Column=${i}, UniqueValues=${w.size}, SelectedValues=${V.size}`);
        const re = Array.from(w.entries()).map(([ee, se]) => {
          const me = ee === "" ? "(Empty)" : ee;
          return {
            value: ee,
            isSelected: V.has(ee),
            // ✅ Mark checkbox based on current filter
            count: se,
            displayText: `${me} (${se})`
          };
        }).sort((ee, se) => ee.value === "" && se.value !== "" ? 1 : ee.value !== "" && se.value === "" ? -1 : ee.value.localeCompare(se.value));
        return console.log(`[getUniqueValues] Returning ${re.length} unique values`), re;
      } catch (w) {
        return console.error(`[getUniqueValues] ERROR for column '${i}':`, w), console.error("[getUniqueValues] Filter expression at time of error:", n.filterExpression), console.error("[getUniqueValues] Stack trace:", w instanceof Error ? w.stack : "No stack trace"), [];
      }
    }
    function It(i) {
      try {
        if (console.log(`[handleShowFilter] START for column: ${i}`), !c.value) {
          console.error("[handleShowFilter] Grid not ready yet"), alert("Please wait for the grid to finish loading before opening filters.");
          return;
        }
        if (y.value) {
          console.error("[handleShowFilter] Grid is currently processing data"), alert("Please wait while data is being processed...");
          return;
        }
        const w = q.value.find((I) => I.name === i);
        if (!w) {
          console.error(`[handleShowFilter] Column not found: ${i}`);
          return;
        }
        if (!w.isFilterable) {
          console.warn(`[handleShowFilter] Column '${i}' is not filterable`);
          return;
        }
        if (w.visibleForGrid === !1) {
          console.warn(`[handleShowFilter] Column '${i}' has visibleForGrid=false, filtering not allowed`);
          return;
        }
        if (!n || !n.rows || n.rows.length === 0) {
          console.error("[handleShowFilter] Store not initialized or no data"), alert("Please load data before opening filters.");
          return;
        }
        const C = pt(i);
        console.log(`[handleShowFilter] Got ${C.length} unique values`);
        const k = {
          x: window.innerWidth / 2 - 200,
          // 200 is roughly half the flyout width
          y: window.innerHeight / 2 - 300
          // 300 is roughly half the flyout height
        };
        $e.value = {
          visible: !0,
          columnName: i,
          position: k,
          uniqueValues: C,
          mode: "checkbox",
          pattern: ""
        }, console.log("[handleShowFilter] Filter flyout opened successfully");
      } catch (w) {
        console.error(`[handleShowFilter] CRITICAL ERROR for column '${i}':`, w), console.error("[handleShowFilter] Stack trace:", w instanceof Error ? w.stack : "No stack trace"), alert(`Error opening filter for column '${i}': ${w instanceof Error ? w.message : String(w)}`);
      }
    }
    function mt() {
      $e.value.visible = !1;
    }
    function ot(i) {
      const w = /* @__PURE__ */ new Map();
      function C(k, I) {
        if (k.type === "simple") {
          const V = k;
          return I && w.set(V.columnName, k), V.columnName;
        } else {
          const V = k;
          if (V.operator === "AND")
            return C(V.left, !0), C(V.right, !0), null;
          {
            const re = C(V.left, !1), ee = C(V.right, !1), se = re || ee;
            return se && I && w.set(se, k), se;
          }
        }
      }
      return i && C(i, !0), w;
    }
    function Be(i) {
      const w = i.filter((k) => k != null);
      if (w.length === 0) return null;
      if (w.length === 1) return w[0];
      let C = w[0];
      for (let k = 1; k < w.length; k++)
        C = {
          type: "composite",
          left: C,
          right: w[k],
          operator: "AND"
        };
      return C;
    }
    function Je(i, w) {
      const C = n.filterExpression, k = ot(C);
      k.set(w, i);
      const I = Array.from(k.values());
      return Be(I) || i;
    }
    function qt(i) {
      const w = $e.value.columnName;
      if (i.length === 0) {
        const C = ot(n.filterExpression);
        if (C.delete(w), C.size === 0)
          n.clearFilter();
        else {
          const k = Array.from(C.values()), I = Be(k);
          n.setFilter(I);
        }
      } else {
        const C = w === "__checkbox" ? i.map((V) => V === "true") : i;
        let k;
        if (C.length === 1)
          k = {
            type: "simple",
            columnName: w,
            operator: "Equals",
            value: C[0]
          };
        else {
          k = {
            type: "simple",
            columnName: w,
            operator: "Equals",
            value: C[0]
          };
          for (let V = 1; V < C.length; V++)
            k = {
              type: "composite",
              left: k,
              right: {
                type: "simple",
                columnName: w,
                operator: "Equals",
                value: C[V]
              },
              operator: "OR"
            };
        }
        const I = Je(k, w);
        n.setFilter(I);
      }
      console.log(`Applied checkbox filter to ${w}:`, i, "Final filter:", n.filterExpression);
    }
    function Kt(i) {
      const w = $e.value.columnName;
      if (!i) {
        const I = ot(n.filterExpression);
        if (I.delete(w), I.size === 0)
          n.clearFilter();
        else {
          const V = Array.from(I.values()), re = Be(V);
          n.setFilter(re);
        }
        return;
      }
      const k = Je({
        type: "simple",
        columnName: w,
        operator: "Contains",
        value: i
      }, w);
      n.setFilter(k), console.log(`Applied text contains filter to ${w}:`, i, "Final filter:", n.filterExpression);
    }
    function Jt() {
      const i = $e.value.columnName, w = ot(n.filterExpression);
      if (w.delete(i), w.size === 0)
        n.clearFilter();
      else {
        const C = Array.from(w.values()), k = Be(C);
        n.setFilter(k);
      }
      console.log(`Cleared filter for ${i}`, "Final filter:", n.filterExpression);
    }
    async function S() {
      const i = G.value.filter((I) => !I.specialType || I.specialType !== "ValidationAlerts").map((I) => ({
        name: I.name,
        width: I.width,
        specialType: I.specialType
      }));
      console.log("[applyAutoRowHeightToAll] ========== START =========="), console.log("[applyAutoRowHeightToAll] AutoRowHeight is ON");
      const w = n.rows.map((I) => ({ rowId: I.rowId, heightBefore: I.height }));
      console.log("[applyAutoRowHeightToAll] BEFORE - All row heights:", w.slice(0, 10)), console.log("[applyAutoRowHeightToAll] Measuring columns:", i.map((I) => `${I.name} (${I.width}px, special: ${I.specialType || "none"})`).join(", "));
      const C = await m.applyAutoRowHeight(n.rows, i), k = n.rows.map((I, V) => ({
        rowId: I.rowId,
        heightBefore: w[V].heightBefore,
        heightAfter: I.height,
        changed: w[V].heightBefore !== I.height
      }));
      console.log("[applyAutoRowHeightToAll] AFTER - All row heights (first 10):", k.slice(0, 10)), console.log("[applyAutoRowHeightToAll] Changed rows:", k.filter((I) => I.changed).length), console.log(`[applyAutoRowHeightToAll] Summary: ${C.totalRowsUpdated} rows updated, average height: ${C.averageHeight.toFixed(1)}px`), console.log("[applyAutoRowHeightToAll] Forcing Vue reactivity by reassigning rows array..."), n.rows = [...n.rows], await ie(), console.log("[applyAutoRowHeightToAll] First nextTick complete"), await ie(), console.log("[applyAutoRowHeightToAll] Second nextTick complete"), await ie(), console.log("[applyAutoRowHeightToAll] Third nextTick complete"), await new Promise((I) => setTimeout(I, 50)), console.log("[applyAutoRowHeightToAll] Delay complete, calling forceUpdate..."), _.value ? (_.value.forceUpdate(), console.log("[applyAutoRowHeightToAll] DynamicScroller forceUpdate() called")) : console.log("[applyAutoRowHeightToAll] ERROR: scrollerRef is null, cannot forceUpdate"), console.log("[applyAutoRowHeightToAll] ========== COMPLETE ==========");
    }
    async function B() {
      console.log("[resetAllRowHeights] START - AutoRowHeight is OFF, resetting to default height");
      let i = 0;
      const w = 32;
      n.rows.forEach((C) => {
        C.height = w, i++;
      }), console.log("[resetAllRowHeights] Summary:", {
        totalRows: i,
        resetToHeight: w
      }), console.log("[resetAllRowHeights] All row heights reset to default"), console.log("[resetAllRowHeights] Forcing Vue reactivity by reassigning rows array..."), n.rows = [...n.rows], await ie(), console.log("[resetAllRowHeights] First nextTick complete"), await ie(), console.log("[resetAllRowHeights] Second nextTick complete"), await ie(), console.log("[resetAllRowHeights] Third nextTick complete"), await new Promise((C) => setTimeout(C, 50)), console.log("[resetAllRowHeights] Delay complete, calling forceUpdate..."), _.value ? (_.value.forceUpdate(), console.log("[resetAllRowHeights] DynamicScroller forceUpdate() called")) : console.log("[resetAllRowHeights] ERROR: scrollerRef is null, cannot forceUpdate"), console.log("[resetAllRowHeights] COMPLETE");
    }
    async function O(i) {
      if (!n.isAutoRowHeightEnabled) return;
      const w = G.value.filter((I) => !I.specialType || I.specialType !== "ValidationAlerts").map((I) => ({
        name: I.name,
        width: I.width,
        specialType: I.specialType
      })), C = n.rows.find((I) => I.rowId === i);
      if (!C) return;
      m.recalculateRows(n.rows, [i], w) > 0 && C && (n.updateRowHeight(i, C.height), n.rows = [...n.rows], await ie());
    }
    async function N(i) {
      const w = n.rows.find((re) => re.rowId === i);
      if (!w) return;
      let C = 1;
      for (const re of w.cells) {
        if (re.value == null) continue;
        const ee = String(re.value);
        if (ee.includes(`
`)) {
          const se = ee.split(`
`).length;
          C = Math.max(C, se);
        }
      }
      const V = C * 21 + 10;
      n.updateRowHeight(i, V), n.rows = [...n.rows], await ie();
    }
    async function X() {
      r.debug("🔌 Checking backend connection...");
      try {
        g.value = await Qt.healthCheck(), g.value ? r.info("✅ Backend connected") : r.warn("⚠️ Backend disconnected");
      } catch (i) {
        r.error("❌ Backend connection check failed", {
          error: (i == null ? void 0 : i.message) || (i == null ? void 0 : i.toString()) || "Unknown error",
          stack: i == null ? void 0 : i.stack
        }), g.value = !1;
      }
    }
    async function le() {
      v.value = !0;
      try {
        const i = await Qt.getData();
        if (i.success && i.data) {
          const w = i.data.map((C, k) => ({
            ...C,
            __rowId: C.__rowId || `row-${Date.now()}-${k}`,
            __rowIndex: k
          }));
          n.loadRows(w), console.log(`Loaded ${w.length} rows from backend`), n.config.autoValidate && n.config.enableValidation && (console.log("[DataGrid] Auto-validation enabled - validating loaded data"), await we());
        } else
          console.error("Failed to load data from backend:", i.error), alert(`Failed to load data: ${i.error}`);
      } catch (i) {
        console.error("Error loading data from backend:", i), alert(`Error loading data: ${i instanceof Error ? i.message : "Unknown error"}`);
      } finally {
        v.value = !1;
      }
    }
    async function ne() {
      b.value = !0;
      try {
        const i = n.rows.map((C) => {
          const k = {};
          return q.value.forEach((I) => {
            if (!I.specialType) {
              const V = C.cells.find((re) => re.columnName === I.name);
              V && (k[I.name] = V.value);
            }
          }), k;
        }), w = await Qt.importData(i);
        w.success ? console.log(`Saved ${i.length} rows to backend`) : (console.error("Failed to save data to backend:", w.error), alert(`Failed to save data: ${w.error}`));
      } catch (i) {
        console.error("Error saving data to backend:", i), alert(`Error saving data: ${i instanceof Error ? i.message : "Unknown error"}`);
      } finally {
        b.value = !1;
      }
    }
    const he = te(() => {
      var i, w, C, k, I, V, re, ee;
      return {
        ...Xe,
        cellColors: { ...Xe.cellColors, ...((i = o.theme) == null ? void 0 : i.cellColors) || {} },
        rowColors: { ...Xe.rowColors, ...((w = o.theme) == null ? void 0 : w.rowColors) || {} },
        headerColors: { ...Xe.headerColors, ...((C = o.theme) == null ? void 0 : C.headerColors) || {} },
        validationColors: { ...Xe.validationColors, ...((k = o.theme) == null ? void 0 : k.validationColors) || {} },
        selectionColors: { ...Xe.selectionColors, ...((I = o.theme) == null ? void 0 : I.selectionColors) || {} },
        borderColors: { ...Xe.borderColors, ...((V = o.theme) == null ? void 0 : V.borderColors) || {} },
        specialColumnColors: { ...Xe.specialColumnColors, ...((re = o.theme) == null ? void 0 : re.specialColumnColors) || {} },
        uiControlColors: { ...Xe.uiControlColors, ...((ee = o.theme) == null ? void 0 : ee.uiControlColors) || {} }
      };
    }), fe = te(() => ({
      ...ps(he.value),
      "--dg-min-table-width": o.minTableWidth ? `${o.minTableWidth}px` : "fit-content",
      width: o.width || "100%",
      height: o.height || "600px"
    })), Se = {
      ...l,
      /**
       * Validates only cells that need validation (changed or unvalidated)
       * Returns true if all non-empty cells are valid
       * Respects autoValidate config
       */
      async validateRequired() {
        if (!n.config.enableValidation)
          return !0;
        const i = n.getCellsNeedingValidation();
        if (i.length === 0)
          return n.areNonEmptyRowsValid();
        for (const { rowId: w, columnName: C } of i) {
          const k = n.rows.find((V) => V.rowId === w);
          if (!k) continue;
          const I = k.cells.find((V) => V.columnName === C);
          I && (await l.validateCell(w, C, I.value), n.markCellValidated(w, C));
        }
        return n.areNonEmptyRowsValid();
      },
      /**
       * Checks if all non-empty rows are valid (without running validation)
       * Returns true if valid, false if there are errors
       */
      isAllValid() {
        return n.areNonEmptyRowsValid();
      },
      /**
       * Forces validation of all cells regardless of tracking
       * Returns true if all non-empty cells are valid
       */
      async validateAll(i) {
        if (!n.config.enableValidation)
          return { isValid: !0, totalErrors: 0 };
        const w = await l.validateAll(i || n.rows);
        n.clearValidationTracking();
        for (const C of n.rows)
          for (const k of C.cells)
            n.markCellValidated(k.rowId, k.columnName);
        return w;
      }
    };
    return e({
      validation: Se,
      copyPaste: a,
      shortcuts: Z,
      handleCopy: E,
      handlePaste: F,
      handleCut: J,
      loadDataFromBackend: le,
      saveDataToBackend: ne,
      checkBackendConnection: X
    }), (i, w) => (P(), j("div", {
      class: "data-grid",
      style: We(fe.value)
    }, [
      y.value ? (P(), j("div", Ur, [
        L("div", jr, [
          w[0] || (w[0] = L("div", { class: "processing-spinner" }, null, -1)),
          L("div", Gr, "Processing " + Te(A(n).rows.length) + " rows...", 1)
        ])
      ])) : ue("", !0),
      ft.value.length > 0 ? (P(), j("div", qr, [
        w[1] || (w[1] = L("span", { class: "hidden-columns-label" }, "Hidden columns:", -1)),
        (P(!0), j(Ke, null, Qe(ft.value, (C) => (P(), j("button", {
          key: C.name,
          class: "show-column-button",
          onClick: (k) => xt(C.name),
          title: `Show column: ${C.header}`
        }, Te(C.header), 9, Kr))), 128)),
        L("button", {
          class: "show-all-button",
          onClick: gt,
          title: "Show all columns"
        }, " Show All ")
      ])) : ue("", !0),
      L("div", Jr, [
        Ne(ir, {
          columns: G.value,
          "grid-template-columns": ce.value,
          "grid-id": A(s),
          "is-grid-ready": c.value,
          "is-processing": y.value,
          onSort: z,
          onResize: T,
          onHideColumn: Rt,
          onAutoFitColumn: it,
          onShowFilter: It
        }, null, 8, ["columns", "grid-template-columns", "grid-id", "is-grid-ready", "is-processing"]),
        Ne(A(uo), {
          ref_key: "scrollerRef",
          ref: _,
          items: oe.value,
          "min-item-size": 40,
          buffer: 200,
          "key-field": "rowId",
          class: "scroller"
        }, {
          default: Le(({ item: C, index: k, active: I }) => [
            Ne(A(Xo), {
              item: C,
              active: I,
              "size-dependencies": [C.height, C.cells.length, C.validationErrorCount],
              "data-index": k
            }, {
              default: Le(() => [
                Ne(br, {
                  row: C,
                  columns: G.value,
                  "grid-template-columns": ce.value,
                  "grid-id": A(s),
                  onCellEditComplete: K,
                  onCellInput: D,
                  onCheckboxChange: Fe,
                  onDeleteRow: ye,
                  onInsertRow: pe,
                  onInsertAbove: Pe,
                  onInsertBelow: et
                }, null, 8, ["row", "columns", "grid-template-columns", "grid-id"])
              ]),
              _: 2
            }, 1032, ["item", "active", "size-dependencies", "data-index"])
          ]),
          _: 1
        }, 8, ["items"])
      ]),
      Ne(Ar, {
        "page-size": A(n).pageSize,
        "page-size-options": A(n).config.pageSizeOptions,
        "total-rows": A(n).totalRows,
        "current-page": A(n).currentPage,
        onPageChange: A(n).goToPage,
        onPageSizeChange: A(n).setPageSize
      }, null, 8, ["page-size", "page-size-options", "total-rows", "current-page", "onPageChange", "onPageSizeChange"]),
      Ne(Lr, {
        visible: $e.value.visible,
        "column-name": $e.value.columnName,
        position: $e.value.position,
        "unique-values": $e.value.uniqueValues,
        "current-mode": $e.value.mode,
        "current-pattern": $e.value.pattern,
        onClose: mt,
        onApplyCheckbox: qt,
        onApplyRegex: Kt,
        onClearFilter: Jt
      }, null, 8, ["visible", "column-name", "position", "unique-values", "current-mode", "current-pattern"])
    ], 4));
  }
}), Po = /* @__PURE__ */ rt(Xr, [["__scopeId", "data-v-b8f0b0e7"]]), Yr = { class: "listbox-container" }, Zr = {
  key: 0,
  class: "listbox-title"
}, Qr = ["onClick", "onMouseenter"], ei = ["checked", "onClick"], ti = { class: "listbox-item-text" }, oi = /* @__PURE__ */ He({
  __name: "ListBox",
  props: {
    items: {},
    title: { default: "" },
    multiSelect: { type: Boolean, default: !1 },
    preSelected: { default: () => [] },
    height: { default: 200 },
    width: { default: 250 },
    theme: {}
  },
  emits: ["selectionChange"],
  setup(t, { expose: e, emit: o }) {
    const s = t, r = o, n = M(/* @__PURE__ */ new Set()), l = M(null);
    Oe(() => s.preSelected, (u) => {
      n.value = new Set(u);
    }, { immediate: !0 });
    const a = te(() => {
      var u, f, m, h;
      return {
        ...bt,
        itemColors: { ...bt.itemColors, ...((u = s.theme) == null ? void 0 : u.itemColors) || {} },
        containerColors: { ...bt.containerColors, ...((f = s.theme) == null ? void 0 : f.containerColors) || {} },
        checkboxColors: { ...bt.checkboxColors, ...((m = s.theme) == null ? void 0 : m.checkboxColors) || {} },
        scrollbarColors: { ...bt.scrollbarColors, ...((h = s.theme) == null ? void 0 : h.scrollbarColors) || {} }
      };
    }), d = te(() => ms(a.value)), p = te(() => ({
      height: `${s.height}px`,
      width: `${s.width}px`,
      ...d.value
    }));
    function c(u) {
      return n.value.has(u);
    }
    function y(u) {
      s.multiSelect ? n.value.has(u.value) ? n.value.delete(u.value) : n.value.add(u.value) : (n.value.clear(), n.value.add(u.value)), r("selectionChange", Array.from(n.value));
    }
    return e({
      getSelectedValues: () => Array.from(n.value),
      clearSelection: () => {
        n.value.clear(), r("selectionChange", []);
      },
      selectValue: (u) => {
        s.multiSelect || n.value.clear(), n.value.add(u), r("selectionChange", Array.from(n.value));
      }
    }), (u, f) => (P(), j("div", Yr, [
      t.title ? (P(), j("div", Zr, Te(t.title), 1)) : ue("", !0),
      L("div", {
        class: Ee(["listbox", { "listbox--multi": t.multiSelect }]),
        style: We(p.value)
      }, [
        (P(!0), j(Ke, null, Qe(t.items, (m) => (P(), j("div", {
          key: m.value,
          class: Ee(["listbox-item", {
            "listbox-item--selected": c(m.value),
            "listbox-item--hover": l.value === m.value
          }]),
          onClick: (h) => y(m),
          onMouseenter: (h) => l.value = m.value,
          onMouseleave: f[0] || (f[0] = (h) => l.value = null)
        }, [
          t.multiSelect ? (P(), j("input", {
            key: 0,
            type: "checkbox",
            checked: c(m.value),
            class: "listbox-checkbox",
            onClick: ct((h) => y(m), ["stop"])
          }, null, 8, ei)) : ue("", !0),
          L("span", ti, Te(m.name), 1)
        ], 42, Qr))), 128))
      ], 6)
    ]));
  }
}), ni = /* @__PURE__ */ rt(oi, [["__scopeId", "data-v-3ab94bcd"]]);
function Ui() {
  const t = M([]);
  function e(l, a) {
    return a.length === 0 ? l : l.slice().sort((d, p) => {
      for (const { columnName: c, direction: y } of a) {
        const u = d.cells.find((v) => v.columnName === c), f = p.cells.find((v) => v.columnName === c), m = u == null ? void 0 : u.value, h = f == null ? void 0 : f.value, g = o(m, h);
        if (g !== 0)
          return y === "asc" ? g : -g;
      }
      return 0;
    });
  }
  function o(l, a) {
    if (l == null && a == null) return 0;
    if (l == null) return -1;
    if (a == null) return 1;
    if (typeof l == "number" && typeof a == "number")
      return l - a;
    const d = new Date(l), p = new Date(a);
    if (!isNaN(d.getTime()) && !isNaN(p.getTime()))
      return d.getTime() - p.getTime();
    const c = String(l).toLowerCase(), y = String(a).toLowerCase();
    return c.localeCompare(y);
  }
  function s(l, a, d = !1) {
    if (!d)
      t.value = [{ columnName: l, direction: a }];
    else {
      const p = t.value.findIndex((c) => c.columnName === l);
      p >= 0 ? t.value[p].direction = a : t.value.push({ columnName: l, direction: a });
    }
  }
  function r(l) {
    t.value = t.value.filter((a) => a.columnName !== l);
  }
  function n() {
    t.value = [];
  }
  return {
    sortColumns: t,
    sortRows: e,
    addSort: s,
    removeSort: r,
    clearSort: n
  };
}
function ji() {
  const t = M(/* @__PURE__ */ new Set()), e = M(null);
  function o(c, y, u = "replace") {
    const f = `${c}:${y}`;
    u === "replace" ? (t.value.clear(), t.value.add(f), e.value = { rowId: c, columnName: y }) : u === "add" ? t.value.add(f) : u === "toggle" && (t.value.has(f) ? t.value.delete(f) : t.value.add(f));
  }
  function s(c, y, u, f) {
    t.value.clear();
    const m = u.findIndex((E) => E.rowId === c.rowId), h = u.findIndex((E) => E.rowId === y.rowId), g = f.findIndex((E) => E.name === c.columnName), v = f.findIndex((E) => E.name === y.columnName);
    if (m === -1 || h === -1 || g === -1 || v === -1)
      return;
    const b = Math.min(m, h), _ = Math.max(m, h), $ = Math.min(g, v), x = Math.max(g, v);
    for (let E = b; E <= _; E++) {
      const F = u[E];
      for (let J = $; J <= x; J++) {
        const W = f[J];
        F && W && t.value.add(`${F.rowId}:${W.name}`);
      }
    }
  }
  function r(c, y) {
    for (const u of y)
      t.value.add(`${c}:${u.name}`);
  }
  function n(c, y) {
    for (const u of y)
      t.value.add(`${u.rowId}:${c}`);
  }
  function l(c, y) {
    t.value.clear();
    for (const u of c)
      for (const f of y)
        t.value.add(`${u.rowId}:${f.name}`);
  }
  function a() {
    t.value.clear(), e.value = null;
  }
  function d() {
    return Array.from(t.value).map((c) => {
      const [y, u] = c.split(":");
      return { rowId: y, columnName: u };
    });
  }
  function p(c, y) {
    return t.value.has(`${c}:${y}`);
  }
  return {
    selectedCells: t,
    anchorCell: e,
    selectCell: o,
    selectRange: s,
    selectRow: r,
    selectColumn: n,
    selectAll: l,
    clearSelection: a,
    getSelectedCells: d,
    isCellSelected: p
  };
}
class ut extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.HttpError}.
   *
   * @param {string} errorMessage A descriptive error message.
   * @param {number} statusCode The HTTP status code represented by this error.
   */
  constructor(e, o) {
    const s = new.target.prototype;
    super(`${e}: Status code '${o}'`), this.statusCode = o, this.__proto__ = s;
  }
}
class mo extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.TimeoutError}.
   *
   * @param {string} errorMessage A descriptive error message.
   */
  constructor(e = "A timeout occurred.") {
    const o = new.target.prototype;
    super(e), this.__proto__ = o;
  }
}
class qe extends Error {
  /** Constructs a new instance of {@link AbortError}.
   *
   * @param {string} errorMessage A descriptive error message.
   */
  constructor(e = "An abort occurred.") {
    const o = new.target.prototype;
    super(e), this.__proto__ = o;
  }
}
class si extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.UnsupportedTransportError}.
   *
   * @param {string} message A descriptive error message.
   * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
   */
  constructor(e, o) {
    const s = new.target.prototype;
    super(e), this.transport = o, this.errorType = "UnsupportedTransportError", this.__proto__ = s;
  }
}
class ri extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.DisabledTransportError}.
   *
   * @param {string} message A descriptive error message.
   * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
   */
  constructor(e, o) {
    const s = new.target.prototype;
    super(e), this.transport = o, this.errorType = "DisabledTransportError", this.__proto__ = s;
  }
}
class ii extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.FailedToStartTransportError}.
   *
   * @param {string} message A descriptive error message.
   * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
   */
  constructor(e, o) {
    const s = new.target.prototype;
    super(e), this.transport = o, this.errorType = "FailedToStartTransportError", this.__proto__ = s;
  }
}
class Do extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.FailedToNegotiateWithServerError}.
   *
   * @param {string} message A descriptive error message.
   */
  constructor(e) {
    const o = new.target.prototype;
    super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = o;
  }
}
class li extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.AggregateErrors}.
   *
   * @param {string} message A descriptive error message.
   * @param {Error[]} innerErrors The collection of errors this error is aggregating.
   */
  constructor(e, o) {
    const s = new.target.prototype;
    super(e), this.innerErrors = o, this.__proto__ = s;
  }
}
class ln {
  constructor(e, o, s) {
    this.statusCode = e, this.statusText = o, this.content = s;
  }
}
class Gt {
  get(e, o) {
    return this.send({
      ...o,
      method: "GET",
      url: e
    });
  }
  post(e, o) {
    return this.send({
      ...o,
      method: "POST",
      url: e
    });
  }
  delete(e, o) {
    return this.send({
      ...o,
      method: "DELETE",
      url: e
    });
  }
  /** Gets all cookies that apply to the specified URL.
   *
   * @param url The URL that the cookies are valid for.
   * @returns {string} A string containing all the key-value cookie pairs for the specified URL.
   */
  // @ts-ignore
  getCookieString(e) {
    return "";
  }
}
var R;
(function(t) {
  t[t.Trace = 0] = "Trace", t[t.Debug = 1] = "Debug", t[t.Information = 2] = "Information", t[t.Warning = 3] = "Warning", t[t.Error = 4] = "Error", t[t.Critical = 5] = "Critical", t[t.None = 6] = "None";
})(R || (R = {}));
class zt {
  constructor() {
  }
  /** @inheritDoc */
  // eslint-disable-next-line
  log(e, o) {
  }
}
zt.instance = new zt();
const ai = "8.0.17";
class Re {
  static isRequired(e, o) {
    if (e == null)
      throw new Error(`The '${o}' argument is required.`);
  }
  static isNotEmpty(e, o) {
    if (!e || e.match(/^\s*$/))
      throw new Error(`The '${o}' argument should not be empty.`);
  }
  static isIn(e, o, s) {
    if (!(e in o))
      throw new Error(`Unknown ${s} value: ${e}.`);
  }
}
class be {
  // react-native has a window but no document so we should check both
  static get isBrowser() {
    return !be.isNode && typeof window == "object" && typeof window.document == "object";
  }
  // WebWorkers don't have a window object so the isBrowser check would fail
  static get isWebWorker() {
    return !be.isNode && typeof self == "object" && "importScripts" in self;
  }
  // react-native has a window but no document
  static get isReactNative() {
    return !be.isNode && typeof window == "object" && typeof window.document > "u";
  }
  // Node apps shouldn't have a window object, but WebWorkers don't either
  // so we need to check for both WebWorker and window
  static get isNode() {
    return typeof process < "u" && process.release && process.release.name === "node";
  }
}
function Ft(t, e) {
  let o = "";
  return ht(t) ? (o = `Binary data of length ${t.byteLength}`, e && (o += `. Content: '${ci(t)}'`)) : typeof t == "string" && (o = `String data of length ${t.length}`, e && (o += `. Content: '${t}'`)), o;
}
function ci(t) {
  const e = new Uint8Array(t);
  let o = "";
  return e.forEach((s) => {
    const r = s < 16 ? "0" : "";
    o += `0x${r}${s.toString(16)} `;
  }), o.substr(0, o.length - 1);
}
function ht(t) {
  return t && typeof ArrayBuffer < "u" && (t instanceof ArrayBuffer || // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
  t.constructor && t.constructor.name === "ArrayBuffer");
}
async function an(t, e, o, s, r, n) {
  const l = {}, [a, d] = _t();
  l[a] = d, t.log(R.Trace, `(${e} transport) sending data. ${Ft(r, n.logMessageContent)}.`);
  const p = ht(r) ? "arraybuffer" : "text", c = await o.post(s, {
    content: r,
    headers: { ...l, ...n.headers },
    responseType: p,
    timeout: n.timeout,
    withCredentials: n.withCredentials
  });
  t.log(R.Trace, `(${e} transport) request complete. Response status: ${c.statusCode}.`);
}
function ui(t) {
  return t === void 0 ? new Nt(R.Information) : t === null ? zt.instance : t.log !== void 0 ? t : new Nt(t);
}
class di {
  constructor(e, o) {
    this._subject = e, this._observer = o;
  }
  dispose() {
    const e = this._subject.observers.indexOf(this._observer);
    e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((o) => {
    });
  }
}
class Nt {
  constructor(e) {
    this._minLevel = e, this.out = console;
  }
  log(e, o) {
    if (e >= this._minLevel) {
      const s = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${R[e]}: ${o}`;
      switch (e) {
        case R.Critical:
        case R.Error:
          this.out.error(s);
          break;
        case R.Warning:
          this.out.warn(s);
          break;
        case R.Information:
          this.out.info(s);
          break;
        default:
          this.out.log(s);
          break;
      }
    }
  }
}
function _t() {
  let t = "X-SignalR-User-Agent";
  return be.isNode && (t = "User-Agent"), [t, hi(ai, fi(), pi(), gi())];
}
function hi(t, e, o, s) {
  let r = "Microsoft SignalR/";
  const n = t.split(".");
  return r += `${n[0]}.${n[1]}`, r += ` (${t}; `, e && e !== "" ? r += `${e}; ` : r += "Unknown OS; ", r += `${o}`, s ? r += `; ${s}` : r += "; Unknown Runtime Version", r += ")", r;
}
function fi() {
  if (be.isNode)
    switch (process.platform) {
      case "win32":
        return "Windows NT";
      case "darwin":
        return "macOS";
      case "linux":
        return "Linux";
      default:
        return process.platform;
    }
  else
    return "";
}
function gi() {
  if (be.isNode)
    return process.versions.node;
}
function pi() {
  return be.isNode ? "NodeJS" : "Browser";
}
function to(t) {
  return t.stack ? t.stack : t.message ? t.message : `${t}`;
}
function mi() {
  if (typeof globalThis < "u")
    return globalThis;
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("could not find global");
}
class vi extends Gt {
  constructor(e) {
    if (super(), this._logger = e, typeof fetch > "u" || be.isNode) {
      const o = typeof __webpack_require__ == "function" ? __non_webpack_require__ : require;
      this._jar = new (o("tough-cookie")).CookieJar(), typeof fetch > "u" ? this._fetchType = o("node-fetch") : this._fetchType = fetch, this._fetchType = o("fetch-cookie")(this._fetchType, this._jar);
    } else
      this._fetchType = fetch.bind(mi());
    if (typeof AbortController > "u") {
      const o = typeof __webpack_require__ == "function" ? __non_webpack_require__ : require;
      this._abortControllerType = o("abort-controller");
    } else
      this._abortControllerType = AbortController;
  }
  /** @inheritDoc */
  async send(e) {
    if (e.abortSignal && e.abortSignal.aborted)
      throw new qe();
    if (!e.method)
      throw new Error("No method defined.");
    if (!e.url)
      throw new Error("No url defined.");
    const o = new this._abortControllerType();
    let s;
    e.abortSignal && (e.abortSignal.onabort = () => {
      o.abort(), s = new qe();
    });
    let r = null;
    if (e.timeout) {
      const d = e.timeout;
      r = setTimeout(() => {
        o.abort(), this._logger.log(R.Warning, "Timeout from HTTP request."), s = new mo();
      }, d);
    }
    e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, ht(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
    let n;
    try {
      n = await this._fetchType(e.url, {
        body: e.content,
        cache: "no-cache",
        credentials: e.withCredentials === !0 ? "include" : "same-origin",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          ...e.headers
        },
        method: e.method,
        mode: "cors",
        redirect: "follow",
        signal: o.signal
      });
    } catch (d) {
      throw s || (this._logger.log(R.Warning, `Error from HTTP request. ${d}.`), d);
    } finally {
      r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
    }
    if (!n.ok) {
      const d = await zo(n, "text");
      throw new ut(d || n.statusText, n.status);
    }
    const a = await zo(n, e.responseType);
    return new ln(n.status, n.statusText, a);
  }
  getCookieString(e) {
    let o = "";
    return be.isNode && this._jar && this._jar.getCookies(e, (s, r) => o = r.join("; ")), o;
  }
}
function zo(t, e) {
  let o;
  switch (e) {
    case "arraybuffer":
      o = t.arrayBuffer();
      break;
    case "text":
      o = t.text();
      break;
    case "blob":
    case "document":
    case "json":
      throw new Error(`${e} is not supported.`);
    default:
      o = t.text();
      break;
  }
  return o;
}
class wi extends Gt {
  constructor(e) {
    super(), this._logger = e;
  }
  /** @inheritDoc */
  send(e) {
    return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new qe()) : e.method ? e.url ? new Promise((o, s) => {
      const r = new XMLHttpRequest();
      r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 ? !0 : e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (ht(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
      const n = e.headers;
      n && Object.keys(n).forEach((l) => {
        r.setRequestHeader(l, n[l]);
      }), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
        r.abort(), s(new qe());
      }), e.timeout && (r.timeout = e.timeout), r.onload = () => {
        e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? o(new ln(r.status, r.statusText, r.response || r.responseText)) : s(new ut(r.response || r.responseText || r.statusText, r.status));
      }, r.onerror = () => {
        this._logger.log(R.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), s(new ut(r.statusText, r.status));
      }, r.ontimeout = () => {
        this._logger.log(R.Warning, "Timeout from HTTP request."), s(new mo());
      }, r.send(e.content);
    }) : Promise.reject(new Error("No url defined.")) : Promise.reject(new Error("No method defined."));
  }
}
class bi extends Gt {
  /** Creates a new instance of the {@link @microsoft/signalr.DefaultHttpClient}, using the provided {@link @microsoft/signalr.ILogger} to log messages. */
  constructor(e) {
    if (super(), typeof fetch < "u" || be.isNode)
      this._httpClient = new vi(e);
    else if (typeof XMLHttpRequest < "u")
      this._httpClient = new wi(e);
    else
      throw new Error("No usable HttpClient found.");
  }
  /** @inheritDoc */
  send(e) {
    return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new qe()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(new Error("No url defined.")) : Promise.reject(new Error("No method defined."));
  }
  getCookieString(e) {
    return this._httpClient.getCookieString(e);
  }
}
class Ue {
  static write(e) {
    return `${e}${Ue.RecordSeparator}`;
  }
  static parse(e) {
    if (e[e.length - 1] !== Ue.RecordSeparator)
      throw new Error("Message is incomplete.");
    const o = e.split(Ue.RecordSeparator);
    return o.pop(), o;
  }
}
Ue.RecordSeparatorCode = 30;
Ue.RecordSeparator = String.fromCharCode(Ue.RecordSeparatorCode);
class yi {
  // Handshake request is always JSON
  writeHandshakeRequest(e) {
    return Ue.write(JSON.stringify(e));
  }
  parseHandshakeResponse(e) {
    let o, s;
    if (ht(e)) {
      const a = new Uint8Array(e), d = a.indexOf(Ue.RecordSeparatorCode);
      if (d === -1)
        throw new Error("Message is incomplete.");
      const p = d + 1;
      o = String.fromCharCode.apply(null, Array.prototype.slice.call(a.slice(0, p))), s = a.byteLength > p ? a.slice(p).buffer : null;
    } else {
      const a = e, d = a.indexOf(Ue.RecordSeparator);
      if (d === -1)
        throw new Error("Message is incomplete.");
      const p = d + 1;
      o = a.substring(0, p), s = a.length > p ? a.substring(p) : null;
    }
    const r = Ue.parse(o), n = JSON.parse(r[0]);
    if (n.type)
      throw new Error("Expected a handshake response from the server.");
    return [s, n];
  }
}
var Q;
(function(t) {
  t[t.Invocation = 1] = "Invocation", t[t.StreamItem = 2] = "StreamItem", t[t.Completion = 3] = "Completion", t[t.StreamInvocation = 4] = "StreamInvocation", t[t.CancelInvocation = 5] = "CancelInvocation", t[t.Ping = 6] = "Ping", t[t.Close = 7] = "Close", t[t.Ack = 8] = "Ack", t[t.Sequence = 9] = "Sequence";
})(Q || (Q = {}));
class Ci {
  constructor() {
    this.observers = [];
  }
  next(e) {
    for (const o of this.observers)
      o.next(e);
  }
  error(e) {
    for (const o of this.observers)
      o.error && o.error(e);
  }
  complete() {
    for (const e of this.observers)
      e.complete && e.complete();
  }
  subscribe(e) {
    return this.observers.push(e), new di(this, e);
  }
}
class _i {
  constructor(e, o, s) {
    this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = o, this._bufferSize = s;
  }
  async _send(e) {
    const o = this._protocol.writeMessage(e);
    let s = Promise.resolve();
    if (this._isInvocationMessage(e)) {
      this._totalMessageCount++;
      let r = () => {
      }, n = () => {
      };
      ht(o) ? this._bufferedByteCount += o.byteLength : this._bufferedByteCount += o.length, this._bufferedByteCount >= this._bufferSize && (s = new Promise((l, a) => {
        r = l, n = a;
      })), this._messages.push(new Si(o, this._totalMessageCount, r, n));
    }
    try {
      this._reconnectInProgress || await this._connection.send(o);
    } catch {
      this._disconnected();
    }
    await s;
  }
  _ack(e) {
    let o = -1;
    for (let s = 0; s < this._messages.length; s++) {
      const r = this._messages[s];
      if (r._id <= e.sequenceId)
        o = s, ht(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
      else if (this._bufferedByteCount < this._bufferSize)
        r._resolver();
      else
        break;
    }
    o !== -1 && (this._messages = this._messages.slice(o + 1));
  }
  _shouldProcessMessage(e) {
    if (this._waitForSequenceMessage)
      return e.type !== Q.Sequence ? !1 : (this._waitForSequenceMessage = !1, !0);
    if (!this._isInvocationMessage(e))
      return !0;
    const o = this._nextReceivingSequenceId;
    return this._nextReceivingSequenceId++, o <= this._latestReceivedSequenceId ? (o === this._latestReceivedSequenceId && this._ackTimer(), !1) : (this._latestReceivedSequenceId = o, this._ackTimer(), !0);
  }
  _resetSequence(e) {
    if (e.sequenceId > this._nextReceivingSequenceId) {
      this._connection.stop(new Error("Sequence ID greater than amount of messages we've received."));
      return;
    }
    this._nextReceivingSequenceId = e.sequenceId;
  }
  _disconnected() {
    this._reconnectInProgress = !0, this._waitForSequenceMessage = !0;
  }
  async _resend() {
    const e = this._messages.length !== 0 ? this._messages[0]._id : this._totalMessageCount + 1;
    await this._connection.send(this._protocol.writeMessage({ type: Q.Sequence, sequenceId: e }));
    const o = this._messages;
    for (const s of o)
      await this._connection.send(s._message);
    this._reconnectInProgress = !1;
  }
  _dispose(e) {
    e ?? (e = new Error("Unable to reconnect to server."));
    for (const o of this._messages)
      o._rejector(e);
  }
  _isInvocationMessage(e) {
    switch (e.type) {
      case Q.Invocation:
      case Q.StreamItem:
      case Q.Completion:
      case Q.StreamInvocation:
      case Q.CancelInvocation:
        return !0;
      case Q.Close:
      case Q.Sequence:
      case Q.Ping:
      case Q.Ack:
        return !1;
    }
  }
  _ackTimer() {
    this._ackTimerHandle === void 0 && (this._ackTimerHandle = setTimeout(async () => {
      try {
        this._reconnectInProgress || await this._connection.send(this._protocol.writeMessage({ type: Q.Ack, sequenceId: this._latestReceivedSequenceId }));
      } catch {
      }
      clearTimeout(this._ackTimerHandle), this._ackTimerHandle = void 0;
    }, 1e3));
  }
}
class Si {
  constructor(e, o, s, r) {
    this._message = e, this._id = o, this._resolver = s, this._rejector = r;
  }
}
const ki = 30 * 1e3, Ri = 15 * 1e3, xi = 1e5;
var ve;
(function(t) {
  t.Disconnected = "Disconnected", t.Connecting = "Connecting", t.Connected = "Connected", t.Disconnecting = "Disconnecting", t.Reconnecting = "Reconnecting";
})(ve || (ve = {}));
class vo {
  /** @internal */
  // Using a public static factory method means we can have a private constructor and an _internal_
  // create method that can be used by HubConnectionBuilder. An "internal" constructor would just
  // be stripped away and the '.d.ts' file would have no constructor, which is interpreted as a
  // public parameter-less constructor.
  static create(e, o, s, r, n, l, a) {
    return new vo(e, o, s, r, n, l, a);
  }
  constructor(e, o, s, r, n, l, a) {
    this._nextKeepAlive = 0, this._freezeEventListener = () => {
      this._logger.log(R.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
    }, Re.isRequired(e, "connection"), Re.isRequired(o, "logger"), Re.isRequired(s, "protocol"), this.serverTimeoutInMilliseconds = n ?? ki, this.keepAliveIntervalInMilliseconds = l ?? Ri, this._statefulReconnectBufferSize = a ?? xi, this._logger = o, this._protocol = s, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new yi(), this.connection.onreceive = (d) => this._processIncomingData(d), this.connection.onclose = (d) => this._connectionClosed(d), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = ve.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Q.Ping });
  }
  /** Indicates the state of the {@link HubConnection} to the server. */
  get state() {
    return this._connectionState;
  }
  /** Represents the connection id of the {@link HubConnection} on the server. The connection id will be null when the connection is either
   *  in the disconnected state or if the negotiation step was skipped.
   */
  get connectionId() {
    return this.connection && this.connection.connectionId || null;
  }
  /** Indicates the url of the {@link HubConnection} to the server. */
  get baseUrl() {
    return this.connection.baseUrl || "";
  }
  /**
   * Sets a new url for the HubConnection. Note that the url can only be changed when the connection is in either the Disconnected or
   * Reconnecting states.
   * @param {string} url The url to connect to.
   */
  set baseUrl(e) {
    if (this._connectionState !== ve.Disconnected && this._connectionState !== ve.Reconnecting)
      throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
    if (!e)
      throw new Error("The HubConnection url must be a valid url.");
    this.connection.baseUrl = e;
  }
  /** Starts the connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
   */
  start() {
    return this._startPromise = this._startWithStateTransitions(), this._startPromise;
  }
  async _startWithStateTransitions() {
    if (this._connectionState !== ve.Disconnected)
      return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
    this._connectionState = ve.Connecting, this._logger.log(R.Debug, "Starting HubConnection.");
    try {
      await this._startInternal(), be.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = ve.Connected, this._connectionStarted = !0, this._logger.log(R.Debug, "HubConnection connected successfully.");
    } catch (e) {
      return this._connectionState = ve.Disconnected, this._logger.log(R.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
    }
  }
  async _startInternal() {
    this._stopDuringStartError = void 0, this._receivedHandshakeResponse = !1;
    const e = new Promise((o, s) => {
      this._handshakeResolver = o, this._handshakeRejecter = s;
    });
    await this.connection.start(this._protocol.transferFormat);
    try {
      let o = this._protocol.version;
      this.connection.features.reconnect || (o = 1);
      const s = {
        protocol: this._protocol.name,
        version: o
      };
      if (this._logger.log(R.Debug, "Sending handshake request."), await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(s)), this._logger.log(R.Information, `Using HubProtocol '${this._protocol.name}'.`), this._cleanupTimeout(), this._resetTimeoutPeriod(), this._resetKeepAliveInterval(), await e, this._stopDuringStartError)
        throw this._stopDuringStartError;
      (this.connection.features.reconnect || !1) && (this._messageBuffer = new _i(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
        if (this._messageBuffer)
          return this._messageBuffer._resend();
      }), this.connection.features.inherentKeepAlive || await this._sendMessage(this._cachedPingMessage);
    } catch (o) {
      throw this._logger.log(R.Debug, `Hub handshake failed with error '${o}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(o), o;
    }
  }
  /** Stops the connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
   */
  async stop() {
    const e = this._startPromise;
    this.connection.features.reconnect = !1, this._stopPromise = this._stopInternal(), await this._stopPromise;
    try {
      await e;
    } catch {
    }
  }
  _stopInternal(e) {
    if (this._connectionState === ve.Disconnected)
      return this._logger.log(R.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
    if (this._connectionState === ve.Disconnecting)
      return this._logger.log(R.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
    const o = this._connectionState;
    return this._connectionState = ve.Disconnecting, this._logger.log(R.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(R.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (o === ve.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new qe("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
  }
  async _sendCloseMessage() {
    try {
      await this._sendWithProtocol(this._createCloseMessage());
    } catch {
    }
  }
  /** Invokes a streaming hub method on the server using the specified name and arguments.
   *
   * @typeparam T The type of the items returned by the server.
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
   */
  stream(e, ...o) {
    const [s, r] = this._replaceStreamingParams(o), n = this._createStreamInvocation(e, o, r);
    let l;
    const a = new Ci();
    return a.cancelCallback = () => {
      const d = this._createCancelInvocation(n.invocationId);
      return delete this._callbacks[n.invocationId], l.then(() => this._sendWithProtocol(d));
    }, this._callbacks[n.invocationId] = (d, p) => {
      if (p) {
        a.error(p);
        return;
      } else d && (d.type === Q.Completion ? d.error ? a.error(new Error(d.error)) : a.complete() : a.next(d.item));
    }, l = this._sendWithProtocol(n).catch((d) => {
      a.error(d), delete this._callbacks[n.invocationId];
    }), this._launchStreams(s, l), a;
  }
  _sendMessage(e) {
    return this._resetKeepAliveInterval(), this.connection.send(e);
  }
  /**
   * Sends a js object to the server.
   * @param message The js object to serialize and send.
   */
  _sendWithProtocol(e) {
    return this._messageBuffer ? this._messageBuffer._send(e) : this._sendMessage(this._protocol.writeMessage(e));
  }
  /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
   *
   * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
   * be processing the invocation.
   *
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
   */
  send(e, ...o) {
    const [s, r] = this._replaceStreamingParams(o), n = this._sendWithProtocol(this._createInvocation(e, o, !0, r));
    return this._launchStreams(s, n), n;
  }
  /** Invokes a hub method on the server using the specified name and arguments.
   *
   * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
   * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
   * resolving the Promise.
   *
   * @typeparam T The expected return type.
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
   */
  invoke(e, ...o) {
    const [s, r] = this._replaceStreamingParams(o), n = this._createInvocation(e, o, !1, r);
    return new Promise((a, d) => {
      this._callbacks[n.invocationId] = (c, y) => {
        if (y) {
          d(y);
          return;
        } else c && (c.type === Q.Completion ? c.error ? d(new Error(c.error)) : a(c.result) : d(new Error(`Unexpected message type: ${c.type}`)));
      };
      const p = this._sendWithProtocol(n).catch((c) => {
        d(c), delete this._callbacks[n.invocationId];
      });
      this._launchStreams(s, p);
    });
  }
  on(e, o) {
    !e || !o || (e = e.toLowerCase(), this._methods[e] || (this._methods[e] = []), this._methods[e].indexOf(o) === -1 && this._methods[e].push(o));
  }
  off(e, o) {
    if (!e)
      return;
    e = e.toLowerCase();
    const s = this._methods[e];
    if (s)
      if (o) {
        const r = s.indexOf(o);
        r !== -1 && (s.splice(r, 1), s.length === 0 && delete this._methods[e]);
      } else
        delete this._methods[e];
  }
  /** Registers a handler that will be invoked when the connection is closed.
   *
   * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
   */
  onclose(e) {
    e && this._closedCallbacks.push(e);
  }
  /** Registers a handler that will be invoked when the connection starts reconnecting.
   *
   * @param {Function} callback The handler that will be invoked when the connection starts reconnecting. Optionally receives a single argument containing the error that caused the connection to start reconnecting (if any).
   */
  onreconnecting(e) {
    e && this._reconnectingCallbacks.push(e);
  }
  /** Registers a handler that will be invoked when the connection successfully reconnects.
   *
   * @param {Function} callback The handler that will be invoked when the connection successfully reconnects.
   */
  onreconnected(e) {
    e && this._reconnectedCallbacks.push(e);
  }
  _processIncomingData(e) {
    if (this._cleanupTimeout(), this._receivedHandshakeResponse || (e = this._processHandshakeResponse(e), this._receivedHandshakeResponse = !0), e) {
      const o = this._protocol.parseMessages(e, this._logger);
      for (const s of o)
        if (!(this._messageBuffer && !this._messageBuffer._shouldProcessMessage(s)))
          switch (s.type) {
            case Q.Invocation:
              this._invokeClientMethod(s).catch((r) => {
                this._logger.log(R.Error, `Invoke client method threw error: ${to(r)}`);
              });
              break;
            case Q.StreamItem:
            case Q.Completion: {
              const r = this._callbacks[s.invocationId];
              if (r) {
                s.type === Q.Completion && delete this._callbacks[s.invocationId];
                try {
                  r(s);
                } catch (n) {
                  this._logger.log(R.Error, `Stream callback threw error: ${to(n)}`);
                }
              }
              break;
            }
            case Q.Ping:
              break;
            case Q.Close: {
              this._logger.log(R.Information, "Close message received from server.");
              const r = s.error ? new Error("Server returned an error on close: " + s.error) : void 0;
              s.allowReconnect === !0 ? this.connection.stop(r) : this._stopPromise = this._stopInternal(r);
              break;
            }
            case Q.Ack:
              this._messageBuffer && this._messageBuffer._ack(s);
              break;
            case Q.Sequence:
              this._messageBuffer && this._messageBuffer._resetSequence(s);
              break;
            default:
              this._logger.log(R.Warning, `Invalid message type: ${s.type}.`);
              break;
          }
    }
    this._resetTimeoutPeriod();
  }
  _processHandshakeResponse(e) {
    let o, s;
    try {
      [s, o] = this._handshakeProtocol.parseHandshakeResponse(e);
    } catch (r) {
      const n = "Error parsing handshake response: " + r;
      this._logger.log(R.Error, n);
      const l = new Error(n);
      throw this._handshakeRejecter(l), l;
    }
    if (o.error) {
      const r = "Server returned handshake error: " + o.error;
      this._logger.log(R.Error, r);
      const n = new Error(r);
      throw this._handshakeRejecter(n), n;
    } else
      this._logger.log(R.Debug, "Server handshake complete.");
    return this._handshakeResolver(), s;
  }
  _resetKeepAliveInterval() {
    this.connection.features.inherentKeepAlive || (this._nextKeepAlive = (/* @__PURE__ */ new Date()).getTime() + this.keepAliveIntervalInMilliseconds, this._cleanupPingTimer());
  }
  _resetTimeoutPeriod() {
    if ((!this.connection.features || !this.connection.features.inherentKeepAlive) && (this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds), this._pingServerHandle === void 0)) {
      let e = this._nextKeepAlive - (/* @__PURE__ */ new Date()).getTime();
      e < 0 && (e = 0), this._pingServerHandle = setTimeout(async () => {
        if (this._connectionState === ve.Connected)
          try {
            await this._sendMessage(this._cachedPingMessage);
          } catch {
            this._cleanupPingTimer();
          }
      }, e);
    }
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  serverTimeout() {
    this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
  }
  async _invokeClientMethod(e) {
    const o = e.target.toLowerCase(), s = this._methods[o];
    if (!s) {
      this._logger.log(R.Warning, `No client method with the name '${o}' found.`), e.invocationId && (this._logger.log(R.Warning, `No result given for '${o}' method and invocation ID '${e.invocationId}'.`), await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)));
      return;
    }
    const r = s.slice(), n = !!e.invocationId;
    let l, a, d;
    for (const p of r)
      try {
        const c = l;
        l = await p.apply(this, e.arguments), n && l && c && (this._logger.log(R.Error, `Multiple results provided for '${o}'. Sending error to server.`), d = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null)), a = void 0;
      } catch (c) {
        a = c, this._logger.log(R.Error, `A callback for the method '${o}' threw error '${c}'.`);
      }
    d ? await this._sendWithProtocol(d) : n ? (a ? d = this._createCompletionMessage(e.invocationId, `${a}`, null) : l !== void 0 ? d = this._createCompletionMessage(e.invocationId, null, l) : (this._logger.log(R.Warning, `No result given for '${o}' method and invocation ID '${e.invocationId}'.`), d = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)), await this._sendWithProtocol(d)) : l && this._logger.log(R.Error, `Result given for '${o}' method but server is not expecting a result.`);
  }
  _connectionClosed(e) {
    this._logger.log(R.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new qe("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || new Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === ve.Disconnecting ? this._completeClose(e) : this._connectionState === ve.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === ve.Connected && this._completeClose(e);
  }
  _completeClose(e) {
    if (this._connectionStarted) {
      this._connectionState = ve.Disconnected, this._connectionStarted = !1, this._messageBuffer && (this._messageBuffer._dispose(e ?? new Error("Connection closed.")), this._messageBuffer = void 0), be.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
      try {
        this._closedCallbacks.forEach((o) => o.apply(this, [e]));
      } catch (o) {
        this._logger.log(R.Error, `An onclose callback called with error '${e}' threw error '${o}'.`);
      }
    }
  }
  async _reconnect(e) {
    const o = Date.now();
    let s = 0, r = e !== void 0 ? e : new Error("Attempting to reconnect due to a unknown error."), n = this._getNextRetryDelay(s++, 0, r);
    if (n === null) {
      this._logger.log(R.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
      return;
    }
    if (this._connectionState = ve.Reconnecting, e ? this._logger.log(R.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(R.Information, "Connection reconnecting."), this._reconnectingCallbacks.length !== 0) {
      try {
        this._reconnectingCallbacks.forEach((l) => l.apply(this, [e]));
      } catch (l) {
        this._logger.log(R.Error, `An onreconnecting callback called with error '${e}' threw error '${l}'.`);
      }
      if (this._connectionState !== ve.Reconnecting) {
        this._logger.log(R.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
        return;
      }
    }
    for (; n !== null; ) {
      if (this._logger.log(R.Information, `Reconnect attempt number ${s} will start in ${n} ms.`), await new Promise((l) => {
        this._reconnectDelayHandle = setTimeout(l, n);
      }), this._reconnectDelayHandle = void 0, this._connectionState !== ve.Reconnecting) {
        this._logger.log(R.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
        return;
      }
      try {
        if (await this._startInternal(), this._connectionState = ve.Connected, this._logger.log(R.Information, "HubConnection reconnected successfully."), this._reconnectedCallbacks.length !== 0)
          try {
            this._reconnectedCallbacks.forEach((l) => l.apply(this, [this.connection.connectionId]));
          } catch (l) {
            this._logger.log(R.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${l}'.`);
          }
        return;
      } catch (l) {
        if (this._logger.log(R.Information, `Reconnect attempt failed because of error '${l}'.`), this._connectionState !== ve.Reconnecting) {
          this._logger.log(R.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`), this._connectionState === ve.Disconnecting && this._completeClose();
          return;
        }
        r = l instanceof Error ? l : new Error(l.toString()), n = this._getNextRetryDelay(s++, Date.now() - o, r);
      }
    }
    this._logger.log(R.Information, `Reconnect retries have been exhausted after ${Date.now() - o} ms and ${s} failed attempts. Connection disconnecting.`), this._completeClose();
  }
  _getNextRetryDelay(e, o, s) {
    try {
      return this._reconnectPolicy.nextRetryDelayInMilliseconds({
        elapsedMilliseconds: o,
        previousRetryCount: e,
        retryReason: s
      });
    } catch (r) {
      return this._logger.log(R.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${o}) threw error '${r}'.`), null;
    }
  }
  _cancelCallbacksWithError(e) {
    const o = this._callbacks;
    this._callbacks = {}, Object.keys(o).forEach((s) => {
      const r = o[s];
      try {
        r(null, e);
      } catch (n) {
        this._logger.log(R.Error, `Stream 'error' callback called with '${e}' threw error: ${to(n)}`);
      }
    });
  }
  _cleanupPingTimer() {
    this._pingServerHandle && (clearTimeout(this._pingServerHandle), this._pingServerHandle = void 0);
  }
  _cleanupTimeout() {
    this._timeoutHandle && clearTimeout(this._timeoutHandle);
  }
  _createInvocation(e, o, s, r) {
    if (s)
      return r.length !== 0 ? {
        arguments: o,
        streamIds: r,
        target: e,
        type: Q.Invocation
      } : {
        arguments: o,
        target: e,
        type: Q.Invocation
      };
    {
      const n = this._invocationId;
      return this._invocationId++, r.length !== 0 ? {
        arguments: o,
        invocationId: n.toString(),
        streamIds: r,
        target: e,
        type: Q.Invocation
      } : {
        arguments: o,
        invocationId: n.toString(),
        target: e,
        type: Q.Invocation
      };
    }
  }
  _launchStreams(e, o) {
    if (e.length !== 0) {
      o || (o = Promise.resolve());
      for (const s in e)
        e[s].subscribe({
          complete: () => {
            o = o.then(() => this._sendWithProtocol(this._createCompletionMessage(s)));
          },
          error: (r) => {
            let n;
            r instanceof Error ? n = r.message : r && r.toString ? n = r.toString() : n = "Unknown error", o = o.then(() => this._sendWithProtocol(this._createCompletionMessage(s, n)));
          },
          next: (r) => {
            o = o.then(() => this._sendWithProtocol(this._createStreamItemMessage(s, r)));
          }
        });
    }
  }
  _replaceStreamingParams(e) {
    const o = [], s = [];
    for (let r = 0; r < e.length; r++) {
      const n = e[r];
      if (this._isObservable(n)) {
        const l = this._invocationId;
        this._invocationId++, o[l] = n, s.push(l.toString()), e.splice(r, 1);
      }
    }
    return [o, s];
  }
  _isObservable(e) {
    return e && e.subscribe && typeof e.subscribe == "function";
  }
  _createStreamInvocation(e, o, s) {
    const r = this._invocationId;
    return this._invocationId++, s.length !== 0 ? {
      arguments: o,
      invocationId: r.toString(),
      streamIds: s,
      target: e,
      type: Q.StreamInvocation
    } : {
      arguments: o,
      invocationId: r.toString(),
      target: e,
      type: Q.StreamInvocation
    };
  }
  _createCancelInvocation(e) {
    return {
      invocationId: e,
      type: Q.CancelInvocation
    };
  }
  _createStreamItemMessage(e, o) {
    return {
      invocationId: e,
      item: o,
      type: Q.StreamItem
    };
  }
  _createCompletionMessage(e, o, s) {
    return o ? {
      error: o,
      invocationId: e,
      type: Q.Completion
    } : {
      invocationId: e,
      result: s,
      type: Q.Completion
    };
  }
  _createCloseMessage() {
    return { type: Q.Close };
  }
}
const Ii = [0, 2e3, 1e4, 3e4, null];
class Fo {
  constructor(e) {
    this._retryDelays = e !== void 0 ? [...e, null] : Ii;
  }
  nextRetryDelayInMilliseconds(e) {
    return this._retryDelays[e.previousRetryCount];
  }
}
class dt {
}
dt.Authorization = "Authorization";
dt.Cookie = "Cookie";
class Ei extends Gt {
  constructor(e, o) {
    super(), this._innerClient = e, this._accessTokenFactory = o;
  }
  async send(e) {
    let o = !0;
    this._accessTokenFactory && (!this._accessToken || e.url && e.url.indexOf("/negotiate?") > 0) && (o = !1, this._accessToken = await this._accessTokenFactory()), this._setAuthorizationHeader(e);
    const s = await this._innerClient.send(e);
    return o && s.statusCode === 401 && this._accessTokenFactory ? (this._accessToken = await this._accessTokenFactory(), this._setAuthorizationHeader(e), await this._innerClient.send(e)) : s;
  }
  _setAuthorizationHeader(e) {
    e.headers || (e.headers = {}), this._accessToken ? e.headers[dt.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[dt.Authorization] && delete e.headers[dt.Authorization];
  }
  getCookieString(e) {
    return this._innerClient.getCookieString(e);
  }
}
var Ce;
(function(t) {
  t[t.None = 0] = "None", t[t.WebSockets = 1] = "WebSockets", t[t.ServerSentEvents = 2] = "ServerSentEvents", t[t.LongPolling = 4] = "LongPolling";
})(Ce || (Ce = {}));
var Me;
(function(t) {
  t[t.Text = 1] = "Text", t[t.Binary = 2] = "Binary";
})(Me || (Me = {}));
let $i = class {
  constructor() {
    this._isAborted = !1, this.onabort = null;
  }
  abort() {
    this._isAborted || (this._isAborted = !0, this.onabort && this.onabort());
  }
  get signal() {
    return this;
  }
  get aborted() {
    return this._isAborted;
  }
};
class Bo {
  // This is an internal type, not exported from 'index' so this is really just internal.
  get pollAborted() {
    return this._pollAbort.aborted;
  }
  constructor(e, o, s) {
    this._httpClient = e, this._logger = o, this._pollAbort = new $i(), this._options = s, this._running = !1, this.onreceive = null, this.onclose = null;
  }
  async connect(e, o) {
    if (Re.isRequired(e, "url"), Re.isRequired(o, "transferFormat"), Re.isIn(o, Me, "transferFormat"), this._url = e, this._logger.log(R.Trace, "(LongPolling transport) Connecting."), o === Me.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string")
      throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
    const [s, r] = _t(), n = { [s]: r, ...this._options.headers }, l = {
      abortSignal: this._pollAbort.signal,
      headers: n,
      timeout: 1e5,
      withCredentials: this._options.withCredentials
    };
    o === Me.Binary && (l.responseType = "arraybuffer");
    const a = `${e}&_=${Date.now()}`;
    this._logger.log(R.Trace, `(LongPolling transport) polling: ${a}.`);
    const d = await this._httpClient.get(a, l);
    d.statusCode !== 200 ? (this._logger.log(R.Error, `(LongPolling transport) Unexpected response code: ${d.statusCode}.`), this._closeError = new ut(d.statusText || "", d.statusCode), this._running = !1) : this._running = !0, this._receiving = this._poll(this._url, l);
  }
  async _poll(e, o) {
    try {
      for (; this._running; )
        try {
          const s = `${e}&_=${Date.now()}`;
          this._logger.log(R.Trace, `(LongPolling transport) polling: ${s}.`);
          const r = await this._httpClient.get(s, o);
          r.statusCode === 204 ? (this._logger.log(R.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode !== 200 ? (this._logger.log(R.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new ut(r.statusText || "", r.statusCode), this._running = !1) : r.content ? (this._logger.log(R.Trace, `(LongPolling transport) data received. ${Ft(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(R.Trace, "(LongPolling transport) Poll timed out, reissuing.");
        } catch (s) {
          this._running ? s instanceof mo ? this._logger.log(R.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = s, this._running = !1) : this._logger.log(R.Trace, `(LongPolling transport) Poll errored after shutdown: ${s.message}`);
        }
    } finally {
      this._logger.log(R.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
    }
  }
  async send(e) {
    return this._running ? an(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(new Error("Cannot send until the transport is connected"));
  }
  async stop() {
    this._logger.log(R.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
    try {
      await this._receiving, this._logger.log(R.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
      const e = {}, [o, s] = _t();
      e[o] = s;
      const r = {
        headers: { ...e, ...this._options.headers },
        timeout: this._options.timeout,
        withCredentials: this._options.withCredentials
      };
      let n;
      try {
        await this._httpClient.delete(this._url, r);
      } catch (l) {
        n = l;
      }
      n ? n instanceof ut && (n.statusCode === 404 ? this._logger.log(R.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(R.Trace, `(LongPolling transport) Error sending a DELETE request: ${n}`)) : this._logger.log(R.Trace, "(LongPolling transport) DELETE request accepted.");
    } finally {
      this._logger.log(R.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
    }
  }
  _raiseOnClose() {
    if (this.onclose) {
      let e = "(LongPolling transport) Firing onclose event.";
      this._closeError && (e += " Error: " + this._closeError), this._logger.log(R.Trace, e), this.onclose(this._closeError);
    }
  }
}
class Ti {
  constructor(e, o, s, r) {
    this._httpClient = e, this._accessToken = o, this._logger = s, this._options = r, this.onreceive = null, this.onclose = null;
  }
  async connect(e, o) {
    return Re.isRequired(e, "url"), Re.isRequired(o, "transferFormat"), Re.isIn(o, Me, "transferFormat"), this._logger.log(R.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((s, r) => {
      let n = !1;
      if (o !== Me.Text) {
        r(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
        return;
      }
      let l;
      if (be.isBrowser || be.isWebWorker)
        l = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
      else {
        const a = this._httpClient.getCookieString(e), d = {};
        d.Cookie = a;
        const [p, c] = _t();
        d[p] = c, l = new this._options.EventSource(e, { withCredentials: this._options.withCredentials, headers: { ...d, ...this._options.headers } });
      }
      try {
        l.onmessage = (a) => {
          if (this.onreceive)
            try {
              this._logger.log(R.Trace, `(SSE transport) data received. ${Ft(a.data, this._options.logMessageContent)}.`), this.onreceive(a.data);
            } catch (d) {
              this._close(d);
              return;
            }
        }, l.onerror = (a) => {
          n ? this._close() : r(new Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
        }, l.onopen = () => {
          this._logger.log(R.Information, `SSE connected to ${this._url}`), this._eventSource = l, n = !0, s();
        };
      } catch (a) {
        r(a);
        return;
      }
    });
  }
  async send(e) {
    return this._eventSource ? an(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(new Error("Cannot send until the transport is connected"));
  }
  stop() {
    return this._close(), Promise.resolve();
  }
  _close(e) {
    this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
  }
}
class Ai {
  constructor(e, o, s, r, n, l) {
    this._logger = s, this._accessTokenFactory = o, this._logMessageContent = r, this._webSocketConstructor = n, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = l;
  }
  async connect(e, o) {
    Re.isRequired(e, "url"), Re.isRequired(o, "transferFormat"), Re.isIn(o, Me, "transferFormat"), this._logger.log(R.Trace, "(WebSockets transport) Connecting.");
    let s;
    return this._accessTokenFactory && (s = await this._accessTokenFactory()), new Promise((r, n) => {
      e = e.replace(/^http/, "ws");
      let l;
      const a = this._httpClient.getCookieString(e);
      let d = !1;
      if (be.isNode || be.isReactNative) {
        const p = {}, [c, y] = _t();
        p[c] = y, s && (p[dt.Authorization] = `Bearer ${s}`), a && (p[dt.Cookie] = a), l = new this._webSocketConstructor(e, void 0, {
          headers: { ...p, ...this._headers }
        });
      } else
        s && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(s)}`);
      l || (l = new this._webSocketConstructor(e)), o === Me.Binary && (l.binaryType = "arraybuffer"), l.onopen = (p) => {
        this._logger.log(R.Information, `WebSocket connected to ${e}.`), this._webSocket = l, d = !0, r();
      }, l.onerror = (p) => {
        let c = null;
        typeof ErrorEvent < "u" && p instanceof ErrorEvent ? c = p.error : c = "There was an error with the transport", this._logger.log(R.Information, `(WebSockets transport) ${c}.`);
      }, l.onmessage = (p) => {
        if (this._logger.log(R.Trace, `(WebSockets transport) data received. ${Ft(p.data, this._logMessageContent)}.`), this.onreceive)
          try {
            this.onreceive(p.data);
          } catch (c) {
            this._close(c);
            return;
          }
      }, l.onclose = (p) => {
        if (d)
          this._close(p);
        else {
          let c = null;
          typeof ErrorEvent < "u" && p instanceof ErrorEvent ? c = p.error : c = "WebSocket failed to connect. The connection could not be found on the server, either the endpoint may not be a SignalR endpoint, the connection ID is not present on the server, or there is a proxy blocking WebSockets. If you have multiple servers check that sticky sessions are enabled.", n(new Error(c));
        }
      };
    });
  }
  send(e) {
    return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(R.Trace, `(WebSockets transport) sending data. ${Ft(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
  }
  stop() {
    return this._webSocket && this._close(void 0), Promise.resolve();
  }
  _close(e) {
    this._webSocket && (this._webSocket.onclose = () => {
    }, this._webSocket.onmessage = () => {
    }, this._webSocket.onerror = () => {
    }, this._webSocket.close(), this._webSocket = void 0), this._logger.log(R.Trace, "(WebSockets transport) socket closed."), this.onclose && (this._isCloseEvent(e) && (e.wasClean === !1 || e.code !== 1e3) ? this.onclose(new Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)) : e instanceof Error ? this.onclose(e) : this.onclose());
  }
  _isCloseEvent(e) {
    return e && typeof e.wasClean == "boolean" && typeof e.code == "number";
  }
}
const Vo = 100;
class Mi {
  constructor(e, o = {}) {
    if (this._stopPromiseResolver = () => {
    }, this.features = {}, this._negotiateVersion = 1, Re.isRequired(e, "url"), this._logger = ui(o.logger), this.baseUrl = this._resolveUrl(e), o = o || {}, o.logMessageContent = o.logMessageContent === void 0 ? !1 : o.logMessageContent, typeof o.withCredentials == "boolean" || o.withCredentials === void 0)
      o.withCredentials = o.withCredentials === void 0 ? !0 : o.withCredentials;
    else
      throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");
    o.timeout = o.timeout === void 0 ? 100 * 1e3 : o.timeout;
    let s = null, r = null;
    if (be.isNode && typeof require < "u") {
      const n = typeof __webpack_require__ == "function" ? __non_webpack_require__ : require;
      s = n("ws"), r = n("eventsource");
    }
    !be.isNode && typeof WebSocket < "u" && !o.WebSocket ? o.WebSocket = WebSocket : be.isNode && !o.WebSocket && s && (o.WebSocket = s), !be.isNode && typeof EventSource < "u" && !o.EventSource ? o.EventSource = EventSource : be.isNode && !o.EventSource && typeof r < "u" && (o.EventSource = r), this._httpClient = new Ei(o.httpClient || new bi(this._logger), o.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = o, this.onreceive = null, this.onclose = null;
  }
  async start(e) {
    if (e = e || Me.Binary, Re.isIn(e, Me, "transferFormat"), this._logger.log(R.Debug, `Starting connection with transfer format '${Me[e]}'.`), this._connectionState !== "Disconnected")
      return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
    if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
      const o = "Failed to start the HttpConnection before stop() was called.";
      return this._logger.log(R.Error, o), await this._stopPromise, Promise.reject(new qe(o));
    } else if (this._connectionState !== "Connected") {
      const o = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
      return this._logger.log(R.Error, o), Promise.reject(new qe(o));
    }
    this._connectionStarted = !0;
  }
  send(e) {
    return this._connectionState !== "Connected" ? Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State.")) : (this._sendQueue || (this._sendQueue = new wo(this.transport)), this._sendQueue.send(e));
  }
  async stop(e) {
    if (this._connectionState === "Disconnected")
      return this._logger.log(R.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve();
    if (this._connectionState === "Disconnecting")
      return this._logger.log(R.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
    this._connectionState = "Disconnecting", this._stopPromise = new Promise((o) => {
      this._stopPromiseResolver = o;
    }), await this._stopInternal(e), await this._stopPromise;
  }
  async _stopInternal(e) {
    this._stopError = e;
    try {
      await this._startInternalPromise;
    } catch {
    }
    if (this.transport) {
      try {
        await this.transport.stop();
      } catch (o) {
        this._logger.log(R.Error, `HttpConnection.transport.stop() threw error '${o}'.`), this._stopConnection();
      }
      this.transport = void 0;
    } else
      this._logger.log(R.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
  }
  async _startInternal(e) {
    let o = this.baseUrl;
    this._accessTokenFactory = this._options.accessTokenFactory, this._httpClient._accessTokenFactory = this._accessTokenFactory;
    try {
      if (this._options.skipNegotiation)
        if (this._options.transport === Ce.WebSockets)
          this.transport = this._constructTransport(Ce.WebSockets), await this._startTransport(o, e);
        else
          throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");
      else {
        let s = null, r = 0;
        do {
          if (s = await this._getNegotiationResponse(o), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected")
            throw new qe("The connection was stopped during negotiation.");
          if (s.error)
            throw new Error(s.error);
          if (s.ProtocolVersion)
            throw new Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
          if (s.url && (o = s.url), s.accessToken) {
            const n = s.accessToken;
            this._accessTokenFactory = () => n, this._httpClient._accessToken = n, this._httpClient._accessTokenFactory = void 0;
          }
          r++;
        } while (s.url && r < Vo);
        if (r === Vo && s.url)
          throw new Error("Negotiate redirection limit exceeded.");
        await this._createTransport(o, this._options.transport, s, e);
      }
      this.transport instanceof Bo && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(R.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
    } catch (s) {
      return this._logger.log(R.Error, "Failed to start the connection: " + s), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(s);
    }
  }
  async _getNegotiationResponse(e) {
    const o = {}, [s, r] = _t();
    o[s] = r;
    const n = this._resolveNegotiateUrl(e);
    this._logger.log(R.Debug, `Sending negotiation request: ${n}.`);
    try {
      const l = await this._httpClient.post(n, {
        content: "",
        headers: { ...o, ...this._options.headers },
        timeout: this._options.timeout,
        withCredentials: this._options.withCredentials
      });
      if (l.statusCode !== 200)
        return Promise.reject(new Error(`Unexpected status code returned from negotiate '${l.statusCode}'`));
      const a = JSON.parse(l.content);
      return (!a.negotiateVersion || a.negotiateVersion < 1) && (a.connectionToken = a.connectionId), a.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new Do("Client didn't negotiate Stateful Reconnect but the server did.")) : a;
    } catch (l) {
      let a = "Failed to complete negotiation with the server: " + l;
      return l instanceof ut && l.statusCode === 404 && (a = a + " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(R.Error, a), Promise.reject(new Do(a));
    }
  }
  _createConnectUrl(e, o) {
    return o ? e + (e.indexOf("?") === -1 ? "?" : "&") + `id=${o}` : e;
  }
  async _createTransport(e, o, s, r) {
    let n = this._createConnectUrl(e, s.connectionToken);
    if (this._isITransport(o)) {
      this._logger.log(R.Debug, "Connection was provided an instance of ITransport, using that directly."), this.transport = o, await this._startTransport(n, r), this.connectionId = s.connectionId;
      return;
    }
    const l = [], a = s.availableTransports || [];
    let d = s;
    for (const p of a) {
      const c = this._resolveTransportOrError(p, o, r, (d == null ? void 0 : d.useStatefulReconnect) === !0);
      if (c instanceof Error)
        l.push(`${p.transport} failed:`), l.push(c);
      else if (this._isITransport(c)) {
        if (this.transport = c, !d) {
          try {
            d = await this._getNegotiationResponse(e);
          } catch (y) {
            return Promise.reject(y);
          }
          n = this._createConnectUrl(e, d.connectionToken);
        }
        try {
          await this._startTransport(n, r), this.connectionId = d.connectionId;
          return;
        } catch (y) {
          if (this._logger.log(R.Error, `Failed to start the transport '${p.transport}': ${y}`), d = void 0, l.push(new ii(`${p.transport} failed: ${y}`, Ce[p.transport])), this._connectionState !== "Connecting") {
            const u = "Failed to select transport before stop() was called.";
            return this._logger.log(R.Debug, u), Promise.reject(new qe(u));
          }
        }
      }
    }
    return l.length > 0 ? Promise.reject(new li(`Unable to connect to the server with any of the available transports. ${l.join(" ")}`, l)) : Promise.reject(new Error("None of the transports supported by the client are supported by the server."));
  }
  _constructTransport(e) {
    switch (e) {
      case Ce.WebSockets:
        if (!this._options.WebSocket)
          throw new Error("'WebSocket' is not supported in your environment.");
        return new Ai(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
      case Ce.ServerSentEvents:
        if (!this._options.EventSource)
          throw new Error("'EventSource' is not supported in your environment.");
        return new Ti(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
      case Ce.LongPolling:
        return new Bo(this._httpClient, this._logger, this._options);
      default:
        throw new Error(`Unknown transport: ${e}.`);
    }
  }
  _startTransport(e, o) {
    return this.transport.onreceive = this.onreceive, this.features.reconnect ? this.transport.onclose = async (s) => {
      let r = !1;
      if (this.features.reconnect)
        try {
          this.features.disconnected(), await this.transport.connect(e, o), await this.features.resend();
        } catch {
          r = !0;
        }
      else {
        this._stopConnection(s);
        return;
      }
      r && this._stopConnection(s);
    } : this.transport.onclose = (s) => this._stopConnection(s), this.transport.connect(e, o);
  }
  _resolveTransportOrError(e, o, s, r) {
    const n = Ce[e.transport];
    if (n == null)
      return this._logger.log(R.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), new Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
    if (Hi(o, n))
      if (e.transferFormats.map((a) => Me[a]).indexOf(s) >= 0) {
        if (n === Ce.WebSockets && !this._options.WebSocket || n === Ce.ServerSentEvents && !this._options.EventSource)
          return this._logger.log(R.Debug, `Skipping transport '${Ce[n]}' because it is not supported in your environment.'`), new si(`'${Ce[n]}' is not supported in your environment.`, n);
        this._logger.log(R.Debug, `Selecting transport '${Ce[n]}'.`);
        try {
          return this.features.reconnect = n === Ce.WebSockets ? r : void 0, this._constructTransport(n);
        } catch (a) {
          return a;
        }
      } else
        return this._logger.log(R.Debug, `Skipping transport '${Ce[n]}' because it does not support the requested transfer format '${Me[s]}'.`), new Error(`'${Ce[n]}' does not support ${Me[s]}.`);
    else
      return this._logger.log(R.Debug, `Skipping transport '${Ce[n]}' because it was disabled by the client.`), new ri(`'${Ce[n]}' is disabled by the client.`, n);
  }
  _isITransport(e) {
    return e && typeof e == "object" && "connect" in e;
  }
  _stopConnection(e) {
    if (this._logger.log(R.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") {
      this._logger.log(R.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
      return;
    }
    if (this._connectionState === "Connecting")
      throw this._logger.log(R.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`), new Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);
    if (this._connectionState === "Disconnecting" && this._stopPromiseResolver(), e ? this._logger.log(R.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(R.Information, "Connection disconnected."), this._sendQueue && (this._sendQueue.stop().catch((o) => {
      this._logger.log(R.Error, `TransportSendQueue.stop() threw error '${o}'.`);
    }), this._sendQueue = void 0), this.connectionId = void 0, this._connectionState = "Disconnected", this._connectionStarted) {
      this._connectionStarted = !1;
      try {
        this.onclose && this.onclose(e);
      } catch (o) {
        this._logger.log(R.Error, `HttpConnection.onclose(${e}) threw error '${o}'.`);
      }
    }
  }
  _resolveUrl(e) {
    if (e.lastIndexOf("https://", 0) === 0 || e.lastIndexOf("http://", 0) === 0)
      return e;
    if (!be.isBrowser)
      throw new Error(`Cannot resolve '${e}'.`);
    const o = window.document.createElement("a");
    return o.href = e, this._logger.log(R.Information, `Normalizing '${e}' to '${o.href}'.`), o.href;
  }
  _resolveNegotiateUrl(e) {
    const o = new URL(e);
    o.pathname.endsWith("/") ? o.pathname += "negotiate" : o.pathname += "/negotiate";
    const s = new URLSearchParams(o.searchParams);
    return s.has("negotiateVersion") || s.append("negotiateVersion", this._negotiateVersion.toString()), s.has("useStatefulReconnect") ? s.get("useStatefulReconnect") === "true" && (this._options._useStatefulReconnect = !0) : this._options._useStatefulReconnect === !0 && s.append("useStatefulReconnect", "true"), o.search = s.toString(), o.toString();
  }
}
function Hi(t, e) {
  return !t || (e & t) !== 0;
}
class wo {
  constructor(e) {
    this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new Bt(), this._transportResult = new Bt(), this._sendLoopPromise = this._sendLoop();
  }
  send(e) {
    return this._bufferData(e), this._transportResult || (this._transportResult = new Bt()), this._transportResult.promise;
  }
  stop() {
    return this._executing = !1, this._sendBufferedData.resolve(), this._sendLoopPromise;
  }
  _bufferData(e) {
    if (this._buffer.length && typeof this._buffer[0] != typeof e)
      throw new Error(`Expected data to be of type ${typeof this._buffer} but was of type ${typeof e}`);
    this._buffer.push(e), this._sendBufferedData.resolve();
  }
  async _sendLoop() {
    for (; ; ) {
      if (await this._sendBufferedData.promise, !this._executing) {
        this._transportResult && this._transportResult.reject("Connection stopped.");
        break;
      }
      this._sendBufferedData = new Bt();
      const e = this._transportResult;
      this._transportResult = void 0;
      const o = typeof this._buffer[0] == "string" ? this._buffer.join("") : wo._concatBuffers(this._buffer);
      this._buffer.length = 0;
      try {
        await this._transport.send(o), e.resolve();
      } catch (s) {
        e.reject(s);
      }
    }
  }
  static _concatBuffers(e) {
    const o = e.map((n) => n.byteLength).reduce((n, l) => n + l), s = new Uint8Array(o);
    let r = 0;
    for (const n of e)
      s.set(new Uint8Array(n), r), r += n.byteLength;
    return s.buffer;
  }
}
class Bt {
  constructor() {
    this.promise = new Promise((e, o) => [this._resolver, this._rejecter] = [e, o]);
  }
  resolve() {
    this._resolver();
  }
  reject(e) {
    this._rejecter(e);
  }
}
const Pi = "json";
class Di {
  constructor() {
    this.name = Pi, this.version = 2, this.transferFormat = Me.Text;
  }
  /** Creates an array of {@link @microsoft/signalr.HubMessage} objects from the specified serialized representation.
   *
   * @param {string} input A string containing the serialized representation.
   * @param {ILogger} logger A logger that will be used to log messages that occur during parsing.
   */
  parseMessages(e, o) {
    if (typeof e != "string")
      throw new Error("Invalid input for JSON hub protocol. Expected a string.");
    if (!e)
      return [];
    o === null && (o = zt.instance);
    const s = Ue.parse(e), r = [];
    for (const n of s) {
      const l = JSON.parse(n);
      if (typeof l.type != "number")
        throw new Error("Invalid payload.");
      switch (l.type) {
        case Q.Invocation:
          this._isInvocationMessage(l);
          break;
        case Q.StreamItem:
          this._isStreamItemMessage(l);
          break;
        case Q.Completion:
          this._isCompletionMessage(l);
          break;
        case Q.Ping:
          break;
        case Q.Close:
          break;
        case Q.Ack:
          this._isAckMessage(l);
          break;
        case Q.Sequence:
          this._isSequenceMessage(l);
          break;
        default:
          o.log(R.Information, "Unknown message type '" + l.type + "' ignored.");
          continue;
      }
      r.push(l);
    }
    return r;
  }
  /** Writes the specified {@link @microsoft/signalr.HubMessage} to a string and returns it.
   *
   * @param {HubMessage} message The message to write.
   * @returns {string} A string containing the serialized representation of the message.
   */
  writeMessage(e) {
    return Ue.write(JSON.stringify(e));
  }
  _isInvocationMessage(e) {
    this._assertNotEmptyString(e.target, "Invalid payload for Invocation message."), e.invocationId !== void 0 && this._assertNotEmptyString(e.invocationId, "Invalid payload for Invocation message.");
  }
  _isStreamItemMessage(e) {
    if (this._assertNotEmptyString(e.invocationId, "Invalid payload for StreamItem message."), e.item === void 0)
      throw new Error("Invalid payload for StreamItem message.");
  }
  _isCompletionMessage(e) {
    if (e.result && e.error)
      throw new Error("Invalid payload for Completion message.");
    !e.result && e.error && this._assertNotEmptyString(e.error, "Invalid payload for Completion message."), this._assertNotEmptyString(e.invocationId, "Invalid payload for Completion message.");
  }
  _isAckMessage(e) {
    if (typeof e.sequenceId != "number")
      throw new Error("Invalid SequenceId for Ack message.");
  }
  _isSequenceMessage(e) {
    if (typeof e.sequenceId != "number")
      throw new Error("Invalid SequenceId for Sequence message.");
  }
  _assertNotEmptyString(e, o) {
    if (typeof e != "string" || e === "")
      throw new Error(o);
  }
}
const zi = {
  trace: R.Trace,
  debug: R.Debug,
  info: R.Information,
  information: R.Information,
  warn: R.Warning,
  warning: R.Warning,
  error: R.Error,
  critical: R.Critical,
  none: R.None
};
function Fi(t) {
  const e = zi[t.toLowerCase()];
  if (typeof e < "u")
    return e;
  throw new Error(`Unknown log level: ${t}`);
}
class Bi {
  configureLogging(e) {
    if (Re.isRequired(e, "logging"), Vi(e))
      this.logger = e;
    else if (typeof e == "string") {
      const o = Fi(e);
      this.logger = new Nt(o);
    } else
      this.logger = new Nt(e);
    return this;
  }
  withUrl(e, o) {
    return Re.isRequired(e, "url"), Re.isNotEmpty(e, "url"), this.url = e, typeof o == "object" ? this.httpConnectionOptions = { ...this.httpConnectionOptions, ...o } : this.httpConnectionOptions = {
      ...this.httpConnectionOptions,
      transport: o
    }, this;
  }
  /** Configures the {@link @microsoft/signalr.HubConnection} to use the specified Hub Protocol.
   *
   * @param {IHubProtocol} protocol The {@link @microsoft/signalr.IHubProtocol} implementation to use.
   */
  withHubProtocol(e) {
    return Re.isRequired(e, "protocol"), this.protocol = e, this;
  }
  withAutomaticReconnect(e) {
    if (this.reconnectPolicy)
      throw new Error("A reconnectPolicy has already been set.");
    return e ? Array.isArray(e) ? this.reconnectPolicy = new Fo(e) : this.reconnectPolicy = e : this.reconnectPolicy = new Fo(), this;
  }
  /** Configures {@link @microsoft/signalr.HubConnection.serverTimeoutInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
   *
   * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
   */
  withServerTimeout(e) {
    return Re.isRequired(e, "milliseconds"), this._serverTimeoutInMilliseconds = e, this;
  }
  /** Configures {@link @microsoft/signalr.HubConnection.keepAliveIntervalInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
   *
   * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
   */
  withKeepAliveInterval(e) {
    return Re.isRequired(e, "milliseconds"), this._keepAliveIntervalInMilliseconds = e, this;
  }
  /** Enables and configures options for the Stateful Reconnect feature.
   *
   * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
   */
  withStatefulReconnect(e) {
    return this.httpConnectionOptions === void 0 && (this.httpConnectionOptions = {}), this.httpConnectionOptions._useStatefulReconnect = !0, this._statefulReconnectBufferSize = e == null ? void 0 : e.bufferSize, this;
  }
  /** Creates a {@link @microsoft/signalr.HubConnection} from the configuration options specified in this builder.
   *
   * @returns {HubConnection} The configured {@link @microsoft/signalr.HubConnection}.
   */
  build() {
    const e = this.httpConnectionOptions || {};
    if (e.logger === void 0 && (e.logger = this.logger), !this.url)
      throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
    const o = new Mi(this.url, e);
    return vo.create(o, this.logger || zt.instance, this.protocol || new Di(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
  }
}
function Vi(t) {
  return t.log !== void 0;
}
function qi(t = {}) {
  const e = t.hubUrl || "/gridhub", o = t.autoReconnect !== !1, s = M(null), r = M(!1), n = M(!1), l = M(null);
  async function a() {
    if (s.value || n.value) {
      console.log("SignalR: Already connected or connecting");
      return;
    }
    n.value = !0, l.value = null;
    try {
      const u = new Bi().withUrl(e, {
        skipNegotiation: !1,
        transport: Ce.WebSockets | Ce.ServerSentEvents | Ce.LongPolling
      });
      o && u.withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (f) => f.previousRetryCount === 0 ? 0 : f.previousRetryCount === 1 ? 2e3 : f.previousRetryCount === 2 ? 1e4 : 3e4
      }), s.value = u.build(), s.value.onclose((f) => {
        r.value = !1, f ? (console.error("SignalR connection closed with error:", f), l.value = f) : console.log("SignalR connection closed");
      }), s.value.onreconnecting((f) => {
        r.value = !1, console.warn("SignalR reconnecting...", f);
      }), s.value.onreconnected((f) => {
        r.value = !0, l.value = null, console.log("SignalR reconnected:", f);
      }), await s.value.start(), r.value = !0, console.log("SignalR connected successfully");
    } catch (u) {
      console.error("SignalR connection failed:", u), l.value = u, s.value = null;
    } finally {
      n.value = !1;
    }
  }
  async function d() {
    if (s.value)
      try {
        await s.value.stop(), console.log("SignalR connection stopped");
      } catch (u) {
        console.error("Error stopping SignalR connection:", u);
      } finally {
        s.value = null, r.value = !1;
      }
  }
  function p(u, f) {
    if (!s.value) {
      console.warn(`Cannot register handler for '${u}': connection not initialized`);
      return;
    }
    s.value.on(u, f);
  }
  function c(u, f) {
    s.value && (f ? s.value.off(u, f) : s.value.off(u));
  }
  async function y(u, ...f) {
    if (!s.value || !r.value) {
      console.error(`Cannot invoke '${u}': not connected`);
      return;
    }
    try {
      return await s.value.invoke(u, ...f);
    } catch (m) {
      throw console.error(`Error invoking '${u}':`, m), m;
    }
  }
  return ao(() => {
    d();
  }), {
    connection: s,
    isConnected: r,
    isConnecting: n,
    connectionError: l,
    start: a,
    stop: d,
    on: p,
    off: c,
    invoke: y
  };
}
const Ki = {
  install(t) {
    t.use(_n()), t.component("AdvancedTable", Po), t.component("DataGrid", Po), t.component("ListBox", ni);
  }
}, Ji = "1.0.0";
export {
  Po as AdvancedTable,
  Po as DataGrid,
  ni as ListBox,
  Ki as RpaWebUIPlugin,
  Qt as gridApi,
  ns as useAutoRowHeight,
  ts as useCopyPaste,
  jt as useDataGridStore,
  Yo as useFiltering,
  Wi as useImportExport,
  ds as useLogger,
  Xn as useSearch,
  ji as useSelection,
  ss as useShortcuts,
  qi as useSignalR,
  Ui as useSorting,
  Li as useTheme,
  es as useValidation,
  Ji as version
};
//# sourceMappingURL=rpa-web-ui.js.map
