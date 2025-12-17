var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { pushScopeId, popScopeId, nextTick, withScopeId, createBlock, openBlock, markRaw, shallowReactive, h, resolveComponent, resolveDirective, withDirectives, createElementBlock, normalizeClass, createCommentVNode, createVNode, renderSlot, resolveDynamicComponent, normalizeStyle, withCtx, Fragment, renderList, mergeProps, toHandlers, normalizeProps, guardReactiveProps, hasInjectionContext, inject, effectScope, ref, toRaw, getCurrentInstance, watch, unref, reactive, isRef, isReactive, toRef, getCurrentScope, onScopeDispose, toRefs, computed, onMounted, onUnmounted, defineComponent, withModifiers, createElementVNode, toDisplayString, createTextVNode, vModelText, Teleport, vModelRadio, vModelCheckbox, provide, onBeforeUnmount, onBeforeMount, createStaticVNode, vModelSelect } from "vue";
import { useDebounceFn } from "@vueuse/core";
import ContextMenu from "@imengyu/vue3-context-menu";
function getInternetExplorerVersion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
  }
  var trident = ua.indexOf("Trident/");
  if (trident > 0) {
    var rv = ua.indexOf("rv:");
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
  }
  var edge = ua.indexOf("Edge/");
  if (edge > 0) {
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
  }
  return -1;
}
let isIE;
function initCompat() {
  if (!initCompat.init) {
    initCompat.init = true;
    isIE = getInternetExplorerVersion() !== -1;
  }
}
var script$3 = {
  name: "ResizeObserver",
  props: {
    emitOnMount: {
      type: Boolean,
      default: false
    },
    ignoreWidth: {
      type: Boolean,
      default: false
    },
    ignoreHeight: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "notify"
  ],
  mounted() {
    initCompat();
    nextTick(() => {
      this._w = this.$el.offsetWidth;
      this._h = this.$el.offsetHeight;
      if (this.emitOnMount) {
        this.emitSize();
      }
    });
    const object = document.createElement("object");
    this._resizeObject = object;
    object.setAttribute("aria-hidden", "true");
    object.setAttribute("tabindex", -1);
    object.onload = this.addResizeHandlers;
    object.type = "text/html";
    if (isIE) {
      this.$el.appendChild(object);
    }
    object.data = "about:blank";
    if (!isIE) {
      this.$el.appendChild(object);
    }
  },
  beforeUnmount() {
    this.removeResizeHandlers();
  },
  methods: {
    compareAndNotify() {
      if (!this.ignoreWidth && this._w !== this.$el.offsetWidth || !this.ignoreHeight && this._h !== this.$el.offsetHeight) {
        this._w = this.$el.offsetWidth;
        this._h = this.$el.offsetHeight;
        this.emitSize();
      }
    },
    emitSize() {
      this.$emit("notify", {
        width: this._w,
        height: this._h
      });
    },
    addResizeHandlers() {
      this._resizeObject.contentDocument.defaultView.addEventListener("resize", this.compareAndNotify);
      this.compareAndNotify();
    },
    removeResizeHandlers() {
      if (this._resizeObject && this._resizeObject.onload) {
        if (!isIE && this._resizeObject.contentDocument) {
          this._resizeObject.contentDocument.defaultView.removeEventListener("resize", this.compareAndNotify);
        }
        this.$el.removeChild(this._resizeObject);
        this._resizeObject.onload = null;
        this._resizeObject = null;
      }
    }
  }
};
const _withId = /* @__PURE__ */ withScopeId("data-v-b329ee4c");
pushScopeId("data-v-b329ee4c");
const _hoisted_1$a = {
  class: "resize-observer",
  tabindex: "-1"
};
popScopeId();
const render$2 = /* @__PURE__ */ _withId((_ctx, _cache, $props, $setup, $data, $options) => {
  return openBlock(), createBlock("div", _hoisted_1$a);
});
script$3.render = render$2;
script$3.__scopeId = "data-v-b329ee4c";
script$3.__file = "src/components/ResizeObserver.vue";
function _typeof$1(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$1 = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$1(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props2) {
  for (var i = 0; i < props2.length; i++) {
    var descriptor = props2[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  return Constructor;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function processOptions(value) {
  var options;
  if (typeof value === "function") {
    options = {
      callback: value
    };
  } else {
    options = value;
  }
  return options;
}
function throttle(callback, delay) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var timeout;
  var lastState;
  var currentArgs;
  var throttled = function throttled2(state) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    currentArgs = args;
    if (timeout && state === lastState) return;
    var leading = options.leading;
    if (typeof leading === "function") {
      leading = leading(state, lastState);
    }
    if ((!timeout || state !== lastState) && leading) {
      callback.apply(void 0, [state].concat(_toConsumableArray(currentArgs)));
    }
    lastState = state;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      callback.apply(void 0, [state].concat(_toConsumableArray(currentArgs)));
      timeout = 0;
    }, delay);
  };
  throttled._clear = function() {
    clearTimeout(timeout);
    timeout = null;
  };
  return throttled;
}
function deepEqual(val1, val2) {
  if (val1 === val2) return true;
  if (_typeof$1(val1) === "object") {
    for (var key in val1) {
      if (!deepEqual(val1[key], val2[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}
var VisibilityState = /* @__PURE__ */ function() {
  function VisibilityState2(el, options, vnode) {
    _classCallCheck(this, VisibilityState2);
    this.el = el;
    this.observer = null;
    this.frozen = false;
    this.createObserver(options, vnode);
  }
  _createClass(VisibilityState2, [{
    key: "createObserver",
    value: function createObserver(options, vnode) {
      var _this = this;
      if (this.observer) {
        this.destroyObserver();
      }
      if (this.frozen) return;
      this.options = processOptions(options);
      this.callback = function(result, entry) {
        _this.options.callback(result, entry);
        if (result && _this.options.once) {
          _this.frozen = true;
          _this.destroyObserver();
        }
      };
      if (this.callback && this.options.throttle) {
        var _ref = this.options.throttleOptions || {}, _leading = _ref.leading;
        this.callback = throttle(this.callback, this.options.throttle, {
          leading: function leading(state) {
            return _leading === "both" || _leading === "visible" && state || _leading === "hidden" && !state;
          }
        });
      }
      this.oldResult = void 0;
      this.observer = new IntersectionObserver(function(entries) {
        var entry = entries[0];
        if (entries.length > 1) {
          var intersectingEntry = entries.find(function(e) {
            return e.isIntersecting;
          });
          if (intersectingEntry) {
            entry = intersectingEntry;
          }
        }
        if (_this.callback) {
          var result = entry.isIntersecting && entry.intersectionRatio >= _this.threshold;
          if (result === _this.oldResult) return;
          _this.oldResult = result;
          _this.callback(result, entry);
        }
      }, this.options.intersection);
      nextTick(function() {
        if (_this.observer) {
          _this.observer.observe(_this.el);
        }
      });
    }
  }, {
    key: "destroyObserver",
    value: function destroyObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      if (this.callback && this.callback._clear) {
        this.callback._clear();
        this.callback = null;
      }
    }
  }, {
    key: "threshold",
    get: function get() {
      return this.options.intersection && typeof this.options.intersection.threshold === "number" ? this.options.intersection.threshold : 0;
    }
  }]);
  return VisibilityState2;
}();
function beforeMount(el, _ref2, vnode) {
  var value = _ref2.value;
  if (!value) return;
  if (typeof IntersectionObserver === "undefined") {
    console.warn("[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill");
  } else {
    var state = new VisibilityState(el, value, vnode);
    el._vue_visibilityState = state;
  }
}
function updated(el, _ref3, vnode) {
  var value = _ref3.value, oldValue = _ref3.oldValue;
  if (deepEqual(value, oldValue)) return;
  var state = el._vue_visibilityState;
  if (!value) {
    unmounted(el);
    return;
  }
  if (state) {
    state.createObserver(value, vnode);
  } else {
    beforeMount(el, {
      value
    }, vnode);
  }
}
function unmounted(el) {
  var state = el._vue_visibilityState;
  if (state) {
    state.destroyObserver();
    delete el._vue_visibilityState;
  }
}
var ObserveVisibility = {
  beforeMount,
  updated,
  unmounted
};
function mitt(n) {
  return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
    var i = n.get(t);
    i && i.push(e) || n.set(t, [e]);
  }, off: function(t, e) {
    var i = n.get(t);
    i && i.splice(i.indexOf(e) >>> 0, 1);
  }, emit: function(t, e) {
    (n.get(t) || []).slice().map(function(n2) {
      n2(e);
    }), (n.get("*") || []).slice().map(function(n2) {
      n2(t, e);
    });
  } };
}
var config = {
  itemsLimit: 1e3
};
var regex = /(auto|scroll)/;
function parents(node, ps) {
  if (node.parentNode === null) {
    return ps;
  }
  return parents(node.parentNode, ps.concat([node]));
}
var style = function style2(node, prop) {
  return getComputedStyle(node, null).getPropertyValue(prop);
};
var overflow = function overflow2(node) {
  return style(node, "overflow") + style(node, "overflow-y") + style(node, "overflow-x");
};
var scroll = function scroll2(node) {
  return regex.test(overflow(node));
};
function getScrollParent(node) {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    return;
  }
  var ps = parents(node.parentNode, []);
  for (var i = 0; i < ps.length; i += 1) {
    if (scroll(ps[i])) {
      return ps[i];
    }
  }
  return document.scrollingElement || document.documentElement;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}
var props = {
  items: {
    type: Array,
    required: true
  },
  keyField: {
    type: String,
    default: "id"
  },
  direction: {
    type: String,
    default: "vertical",
    validator: function validator(value) {
      return ["vertical", "horizontal"].includes(value);
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
function simpleArray() {
  return this.items.length && _typeof(this.items[0]) !== "object";
}
var supportsPassive = false;
if (typeof window !== "undefined") {
  supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, "passive", {
      get: function get() {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {
  }
}
let uid = 0;
var script$2 = {
  name: "RecycleScroller",
  components: {
    ResizeObserver: script$3
  },
  directives: {
    ObserveVisibility
  },
  props: {
    ...props,
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
      default: false
    },
    prerender: {
      type: Number,
      default: 0
    },
    emitUpdate: {
      type: Boolean,
      default: false
    },
    updateInterval: {
      type: Number,
      default: 0
    },
    skipHover: {
      type: Boolean,
      default: false
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
      ready: false,
      hoverKey: null
    };
  },
  computed: {
    sizes() {
      if (this.itemSize === null) {
        const sizes = {
          "-1": { accumulator: 0 }
        };
        const items = this.items;
        const field = this.sizeField;
        const minItemSize = this.minItemSize;
        let computedMinSize = 1e4;
        let accumulator = 0;
        let current;
        for (let i = 0, l = items.length; i < l; i++) {
          current = items[i][field] || minItemSize;
          if (current < computedMinSize) {
            computedMinSize = current;
          }
          accumulator += current;
          sizes[i] = { accumulator, size: current };
        }
        this.$_computedMinItemSize = computedMinSize;
        return sizes;
      }
      return [];
    },
    simpleArray,
    itemIndexByKey() {
      const { keyField, items } = this;
      const result = {};
      for (let i = 0, l = items.length; i < l; i++) {
        result[items[i][keyField]] = i;
      }
      return result;
    }
  },
  watch: {
    items() {
      this.updateVisibleItems(true);
    },
    pageMode() {
      this.applyPageMode();
      this.updateVisibleItems(false);
    },
    sizes: {
      handler() {
        this.updateVisibleItems(false);
      },
      deep: true
    },
    gridItems() {
      this.updateVisibleItems(true);
    },
    itemSecondarySize() {
      this.updateVisibleItems(true);
    }
  },
  created() {
    this.$_startIndex = 0;
    this.$_endIndex = 0;
    this.$_views = /* @__PURE__ */ new Map();
    this.$_unusedViews = /* @__PURE__ */ new Map();
    this.$_scrollDirty = false;
    this.$_lastUpdateScrollPosition = 0;
    if (this.prerender) {
      this.$_prerender = true;
      this.updateVisibleItems(false);
    }
    if (this.gridItems && !this.itemSize) {
      console.error("[vue-recycle-scroller] You must provide an itemSize when using gridItems");
    }
  },
  mounted() {
    this.applyPageMode();
    this.$nextTick(() => {
      this.$_prerender = false;
      this.updateVisibleItems(true);
      this.ready = true;
    });
  },
  activated() {
    const lastPosition = this.$_lastUpdateScrollPosition;
    if (typeof lastPosition === "number") {
      this.$nextTick(() => {
        this.scrollToPosition(lastPosition);
      });
    }
  },
  beforeUnmount() {
    this.removeListeners();
  },
  methods: {
    addView(pool, index2, item, key, type) {
      const nr = markRaw({
        id: uid++,
        index: index2,
        used: true,
        key,
        type
      });
      const view = shallowReactive({
        item,
        position: 0,
        nr
      });
      pool.push(view);
      return view;
    },
    unuseView(view, fake = false) {
      const unusedViews = this.$_unusedViews;
      const type = view.nr.type;
      let unusedPool = unusedViews.get(type);
      if (!unusedPool) {
        unusedPool = [];
        unusedViews.set(type, unusedPool);
      }
      unusedPool.push(view);
      if (!fake) {
        view.nr.used = false;
        view.position = -9999;
      }
    },
    handleResize() {
      this.$emit("resize");
      if (this.ready) this.updateVisibleItems(false);
    },
    handleScroll(event) {
      if (!this.$_scrollDirty) {
        this.$_scrollDirty = true;
        if (this.$_updateTimeout) return;
        const requestUpdate = () => requestAnimationFrame(() => {
          this.$_scrollDirty = false;
          const { continuous } = this.updateVisibleItems(false, true);
          if (!continuous) {
            clearTimeout(this.$_refreshTimout);
            this.$_refreshTimout = setTimeout(this.handleScroll, this.updateInterval + 100);
          }
        });
        requestUpdate();
        if (this.updateInterval) {
          this.$_updateTimeout = setTimeout(() => {
            this.$_updateTimeout = 0;
            if (this.$_scrollDirty) requestUpdate();
          }, this.updateInterval);
        }
      }
    },
    handleVisibilityChange(isVisible, entry) {
      if (this.ready) {
        if (isVisible || entry.boundingClientRect.width !== 0 || entry.boundingClientRect.height !== 0) {
          this.$emit("visible");
          requestAnimationFrame(() => {
            this.updateVisibleItems(false);
          });
        } else {
          this.$emit("hidden");
        }
      }
    },
    updateVisibleItems(checkItem, checkPositionDiff = false) {
      const itemSize = this.itemSize;
      const gridItems = this.gridItems || 1;
      const itemSecondarySize = this.itemSecondarySize || itemSize;
      const minItemSize = this.$_computedMinItemSize;
      const typeField = this.typeField;
      const keyField = this.simpleArray ? null : this.keyField;
      const items = this.items;
      const count = items.length;
      const sizes = this.sizes;
      const views = this.$_views;
      const unusedViews = this.$_unusedViews;
      const pool = this.pool;
      const itemIndexByKey = this.itemIndexByKey;
      let startIndex, endIndex;
      let totalSize;
      let visibleStartIndex, visibleEndIndex;
      if (!count) {
        startIndex = endIndex = visibleStartIndex = visibleEndIndex = totalSize = 0;
      } else if (this.$_prerender) {
        startIndex = visibleStartIndex = 0;
        endIndex = visibleEndIndex = Math.min(this.prerender, items.length);
        totalSize = null;
      } else {
        const scroll3 = this.getScroll();
        if (checkPositionDiff) {
          let positionDiff = scroll3.start - this.$_lastUpdateScrollPosition;
          if (positionDiff < 0) positionDiff = -positionDiff;
          if (itemSize === null && positionDiff < minItemSize || positionDiff < itemSize) {
            return {
              continuous: true
            };
          }
        }
        this.$_lastUpdateScrollPosition = scroll3.start;
        const buffer = this.buffer;
        scroll3.start -= buffer;
        scroll3.end += buffer;
        let beforeSize = 0;
        if (this.$refs.before) {
          beforeSize = this.$refs.before.scrollHeight;
          scroll3.start -= beforeSize;
        }
        if (this.$refs.after) {
          const afterSize = this.$refs.after.scrollHeight;
          scroll3.end += afterSize;
        }
        if (itemSize === null) {
          let h2;
          let a = 0;
          let b = count - 1;
          let i = ~~(count / 2);
          let oldI;
          do {
            oldI = i;
            h2 = sizes[i].accumulator;
            if (h2 < scroll3.start) {
              a = i;
            } else if (i < count - 1 && sizes[i + 1].accumulator > scroll3.start) {
              b = i;
            }
            i = ~~((a + b) / 2);
          } while (i !== oldI);
          i < 0 && (i = 0);
          startIndex = i;
          totalSize = sizes[count - 1].accumulator;
          for (endIndex = i; endIndex < count && sizes[endIndex].accumulator < scroll3.end; endIndex++) ;
          if (endIndex === -1) {
            endIndex = items.length - 1;
          } else {
            endIndex++;
            endIndex > count && (endIndex = count);
          }
          for (visibleStartIndex = startIndex; visibleStartIndex < count && beforeSize + sizes[visibleStartIndex].accumulator < scroll3.start; visibleStartIndex++) ;
          for (visibleEndIndex = visibleStartIndex; visibleEndIndex < count && beforeSize + sizes[visibleEndIndex].accumulator < scroll3.end; visibleEndIndex++) ;
        } else {
          startIndex = ~~(scroll3.start / itemSize * gridItems);
          const remainer = startIndex % gridItems;
          startIndex -= remainer;
          endIndex = Math.ceil(scroll3.end / itemSize * gridItems);
          visibleStartIndex = Math.max(0, Math.floor((scroll3.start - beforeSize) / itemSize * gridItems));
          visibleEndIndex = Math.floor((scroll3.end - beforeSize) / itemSize * gridItems);
          startIndex < 0 && (startIndex = 0);
          endIndex > count && (endIndex = count);
          visibleStartIndex < 0 && (visibleStartIndex = 0);
          visibleEndIndex > count && (visibleEndIndex = count);
          totalSize = Math.ceil(count / gridItems) * itemSize;
        }
      }
      if (endIndex - startIndex > config.itemsLimit) {
        this.itemsLimitError();
      }
      this.totalSize = totalSize;
      let view;
      const continuous = startIndex <= this.$_endIndex && endIndex >= this.$_startIndex;
      if (continuous) {
        for (let i = 0, l = pool.length; i < l; i++) {
          view = pool[i];
          if (view.nr.used) {
            if (checkItem) {
              view.nr.index = itemIndexByKey[view.item[keyField]];
            }
            if (view.nr.index == null || view.nr.index < startIndex || view.nr.index >= endIndex) {
              this.unuseView(view);
            }
          }
        }
      }
      const unusedIndex = continuous ? null : /* @__PURE__ */ new Map();
      let item, type;
      let v;
      for (let i = startIndex; i < endIndex; i++) {
        item = items[i];
        const key = keyField ? item[keyField] : item;
        if (key == null) {
          throw new Error(`Key is ${key} on item (keyField is '${keyField}')`);
        }
        view = views.get(key);
        if (!itemSize && !sizes[i].size) {
          if (view) this.unuseView(view);
          continue;
        }
        type = item[typeField];
        let unusedPool = unusedViews.get(type);
        let newlyUsedView = false;
        if (!view) {
          if (continuous) {
            if (unusedPool && unusedPool.length) {
              view = unusedPool.pop();
            } else {
              view = this.addView(pool, i, item, key, type);
            }
          } else {
            v = unusedIndex.get(type) || 0;
            if (!unusedPool || v >= unusedPool.length) {
              view = this.addView(pool, i, item, key, type);
              this.unuseView(view, true);
              unusedPool = unusedViews.get(type);
            }
            view = unusedPool[v];
            unusedIndex.set(type, v + 1);
          }
          views.delete(view.nr.key);
          view.nr.used = true;
          view.nr.index = i;
          view.nr.key = key;
          view.nr.type = type;
          views.set(key, view);
          newlyUsedView = true;
        } else {
          if (!view.nr.used) {
            view.nr.used = true;
            newlyUsedView = true;
            if (unusedPool) {
              const index2 = unusedPool.indexOf(view);
              if (index2 !== -1) unusedPool.splice(index2, 1);
            }
          }
        }
        view.item = item;
        if (newlyUsedView) {
          if (i === items.length - 1) this.$emit("scroll-end");
          if (i === 0) this.$emit("scroll-start");
        }
        if (itemSize === null) {
          view.position = sizes[i - 1].accumulator;
          view.offset = 0;
        } else {
          view.position = Math.floor(i / gridItems) * itemSize;
          view.offset = i % gridItems * itemSecondarySize;
        }
      }
      this.$_startIndex = startIndex;
      this.$_endIndex = endIndex;
      if (this.emitUpdate) this.$emit("update", startIndex, endIndex, visibleStartIndex, visibleEndIndex);
      clearTimeout(this.$_sortTimer);
      this.$_sortTimer = setTimeout(this.sortViews, this.updateInterval + 300);
      return {
        continuous
      };
    },
    getListenerTarget() {
      let target = getScrollParent(this.$el);
      if (window.document && (target === window.document.documentElement || target === window.document.body)) {
        target = window;
      }
      return target;
    },
    getScroll() {
      const { $el: el, direction } = this;
      const isVertical = direction === "vertical";
      let scrollState;
      if (this.pageMode) {
        const bounds = el.getBoundingClientRect();
        const boundsSize = isVertical ? bounds.height : bounds.width;
        let start = -(isVertical ? bounds.top : bounds.left);
        let size = isVertical ? window.innerHeight : window.innerWidth;
        if (start < 0) {
          size += start;
          start = 0;
        }
        if (start + size > boundsSize) {
          size = boundsSize - start;
        }
        scrollState = {
          start,
          end: start + size
        };
      } else if (isVertical) {
        scrollState = {
          start: el.scrollTop,
          end: el.scrollTop + el.clientHeight
        };
      } else {
        scrollState = {
          start: el.scrollLeft,
          end: el.scrollLeft + el.clientWidth
        };
      }
      return scrollState;
    },
    applyPageMode() {
      if (this.pageMode) {
        this.addListeners();
      } else {
        this.removeListeners();
      }
    },
    addListeners() {
      this.listenerTarget = this.getListenerTarget();
      this.listenerTarget.addEventListener("scroll", this.handleScroll, supportsPassive ? {
        passive: true
      } : false);
      this.listenerTarget.addEventListener("resize", this.handleResize);
    },
    removeListeners() {
      if (!this.listenerTarget) {
        return;
      }
      this.listenerTarget.removeEventListener("scroll", this.handleScroll);
      this.listenerTarget.removeEventListener("resize", this.handleResize);
      this.listenerTarget = null;
    },
    scrollToItem(index2) {
      let scroll3;
      const gridItems = this.gridItems || 1;
      if (this.itemSize === null) {
        scroll3 = index2 > 0 ? this.sizes[index2 - 1].accumulator : 0;
      } else {
        scroll3 = Math.floor(index2 / gridItems) * this.itemSize;
      }
      this.scrollToPosition(scroll3);
    },
    scrollToPosition(position) {
      const direction = this.direction === "vertical" ? { scroll: "scrollTop", start: "top" } : { scroll: "scrollLeft", start: "left" };
      let viewport;
      let scrollDirection;
      let scrollDistance;
      if (this.pageMode) {
        const viewportEl = getScrollParent(this.$el);
        const scrollTop = viewportEl.tagName === "HTML" ? 0 : viewportEl[direction.scroll];
        const bounds = viewportEl.getBoundingClientRect();
        const scroller = this.$el.getBoundingClientRect();
        const scrollerPosition = scroller[direction.start] - bounds[direction.start];
        viewport = viewportEl;
        scrollDirection = direction.scroll;
        scrollDistance = position + scrollTop + scrollerPosition;
      } else {
        viewport = this.$el;
        scrollDirection = direction.scroll;
        scrollDistance = position;
      }
      viewport[scrollDirection] = scrollDistance;
    },
    itemsLimitError() {
      setTimeout(() => {
        console.log("It seems the scroller element isn't scrolling, so it tries to render all the items at once.", "Scroller:", this.$el);
        console.log("Make sure the scroller has a fixed height (or width) and 'overflow-y' (or 'overflow-x') set to 'auto' so it can scroll correctly and only render the items visible in the scroll viewport.");
      });
      throw new Error("Rendered items limit reached");
    },
    sortViews() {
      this.pool.sort((viewA, viewB) => viewA.nr.index - viewB.nr.index);
    }
  }
};
const _hoisted_1$9 = {
  key: 0,
  ref: "before",
  class: "vue-recycle-scroller__slot"
};
const _hoisted_2$8 = {
  key: 1,
  ref: "after",
  class: "vue-recycle-scroller__slot"
};
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ResizeObserver = resolveComponent("ResizeObserver");
  const _directive_observe_visibility = resolveDirective("observe-visibility");
  return withDirectives((openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass(["vue-recycle-scroller", {
        ready: $data.ready,
        "page-mode": $props.pageMode,
        [`direction-${_ctx.direction}`]: true
      }]),
      onScrollPassive: _cache[0] || (_cache[0] = (...args) => $options.handleScroll && $options.handleScroll(...args))
    },
    [
      _ctx.$slots.before ? (openBlock(), createElementBlock(
        "div",
        _hoisted_1$9,
        [
          renderSlot(_ctx.$slots, "before")
        ],
        512
        /* NEED_PATCH */
      )) : createCommentVNode("v-if", true),
      (openBlock(), createBlock(resolveDynamicComponent($props.listTag), {
        ref: "wrapper",
        style: normalizeStyle({ [_ctx.direction === "vertical" ? "minHeight" : "minWidth"]: $data.totalSize + "px" }),
        class: normalizeClass(["vue-recycle-scroller__item-wrapper", $props.listClass])
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($data.pool, (view) => {
              return openBlock(), createBlock(resolveDynamicComponent($props.itemTag), mergeProps({
                key: view.nr.id,
                style: $data.ready ? {
                  transform: `translate${_ctx.direction === "vertical" ? "Y" : "X"}(${view.position}px) translate${_ctx.direction === "vertical" ? "X" : "Y"}(${view.offset}px)`,
                  width: $props.gridItems ? `${_ctx.direction === "vertical" ? $props.itemSecondarySize || $props.itemSize : $props.itemSize}px` : void 0,
                  height: $props.gridItems ? `${_ctx.direction === "horizontal" ? $props.itemSecondarySize || $props.itemSize : $props.itemSize}px` : void 0
                } : null,
                class: ["vue-recycle-scroller__item-view", [
                  $props.itemClass,
                  {
                    hover: !$props.skipHover && $data.hoverKey === view.nr.key
                  }
                ]]
              }, toHandlers($props.skipHover ? {} : {
                mouseenter: () => {
                  $data.hoverKey = view.nr.key;
                },
                mouseleave: () => {
                  $data.hoverKey = null;
                }
              })), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {
                    item: view.item,
                    index: view.nr.index,
                    active: view.nr.used
                  })
                ]),
                _: 2
                /* DYNAMIC */
              }, 1040, ["style", "class"]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          renderSlot(_ctx.$slots, "empty")
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["style", "class"])),
      _ctx.$slots.after ? (openBlock(), createElementBlock(
        "div",
        _hoisted_2$8,
        [
          renderSlot(_ctx.$slots, "after")
        ],
        512
        /* NEED_PATCH */
      )) : createCommentVNode("v-if", true),
      createVNode(_component_ResizeObserver, { onNotify: $options.handleResize }, null, 8, ["onNotify"])
    ],
    34
    /* CLASS, HYDRATE_EVENTS */
  )), [
    [_directive_observe_visibility, $options.handleVisibilityChange]
  ]);
}
script$2.render = render$1;
script$2.__file = "src/components/RecycleScroller.vue";
var script$1 = {
  name: "DynamicScroller",
  components: {
    RecycleScroller: script$2
  },
  provide() {
    if (typeof ResizeObserver !== "undefined") {
      this.$_resizeObserver = new ResizeObserver((entries) => {
        requestAnimationFrame(() => {
          if (!Array.isArray(entries)) {
            return;
          }
          for (const entry of entries) {
            if (entry.target && entry.target.$_vs_onResize) {
              let width, height;
              if (entry.borderBoxSize) {
                const resizeObserverSize = entry.borderBoxSize[0];
                width = resizeObserverSize.inlineSize;
                height = resizeObserverSize.blockSize;
              } else {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
              }
              entry.target.$_vs_onResize(entry.target.$_vs_id, width, height);
            }
          }
        });
      });
    }
    return {
      vscrollData: this.vscrollData,
      vscrollParent: this,
      vscrollResizeObserver: this.$_resizeObserver
    };
  },
  inheritAttrs: false,
  props: {
    ...props,
    minItemSize: {
      type: [Number, String],
      required: true
    }
  },
  emits: [
    "resize",
    "visible"
  ],
  data() {
    return {
      vscrollData: {
        active: true,
        sizes: {},
        keyField: this.keyField,
        simpleArray: false
      }
    };
  },
  computed: {
    simpleArray,
    itemsWithSize() {
      const result = [];
      const { items, keyField, simpleArray: simpleArray2 } = this;
      const sizes = this.vscrollData.sizes;
      const l = items.length;
      for (let i = 0; i < l; i++) {
        const item = items[i];
        const id = simpleArray2 ? i : item[keyField];
        let size = sizes[id];
        if (typeof size === "undefined" && !this.$_undefinedMap[id]) {
          size = 0;
        }
        result.push({
          item,
          id,
          size
        });
      }
      return result;
    }
  },
  watch: {
    items() {
      this.forceUpdate();
    },
    simpleArray: {
      handler(value) {
        this.vscrollData.simpleArray = value;
      },
      immediate: true
    },
    direction(value) {
      this.forceUpdate(true);
    },
    itemsWithSize(next, prev) {
      const scrollTop = this.$el.scrollTop;
      let prevActiveTop = 0;
      let activeTop = 0;
      const length = Math.min(next.length, prev.length);
      for (let i = 0; i < length; i++) {
        if (prevActiveTop >= scrollTop) {
          break;
        }
        prevActiveTop += prev[i].size || this.minItemSize;
        activeTop += next[i].size || this.minItemSize;
      }
      const offset = activeTop - prevActiveTop;
      if (offset === 0) {
        return;
      }
      this.$el.scrollTop += offset;
    }
  },
  beforeCreate() {
    this.$_updates = [];
    this.$_undefinedSizes = 0;
    this.$_undefinedMap = {};
    this.$_events = mitt();
  },
  activated() {
    this.vscrollData.active = true;
  },
  deactivated() {
    this.vscrollData.active = false;
  },
  unmounted() {
    this.$_events.all.clear();
  },
  methods: {
    onScrollerResize() {
      const scroller = this.$refs.scroller;
      if (scroller) {
        this.forceUpdate();
      }
      this.$emit("resize");
    },
    onScrollerVisible() {
      this.$_events.emit("vscroll:update", { force: false });
      this.$emit("visible");
    },
    forceUpdate(clear = false) {
      if (clear || this.simpleArray) {
        this.vscrollData.sizes = {};
      }
      this.$_events.emit("vscroll:update", { force: true });
    },
    scrollToItem(index2) {
      const scroller = this.$refs.scroller;
      if (scroller) scroller.scrollToItem(index2);
    },
    getItemSize(item, index2 = void 0) {
      const id = this.simpleArray ? index2 != null ? index2 : this.items.indexOf(item) : item[this.keyField];
      return this.vscrollData.sizes[id] || 0;
    },
    scrollToBottom() {
      if (this.$_scrollingToBottom) return;
      this.$_scrollingToBottom = true;
      const el = this.$el;
      this.$nextTick(() => {
        el.scrollTop = el.scrollHeight + 5e3;
        const cb = () => {
          el.scrollTop = el.scrollHeight + 5e3;
          requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight + 5e3;
            if (this.$_undefinedSizes === 0) {
              this.$_scrollingToBottom = false;
            } else {
              requestAnimationFrame(cb);
            }
          });
        };
        requestAnimationFrame(cb);
      });
    }
  }
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RecycleScroller = resolveComponent("RecycleScroller");
  return openBlock(), createBlock(_component_RecycleScroller, mergeProps({
    ref: "scroller",
    items: $options.itemsWithSize,
    "min-item-size": $props.minItemSize,
    direction: _ctx.direction,
    "key-field": "id",
    "list-tag": _ctx.listTag,
    "item-tag": _ctx.itemTag
  }, _ctx.$attrs, {
    onResize: $options.onScrollerResize,
    onVisible: $options.onScrollerVisible
  }), {
    default: withCtx(({ item: itemWithSize, index: index2, active }) => [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({
        item: itemWithSize.item,
        index: index2,
        active,
        itemWithSize
      })))
    ]),
    before: withCtx(() => [
      renderSlot(_ctx.$slots, "before")
    ]),
    after: withCtx(() => [
      renderSlot(_ctx.$slots, "after")
    ]),
    empty: withCtx(() => [
      renderSlot(_ctx.$slots, "empty")
    ]),
    _: 3
    /* FORWARDED */
  }, 16, ["items", "min-item-size", "direction", "list-tag", "item-tag", "onResize", "onVisible"]);
}
script$1.render = render;
script$1.__file = "src/components/DynamicScroller.vue";
var script = {
  name: "DynamicScrollerItem",
  inject: [
    "vscrollData",
    "vscrollParent",
    "vscrollResizeObserver"
  ],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    item: {
      required: true
    },
    watchData: {
      type: Boolean,
      default: false
    },
    /**
     * Indicates if the view is actively used to display an item.
     */
    active: {
      type: Boolean,
      required: true
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
      default: false
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
    id(value, oldValue) {
      this.$el.$_vs_id = this.id;
      if (!this.size) {
        this.onDataUpdate();
      }
      if (this.$_sizeObserved) {
        const oldSize = this.vscrollData.sizes[oldValue];
        const size = this.vscrollData.sizes[value];
        if (oldSize != null && oldSize !== size) {
          this.applySize(oldSize);
        }
      }
    },
    finalActive(value) {
      if (!this.size) {
        if (value) {
          if (!this.vscrollParent.$_undefinedMap[this.id]) {
            this.vscrollParent.$_undefinedSizes++;
            this.vscrollParent.$_undefinedMap[this.id] = true;
          }
        } else {
          if (this.vscrollParent.$_undefinedMap[this.id]) {
            this.vscrollParent.$_undefinedSizes--;
            this.vscrollParent.$_undefinedMap[this.id] = false;
          }
        }
      }
      if (this.vscrollResizeObserver) {
        if (value) {
          this.observeSize();
        } else {
          this.unobserveSize();
        }
      } else if (value && this.$_pendingVScrollUpdate === this.id) {
        this.updateSize();
      }
    }
  },
  created() {
    if (this.$isServer) return;
    this.$_forceNextVScrollUpdate = null;
    this.updateWatchData();
    if (!this.vscrollResizeObserver) {
      for (const k in this.sizeDependencies) {
        this.$watch(() => this.sizeDependencies[k], this.onDataUpdate);
      }
      this.vscrollParent.$_events.on("vscroll:update", this.onVscrollUpdate);
    }
  },
  mounted() {
    if (this.finalActive) {
      this.updateSize();
      this.observeSize();
    }
  },
  beforeUnmount() {
    this.vscrollParent.$_events.off("vscroll:update", this.onVscrollUpdate);
    this.unobserveSize();
  },
  methods: {
    updateSize() {
      if (this.finalActive) {
        if (this.$_pendingSizeUpdate !== this.id) {
          this.$_pendingSizeUpdate = this.id;
          this.$_forceNextVScrollUpdate = null;
          this.$_pendingVScrollUpdate = null;
          this.computeSize(this.id);
        }
      } else {
        this.$_forceNextVScrollUpdate = this.id;
      }
    },
    updateWatchData() {
      if (this.watchData && !this.vscrollResizeObserver) {
        this.$_watchData = this.$watch("item", () => {
          this.onDataUpdate();
        }, {
          deep: true
        });
      } else if (this.$_watchData) {
        this.$_watchData();
        this.$_watchData = null;
      }
    },
    onVscrollUpdate({ force }) {
      if (!this.finalActive && force) {
        this.$_pendingVScrollUpdate = this.id;
      }
      if (this.$_forceNextVScrollUpdate === this.id || force || !this.size) {
        this.updateSize();
      }
    },
    onDataUpdate() {
      this.updateSize();
    },
    computeSize(id) {
      this.$nextTick(() => {
        if (this.id === id) {
          const width = this.$el.offsetWidth;
          const height = this.$el.offsetHeight;
          this.applyWidthHeight(width, height);
        }
        this.$_pendingSizeUpdate = null;
      });
    },
    applyWidthHeight(width, height) {
      const size = ~~(this.vscrollParent.direction === "vertical" ? height : width);
      if (size && this.size !== size) {
        this.applySize(size);
      }
    },
    applySize(size) {
      if (this.vscrollParent.$_undefinedMap[this.id]) {
        this.vscrollParent.$_undefinedSizes--;
        this.vscrollParent.$_undefinedMap[this.id] = void 0;
      }
      this.vscrollData.sizes[this.id] = size;
      if (this.emitResize) this.$emit("resize", this.id);
    },
    observeSize() {
      if (!this.vscrollResizeObserver) return;
      if (this.$_sizeObserved) return;
      this.vscrollResizeObserver.observe(this.$el);
      this.$el.$_vs_id = this.id;
      this.$el.$_vs_onResize = this.onResize;
      this.$_sizeObserved = true;
    },
    unobserveSize() {
      if (!this.vscrollResizeObserver) return;
      if (!this.$_sizeObserved) return;
      this.vscrollResizeObserver.unobserve(this.$el);
      this.$el.$_vs_onResize = void 0;
      this.$_sizeObserved = false;
    },
    onResize(id, width, height) {
      if (this.id === id) {
        this.applyWidthHeight(width, height);
      }
    }
  },
  render() {
    return h(this.tag, this.$slots.default());
  }
};
script.__file = "src/components/DynamicScrollerItem.vue";
function set(target, key, val) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  target[key] = val;
  return val;
}
function del(target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return;
  }
  delete target[key];
}
function getDevtoolsGlobalHook() {
  return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function getTarget() {
  return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : {};
}
const isProxyAvailable = typeof Proxy === "function";
const HOOK_SETUP = "devtools-plugin:setup";
const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
let supported;
let perf;
function isPerformanceSupported() {
  var _a;
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else if (typeof globalThis !== "undefined" && ((_a = globalThis.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
    supported = true;
    perf = globalThis.perf_hooks.performance;
  } else {
    supported = false;
  }
  return supported;
}
function now() {
  return isPerformanceSupported() ? perf.now() : Date.now();
}
class ApiProxy {
  constructor(plugin, hook) {
    this.target = null;
    this.targetQueue = [];
    this.onQueue = [];
    this.plugin = plugin;
    this.hook = hook;
    const defaultSettings = {};
    if (plugin.settings) {
      for (const id in plugin.settings) {
        const item = plugin.settings[id];
        defaultSettings[id] = item.defaultValue;
      }
    }
    const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
    let currentSettings = Object.assign({}, defaultSettings);
    try {
      const raw = localStorage.getItem(localSettingsSaveId);
      const data = JSON.parse(raw);
      Object.assign(currentSettings, data);
    } catch (e) {
    }
    this.fallbacks = {
      getSettings() {
        return currentSettings;
      },
      setSettings(value) {
        try {
          localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
        } catch (e) {
        }
        currentSettings = value;
      },
      now() {
        return now();
      }
    };
    if (hook) {
      hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
        if (pluginId === this.plugin.id) {
          this.fallbacks.setSettings(value);
        }
      });
    }
    this.proxiedOn = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target.on[prop];
        } else {
          return (...args) => {
            this.onQueue.push({
              method: prop,
              args
            });
          };
        }
      }
    });
    this.proxiedTarget = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target[prop];
        } else if (prop === "on") {
          return this.proxiedOn;
        } else if (Object.keys(this.fallbacks).includes(prop)) {
          return (...args) => {
            this.targetQueue.push({
              method: prop,
              args,
              resolve: () => {
              }
            });
            return this.fallbacks[prop](...args);
          };
        } else {
          return (...args) => {
            return new Promise((resolve) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve
              });
            });
          };
        }
      }
    });
  }
  async setRealTarget(target) {
    this.target = target;
    for (const item of this.onQueue) {
      this.target.on[item.method](...item.args);
    }
    for (const item of this.targetQueue) {
      item.resolve(await this.target[item.method](...item.args));
    }
  }
}
function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
  const descriptor = pluginDescriptor;
  const target = getTarget();
  const hook = getDevtoolsGlobalHook();
  const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
  if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
    hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
  } else {
    const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
    const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
    list.push({
      pluginDescriptor: descriptor,
      setupFn,
      proxy
    });
    if (proxy) {
      setupFn(proxy.proxiedTarget);
    }
  }
}
/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const getActivePinia = () => hasInjectionContext() && inject(piniaSymbol) || activePinia;
const piniaSymbol = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
const IS_CLIENT = typeof window !== "undefined";
const _global = /* @__PURE__ */ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
function bom(blob, { autoBom = false } = {}) {
  if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
  }
  return blob;
}
function download(url, name, opts) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.onload = function() {
    saveAs(xhr.response, name, opts);
  };
  xhr.onerror = function() {
    console.error("could not download file");
  };
  xhr.send();
}
function corsEnabled(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("HEAD", url, false);
  try {
    xhr.send();
  } catch (e) {
  }
  return xhr.status >= 200 && xhr.status <= 299;
}
function click(node) {
  try {
    node.dispatchEvent(new MouseEvent("click"));
  } catch (e) {
    const evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    node.dispatchEvent(evt);
  }
}
const _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
const isMacOSWebView = /* @__PURE__ */ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
const saveAs = !IS_CLIENT ? () => {
} : (
  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : (
    // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in _navigator ? msSaveAs : (
      // Fallback to using FileReader and a popup
      fileSaverSaveAs
    )
  )
);
function downloadSaveAs(blob, name = "download", opts) {
  const a = document.createElement("a");
  a.download = name;
  a.rel = "noopener";
  if (typeof blob === "string") {
    a.href = blob;
    if (a.origin !== location.origin) {
      if (corsEnabled(a.href)) {
        download(blob, name, opts);
      } else {
        a.target = "_blank";
        click(a);
      }
    } else {
      click(a);
    }
  } else {
    a.href = URL.createObjectURL(blob);
    setTimeout(function() {
      URL.revokeObjectURL(a.href);
    }, 4e4);
    setTimeout(function() {
      click(a);
    }, 0);
  }
}
function msSaveAs(blob, name = "download", opts) {
  if (typeof blob === "string") {
    if (corsEnabled(blob)) {
      download(blob, name, opts);
    } else {
      const a = document.createElement("a");
      a.href = blob;
      a.target = "_blank";
      setTimeout(function() {
        click(a);
      });
    }
  } else {
    navigator.msSaveOrOpenBlob(bom(blob, opts), name);
  }
}
function fileSaverSaveAs(blob, name, opts, popup) {
  popup = popup || open("", "_blank");
  if (popup) {
    popup.document.title = popup.document.body.innerText = "downloading...";
  }
  if (typeof blob === "string")
    return download(blob, name, opts);
  const force = blob.type === "application/octet-stream";
  const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
  const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
    const reader = new FileReader();
    reader.onloadend = function() {
      let url = reader.result;
      if (typeof url !== "string") {
        popup = null;
        throw new Error("Wrong reader.result type");
      }
      url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
      if (popup) {
        popup.location.href = url;
      } else {
        location.assign(url);
      }
      popup = null;
    };
    reader.readAsDataURL(blob);
  } else {
    const url = URL.createObjectURL(blob);
    if (popup)
      popup.location.assign(url);
    else
      location.href = url;
    popup = null;
    setTimeout(function() {
      URL.revokeObjectURL(url);
    }, 4e4);
  }
}
function toastMessage(message, type) {
  const piniaMessage = "🍍 " + message;
  if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
    __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
  } else if (type === "error") {
    console.error(piniaMessage);
  } else if (type === "warn") {
    console.warn(piniaMessage);
  } else {
    console.log(piniaMessage);
  }
}
function isPinia(o) {
  return "_a" in o && "install" in o;
}
function checkClipboardAccess() {
  if (!("clipboard" in navigator)) {
    toastMessage(`Your browser doesn't support the Clipboard API`, "error");
    return true;
  }
}
function checkNotFocusedError(error) {
  if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
    toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
    return true;
  }
  return false;
}
async function actionGlobalCopyState(pinia) {
  if (checkClipboardAccess())
    return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(pinia.state.value));
    toastMessage("Global state copied to clipboard.");
  } catch (error) {
    if (checkNotFocusedError(error))
      return;
    toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
    console.error(error);
  }
}
async function actionGlobalPasteState(pinia) {
  if (checkClipboardAccess())
    return;
  try {
    loadStoresState(pinia, JSON.parse(await navigator.clipboard.readText()));
    toastMessage("Global state pasted from clipboard.");
  } catch (error) {
    if (checkNotFocusedError(error))
      return;
    toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
    console.error(error);
  }
}
async function actionGlobalSaveState(pinia) {
  try {
    saveAs(new Blob([JSON.stringify(pinia.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (error) {
    toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
    console.error(error);
  }
}
let fileInput;
function getFileOpener() {
  if (!fileInput) {
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
  }
  function openFile() {
    return new Promise((resolve, reject) => {
      fileInput.onchange = async () => {
        const files = fileInput.files;
        if (!files)
          return resolve(null);
        const file = files.item(0);
        if (!file)
          return resolve(null);
        return resolve({ text: await file.text(), file });
      };
      fileInput.oncancel = () => resolve(null);
      fileInput.onerror = reject;
      fileInput.click();
    });
  }
  return openFile;
}
async function actionGlobalOpenStateFile(pinia) {
  try {
    const open2 = getFileOpener();
    const result = await open2();
    if (!result)
      return;
    const { text, file } = result;
    loadStoresState(pinia, JSON.parse(text));
    toastMessage(`Global state imported from "${file.name}".`);
  } catch (error) {
    toastMessage(`Failed to import the state from JSON. Check the console for more details.`, "error");
    console.error(error);
  }
}
function loadStoresState(pinia, state) {
  for (const key in state) {
    const storeState = pinia.state.value[key];
    if (storeState) {
      Object.assign(storeState, state[key]);
    } else {
      pinia.state.value[key] = state[key];
    }
  }
}
function formatDisplay(display) {
  return {
    _custom: {
      display
    }
  };
}
const PINIA_ROOT_LABEL = "🍍 Pinia (root)";
const PINIA_ROOT_ID = "_root";
function formatStoreForInspectorTree(store) {
  return isPinia(store) ? {
    id: PINIA_ROOT_ID,
    label: PINIA_ROOT_LABEL
  } : {
    id: store.$id,
    label: store.$id
  };
}
function formatStoreForInspectorState(store) {
  if (isPinia(store)) {
    const storeNames = Array.from(store._s.keys());
    const storeMap = store._s;
    const state2 = {
      state: storeNames.map((storeId) => ({
        editable: true,
        key: storeId,
        value: store.state.value[storeId]
      })),
      getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
        const store2 = storeMap.get(id);
        return {
          editable: false,
          key: id,
          value: store2._getters.reduce((getters, key) => {
            getters[key] = store2[key];
            return getters;
          }, {})
        };
      })
    };
    return state2;
  }
  const state = {
    state: Object.keys(store.$state).map((key) => ({
      editable: true,
      key,
      value: store.$state[key]
    }))
  };
  if (store._getters && store._getters.length) {
    state.getters = store._getters.map((getterName) => ({
      editable: false,
      key: getterName,
      value: store[getterName]
    }));
  }
  if (store._customProperties.size) {
    state.customProperties = Array.from(store._customProperties).map((key) => ({
      editable: true,
      key,
      value: store[key]
    }));
  }
  return state;
}
function formatEventData(events) {
  if (!events)
    return {};
  if (Array.isArray(events)) {
    return events.reduce((data, event) => {
      data.keys.push(event.key);
      data.operations.push(event.type);
      data.oldValue[event.key] = event.oldValue;
      data.newValue[event.key] = event.newValue;
      return data;
    }, {
      oldValue: {},
      keys: [],
      operations: [],
      newValue: {}
    });
  } else {
    return {
      operation: formatDisplay(events.type),
      key: formatDisplay(events.key),
      oldValue: events.oldValue,
      newValue: events.newValue
    };
  }
}
function formatMutationType(type) {
  switch (type) {
    case MutationType.direct:
      return "mutation";
    case MutationType.patchFunction:
      return "$patch";
    case MutationType.patchObject:
      return "$patch";
    default:
      return "unknown";
  }
}
let isTimelineActive = true;
const componentStateTypes = [];
const MUTATIONS_LAYER_ID = "pinia:mutations";
const INSPECTOR_ID = "pinia";
const { assign: assign$1 } = Object;
const getStoreType = (id) => "🍍 " + id;
function registerPiniaDevtools(app, pinia) {
  setupDevtoolsPlugin({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes,
    app
  }, (api) => {
    if (typeof api.now !== "function") {
      toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
    }
    api.addTimelineLayer({
      id: MUTATIONS_LAYER_ID,
      label: `Pinia 🍍`,
      color: 15064968
    });
    api.addInspector({
      id: INSPECTOR_ID,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            actionGlobalCopyState(pinia);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await actionGlobalPasteState(pinia);
            api.sendInspectorTree(INSPECTOR_ID);
            api.sendInspectorState(INSPECTOR_ID);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            actionGlobalSaveState(pinia);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await actionGlobalOpenStateFile(pinia);
            api.sendInspectorTree(INSPECTOR_ID);
            api.sendInspectorState(INSPECTOR_ID);
          },
          tooltip: "Import the state from a JSON file"
        }
      ],
      nodeActions: [
        {
          icon: "restore",
          tooltip: 'Reset the state (with "$reset")',
          action: (nodeId) => {
            const store = pinia._s.get(nodeId);
            if (!store) {
              toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, "warn");
            } else if (typeof store.$reset !== "function") {
              toastMessage(`Cannot reset "${nodeId}" store because it doesn't have a "$reset" method implemented.`, "warn");
            } else {
              store.$reset();
              toastMessage(`Store "${nodeId}" reset.`);
            }
          }
        }
      ]
    });
    api.on.inspectComponent((payload, ctx) => {
      const proxy = payload.componentInstance && payload.componentInstance.proxy;
      if (proxy && proxy._pStores) {
        const piniaStores = payload.componentInstance.proxy._pStores;
        Object.values(piniaStores).forEach((store) => {
          payload.instanceData.state.push({
            type: getStoreType(store.$id),
            key: "state",
            editable: true,
            value: store._isOptionsAPI ? {
              _custom: {
                value: toRaw(store.$state),
                actions: [
                  {
                    icon: "restore",
                    tooltip: "Reset the state of this store",
                    action: () => store.$reset()
                  }
                ]
              }
            } : (
              // NOTE: workaround to unwrap transferred refs
              Object.keys(store.$state).reduce((state, key) => {
                state[key] = store.$state[key];
                return state;
              }, {})
            )
          });
          if (store._getters && store._getters.length) {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "getters",
              editable: false,
              value: store._getters.reduce((getters, key) => {
                try {
                  getters[key] = store[key];
                } catch (error) {
                  getters[key] = error;
                }
                return getters;
              }, {})
            });
          }
        });
      }
    });
    api.on.getInspectorTree((payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        let stores = [pinia];
        stores = stores.concat(Array.from(pinia._s.values()));
        payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
      }
    });
    globalThis.$pinia = pinia;
    api.on.getInspectorState((payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
        if (!inspectedStore) {
          return;
        }
        if (inspectedStore) {
          if (payload.nodeId !== PINIA_ROOT_ID)
            globalThis.$store = toRaw(inspectedStore);
          payload.state = formatStoreForInspectorState(inspectedStore);
        }
      }
    });
    api.on.editInspectorState((payload, ctx) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
        if (!inspectedStore) {
          return toastMessage(`store "${payload.nodeId}" not found`, "error");
        }
        const { path } = payload;
        if (!isPinia(inspectedStore)) {
          if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
            path.unshift("$state");
          }
        } else {
          path.unshift("state");
        }
        isTimelineActive = false;
        payload.set(inspectedStore, path, payload.state.value);
        isTimelineActive = true;
      }
    });
    api.on.editComponentState((payload) => {
      if (payload.type.startsWith("🍍")) {
        const storeId = payload.type.replace(/^🍍\s*/, "");
        const store = pinia._s.get(storeId);
        if (!store) {
          return toastMessage(`store "${storeId}" not found`, "error");
        }
        const { path } = payload;
        if (path[0] !== "state") {
          return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
        }
        path[0] = "$state";
        isTimelineActive = false;
        payload.set(store, path, payload.state.value);
        isTimelineActive = true;
      }
    });
  });
}
function addStoreToDevtools(app, store) {
  if (!componentStateTypes.includes(getStoreType(store.$id))) {
    componentStateTypes.push(getStoreType(store.$id));
  }
  setupDevtoolsPlugin({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes,
    app,
    settings: {
      logStoreChanges: {
        label: "Notify about new/deleted stores",
        type: "boolean",
        defaultValue: true
      }
      // useEmojis: {
      //   label: 'Use emojis in messages ⚡️',
      //   type: 'boolean',
      //   defaultValue: true,
      // },
    }
  }, (api) => {
    const now2 = typeof api.now === "function" ? api.now.bind(api) : Date.now;
    store.$onAction(({ after, onError, name, args }) => {
      const groupId = runningActionId++;
      api.addTimelineEvent({
        layerId: MUTATIONS_LAYER_ID,
        event: {
          time: now2(),
          title: "🛫 " + name,
          subtitle: "start",
          data: {
            store: formatDisplay(store.$id),
            action: formatDisplay(name),
            args
          },
          groupId
        }
      });
      after((result) => {
        activeAction = void 0;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🛬 " + name,
            subtitle: "end",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args,
              result
            },
            groupId
          }
        });
      });
      onError((error) => {
        activeAction = void 0;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            logType: "error",
            title: "💥 " + name,
            subtitle: "end",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args,
              error
            },
            groupId
          }
        });
      });
    }, true);
    store._customProperties.forEach((name) => {
      watch(() => unref(store[name]), (newValue, oldValue) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (isTimelineActive) {
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              title: "Change",
              subtitle: name,
              data: {
                newValue,
                oldValue
              },
              groupId: activeAction
            }
          });
        }
      }, { deep: true });
    });
    store.$subscribe(({ events, type }, state) => {
      api.notifyComponentUpdate();
      api.sendInspectorState(INSPECTOR_ID);
      if (!isTimelineActive)
        return;
      const eventData = {
        time: now2(),
        title: formatMutationType(type),
        data: assign$1({ store: formatDisplay(store.$id) }, formatEventData(events)),
        groupId: activeAction
      };
      if (type === MutationType.patchFunction) {
        eventData.subtitle = "⤵️";
      } else if (type === MutationType.patchObject) {
        eventData.subtitle = "🧩";
      } else if (events && !Array.isArray(events)) {
        eventData.subtitle = events.type;
      }
      if (events) {
        eventData.data["rawEvent(s)"] = {
          _custom: {
            display: "DebuggerEvent",
            type: "object",
            tooltip: "raw DebuggerEvent[]",
            value: events
          }
        };
      }
      api.addTimelineEvent({
        layerId: MUTATIONS_LAYER_ID,
        event: eventData
      });
    }, { detached: true, flush: "sync" });
    const hotUpdate = store._hotUpdate;
    store._hotUpdate = markRaw((newStore) => {
      hotUpdate(newStore);
      api.addTimelineEvent({
        layerId: MUTATIONS_LAYER_ID,
        event: {
          time: now2(),
          title: "🔥 " + store.$id,
          subtitle: "HMR update",
          data: {
            store: formatDisplay(store.$id),
            info: formatDisplay(`HMR update`)
          }
        }
      });
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
    });
    const { $dispose } = store;
    store.$dispose = () => {
      $dispose();
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store 🗑`);
    };
    api.notifyComponentUpdate();
    api.sendInspectorTree(INSPECTOR_ID);
    api.sendInspectorState(INSPECTOR_ID);
    api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed 🆕`);
  });
}
let runningActionId = 0;
let activeAction;
function patchActionForGrouping(store, actionNames, wrapWithProxy) {
  const actions = actionNames.reduce((storeActions, actionName) => {
    storeActions[actionName] = toRaw(store)[actionName];
    return storeActions;
  }, {});
  for (const actionName in actions) {
    store[actionName] = function() {
      const _actionId = runningActionId;
      const trackedStore = wrapWithProxy ? new Proxy(store, {
        get(...args) {
          activeAction = _actionId;
          return Reflect.get(...args);
        },
        set(...args) {
          activeAction = _actionId;
          return Reflect.set(...args);
        }
      }) : store;
      activeAction = _actionId;
      const retValue = actions[actionName].apply(trackedStore, arguments);
      activeAction = void 0;
      return retValue;
    };
  }
}
function devtoolsPlugin({ app, store, options }) {
  if (store.$id.startsWith("__hot:")) {
    return;
  }
  store._isOptionsAPI = !!options.state;
  if (!store._p._testing) {
    patchActionForGrouping(store, Object.keys(options.actions), store._isOptionsAPI);
    const originalHotUpdate = store._hotUpdate;
    toRaw(store)._hotUpdate = function(newStore) {
      originalHotUpdate.apply(this, arguments);
      patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions), !!store._isOptionsAPI);
    };
  }
  addStoreToDevtools(
    app,
    // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
    store
  );
}
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        if ((process.env.NODE_ENV !== "production" || false) && !(process.env.NODE_ENV === "test") && IS_CLIENT) {
          registerPiniaDevtools(app, pinia);
        }
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && true) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  if ((process.env.NODE_ENV !== "production" || false) && !(process.env.NODE_ENV === "test") && IS_CLIENT && typeof Proxy !== "undefined") {
    pinia.use(devtoolsPlugin);
  }
  return pinia;
}
function patchObject(newState, oldState) {
  for (const key in oldState) {
    const subPatch = oldState[key];
    if (!(key in newState)) {
      continue;
    }
    const targetValue = newState[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && !isRef(subPatch) && !isReactive(subPatch)) {
      newState[key] = patchObject(targetValue, subPatch);
    } else {
      {
        newState[key] = subPatch;
      }
    }
  }
  return newState;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
const ACTION_MARKER = Symbol();
const ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  } else if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && (!(process.env.NODE_ENV !== "production") || !hot)) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = process.env.NODE_ENV !== "production" && hot ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      toRefs(ref(state ? state() : {}).value)
    ) : toRefs(pinia.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      if (process.env.NODE_ENV !== "production" && name in localState) {
        console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
      }
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  if (process.env.NODE_ENV !== "production" && !pinia._e.active) {
    throw new Error("Pinia destroyed");
  }
  const $subscribeOptions = { deep: true };
  if (process.env.NODE_ENV !== "production" && true) {
    $subscribeOptions.onTrigger = (event) => {
      if (isListening) {
        debuggerEvents = event;
      } else if (isListening == false && !store._hotUpdating) {
        if (Array.isArray(debuggerEvents)) {
          debuggerEvents.push(event);
        } else {
          console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
        }
      }
    };
  }
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && (!(process.env.NODE_ENV !== "production") || !hot)) {
    {
      pinia.state.value[$id] = {};
    }
  }
  const hotState = ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (process.env.NODE_ENV !== "production") {
      debuggerEvents = [];
    }
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
    } : noop
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  const action = (fn, name = "") => {
    if (ACTION_MARKER in fn) {
      fn[ACTION_NAME] = name;
      return fn;
    }
    const wrappedAction = function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
    wrappedAction[ACTION_MARKER] = true;
    wrappedAction[ACTION_NAME] = name;
    return wrappedAction;
  };
  const _hmrPayload = /* @__PURE__ */ markRaw({
    actions: {},
    getters: {},
    state: [],
    hotState
  });
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(process.env.NODE_ENV !== "production" || (process.env.NODE_ENV !== "production" || false) && !(process.env.NODE_ENV === "test") && IS_CLIENT ? assign(
    {
      _hmrPayload,
      _customProperties: markRaw(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    partialStore
    // must be added later
    // setupStore
  ) : partialStore);
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (process.env.NODE_ENV !== "production" && hot) {
        set(hotState.value, key, toRef(setupStore, key));
      } else if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
      if (process.env.NODE_ENV !== "production") {
        _hmrPayload.state.push(key);
      }
    } else if (typeof prop === "function") {
      const actionValue = process.env.NODE_ENV !== "production" && hot ? prop : action(prop, key);
      {
        setupStore[key] = actionValue;
      }
      if (process.env.NODE_ENV !== "production") {
        _hmrPayload.actions[key] = prop;
      }
      optionsForPlugin.actions[key] = prop;
    } else if (process.env.NODE_ENV !== "production") {
      if (isComputed(prop)) {
        _hmrPayload.getters[key] = isOptionsStore ? (
          // @ts-expect-error
          options.getters[key]
        ) : prop;
        if (IS_CLIENT) {
          const getters = setupStore._getters || // @ts-expect-error: same
          (setupStore._getters = markRaw([]));
          getters.push(key);
        }
      }
    }
  }
  {
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => process.env.NODE_ENV !== "production" && hot ? hotState.value : pinia.state.value[$id],
    set: (state) => {
      if (process.env.NODE_ENV !== "production" && hot) {
        throw new Error("cannot set hotState");
      }
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    store._hotUpdate = markRaw((newStore) => {
      store._hotUpdating = true;
      newStore._hmrPayload.state.forEach((stateKey) => {
        if (stateKey in store.$state) {
          const newStateTarget = newStore.$state[stateKey];
          const oldStateSource = store.$state[stateKey];
          if (typeof newStateTarget === "object" && isPlainObject(newStateTarget) && isPlainObject(oldStateSource)) {
            patchObject(newStateTarget, oldStateSource);
          } else {
            newStore.$state[stateKey] = oldStateSource;
          }
        }
        set(store, stateKey, toRef(newStore.$state, stateKey));
      });
      Object.keys(store.$state).forEach((stateKey) => {
        if (!(stateKey in newStore.$state)) {
          del(store, stateKey);
        }
      });
      isListening = false;
      isSyncListening = false;
      pinia.state.value[$id] = toRef(newStore._hmrPayload, "hotState");
      isSyncListening = true;
      nextTick().then(() => {
        isListening = true;
      });
      for (const actionName in newStore._hmrPayload.actions) {
        const actionFn = newStore[actionName];
        set(store, actionName, action(actionFn, actionName));
      }
      for (const getterName in newStore._hmrPayload.getters) {
        const getter = newStore._hmrPayload.getters[getterName];
        const getterValue = isOptionsStore ? (
          // special handling of options api
          computed(() => {
            setActivePinia(pinia);
            return getter.call(store, store);
          })
        ) : getter;
        set(store, getterName, getterValue);
      }
      Object.keys(store._hmrPayload.getters).forEach((key) => {
        if (!(key in newStore._hmrPayload.getters)) {
          del(store, key);
        }
      });
      Object.keys(store._hmrPayload.actions).forEach((key) => {
        if (!(key in newStore._hmrPayload.actions)) {
          del(store, key);
        }
      });
      store._hmrPayload = newStore._hmrPayload;
      store._getters = newStore._getters;
      store._hotUpdating = false;
    });
  }
  if ((process.env.NODE_ENV !== "production" || false) && !(process.env.NODE_ENV === "test") && IS_CLIENT) {
    const nonEnumerable = {
      writable: true,
      configurable: true,
      // avoid warning on devtools trying to display this property
      enumerable: false
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
      Object.defineProperty(store, p, assign({ value: store[p] }, nonEnumerable));
    });
  }
  pinia._p.forEach((extender) => {
    if ((process.env.NODE_ENV !== "production" || false) && !(process.env.NODE_ENV === "test") && IS_CLIENT) {
      const extensions = scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      }));
      Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
      assign(store, extensions);
    } else {
      assign(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (process.env.NODE_ENV !== "production" && store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
    console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
  }
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
    if (process.env.NODE_ENV !== "production" && typeof id !== "string") {
      throw new Error(`[🍍]: "defineStore()" must be passed a store id as its first argument.`);
    }
  }
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && activePinia && activePinia._testing ? null : pinia) || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    if (process.env.NODE_ENV !== "production" && !activePinia) {
      throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
    }
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
      if (process.env.NODE_ENV !== "production") {
        useStore._pinia = pinia;
      }
    }
    const store = pinia._s.get(id);
    if (process.env.NODE_ENV !== "production" && hot) {
      const hotId = "__hot:" + id;
      const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia, true) : createOptionsStore(hotId, assign({}, options), pinia, true);
      hot._hotUpdate(newStore);
      delete pinia.state.value[hotId];
      pinia._s.delete(hotId);
    }
    if (process.env.NODE_ENV !== "production" && IS_CLIENT) {
      const currentInstance = getCurrentInstance();
      if (currentInstance && currentInstance.proxy && // avoid adding stores that are just built for hot module replacement
      !hot) {
        const vm = currentInstance.proxy;
        const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
        cache[id] = store;
      }
    }
    return store;
  }
  useStore.$id = id;
  return useStore;
}
function useFiltering() {
  const currentFilter = ref(null);
  function evaluateFilter(row, filter, store) {
    if (filter.type === "simple") {
      return evaluateSimpleFilter(row, filter, store);
    } else {
      return evaluateCompositeFilter(row, filter, store);
    }
  }
  function evaluateSimpleFilter(row, filter, store) {
    let cellValue;
    if (filter.columnName === "__checkbox" && store) {
      cellValue = store.isRowChecked(row.rowId);
    } else {
      const cell = row.cells.find((c) => c.columnName === filter.columnName);
      cellValue = cell == null ? void 0 : cell.value;
    }
    const filterValue = filter.value;
    switch (filter.operator) {
      case "Equals":
        return cellValue === filterValue;
      case "NotEquals":
        return cellValue !== filterValue;
      case "GreaterThan":
        return Number(cellValue) > Number(filterValue);
      case "LessThan":
        return Number(cellValue) < Number(filterValue);
      case "GreaterThanOrEquals":
        return Number(cellValue) >= Number(filterValue);
      case "LessThanOrEquals":
        return Number(cellValue) <= Number(filterValue);
      case "Contains":
        return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
      case "StartsWith":
        return String(cellValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
      case "EndsWith":
        return String(cellValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
      case "IsEmpty":
        return cellValue == null || String(cellValue).trim() === "";
      case "IsNotEmpty":
        return cellValue != null && String(cellValue).trim() !== "";
      default:
        return true;
    }
  }
  function evaluateCompositeFilter(row, filter, store) {
    if (!filter.left || !filter.right) {
      console.error("[evaluateCompositeFilter] Invalid filter structure - missing children:", filter);
      return true;
    }
    const leftResult = evaluateFilter(row, filter.left, store);
    if (filter.operator === "AND" && !leftResult) {
      return false;
    }
    if (filter.operator === "OR" && leftResult) {
      return true;
    }
    const rightResult = evaluateFilter(row, filter.right, store);
    return filter.operator === "AND" ? leftResult && rightResult : leftResult || rightResult;
  }
  function filterRows(rows, filter, store) {
    if (!filter) return rows;
    return rows.filter((row) => evaluateFilter(row, filter, store));
  }
  function setFilter(filter) {
    currentFilter.value = filter;
  }
  function clearFilter() {
    currentFilter.value = null;
  }
  return {
    currentFilter,
    filterRows,
    setFilter,
    clearFilter,
    evaluateFilter
  };
}
function useSearch(rows) {
  const searchTerm = ref("");
  const searchMode = ref("Contains");
  const searchResults = ref([]);
  const currentResultIndex = ref(-1);
  function searchInRows(term, mode, options = {}) {
    if (!term) {
      searchResults.value = [];
      currentResultIndex.value = -1;
      return;
    }
    const matches = [];
    const caseSensitive = options.caseSensitive ?? false;
    const fuzzyThreshold = options.fuzzyThreshold ?? 3;
    for (const row of rows.value) {
      for (const cell of row.cells) {
        const cellValue = String(cell.value || "");
        let isMatch = false;
        const searchValue = caseSensitive ? cellValue : cellValue.toLowerCase();
        const searchTerm2 = caseSensitive ? term : term.toLowerCase();
        switch (mode) {
          case "Exact":
            isMatch = caseSensitive ? cellValue === term : cellValue.toLowerCase() === term.toLowerCase();
            break;
          case "Contains":
            isMatch = searchValue.includes(searchTerm2);
            break;
          case "StartsWith":
            isMatch = searchValue.startsWith(searchTerm2);
            break;
          case "EndsWith":
            isMatch = searchValue.endsWith(searchTerm2);
            break;
          case "Regex":
            try {
              const flags = caseSensitive ? "" : "i";
              const regex2 = new RegExp(term, flags);
              isMatch = regex2.test(cellValue);
            } catch {
              isMatch = false;
            }
            break;
          case "Fuzzy":
            isMatch = fuzzyMatch(cellValue, term, fuzzyThreshold);
            break;
        }
        if (isMatch) {
          matches.push({
            rowId: row.rowId,
            columnName: cell.columnName,
            value: cellValue
          });
        }
      }
    }
    searchResults.value = matches;
    currentResultIndex.value = matches.length > 0 ? 0 : -1;
  }
  function fuzzyMatch(text, pattern, threshold) {
    const distance = levenshteinDistance(text.toLowerCase(), pattern.toLowerCase());
    return distance <= threshold;
  }
  function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            // substitution
            matrix[i][j - 1] + 1,
            // insertion
            matrix[i - 1][j] + 1
            // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
  function goToNextResult() {
    if (currentResultIndex.value < searchResults.value.length - 1) {
      currentResultIndex.value++;
    }
  }
  function goToPreviousResult() {
    if (currentResultIndex.value > 0) {
      currentResultIndex.value--;
    }
  }
  function clearSearch() {
    searchTerm.value = "";
    searchResults.value = [];
    currentResultIndex.value = -1;
  }
  function isSearchMatch(rowId, columnName) {
    return searchResults.value.some(
      (m) => m.rowId === rowId && m.columnName === columnName
    );
  }
  return {
    searchTerm,
    searchMode,
    searchResults,
    currentResultIndex,
    searchInRows,
    goToNextResult,
    goToPreviousResult,
    clearSearch,
    isSearchMatch
  };
}
const storeCache = /* @__PURE__ */ new Map();
const useDataGridStore = (storeId = "dataGrid") => {
  if (!storeId || typeof storeId !== "string") {
    console.error("[useDataGridStore] Invalid storeId:", storeId);
    throw new Error(`Invalid storeId: ${storeId}`);
  }
  if (storeCache.has(storeId)) {
    console.log("[useDataGridStore] Using CACHED store definition for:", storeId);
    return storeCache.get(storeId);
  }
  console.log("[useDataGridStore] Creating NEW store definition for:", storeId);
  const storeDefinition = /* @__PURE__ */ defineStore(storeId, () => {
    const rowsMap = ref(/* @__PURE__ */ new Map());
    const rowsOrder = ref([]);
    const columns = ref([]);
    const selectedCells = ref(/* @__PURE__ */ new Set());
    const checkedRows = ref([]);
    const pageSize = ref(100);
    const currentPage = ref(1);
    const sortColumnsMap = ref(/* @__PURE__ */ new Map());
    const sortColumnsOrder = ref([]);
    const filterExpression = ref(null);
    const searchQuery = ref("");
    const config2 = ref({
      pageSize: 100,
      enableSort: true,
      enableFilter: true,
      enableSearch: true,
      enableValidation: true,
      autoValidate: true,
      // Default: validate automatically on every change
      showRowNumber: false,
      showCheckbox: false,
      showValidationAlerts: true,
      showDeleteButton: false,
      showInsertButton: false
    });
    const pressedCell = ref(null);
    const isDragging = ref(false);
    const wasCtrlPressed = ref(false);
    const isAutoRowHeightEnabled = ref(false);
    const validatedCells = ref(/* @__PURE__ */ new Set());
    const changedCellsSinceValidation = ref(/* @__PURE__ */ new Set());
    const minRows = ref(5);
    const rows = computed(() => {
      return rowsOrder.value.map((rowId) => rowsMap.value.get(rowId)).filter(Boolean);
    });
    const sortColumns = computed(() => {
      return sortColumnsOrder.value.map((columnName) => {
        const sortInfo = sortColumnsMap.value.get(columnName);
        return {
          columnName,
          direction: sortInfo.direction
        };
      });
    });
    function getRow(rowId) {
      return rowsMap.value.get(rowId);
    }
    function hasRow(rowId) {
      return rowsMap.value.has(rowId);
    }
    const { filterRows, evaluateFilter } = useFiltering();
    const { searchResults, isSearchMatch } = useSearch(rows);
    const totalRows = computed(() => rowsOrder.value.length);
    const totalPages = computed(() => Math.ceil(totalRows.value / pageSize.value));
    const visibleRows = computed(() => {
      let filteredRows = rows.value;
      if (filterExpression.value) {
        const storeInterface = {
          checkedRows: checkedRows.value,
          isRowChecked: (rowId) => checkedRows.value.includes(rowId)
        };
        filteredRows = filterRows(filteredRows, filterExpression.value, storeInterface);
      }
      if (searchQuery.value && searchResults.value.length > 0) {
        const searchRowIds = new Set(searchResults.value.map((r) => r.rowId));
        filteredRows = filteredRows.filter((row) => searchRowIds.has(row.rowId));
      }
      if (sortColumns.value.length > 0) {
        filteredRows = sortRows(filteredRows, sortColumns.value);
      }
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredRows.slice(start, end);
    });
    function createEmptyRow(rowIndex) {
      const rowId = `empty-${generateULID()}`;
      return {
        rowId,
        rowIndex,
        height: config2.value.minRowHeight || 25,
        cells: columns.value.map((col) => ({
          rowId,
          columnName: col.name,
          value: null,
          isSelected: false,
          isValidationError: false
        }))
      };
    }
    function ensureMinimumRows() {
      const currentRowCount = rowsOrder.value.length;
      const minimumRequired = minRows.value;
      if (currentRowCount < minimumRequired) {
        const rowsToAdd = minimumRequired - currentRowCount;
        console.log(`[dataGridStore] ensureMinimumRows: Adding ${rowsToAdd} empty rows (current: ${currentRowCount}, min: ${minimumRequired})`);
        for (let i = 0; i < rowsToAdd; i++) {
          const row = createEmptyRow(currentRowCount + i);
          rowsMap.value.set(row.rowId, row);
          rowsOrder.value.push(row.rowId);
        }
      }
    }
    function loadRows(data) {
      var _a;
      console.log("[dataGridStore] loadRows:", {
        originalRowCount: data.length,
        columnCount: columns.value.length,
        autoValidate: config2.value.autoValidate
      });
      const newMap = /* @__PURE__ */ new Map();
      const newOrder = [];
      const visibleColumns = columns.value.filter(
        (col) => !col.specialType && col.visibleForGrid !== false
      );
      let skippedEmptyRows = 0;
      data.forEach((rowData, idx) => {
        const hasVisibleData = visibleColumns.some((col) => {
          const value = rowData[col.name];
          return value !== null && value !== void 0 && value !== "";
        });
        if (!hasVisibleData) {
          skippedEmptyRows++;
          return;
        }
        const rowId = rowData.__rowId || generateULID();
        const height = rowData.__rowHeight || 40;
        const row = {
          rowId,
          rowIndex: newOrder.length,
          // ✅ Actual index after filtering
          height,
          cells: columns.value.map((col) => ({
            rowId,
            columnName: col.name,
            value: rowData[col.name],
            isSelected: false,
            isValidationError: false
          }))
        };
        newMap.set(rowId, row);
        newOrder.push(rowId);
      });
      rowsMap.value = newMap;
      rowsOrder.value = newOrder;
      ensureMinimumRows();
      console.log("[dataGridStore] loadRows complete:", {
        originalRows: data.length,
        loadedRows: rowsOrder.value.length,
        skippedEmptyRows,
        filterRate: `${Math.round(skippedEmptyRows / data.length * 100)}%`,
        minRowsRequired: minRows.value,
        firstRowId: rowsOrder.value[0],
        firstRowCells: (_a = newMap.get(rowsOrder.value[0])) == null ? void 0 : _a.cells.length
      });
    }
    function updateCell(rowId, columnName, value) {
      const row = getRow(rowId);
      if (row) {
        const cell = row.cells.find((c) => c.columnName === columnName);
        if (cell) {
          const oldValue = cell.value;
          cell.value = value;
          console.log("[dataGridStore] updateCell:", {
            rowId,
            columnName,
            oldValue,
            newValue: value,
            autoValidate: config2.value.autoValidate
          });
          const cellKey = `${rowId}:${columnName}`;
          changedCellsSinceValidation.value.add(cellKey);
        } else {
          console.warn("[dataGridStore] updateCell: cell not found", { rowId, columnName });
        }
      } else {
        console.warn("[dataGridStore] updateCell: row not found", { rowId });
      }
    }
    function updateRowHeight(rowId, newHeight) {
      const row = getRow(rowId);
      if (row) {
        const oldHeight = row.height;
        row.height = newHeight;
        console.log("[dataGridStore] updateRowHeight:", {
          rowId,
          oldHeight,
          newHeight,
          autoRowHeightEnabled: isAutoRowHeightEnabled.value
        });
      } else {
        console.warn("[dataGridStore] updateRowHeight: row not found", { rowId });
      }
    }
    function setAutoRowHeightEnabled(enabled) {
      console.log(`[dataGridStore] setAutoRowHeightEnabled: oldValue=${isAutoRowHeightEnabled.value}, newValue=${enabled}`);
      isAutoRowHeightEnabled.value = enabled;
    }
    function sortRows(rowsToSort, sorts) {
      if (sorts.length === 0) return rowsToSort;
      return [...rowsToSort].sort((a, b) => {
        for (const { columnName, direction } of sorts) {
          const aCell = a.cells.find((c) => c.columnName === columnName);
          const bCell = b.cells.find((c) => c.columnName === columnName);
          const aVal = aCell == null ? void 0 : aCell.value;
          const bVal = bCell == null ? void 0 : bCell.value;
          const cmp = compareValues(aVal, bVal);
          if (cmp !== 0) {
            return direction === "asc" ? cmp : -cmp;
          }
        }
        return 0;
      });
    }
    function compareValues(a, b) {
      if (a == null && b == null) return 0;
      if (a == null) return -1;
      if (b == null) return 1;
      if (typeof a === "number" && typeof b === "number") {
        return a - b;
      }
      return String(a).localeCompare(String(b));
    }
    function addSort(columnName, direction, multiSort = false) {
      if (!multiSort) {
        sortColumnsMap.value.clear();
        sortColumnsOrder.value = [columnName];
        sortColumnsMap.value.set(columnName, { direction, order: 1 });
      } else {
        if (sortColumnsMap.value.has(columnName)) {
          const existing = sortColumnsMap.value.get(columnName);
          sortColumnsMap.value.set(columnName, { direction, order: existing.order });
        } else {
          const newOrder = sortColumnsOrder.value.length + 1;
          sortColumnsMap.value.set(columnName, { direction, order: newOrder });
          sortColumnsOrder.value.push(columnName);
        }
      }
    }
    function clearSort() {
      sortColumnsMap.value.clear();
      sortColumnsOrder.value = [];
    }
    function setSortColumns(sorts) {
      sortColumnsMap.value.clear();
      sortColumnsOrder.value = [];
      sorts.forEach((sort, index2) => {
        sortColumnsMap.value.set(sort.columnName, { direction: sort.direction, order: index2 + 1 });
        sortColumnsOrder.value.push(sort.columnName);
      });
    }
    function setPageSize(size) {
      pageSize.value = size;
      currentPage.value = 1;
    }
    function goToPage(page) {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    }
    function generateULID() {
      return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    function deleteRow(rowId) {
      if (hasRow(rowId)) {
        console.log("[dataGridStore] deleteRow:", {
          rowId,
          rowsBefore: rowsOrder.value.length,
          wasChecked: checkedRows.value.includes(rowId)
        });
        rowsMap.value.delete(rowId);
        rowsOrder.value = rowsOrder.value.filter((id) => id !== rowId);
        const checkedIndex = checkedRows.value.indexOf(rowId);
        if (checkedIndex > -1) {
          checkedRows.value.splice(checkedIndex, 1);
        }
        rowsOrder.value.forEach((id, idx) => {
          const row = rowsMap.value.get(id);
          if (row) {
            row.rowIndex = idx;
          }
        });
        console.log("[dataGridStore] deleteRow complete:", {
          rowsAfter: rowsOrder.value.length
        });
      } else {
        console.warn("[dataGridStore] deleteRow: row not found", { rowId });
      }
    }
    function insertRow(afterRowId) {
      const index2 = rowsOrder.value.indexOf(afterRowId);
      const newRowId = generateULID();
      console.log("[dataGridStore] insertRow:", {
        afterRowId,
        index: index2,
        newRowId,
        rowsBefore: rowsOrder.value.length
      });
      const newRow = {
        rowId: newRowId,
        rowIndex: index2 + 1,
        height: 32,
        cells: columns.value.filter((col) => !col.specialType).map((col) => ({
          rowId: newRowId,
          columnName: col.name,
          value: null,
          isSelected: false,
          isValidationError: false
        }))
      };
      rowsMap.value.set(newRowId, newRow);
      rowsOrder.value.splice(index2 + 1, 0, newRowId);
      rowsOrder.value.forEach((id, idx) => {
        const row = rowsMap.value.get(id);
        if (row) {
          row.rowIndex = idx;
        }
      });
      console.log("[dataGridStore] insertRow complete:", {
        rowsAfter: rowsOrder.value.length
      });
    }
    function insertMultipleRows(rowId, count, position) {
      const index2 = rowsOrder.value.indexOf(rowId);
      if (index2 === -1) {
        console.warn("[dataGridStore] insertMultipleRows: row not found", { rowId });
        return;
      }
      console.log("[dataGridStore] insertMultipleRows:", {
        rowId,
        count,
        position,
        index: index2,
        rowsBefore: rowsOrder.value.length
      });
      const insertIndex = position === "above" ? index2 : index2 + 1;
      const newRowIds = [];
      for (let i = 0; i < count; i++) {
        const newRowId = generateULID();
        const newRow = {
          rowId: newRowId,
          rowIndex: insertIndex + i,
          height: 32,
          cells: columns.value.filter((col) => !col.specialType).map((col) => ({
            rowId: newRowId,
            columnName: col.name,
            value: null,
            isSelected: false,
            isValidationError: false
          }))
        };
        rowsMap.value.set(newRowId, newRow);
        newRowIds.push(newRowId);
      }
      rowsOrder.value.splice(insertIndex, 0, ...newRowIds);
      rowsOrder.value.forEach((id, idx) => {
        const row = rowsMap.value.get(id);
        if (row) {
          row.rowIndex = idx;
        }
      });
      console.log("[dataGridStore] insertMultipleRows complete:", {
        rowsAfter: rowsOrder.value.length,
        newRowIds
      });
    }
    function toggleCheckbox(rowId, checked) {
      console.log("[toggleCheckbox] Called:", { rowId, checked, currentCount: checkedRows.value.length });
      if (checked) {
        if (!checkedRows.value.includes(rowId)) {
          checkedRows.value.push(rowId);
        }
      } else {
        const index2 = checkedRows.value.indexOf(rowId);
        if (index2 > -1) {
          checkedRows.value.splice(index2, 1);
        }
      }
      console.log("[toggleCheckbox] After:", { count: checkedRows.value.length, checkboxState: checkboxState.value });
    }
    function isRowChecked(rowId) {
      return checkedRows.value.includes(rowId);
    }
    function toggleAllCheckboxes() {
      const currentCount = checkedRows.value.length;
      const totalCount = rows.value.length;
      console.log("[toggleAllCheckboxes] BEFORE:", { currentCount, totalCount, checkboxState: checkboxState.value });
      if (checkedRows.value.length === rows.value.length) {
        console.log("[toggleAllCheckboxes] ACTION: Unchecking all (was all checked)");
        checkedRows.value = [];
      } else {
        console.log("[toggleAllCheckboxes] ACTION: Checking all (was not all checked)");
        checkedRows.value = rows.value.map((r) => r.rowId);
      }
      const newCount = checkedRows.value.length;
      const newState = checkboxState.value;
      console.log("[toggleAllCheckboxes] AFTER:", { newCount, totalCount, newState });
    }
    const checkboxState = computed(() => {
      const checkedCount = checkedRows.value.length;
      if (checkedCount === 0) return "none";
      if (checkedCount === rows.value.length) return "all";
      return "some";
    });
    function setConfig(newConfig) {
      console.log("[dataGridStore] setConfig:", {
        newConfig,
        oldAutoValidate: config2.value.autoValidate,
        newAutoValidate: newConfig.autoValidate
      });
      config2.value = { ...config2.value, ...newConfig };
      if (newConfig.pageSize) {
        pageSize.value = newConfig.pageSize;
      }
      console.log("[dataGridStore] setConfig complete:", {
        autoValidate: config2.value.autoValidate,
        enableValidation: config2.value.enableValidation
      });
    }
    function initializeEmptyRows(count) {
      var _a, _b;
      const rowCount = count || pageSize.value;
      console.log("[dataGridStore] initializeEmptyRows:", {
        requestedCount: count,
        rowCount,
        currentRowsLength: rows.value.length,
        columnsLength: columns.value.length
      });
      const newMap = /* @__PURE__ */ new Map();
      const newOrder = [];
      for (let i = 0; i < rowCount; i++) {
        const rowId = generateULID();
        const row = {
          rowId,
          rowIndex: i,
          height: 32,
          cells: columns.value.filter((col) => !col.specialType).map((col) => ({
            rowId,
            columnName: col.name,
            value: null,
            isSelected: false,
            isValidationError: false
          }))
        };
        newMap.set(rowId, row);
        newOrder.push(rowId);
      }
      rowsMap.value = newMap;
      rowsOrder.value = newOrder;
      console.log("[dataGridStore] initializeEmptyRows complete:", {
        newRowsLength: rows.value.length,
        firstRowCellsCount: (_b = (_a = rows.value[0]) == null ? void 0 : _a.cells) == null ? void 0 : _b.length
      });
    }
    function setFilter(filter) {
      console.log("[dataGridStore] setFilter:", { filter });
      filterExpression.value = filter;
    }
    function clearFilter() {
      console.log("[dataGridStore] clearFilter");
      filterExpression.value = null;
    }
    function setSearchQuery(query) {
      searchQuery.value = query;
    }
    function clearSearch() {
      searchQuery.value = "";
    }
    function selectCell(rowId, columnName, isCtrlPressed) {
      const cellKey = `${rowId}:${columnName}`;
      console.log("[dataGridStore] selectCell:", {
        rowId,
        columnName,
        isCtrlPressed,
        wasSelected: selectedCells.value.has(cellKey),
        currentSelectionCount: selectedCells.value.size
      });
      if (isCtrlPressed) {
        wasCtrlPressed.value = true;
        pressedCell.value = null;
        isDragging.value = false;
        if (selectedCells.value.has(cellKey)) {
          selectedCells.value.delete(cellKey);
          console.log("[dataGridStore] selectCell: toggled OFF", { cellKey });
        } else {
          selectedCells.value.add(cellKey);
          console.log("[dataGridStore] selectCell: toggled ON", { cellKey });
        }
      } else {
        wasCtrlPressed.value = false;
        pressedCell.value = { rowId, columnName };
        isDragging.value = false;
        selectedCells.value.clear();
        selectedCells.value.add(cellKey);
        console.log("[dataGridStore] selectCell: single select", { cellKey });
      }
      console.log("[dataGridStore] selectCell complete:", {
        newSelectionCount: selectedCells.value.size
      });
    }
    function startDragSelection(rowId, columnName) {
      if (!pressedCell.value) return;
      isDragging.value = true;
      selectedCells.value.clear();
      expandDragSelection(rowId, columnName);
    }
    function expandDragSelection(currentRowId, currentColumnName) {
      if (!pressedCell.value || !isDragging.value) return;
      console.log("[dataGridStore] expandDragSelection:", {
        pressedCell: pressedCell.value,
        currentRowId,
        currentColumnName
      });
      const pressedRowIndex = rows.value.findIndex((r) => r.rowId === pressedCell.value.rowId);
      const currentRowIndex = rows.value.findIndex((r) => r.rowId === currentRowId);
      if (pressedRowIndex === -1 || currentRowIndex === -1) return;
      const selectableColumns = columns.value.filter(
        (col) => !col.specialType || col.specialType === "ValidationAlerts"
      ).map((col) => col.name);
      console.log("[dataGridStore] expandDragSelection: selectableColumns", {
        total: selectableColumns.length,
        columns: selectableColumns
      });
      const pressedColIndex = selectableColumns.indexOf(pressedCell.value.columnName);
      const currentColIndex = selectableColumns.indexOf(currentColumnName);
      if (pressedColIndex === -1 || currentColIndex === -1) {
        console.warn("[dataGridStore] expandDragSelection: column not found in selectableColumns", {
          pressedColumn: pressedCell.value.columnName,
          currentColumn: currentColumnName,
          pressedColIndex,
          currentColIndex
        });
        return;
      }
      const startRowIndex = Math.min(pressedRowIndex, currentRowIndex);
      const endRowIndex = Math.max(pressedRowIndex, currentRowIndex);
      const startColIndex = Math.min(pressedColIndex, currentColIndex);
      const endColIndex = Math.max(pressedColIndex, currentColIndex);
      console.log("[dataGridStore] expandDragSelection: bounds", {
        rowRange: [startRowIndex, endRowIndex],
        colRange: [startColIndex, endColIndex],
        cellsToSelect: (endRowIndex - startRowIndex + 1) * (endColIndex - startColIndex + 1)
      });
      selectedCells.value.clear();
      for (let rowIdx = startRowIndex; rowIdx <= endRowIndex; rowIdx++) {
        const rowId = rows.value[rowIdx].rowId;
        for (let colIdx = startColIndex; colIdx <= endColIndex; colIdx++) {
          const columnName = selectableColumns[colIdx];
          const cellKey = `${rowId}:${columnName}`;
          selectedCells.value.add(cellKey);
        }
      }
      console.log("[dataGridStore] expandDragSelection complete:", {
        selectedCellsCount: selectedCells.value.size
      });
    }
    function endDragSelection() {
      pressedCell.value = null;
      isDragging.value = false;
    }
    function isCellSelected(rowId, columnName) {
      const cellKey = `${rowId}:${columnName}`;
      return selectedCells.value.has(cellKey);
    }
    const SPECIAL_COLUMN_NAMES = [
      "__rowNumber",
      "__checkbox",
      "__validationAlerts",
      "__deleteRow",
      "__insertRow"
    ];
    function setColumns(inputColumns) {
      const conflicts = inputColumns.filter((col) => !col.specialType).filter((col) => SPECIAL_COLUMN_NAMES.includes(col.name)).map((col) => col.name);
      if (conflicts.length > 0) {
        throw new Error(
          `Column name conflict: The following column names are reserved for special columns and cannot be used: ${conflicts.join(", ")}. Reserved names: ${SPECIAL_COLUMN_NAMES.join(", ")}`
        );
      }
      const uniqueColumns = ensureUniqueColumnNames(inputColumns);
      columns.value = uniqueColumns;
      console.log("[dataGridStore] setColumns:", {
        originalCount: inputColumns.length,
        uniqueCount: uniqueColumns.length,
        columnNames: uniqueColumns.map((c) => c.name)
      });
    }
    function ensureUniqueColumnNames(inputColumns) {
      const nameCounts = /* @__PURE__ */ new Map();
      return inputColumns.map((col) => {
        const originalName = col.name;
        const count = nameCounts.get(originalName) || 0;
        nameCounts.set(originalName, count + 1);
        if (count > 0) {
          return {
            ...col,
            name: `${originalName}_${count + 1}`
          };
        }
        return col;
      }).map((col, index2, arr) => {
        const originalName = col.name.replace(/_\d+$/, "");
        const duplicateCount = arr.filter(
          (c) => c.name === originalName || c.name.startsWith(`${originalName}_`)
        ).length;
        if (duplicateCount > 1 && col.name === originalName) {
          return { ...col, name: `${originalName}_1` };
        }
        return col;
      });
    }
    function areNonEmptyRowsValid() {
      for (const row of rows.value) {
        const isEmpty = row.cells.every(
          (cell) => cell.value === null || cell.value === void 0 || cell.value === ""
        );
        if (isEmpty) {
          continue;
        }
        const hasError = row.cells.some((cell) => cell.isValidationError);
        if (hasError) {
          return false;
        }
      }
      return true;
    }
    function markCellValidated(rowId, columnName) {
      const cellKey = `${rowId}:${columnName}`;
      console.log("[dataGridStore] markCellValidated:", {
        rowId,
        columnName,
        cellKey,
        validatedCount: validatedCells.value.size
      });
      validatedCells.value.add(cellKey);
      changedCellsSinceValidation.value.delete(cellKey);
    }
    function clearValidationTracking() {
      console.log("[dataGridStore] clearValidationTracking:", {
        clearedValidatedCount: validatedCells.value.size,
        clearedChangedCount: changedCellsSinceValidation.value.size
      });
      validatedCells.value.clear();
      changedCellsSinceValidation.value.clear();
    }
    function getCellsNeedingValidation(forceValidateAll = false, columnsWithRules) {
      console.log("[getCellsNeedingValidation] 🔍 START", {
        totalRows: rows.value.length,
        validatedCellsCount: validatedCells.value.size,
        changedCellsCount: changedCellsSinceValidation.value.size,
        forceValidateAll,
        hasColumnsWithRules: !!columnsWithRules
      });
      const visibleColumns = new Set(
        columns.value.filter((col) => col.visibleForGrid !== false).map((col) => col.name)
      );
      const columnsToValidate = columnsWithRules && columnsWithRules.size > 0 ? new Set([...visibleColumns].filter((col) => columnsWithRules.has(col))) : visibleColumns;
      console.log("[getCellsNeedingValidation] 🔍 Column filtering:", {
        totalColumns: columns.value.length,
        visibleColumns: visibleColumns.size,
        columnsWithRules: (columnsWithRules == null ? void 0 : columnsWithRules.size) ?? "N/A",
        columnsToValidate: columnsToValidate.size,
        skippedColumns: visibleColumns.size - columnsToValidate.size,
        filterRate: columnsWithRules ? `${Math.round((1 - columnsToValidate.size / visibleColumns.size) * 100)}% skipped` : "N/A (no filter)"
      });
      const cellsToValidate = [];
      let emptyRowsSkipped = 0;
      let alreadyValidatedCells = 0;
      let changedCells = 0;
      let neverValidatedCells = 0;
      let skippedInvisibleCells = 0;
      let skippedNoRulesCells = 0;
      for (const row of rows.value) {
        const visibleCells = row.cells.filter((cell) => columnsToValidate.has(cell.columnName));
        const isEmpty = visibleCells.every(
          (cell) => cell.value === null || cell.value === void 0 || cell.value === ""
        );
        if (isEmpty) {
          emptyRowsSkipped++;
          continue;
        }
        for (const cell of row.cells) {
          const isVisible = visibleColumns.has(cell.columnName);
          const hasRules = columnsWithRules ? columnsWithRules.has(cell.columnName) : true;
          if (!isVisible) {
            skippedInvisibleCells++;
            continue;
          }
          if (columnsWithRules && !hasRules) {
            skippedNoRulesCells++;
            continue;
          }
          const cellKey = `${cell.rowId}:${cell.columnName}`;
          const isValidated = validatedCells.value.has(cellKey);
          const isChanged = changedCellsSinceValidation.value.has(cellKey);
          if (forceValidateAll || !isValidated || isChanged) {
            cellsToValidate.push({
              rowId: cell.rowId,
              columnName: cell.columnName
            });
            if (!isValidated) {
              neverValidatedCells++;
            } else if (isChanged) {
              changedCells++;
            }
          } else {
            alreadyValidatedCells++;
          }
        }
      }
      console.log("[getCellsNeedingValidation] 📊 RESULT:", {
        cellsToValidate: cellsToValidate.length,
        neverValidated: neverValidatedCells,
        changedSinceValidation: changedCells,
        alreadyValidated: alreadyValidatedCells,
        emptyRowsSkipped,
        skippedInvisibleCells,
        skippedNoRulesCells,
        // ✅ RIEŠENIE #3: CRITICAL METRIC!
        sampleCells: cellsToValidate.slice(0, 3).map((c) => `${c.rowId}:${c.columnName}`)
      });
      return cellsToValidate;
    }
    function setMinRows(newMinRows) {
      if (newMinRows < 0) {
        console.warn("[dataGridStore] setMinRows: Invalid value, must be >= 0:", newMinRows);
        return;
      }
      minRows.value = newMinRows;
      ensureMinimumRows();
      console.log(`[dataGridStore] setMinRows: ${newMinRows}`);
    }
    function clearAllData() {
      console.log("[dataGridStore] clearAllData called - clearing all state");
      rowsMap.value.clear();
      rowsOrder.value = [];
      selectedCells.value.clear();
      checkedRows.value = [];
      pressedCell.value = null;
      isDragging.value = false;
      wasCtrlPressed.value = false;
      validatedCells.value.clear();
      changedCellsSinceValidation.value.clear();
      sortColumnsMap.value.clear();
      sortColumnsOrder.value = [];
      filterExpression.value = null;
      searchQuery.value = "";
      currentPage.value = 1;
      console.log("[dataGridStore] All data cleared successfully");
    }
    return {
      // State
      rows,
      columns,
      selectedCells,
      checkedRows,
      pageSize,
      currentPage,
      sortColumns,
      filterExpression,
      searchQuery,
      searchResults,
      config: config2,
      pressedCell,
      isDragging,
      wasCtrlPressed,
      isAutoRowHeightEnabled,
      minRows,
      // Computed
      visibleRows,
      totalRows,
      totalPages,
      checkboxState,
      // Actions
      getRow,
      // ✅ RIEŠENIE #3: O(1) row lookup
      loadRows,
      updateCell,
      updateRowHeight,
      setAutoRowHeightEnabled,
      addSort,
      clearSort,
      setSortColumns,
      setPageSize,
      goToPage,
      deleteRow,
      insertRow,
      insertMultipleRows,
      toggleCheckbox,
      isRowChecked,
      toggleAllCheckboxes,
      setConfig,
      initializeEmptyRows,
      setFilter,
      clearFilter,
      setSearchQuery,
      clearSearch,
      selectCell,
      startDragSelection,
      expandDragSelection,
      endDragSelection,
      isCellSelected,
      setColumns,
      ensureUniqueColumnNames,
      areNonEmptyRowsValid,
      markCellValidated,
      clearValidationTracking,
      getCellsNeedingValidation,
      setMinRows,
      clearAllData
      // ✅ RIEŠENIE #3: Export cleanup method
    };
  });
  storeCache.set(storeId, storeDefinition);
  console.log("[useDataGridStore] Store definition cached for:", storeId);
  return storeDefinition;
};
function useValidation() {
  const validationRules = ref(/* @__PURE__ */ new Map());
  const validationErrors = reactive({});
  const errorCount = ref(0);
  const ruleCount = ref(0);
  function updateErrorCount() {
    errorCount.value = Object.keys(validationErrors).length;
  }
  function addValidationRule(rule) {
    const rules = validationRules.value.get(rule.columnName) || [];
    rules.push(rule);
    validationRules.value.set(rule.columnName, rules);
    console.log("[useValidation] addValidationRule:", {
      columnName: rule.columnName,
      ruleType: rule.ruleType,
      severity: rule.severity,
      totalRulesForColumn: rules.length
    });
    ruleCount.value++;
  }
  function validateCell(rowId, columnName, value) {
    const rules = validationRules.value.get(columnName) || [];
    console.log("[useValidation] validateCell:", {
      rowId,
      columnName,
      value,
      ruleCount: rules.length,
      isEmpty: value == null || value === ""
    });
    const isEmpty = value == null || value === "";
    for (const rule of rules) {
      if (rule.ruleType === "Required") {
        if (isEmpty) {
          console.log("[useValidation] validateCell FAILED: Required", {
            rowId,
            columnName,
            error: rule.errorMessage,
            severity: rule.severity
          });
          return {
            isValid: false,
            error: rule.errorMessage,
            severity: rule.severity
          };
        }
      }
      if (isEmpty) continue;
      if (rule.ruleType === "Regex" && rule.regexPattern) {
        const regex2 = new RegExp(rule.regexPattern);
        if (!regex2.test(String(value))) {
          console.log("[useValidation] validateCell FAILED: Regex", {
            rowId,
            columnName,
            value,
            pattern: rule.regexPattern,
            error: rule.errorMessage
          });
          return {
            isValid: false,
            error: rule.errorMessage,
            severity: rule.severity
          };
        }
      }
      if (rule.ruleType === "Range") {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          console.log("[useValidation] validateCell FAILED: Range (not a number)", {
            rowId,
            columnName,
            value
          });
          return {
            isValid: false,
            error: "Value must be a number",
            severity: rule.severity
          };
        }
        if (rule.minValue != null && numValue < rule.minValue) {
          console.log("[useValidation] validateCell FAILED: Range (below min)", {
            rowId,
            columnName,
            value: numValue,
            minValue: rule.minValue
          });
          return {
            isValid: false,
            error: rule.errorMessage,
            severity: rule.severity
          };
        }
        if (rule.maxValue != null && numValue > rule.maxValue) {
          console.log("[useValidation] validateCell FAILED: Range (above max)", {
            rowId,
            columnName,
            value: numValue,
            maxValue: rule.maxValue
          });
          return {
            isValid: false,
            error: rule.errorMessage,
            severity: rule.severity
          };
        }
      }
      if (rule.ruleType === "Custom" && rule.customValidator) {
        if (!rule.customValidator(value)) {
          console.log("[useValidation] validateCell FAILED: Custom", {
            rowId,
            columnName,
            value,
            error: rule.errorMessage
          });
          return {
            isValid: false,
            error: rule.errorMessage,
            severity: rule.severity
          };
        }
      }
    }
    console.log("[useValidation] validateCell PASSED", {
      rowId,
      columnName,
      value
    });
    return { isValid: true };
  }
  function isRowCompletelyEmpty(rowCells) {
    return rowCells.every((cell) => cell.value == null || cell.value === "");
  }
  function validateCellDirect(rowId, columnName, value, rowCells, skipErrorCountUpdate = false) {
    console.log("[useValidation] validateCellDirect:", {
      rowId,
      columnName,
      value,
      hasRowCells: !!rowCells,
      rowCellsCount: rowCells == null ? void 0 : rowCells.length,
      skipErrorCountUpdate
    });
    if (rowCells && isRowCompletelyEmpty(rowCells)) {
      console.log("[useValidation] validateCellDirect: Row is completely empty, clearing errors", {
        rowId
      });
      delete validationErrors[rowId];
      if (!skipErrorCountUpdate) {
        updateErrorCount();
      }
      return Promise.resolve();
    }
    const result = validateCell(rowId, columnName, value);
    const rowErrors = validationErrors[rowId] || [];
    if (!result.isValid) {
      const existingErrorIdx = rowErrors.findIndex((e) => e.columnName === columnName);
      const error = {
        rowId,
        columnName,
        message: result.error,
        severity: result.severity
      };
      if (existingErrorIdx >= 0) {
        rowErrors[existingErrorIdx] = error;
        console.log("[useValidation] validateCellDirect: Updated existing error", {
          rowId,
          columnName,
          error: error.message
        });
      } else {
        rowErrors.push(error);
        console.log("[useValidation] validateCellDirect: Added new error", {
          rowId,
          columnName,
          error: error.message
        });
      }
      validationErrors[rowId] = rowErrors;
    } else {
      const filteredErrors = rowErrors.filter((e) => e.columnName !== columnName);
      if (filteredErrors.length > 0) {
        validationErrors[rowId] = filteredErrors;
        console.log("[useValidation] validateCellDirect: Cleared error for column, other errors remain", {
          rowId,
          columnName,
          remainingErrors: filteredErrors.length
        });
      } else {
        delete validationErrors[rowId];
        console.log("[useValidation] validateCellDirect: Cleared all errors for row", {
          rowId
        });
      }
    }
    if (!skipErrorCountUpdate) {
      updateErrorCount();
    }
    return Promise.resolve();
  }
  const validateCellThrottled = useDebounceFn(
    validateCellDirect,
    300
  );
  async function validateAll(rows) {
    var _a, _b;
    console.log("[useValidation] validateAll START:", {
      rowCount: rows.length
    });
    Object.keys(validationErrors).forEach((key) => delete validationErrors[key]);
    let totalErrors = 0;
    let rowIndex = 0;
    const BATCH_SIZE2 = 50;
    const totalBatches = Math.ceil(rows.length / BATCH_SIZE2);
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batchStart = batchIndex * BATCH_SIZE2;
      const batchEnd = Math.min(batchStart + BATCH_SIZE2, rows.length);
      const batch = rows.slice(batchStart, batchEnd);
      console.log(`[useValidation] Processing batch ${batchIndex + 1}/${totalBatches} (rows ${batchStart}-${batchEnd - 1})`);
      for (const row of batch) {
        if (rowIndex < 3) {
          console.log("[useValidation] validateAll: Examining row", {
            rowId: row.rowId,
            rowIndex,
            cellCount: ((_a = row.cells) == null ? void 0 : _a.length) || 0
          });
        }
        rowIndex++;
        if (!row.cells || !Array.isArray(row.cells)) {
          console.log("[useValidation] validateAll: Skipping row without cells", {
            rowId: row.rowId,
            hasCells: !!row.cells,
            isArray: Array.isArray(row.cells)
          });
          continue;
        }
        if (isRowCompletelyEmpty(row.cells)) {
          console.log("[useValidation] validateAll: Skipping empty row", {
            rowId: row.rowId,
            cellCount: ((_b = row.cells) == null ? void 0 : _b.length) || 0
          });
          continue;
        }
        for (const cell of row.cells) {
          const result = validateCell(row.rowId, cell.columnName, cell.value);
          if (!result.isValid) {
            const rowErrors = validationErrors[row.rowId] || [];
            rowErrors.push({
              rowId: row.rowId,
              columnName: cell.columnName,
              message: result.error,
              severity: result.severity
            });
            validationErrors[row.rowId] = rowErrors;
            totalErrors++;
          }
        }
      }
      await nextTick();
    }
    console.log("[useValidation] validateAll - loop FINISHED, processed", rowIndex, "rows");
    console.log("[useValidation] validateAll - totalErrors:", totalErrors);
    const rowsWithErrorsCount = Object.keys(validationErrors).length;
    console.log("[useValidation] validateAll - rowsWithErrors:", rowsWithErrorsCount);
    console.log("[useValidation] validateAll complete - SUCCESS");
    console.log("[useValidation] validateAll - calling updateErrorCount...");
    updateErrorCount();
    console.log("[useValidation] validateAll - updateErrorCount DONE");
    console.log("[useValidation] validateAll - building errors array...");
    const allErrors = [];
    for (const rowId in validationErrors) {
      const rowErrors = validationErrors[rowId];
      if (rowErrors && Array.isArray(rowErrors)) {
        allErrors.push(...rowErrors);
      }
    }
    console.log("[useValidation] validateAll - errors array built, count:", allErrors.length);
    console.log("[useValidation] validateAll - returning result...");
    return {
      isValid: totalErrors === 0,
      totalErrors,
      errors: allErrors
    };
  }
  function getValidationErrors(rowId) {
    return validationErrors[rowId] || [];
  }
  function clearValidationErrors() {
    const clearedCount = Object.keys(validationErrors).length;
    console.log("[useValidation] clearValidationErrors:", {
      clearedCount
    });
    Object.keys(validationErrors).forEach((key) => delete validationErrors[key]);
    updateErrorCount();
  }
  return {
    validationRules,
    validationErrors,
    errorCount,
    ruleCount,
    addValidationRule,
    validateCell,
    validateCellDirect,
    // ✅ Direct validation for bulk operations (no debounce)
    validateCellThrottled,
    // Throttled validation for user input (300ms debounce)
    validateAll,
    getValidationErrors,
    clearValidationErrors,
    updateErrorCount
    // ✅ RIEŠENIE #2: Export for manual call after batch validation
  };
}
function useCopyPaste() {
  const clipboardData = ref("");
  function escapeTsvValue(value) {
    if (!value) return value;
    const needsQuoting = value.includes("	") || value.includes("\n") || value.includes("\r") || value.includes('"');
    if (!needsQuoting) {
      return value;
    }
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  function formatAsTabSeparated(rows, columnNames, options = {}) {
    const lines = [];
    if (options.includeHeaders) {
      lines.push(columnNames.map(escapeTsvValue).join("	"));
    }
    for (const row of rows) {
      const values = columnNames.map((col) => {
        const cell = row.cells.find((c) => c.columnName === col);
        const value = cell == null ? void 0 : cell.value;
        return escapeTsvValue((value == null ? void 0 : value.toString()) ?? "");
      });
      lines.push(values.join("	"));
    }
    return lines.join("\n");
  }
  function parseTabSeparated(clipboardText) {
    const result = [];
    const currentRow = [];
    let currentCell = "";
    let inQuotes = false;
    let isFirstRow = true;
    let headers = [];
    for (let i = 0; i < clipboardText.length; i++) {
      const c = clipboardText[i];
      const next = i + 1 < clipboardText.length ? clipboardText[i + 1] : null;
      if (c === '"') {
        if (inQuotes && next === '"') {
          currentCell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === "	" && !inQuotes) {
        currentRow.push(currentCell);
        currentCell = "";
      } else if ((c === "\n" || c === "\r") && !inQuotes) {
        if (c === "\r" && next === "\n") {
          i++;
        }
        if (currentCell.length > 0 || currentRow.length > 0) {
          currentRow.push(currentCell);
          currentCell = "";
          if (isFirstRow) {
            if (isHeaderRow(currentRow)) {
              headers = [...currentRow];
            } else {
              headers = currentRow.map((_, idx) => `Column${idx + 1}`);
              const firstDataRow = {};
              for (let j = 0; j < Math.min(headers.length, currentRow.length); j++) {
                firstDataRow[headers[j]] = currentRow[j] || null;
              }
              result.push(firstDataRow);
            }
            isFirstRow = false;
          } else {
            const dataRow = {};
            for (let j = 0; j < Math.min(headers.length, currentRow.length); j++) {
              dataRow[headers[j]] = currentRow[j] || null;
            }
            result.push(dataRow);
          }
          currentRow.length = 0;
        }
      } else {
        currentCell += c;
      }
    }
    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell);
      if (isFirstRow && headers.length === 0) {
        if (isHeaderRow(currentRow)) {
          headers = [...currentRow];
        } else {
          headers = currentRow.map((_, idx) => `Column${idx + 1}`);
          const dataRow = {};
          for (let j = 0; j < Math.min(headers.length, currentRow.length); j++) {
            dataRow[headers[j]] = currentRow[j] || null;
          }
          result.push(dataRow);
        }
      } else if (headers.length > 0) {
        const dataRow = {};
        for (let j = 0; j < Math.min(headers.length, currentRow.length); j++) {
          dataRow[headers[j]] = currentRow[j] || null;
        }
        result.push(dataRow);
      }
    }
    return { headers, rows: result };
  }
  function isHeaderRow(values) {
    return values.some((v) => v && isNaN(Number(v)));
  }
  async function copySelectedCells(selectedCells, allRows, allColumns) {
    var _a;
    try {
      if (selectedCells.size === 0) {
        return {
          success: false,
          message: "No cells selected for copy"
        };
      }
      console.log("[useCopyPaste] copySelectedCells:", {
        selectedCount: selectedCells.size,
        selectedCells: Array.from(selectedCells)
      });
      const cellPositions = [];
      selectedCells.forEach((cellKey) => {
        const [rowId, columnName] = cellKey.split(":");
        const row = allRows.find((r) => r.rowId === rowId);
        if (!row) return;
        const columnIndex = allColumns.findIndex((c) => c.name === columnName);
        if (columnIndex === -1) return;
        const cell = row.cells.find((c) => c.columnName === columnName);
        cellPositions.push({
          rowId,
          rowIndex: row.rowIndex,
          columnName,
          columnIndex,
          value: cell == null ? void 0 : cell.value
        });
      });
      if (cellPositions.length === 0) {
        return {
          success: false,
          message: "No valid cells to copy"
        };
      }
      const minRowIndex = Math.min(...cellPositions.map((c) => c.rowIndex));
      const maxRowIndex = Math.max(...cellPositions.map((c) => c.rowIndex));
      const minColIndex = Math.min(...cellPositions.map((c) => c.columnIndex));
      const maxColIndex = Math.max(...cellPositions.map((c) => c.columnIndex));
      console.log("[useCopyPaste] copySelectedCells bounds:", {
        minRowIndex,
        maxRowIndex,
        minColIndex,
        maxColIndex,
        rows: maxRowIndex - minRowIndex + 1,
        cols: maxColIndex - minColIndex + 1
      });
      const lines = [];
      for (let rowIdx = minRowIndex; rowIdx <= maxRowIndex; rowIdx++) {
        const rowCells = [];
        for (let colIdx = minColIndex; colIdx <= maxColIndex; colIdx++) {
          const cellPos = cellPositions.find((c) => c.rowIndex === rowIdx && c.columnIndex === colIdx);
          if (cellPos) {
            const value = ((_a = cellPos.value) == null ? void 0 : _a.toString()) ?? "";
            rowCells.push(escapeTsvValue(value));
          } else {
            rowCells.push("");
          }
        }
        lines.push(rowCells.join("	"));
      }
      const tsvData = lines.join("\n");
      console.log("[useCopyPaste] copySelectedCells TSV:", {
        lineCount: lines.length,
        preview: tsvData.substring(0, 200)
      });
      await navigator.clipboard.writeText(tsvData);
      clipboardData.value = tsvData;
      return {
        success: true,
        message: `Copied ${cellPositions.length} cells to clipboard`,
        processedRows: cellPositions.length
      };
    } catch (error) {
      console.error("[useCopyPaste] Copy failed:", error);
      return {
        success: false,
        message: `Copy failed: ${error}`
      };
    }
  }
  async function copyToClipboard(rows, columnNames, options = {}) {
    try {
      if (rows.length === 0) {
        return {
          success: false,
          message: "No data selected for copy"
        };
      }
      const tsvData = formatAsTabSeparated(rows, columnNames, options);
      await navigator.clipboard.writeText(tsvData);
      clipboardData.value = tsvData;
      return {
        success: true,
        message: `Copied ${rows.length} rows to clipboard`,
        processedRows: rows.length
      };
    } catch (error) {
      console.error("Copy failed:", error);
      return {
        success: false,
        message: `Copy failed: ${error}`
      };
    }
  }
  async function pasteFromClipboard() {
    try {
      let tsvData = "";
      try {
        tsvData = await navigator.clipboard.readText();
      } catch {
        tsvData = clipboardData.value;
      }
      if (!tsvData) {
        return {
          success: false,
          message: "No data available in clipboard"
        };
      }
      const { headers, rows } = parseTabSeparated(tsvData);
      return {
        success: true,
        message: `Pasted ${rows.length} rows from clipboard`,
        processedRows: rows.length,
        rows,
        headers
      };
    } catch (error) {
      console.error("Paste failed:", error);
      return {
        success: false,
        message: `Paste failed: ${error}`
      };
    }
  }
  function canPaste() {
    return !!clipboardData.value;
  }
  function clearClipboard() {
    clipboardData.value = "";
  }
  return {
    copyToClipboard,
    copySelectedCells,
    pasteFromClipboard,
    canPaste,
    clearClipboard
  };
}
const defaultAutoRowHeightConfig = {
  minHeight: 32,
  // 32px default row height (matches default in store)
  maxHeight: 400,
  // Default fallback (will be overridden by 70% of container height)
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: 14,
  // MUST match CSS font-size in .grid-cell
  enableWrapping: true,
  padding: 16
  // 8px left + 8px right (horizontal padding for width calculation)
};
function useAutoRowHeight(config2 = defaultAutoRowHeightConfig) {
  let canvas = null;
  let context = null;
  function getContext() {
    if (!canvas) {
      canvas = document.createElement("canvas");
      context = canvas.getContext("2d");
    }
    if (!context) {
      throw new Error("Failed to get canvas context");
    }
    context.font = `${config2.fontSize}px ${config2.fontFamily}`;
    return context;
  }
  function measureTextHeight(text, width) {
    if (!text) return config2.minHeight;
    const ctx = getContext();
    if (!config2.enableWrapping) {
      return config2.minHeight;
    }
    const explicitLines = text.toString().split("\n");
    let lineHeight = config2.fontSize * 1.5;
    let totalLines = 0;
    for (const line of explicitLines) {
      if (!line || line.trim() === "") {
        totalLines++;
        continue;
      }
      const words = line.split(" ");
      let currentLine = "";
      let linesInThisSegment = 1;
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > width - config2.padding) {
          if (currentLine) {
            linesInThisSegment++;
            currentLine = word;
          } else {
            currentLine = word;
          }
        } else {
          currentLine = testLine;
        }
      }
      totalLines += linesInThisSegment;
    }
    const verticalPadding = 10;
    const totalHeight = totalLines * lineHeight + verticalPadding;
    return Math.max(config2.minHeight, Math.min(config2.maxHeight, Math.ceil(totalHeight)));
  }
  function calculateRowHeight(row, columns) {
    try {
      let maxHeight = config2.minHeight;
      for (const column of columns) {
        if (column.specialType && column.specialType !== "ValidationAlerts") {
          continue;
        }
        let cellValue = null;
        if (row.cells && Array.isArray(row.cells)) {
          const cell = row.cells.find((c) => c.columnName === column.name);
          cellValue = cell == null ? void 0 : cell.value;
        } else {
          cellValue = row[column.name];
        }
        if (cellValue == null) continue;
        const textValue = String(cellValue);
        const cellHeight = measureTextHeight(textValue, column.width);
        maxHeight = Math.max(maxHeight, cellHeight);
      }
      return {
        rowId: row.__rowId || row.rowId,
        calculatedHeight: maxHeight,
        isSuccess: true
      };
    } catch (error) {
      console.error("Row height calculation failed:", error);
      return {
        rowId: row.__rowId || row.rowId,
        calculatedHeight: config2.minHeight,
        isSuccess: false
      };
    }
  }
  function calculateRowHeights(rows, columns) {
    return rows.map((row) => calculateRowHeight(row, columns));
  }
  async function applyAutoRowHeight(rows, columns) {
    let totalHeight = 0;
    let updatedCount = 0;
    const BATCH_SIZE2 = 50;
    const totalBatches = Math.ceil(rows.length / BATCH_SIZE2);
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batchStart = batchIndex * BATCH_SIZE2;
      const batchEnd = Math.min(batchStart + BATCH_SIZE2, rows.length);
      const batch = rows.slice(batchStart, batchEnd);
      console.log(`[AutoRowHeight] Processing batch ${batchIndex + 1}/${totalBatches} (rows ${batchStart}-${batchEnd - 1})`);
      for (const row of batch) {
        const result = calculateRowHeight(row, columns);
        if (result.isSuccess) {
          row.height = result.calculatedHeight;
          totalHeight += result.calculatedHeight;
          updatedCount++;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return {
      totalRowsUpdated: updatedCount,
      averageHeight: updatedCount > 0 ? totalHeight / updatedCount : config2.minHeight
    };
  }
  function recalculateRows(rows, rowIds, columns) {
    let updatedCount = 0;
    for (const row of rows) {
      if (rowIds.includes(row.rowId)) {
        const result = calculateRowHeight(row, columns);
        if (result.isSuccess) {
          row.height = result.calculatedHeight;
          updatedCount++;
        }
      }
    }
    return updatedCount;
  }
  function updateMaxHeight(newMaxHeight) {
    config2.maxHeight = newMaxHeight;
    console.log(`[useAutoRowHeight] maxHeight updated to: ${newMaxHeight}px`);
  }
  return {
    calculateRowHeight,
    calculateRowHeights,
    applyAutoRowHeight,
    recalculateRows,
    measureTextHeight,
    updateMaxHeight
    // NEW: Allow dynamic maxHeight updates
  };
}
var ShortcutContext = /* @__PURE__ */ ((ShortcutContext2) => {
  ShortcutContext2["Normal"] = "normal";
  ShortcutContext2["Editing"] = "editing";
  ShortcutContext2["Selection"] = "selection";
  ShortcutContext2["Any"] = "any";
  return ShortcutContext2;
})(ShortcutContext || {});
function useShortcuts(options = {}) {
  const shortcuts = /* @__PURE__ */ new Map();
  const currentContext = options.context || "normal";
  function keyCombinationToString(key) {
    const parts = [];
    if (key.ctrl) parts.push("Ctrl");
    if (key.shift) parts.push("Shift");
    if (key.alt) parts.push("Alt");
    if (key.meta) parts.push("Meta");
    parts.push(key.key.toUpperCase());
    return parts.join("+");
  }
  function matchesKeyCombination(event, key) {
    return event.key.toUpperCase() === key.key.toUpperCase() && !!event.ctrlKey === !!key.ctrl && !!event.shiftKey === !!key.shift && !!event.altKey === !!key.alt && !!event.metaKey === !!key.meta;
  }
  function isContextMatch(shortcutContext, current) {
    return shortcutContext === "any" || shortcutContext === current || current === "any";
  }
  async function handleKeyDown(event) {
    if (!options.enabled && options.enabled !== void 0) {
      return;
    }
    const matchingShortcuts = Array.from(shortcuts.values()).filter((shortcut2) => {
      return shortcut2.enabled !== false && matchesKeyCombination(event, shortcut2.key) && isContextMatch(shortcut2.context || "normal", currentContext);
    });
    if (matchingShortcuts.length === 0) {
      return;
    }
    matchingShortcuts.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const shortcut = matchingShortcuts[0];
    event.preventDefault();
    event.stopPropagation();
    try {
      await shortcut.handler(event);
    } catch (error) {
      console.error(`Shortcut execution failed for ${shortcut.name}:`, error);
    }
  }
  function registerShortcut(definition) {
    const keyString = keyCombinationToString(definition.key);
    if (shortcuts.has(keyString)) {
      console.warn(`Shortcut ${keyString} is already registered. Overwriting.`);
    }
    shortcuts.set(keyString, {
      ...definition,
      enabled: definition.enabled !== false,
      context: definition.context || "normal",
      priority: definition.priority || 0
    });
  }
  function registerShortcuts(definitions) {
    definitions.forEach(registerShortcut);
  }
  function unregisterShortcut(key) {
    const keyString = keyCombinationToString(key);
    return shortcuts.delete(keyString);
  }
  function unregisterShortcutByName(name) {
    const entry = Array.from(shortcuts.entries()).find(([_, def]) => def.name === name);
    if (entry) {
      shortcuts.delete(entry[0]);
      return true;
    }
    return false;
  }
  function setShortcutEnabled(name, enabled) {
    const entry = Array.from(shortcuts.entries()).find(([_, def]) => def.name === name);
    if (entry) {
      entry[1].enabled = enabled;
    }
  }
  function getShortcuts() {
    return Array.from(shortcuts.values());
  }
  function getShortcutsByContext(context) {
    return Array.from(shortcuts.values()).filter(
      (s) => s.context === context || s.context === "any"
      /* Any */
    );
  }
  function clearShortcuts() {
    shortcuts.clear();
  }
  onMounted(() => {
    if (options.enabled !== false) {
      document.addEventListener("keydown", handleKeyDown);
    }
  });
  onUnmounted(() => {
    document.removeEventListener("keydown", handleKeyDown);
  });
  return {
    registerShortcut,
    registerShortcuts,
    unregisterShortcut,
    unregisterShortcutByName,
    setShortcutEnabled,
    getShortcuts,
    getShortcutsByContext,
    clearShortcuts,
    handleKeyDown
  };
}
const Keys = {
  ctrl: (key) => ({ key, ctrl: true }),
  shift: (key) => ({ key, shift: true }),
  alt: (key) => ({ key, alt: true }),
  ctrlShift: (key) => ({ key, ctrl: true, shift: true }),
  ctrlAlt: (key) => ({ key, ctrl: true, alt: true }),
  single: (key) => ({ key })
};
function createDefaultShortcuts(handlers) {
  const shortcuts = [];
  if (handlers.onCopy) {
    shortcuts.push({
      name: "Copy",
      key: Keys.ctrl("c"),
      handler: handlers.onCopy,
      description: "Copy selected cells",
      priority: 100
    });
  }
  if (handlers.onPaste) {
    shortcuts.push({
      name: "Paste",
      key: Keys.ctrl("v"),
      handler: handlers.onPaste,
      description: "Paste from clipboard",
      priority: 100
    });
  }
  if (handlers.onCut) {
    shortcuts.push({
      name: "Cut",
      key: Keys.ctrl("x"),
      handler: handlers.onCut,
      description: "Cut selected cells",
      priority: 100
    });
  }
  if (handlers.onDelete) {
    shortcuts.push({
      name: "Delete",
      key: Keys.single("Delete"),
      handler: handlers.onDelete,
      description: "Delete selected cells",
      priority: 100
    });
  }
  if (handlers.onSelectAll) {
    shortcuts.push({
      name: "SelectAll",
      key: Keys.ctrl("a"),
      handler: handlers.onSelectAll,
      description: "Select all cells",
      priority: 100
    });
  }
  if (handlers.onFind) {
    shortcuts.push({
      name: "Find",
      key: Keys.ctrl("f"),
      handler: handlers.onFind,
      description: "Open find dialog",
      priority: 100
    });
  }
  if (handlers.onUndo) {
    shortcuts.push({
      name: "Undo",
      key: Keys.ctrl("z"),
      handler: handlers.onUndo,
      description: "Undo last action",
      priority: 100
    });
  }
  if (handlers.onRedo) {
    shortcuts.push({
      name: "Redo",
      key: Keys.ctrlShift("z"),
      handler: handlers.onRedo,
      description: "Redo last undone action",
      priority: 100
    });
  }
  if (handlers.onEscape) {
    shortcuts.push({
      name: "Escape",
      key: Keys.single("Escape"),
      handler: handlers.onEscape,
      description: "Cancel current operation",
      priority: 100
    });
  }
  if (handlers.onEnter) {
    shortcuts.push({
      name: "Enter",
      key: Keys.single("Enter"),
      handler: handlers.onEnter,
      description: "Confirm edit and move to next row",
      context: "editing",
      priority: 100
    });
  }
  if (handlers.onTab) {
    shortcuts.push({
      name: "Tab",
      key: Keys.single("Tab"),
      handler: handlers.onTab,
      description: "Move to next cell",
      priority: 100
    });
  }
  if (handlers.onArrowUp) {
    shortcuts.push({
      name: "ArrowUp",
      key: Keys.single("ArrowUp"),
      handler: handlers.onArrowUp,
      description: "Move selection up",
      priority: 50
    });
  }
  if (handlers.onArrowDown) {
    shortcuts.push({
      name: "ArrowDown",
      key: Keys.single("ArrowDown"),
      handler: handlers.onArrowDown,
      description: "Move selection down",
      priority: 50
    });
  }
  if (handlers.onArrowLeft) {
    shortcuts.push({
      name: "ArrowLeft",
      key: Keys.single("ArrowLeft"),
      handler: handlers.onArrowLeft,
      description: "Move selection left",
      priority: 50
    });
  }
  if (handlers.onArrowRight) {
    shortcuts.push({
      name: "ArrowRight",
      key: Keys.single("ArrowRight"),
      handler: handlers.onArrowRight,
      description: "Move selection right",
      priority: 50
    });
  }
  return shortcuts;
}
const logQueue = ref([]);
const isProcessing = ref(false);
const BATCH_SIZE = 50;
const PROCESSING_INTERVAL = 100;
let processingTimer = null;
function getTimestamp() {
  const now2 = /* @__PURE__ */ new Date();
  return now2.toISOString();
}
function enqueueLog(level, category, message, data) {
  const entry = {
    timestamp: getTimestamp(),
    level,
    category,
    message,
    data: data !== void 0 ? JSON.parse(JSON.stringify(data)) : void 0
  };
  logQueue.value.push(entry);
  if (!isProcessing.value) {
    startProcessing();
  }
}
function startProcessing() {
  if (processingTimer !== null) return;
  isProcessing.value = true;
  processingTimer = window.setInterval(() => {
    processLogBatch();
  }, PROCESSING_INTERVAL);
}
function stopProcessing() {
  if (processingTimer !== null) {
    window.clearInterval(processingTimer);
    processingTimer = null;
  }
  isProcessing.value = false;
}
function processLogBatch() {
  if (logQueue.value.length === 0) {
    stopProcessing();
    return;
  }
  const batch = logQueue.value.splice(0, BATCH_SIZE);
  for (const entry of batch) {
    writeLogToConsole(entry);
  }
}
function writeLogToConsole(entry) {
  const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.category}]`;
  const message = `${prefix} ${entry.message}`;
  switch (entry.level) {
    case "DEBUG":
      if (entry.data !== void 0) {
        console.debug(message, entry.data);
      } else {
        console.debug(message);
      }
      break;
    case "INFO":
      if (entry.data !== void 0) {
        console.log(message, entry.data);
      } else {
        console.log(message);
      }
      break;
    case "WARN":
      if (entry.data !== void 0) {
        console.warn(message, entry.data);
      } else {
        console.warn(message);
      }
      break;
    case "ERROR":
    case "FATAL":
      if (entry.data !== void 0) {
        console.error(message, entry.data);
      } else {
        console.error(message);
      }
      break;
  }
}
function useLogger(category = "App") {
  return {
    debug(message, data) {
      enqueueLog("DEBUG", category, message, data);
    },
    info(message, data) {
      enqueueLog("INFO", category, message, data);
    },
    warn(message, data) {
      enqueueLog("WARN", category, message, data);
    },
    error(message, data) {
      enqueueLog("ERROR", category, message, data);
    },
    fatal(message, data) {
      enqueueLog("FATAL", category, message, data);
    },
    /**
     * Flushes all pending logs immediately (synchronously)
     */
    flush() {
      while (logQueue.value.length > 0) {
        const entry = logQueue.value.shift();
        writeLogToConsole(entry);
      }
      stopProcessing();
    },
    /**
     * Gets current queue size
     */
    getQueueSize() {
      return logQueue.value.length;
    }
  };
}
const BASE_URL = "http://localhost:5000/api/grid";
class GridApiService {
  constructor() {
    __publicField(this, "isHostMode", false);
    this.isHostMode = this.detectHostMode();
    console.log(`Grid API Mode: ${this.isHostMode ? "Host Objects" : "HTTP"}`);
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
  async callHostApi(method, ...args) {
    try {
      if (!window.gridApi) {
        throw new Error("Grid API not available");
      }
      const hostApi = window.gridApi;
      const resultJson = await hostApi[method](...args);
      const result = JSON.parse(resultJson);
      return result;
    } catch (error) {
      console.error("Grid API call failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  /**
   * HTTP request (development mode)
   */
  async request(endpoint, options) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options == null ? void 0 : options.headers
        },
        credentials: "include"
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  /**
   * Get grid data from backend
   */
  async getData() {
    if (this.isHostMode) {
      return this.callHostApi("GetData");
    } else {
      return this.request("/data");
    }
  }
  /**
   * Import data to backend (replaces existing data)
   */
  async importData(data) {
    if (this.isHostMode) {
      const jsonData = JSON.stringify({ data });
      return this.callHostApi("ImportData", jsonData);
    } else {
      return this.request("/import", {
        method: "POST",
        body: JSON.stringify({ data })
      });
    }
  }
  /**
   * Export data from backend
   */
  async exportData(options) {
    if (this.isHostMode) {
      const optionsJson = JSON.stringify({
        OnlyFiltered: (options == null ? void 0 : options.onlyFiltered) ?? false,
        FilteredRowIds: (options == null ? void 0 : options.filteredRowIds) ?? null,
        ColumnNames: (options == null ? void 0 : options.columnNames) ?? null
      });
      return this.callHostApi("ExportData", optionsJson);
    } else {
      const params = new URLSearchParams();
      if (options == null ? void 0 : options.onlyFiltered) params.append("onlyFiltered", "true");
      if (options == null ? void 0 : options.filteredRowIds) params.append("filteredRowIds", JSON.stringify(options.filteredRowIds));
      if (options == null ? void 0 : options.columnNames) params.append("columnNames", JSON.stringify(options.columnNames));
      const query = params.toString() ? `?${params.toString()}` : "";
      return this.request(`/export${query}`);
    }
  }
  /**
   * Get grid configuration
   */
  async getConfig() {
    if (this.isHostMode) {
      return this.callHostApi("GetConfig");
    } else {
      return this.request("/config");
    }
  }
  /**
   * Set validation rules
   */
  async setValidationRules(rules) {
    if (this.isHostMode) {
      const jsonRules = JSON.stringify({ rules });
      return this.callHostApi("SetValidationRules", jsonRules);
    } else {
      return this.request("/validation-rules", {
        method: "POST",
        body: JSON.stringify({ rules })
      });
    }
  }
  /**
   * Get validation rules
   */
  async getValidationRules() {
    if (this.isHostMode) {
      return this.callHostApi("GetValidationRules");
    } else {
      return this.request("/validation-rules");
    }
  }
  /**
   * Get all column names (data columns + checkbox special column)
   */
  async getColumnNames() {
    var _a;
    if (this.isHostMode) {
      const result = await this.callHostApi("GetColumnNames");
      return {
        success: result.success,
        data: (_a = result.data) == null ? void 0 : _a.columnNames,
        error: result.error
      };
    } else {
      return this.request("/columns");
    }
  }
  /**
   * Get column definitions
   */
  async getColumns() {
    if (this.isHostMode) {
      return this.callHostApi("GetColumns");
    } else {
      return this.request("/columns/definitions");
    }
  }
  /**
   * Health check
   */
  async healthCheck() {
    try {
      if (this.isHostMode) {
        const result = await this.callHostApi("HealthCheck");
        return result.success;
      } else {
        const response = await fetch("http://localhost:5000/health");
        return response.ok;
      }
    } catch {
      return false;
    }
  }
}
const gridApi = new GridApiService();
const defaultDataGridTheme = {
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
};
const defaultListBoxTheme = {
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
};
function generateDataGridCSSVariables(theme) {
  return {
    // Cell Colors
    "--dg-cell-bg": theme.cellColors.defaultBackground,
    "--dg-cell-fg": theme.cellColors.defaultForeground,
    "--dg-cell-hover-bg": theme.cellColors.hoverBackground,
    "--dg-cell-hover-fg": theme.cellColors.hoverForeground,
    "--dg-cell-focused-bg": theme.cellColors.focusedBackground,
    "--dg-cell-focused-fg": theme.cellColors.focusedForeground,
    "--dg-cell-disabled-bg": theme.cellColors.disabledBackground,
    "--dg-cell-disabled-fg": theme.cellColors.disabledForeground,
    "--dg-cell-readonly-bg": theme.cellColors.readOnlyBackground,
    "--dg-cell-readonly-fg": theme.cellColors.readOnlyForeground,
    // Row Colors
    "--dg-row-even-bg": theme.rowColors.evenRowBackground,
    "--dg-row-odd-bg": theme.rowColors.oddRowBackground,
    "--dg-row-hover-bg": theme.rowColors.hoverBackground,
    "--dg-row-selected-bg": theme.rowColors.selectedBackground,
    "--dg-row-selected-fg": theme.rowColors.selectedForeground,
    "--dg-row-selected-inactive-bg": theme.rowColors.selectedInactiveBackground,
    "--dg-row-selected-inactive-fg": theme.rowColors.selectedInactiveForeground,
    // Header Colors
    "--dg-header-bg": theme.headerColors.background,
    "--dg-header-fg": theme.headerColors.foreground,
    "--dg-header-hover-bg": theme.headerColors.hoverBackground,
    "--dg-header-pressed-bg": theme.headerColors.pressedBackground,
    "--dg-header-sort-indicator": theme.headerColors.sortIndicatorColor,
    // Validation Colors
    "--dg-validation-error-bg": theme.validationColors.errorBackground,
    "--dg-validation-error-fg": theme.validationColors.errorForeground,
    "--dg-validation-error-border": theme.validationColors.errorBorder,
    "--dg-validation-warning-bg": theme.validationColors.warningBackground,
    "--dg-validation-warning-fg": theme.validationColors.warningForeground,
    "--dg-validation-warning-border": theme.validationColors.warningBorder,
    "--dg-validation-info-bg": theme.validationColors.infoBackground,
    "--dg-validation-info-fg": theme.validationColors.infoForeground,
    "--dg-validation-info-border": theme.validationColors.infoBorder,
    // Selection Colors
    "--dg-selection-border": theme.selectionColors.selectionBorder,
    "--dg-selection-fill": theme.selectionColors.selectionFill,
    "--dg-multi-selection-bg": theme.selectionColors.multiSelectionBackground,
    "--dg-multi-selection-fg": theme.selectionColors.multiSelectionForeground,
    // Border Colors
    "--dg-border-cell": theme.borderColors.cellBorder,
    "--dg-border-row": theme.borderColors.rowBorder,
    "--dg-border-column": theme.borderColors.columnBorder,
    "--dg-border-grid": theme.borderColors.gridBorder,
    "--dg-border-focused-cell": theme.borderColors.focusedCellBorder,
    // Special Column Colors
    "--dg-special-rownumber-bg": theme.specialColumnColors.rowNumberBackground,
    "--dg-special-rownumber-fg": theme.specialColumnColors.rowNumberForeground,
    "--dg-special-checkbox-border": theme.specialColumnColors.checkboxBorder,
    "--dg-special-checkbox-bg": theme.specialColumnColors.checkboxBackground,
    "--dg-special-checkbox-fg": theme.specialColumnColors.checkboxForeground,
    "--dg-special-delete-bg": theme.specialColumnColors.deleteRowBackground,
    "--dg-special-delete-fg": theme.specialColumnColors.deleteRowForeground,
    "--dg-special-delete-hover-bg": theme.specialColumnColors.deleteRowHoverBackground,
    "--dg-special-insert-bg": theme.specialColumnColors.insertRowBackground,
    "--dg-special-insert-fg": theme.specialColumnColors.insertRowForeground,
    "--dg-special-insert-border": theme.specialColumnColors.insertRowBorder,
    "--dg-special-insert-hover-bg": theme.specialColumnColors.insertRowHoverBackground,
    "--dg-special-insert-hover-fg": theme.specialColumnColors.insertRowHoverForeground,
    "--dg-special-validation-error-bg": theme.specialColumnColors.validationAlertsErrorBackground,
    "--dg-special-validation-error-fg": theme.specialColumnColors.validationAlertsErrorForeground,
    // UI Control Colors
    "--dg-ui-resize-grip": theme.uiControlColors.resizeGripColor,
    "--dg-ui-menu-bg": theme.uiControlColors.menuBackground,
    "--dg-ui-menu-fg": theme.uiControlColors.menuForeground,
    "--dg-ui-menu-hover-bg": theme.uiControlColors.menuHoverBackground,
    "--dg-ui-dialog-bg": theme.uiControlColors.dialogBackground,
    "--dg-ui-dialog-fg": theme.uiControlColors.dialogForeground,
    "--dg-ui-dialog-border": theme.uiControlColors.dialogBorder,
    "--dg-ui-placeholder": theme.uiControlColors.placeholderColor,
    "--dg-ui-search-bg": theme.uiControlColors.searchPanelBackground,
    "--dg-ui-search-fg": theme.uiControlColors.searchPanelForeground,
    "--dg-ui-search-border": theme.uiControlColors.searchPanelBorder,
    "--dg-ui-filter-bg": theme.uiControlColors.filterRowBackground,
    "--dg-ui-filter-fg": theme.uiControlColors.filterRowForeground,
    "--dg-ui-filter-border": theme.uiControlColors.filterRowBorder,
    "--dg-ui-pagination-bg": theme.uiControlColors.paginationBackground,
    "--dg-ui-pagination-fg": theme.uiControlColors.paginationForeground,
    "--dg-ui-pagination-border": theme.uiControlColors.paginationBorder,
    "--dg-ui-pagination-button-hover-bg": theme.uiControlColors.paginationButtonHoverBackground
  };
}
function generateListBoxCSSVariables(theme) {
  return {
    // Item Colors
    "--lb-item-bg": theme.itemColors.defaultBackground,
    "--lb-item-fg": theme.itemColors.defaultForeground,
    "--lb-item-hover-bg": theme.itemColors.hoverBackground,
    "--lb-item-hover-fg": theme.itemColors.hoverForeground,
    "--lb-item-selected-bg": theme.itemColors.selectedBackground,
    "--lb-item-selected-fg": theme.itemColors.selectedForeground,
    "--lb-item-selected-hover-bg": theme.itemColors.selectedHoverBackground,
    "--lb-item-selected-hover-fg": theme.itemColors.selectedHoverForeground,
    "--lb-item-disabled-bg": theme.itemColors.disabledBackground,
    "--lb-item-disabled-fg": theme.itemColors.disabledForeground,
    // Container Colors
    "--lb-container-bg": theme.containerColors.background,
    "--lb-container-border": theme.containerColors.border,
    "--lb-container-focused-border": theme.containerColors.focusedBorder,
    "--lb-title-fg": theme.containerColors.titleForeground,
    // Checkbox Colors
    "--lb-checkbox-border": theme.checkboxColors.border,
    "--lb-checkbox-bg": theme.checkboxColors.background,
    "--lb-checkbox-checked-bg": theme.checkboxColors.checkedBackground,
    "--lb-checkbox-checked-border": theme.checkboxColors.checkedBorder,
    "--lb-checkbox-hover-border": theme.checkboxColors.hoverBorder,
    // Scrollbar Colors
    "--lb-scrollbar-track-bg": theme.scrollbarColors.trackBackground,
    "--lb-scrollbar-thumb-bg": theme.scrollbarColors.thumbBackground,
    "--lb-scrollbar-thumb-hover-bg": theme.scrollbarColors.thumbHoverBackground
  };
}
const _hoisted_1$8 = ["onClick", "onContextmenu"];
const _hoisted_2$7 = {
  key: 0,
  class: "checkbox-icon"
};
const _hoisted_3$7 = {
  key: 1,
  class: "checkbox-icon"
};
const _hoisted_4$7 = {
  key: 1,
  class: "header-text"
};
const _hoisted_5$7 = {
  key: 0,
  class: "sort-order"
};
const _hoisted_6$5 = ["onMousedown"];
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "DataGridHeader",
  props: {
    columns: {},
    gridTemplateColumns: {},
    gridId: {},
    isGridReady: { type: Boolean },
    isProcessing: { type: Boolean },
    showHiddenColumnsPanel: { type: Boolean }
  },
  emits: ["sort", "resize", "hideColumn", "autoFitColumn", "showFilter"],
  setup(__props, { emit: __emit }) {
    const props2 = __props;
    const emit = __emit;
    const store = useDataGridStore(props2.gridId)();
    const resizingColumn = ref(null);
    const resizeStartX = ref(0);
    const resizeStartWidth = ref(0);
    const sortInfoMap = computed(() => {
      const map = /* @__PURE__ */ new Map();
      store.sortColumns.forEach((sortCol, index2) => {
        map.set(sortCol.columnName, {
          direction: sortCol.direction,
          order: index2 + 1,
          isPrimary: index2 === 0
        });
      });
      return map;
    });
    function getSortInfo(columnName) {
      return sortInfoMap.value.get(columnName) ?? null;
    }
    function handleHeaderClick(event, column) {
      if (column.specialType === "Checkbox") {
        return;
      }
      if (column.isSortable && event.shiftKey) {
        handleSort(column, true);
        return;
      }
      showHeaderContextMenu(event, column);
    }
    function handleCheckboxHeaderClick() {
      store.toggleAllCheckboxes();
    }
    function handleSort(column, multiSort = false) {
      if (!column.isSortable) return;
      const currentSort = getSortInfo(column.name);
      if (currentSort) {
        const newDirection = currentSort.direction === "asc" ? "desc" : "asc";
        store.addSort(column.name, newDirection, multiSort);
      } else {
        store.addSort(column.name, "asc", multiSort);
      }
      const sortInfo = getSortInfo(column.name);
      if (sortInfo) {
        emit("sort", column.name, sortInfo.direction);
      }
    }
    function startResize(column, event) {
      resizingColumn.value = column;
      resizeStartX.value = event.clientX;
      resizeStartWidth.value = column.width;
      window.addEventListener("mousemove", onResizeMove);
      window.addEventListener("mouseup", onResizeEnd);
    }
    function onResizeMove(event) {
      if (!resizingColumn.value) return;
      const delta = event.clientX - resizeStartX.value;
      const newWidth = Math.max(
        resizingColumn.value.minWidth,
        Math.min(resizingColumn.value.maxWidth, resizeStartWidth.value + delta)
      );
      emit("resize", resizingColumn.value.name, newWidth);
    }
    function onResizeEnd() {
      resizingColumn.value = null;
      window.removeEventListener("mousemove", onResizeMove);
      window.removeEventListener("mouseup", onResizeEnd);
    }
    function showHeaderContextMenu(event, column) {
      if (props2.isGridReady === false) {
        console.error("[showHeaderContextMenu] Grid not ready yet");
        return;
      }
      if (!store) {
        console.error("[showHeaderContextMenu] Store not initialized yet");
        return;
      }
      if (props2.isProcessing) {
        console.error("[showHeaderContextMenu] Grid is currently processing data");
        return;
      }
      const sortColumnsCopy = [...store.sortColumns];
      const filterExpressionCopy = store.filterExpression;
      const menuItems = [];
      if (column.isSortable) {
        const currentSort = getSortInfo(column.name);
        const hasOtherSorts = sortColumnsCopy.length > 0;
        menuItems.push(
          {
            label: "Sort Ascending",
            icon: "▲",
            onClick: () => {
              store.addSort(column.name, "asc", false);
              emit("sort", column.name, "asc");
            }
          },
          {
            label: "Sort Descending",
            icon: "▼",
            onClick: () => {
              store.addSort(column.name, "desc", false);
              emit("sort", column.name, "desc");
            }
          }
        );
        if (hasOtherSorts) {
          menuItems.push(
            { divided: true },
            {
              label: "Add to Sort (Asc)",
              icon: "▲+",
              onClick: () => {
                store.addSort(column.name, "asc", true);
              }
            },
            {
              label: "Add to Sort (Desc)",
              icon: "▼+",
              onClick: () => {
                store.addSort(column.name, "desc", true);
              }
            }
          );
        }
        if (currentSort) {
          menuItems.push(
            { divided: true },
            {
              label: `Remove from Sort (Order ${currentSort.order})`,
              icon: "✖",
              onClick: () => {
                const newSorts = sortColumnsCopy.filter((s) => s.columnName !== column.name);
                store.setSortColumns(newSorts);
              }
            }
          );
        }
        if (hasOtherSorts) {
          menuItems.push(
            {
              label: "Clear All Sorts",
              icon: "🗑",
              onClick: () => {
                store.clearSort();
              }
            }
          );
        }
        menuItems.push({ divided: true });
      }
      if (column.isFilterable) {
        menuItems.push(
          {
            label: "Filter...",
            icon: "🔍",
            onClick: () => emit("showFilter", column.name)
          }
        );
        if (filterExpressionCopy !== null) {
          menuItems.push(
            {
              label: "Clear All Filters",
              icon: "🗑",
              onClick: () => {
                store.clearFilter();
              }
            }
          );
        }
        menuItems.push({ divided: true });
      }
      if (!column.specialType) {
        menuItems.push({
          label: "Auto-fit Column",
          icon: "↔️",
          onClick: () => emit("autoFitColumn", column.name)
        });
        if (props2.showHiddenColumnsPanel !== false) {
          menuItems.push({
            label: "Hide Column",
            icon: "👁️",
            onClick: () => emit("hideColumn", column.name)
          });
        }
      }
      ContextMenu.showContextMenu({
        x: event.x,
        y: event.y,
        items: menuItems
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "grid-header",
        style: normalizeStyle({ gridTemplateColumns: __props.gridTemplateColumns })
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.columns, (column) => {
          var _a, _b, _c, _d;
          return openBlock(), createElementBlock("div", {
            key: column.name,
            class: normalizeClass(["header-cell", { "header-cell--auto-width": column.autoWidth }]),
            onClick: ($event) => handleHeaderClick($event, column),
            onContextmenu: withModifiers(($event) => showHeaderContextMenu($event, column), ["prevent"])
          }, [
            column.specialType === "Checkbox" ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(["custom-checkbox", {
                "checkbox-none": unref(store).checkboxState === "none",
                "checkbox-some": unref(store).checkboxState === "some",
                "checkbox-all": unref(store).checkboxState === "all"
              }]),
              onClick: withModifiers(handleCheckboxHeaderClick, ["stop"]),
              title: "Toggle all checkboxes"
            }, [
              unref(store).checkboxState === "all" ? (openBlock(), createElementBlock("span", _hoisted_2$7, "✓")) : unref(store).checkboxState === "some" ? (openBlock(), createElementBlock("span", _hoisted_3$7, "−")) : createCommentVNode("", true)
            ], 2)) : (openBlock(), createElementBlock("span", _hoisted_4$7, toDisplayString(column.header), 1)),
            column.isSortable && getSortInfo(column.name) ? (openBlock(), createElementBlock("span", {
              key: 2,
              class: normalizeClass(["sort-icon", ((_a = getSortInfo(column.name)) == null ? void 0 : _a.isPrimary) ? "sort-icon--primary" : "sort-icon--secondary"])
            }, [
              createTextVNode(toDisplayString(((_b = getSortInfo(column.name)) == null ? void 0 : _b.direction) === "asc" ? "▲" : "▼") + " ", 1),
              ((_c = getSortInfo(column.name)) == null ? void 0 : _c.order) && getSortInfo(column.name).order > 1 ? (openBlock(), createElementBlock("span", _hoisted_5$7, toDisplayString((_d = getSortInfo(column.name)) == null ? void 0 : _d.order), 1)) : createCommentVNode("", true)
            ], 2)) : createCommentVNode("", true),
            createElementVNode("div", {
              class: "resize-grip",
              onMousedown: withModifiers(($event) => startResize(column, $event), ["stop"])
            }, null, 40, _hoisted_6$5)
          ], 42, _hoisted_1$8);
        }), 128))
      ], 4);
    };
  }
});
const _export_sfc = (sfc, props2) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props2) {
    target[key] = val;
  }
  return target;
};
const DataGridHeader = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-d456deec"]]);
const _hoisted_1$7 = ["innerHTML"];
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "DataGridCell",
  props: {
    cell: {},
    column: {},
    isSelected: { type: Boolean },
    gridId: {}
  },
  emits: ["editComplete", "cellInput", "copy", "cut", "paste", "delete", "insertAbove", "insertBelow"],
  setup(__props, { emit: __emit }) {
    const props2 = __props;
    const emit = __emit;
    const store = useDataGridStore(props2.gridId)();
    const validation = inject("validation", null);
    const validateCellThrottled = (validation == null ? void 0 : validation.validateCellThrottled) || (() => {
    });
    const validationErrors = (validation == null ? void 0 : validation.validationErrors) || {};
    const cellRef = ref();
    const inputRef = ref();
    const isEditing = ref(false);
    const editValue = ref(props2.cell.value);
    const originalValue = ref(null);
    const isHovered = ref(false);
    const tooltipPosition = ref(null);
    const isConfirming = ref(false);
    const displayValue = computed(() => {
      if (props2.cell.value == null) return "";
      return String(props2.cell.value);
    });
    const hasNewlines = computed(() => {
      return displayValue.value.includes("\n");
    });
    const highlightedValue = computed(() => {
      const text = displayValue.value;
      const searchQuery = store.searchQuery;
      if (!searchQuery || !text) {
        return escapeHtml(text);
      }
      try {
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex2 = new RegExp(`(${escapedQuery})`, "gi");
        return escapeHtml(text).replace(
          regex2,
          '<mark class="search-highlight">$1</mark>'
        );
      } catch (error) {
        return escapeHtml(text);
      }
    });
    function escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }
    const validationError = computed(() => {
      const errors = validationErrors[props2.cell.rowId] || [];
      return errors.find((e) => e.columnName === props2.cell.columnName);
    });
    const cellClasses = computed(() => {
      var _a, _b, _c, _d;
      return {
        "cell--selected": props2.isSelected,
        "cell--editing": isEditing.value,
        "cell--validation-error": ((_a = validationError.value) == null ? void 0 : _a.severity) === "Error" || ((_b = validationError.value) == null ? void 0 : _b.severity) === "Critical",
        "cell--validation-warning": ((_c = validationError.value) == null ? void 0 : _c.severity) === "Warning" || ((_d = validationError.value) == null ? void 0 : _d.severity) === "Info",
        "cell--readonly": props2.column.isReadOnly,
        "cell--auto-height": store.isAutoRowHeightEnabled,
        // Special case: has newlines but AutoRowHeight is OFF - still wrap by newlines only
        "cell--has-newlines": hasNewlines.value && !store.isAutoRowHeightEnabled
      };
    });
    const cellStyle = computed(() => {
      return {};
    });
    function handleMouseDown(event) {
      if (event.button !== 0) return;
      const isCtrlPressed = event.ctrlKey;
      console.log("[DataGridCell] MouseDown:", { rowId: props2.cell.rowId, columnName: props2.cell.columnName, isEditing: isEditing.value });
      store.selectCell(props2.cell.rowId, props2.cell.columnName, isCtrlPressed);
    }
    function handleMouseEnter(event) {
      isHovered.value = true;
      if (cellRef.value) {
        const rect = cellRef.value.getBoundingClientRect();
        tooltipPosition.value = {
          left: rect.left,
          top: rect.top - 4
          // 4px above the cell
        };
      }
      if (event.ctrlKey || store.wasCtrlPressed) {
        return;
      }
      const isLeftButtonPressed = event.buttons === 1;
      if (store.pressedCell && !store.isDragging && isLeftButtonPressed) {
        if (props2.cell.rowId === store.pressedCell.rowId && props2.cell.columnName === store.pressedCell.columnName) {
          return;
        }
        store.startDragSelection(props2.cell.rowId, props2.cell.columnName);
      } else if (store.isDragging && isLeftButtonPressed) {
        store.expandDragSelection(props2.cell.rowId, props2.cell.columnName);
      }
    }
    function handleMouseLeave() {
      isHovered.value = false;
      tooltipPosition.value = null;
    }
    function handleCellKeyDown(event) {
      if (!isEditing.value && props2.isSelected && event.key === "Enter" && !props2.column.isReadOnly) {
        event.preventDefault();
        enterEditMode();
      }
    }
    async function enterEditMode() {
      var _a, _b;
      if (props2.column.isReadOnly) return;
      console.log("[DataGridCell] enterEditMode:", {
        rowId: props2.cell.rowId,
        columnName: props2.cell.columnName,
        currentCellValue: props2.cell.value,
        storingAsOriginal: props2.cell.value
      });
      originalValue.value = props2.cell.value;
      isEditing.value = true;
      editValue.value = props2.cell.value;
      await nextTick();
      (_a = inputRef.value) == null ? void 0 : _a.focus();
      (_b = inputRef.value) == null ? void 0 : _b.select();
    }
    async function handleDoubleClick() {
      console.log("[DataGridCell] handleDoubleClick:", {
        rowId: props2.cell.rowId,
        columnName: props2.cell.columnName,
        currentValue: props2.cell.value
      });
      enterEditMode();
    }
    function getRowCells() {
      const row = store.rows.find((r) => r.rowId === props2.cell.rowId);
      if (!row) return void 0;
      return row.cells.map((c) => ({ columnName: c.columnName, value: c.value }));
    }
    function handleInput() {
      console.log("[DataGridCell] handleInput:", {
        rowId: props2.cell.rowId,
        columnName: props2.cell.columnName,
        newValue: editValue.value,
        autoValidate: store.config.autoValidate
      });
      if (store.config.autoValidate && store.config.enableValidation) {
        const rowCells = getRowCells();
        validateCellThrottled(props2.cell.rowId, props2.cell.columnName, editValue.value, rowCells);
      }
      emit("cellInput", props2.cell.rowId, props2.cell.columnName, editValue.value);
    }
    function confirmEdit() {
      console.log("[DataGridCell] confirmEdit:", {
        rowId: props2.cell.rowId,
        columnName: props2.cell.columnName,
        confirmedValue: editValue.value,
        originalWas: originalValue.value
      });
      isConfirming.value = true;
      if (store.config.autoValidate && store.config.enableValidation) {
        const rowCells = getRowCells();
        validateCellThrottled(props2.cell.rowId, props2.cell.columnName, editValue.value, rowCells);
      }
      emit("editComplete", props2.cell.rowId, props2.cell.columnName, editValue.value);
      isEditing.value = false;
      originalValue.value = null;
      nextTick(() => {
        try {
          console.log(`[DataGridCell] confirmEdit - Attempting to restore focus to cell: rowId=${props2.cell.rowId}, column=${props2.cell.columnName}`);
          if (cellRef.value) {
            cellRef.value.focus();
            console.log("[DataGridCell] confirmEdit - Focus restored successfully");
          } else {
            console.log("[DataGridCell] confirmEdit - WARNING: cellRef.value is null/undefined");
          }
        } catch (error) {
          console.log(`[DataGridCell] confirmEdit - ERROR restoring focus: ${error}`);
        }
      });
      setTimeout(() => {
        isConfirming.value = false;
      }, 100);
    }
    function handleKeyDown(event) {
      console.log("[DataGridCell] handleKeyDown:", {
        rowId: props2.cell.rowId,
        columnName: props2.cell.columnName,
        key: event.key,
        shift: event.shiftKey,
        ctrl: event.ctrlKey
      });
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        cancelEdit();
        return;
      }
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        confirmEdit();
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        const target = event.target;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        editValue.value = editValue.value.substring(0, start) + "	" + editValue.value.substring(end);
        nextTick(() => {
          target.selectionStart = target.selectionEnd = start + 1;
        });
      }
    }
    function cancelEdit() {
      console.log("[DataGridCell] cancelEdit:", {
        rowId: props2.cell.rowId,
        columnName: props2.cell.columnName,
        originalValue: originalValue.value,
        currentEditValue: editValue.value
      });
      editValue.value = originalValue.value;
      isEditing.value = false;
      emit("editComplete", props2.cell.rowId, props2.cell.columnName, originalValue.value);
      if (store.config.autoValidate && store.config.enableValidation) {
        const rowCells = getRowCells();
        validateCellThrottled(props2.cell.rowId, props2.cell.columnName, originalValue.value, rowCells);
      }
      originalValue.value = null;
      nextTick(() => {
        try {
          console.log(`[DataGridCell] cancelEdit - Attempting to restore focus to cell: rowId=${props2.cell.rowId}, column=${props2.cell.columnName}`);
          if (cellRef.value) {
            cellRef.value.focus();
            console.log("[DataGridCell] cancelEdit - Focus restored successfully");
          } else {
            console.log("[DataGridCell] cancelEdit - WARNING: cellRef.value is null/undefined");
          }
        } catch (error) {
          console.log(`[DataGridCell] cancelEdit - ERROR restoring focus: ${error}`);
        }
      });
    }
    function handleBlur() {
      console.log("[DataGridCell] handleBlur:", {
        rowId: props2.cell.rowId,
        columnName: props2.cell.columnName,
        isEditing: isEditing.value,
        isConfirming: isConfirming.value
      });
      if (isEditing.value && !isConfirming.value) {
        cancelEdit();
      }
    }
    function handleContextMenu(event) {
      if (!event.ctrlKey) {
        return;
      }
      event.preventDefault();
      const selectedRowData = /* @__PURE__ */ new Map();
      store.selectedCells.forEach((cellKey) => {
        const [rowId] = cellKey.split(":");
        const row = store.rows.find((r) => r.rowId === rowId);
        if (row) {
          selectedRowData.set(rowId, row.rowIndex);
        }
      });
      const selectedRowCount = selectedRowData.size;
      const selectedRowIndices = Array.from(selectedRowData.values());
      const minRowIndex = selectedRowIndices.length > 0 ? Math.min(...selectedRowIndices) : 0;
      const maxRowIndex = selectedRowIndices.length > 0 ? Math.max(...selectedRowIndices) : 0;
      const minRow = store.rows.find((r) => r.rowIndex === minRowIndex);
      const maxRow = store.rows.find((r) => r.rowIndex === maxRowIndex);
      ContextMenu.showContextMenu({
        x: event.x,
        y: event.y,
        items: [
          {
            label: "Copy",
            icon: "📋",
            onClick: () => emit("copy"),
            disabled: !props2.isSelected
          },
          {
            label: "Cut",
            icon: "✂️",
            onClick: () => emit("cut"),
            disabled: !props2.isSelected || props2.column.isReadOnly
          },
          {
            label: "Paste",
            icon: "📄",
            onClick: () => emit("paste"),
            disabled: props2.column.isReadOnly
          },
          { divided: true },
          {
            label: "Delete",
            icon: "🗑️",
            onClick: () => emit("delete"),
            disabled: !props2.isSelected || props2.column.isReadOnly
          },
          { divided: true },
          {
            label: `Insert ${selectedRowCount} row(s) above`,
            icon: "⬆️",
            // Insert above the MINIMUM selected row index
            onClick: () => emit("insertAbove", (minRow == null ? void 0 : minRow.rowId) || props2.cell.rowId, selectedRowCount || 1),
            disabled: props2.column.isReadOnly
          },
          {
            label: `Insert ${selectedRowCount} row(s) below`,
            icon: "⬇️",
            // Insert below the MAXIMUM selected row index
            onClick: () => emit("insertBelow", (maxRow == null ? void 0 : maxRow.rowId) || props2.cell.rowId, selectedRowCount || 1),
            disabled: props2.column.isReadOnly
          }
        ]
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "cellRef",
        ref: cellRef,
        class: normalizeClass(["grid-cell", cellClasses.value]),
        style: normalizeStyle(cellStyle.value),
        onMousedown: handleMouseDown,
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave,
        onDblclick: handleDoubleClick,
        onKeydown: handleCellKeyDown,
        onContextmenu: handleContextMenu,
        tabindex: "0"
      }, [
        !isEditing.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "cell-text",
          innerHTML: highlightedValue.value
        }, null, 8, _hoisted_1$7)) : withDirectives((openBlock(), createElementBlock("textarea", {
          key: 1,
          ref_key: "inputRef",
          ref: inputRef,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => editValue.value = $event),
          class: "cell-input",
          onInput: handleInput,
          onBlur: handleBlur,
          onKeydown: handleKeyDown
        }, null, 544)), [
          [vModelText, editValue.value]
        ]),
        (openBlock(), createBlock(Teleport, { to: "body" }, [
          validationError.value && (isHovered.value || __props.isSelected) && tooltipPosition.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["validation-tooltip", {
              "validation-tooltip--error": validationError.value.severity === "Error" || validationError.value.severity === "Critical",
              "validation-tooltip--warning": validationError.value.severity === "Warning" || validationError.value.severity === "Info"
            }]),
            style: normalizeStyle({
              position: "fixed",
              left: tooltipPosition.value.left + "px",
              top: tooltipPosition.value.top + "px"
            })
          }, toDisplayString(validationError.value.message), 7)) : createCommentVNode("", true)
        ]))
      ], 38);
    };
  }
});
const DataGridCell = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-46101a22"]]);
const _hoisted_1$6 = {
  key: 0,
  class: "row-number"
};
const _hoisted_2$6 = ["checked"];
const _hoisted_3$6 = ["title"];
const _hoisted_4$6 = { class: "validation-message" };
const _hoisted_5$6 = ["disabled"];
const DELETE_DEBOUNCE_MS = 300;
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "SpecialColumnCell",
  props: {
    specialType: {},
    rowId: {},
    rowIndex: {},
    column: {},
    isChecked: { type: Boolean }
  },
  emits: ["checkboxChange", "deleteRow", "insertRow"],
  setup(__props, { emit: __emit }) {
    const props2 = __props;
    const emit = __emit;
    watch(() => props2.isChecked, (newVal, oldVal) => {
      if (props2.specialType === "Checkbox") {
        console.log("[SpecialColumnCell] isChecked prop changed:", { rowId: props2.rowId, newVal, oldVal });
      }
    }, { immediate: true });
    const validation = inject("validation", null);
    const validationErrors = (validation == null ? void 0 : validation.validationErrors) || {};
    const isDeleting = ref(false);
    const lastDeleteClick = ref(0);
    const rowNumber = computed(() => props2.rowIndex + 1);
    const validationErrorsForRow = computed(() => {
      return validationErrors[props2.rowId] || [];
    });
    const hasValidationErrors = computed(() => {
      return validationErrorsForRow.value.some((e) => e.severity === "Error" || e.severity === "Critical");
    });
    const hasValidationWarnings = computed(() => {
      return validationErrorsForRow.value.some((e) => e.severity === "Warning");
    });
    const validationMessage = computed(() => {
      const allErrors = validationErrorsForRow.value;
      if (allErrors.length === 0) return "";
      return allErrors.map((e) => `${e.columnName}: ${e.message}`).join("; ");
    });
    const specialCellClasses = computed(() => ({
      "special-cell--row-number": props2.specialType === "RowNumber",
      "special-cell--checkbox": props2.specialType === "Checkbox",
      "special-cell--validation": props2.specialType === "ValidationAlerts",
      "special-cell--delete": props2.specialType === "DeleteRow",
      "special-cell--insert": props2.specialType === "InsertRow"
    }));
    const cellStyle = computed(() => {
      return {};
    });
    function handleCheckboxChange(event) {
      const target = event.target;
      console.log("[SpecialColumnCell] Checkbox change:", { rowId: props2.rowId, checked: target.checked, currentProp: props2.isChecked });
      emit("checkboxChange", props2.rowId, target.checked);
    }
    function handleDelete() {
      const now2 = Date.now();
      if (now2 - lastDeleteClick.value < DELETE_DEBOUNCE_MS) {
        return;
      }
      lastDeleteClick.value = now2;
      if (confirm("Are you sure you want to delete this row?")) {
        isDeleting.value = true;
        emit("deleteRow", props2.rowId);
        setTimeout(() => {
          isDeleting.value = false;
        }, 1e3);
      }
    }
    function handleInsert() {
      emit("insertRow", props2.rowId);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["special-cell", specialCellClasses.value]),
        style: normalizeStyle(cellStyle.value),
        onMousedown: _cache[0] || (_cache[0] = withModifiers(() => {
        }, ["stop"])),
        onMouseenter: _cache[1] || (_cache[1] = withModifiers(() => {
        }, ["stop"]))
      }, [
        __props.specialType === "RowNumber" ? (openBlock(), createElementBlock("span", _hoisted_1$6, toDisplayString(rowNumber.value), 1)) : __props.specialType === "Checkbox" ? (openBlock(), createElementBlock("input", {
          key: 1,
          type: "checkbox",
          class: "checkbox-input",
          checked: __props.isChecked,
          onChange: handleCheckboxChange
        }, null, 40, _hoisted_2$6)) : __props.specialType === "ValidationAlerts" ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass(["validation-alerts", { "has-errors": hasValidationErrors.value || hasValidationWarnings.value }]),
          title: validationMessage.value
        }, [
          createElementVNode("span", _hoisted_4$6, toDisplayString(validationMessage.value), 1)
        ], 10, _hoisted_3$6)) : __props.specialType === "DeleteRow" ? (openBlock(), createElementBlock("button", {
          key: 3,
          class: "delete-button",
          disabled: isDeleting.value,
          onClick: handleDelete,
          title: "Delete row"
        }, " 🗑️ ", 8, _hoisted_5$6)) : __props.specialType === "InsertRow" ? (openBlock(), createElementBlock("button", {
          key: 4,
          class: "insert-button",
          onClick: handleInsert,
          title: "Insert new row"
        }, " ➕ ")) : createCommentVNode("", true)
      ], 38);
    };
  }
});
const SpecialColumnCell = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-771c0d4c"]]);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "DataGridRow",
  props: {
    row: {},
    columns: {},
    gridTemplateColumns: {},
    gridId: {}
  },
  emits: ["cellEditComplete", "cellInput", "checkboxChange", "deleteRow", "insertRow", "insertAbove", "insertBelow"],
  setup(__props, { emit: __emit }) {
    const props2 = __props;
    const emit = __emit;
    const store = useDataGridStore(props2.gridId)();
    const isRowCheckedComputed = computed(() => {
      const checked = store.isRowChecked(props2.row.rowId);
      console.log("[DataGridRow] Row checked state:", { rowId: props2.row.rowId, checked });
      return checked;
    });
    function getCellForColumn(columnName) {
      const cell = props2.row.cells.find((c) => c.columnName === columnName);
      if (!cell) {
        return {
          rowId: props2.row.rowId,
          columnName,
          value: null,
          isSelected: false,
          isValidationError: false
        };
      }
      return cell;
    }
    function handleEditComplete(rowId, columnName, value) {
      emit("cellEditComplete", rowId, columnName, value);
    }
    function handleCellInput(rowId, columnName, value) {
      emit("cellInput", rowId, columnName, value);
    }
    function handleCheckboxChange(rowId, checked) {
      emit("checkboxChange", rowId, checked);
    }
    function handleDeleteRow(rowId) {
      emit("deleteRow", rowId);
    }
    function handleInsertRow(afterRowId) {
      emit("insertRow", afterRowId);
    }
    function handleInsertAbove(rowId, count) {
      emit("insertAbove", rowId, count);
    }
    function handleInsertBelow(rowId, count) {
      emit("insertBelow", rowId, count);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "grid-row",
        style: normalizeStyle({ height: __props.row.height + "px", gridTemplateColumns: __props.gridTemplateColumns })
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.columns, (column) => {
          return openBlock(), createElementBlock(Fragment, {
            key: `${__props.row.rowId}:${column.name}`
          }, [
            column.specialType ? (openBlock(), createBlock(SpecialColumnCell, {
              key: 0,
              "special-type": column.specialType,
              "row-id": __props.row.rowId,
              "row-index": __props.row.rowIndex,
              column,
              "is-checked": column.specialType === "Checkbox" ? isRowCheckedComputed.value : void 0,
              onCheckboxChange: handleCheckboxChange,
              onDeleteRow: handleDeleteRow,
              onInsertRow: handleInsertRow
            }, null, 8, ["special-type", "row-id", "row-index", "column", "is-checked"])) : (openBlock(), createBlock(DataGridCell, {
              key: 1,
              cell: getCellForColumn(column.name),
              column,
              "is-selected": unref(store).isCellSelected(__props.row.rowId, column.name),
              "grid-id": __props.gridId,
              onEditComplete: handleEditComplete,
              onCellInput: handleCellInput,
              onInsertAbove: handleInsertAbove,
              onInsertBelow: handleInsertBelow
            }, null, 8, ["cell", "column", "is-selected", "grid-id"]))
          ], 64);
        }), 128))
      ], 4);
    };
  }
});
const DataGridRow = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-16300a38"]]);
const _hoisted_1$5 = { class: "pagination" };
const _hoisted_2$5 = ["disabled"];
const _hoisted_3$5 = ["disabled"];
const _hoisted_4$5 = { class: "page-numbers" };
const _hoisted_5$5 = ["onClick"];
const _hoisted_6$4 = ["disabled"];
const _hoisted_7$4 = ["disabled"];
const _hoisted_8$4 = { class: "page-info" };
const _hoisted_9$4 = ["value"];
const _hoisted_10$4 = ["value"];
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "PaginationControl",
  props: {
    currentPage: {},
    pageSize: {},
    totalRows: {},
    pageSizeOptions: { default: () => [50, 100, 200, 500] }
  },
  emits: ["pageChange", "pageSizeChange"],
  setup(__props, { emit: __emit }) {
    const props2 = __props;
    const emit = __emit;
    const sortedPageSizeOptions = computed(() => {
      const options = [...props2.pageSizeOptions];
      if (!options.includes(props2.pageSize)) {
        options.push(props2.pageSize);
      }
      return options.sort((a, b) => a - b);
    });
    const totalPages = computed(() => Math.ceil(props2.totalRows / props2.pageSize));
    const visiblePages = computed(() => {
      const total = totalPages.value;
      const current = props2.currentPage;
      const maxVisible = 20;
      if (total <= maxVisible) {
        const pages2 = [];
        for (let i = 1; i <= total; i++) {
          pages2.push(i);
        }
        return pages2;
      }
      const step = Math.ceil(total / maxVisible);
      const pages = /* @__PURE__ */ new Set();
      pages.add(1);
      pages.add(total);
      pages.add(current);
      if (current > 1) pages.add(current - 1);
      if (current < total) pages.add(current + 1);
      for (let i = 1; i <= total; i += step) {
        pages.add(i);
      }
      return Array.from(pages).sort((a, b) => a - b);
    });
    function handlePageSizeChange(event) {
      const target = event.target;
      emit("pageSizeChange", Number(target.value));
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$5, [
        createElementVNode("button", {
          onClick: _cache[0] || (_cache[0] = ($event) => emit("pageChange", 1)),
          disabled: __props.currentPage === 1
        }, " First ", 8, _hoisted_2$5),
        createElementVNode("button", {
          onClick: _cache[1] || (_cache[1] = ($event) => emit("pageChange", __props.currentPage - 1)),
          disabled: __props.currentPage === 1
        }, " Previous ", 8, _hoisted_3$5),
        createElementVNode("div", _hoisted_4$5, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(visiblePages.value, (page) => {
            return openBlock(), createElementBlock("button", {
              key: page,
              class: normalizeClass({ "page-number": true, "active": page === __props.currentPage }),
              onClick: ($event) => emit("pageChange", page)
            }, toDisplayString(page), 11, _hoisted_5$5);
          }), 128))
        ]),
        createElementVNode("button", {
          onClick: _cache[2] || (_cache[2] = ($event) => emit("pageChange", __props.currentPage + 1)),
          disabled: __props.currentPage === totalPages.value
        }, " Next ", 8, _hoisted_6$4),
        createElementVNode("button", {
          onClick: _cache[3] || (_cache[3] = ($event) => emit("pageChange", totalPages.value)),
          disabled: __props.currentPage === totalPages.value
        }, " Last ", 8, _hoisted_7$4),
        createElementVNode("span", _hoisted_8$4, " (" + toDisplayString(__props.totalRows) + " rows) ", 1),
        createElementVNode("select", {
          value: __props.pageSize,
          onChange: handlePageSizeChange
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(sortedPageSizeOptions.value, (size) => {
            return openBlock(), createElementBlock("option", {
              key: size,
              value: size
            }, toDisplayString(size), 9, _hoisted_10$4);
          }), 128))
        ], 40, _hoisted_9$4)
      ]);
    };
  }
});
const PaginationControl = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-8f2dff14"]]);
const _hoisted_1$4 = { class: "filter-header" };
const _hoisted_2$4 = { class: "filter-title" };
const _hoisted_3$4 = { class: "filter-mode" };
const _hoisted_4$4 = {
  key: 0,
  class: "filter-content"
};
const _hoisted_5$4 = { class: "filter-values" };
const _hoisted_6$3 = ["onUpdate:modelValue"];
const _hoisted_7$3 = { class: "value-text" };
const _hoisted_8$3 = {
  key: 0,
  class: "no-values"
};
const _hoisted_9$3 = {
  key: 1,
  class: "filter-content"
};
const _hoisted_10$3 = { class: "regex-label" };
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
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
  setup(__props, { emit: __emit }) {
    const props2 = __props;
    const emit = __emit;
    const filterMode = ref(props2.currentMode || "checkbox");
    const searchText = ref("");
    const regexPattern = ref(props2.currentPattern || "");
    const values = ref([]);
    watch(() => props2.uniqueValues, (newValues) => {
      values.value = newValues.map((v) => ({ ...v }));
    }, { immediate: true, deep: true });
    watch(() => props2.currentPattern, (newPattern) => {
      if (newPattern) {
        regexPattern.value = newPattern;
      }
    }, { immediate: true });
    const filteredValues = computed(() => {
      if (!searchText.value) {
        return values.value;
      }
      const search = searchText.value.toLowerCase();
      return values.value.filter(
        (item) => item.value.toLowerCase().includes(search)
      );
    });
    const displayText = (item) => {
      return item.count > 0 ? `${item.value} (${item.count})` : item.value;
    };
    function selectAll() {
      filteredValues.value.forEach((item) => {
        item.isSelected = true;
      });
    }
    function deselectAll() {
      filteredValues.value.forEach((item) => {
        item.isSelected = false;
      });
    }
    function handleApply() {
      if (filterMode.value === "checkbox") {
        const selectedValues = values.value.filter((item) => item.isSelected).map((item) => item.value);
        emit("applyCheckbox", selectedValues);
      } else {
        emit("applyRegex", regexPattern.value);
      }
      handleClose();
    }
    function handleClear() {
      emit("clearFilter");
      handleClose();
    }
    function handleClose() {
      emit("close");
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, { to: "body" }, [
        __props.visible ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "filter-flyout-overlay",
          onClick: withModifiers(handleClose, ["self"])
        }, [
          createElementVNode("div", {
            class: "filter-flyout",
            style: normalizeStyle({ top: __props.position.y + "px", left: __props.position.x + "px" })
          }, [
            createElementVNode("div", _hoisted_1$4, [
              createElementVNode("h3", _hoisted_2$4, "Filter: " + toDisplayString(__props.columnName), 1),
              createElementVNode("button", {
                class: "close-button",
                onClick: handleClose
              }, "✕")
            ]),
            createElementVNode("div", _hoisted_3$4, [
              createElementVNode("label", null, [
                withDirectives(createElementVNode("input", {
                  type: "radio",
                  value: "checkbox",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => filterMode.value = $event),
                  name: "filterMode"
                }, null, 512), [
                  [vModelRadio, filterMode.value]
                ]),
                _cache[4] || (_cache[4] = createElementVNode("span", null, "Checkbox", -1))
              ]),
              createElementVNode("label", null, [
                withDirectives(createElementVNode("input", {
                  type: "radio",
                  value: "regex",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => filterMode.value = $event),
                  name: "filterMode"
                }, null, 512), [
                  [vModelRadio, filterMode.value]
                ]),
                _cache[5] || (_cache[5] = createElementVNode("span", null, "Regex", -1))
              ])
            ]),
            filterMode.value === "checkbox" ? (openBlock(), createElementBlock("div", _hoisted_4$4, [
              withDirectives(createElementVNode("input", {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => searchText.value = $event),
                type: "text",
                class: "filter-search",
                placeholder: "Search values..."
              }, null, 512), [
                [vModelText, searchText.value]
              ]),
              createElementVNode("div", { class: "filter-actions" }, [
                createElementVNode("button", {
                  class: "action-button",
                  onClick: selectAll
                }, "Select All"),
                createElementVNode("button", {
                  class: "action-button",
                  onClick: deselectAll
                }, "Deselect All")
              ]),
              createElementVNode("div", _hoisted_5$4, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(filteredValues.value, (item) => {
                  return openBlock(), createElementBlock("label", {
                    key: item.value,
                    class: normalizeClass(["value-item", { "value-item--selected": item.isSelected }])
                  }, [
                    withDirectives(createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": ($event) => item.isSelected = $event,
                      class: "value-checkbox"
                    }, null, 8, _hoisted_6$3), [
                      [vModelCheckbox, item.isSelected]
                    ]),
                    createElementVNode("span", _hoisted_7$3, toDisplayString(item.displayText || displayText(item)), 1)
                  ], 2);
                }), 128)),
                filteredValues.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_8$3, " No values found ")) : createCommentVNode("", true)
              ])
            ])) : (openBlock(), createElementBlock("div", _hoisted_9$3, [
              createElementVNode("label", _hoisted_10$3, [
                _cache[6] || (_cache[6] = createElementVNode("span", null, "Regex Pattern:", -1)),
                withDirectives(createElementVNode("input", {
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => regexPattern.value = $event),
                  type: "text",
                  class: "regex-input",
                  placeholder: "^test.*|.*example$"
                }, null, 512), [
                  [vModelText, regexPattern.value]
                ])
              ]),
              _cache[7] || (_cache[7] = createElementVNode("div", { class: "regex-help" }, [
                createElementVNode("details", null, [
                  createElementVNode("summary", null, "Regex Examples"),
                  createElementVNode("ul", null, [
                    createElementVNode("li", null, [
                      createElementVNode("code", null, "^test"),
                      createTextVNode(' - Starts with "test"')
                    ]),
                    createElementVNode("li", null, [
                      createElementVNode("code", null, "example$"),
                      createTextVNode(' - Ends with "example"')
                    ]),
                    createElementVNode("li", null, [
                      createElementVNode("code", null, "^test.*example$"),
                      createTextVNode(' - Starts with "test" and ends with "example"')
                    ]),
                    createElementVNode("li", null, [
                      createElementVNode("code", null, "test|example"),
                      createTextVNode(' - Contains "test" OR "example"')
                    ]),
                    createElementVNode("li", null, [
                      createElementVNode("code", null, "\\d{3}"),
                      createTextVNode(" - Contains exactly 3 digits")
                    ])
                  ])
                ])
              ], -1))
            ])),
            createElementVNode("div", { class: "filter-footer" }, [
              createElementVNode("button", {
                class: "footer-button footer-button--apply",
                onClick: handleApply
              }, " Apply Filter "),
              createElementVNode("button", {
                class: "footer-button footer-button--clear",
                onClick: handleClear
              }, " Clear Filter "),
              createElementVNode("button", {
                class: "footer-button footer-button--cancel",
                onClick: handleClose
              }, " Cancel ")
            ])
          ], 4)
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
const FilterFlyout = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-4fbdbd14"]]);
const _hoisted_1$3 = {
  key: 0,
  class: "processing-overlay"
};
const _hoisted_2$3 = { class: "processing-content" };
const _hoisted_3$3 = { class: "processing-text" };
const _hoisted_4$3 = {
  key: 0,
  class: "progress-container"
};
const _hoisted_5$3 = { class: "progress-bar-wrapper" };
const _hoisted_6$2 = { class: "progress-text" };
const _hoisted_7$2 = {
  key: 1,
  class: "loading-overlay"
};
const _hoisted_8$2 = { class: "loading-content" };
const _hoisted_9$2 = { class: "loading-text" };
const _hoisted_10$2 = {
  key: 0,
  class: "progress-container"
};
const _hoisted_11$2 = { class: "progress-bar-wrapper" };
const _hoisted_12$2 = { class: "progress-text" };
const _hoisted_13$2 = { class: "grid-toolbar" };
const _hoisted_14$2 = { class: "toolbar-section" };
const _hoisted_15$1 = ["title"];
const _hoisted_16$1 = { class: "toolbar-section" };
const _hoisted_17 = ["disabled"];
const _hoisted_18 = ["disabled"];
const _hoisted_19 = {
  key: 2,
  class: "hidden-columns-panel"
};
const _hoisted_20 = ["onClick", "title"];
const _hoisted_21 = { class: "grid-container" };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DataGrid",
  props: {
    config: {},
    columns: {},
    gridId: {},
    theme: {},
    minTableWidth: {},
    width: {},
    height: {},
    autoRowHeightEnabled: { type: Boolean },
    minRows: {},
    showHiddenColumnsPanel: { type: Boolean }
  },
  setup(__props, { expose: __expose }) {
    var _a;
    const props2 = __props;
    const instanceId = props2.gridId || `grid-${Math.random().toString(36).substr(2, 9)}`;
    const logger = useLogger(`DataGrid[${instanceId}]`);
    logger.info("⚙️ Component initializing", {
      gridId: instanceId,
      hasConfig: !!props2.config,
      hasColumns: !!props2.columns,
      columnCount: ((_a = props2.columns) == null ? void 0 : _a.length) || 0
    });
    console.log("[DataGrid] Creating store with ID:", instanceId);
    const storeFactory = useDataGridStore(instanceId);
    console.log("[DataGrid] Store factory created:", typeof storeFactory, storeFactory);
    let store;
    try {
      store = storeFactory();
      console.log("[DataGrid] Store instance created:", store);
      logger.debug("📦 Store created", { instanceId });
    } catch (error) {
      console.error("[DataGrid] FAILED to create store:", error);
      logger.error("❌ Store creation failed", { instanceId, error });
      throw error;
    }
    if (props2.autoRowHeightEnabled !== void 0) {
      store.setAutoRowHeightEnabled(props2.autoRowHeightEnabled);
      logger.info(`🔧 AutoRowHeight initialized to: ${props2.autoRowHeightEnabled}`);
    }
    if (props2.minRows !== void 0) {
      store.setMinRows(props2.minRows);
      logger.info(`🔧 MinRows initialized to: ${props2.minRows}`);
    }
    const validation = useValidation();
    provide("validation", validation);
    const copyPaste = useCopyPaste();
    const { filterRows: filterRowsHelper, evaluateFilter } = useFiltering();
    const isGridReady = ref(false);
    const isProcessing2 = ref(false);
    const isValidating = ref(false);
    const validationProgress = ref({
      isValidating: false,
      current: 0,
      total: 0,
      percentage: 0
    });
    let validationCancelled = false;
    const containerHeight = ref(800);
    const computedMaxHeight = computed(() => {
      const maxHeight = Math.max(32, Math.floor(containerHeight.value * 0.7));
      console.log(`[AutoRowHeight] Computed maxHeight: ${maxHeight}px (container: ${containerHeight.value}px)`);
      return maxHeight;
    });
    const autoRowHeight = useAutoRowHeight({
      minHeight: 32,
      maxHeight: computedMaxHeight.value,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: 14,
      enableWrapping: true,
      padding: 16
    });
    watch(computedMaxHeight, async (newMaxHeight) => {
      console.log(`[AutoRowHeight] maxHeight changed to: ${newMaxHeight}px`);
      autoRowHeight.updateMaxHeight(newMaxHeight);
      if (store.isAutoRowHeightEnabled && store.rows.length > 0) {
        console.log("[AutoRowHeight] maxHeight changed - recalculating all row heights...");
        await applyAutoRowHeightToAll();
      }
    });
    const measureContainerHeight = () => {
      if (!scrollerRef.value) {
        console.log("[AutoRowHeight] Cannot measure: scrollerRef is null");
        return;
      }
      if (!scrollerRef.value.$el) {
        console.log("[AutoRowHeight] Cannot measure: scrollerRef.$el is undefined");
        return;
      }
      const height = scrollerRef.value.$el.clientHeight;
      if (height > 0) {
        containerHeight.value = height;
        console.log(`[AutoRowHeight] Container height measured: ${height}px`);
      } else {
        console.log("[AutoRowHeight] Container height is 0, keeping default");
      }
    };
    onMounted(async () => {
      logger.info("========== ✅ Component mounted - START initialization ==========", {
        gridId: props2.gridId,
        autoRowHeight: store.isAutoRowHeightEnabled,
        rowCount: store.rows.length,
        columnCount: store.columns.length
      });
      document.addEventListener("mouseup", handleDocumentMouseUp);
      document.addEventListener("keydown", handleKeyboardShortcuts);
      logger.debug("🎯 Event listeners registered (mouseup, keydown)");
      if (props2.columns && props2.columns.length > 0 && store.rows.length === 0) {
        logger.info("🔧 Auto-initializing empty rows from provided columns", {
          columnCount: props2.columns.length
        });
        try {
          store.setColumns(props2.columns);
          store.initializeEmptyRows();
          logger.info(`✅ Auto-initialized ${store.rows.length} empty rows`);
        } catch (error) {
          logger.error("❌ Failed to set columns:", error);
          alert(`Column configuration error: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      checkBackendConnection();
      await nextTick();
      logger.debug("⏰ DOM ready after nextTick");
      measureContainerHeight();
      if (store.isAutoRowHeightEnabled && store.rows.length > 0) {
        logger.info("📏 AutoRowHeight enabled - applying heights...");
        await nextTick();
        try {
          await applyAutoRowHeightToAll();
          logger.info("✅ AutoRowHeight applied successfully on mount");
        } catch (error) {
          logger.error("❌ AutoRowHeight ERROR on mount:", error);
        }
      } else {
        logger.debug(`⏭️ Skipping AutoRowHeight: enabled=${store.isAutoRowHeightEnabled}, rowCount=${store.rows.length}`);
      }
      window.addEventListener("resize", measureContainerHeight);
      logger.debug("🎯 Resize listener registered");
      await nextTick();
      isGridReady.value = true;
      logger.info("========== ✅ Grid marked as READY for user interaction ==========");
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", measureContainerHeight);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      document.removeEventListener("keydown", handleKeyboardShortcuts);
      logger.info("🧹 Cleanup: All event listeners removed");
    });
    const isBackendConnected = ref(false);
    const isLoadingFromBackend = ref(false);
    const isSavingToBackend = ref(false);
    const loadingState = ref({
      isLoading: false,
      operation: "",
      progress: 0,
      total: 0,
      percentage: 0
    });
    const scrollerRef = ref();
    const getSelectedRows = () => {
      const selectedCells = Array.from(store.selectedCells);
      if (selectedCells.length === 0) return [];
      const rowIds = new Set(selectedCells.map((cellId) => cellId.split(":")[0]));
      return store.rows.filter((row) => rowIds.has(row.rowId));
    };
    const getDataColumnNames = () => {
      return dataColumns.value.filter((col) => !col.specialType).map((col) => col.name);
    };
    const handleCopy = async () => {
      const rows = getSelectedRows();
      if (rows.length === 0) {
        console.warn("No rows selected for copy");
        return;
      }
      const columnNames = getDataColumnNames();
      const result = await copyPaste.copyToClipboard(rows, columnNames, { includeHeaders: true });
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    };
    const handlePaste = async () => {
      const result = await copyPaste.pasteFromClipboard();
      if (result.success && result.rows && result.rows.length > 0) {
        const selectedCells = Array.from(store.selectedCells);
        let targetRowIndex = store.rows.length;
        if (selectedCells.length > 0) {
          const firstCellId = selectedCells[0];
          const rowId = firstCellId.split(":")[0];
          const rowIndex = store.rows.findIndex((r) => r.rowId === rowId);
          if (rowIndex >= 0) {
            targetRowIndex = rowIndex;
          }
        }
        result.rows.forEach((rowData, index2) => {
          var _a2;
          if (targetRowIndex + index2 < store.rows.length) {
            const targetRow = store.rows[targetRowIndex + index2];
            Object.keys(rowData).forEach((key) => {
              if (dataColumns.value.some((col) => col.name === key)) {
                store.updateCell(targetRow.rowId, key, rowData[key]);
              }
            });
          } else {
            const lastRowId = (_a2 = store.rows[store.rows.length - 1]) == null ? void 0 : _a2.rowId;
            if (lastRowId) {
              store.insertRow(lastRowId);
              const newRow = store.rows[store.rows.length - 1];
              Object.keys(rowData).forEach((key) => {
                if (dataColumns.value.some((col) => col.name === key)) {
                  store.updateCell(newRow.rowId, key, rowData[key]);
                }
              });
            }
          }
        });
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    };
    const handleCut = async () => {
      await handleCopy();
      const selectedCells = Array.from(store.selectedCells);
      selectedCells.forEach((cellId) => {
        var _a2;
        const [rowId, columnName] = cellId.split(":");
        if (!((_a2 = dataColumns.value.find((col) => col.name === columnName)) == null ? void 0 : _a2.isReadOnly)) {
          store.updateCell(rowId, columnName, null);
        }
      });
    };
    const handleDelete = () => {
      const selectedCells = Array.from(store.selectedCells);
      selectedCells.forEach((cellId) => {
        var _a2;
        const [rowId, columnName] = cellId.split(":");
        if (!((_a2 = dataColumns.value.find((col) => col.name === columnName)) == null ? void 0 : _a2.isReadOnly)) {
          store.updateCell(rowId, columnName, null);
        }
      });
    };
    const handleSelectAll = () => {
      store.rows.forEach((row) => {
        dataColumns.value.forEach((col) => {
          if (!col.specialType) {
            store.selectCell(row.rowId, col.name, true);
          }
        });
      });
    };
    const shortcuts = useShortcuts({ enabled: true, context: ShortcutContext.Normal });
    shortcuts.registerShortcuts(createDefaultShortcuts({
      onCopy: handleCopy,
      onPaste: handlePaste,
      onCut: handleCut,
      onDelete: handleDelete,
      onSelectAll: handleSelectAll,
      onFind: () => console.log("Find not implemented yet")
    }));
    const visibleRows = computed(() => store.visibleRows);
    const dataColumns = computed(() => {
      const cols = Array.isArray(props2.columns) && props2.columns.length > 0 ? props2.columns : store.columns;
      return cols.map((col) => {
        if (col.specialType) {
          return col;
        }
        return {
          ...col,
          minWidth: col.minWidth ?? 50,
          // Default: 50
          maxWidth: col.maxWidth ?? 200,
          // Default: 200
          isSortable: col.isSortable ?? false,
          // Default: false
          isFilterable: col.isFilterable ?? false,
          // Default: false
          visibleForGrid: col.visibleForGrid ?? true
          // ✅ RIEŠENIE #6: EXPLICIT DEFAULT
        };
      });
    });
    function handleKeyboardShortcuts(event) {
      if (!event.ctrlKey && !event.metaKey) return;
      if (event.key === "c" || event.key === "C") {
        event.preventDefault();
        console.log("[DataGrid] Ctrl+C pressed - copying selected cells");
        handleCopySelectedCells();
      }
      if (event.key === "v" || event.key === "V") {
        event.preventDefault();
        console.log("[DataGrid] Ctrl+V pressed - pasting from clipboard");
        handlePasteSelectedCells();
      }
    }
    async function handleCopySelectedCells() {
      if (store.selectedCells.size === 0) {
        console.warn("[DataGrid] No cells selected for copy");
        return;
      }
      console.log("[DataGrid] Copying selected cells:", {
        selectedCount: store.selectedCells.size,
        selectedCells: Array.from(store.selectedCells)
      });
      const result = await copyPaste.copySelectedCells(
        store.selectedCells,
        store.rows,
        allColumns.value
      );
      if (result.success) {
        console.log("[DataGrid] Copy successful:", result.message);
      } else {
        console.error("[DataGrid] Copy failed:", result.message);
      }
    }
    async function handlePasteSelectedCells() {
      const result = await copyPaste.pasteFromClipboard();
      if (result.success && result.rows && result.rows.length > 0) {
        console.log("[DataGrid] Paste successful:", {
          rowCount: result.rows.length,
          headers: result.headers
        });
        let targetRowIndex = 0;
        let targetColIndex = 0;
        if (store.selectedCells.size > 0) {
          const firstCellKey = Array.from(store.selectedCells)[0];
          const [firstRowId, firstColName] = firstCellKey.split(":");
          const firstRow = store.rows.find((r) => r.rowId === firstRowId);
          const firstColIdx = allColumns.value.findIndex((c) => c.name === firstColName);
          if (firstRow && firstColIdx !== -1) {
            targetRowIndex = firstRow.rowIndex;
            targetColIndex = firstColIdx;
          }
        }
        console.log("[DataGrid] Pasting at position:", {
          targetRowIndex,
          targetColIndex
        });
        result.rows.forEach((rowData, rowOffset) => {
          const pasteRowIndex = targetRowIndex + rowOffset;
          if (pasteRowIndex >= store.rows.length) {
            console.warn("[DataGrid] Paste row out of bounds:", { pasteRowIndex, maxRows: store.rows.length });
            return;
          }
          const targetRow = store.rows[pasteRowIndex];
          Object.keys(rowData).forEach((columnKey, colOffset) => {
            const pasteColIndex = targetColIndex + colOffset;
            if (pasteColIndex >= allColumns.value.length) {
              console.warn("[DataGrid] Paste column out of bounds:", { pasteColIndex, maxCols: allColumns.value.length });
              return;
            }
            const targetColumn = allColumns.value[pasteColIndex];
            const value = rowData[columnKey];
            store.updateCell(targetRow.rowId, targetColumn.name, value);
            console.log("[DataGrid] Pasted cell:", {
              row: pasteRowIndex,
              col: pasteColIndex,
              columnName: targetColumn.name,
              value
            });
          });
        });
        console.log("[DataGrid] Paste complete");
      } else {
        console.error("[DataGrid] Paste failed:", result.message);
      }
    }
    onBeforeMount(() => {
      logger.info("🔄 Component before mount");
    });
    onBeforeUnmount(() => {
      logger.info("🔄 Component before unmount - starting cleanup");
      if (validation) {
        console.log("[DataGrid] Clearing validation state...");
        validation.clearValidationErrors();
        validation.validationRules.value.clear();
      }
      console.log("[DataGrid] Clearing store data...");
      store.clearAllData();
      logger.info("✅ Component cleanup complete");
    });
    onUnmounted(() => {
      logger.info("🗑️ Component unmounted - final cleanup");
      logger.info("👋 Component cleanup complete");
    });
    function calculateOptimalBatchSize(totalCells) {
      if (totalCells < 1e3) {
        return 25;
      } else if (totalCells < 5e3) {
        return 50;
      } else if (totalCells < 15e3) {
        return 100;
      } else {
        return 200;
      }
    }
    async function validateAllCellsInBatches() {
      if (isValidating.value) {
        console.log("[validateAllCellsInBatches] ⚠️ Validation already in progress, cancelling previous validation...");
        validationCancelled = true;
        const startWait = Date.now();
        while (isValidating.value && Date.now() - startWait < 5e3) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (isValidating.value) {
          console.error("[validateAllCellsInBatches] ❌ Previous validation did not finish in time");
          return;
        }
      }
      isValidating.value = true;
      validationCancelled = false;
      try {
        console.log("[validateAllCellsInBatches] 🔍 START", {
          enableValidation: store.config.enableValidation,
          hasValidation: !!validation,
          totalRows: store.rows.length,
          totalColumns: store.columns.length
        });
        console.info("═══════════════════════════════════════════════════");
        console.info("🔍 VALIDATION START");
        console.info(`   Rows: ${store.rows.length}, Columns: ${store.columns.length}`);
        console.info("═══════════════════════════════════════════════════");
        if (!store.config.enableValidation || !validation) {
          console.log("[validateAllCellsInBatches] ⚠️ SKIPPED - validation not enabled or not available");
          return;
        }
        const columnsWithRules = /* @__PURE__ */ new Set();
        for (const [columnName, rules] of validation.validationRules.value.entries()) {
          if (rules.length > 0) {
            columnsWithRules.add(columnName);
          }
        }
        console.log("[validateAllCellsInBatches] 🔍 Columns with rules:", {
          totalColumns: store.columns.length,
          columnsWithRules: columnsWithRules.size,
          columns: Array.from(columnsWithRules)
        });
        if (columnsWithRules.size === 0) {
          console.log("[validateAllCellsInBatches] ⚠️ NO VALIDATION RULES - skipping validation entirely");
          console.log("[validateAllCellsInBatches] ✅ SKIPPED - 0 cells validated (no rules defined)");
          return;
        }
        const cellsToValidate = store.getCellsNeedingValidation(true, columnsWithRules);
        console.log("[validateAllCellsInBatches] 📋 Cells needing validation:", {
          count: cellsToValidate.length,
          sample: cellsToValidate.slice(0, 5).map((c) => `${c.rowId}:${c.columnName}`)
        });
        if (cellsToValidate.length === 0) {
          console.log("[validateAllCellsInBatches] ✅ NO CELLS NEED VALIDATION - all cells already validated");
          return;
        }
        validationProgress.value = {
          isValidating: true,
          current: 0,
          total: cellsToValidate.length,
          percentage: 0
        };
        const PARALLEL_BATCH_SIZE = calculateOptimalBatchSize(cellsToValidate.length);
        let validatedCount = 0;
        console.log("[validateAllCellsInBatches] Starting PARALLEL batch validation...", {
          totalCells: cellsToValidate.length,
          parallelBatchSize: PARALLEL_BATCH_SIZE,
          estimatedBatches: Math.ceil(cellsToValidate.length / PARALLEL_BATCH_SIZE)
        });
        for (let i = 0; i < cellsToValidate.length; i += PARALLEL_BATCH_SIZE) {
          if (validationCancelled) {
            console.log("[validateAllCellsInBatches] ⚠️ CANCELLED by user");
            return;
          }
          const batch = cellsToValidate.slice(i, i + PARALLEL_BATCH_SIZE);
          const batchNumber = Math.floor(i / PARALLEL_BATCH_SIZE) + 1;
          console.log(`[validateAllCellsInBatches] 📦 Processing batch ${batchNumber} (PARALLEL):`, {
            batchSize: batch.length,
            from: i,
            to: i + batch.length
          });
          const validationPromises = batch.map(({ rowId, columnName }) => {
            const row = store.getRow(rowId);
            if (!row) {
              console.warn("[validateAllCellsInBatches] ⚠️ Row not found:", rowId);
              return Promise.resolve();
            }
            const cell = row.cells.find((c) => c.columnName === columnName);
            if (!cell) {
              console.warn("[validateAllCellsInBatches] ⚠️ Cell not found:", { rowId, columnName });
              return Promise.resolve();
            }
            const rowCells = row.cells.map((c) => ({ columnName: c.columnName, value: c.value }));
            return validation.validateCellDirect(rowId, columnName, cell.value, rowCells, true).then(() => {
              store.markCellValidated(rowId, columnName);
              validatedCount++;
            }).catch((err) => {
              console.error("[validateAllCellsInBatches] ❌ Validation error:", { rowId, columnName, err });
            });
          });
          await Promise.all(validationPromises);
          validationProgress.value.current = validatedCount;
          validationProgress.value.percentage = Math.round(validatedCount / cellsToValidate.length * 100);
          await nextTick();
          console.log(`[validateAllCellsInBatches] ✓ Batch ${batchNumber} complete (PARALLEL):`, {
            validated: validatedCount,
            total: cellsToValidate.length,
            progress: `${validationProgress.value.percentage}%`
          });
        }
        validation.updateErrorCount();
        console.log("[validateAllCellsInBatches] 🎉 COMPLETE:", {
          totalValidated: validatedCount,
          totalRequested: cellsToValidate.length,
          success: validatedCount === cellsToValidate.length
        });
        console.info("═══════════════════════════════════════════════════");
        console.info(`✅ VALIDATION SUCCESS - ${validatedCount} cells validated`);
        console.info(`   Total errors: ${validation.validationErrors.value.length}`);
        console.info("═══════════════════════════════════════════════════");
      } catch (error) {
        console.error("═══════════════════════════════════════════════════");
        console.error("❌ VALIDATION ERROR:", error);
        console.error("═══════════════════════════════════════════════════");
        throw error;
      } finally {
        isValidating.value = false;
        validationProgress.value.isValidating = false;
        console.log("[validateAllCellsInBatches] 🔍 END");
      }
    }
    watch(() => store.config.autoValidate, async (enabled, wasEnabled) => {
      console.log("[DataGrid] autoValidate changed:", { wasEnabled, enabled });
      if (enabled && !wasEnabled && store.config.enableValidation) {
        console.log("[DataGrid] Auto-validation enabled - validating all unvalidated cells");
        await validateAllCellsInBatches();
      }
    });
    function handleDocumentMouseUp() {
      if (store.isDragging || store.pressedCell) {
        store.endDragSelection();
      }
    }
    const specialColumns = computed(() => {
      const cols = [];
      const config2 = store.config;
      if (config2.showRowNumber) {
        cols.push({
          name: "__rowNumber",
          header: "#",
          width: 50,
          minWidth: 40,
          maxWidth: 80,
          isVisible: true,
          isReadOnly: true,
          isSortable: false,
          isFilterable: false,
          specialType: "RowNumber"
        });
      }
      if (config2.showCheckbox) {
        cols.push({
          name: "__checkbox",
          header: "☑",
          width: 40,
          minWidth: 40,
          maxWidth: 40,
          isVisible: true,
          isReadOnly: true,
          isSortable: false,
          isFilterable: true,
          // ✅ FIX: Povoliť filtrovanie pre Checkbox stĺpec
          specialType: "Checkbox"
        });
      }
      return cols;
    });
    const validationColumn = computed(() => {
      const cols = [];
      const config2 = store.config;
      if (config2.showValidationAlerts) {
        cols.push({
          name: "__validationAlerts",
          header: "⚠ Validation",
          width: 200,
          // Default width (only used if autoWidth is false)
          minWidth: 150,
          maxWidth: 9999,
          // No maximum - can grow as needed
          autoWidth: true,
          // Use 1fr to fill remaining space to full width
          isVisible: true,
          isReadOnly: true,
          isSortable: false,
          isFilterable: false,
          specialType: "ValidationAlerts"
        });
      }
      return cols;
    });
    const actionColumns = computed(() => {
      const cols = [];
      const config2 = store.config;
      if (config2.showInsertButton) {
        cols.push({
          name: "__insertRow",
          header: "Insert",
          width: 60,
          minWidth: 50,
          maxWidth: 80,
          isVisible: true,
          isReadOnly: true,
          isSortable: false,
          isFilterable: false,
          specialType: "InsertRow"
        });
      }
      if (config2.showDeleteButton) {
        cols.push({
          name: "__deleteRow",
          header: "Delete",
          width: 60,
          minWidth: 50,
          maxWidth: 80,
          isVisible: true,
          isReadOnly: true,
          isSortable: false,
          isFilterable: false,
          specialType: "DeleteRow"
        });
      }
      return cols;
    });
    const allColumns = computed(() => [
      ...specialColumns.value,
      ...dataColumns.value.filter((col) => !col.specialType && col.isVisible && col.visibleForGrid !== false),
      // Only visible non-special columns that are shown in grid
      ...validationColumn.value,
      ...actionColumns.value
    ]);
    const gridTemplateColumns = computed(() => {
      const template = allColumns.value.map((col) => {
        if (col.autoWidth) {
          return "1fr";
        }
        return `${col.width}px`;
      }).join(" ");
      console.log("[GridTemplate] All Columns:", allColumns.value.map((c) => ({
        name: c.name,
        header: c.header,
        width: c.width,
        autoWidth: c.autoWidth,
        specialType: c.specialType
      })));
      console.log("[GridTemplate] Generated Template:", template);
      return template;
    });
    watch(() => props2.config, (newConfig) => {
      if (newConfig) {
        store.setConfig(newConfig);
      }
    }, { immediate: true, deep: true });
    watch(() => props2.columns, (newColumns) => {
      console.log("[DataGrid] Columns watch triggered:", {
        hasColumns: newColumns == null ? void 0 : newColumns.length,
        rowsLength: store.rows.length,
        willInitialize: newColumns && newColumns.length > 0 && store.rows.length === 0
      });
      if (newColumns && newColumns.length > 0) {
        try {
          store.setColumns(newColumns);
          console.log("[DataGrid] After setColumns, rowsLength:", store.rows.length);
          if (store.rows.length === 0) {
            console.log("[DataGrid] Calling initializeEmptyRows...");
            store.initializeEmptyRows();
            console.log("[DataGrid] After initializeEmptyRows, rowsLength:", store.rows.length);
          } else {
            console.log("[DataGrid] SKIPPED initializeEmptyRows - rows already exist!");
          }
        } catch (error) {
          console.error("[DataGrid] Failed to set columns:", error);
          alert(`Column configuration error: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
    }, { immediate: true, deep: true });
    watch(() => {
      var _a2;
      return ((_a2 = validation == null ? void 0 : validation.ruleCount) == null ? void 0 : _a2.value) ?? 0;
    }, async (newCount, oldCount) => {
      var _a2, _b;
      const rulesSize = ((_b = (_a2 = validation == null ? void 0 : validation.validationRules) == null ? void 0 : _a2.value) == null ? void 0 : _b.size) || 0;
      console.log("[WATCHER] Validation rules changed!", {
        ruleCount: newCount,
        oldCount,
        hasRules: rulesSize > 0,
        hasData: store.rows.length > 0,
        autoValidateEnabled: store.config.autoValidate
      });
      if (rulesSize === 0 || store.rows.length === 0 || !store.config.autoValidate) {
        console.log("[WATCHER] Skipping auto-validation:", {
          noRules: rulesSize === 0,
          noData: store.rows.length === 0,
          autoValidateDisabled: !store.config.autoValidate
        });
        return;
      }
      console.log("[WATCHER] Triggering auto-validation for all rows...");
      store.clearValidationTracking();
      try {
        await nextTick();
        console.log("[WATCHER] First nextTick done");
        await nextTick();
        console.log("[WATCHER] Second nextTick done");
        await validateAllCellsInBatches();
        console.log("[WATCHER] ✅ Auto-validation completed after adding rules");
      } catch (error) {
        console.error("[WATCHER] ❌ Error during auto-validation:", error);
      }
    });
    watch(() => {
      var _a2;
      return ((_a2 = validation == null ? void 0 : validation.errorCount) == null ? void 0 : _a2.value) ?? 0;
    }, async (errorCount, oldErrorCount) => {
      const newErrors = validation == null ? void 0 : validation.validationErrors;
      console.log("[WATCHER] Validation errors changed!", {
        errorCount,
        oldErrorCount,
        hasErrors: errorCount > 0,
        isAutoRowHeightEnabled: store.isAutoRowHeightEnabled,
        validationErrorsKeys: newErrors ? Object.keys(newErrors) : []
      });
      console.log("[WATCHER] Updating validationErrorCount for all rows...");
      store.rows.forEach((row) => {
        const count = newErrors && newErrors[row.rowId] ? newErrors[row.rowId].length : 0;
        row.validationErrorCount = count;
        if (count > 0 || row.validationErrorCount !== count) {
          console.log("[WATCHER] Updated validationErrorCount:", { rowId: row.rowId, count });
        }
      });
      if (!newErrors || errorCount === 0) {
        console.log("[WATCHER] No validation errors, heights updated, done.");
        return;
      }
      await nextTick();
      if (store.isAutoRowHeightEnabled) {
        console.log("[WATCHER] AutoRowHeight is ON, calling applyAutoRowHeightToAll...");
        await applyAutoRowHeightToAll();
        console.log("[WATCHER] applyAutoRowHeightToAll completed");
      } else {
        console.log("[WATCHER] AutoRowHeight is OFF, calling resetAllRowHeights...");
        await resetAllRowHeights();
        console.log("[WATCHER] resetAllRowHeights completed");
      }
    });
    function handleSort(columnName, direction) {
      const column = store.columns.find((c) => c.name === columnName);
      if (!column) {
        console.error(`[handleSort] Column not found: ${columnName}`);
        return;
      }
      if (!column.isSortable) {
        console.warn(`[handleSort] Column '${columnName}' is not sortable`);
        return;
      }
      if (column.visibleForGrid === false) {
        console.warn(`[handleSort] Column '${columnName}' has visibleForGrid=false, sorting not allowed`);
        return;
      }
      store.addSort(columnName, direction, false);
    }
    function handleResize(columnName, newWidth) {
      const col = store.columns.find((c) => c.name === columnName);
      if (col) {
        col.width = newWidth;
      }
    }
    async function handleCellEditComplete(rowId, columnName, value) {
      console.log(`[DataGrid] handleCellEditComplete: rowId=${rowId}, columnName=${columnName}, newValue=${value}, autoValidate=${store.config.autoValidate}, autoRowHeight=${store.isAutoRowHeightEnabled}`);
      store.updateCell(rowId, columnName, value);
      const column = store.columns.find((c) => c.name === columnName);
      if (!column) {
        console.warn("[DataGrid] handleCellEditComplete: Column not found:", columnName);
        return;
      }
      if (column.visibleForGrid === false) {
        console.log("[DataGrid] handleCellEditComplete: Skipping validation - hidden column:", columnName);
      } else if (store.config.autoValidate && store.config.enableValidation && validation) {
        const hasRules = validation.validationRules.value.has(columnName) && validation.validationRules.value.get(columnName).length > 0;
        if (!hasRules) {
          console.log("[DataGrid] handleCellEditComplete: Skipping validation - no rules:", columnName);
        } else {
          const row = store.rows.find((r) => r.rowId === rowId);
          const rowCells = row == null ? void 0 : row.cells.map((c) => ({ columnName: c.columnName, value: c.value }));
          await validation.validateCellThrottled(rowId, columnName, value, rowCells);
          const hasErrors = validation.validationErrors[rowId] && validation.validationErrors[rowId].length > 0;
          console.log("[DataGrid] Cell validated after edit:", { rowId, columnName, hasErrors });
        }
      }
      if (store.isAutoRowHeightEnabled) {
        console.log("[DataGrid] Recalculating row height:", { rowId });
        await recalculateRowHeightAfterEdit(rowId);
        await nextTick();
      } else {
        console.log("[DataGrid] Recalculating height for newlines (AutoRowHeight OFF):", { rowId });
        await recalculateRowHeightForNewlines(rowId);
      }
    }
    async function handleCellInput(rowId, columnName, value) {
      console.log("[handleCellInput] Called:", { rowId, columnName, value, autoRowHeightEnabled: store.isAutoRowHeightEnabled });
      store.updateCell(rowId, columnName, value);
      if (store.isAutoRowHeightEnabled) {
        await recalculateRowHeightAfterEdit(rowId);
        await nextTick();
      } else if (value != null && String(value).includes("\n")) {
        await recalculateRowHeightForNewlines(rowId);
      }
    }
    function handleCheckboxChange(rowId, checked) {
      store.toggleCheckbox(rowId, checked);
    }
    function handleDeleteRow(rowId) {
      store.deleteRow(rowId);
    }
    function handleInsertRow(afterRowId) {
      store.insertRow(afterRowId);
    }
    function handleInsertAbove(rowId, count) {
      store.insertMultipleRows(rowId, count, "above");
    }
    function handleInsertBelow(rowId, count) {
      store.insertMultipleRows(rowId, count, "below");
    }
    const hiddenColumns = computed(() => {
      return dataColumns.value.filter((col) => !col.isVisible && !col.specialType && col.visibleForGrid !== false);
    });
    function handleHideColumn(columnName) {
      const col = dataColumns.value.find((c) => c.name === columnName);
      if (col && !col.specialType) {
        col.isVisible = false;
        console.log(`Hidden column: ${columnName}`);
      }
    }
    function showColumn(columnName) {
      const col = dataColumns.value.find((c) => c.name === columnName);
      if (col) {
        col.isVisible = true;
        console.log(`Shown column: ${columnName}`);
      }
    }
    function showAllColumns() {
      dataColumns.value.forEach((col) => {
        if (!col.specialType) {
          col.isVisible = true;
        }
      });
      console.log("Shown all columns");
    }
    function handleAutoFitColumn(columnName) {
      const col = dataColumns.value.find((c) => c.name === columnName);
      if (!col) return;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;
      context.font = "14px system-ui, -apple-system, sans-serif";
      let maxWidth = 0;
      const headerWidth = context.measureText(col.header).width;
      maxWidth = Math.max(maxWidth, headerWidth + 40);
      store.rows.forEach((row) => {
        const cell = row.cells.find((c) => c.columnName === columnName);
        const value = cell == null ? void 0 : cell.value;
        const textValue = (value == null ? void 0 : value.toString()) ?? "";
        if (textValue) {
          const textWidth = context.measureText(textValue).width;
          maxWidth = Math.max(maxWidth, textWidth + 24);
        }
      });
      const newWidth = Math.max(
        col.minWidth,
        Math.min(col.maxWidth, Math.ceil(maxWidth))
      );
      col.width = newWidth;
      console.log(`Auto-fit column ${columnName}: ${newWidth}px (measured: ${Math.ceil(maxWidth)}px)`);
    }
    const filterFlyout = ref({
      visible: false,
      columnName: "",
      position: { x: 0, y: 0 },
      uniqueValues: [],
      mode: "checkbox",
      pattern: ""
    });
    function extractFiltersExceptColumn(filter, excludeColumnName) {
      if (filter === null || filter === void 0) return null;
      if (filter.type === "simple") {
        const simpleFilter = filter;
        return simpleFilter.columnName === excludeColumnName ? null : filter;
      }
      const compositeFilter = filter;
      if (!compositeFilter.left || !compositeFilter.right) {
        console.error("[extractFiltersExceptColumn] Invalid composite filter - missing children:", compositeFilter);
        return null;
      }
      const leftFiltered = extractFiltersExceptColumn(compositeFilter.left, excludeColumnName);
      const rightFiltered = extractFiltersExceptColumn(compositeFilter.right, excludeColumnName);
      if (!leftFiltered && !rightFiltered) return null;
      if (!leftFiltered) return rightFiltered;
      if (!rightFiltered) return leftFiltered;
      return {
        type: "composite",
        left: leftFiltered,
        right: rightFiltered,
        operator: compositeFilter.operator
      };
    }
    function extractSelectedValuesForColumn(filter, columnName) {
      const selectedValues = /* @__PURE__ */ new Set();
      if (filter === null || filter === void 0) return selectedValues;
      function traverse(expr) {
        if (expr.type === "simple") {
          const simpleFilter = expr;
          if (simpleFilter.columnName === columnName && simpleFilter.operator === "Equals") {
            selectedValues.add(String(simpleFilter.value));
          }
        } else {
          const compositeFilter = expr;
          traverse(compositeFilter.left);
          traverse(compositeFilter.right);
        }
      }
      traverse(filter);
      return selectedValues;
    }
    function getUniqueValues(columnName) {
      try {
        console.log(`[getUniqueValues] Starting for column: ${columnName}`);
        if (!store || !store.rows) {
          console.warn(`[getUniqueValues] Store or rows not initialized yet, returning empty array`);
          return [];
        }
        if (columnName === "__checkbox") {
          const filtersExceptThisColumn2 = extractFiltersExceptColumn(store.filterExpression, columnName);
          console.log(`[getUniqueValues] Checkbox - Has filters to apply: ${!!filtersExceptThisColumn2}`);
          const allRows2 = store.rows;
          console.log(`[getUniqueValues] Checkbox - Total rows before filtering: ${allRows2.length}`);
          const filteredRows2 = filtersExceptThisColumn2 ? filterRowsHelper(allRows2, filtersExceptThisColumn2, store) : allRows2;
          console.log(`[getUniqueValues] Checkbox - Total rows after filtering: ${filteredRows2.length}`);
          const sampleSize = Math.min(3, filteredRows2.length);
          for (let i = 0; i < sampleSize; i++) {
            const cell = filteredRows2[i].cells.find((c) => c.columnName === "__checkbox");
            console.log(`[getUniqueValues] Checkbox - Row ${i}: cell=${!!cell}, value=${cell == null ? void 0 : cell.value}, type=${typeof (cell == null ? void 0 : cell.value)}`);
          }
          const trueCount = filteredRows2.filter((row) => {
            return store.isRowChecked(row.rowId);
          }).length;
          const falseCount = filteredRows2.length - trueCount;
          const currentlySelectedValues2 = extractSelectedValuesForColumn(store.filterExpression, columnName);
          console.log(`[getUniqueValues] Checkbox column: true=${trueCount}, false=${falseCount}, selected=${Array.from(currentlySelectedValues2)}`);
          return [
            {
              value: "true",
              isSelected: currentlySelectedValues2.has("true"),
              count: trueCount,
              displayText: `☑ Checked (${trueCount})`
            },
            {
              value: "false",
              isSelected: currentlySelectedValues2.has("false"),
              count: falseCount,
              displayText: `☐ Unchecked (${falseCount})`
            }
          ];
        }
        const valueMap = /* @__PURE__ */ new Map();
        const filtersExceptThisColumn = extractFiltersExceptColumn(store.filterExpression, columnName);
        console.log(`[getUniqueValues] Has filters to apply for '${columnName}': ${!!filtersExceptThisColumn}`);
        const allRows = store.rows;
        const filteredRows = filtersExceptThisColumn ? filterRowsHelper(allRows, filtersExceptThisColumn, store) : allRows;
        console.log(`[getUniqueValues] Column=${columnName}, AllRows=${allRows.length}, FilteredRows=${filteredRows.length}`);
        filteredRows.forEach((row) => {
          var _a2;
          const cell = row.cells.find((c) => c.columnName === columnName);
          const value = ((_a2 = cell == null ? void 0 : cell.value) == null ? void 0 : _a2.toString()) ?? "";
          valueMap.set(value, (valueMap.get(value) || 0) + 1);
        });
        const currentlySelectedValues = extractSelectedValuesForColumn(store.filterExpression, columnName);
        console.log(`[getUniqueValues] Column=${columnName}, UniqueValues=${valueMap.size}, SelectedValues=${currentlySelectedValues.size}`);
        const result = Array.from(valueMap.entries()).map(([value, count]) => {
          const displayValue = value === "" ? "(Empty)" : value;
          return {
            value,
            isSelected: currentlySelectedValues.has(value),
            // ✅ Mark checkbox based on current filter
            count,
            displayText: `${displayValue} (${count})`
          };
        }).sort((a, b) => {
          if (a.value === "" && b.value !== "") return 1;
          if (a.value !== "" && b.value === "") return -1;
          return a.value.localeCompare(b.value);
        });
        console.log(`[getUniqueValues] Returning ${result.length} unique values`);
        return result;
      } catch (error) {
        console.error(`[getUniqueValues] ERROR for column '${columnName}':`, error);
        console.error(`[getUniqueValues] Filter expression at time of error:`, store.filterExpression);
        console.error(`[getUniqueValues] Stack trace:`, error instanceof Error ? error.stack : "No stack trace");
        return [];
      }
    }
    function handleShowFilter(columnName) {
      try {
        console.log(`[handleShowFilter] START for column: ${columnName}`);
        if (!isGridReady.value) {
          console.error(`[handleShowFilter] Grid not ready yet`);
          alert("Please wait for the grid to finish loading before opening filters.");
          return;
        }
        if (isProcessing2.value) {
          console.error(`[handleShowFilter] Grid is currently processing data`);
          alert("Please wait while data is being processed...");
          return;
        }
        const column = dataColumns.value.find((c) => c.name === columnName);
        if (!column) {
          console.error(`[handleShowFilter] Column not found: ${columnName}`);
          return;
        }
        if (!column.isFilterable) {
          console.warn(`[handleShowFilter] Column '${columnName}' is not filterable`);
          return;
        }
        if (column.visibleForGrid === false) {
          console.warn(`[handleShowFilter] Column '${columnName}' has visibleForGrid=false, filtering not allowed`);
          return;
        }
        if (!store || !store.rows || store.rows.length === 0) {
          console.error(`[handleShowFilter] Store not initialized or no data`);
          alert("Please load data before opening filters.");
          return;
        }
        const uniqueValues = getUniqueValues(columnName);
        console.log(`[handleShowFilter] Got ${uniqueValues.length} unique values`);
        const position = {
          x: window.innerWidth / 2 - 200,
          // 200 is roughly half the flyout width
          y: window.innerHeight / 2 - 300
          // 300 is roughly half the flyout height
        };
        filterFlyout.value = {
          visible: true,
          columnName,
          position,
          uniqueValues,
          mode: "checkbox",
          pattern: ""
        };
        console.log(`[handleShowFilter] Filter flyout opened successfully`);
      } catch (error) {
        console.error(`[handleShowFilter] CRITICAL ERROR for column '${columnName}':`, error);
        console.error(`[handleShowFilter] Stack trace:`, error instanceof Error ? error.stack : "No stack trace");
        alert(`Error opening filter for column '${columnName}': ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    function closeFilterFlyout() {
      filterFlyout.value.visible = false;
    }
    function extractColumnFilters(filter) {
      const columnFilters = /* @__PURE__ */ new Map();
      function traverse(expr, isAndContext) {
        if (expr.type === "simple") {
          const simple = expr;
          if (isAndContext) {
            columnFilters.set(simple.columnName, expr);
          }
          return simple.columnName;
        } else {
          const composite = expr;
          if (composite.operator === "AND") {
            traverse(composite.left, true);
            traverse(composite.right, true);
            return null;
          } else {
            const leftCol = traverse(composite.left, false);
            const rightCol = traverse(composite.right, false);
            const columnName = leftCol || rightCol;
            if (columnName && isAndContext) {
              columnFilters.set(columnName, expr);
            }
            return columnName;
          }
        }
      }
      if (filter) {
        traverse(filter, true);
      }
      return columnFilters;
    }
    function combineFiltersWithAnd(filters) {
      const validFilters = filters.filter((f) => f != null);
      if (validFilters.length === 0) return null;
      if (validFilters.length === 1) return validFilters[0];
      let result = validFilters[0];
      for (let i = 1; i < validFilters.length; i++) {
        result = {
          type: "composite",
          left: result,
          right: validFilters[i],
          operator: "AND"
        };
      }
      return result;
    }
    function combineWithExistingFilters(newColumnFilter, columnName) {
      const currentFilter = store.filterExpression;
      const columnFilters = extractColumnFilters(currentFilter);
      columnFilters.set(columnName, newColumnFilter);
      const allFilters = Array.from(columnFilters.values());
      return combineFiltersWithAnd(allFilters) || newColumnFilter;
    }
    function handleApplyCheckboxFilter(selectedValues) {
      const columnName = filterFlyout.value.columnName;
      if (selectedValues.length === 0) {
        const columnFilters = extractColumnFilters(store.filterExpression);
        columnFilters.delete(columnName);
        if (columnFilters.size === 0) {
          store.clearFilter();
        } else {
          const allFilters = Array.from(columnFilters.values());
          const combinedFilter = combineFiltersWithAnd(allFilters);
          store.setFilter(combinedFilter);
        }
      } else {
        const filterValues = columnName === "__checkbox" ? selectedValues.map((v) => v === "true") : selectedValues;
        let newColumnFilter;
        if (filterValues.length === 1) {
          newColumnFilter = {
            type: "simple",
            columnName,
            operator: "Equals",
            value: filterValues[0]
          };
        } else {
          newColumnFilter = {
            type: "simple",
            columnName,
            operator: "Equals",
            value: filterValues[0]
          };
          for (let i = 1; i < filterValues.length; i++) {
            newColumnFilter = {
              type: "composite",
              left: newColumnFilter,
              right: {
                type: "simple",
                columnName,
                operator: "Equals",
                value: filterValues[i]
              },
              operator: "OR"
            };
          }
        }
        const combinedFilter = combineWithExistingFilters(newColumnFilter, columnName);
        store.setFilter(combinedFilter);
      }
      console.log(`Applied checkbox filter to ${columnName}:`, selectedValues, "Final filter:", store.filterExpression);
    }
    function handleApplyRegexFilter(pattern) {
      const columnName = filterFlyout.value.columnName;
      if (!pattern) {
        const columnFilters = extractColumnFilters(store.filterExpression);
        columnFilters.delete(columnName);
        if (columnFilters.size === 0) {
          store.clearFilter();
        } else {
          const allFilters = Array.from(columnFilters.values());
          const combinedFilter2 = combineFiltersWithAnd(allFilters);
          store.setFilter(combinedFilter2);
        }
        return;
      }
      const newColumnFilter = {
        type: "simple",
        columnName,
        operator: "Contains",
        value: pattern
      };
      const combinedFilter = combineWithExistingFilters(newColumnFilter, columnName);
      store.setFilter(combinedFilter);
      console.log(`Applied text contains filter to ${columnName}:`, pattern, "Final filter:", store.filterExpression);
    }
    function handleClearFilter() {
      const columnName = filterFlyout.value.columnName;
      const columnFilters = extractColumnFilters(store.filterExpression);
      columnFilters.delete(columnName);
      if (columnFilters.size === 0) {
        store.clearFilter();
      } else {
        const allFilters = Array.from(columnFilters.values());
        const combinedFilter = combineFiltersWithAnd(allFilters);
        store.setFilter(combinedFilter);
      }
      console.log(`Cleared filter for ${columnName}`, "Final filter:", store.filterExpression);
    }
    async function toggleAutoRowHeight() {
      try {
        console.log("[toggleAutoRowHeight] ========== FUNCTION CALLED ==========");
        console.log(`[toggleAutoRowHeight] Current state: ${store.isAutoRowHeightEnabled}`);
        console.log("[toggleAutoRowHeight] Rows BEFORE:", store.rows.slice(0, 5).map((r) => ({ id: r.rowId, height: r.height })));
        const newValue = !store.isAutoRowHeightEnabled;
        console.log(`[toggleAutoRowHeight] New state will be: ${newValue}`);
        store.setAutoRowHeightEnabled(newValue);
        console.log("[toggleAutoRowHeight] Store updated");
        if (newValue) {
          console.log("[toggleAutoRowHeight] Enabled - applying heights to all rows...");
          await applyAutoRowHeightToAll();
          console.log("[toggleAutoRowHeight] Heights applied successfully");
        } else {
          console.log("[toggleAutoRowHeight] Disabled - resetting all row heights...");
          await resetAllRowHeights();
          console.log("[toggleAutoRowHeight] Heights reset successfully");
        }
        console.log("[toggleAutoRowHeight] Rows AFTER:", store.rows.slice(0, 5).map((r) => ({ id: r.rowId, height: r.height })));
        console.log("[toggleAutoRowHeight] ========== FUNCTION COMPLETED ==========");
      } catch (error) {
        console.log(`[toggleAutoRowHeight] ❌ ERROR: ${error}`);
        console.log(`[toggleAutoRowHeight] Error stack: ${error instanceof Error ? error.stack : "N/A"}`);
      }
    }
    async function applyAutoRowHeightToAll() {
      const columnsForMeasurement = allColumns.value.filter((col) => !col.specialType || col.specialType !== "ValidationAlerts").map((col) => ({
        name: col.name,
        width: col.width,
        specialType: col.specialType
      }));
      console.log("[applyAutoRowHeightToAll] ========== START ==========");
      console.log("[applyAutoRowHeightToAll] AutoRowHeight is ON");
      const heightsBefore = store.rows.map((r) => ({ rowId: r.rowId, heightBefore: r.height }));
      console.log("[applyAutoRowHeightToAll] BEFORE - All row heights:", heightsBefore.slice(0, 10));
      console.log("[applyAutoRowHeightToAll] Measuring columns:", columnsForMeasurement.map((c) => `${c.name} (${c.width}px, special: ${c.specialType || "none"})`).join(", "));
      const result = await autoRowHeight.applyAutoRowHeight(store.rows, columnsForMeasurement);
      const heightsAfter = store.rows.map((r, i) => ({
        rowId: r.rowId,
        heightBefore: heightsBefore[i].heightBefore,
        heightAfter: r.height,
        changed: heightsBefore[i].heightBefore !== r.height
      }));
      console.log("[applyAutoRowHeightToAll] AFTER - All row heights (first 10):", heightsAfter.slice(0, 10));
      console.log("[applyAutoRowHeightToAll] Changed rows:", heightsAfter.filter((h2) => h2.changed).length);
      console.log(`[applyAutoRowHeightToAll] Summary: ${result.totalRowsUpdated} rows updated, average height: ${result.averageHeight.toFixed(1)}px`);
      await nextTick();
      console.log("[applyAutoRowHeightToAll] First nextTick complete");
      await nextTick();
      console.log("[applyAutoRowHeightToAll] Second nextTick complete");
      await nextTick();
      console.log("[applyAutoRowHeightToAll] Third nextTick complete");
      await new Promise((resolve) => setTimeout(resolve, 50));
      console.log("[applyAutoRowHeightToAll] Delay complete, calling forceUpdate...");
      if (scrollerRef.value) {
        scrollerRef.value.forceUpdate();
        console.log("[applyAutoRowHeightToAll] DynamicScroller forceUpdate() called");
      } else {
        console.log("[applyAutoRowHeightToAll] ERROR: scrollerRef is null, cannot forceUpdate");
      }
      console.log("[applyAutoRowHeightToAll] ========== COMPLETE ==========");
    }
    async function resetAllRowHeights() {
      console.log("[resetAllRowHeights] START - AutoRowHeight is OFF, resetting to default height");
      let rowsProcessed = 0;
      const defaultHeight = 32;
      store.rows.forEach((row) => {
        row.height = defaultHeight;
        rowsProcessed++;
      });
      console.log("[resetAllRowHeights] Summary:", {
        totalRows: rowsProcessed,
        resetToHeight: defaultHeight
      });
      console.log("[resetAllRowHeights] All row heights reset to default");
      await nextTick();
      console.log("[resetAllRowHeights] First nextTick complete");
      await nextTick();
      console.log("[resetAllRowHeights] Second nextTick complete");
      await nextTick();
      console.log("[resetAllRowHeights] Third nextTick complete");
      await new Promise((resolve) => setTimeout(resolve, 50));
      console.log("[resetAllRowHeights] Delay complete, calling forceUpdate...");
      if (scrollerRef.value) {
        scrollerRef.value.forceUpdate();
        console.log("[resetAllRowHeights] DynamicScroller forceUpdate() called");
      } else {
        console.log("[resetAllRowHeights] ERROR: scrollerRef is null, cannot forceUpdate");
      }
      console.log("[resetAllRowHeights] COMPLETE");
    }
    async function recalculateRowHeightAfterEdit(rowId) {
      if (!store.isAutoRowHeightEnabled) return;
      const columnsForMeasurement = allColumns.value.filter((col) => !col.specialType || col.specialType !== "ValidationAlerts").map((col) => ({
        name: col.name,
        width: col.width,
        specialType: col.specialType
      }));
      const row = store.rows.find((r) => r.rowId === rowId);
      if (!row) return;
      const updatedCount = autoRowHeight.recalculateRows(store.rows, [rowId], columnsForMeasurement);
      if (updatedCount > 0 && row) {
        store.updateRowHeight(rowId, row.height);
        await nextTick();
      }
    }
    async function recalculateRowHeightForNewlines(rowId) {
      const row = store.rows.find((r) => r.rowId === rowId);
      if (!row) return;
      let maxLines = 1;
      for (const cell of row.cells) {
        if (cell.value == null) continue;
        const textValue = String(cell.value);
        if (textValue.includes("\n")) {
          const lines = textValue.split("\n").length;
          maxLines = Math.max(maxLines, lines);
        }
      }
      const lineHeight = 21;
      const verticalPadding = 10;
      const calculatedHeight = maxLines * lineHeight + verticalPadding;
      store.updateRowHeight(rowId, calculatedHeight);
      await nextTick();
    }
    async function checkBackendConnection() {
      logger.debug("🔌 Checking backend connection...");
      try {
        isBackendConnected.value = await gridApi.healthCheck();
        if (isBackendConnected.value) {
          logger.info("✅ Backend connected");
        } else {
          logger.warn("⚠️ Backend disconnected");
        }
      } catch (error) {
        logger.error("❌ Backend connection check failed", {
          error: (error == null ? void 0 : error.message) || (error == null ? void 0 : error.toString()) || "Unknown error",
          stack: error == null ? void 0 : error.stack
        });
        isBackendConnected.value = false;
      }
    }
    async function loadDataFromBackendOriginal() {
      var _a2, _b, _c;
      console.log("[loadDataFromBackend] 🔵 START");
      if (isProcessing2.value) {
        console.log("[loadDataFromBackend] ⚠️ Already processing, skipping");
        return;
      }
      isLoadingFromBackend.value = true;
      isProcessing2.value = true;
      loadingState.value = {
        isLoading: true,
        operation: "Loading data from backend...",
        progress: 0,
        total: 0,
        percentage: 0
      };
      console.info("═══════════════════════════════════════════════════");
      console.info("📥 DATA LOADING START");
      console.info("═══════════════════════════════════════════════════");
      try {
        console.log("[loadDataFromBackend] Calling gridApi.getData()...");
        const response = await gridApi.getData();
        console.log("[loadDataFromBackend] Response received:", {
          success: response.success,
          dataLength: (_a2 = response.data) == null ? void 0 : _a2.length,
          hasError: !!response.error
        });
        if (response.success && response.data) {
          loadingState.value.operation = "Processing data...";
          loadingState.value.total = response.data.length;
          console.log("[loadDataFromBackend] Converting data format...");
          const rows = response.data.map((row, index2) => ({
            __rowId: row.RowId || `row-${Date.now()}-${index2}`,
            __rowHeight: row.RowHeight || 40,
            __checkbox: row.Checkbox,
            ...row.Data
            // Spread Data dictionary to root level
          }));
          console.log("[loadDataFromBackend] Converted rows:", rows.length);
          loadingState.value.progress = rows.length;
          loadingState.value.percentage = 100;
          console.log("[loadDataFromBackend] Calling clearValidationTracking()...");
          store.clearValidationTracking();
          console.log("[loadDataFromBackend] Calling store.loadRows()...");
          store.loadRows(rows);
          console.log(`[loadDataFromBackend] ✅ Loaded ${rows.length} rows from backend`);
          loadingState.value.operation = "Data loaded successfully";
          console.info("═══════════════════════════════════════════════════");
          console.info(`✅ DATA LOADING SUCCESS - ${rows.length} rows loaded`);
          console.info("═══════════════════════════════════════════════════");
          if (store.config.autoValidate && store.config.enableValidation) {
            const rulesCount = ((_c = (_b = validation == null ? void 0 : validation.validationRules) == null ? void 0 : _b.value) == null ? void 0 : _c.size) || 0;
            console.log("[loadDataFromBackend] Auto-validation check:", {
              autoValidate: store.config.autoValidate,
              enableValidation: store.config.enableValidation,
              rulesCount
            });
            if (rulesCount > 0) {
              console.log("[loadDataFromBackend] Starting auto-validation...");
              await nextTick();
              console.log("[loadDataFromBackend] First nextTick done - rows mounted");
              await nextTick();
              console.log("[loadDataFromBackend] Second nextTick done - scroller ready");
              await new Promise((resolve) => setTimeout(resolve, 50));
              console.log("[loadDataFromBackend] Delay done - starting validation");
              await validateAllCellsInBatches();
              console.log("[loadDataFromBackend] ✅ Auto-validation complete");
            } else {
              console.log("[loadDataFromBackend] ⚠️ Skipping validation - no rules defined yet");
            }
          } else {
            console.log("[loadDataFromBackend] ⚠️ Auto-validation disabled in config");
          }
        } else {
          console.error("═══════════════════════════════════════════════════");
          console.error("❌ DATA LOADING ERROR:", response.error);
          console.error("═══════════════════════════════════════════════════");
          alert(`Failed to load data: ${response.error}`);
        }
      } catch (error) {
        console.error("═══════════════════════════════════════════════════");
        console.error("💥 DATA LOADING FATAL EXCEPTION:", error);
        console.error("═══════════════════════════════════════════════════");
        alert(`Error loading data: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        isLoadingFromBackend.value = false;
        isProcessing2.value = false;
        loadingState.value.isLoading = false;
        console.log("[loadDataFromBackend] 🔵 END");
      }
    }
    const loadDataFromBackend = useDebounceFn(loadDataFromBackendOriginal, 1e3, {
      maxWait: 2e3
    });
    async function saveDataToBackend() {
      isSavingToBackend.value = true;
      try {
        const visibleDataColumns = dataColumns.value.filter(
          (col) => !col.specialType && col.visibleForGrid !== false
        );
        const data = [];
        let skippedEmptyRows = 0;
        for (const row of store.rows) {
          const hasVisibleData = visibleDataColumns.some((col) => {
            const cell = row.cells.find((c) => c.columnName === col.name);
            const value = cell == null ? void 0 : cell.value;
            return value !== null && value !== void 0 && value !== "";
          });
          if (!hasVisibleData) {
            skippedEmptyRows++;
            continue;
          }
          const rowData = {};
          dataColumns.value.forEach((col) => {
            if (!col.specialType) {
              const cell = row.cells.find((c) => c.columnName === col.name);
              if (cell) {
                rowData[col.name] = cell.value;
              }
            }
          });
          data.push(rowData);
        }
        console.log("[saveDataToBackend] 📦 Data prepared:", {
          totalRows: store.rows.length,
          savedRows: data.length,
          skippedEmptyRows,
          filterRate: `${Math.round(skippedEmptyRows / store.rows.length * 100)}%`
        });
        const response = await gridApi.importData(data);
        if (response.success) {
          console.log(`✅ Saved ${data.length} rows to backend`);
        } else {
          console.error("❌ Failed to save data to backend:", response.error);
          alert(`Failed to save data: ${response.error}`);
        }
      } catch (error) {
        console.error("Error saving data to backend:", error);
        alert(`Error saving data: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        isSavingToBackend.value = false;
      }
    }
    const mergedTheme = computed(() => {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      return {
        ...defaultDataGridTheme,
        cellColors: { ...defaultDataGridTheme.cellColors, ...((_a2 = props2.theme) == null ? void 0 : _a2.cellColors) || {} },
        rowColors: { ...defaultDataGridTheme.rowColors, ...((_b = props2.theme) == null ? void 0 : _b.rowColors) || {} },
        headerColors: { ...defaultDataGridTheme.headerColors, ...((_c = props2.theme) == null ? void 0 : _c.headerColors) || {} },
        validationColors: { ...defaultDataGridTheme.validationColors, ...((_d = props2.theme) == null ? void 0 : _d.validationColors) || {} },
        selectionColors: { ...defaultDataGridTheme.selectionColors, ...((_e = props2.theme) == null ? void 0 : _e.selectionColors) || {} },
        borderColors: { ...defaultDataGridTheme.borderColors, ...((_f = props2.theme) == null ? void 0 : _f.borderColors) || {} },
        specialColumnColors: { ...defaultDataGridTheme.specialColumnColors, ...((_g = props2.theme) == null ? void 0 : _g.specialColumnColors) || {} },
        uiControlColors: { ...defaultDataGridTheme.uiControlColors, ...((_h = props2.theme) == null ? void 0 : _h.uiControlColors) || {} }
      };
    });
    const cssVariables = computed(() => {
      const themeVars = generateDataGridCSSVariables(mergedTheme.value);
      return {
        ...themeVars,
        "--dg-min-table-width": props2.minTableWidth ? `${props2.minTableWidth}px` : "fit-content",
        width: props2.width || "100%",
        height: props2.height || "600px"
      };
    });
    const enhancedValidation = {
      ...validation,
      /**
       * Validates only cells that need validation (changed or unvalidated)
       * Returns true if all non-empty cells are valid
       * Respects autoValidate config
       */
      async validateRequired() {
        if (!store.config.enableValidation) {
          return true;
        }
        const cellsToValidate = store.getCellsNeedingValidation();
        if (cellsToValidate.length === 0) {
          return store.areNonEmptyRowsValid();
        }
        for (const { rowId, columnName } of cellsToValidate) {
          const row = store.rows.find((r) => r.rowId === rowId);
          if (!row) continue;
          const cell = row.cells.find((c) => c.columnName === columnName);
          if (!cell) continue;
          await validation.validateCell(rowId, columnName, cell.value);
          store.markCellValidated(rowId, columnName);
        }
        return store.areNonEmptyRowsValid();
      },
      /**
       * Checks if all non-empty rows are valid (without running validation)
       * Returns true if valid, false if there are errors
       */
      isAllValid() {
        return store.areNonEmptyRowsValid();
      },
      /**
       * Forces validation of all cells regardless of tracking
       * Returns true if all non-empty cells are valid
       */
      async validateAll(rows) {
        if (!store.config.enableValidation) {
          return { isValid: true, totalErrors: 0 };
        }
        const result = await validation.validateAll(rows || store.rows);
        store.clearValidationTracking();
        for (const row of store.rows) {
          for (const cell of row.cells) {
            store.markCellValidated(cell.rowId, cell.columnName);
          }
        }
        return result;
      }
    };
    __expose({
      loadDataFromBackend,
      validation: enhancedValidation,
      copyPaste,
      shortcuts,
      handleCopy,
      handlePaste,
      handleCut
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "data-grid",
        style: normalizeStyle(cssVariables.value)
      }, [
        isProcessing2.value ? (openBlock(), createElementBlock("div", _hoisted_1$3, [
          createElementVNode("div", _hoisted_2$3, [
            _cache[1] || (_cache[1] = createElementVNode("div", { class: "processing-spinner" }, null, -1)),
            createElementVNode("div", _hoisted_3$3, "Processing " + toDisplayString(unref(store).rows.length) + " rows...", 1),
            validationProgress.value.isValidating ? (openBlock(), createElementBlock("div", _hoisted_4$3, [
              createElementVNode("div", _hoisted_5$3, [
                createElementVNode("div", {
                  class: "progress-bar",
                  style: normalizeStyle({ width: validationProgress.value.percentage + "%" })
                }, null, 4)
              ]),
              createElementVNode("div", _hoisted_6$2, toDisplayString(validationProgress.value.current) + " / " + toDisplayString(validationProgress.value.total) + " cells validated (" + toDisplayString(validationProgress.value.percentage) + "%) ", 1)
            ])) : createCommentVNode("", true)
          ])
        ])) : createCommentVNode("", true),
        loadingState.value.isLoading ? (openBlock(), createElementBlock("div", _hoisted_7$2, [
          createElementVNode("div", _hoisted_8$2, [
            _cache[2] || (_cache[2] = createElementVNode("div", { class: "loading-spinner" }, null, -1)),
            createElementVNode("div", _hoisted_9$2, toDisplayString(loadingState.value.operation), 1),
            loadingState.value.total > 0 ? (openBlock(), createElementBlock("div", _hoisted_10$2, [
              createElementVNode("div", _hoisted_11$2, [
                createElementVNode("div", {
                  class: "progress-bar",
                  style: normalizeStyle({ width: loadingState.value.percentage + "%" })
                }, null, 4)
              ]),
              createElementVNode("div", _hoisted_12$2, toDisplayString(loadingState.value.progress) + " / " + toDisplayString(loadingState.value.total) + " (" + toDisplayString(loadingState.value.percentage) + "%) ", 1)
            ])) : createCommentVNode("", true)
          ])
        ])) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_13$2, [
          createElementVNode("div", _hoisted_14$2, [
            createElementVNode("button", {
              class: normalizeClass(["toolbar-button", { "toolbar-button--active": unref(store).isAutoRowHeightEnabled }]),
              onClick: toggleAutoRowHeight,
              title: unref(store).isAutoRowHeightEnabled ? "Disable auto row height" : "Enable auto row height"
            }, " 📏 Auto Height " + toDisplayString(unref(store).isAutoRowHeightEnabled ? "ON" : "OFF"), 11, _hoisted_15$1)
          ]),
          createElementVNode("div", _hoisted_16$1, [
            createElementVNode("button", {
              class: normalizeClass(["toolbar-button", { "toolbar-button--disabled": !isBackendConnected.value }]),
              disabled: isLoadingFromBackend.value || !isBackendConnected.value,
              onClick: _cache[0] || (_cache[0] = //@ts-ignore
              (...args) => unref(loadDataFromBackend) && unref(loadDataFromBackend)(...args)),
              title: "Load data from backend"
            }, toDisplayString(isLoadingFromBackend.value ? "⏳ Loading..." : "⬇️ Load from Backend"), 11, _hoisted_17),
            createElementVNode("button", {
              class: normalizeClass(["toolbar-button", { "toolbar-button--disabled": !isBackendConnected.value }]),
              disabled: isSavingToBackend.value || !isBackendConnected.value,
              onClick: saveDataToBackend,
              title: "Save data to backend"
            }, toDisplayString(isSavingToBackend.value ? "⏳ Saving..." : "⬆️ Save to Backend"), 11, _hoisted_18),
            createElementVNode("span", {
              class: normalizeClass(["connection-status", { "connection-status--connected": isBackendConnected.value, "connection-status--disconnected": !isBackendConnected.value }]),
              onClick: checkBackendConnection,
              title: "Click to refresh connection status"
            }, toDisplayString(isBackendConnected.value ? "🟢 Connected" : "🔴 Disconnected"), 3)
          ])
        ]),
        __props.showHiddenColumnsPanel !== false && hiddenColumns.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_19, [
          _cache[3] || (_cache[3] = createElementVNode("span", { class: "hidden-columns-label" }, "Hidden columns:", -1)),
          (openBlock(true), createElementBlock(Fragment, null, renderList(hiddenColumns.value, (col) => {
            return openBlock(), createElementBlock("button", {
              key: col.name,
              class: "show-column-button",
              onClick: ($event) => showColumn(col.name),
              title: `Show column: ${col.header}`
            }, toDisplayString(col.header), 9, _hoisted_20);
          }), 128)),
          createElementVNode("button", {
            class: "show-all-button",
            onClick: showAllColumns,
            title: "Show all columns"
          }, " Show All ")
        ])) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_21, [
          createVNode(DataGridHeader, {
            columns: allColumns.value,
            "grid-template-columns": gridTemplateColumns.value,
            "grid-id": unref(instanceId),
            "is-grid-ready": isGridReady.value,
            "is-processing": isProcessing2.value,
            "show-hidden-columns-panel": __props.showHiddenColumnsPanel,
            onSort: handleSort,
            onResize: handleResize,
            onHideColumn: handleHideColumn,
            onAutoFitColumn: handleAutoFitColumn,
            onShowFilter: handleShowFilter
          }, null, 8, ["columns", "grid-template-columns", "grid-id", "is-grid-ready", "is-processing", "show-hidden-columns-panel"]),
          createVNode(unref(script$1), {
            ref_key: "scrollerRef",
            ref: scrollerRef,
            items: visibleRows.value,
            "min-item-size": 40,
            buffer: 200,
            "key-field": "rowId",
            class: "scroller"
          }, {
            default: withCtx(({ item, index: index2, active }) => [
              createVNode(unref(script), {
                item,
                active,
                "size-dependencies": [item.height, item.cells.length, item.validationErrorCount],
                "data-index": index2
              }, {
                default: withCtx(() => [
                  createVNode(DataGridRow, {
                    row: item,
                    columns: allColumns.value,
                    "grid-template-columns": gridTemplateColumns.value,
                    "grid-id": unref(instanceId),
                    onCellEditComplete: handleCellEditComplete,
                    onCellInput: handleCellInput,
                    onCheckboxChange: handleCheckboxChange,
                    onDeleteRow: handleDeleteRow,
                    onInsertRow: handleInsertRow,
                    onInsertAbove: handleInsertAbove,
                    onInsertBelow: handleInsertBelow
                  }, null, 8, ["row", "columns", "grid-template-columns", "grid-id"])
                ]),
                _: 2
              }, 1032, ["item", "active", "size-dependencies", "data-index"])
            ]),
            _: 1
          }, 8, ["items"])
        ]),
        createVNode(PaginationControl, {
          "page-size": unref(store).pageSize,
          "page-size-options": unref(store).config.pageSizeOptions,
          "total-rows": unref(store).totalRows,
          "current-page": unref(store).currentPage,
          onPageChange: unref(store).goToPage,
          onPageSizeChange: unref(store).setPageSize
        }, null, 8, ["page-size", "page-size-options", "total-rows", "current-page", "onPageChange", "onPageSizeChange"]),
        createVNode(FilterFlyout, {
          visible: filterFlyout.value.visible,
          "column-name": filterFlyout.value.columnName,
          position: filterFlyout.value.position,
          "unique-values": filterFlyout.value.uniqueValues,
          "current-mode": filterFlyout.value.mode,
          "current-pattern": filterFlyout.value.pattern,
          onClose: closeFilterFlyout,
          onApplyCheckbox: handleApplyCheckboxFilter,
          onApplyRegex: handleApplyRegexFilter,
          onClearFilter: handleClearFilter
        }, null, 8, ["visible", "column-name", "position", "unique-values", "current-mode", "current-pattern"])
      ], 4);
    };
  }
});
const DataGrid = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-a910b5e3"]]);
const _hoisted_1$2 = { class: "listbox-container" };
const _hoisted_2$2 = {
  key: 0,
  class: "listbox-title"
};
const _hoisted_3$2 = ["onClick", "onMouseenter"];
const _hoisted_4$2 = ["checked", "onClick"];
const _hoisted_5$2 = { class: "listbox-item-text" };
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ListBox",
  props: {
    items: {},
    title: { default: "" },
    multiSelect: { type: Boolean, default: false },
    preSelected: { default: () => [] },
    height: { default: 200 },
    width: { default: 250 },
    theme: {}
  },
  emits: ["selectionChange"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props2 = __props;
    const emit = __emit;
    const selectedValues = ref(/* @__PURE__ */ new Set());
    const hoveredValue = ref(null);
    watch(() => props2.preSelected, (newPreSelected) => {
      selectedValues.value = new Set(newPreSelected);
    }, { immediate: true });
    const mergedTheme = computed(() => {
      var _a, _b, _c, _d;
      return {
        ...defaultListBoxTheme,
        itemColors: { ...defaultListBoxTheme.itemColors, ...((_a = props2.theme) == null ? void 0 : _a.itemColors) || {} },
        containerColors: { ...defaultListBoxTheme.containerColors, ...((_b = props2.theme) == null ? void 0 : _b.containerColors) || {} },
        checkboxColors: { ...defaultListBoxTheme.checkboxColors, ...((_c = props2.theme) == null ? void 0 : _c.checkboxColors) || {} },
        scrollbarColors: { ...defaultListBoxTheme.scrollbarColors, ...((_d = props2.theme) == null ? void 0 : _d.scrollbarColors) || {} }
      };
    });
    const cssVariables = computed(() => generateListBoxCSSVariables(mergedTheme.value));
    const listboxStyle = computed(() => ({
      height: `${props2.height}px`,
      width: `${props2.width}px`,
      ...cssVariables.value
    }));
    function isSelected(value) {
      return selectedValues.value.has(value);
    }
    function handleItemClick(item) {
      if (props2.multiSelect) {
        if (selectedValues.value.has(item.value)) {
          selectedValues.value.delete(item.value);
        } else {
          selectedValues.value.add(item.value);
        }
      } else {
        selectedValues.value.clear();
        selectedValues.value.add(item.value);
      }
      emit("selectionChange", Array.from(selectedValues.value));
    }
    __expose({
      getSelectedValues: () => Array.from(selectedValues.value),
      clearSelection: () => {
        selectedValues.value.clear();
        emit("selectionChange", []);
      },
      selectValue: (value) => {
        if (props2.multiSelect) {
          selectedValues.value.add(value);
        } else {
          selectedValues.value.clear();
          selectedValues.value.add(value);
        }
        emit("selectionChange", Array.from(selectedValues.value));
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        __props.title ? (openBlock(), createElementBlock("div", _hoisted_2$2, toDisplayString(__props.title), 1)) : createCommentVNode("", true),
        createElementVNode("div", {
          class: normalizeClass(["listbox", { "listbox--multi": __props.multiSelect }]),
          style: normalizeStyle(listboxStyle.value)
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item) => {
            return openBlock(), createElementBlock("div", {
              key: item.value,
              class: normalizeClass(["listbox-item", {
                "listbox-item--selected": isSelected(item.value),
                "listbox-item--hover": hoveredValue.value === item.value
              }]),
              onClick: ($event) => handleItemClick(item),
              onMouseenter: ($event) => hoveredValue.value = item.value,
              onMouseleave: _cache[0] || (_cache[0] = ($event) => hoveredValue.value = null)
            }, [
              __props.multiSelect ? (openBlock(), createElementBlock("input", {
                key: 0,
                type: "checkbox",
                checked: isSelected(item.value),
                class: "listbox-checkbox",
                onClick: withModifiers(($event) => handleItemClick(item), ["stop"])
              }, null, 8, _hoisted_4$2)) : createCommentVNode("", true),
              createElementVNode("span", _hoisted_5$2, toDisplayString(item.name), 1)
            ], 42, _hoisted_3$2);
          }), 128))
        ], 6)
      ]);
    };
  }
});
const ListBox = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-3a870de9"]]);
const _hoisted_1$1 = { class: "search-panel__header" };
const _hoisted_2$1 = ["title"];
const _hoisted_3$1 = {
  key: 0,
  class: "search-panel__count"
};
const _hoisted_4$1 = {
  key: 0,
  class: "search-panel__content"
};
const _hoisted_5$1 = { class: "search-panel__row" };
const _hoisted_6$1 = ["disabled"];
const _hoisted_7$1 = { class: "search-panel__options" };
const _hoisted_8$1 = { class: "search-panel__checkbox" };
const _hoisted_9$1 = {
  key: 0,
  class: "search-panel__threshold"
};
const _hoisted_10$1 = {
  key: 0,
  class: "search-panel__results"
};
const _hoisted_11$1 = { class: "search-panel__navigation" };
const _hoisted_12$1 = ["disabled"];
const _hoisted_13$1 = { class: "search-panel__nav-info" };
const _hoisted_14$1 = ["disabled"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SearchPanel",
  props: {
    visible: { type: Boolean },
    gridId: {}
  },
  setup(__props) {
    const props2 = __props;
    const store = useDataGridStore(props2.gridId || "dataGrid")();
    const { searchInRows, goToNextResult, goToPreviousResult, currentResultIndex } = useSearch(toRef(store, "rows"));
    const isCollapsed = ref(false);
    const searchQuery = ref("");
    const searchMode = ref("Contains");
    const caseSensitive = ref(false);
    const fuzzyThreshold = ref(3);
    const debouncedSearch = debounce(() => {
      if (searchQuery.value.trim()) {
        searchInRows(
          searchQuery.value,
          searchMode.value,
          {
            caseSensitive: caseSensitive.value,
            fuzzyThreshold: fuzzyThreshold.value
          }
        );
        store.setSearchQuery(searchQuery.value);
      } else {
        store.clearSearch();
      }
    }, 300);
    function handleSearch() {
      debouncedSearch();
    }
    function handleClearSearch() {
      searchQuery.value = "";
      store.clearSearch();
    }
    function toggleCollapse() {
      isCollapsed.value = !isCollapsed.value;
    }
    function debounce(func, delay) {
      let timeoutId = null;
      return function(...args) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func(...args);
        }, delay);
      };
    }
    return (_ctx, _cache) => {
      var _a, _b;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["search-panel", { "search-panel--collapsed": isCollapsed.value }])
      }, [
        createElementVNode("div", _hoisted_1$1, [
          createElementVNode("button", {
            class: "search-panel__toggle",
            onClick: toggleCollapse,
            title: isCollapsed.value ? "Expand search" : "Collapse search"
          }, toDisplayString(isCollapsed.value ? "▶" : "▼"), 9, _hoisted_2$1),
          _cache[6] || (_cache[6] = createElementVNode("span", { class: "search-panel__title" }, "Search", -1)),
          ((_a = unref(store).searchResults) == null ? void 0 : _a.length) > 0 ? (openBlock(), createElementBlock("span", _hoisted_3$1, toDisplayString(unref(store).searchResults.length) + " result(s) ", 1)) : createCommentVNode("", true)
        ]),
        !isCollapsed.value ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
          createElementVNode("div", _hoisted_5$1, [
            withDirectives(createElementVNode("input", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchQuery.value = $event),
              type: "text",
              class: "search-panel__input",
              placeholder: "Enter search query...",
              onInput: handleSearch
            }, null, 544), [
              [vModelText, searchQuery.value]
            ]),
            withDirectives(createElementVNode("select", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => searchMode.value = $event),
              class: "search-panel__mode-select",
              onChange: handleSearch
            }, [..._cache[7] || (_cache[7] = [
              createStaticVNode('<option value="Exact" data-v-5c4e957c>Exact</option><option value="Contains" data-v-5c4e957c>Contains</option><option value="StartsWith" data-v-5c4e957c>Starts With</option><option value="EndsWith" data-v-5c4e957c>Ends With</option><option value="Regex" data-v-5c4e957c>Regex</option><option value="Fuzzy" data-v-5c4e957c>Fuzzy</option>', 6)
            ])], 544), [
              [vModelSelect, searchMode.value]
            ]),
            createElementVNode("button", {
              class: "search-panel__clear-btn",
              onClick: handleClearSearch,
              disabled: !searchQuery.value,
              title: "Clear search"
            }, " ✕ ", 8, _hoisted_6$1)
          ]),
          createElementVNode("div", _hoisted_7$1, [
            createElementVNode("label", _hoisted_8$1, [
              withDirectives(createElementVNode("input", {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => caseSensitive.value = $event),
                type: "checkbox",
                onChange: handleSearch
              }, null, 544), [
                [vModelCheckbox, caseSensitive.value]
              ]),
              _cache[8] || (_cache[8] = createElementVNode("span", null, "Case sensitive", -1))
            ]),
            searchMode.value === "Fuzzy" ? (openBlock(), createElementBlock("label", _hoisted_9$1, [
              createElementVNode("span", null, "Threshold: " + toDisplayString(fuzzyThreshold.value), 1),
              withDirectives(createElementVNode("input", {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => fuzzyThreshold.value = $event),
                type: "range",
                min: "0",
                max: "10",
                step: "1",
                class: "search-panel__slider",
                onInput: handleSearch
              }, null, 544), [
                [
                  vModelText,
                  fuzzyThreshold.value,
                  void 0,
                  { number: true }
                ]
              ])
            ])) : createCommentVNode("", true)
          ]),
          searchQuery.value && ((_b = unref(store).searchResults) == null ? void 0 : _b.length) > 0 ? (openBlock(), createElementBlock("div", _hoisted_10$1, [
            createElementVNode("div", _hoisted_11$1, [
              createElementVNode("button", {
                class: "search-panel__nav-btn",
                onClick: _cache[4] || (_cache[4] = //@ts-ignore
                (...args) => unref(goToPreviousResult) && unref(goToPreviousResult)(...args)),
                disabled: unref(currentResultIndex) <= 0,
                title: "Previous result"
              }, " ↑ ", 8, _hoisted_12$1),
              createElementVNode("span", _hoisted_13$1, toDisplayString(unref(currentResultIndex) + 1) + " / " + toDisplayString(unref(store).searchResults.length), 1),
              createElementVNode("button", {
                class: "search-panel__nav-btn",
                onClick: _cache[5] || (_cache[5] = //@ts-ignore
                (...args) => unref(goToNextResult) && unref(goToNextResult)(...args)),
                disabled: unref(currentResultIndex) >= unref(store).searchResults.length - 1,
                title: "Next result"
              }, " ↓ ", 8, _hoisted_14$1)
            ])
          ])) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
const SearchPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-5c4e957c"]]);
const _hoisted_1 = { class: "filter-row" };
const _hoisted_2 = { class: "filter-row__header" };
const _hoisted_3 = ["title"];
const _hoisted_4 = {
  key: 0,
  class: "filter-row__count"
};
const _hoisted_5 = {
  key: 0,
  class: "filter-row__content"
};
const _hoisted_6 = { class: "filter-row__filters" };
const _hoisted_7 = ["onUpdate:modelValue"];
const _hoisted_8 = ["value"];
const _hoisted_9 = ["onUpdate:modelValue"];
const _hoisted_10 = ["onUpdate:modelValue"];
const _hoisted_11 = ["onUpdate:modelValue"];
const _hoisted_12 = ["onClick"];
const _hoisted_13 = {
  key: 0,
  class: "filter-row__active"
};
const _hoisted_14 = { class: "filter-row__active-list" };
const _hoisted_15 = { key: 0 };
const _hoisted_16 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FilterRow",
  props: {
    gridId: {}
  },
  setup(__props) {
    const props2 = __props;
    const store = useDataGridStore(props2.gridId || "dataGrid")();
    const isCollapsed = ref(false);
    const columnFilters = ref([
      {
        columnName: "",
        operator: "Contains",
        value: "",
        logicOperator: "AND"
      }
    ]);
    const dataColumns = computed(() => {
      return store.columns.filter((col) => !col.specialType);
    });
    const activeColumnFilters = computed(() => {
      return columnFilters.value.filter((f) => f.columnName && (f.value || ["IsEmpty", "IsNotEmpty"].includes(f.operator)));
    });
    const activeFiltersCount = computed(() => activeColumnFilters.value.length);
    function addFilter() {
      columnFilters.value.push({
        columnName: "",
        operator: "Contains",
        value: "",
        logicOperator: "AND"
      });
    }
    function removeFilter(index2) {
      columnFilters.value.splice(index2, 1);
      if (columnFilters.value.length === 0) {
        addFilter();
      }
      updateFilters();
    }
    function clearAllFilters() {
      columnFilters.value = [
        {
          columnName: "",
          operator: "Contains",
          value: "",
          logicOperator: "AND"
        }
      ];
      store.clearFilter();
    }
    function updateFilters() {
      const active = activeColumnFilters.value;
      if (active.length === 0) {
        store.clearFilter();
        return;
      }
      if (active.length === 1) {
        const f = active[0];
        const simpleFilter = {
          type: "simple",
          columnName: f.columnName,
          operator: f.operator,
          value: f.value
        };
        store.setFilter(simpleFilter);
      } else {
        let filterExpression = {
          type: "simple",
          columnName: active[0].columnName,
          operator: active[0].operator,
          value: active[0].value
        };
        for (let i = 1; i < active.length; i++) {
          const currentFilter = active[i];
          const previousLogicOp = active[i - 1].logicOperator;
          filterExpression = {
            type: "composite",
            operator: previousLogicOp,
            left: filterExpression,
            right: {
              type: "simple",
              columnName: currentFilter.columnName,
              operator: currentFilter.operator,
              value: currentFilter.value
            }
          };
        }
        store.setFilter(filterExpression);
      }
    }
    function toggleCollapse() {
      isCollapsed.value = !isCollapsed.value;
    }
    function getColumnHeader(columnName) {
      const col = store.columns.find((c) => c.name === columnName);
      return (col == null ? void 0 : col.header) || columnName;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createElementVNode("button", {
            class: "filter-row__toggle",
            onClick: toggleCollapse,
            title: isCollapsed.value ? "Expand filters" : "Collapse filters"
          }, toDisplayString(isCollapsed.value ? "▶" : "▼"), 9, _hoisted_3),
          _cache[0] || (_cache[0] = createElementVNode("span", { class: "filter-row__title" }, "Filters", -1)),
          activeFiltersCount.value > 0 ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(activeFiltersCount.value) + " active ", 1)) : createCommentVNode("", true),
          activeFiltersCount.value > 0 ? (openBlock(), createElementBlock("button", {
            key: 1,
            class: "filter-row__clear-all",
            onClick: clearAllFilters,
            title: "Clear all filters"
          }, " Clear All ")) : createCommentVNode("", true)
        ]),
        !isCollapsed.value ? (openBlock(), createElementBlock("div", _hoisted_5, [
          createElementVNode("div", _hoisted_6, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(columnFilters.value, (filter, index2) => {
              return openBlock(), createElementBlock("div", {
                key: index2,
                class: "filter-row__filter-item"
              }, [
                withDirectives(createElementVNode("select", {
                  "onUpdate:modelValue": ($event) => filter.columnName = $event,
                  class: "filter-row__column-select",
                  onChange: updateFilters
                }, [
                  _cache[1] || (_cache[1] = createElementVNode("option", { value: "" }, "Select column...", -1)),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(dataColumns.value, (col, colIndex) => {
                    return openBlock(), createElementBlock("option", {
                      key: `col-${colIndex}`,
                      value: col.name
                    }, toDisplayString(col.header), 9, _hoisted_8);
                  }), 128))
                ], 40, _hoisted_7), [
                  [vModelSelect, filter.columnName]
                ]),
                withDirectives(createElementVNode("select", {
                  "onUpdate:modelValue": ($event) => filter.operator = $event,
                  class: "filter-row__operator-select",
                  onChange: updateFilters
                }, [..._cache[2] || (_cache[2] = [
                  createStaticVNode('<option value="Equals" data-v-ef184647>Equals</option><option value="NotEquals" data-v-ef184647>Not Equals</option><option value="Contains" data-v-ef184647>Contains</option><option value="StartsWith" data-v-ef184647>Starts With</option><option value="EndsWith" data-v-ef184647>Ends With</option><option value="GreaterThan" data-v-ef184647>Greater Than</option><option value="LessThan" data-v-ef184647>Less Than</option><option value="GreaterThanOrEquals" data-v-ef184647>≥</option><option value="LessThanOrEquals" data-v-ef184647>≤</option><option value="IsEmpty" data-v-ef184647>Is Empty</option><option value="IsNotEmpty" data-v-ef184647>Is Not Empty</option>', 11)
                ])], 40, _hoisted_9), [
                  [vModelSelect, filter.operator]
                ]),
                !["IsEmpty", "IsNotEmpty"].includes(filter.operator) ? withDirectives((openBlock(), createElementBlock("input", {
                  key: 0,
                  "onUpdate:modelValue": ($event) => filter.value = $event,
                  type: "text",
                  class: "filter-row__value-input",
                  placeholder: "Filter value...",
                  onInput: updateFilters
                }, null, 40, _hoisted_10)), [
                  [vModelText, filter.value]
                ]) : createCommentVNode("", true),
                index2 < columnFilters.value.length - 1 ? withDirectives((openBlock(), createElementBlock("select", {
                  key: 1,
                  "onUpdate:modelValue": ($event) => filter.logicOperator = $event,
                  class: "filter-row__logic-select",
                  onChange: updateFilters
                }, [..._cache[3] || (_cache[3] = [
                  createElementVNode("option", { value: "AND" }, "AND", -1),
                  createElementVNode("option", { value: "OR" }, "OR", -1)
                ])], 40, _hoisted_11)), [
                  [vModelSelect, filter.logicOperator]
                ]) : createCommentVNode("", true),
                createElementVNode("button", {
                  class: "filter-row__remove-btn",
                  onClick: ($event) => removeFilter(index2),
                  title: "Remove filter"
                }, " ✕ ", 8, _hoisted_12)
              ]);
            }), 128))
          ]),
          createElementVNode("button", {
            class: "filter-row__add-btn",
            onClick: addFilter
          }, " + Add Filter "),
          activeFiltersCount.value > 0 ? (openBlock(), createElementBlock("div", _hoisted_13, [
            _cache[4] || (_cache[4] = createElementVNode("div", { class: "filter-row__active-title" }, "Active filters:", -1)),
            createElementVNode("div", _hoisted_14, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(activeColumnFilters.value, (filter, index2) => {
                return openBlock(), createElementBlock("span", {
                  key: index2,
                  class: "filter-row__active-chip"
                }, [
                  createTextVNode(toDisplayString(getColumnHeader(filter.columnName)) + " ", 1),
                  createElementVNode("strong", null, toDisplayString(filter.operator), 1),
                  filter.value ? (openBlock(), createElementBlock("span", _hoisted_15, '"' + toDisplayString(filter.value) + '"', 1)) : createCommentVNode("", true),
                  createElementVNode("button", {
                    class: "filter-row__chip-remove",
                    onClick: ($event) => removeFilter(columnFilters.value.indexOf(filter))
                  }, " ✕ ", 8, _hoisted_16)
                ]);
              }), 128))
            ])
          ])) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
const FilterRow = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ef184647"]]);
function install(app) {
  app.component("DataGrid", DataGrid);
  app.component("ListBox", ListBox);
  app.component("SearchPanel", SearchPanel);
  app.component("FilterRow", FilterRow);
}
const index = {
  install
};
export {
  DataGrid as AdvancedTable,
  DataGrid,
  FilterRow,
  ListBox,
  SearchPanel,
  createPinia,
  index as default,
  getActivePinia,
  gridApi,
  install,
  setActivePinia,
  useAutoRowHeight,
  useDataGridStore,
  useFiltering,
  useSearch,
  useShortcuts,
  useValidation
};
//# sourceMappingURL=rpa-web-ui.es.js.map
