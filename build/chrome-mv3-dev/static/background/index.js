(function(define){var __define; typeof define === "function" && (__define=define,define=null);
// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"YUX4N":[function(require,module,exports) {
var u = globalThis.process?.argv || [];
var h = ()=>globalThis.process?.env || {};
var B = new Set(u), _ = (e)=>B.has(e), G = u.filter((e)=>e.startsWith("--") && e.includes("=")).map((e)=>e.split("=")).reduce((e, [t, o])=>(e[t] = o, e), {});
var U = _("--dry-run"), g = ()=>_("--verbose") || h().VERBOSE === "true", N = g();
var m = (e = "", ...t)=>console.log(e.padEnd(9), "|", ...t);
var y = (...e)=>console.error("\uD83D\uDD34 ERROR".padEnd(9), "|", ...e), v = (...e)=>m("\uD83D\uDD35 INFO", ...e), f = (...e)=>m("\uD83D\uDFE0 WARN", ...e), M = 0, i = (...e)=>g() && m(`\u{1F7E1} ${M++}`, ...e);
var b = ()=>{
    let e = globalThis.browser?.runtime || globalThis.chrome?.runtime, t = ()=>setInterval(e.getPlatformInfo, 24e3);
    e.onStartup.addListener(t), t();
};
var n = {
    "isContentScript": false,
    "isBackground": true,
    "isReact": false,
    "runtimes": [
        "background-service-runtime"
    ],
    "host": "localhost",
    "port": 1815,
    "entryFilePath": "C:\\sum\\pind_plasmo_login_server\\pind_plasmo\\.plasmo\\static\\background\\index.ts",
    "bundleId": "c338908e704c91f1",
    "envHash": "d99a5ffa57acd638",
    "verbose": "false",
    "secure": false,
    "serverPort": 1012
};
module.bundle.HMR_BUNDLE_ID = n.bundleId;
globalThis.process = {
    argv: [],
    env: {
        VERBOSE: n.verbose
    }
};
var D = module.bundle.Module;
function H(e) {
    D.call(this, e), this.hot = {
        data: module.bundle.hotData[e],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(t) {
            this._acceptCallbacks.push(t || function() {});
        },
        dispose: function(t) {
            this._disposeCallbacks.push(t);
        }
    }, module.bundle.hotData[e] = void 0;
}
module.bundle.Module = H;
module.bundle.hotData = {};
var c = globalThis.browser || globalThis.chrome || null;
function R() {
    return !n.host || n.host === "0.0.0.0" ? location.protocol.indexOf("http") === 0 ? location.hostname : "localhost" : n.host;
}
function x() {
    return !n.host || n.host === "0.0.0.0" ? "localhost" : n.host;
}
function d() {
    return n.port || location.port;
}
var P = "__plasmo_runtime_page_", S = "__plasmo_runtime_script_";
var O = `${n.secure ? "https" : "http"}://${R()}:${d()}/`;
async function k(e = 1470) {
    for(;;)try {
        await fetch(O);
        break;
    } catch  {
        await new Promise((o)=>setTimeout(o, e));
    }
}
if (c.runtime.getManifest().manifest_version === 3) {
    let e = c.runtime.getURL("/__plasmo_hmr_proxy__?url=");
    globalThis.addEventListener("fetch", function(t) {
        let o = t.request.url;
        if (o.startsWith(e)) {
            let s = new URL(decodeURIComponent(o.slice(e.length)));
            s.hostname === n.host && s.port === `${n.port}` ? (s.searchParams.set("t", Date.now().toString()), t.respondWith(fetch(s).then((r)=>new Response(r.body, {
                    headers: {
                        "Content-Type": r.headers.get("Content-Type") ?? "text/javascript"
                    }
                })))) : t.respondWith(new Response("Plasmo HMR", {
                status: 200,
                statusText: "Testing"
            }));
        }
    });
}
function E(e, t) {
    let { modules: o } = e;
    return o ? !!o[t] : !1;
}
function C(e = d()) {
    let t = x();
    return `${n.secure || location.protocol === "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(t) ? "wss" : "ws"}://${t}:${e}/`;
}
function L(e) {
    typeof e.message == "string" && y("[plasmo/parcel-runtime]: " + e.message);
}
function T(e) {
    if (typeof globalThis.WebSocket > "u") return;
    let t = new WebSocket(C(Number(d()) + 1));
    return t.addEventListener("message", async function(o) {
        let s = JSON.parse(o.data);
        await e(s);
    }), t.addEventListener("error", L), t;
}
function A(e) {
    if (typeof globalThis.WebSocket > "u") return;
    let t = new WebSocket(C());
    return t.addEventListener("message", async function(o) {
        let s = JSON.parse(o.data);
        if (s.type === "update" && await e(s.assets), s.type === "error") for (let r of s.diagnostics.ansi){
            let l = r.codeframe || r.stack;
            f("[plasmo/parcel-runtime]: " + r.message + `
` + l + `

` + r.hints.join(`
`));
        }
    }), t.addEventListener("error", L), t.addEventListener("open", ()=>{
        v(`[plasmo/parcel-runtime]: Connected to HMR server for ${n.entryFilePath}`);
    }), t.addEventListener("close", ()=>{
        f(`[plasmo/parcel-runtime]: Connection to the HMR server is closed for ${n.entryFilePath}`);
    }), t;
}
var w = module.bundle.parent, a = {
    buildReady: !1,
    bgChanged: !1,
    csChanged: !1,
    pageChanged: !1,
    scriptPorts: new Set,
    pagePorts: new Set
};
async function p(e = !1) {
    if (e || a.buildReady && a.pageChanged) {
        i("BGSW Runtime - reloading Page");
        for (let t of a.pagePorts)t.postMessage(null);
    }
    if (e || a.buildReady && (a.bgChanged || a.csChanged)) {
        i("BGSW Runtime - reloading CS");
        let t = await c?.tabs.query({
            active: !0
        });
        for (let o of a.scriptPorts){
            let s = t.some((r)=>r.id === o.sender.tab?.id);
            o.postMessage({
                __plasmo_cs_active_tab__: s
            });
        }
        c.runtime.reload();
    }
}
if (!w || !w.isParcelRequire) {
    b();
    let e = A(async (t)=>{
        i("BGSW Runtime - On HMR Update"), a.bgChanged ||= t.filter((s)=>s.envHash === n.envHash).some((s)=>E(module.bundle, s.id));
        let o = t.find((s)=>s.type === "json");
        if (o) {
            let s = new Set(t.map((l)=>l.id)), r = Object.values(o.depsByBundle).map((l)=>Object.values(l)).flat();
            a.bgChanged ||= r.every((l)=>s.has(l));
        }
        p();
    });
    e.addEventListener("open", ()=>{
        let t = setInterval(()=>e.send("ping"), 24e3);
        e.addEventListener("close", ()=>clearInterval(t));
    }), e.addEventListener("close", async ()=>{
        await k(), p(!0);
    });
}
T(async (e)=>{
    switch(i("BGSW Runtime - On Build Repackaged"), e.type){
        case "build_ready":
            a.buildReady ||= !0, p();
            break;
        case "cs_changed":
            a.csChanged ||= !0, p();
            break;
    }
});
c.runtime.onConnect.addListener(function(e) {
    let t = e.name.startsWith(P), o = e.name.startsWith(S);
    if (t || o) {
        let s = t ? a.pagePorts : a.scriptPorts;
        s.add(e), e.onDisconnect.addListener(()=>{
            s.delete(e);
        }), e.onMessage.addListener(function(r) {
            i("BGSW Runtime - On source changed", r), r.__plasmo_cs_changed__ && (a.csChanged ||= !0), r.__plasmo_page_changed__ && (a.pageChanged ||= !0), p();
        });
    }
});
c.runtime.onMessage.addListener(function(t) {
    return t.__plasmo_full_reload__ && (i("BGSW Runtime - On top-level code changed"), p()), !0;
});

},{}],"8oeFb":[function(require,module,exports) {
var _background = require("../../../background");

},{"../../../background":"14rpM"}],"14rpM":[function(require,module,exports) {
// background.ts
// https://192.168.18.124:9000/ , https://172.20.10.4:9000/extract-ylocations
const API_BASE_URL = "http://localhost:8001";
// \uac1c\ubc1c \uc911\uc778 pind-web-map\uc758 \uc8fc\uc18c
const WEB_MAP_BASE_URL = "http://localhost:5173";
// content.tsx \ub610\ub294 popup.tsx\ub85c\ubd80\ud130 \uba54\uc2dc\uc9c0\ub97c \ubc1b\uae30 \uc704\ud55c \ub9ac\uc2a4\ub108
chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    // \uba54\uc2dc\uc9c0 \ud0c0\uc785\uc774 "showMap"\uc77c \ub54c\ub9cc \uc791\ub3d9
    if (message.type === "showMap") {
        // 1. \uba54\uc2dc\uc9c0\ub97c \ubcf4\ub0b8 \ud0ed(\uc720\ud29c\ube0c \ud398\uc774\uc9c0)\uc758 URL\uc744 \uac00\uc838\uc635\ub2c8\ub2e4.
        const youtubeUrl = message.url;
        const jwtToken = message.jwtToken; // popup.tsx\uc5d0\uc11c \uc804\ub2ec\ubc1b\uc740 jwtToken
        const tokenType = message.tokenType; // popup.tsx\uc5d0\uc11c \uc804\ub2ec\ubc1b\uc740 tokenType
        if (!youtubeUrl || !youtubeUrl.includes("youtube.com/watch?v=")) {
            console.error("\uba54\uc2dc\uc9c0\ub97c \ubcf4\ub0b8 \ud0ed\uc5d0\uc11c \uc720\ud29c\ube0c \uc601\uc0c1 URL\uc744 \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.");
            return false; // \uc624\ub958 \ubc1c\uc0dd \uc2dc \uc751\ub2f5\ud558\uc9c0 \uc54a\uc74c
        }
        if (!jwtToken || !tokenType) {
            console.error("\ubc31\uadf8\ub77c\uc6b4\ub4dc: JWT \ud1a0\ud070 \ub610\ub294 \ud1a0\ud070 \ud0c0\uc785\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.");
            // \uc0ac\uc6a9\uc790\uc5d0\uac8c \uc54c\ub9bc\uc744 \ubcf4\ub0bc \uc218\ub3c4 \uc788\uc2b5\ub2c8\ub2e4.
            chrome.notifications.create({
                type: "basic",
                iconUrl: "assets/icon-128.png",
                title: "Pind \uc624\ub958",
                message: "\ub85c\uadf8\uc778 \ud1a0\ud070\uc774 \uc5c6\uc5b4 \uc694\uccad\uc744 \ubcf4\ub0bc \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. \ub2e4\uc2dc \ub85c\uadf8\uc778\ud574\uc8fc\uc138\uc694."
            });
            return false;
        }
        console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \uc720\ud29c\ube0c URL \uac10\uc9c0 -", youtubeUrl);
        // 2. \ube44\ub3d9\uae30 \uc791\uc5c5\uc744 \uc704\ud574 async \ud568\uc218\ub97c \uc989\uc2dc \uc2e4\ud589\ud569\ub2c8\ub2e4.
        (async ()=>{
            try {
                // 3. FastAPI \ubc31\uc5d4\ub4dc \uc11c\ubc84\uc5d0 POST \uc694\uccad\uc744 \ubcf4\ub0c5\ub2c8\ub2e4.
                console.log(`\ubc31\uadf8\ub77c\uc6b4\ub4dc: FastAPI \uc11c\ubc84(${API_BASE_URL})\uc5d0 \uc7a5\uc18c \ucd94\ucd9c \uc694\uccad...`);
                const response = await fetch(`${API_BASE_URL}/api/v1/youtube/process`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${tokenType} ${jwtToken}` // Authorization \ud5e4\ub354 \ucd94\uac00
                    },
                    body: JSON.stringify({
                        url: youtubeUrl
                    })
                });
                // 4. \uc751\ub2f5 \ubcf8\ubb38\uc744 \ud55c \ubc88\ub9cc \uc77d\uc5b4\uc11c \ubcc0\uc218\uc5d0 \uc800\uc7a5\ud569\ub2c8\ub2e4.
                const data = await response.json();
                if (!response.ok) // \uc2e4\ud328 \uc2dc, \uc774\ubbf8 \uc77d\uc740 \ub370\uc774\ud130\uc5d0\uc11c \uc5d0\ub7ec \uba54\uc2dc\uc9c0\ub97c \uc0ac\uc6a9\ud569\ub2c8\ub2e4.
                throw new Error(data.error || `\ubc31\uc5d4\ub4dc \uc11c\ubc84 \uc624\ub958: ${response.statusText}`);
                const locations = data; // \uc131\uacf5 \uc2dc, \uc800\uc7a5\ub41c \ub370\uc774\ud130\ub97c \uc0ac\uc6a9\ud569\ub2c8\ub2e4.
                console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \uc11c\ubc84\ub85c\ubd80\ud130 \uc7a5\uc18c \ub370\uc774\ud130 \uc218\uc2e0 \uc644\ub8cc", locations);
                // 6. React \uc6f9 \uc571\uc744 \uc5f4\uace0, \ubc1b\uc740 JSON \ub370\uc774\ud130\ub97c URL \ud30c\ub77c\ubbf8\ud130\ub85c \uc804\ub2ec\ud569\ub2c8\ub2e4.
                const locationsData = JSON.stringify(locations);
                const finalUrl = `${WEB_MAP_BASE_URL}?locations=${encodeURIComponent(locationsData)}`;
                chrome.tabs.create({
                    url: finalUrl
                });
            } catch (error) {
                console.error("\ubc31\uadf8\ub77c\uc6b4\ub4dc \ucc98\ub9ac \uc911 \uc624\ub958 \ubc1c\uc0dd:", error);
                // \uc0ac\uc6a9\uc790\uc5d0\uac8c \uc624\ub958\ub97c \uc54c\ub9ac\ub294 \ub370\uc2a4\ud06c\ud1b1 \uc54c\ub9bc\uc744 \ud45c\uc2dc\ud569\ub2c8\ub2e4.
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "assets/icon-128.png",
                    title: "Pind \ucc98\ub9ac \uc624\ub958",
                    message: error instanceof Error ? error.message : "\uc7a5\uc18c \ucd94\ucd9c \uc911 \uc54c \uc218 \uc5c6\ub294 \uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4."
                });
            }
        })();
        // \ube44\ub3d9\uae30\uc801\uc73c\ub85c \uc751\ub2f5\ud560 \uac83\uc784\uc744 Chrome\uc5d0 \uc54c\ub9bd\ub2c8\ub2e4.
        return true;
    } else if (message.type === "openPopup") {
        console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \ud31d\uc5c5 \uc5f4\uae30 \uc694\uccad \uc218\uc2e0.");
        chrome.action.openPopup(); // \ud655\uc7a5 \ud504\ub85c\uadf8\ub7a8 \ud31d\uc5c5 \uc5f4\uae30
        return true;
    }
});

},{}]},["YUX4N","8oeFb"], "8oeFb", "parcelRequiredb23")

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O2dCQUV6QyxrREFBa0Q7Z0JBQ2xELE1BQU0sZ0JBQWdCLEtBQUssVUFBVTtnQkFDckMsTUFBTSxXQUFXLENBQUMsRUFBRSxpQkFBaUIsV0FBVyxFQUFFLG1CQUFtQixlQUFlLENBQUM7Z0JBRXJGLE9BQU8sS0FBSyxPQUFPO29CQUFFLEtBQUs7Z0JBQVM7WUFFckMsRUFBRSxPQUFPLE9BQU87Z0JBQ2QsUUFBUSxNQUFNLHFCQUFxQjtnQkFDbEMsZ0NBQWdDO2dCQUNqQyxPQUFPLGNBQWMsT0FBTztvQkFDMUIsTUFBTTtvQkFDTixTQUFTO29CQUNULE9BQU87b0JBQ1AsU0FBUyxpQkFBaUIsUUFBUSxNQUFNLFVBQVU7Z0JBQ3BEO1lBQ0Y7UUFDRixDQUFBO1FBRUEsK0JBQStCO1FBQy9CLE9BQU87SUFDVCxPQUFPLElBQUksUUFBUSxTQUFTLGFBQWE7UUFDdkMsUUFBUSxJQUFJO1FBQ1osT0FBTyxPQUFPLGFBQWEsZ0JBQWdCO1FBQzNDLE9BQU87SUFDVDtBQUNGIiwic291cmNlcyI6WyJub2RlX21vZHVsZXMvLnBucG0vQHBsYXNtb2hxK3BhcmNlbC1ydW50aW1lQDAuMjUuMi9ub2RlX21vZHVsZXMvQHBsYXNtb2hxL3BhcmNlbC1ydW50aW1lL2Rpc3QvcnVudGltZS1kZmFiMWVmZjA2N2I2Y2I4LmpzIiwiLnBsYXNtby9zdGF0aWMvYmFja2dyb3VuZC9pbmRleC50cyIsImJhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHU9Z2xvYmFsVGhpcy5wcm9jZXNzPy5hcmd2fHxbXTt2YXIgaD0oKT0+Z2xvYmFsVGhpcy5wcm9jZXNzPy5lbnZ8fHt9O3ZhciBCPW5ldyBTZXQodSksXz1lPT5CLmhhcyhlKSxHPXUuZmlsdGVyKGU9PmUuc3RhcnRzV2l0aChcIi0tXCIpJiZlLmluY2x1ZGVzKFwiPVwiKSkubWFwKGU9PmUuc3BsaXQoXCI9XCIpKS5yZWR1Y2UoKGUsW3Qsb10pPT4oZVt0XT1vLGUpLHt9KTt2YXIgVT1fKFwiLS1kcnktcnVuXCIpLGc9KCk9Pl8oXCItLXZlcmJvc2VcIil8fGgoKS5WRVJCT1NFPT09XCJ0cnVlXCIsTj1nKCk7dmFyIG09KGU9XCJcIiwuLi50KT0+Y29uc29sZS5sb2coZS5wYWRFbmQoOSksXCJ8XCIsLi4udCk7dmFyIHk9KC4uLmUpPT5jb25zb2xlLmVycm9yKFwiXFx1ezFGNTM0fSBFUlJPUlwiLnBhZEVuZCg5KSxcInxcIiwuLi5lKSx2PSguLi5lKT0+bShcIlxcdXsxRjUzNX0gSU5GT1wiLC4uLmUpLGY9KC4uLmUpPT5tKFwiXFx1ezFGN0UwfSBXQVJOXCIsLi4uZSksTT0wLGk9KC4uLmUpPT5nKCkmJm0oYFxcdXsxRjdFMX0gJHtNKyt9YCwuLi5lKTt2YXIgYj0oKT0+e2xldCBlPWdsb2JhbFRoaXMuYnJvd3Nlcj8ucnVudGltZXx8Z2xvYmFsVGhpcy5jaHJvbWU/LnJ1bnRpbWUsdD0oKT0+c2V0SW50ZXJ2YWwoZS5nZXRQbGF0Zm9ybUluZm8sMjRlMyk7ZS5vblN0YXJ0dXAuYWRkTGlzdGVuZXIodCksdCgpfTt2YXIgbj17XCJpc0NvbnRlbnRTY3JpcHRcIjpmYWxzZSxcImlzQmFja2dyb3VuZFwiOnRydWUsXCJpc1JlYWN0XCI6ZmFsc2UsXCJydW50aW1lc1wiOltcImJhY2tncm91bmQtc2VydmljZS1ydW50aW1lXCJdLFwiaG9zdFwiOlwibG9jYWxob3N0XCIsXCJwb3J0XCI6MTgxNSxcImVudHJ5RmlsZVBhdGhcIjpcIkM6XFxcXHN1bVxcXFxwaW5kX3BsYXNtb19sb2dpbl9zZXJ2ZXJcXFxccGluZF9wbGFzbW9cXFxcLnBsYXNtb1xcXFxzdGF0aWNcXFxcYmFja2dyb3VuZFxcXFxpbmRleC50c1wiLFwiYnVuZGxlSWRcIjpcImMzMzg5MDhlNzA0YzkxZjFcIixcImVudkhhc2hcIjpcImQ5OWE1ZmZhNTdhY2Q2MzhcIixcInZlcmJvc2VcIjpcImZhbHNlXCIsXCJzZWN1cmVcIjpmYWxzZSxcInNlcnZlclBvcnRcIjoxMDEyfTttb2R1bGUuYnVuZGxlLkhNUl9CVU5ETEVfSUQ9bi5idW5kbGVJZDtnbG9iYWxUaGlzLnByb2Nlc3M9e2FyZ3Y6W10sZW52OntWRVJCT1NFOm4udmVyYm9zZX19O3ZhciBEPW1vZHVsZS5idW5kbGUuTW9kdWxlO2Z1bmN0aW9uIEgoZSl7RC5jYWxsKHRoaXMsZSksdGhpcy5ob3Q9e2RhdGE6bW9kdWxlLmJ1bmRsZS5ob3REYXRhW2VdLF9hY2NlcHRDYWxsYmFja3M6W10sX2Rpc3Bvc2VDYWxsYmFja3M6W10sYWNjZXB0OmZ1bmN0aW9uKHQpe3RoaXMuX2FjY2VwdENhbGxiYWNrcy5wdXNoKHR8fGZ1bmN0aW9uKCl7fSl9LGRpc3Bvc2U6ZnVuY3Rpb24odCl7dGhpcy5fZGlzcG9zZUNhbGxiYWNrcy5wdXNoKHQpfX0sbW9kdWxlLmJ1bmRsZS5ob3REYXRhW2VdPXZvaWQgMH1tb2R1bGUuYnVuZGxlLk1vZHVsZT1IO21vZHVsZS5idW5kbGUuaG90RGF0YT17fTt2YXIgYz1nbG9iYWxUaGlzLmJyb3dzZXJ8fGdsb2JhbFRoaXMuY2hyb21lfHxudWxsO2Z1bmN0aW9uIFIoKXtyZXR1cm4hbi5ob3N0fHxuLmhvc3Q9PT1cIjAuMC4wLjBcIj9sb2NhdGlvbi5wcm90b2NvbC5pbmRleE9mKFwiaHR0cFwiKT09PTA/bG9jYXRpb24uaG9zdG5hbWU6XCJsb2NhbGhvc3RcIjpuLmhvc3R9ZnVuY3Rpb24geCgpe3JldHVybiFuLmhvc3R8fG4uaG9zdD09PVwiMC4wLjAuMFwiP1wibG9jYWxob3N0XCI6bi5ob3N0fWZ1bmN0aW9uIGQoKXtyZXR1cm4gbi5wb3J0fHxsb2NhdGlvbi5wb3J0fXZhciBQPVwiX19wbGFzbW9fcnVudGltZV9wYWdlX1wiLFM9XCJfX3BsYXNtb19ydW50aW1lX3NjcmlwdF9cIjt2YXIgTz1gJHtuLnNlY3VyZT9cImh0dHBzXCI6XCJodHRwXCJ9Oi8vJHtSKCl9OiR7ZCgpfS9gO2FzeW5jIGZ1bmN0aW9uIGsoZT0xNDcwKXtmb3IoOzspdHJ5e2F3YWl0IGZldGNoKE8pO2JyZWFrfWNhdGNoe2F3YWl0IG5ldyBQcm9taXNlKG89PnNldFRpbWVvdXQobyxlKSl9fWlmKGMucnVudGltZS5nZXRNYW5pZmVzdCgpLm1hbmlmZXN0X3ZlcnNpb249PT0zKXtsZXQgZT1jLnJ1bnRpbWUuZ2V0VVJMKFwiL19fcGxhc21vX2htcl9wcm94eV9fP3VybD1cIik7Z2xvYmFsVGhpcy5hZGRFdmVudExpc3RlbmVyKFwiZmV0Y2hcIixmdW5jdGlvbih0KXtsZXQgbz10LnJlcXVlc3QudXJsO2lmKG8uc3RhcnRzV2l0aChlKSl7bGV0IHM9bmV3IFVSTChkZWNvZGVVUklDb21wb25lbnQoby5zbGljZShlLmxlbmd0aCkpKTtzLmhvc3RuYW1lPT09bi5ob3N0JiZzLnBvcnQ9PT1gJHtuLnBvcnR9YD8ocy5zZWFyY2hQYXJhbXMuc2V0KFwidFwiLERhdGUubm93KCkudG9TdHJpbmcoKSksdC5yZXNwb25kV2l0aChmZXRjaChzKS50aGVuKHI9Pm5ldyBSZXNwb25zZShyLmJvZHkse2hlYWRlcnM6e1wiQ29udGVudC1UeXBlXCI6ci5oZWFkZXJzLmdldChcIkNvbnRlbnQtVHlwZVwiKT8/XCJ0ZXh0L2phdmFzY3JpcHRcIn19KSkpKTp0LnJlc3BvbmRXaXRoKG5ldyBSZXNwb25zZShcIlBsYXNtbyBITVJcIix7c3RhdHVzOjIwMCxzdGF0dXNUZXh0OlwiVGVzdGluZ1wifSkpfX0pfWZ1bmN0aW9uIEUoZSx0KXtsZXR7bW9kdWxlczpvfT1lO3JldHVybiBvPyEhb1t0XTohMX1mdW5jdGlvbiBDKGU9ZCgpKXtsZXQgdD14KCk7cmV0dXJuYCR7bi5zZWN1cmV8fGxvY2F0aW9uLnByb3RvY29sPT09XCJodHRwczpcIiYmIS9sb2NhbGhvc3R8MTI3LjAuMC4xfDAuMC4wLjAvLnRlc3QodCk/XCJ3c3NcIjpcIndzXCJ9Oi8vJHt0fToke2V9L2B9ZnVuY3Rpb24gTChlKXt0eXBlb2YgZS5tZXNzYWdlPT1cInN0cmluZ1wiJiZ5KFwiW3BsYXNtby9wYXJjZWwtcnVudGltZV06IFwiK2UubWVzc2FnZSl9ZnVuY3Rpb24gVChlKXtpZih0eXBlb2YgZ2xvYmFsVGhpcy5XZWJTb2NrZXQ+XCJ1XCIpcmV0dXJuO2xldCB0PW5ldyBXZWJTb2NrZXQoQyhOdW1iZXIoZCgpKSsxKSk7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIixhc3luYyBmdW5jdGlvbihvKXtsZXQgcz1KU09OLnBhcnNlKG8uZGF0YSk7YXdhaXQgZShzKX0pLHQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsTCksdH1mdW5jdGlvbiBBKGUpe2lmKHR5cGVvZiBnbG9iYWxUaGlzLldlYlNvY2tldD5cInVcIilyZXR1cm47bGV0IHQ9bmV3IFdlYlNvY2tldChDKCkpO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsYXN5bmMgZnVuY3Rpb24obyl7bGV0IHM9SlNPTi5wYXJzZShvLmRhdGEpO2lmKHMudHlwZT09PVwidXBkYXRlXCImJmF3YWl0IGUocy5hc3NldHMpLHMudHlwZT09PVwiZXJyb3JcIilmb3IobGV0IHIgb2Ygcy5kaWFnbm9zdGljcy5hbnNpKXtsZXQgbD1yLmNvZGVmcmFtZXx8ci5zdGFjaztmKFwiW3BsYXNtby9wYXJjZWwtcnVudGltZV06IFwiK3IubWVzc2FnZStgXG5gK2wrYFxuXG5gK3IuaGludHMuam9pbihgXG5gKSl9fSksdC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIixMKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsKCk9Pnt2KGBbcGxhc21vL3BhcmNlbC1ydW50aW1lXTogQ29ubmVjdGVkIHRvIEhNUiBzZXJ2ZXIgZm9yICR7bi5lbnRyeUZpbGVQYXRofWApfSksdC5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwoKT0+e2YoYFtwbGFzbW8vcGFyY2VsLXJ1bnRpbWVdOiBDb25uZWN0aW9uIHRvIHRoZSBITVIgc2VydmVyIGlzIGNsb3NlZCBmb3IgJHtuLmVudHJ5RmlsZVBhdGh9YCl9KSx0fXZhciB3PW1vZHVsZS5idW5kbGUucGFyZW50LGE9e2J1aWxkUmVhZHk6ITEsYmdDaGFuZ2VkOiExLGNzQ2hhbmdlZDohMSxwYWdlQ2hhbmdlZDohMSxzY3JpcHRQb3J0czpuZXcgU2V0LHBhZ2VQb3J0czpuZXcgU2V0fTthc3luYyBmdW5jdGlvbiBwKGU9ITEpe2lmKGV8fGEuYnVpbGRSZWFkeSYmYS5wYWdlQ2hhbmdlZCl7aShcIkJHU1cgUnVudGltZSAtIHJlbG9hZGluZyBQYWdlXCIpO2ZvcihsZXQgdCBvZiBhLnBhZ2VQb3J0cyl0LnBvc3RNZXNzYWdlKG51bGwpfWlmKGV8fGEuYnVpbGRSZWFkeSYmKGEuYmdDaGFuZ2VkfHxhLmNzQ2hhbmdlZCkpe2koXCJCR1NXIFJ1bnRpbWUgLSByZWxvYWRpbmcgQ1NcIik7bGV0IHQ9YXdhaXQgYz8udGFicy5xdWVyeSh7YWN0aXZlOiEwfSk7Zm9yKGxldCBvIG9mIGEuc2NyaXB0UG9ydHMpe2xldCBzPXQuc29tZShyPT5yLmlkPT09by5zZW5kZXIudGFiPy5pZCk7by5wb3N0TWVzc2FnZSh7X19wbGFzbW9fY3NfYWN0aXZlX3RhYl9fOnN9KX1jLnJ1bnRpbWUucmVsb2FkKCl9fWlmKCF3fHwhdy5pc1BhcmNlbFJlcXVpcmUpe2IoKTtsZXQgZT1BKGFzeW5jIHQ9PntpKFwiQkdTVyBSdW50aW1lIC0gT24gSE1SIFVwZGF0ZVwiKSxhLmJnQ2hhbmdlZHx8PXQuZmlsdGVyKHM9PnMuZW52SGFzaD09PW4uZW52SGFzaCkuc29tZShzPT5FKG1vZHVsZS5idW5kbGUscy5pZCkpO2xldCBvPXQuZmluZChzPT5zLnR5cGU9PT1cImpzb25cIik7aWYobyl7bGV0IHM9bmV3IFNldCh0Lm1hcChsPT5sLmlkKSkscj1PYmplY3QudmFsdWVzKG8uZGVwc0J5QnVuZGxlKS5tYXAobD0+T2JqZWN0LnZhbHVlcyhsKSkuZmxhdCgpO2EuYmdDaGFuZ2VkfHw9ci5ldmVyeShsPT5zLmhhcyhsKSl9cCgpfSk7ZS5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCgpPT57bGV0IHQ9c2V0SW50ZXJ2YWwoKCk9PmUuc2VuZChcInBpbmdcIiksMjRlMyk7ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwoKT0+Y2xlYXJJbnRlcnZhbCh0KSl9KSxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLGFzeW5jKCk9Pnthd2FpdCBrKCkscCghMCl9KX1UKGFzeW5jIGU9Pntzd2l0Y2goaShcIkJHU1cgUnVudGltZSAtIE9uIEJ1aWxkIFJlcGFja2FnZWRcIiksZS50eXBlKXtjYXNlXCJidWlsZF9yZWFkeVwiOnthLmJ1aWxkUmVhZHl8fD0hMCxwKCk7YnJlYWt9Y2FzZVwiY3NfY2hhbmdlZFwiOnthLmNzQ2hhbmdlZHx8PSEwLHAoKTticmVha319fSk7Yy5ydW50aW1lLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcihmdW5jdGlvbihlKXtsZXQgdD1lLm5hbWUuc3RhcnRzV2l0aChQKSxvPWUubmFtZS5zdGFydHNXaXRoKFMpO2lmKHR8fG8pe2xldCBzPXQ/YS5wYWdlUG9ydHM6YS5zY3JpcHRQb3J0cztzLmFkZChlKSxlLm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKT0+e3MuZGVsZXRlKGUpfSksZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24ocil7aShcIkJHU1cgUnVudGltZSAtIE9uIHNvdXJjZSBjaGFuZ2VkXCIsciksci5fX3BsYXNtb19jc19jaGFuZ2VkX18mJihhLmNzQ2hhbmdlZHx8PSEwKSxyLl9fcGxhc21vX3BhZ2VfY2hhbmdlZF9fJiYoYS5wYWdlQ2hhbmdlZHx8PSEwKSxwKCl9KX19KTtjLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uKHQpe3JldHVybiB0Ll9fcGxhc21vX2Z1bGxfcmVsb2FkX18mJihpKFwiQkdTVyBSdW50aW1lIC0gT24gdG9wLWxldmVsIGNvZGUgY2hhbmdlZFwiKSxwKCkpLCEwfSk7XG4iLCJpbXBvcnQgXCIuLi8uLi8uLi9iYWNrZ3JvdW5kXCIiLCIvLyBiYWNrZ3JvdW5kLnRzXG5cbi8vIGh0dHBzOi8vMTkyLjE2OC4xOC4xMjQ6OTAwMC8gLCBodHRwczovLzE3Mi4yMC4xMC40OjkwMDAvZXh0cmFjdC15bG9jYXRpb25zXG5jb25zdCBBUElfQkFTRV9VUkwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMVwiO1xuLy8g6rCc67CcIOykkeyduCBwaW5kLXdlYi1tYXDsnZgg7KO87IaMXG5jb25zdCBXRUJfTUFQX0JBU0VfVVJMID0gXCJodHRwOi8vbG9jYWxob3N0OjUxNzNcIjtcblxuLy8gY29udGVudC50c3gg65iQ64qUIHBvcHVwLnRzeOuhnOu2gO2EsCDrqZTsi5zsp4Drpbwg67Cb6riwIOychO2VnCDrpqzsiqTrhIhcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgLy8g66mU7Iuc7KeAIO2DgOyeheydtCBcInNob3dNYXBcIuydvCDrlYzrp4wg7J6R64+ZXG4gIGlmIChtZXNzYWdlLnR5cGUgPT09IFwic2hvd01hcFwiKSB7XG4gICAgLy8gMS4g66mU7Iuc7KeA66W8IOuztOuCuCDtg60o7Jyg7Yqc67iMIO2OmOydtOyngCnsnZggVVJM7J2EIOqwgOyguOyYteuLiOuLpC5cbiAgICBjb25zdCB5b3V0dWJlVXJsID0gbWVzc2FnZS51cmw7XG4gICAgY29uc3Qgand0VG9rZW4gPSBtZXNzYWdlLmp3dFRva2VuOyAvLyBwb3B1cC50c3jsl5DshJwg7KCE64us67Cb7J2AIGp3dFRva2VuXG4gICAgY29uc3QgdG9rZW5UeXBlID0gbWVzc2FnZS50b2tlblR5cGU7IC8vIHBvcHVwLnRzeOyXkOyEnCDsoITri6zrsJvsnYAgdG9rZW5UeXBlXG5cbiAgICBpZiAoIXlvdXR1YmVVcmwgfHwgIXlvdXR1YmVVcmwuaW5jbHVkZXMoXCJ5b3V0dWJlLmNvbS93YXRjaD92PVwiKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcIuuplOyLnOyngOulvCDrs7Trgrgg7YOt7JeQ7IScIOycoO2KnOu4jCDsmIHsg4EgVVJM7J2EIOywvuydhCDsiJgg7JeG7Iq164uI64ukLlwiKTtcbiAgICAgIHJldHVybiBmYWxzZTsgLy8g7Jik66WYIOuwnOyDnSDsi5wg7J2R64u17ZWY7KeAIOyViuydjFxuICAgIH1cbiAgICBcbiAgICBpZiAoIWp3dFRva2VuIHx8ICF0b2tlblR5cGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCLrsLHqt7jrnbzsmrTrk5w6IEpXVCDthqDtgbAg65iQ64qUIO2GoO2BsCDtg4DsnoXsnbQg7JeG7Iq164uI64ukLlwiKTtcbiAgICAgIC8vIOyCrOyaqeyekOyXkOqyjCDslYzrprzsnYQg67O064K8IOyImOuPhCDsnojsirXri4jri6QuXG4gICAgICBjaHJvbWUubm90aWZpY2F0aW9ucy5jcmVhdGUoe1xuICAgICAgICB0eXBlOiBcImJhc2ljXCIsXG4gICAgICAgIGljb25Vcmw6IFwiYXNzZXRzL2ljb24tMTI4LnBuZ1wiLFxuICAgICAgICB0aXRsZTogXCJQaW5kIOyYpOulmFwiLFxuICAgICAgICBtZXNzYWdlOiBcIuuhnOq3uOyduCDthqDtgbDsnbQg7JeG7Ja0IOyalOyyreydhCDrs7Trgrwg7IiYIOyXhuyKteuLiOuLpC4g64uk7IucIOuhnOq3uOyduO2VtOyjvOyEuOyalC5cIlxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCLrsLHqt7jrnbzsmrTrk5w6IOycoO2KnOu4jCBVUkwg6rCQ7KeAIC1cIiwgeW91dHViZVVybCk7XG5cbiAgICAvLyAyLiDruYTrj5nquLAg7J6R7JeF7J2EIOychO2VtCBhc3luYyDtlajsiJjrpbwg7KaJ7IucIOyLpO2Wie2VqeuLiOuLpC5cbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gMy4gRmFzdEFQSSDrsLHsl5Trk5wg7ISc67KE7JeQIFBPU1Qg7JqU7LKt7J2EIOuztOuDheuLiOuLpC5cbiAgICAgICAgY29uc29sZS5sb2coYOuwseq3uOudvOyatOuTnDogRmFzdEFQSSDshJzrsoQoJHtBUElfQkFTRV9VUkx9KeyXkCDsnqXshowg7LaU7LacIOyalOyyrS4uLmApO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0FQSV9CQVNFX1VSTH0vYXBpL3YxL3lvdXR1YmUvcHJvY2Vzc2AsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6IGAke3Rva2VuVHlwZX0gJHtqd3RUb2tlbn1gIC8vIEF1dGhvcml6YXRpb24g7Zek642UIOy2lOqwgFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1cmw6IHlvdXR1YmVVcmwgfSksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIDQuIOydkeuLtSDrs7jrrLjsnYQg7ZWcIOuyiOunjCDsnb3slrTshJwg67OA7IiY7JeQIOyggOyepe2VqeuLiOuLpC5cbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgLy8g7Iuk7YyoIOyLnCwg7J2066+4IOydveydgCDrjbDsnbTthLDsl5DshJwg7JeQ65+sIOuplOyLnOyngOulvCDsgqzsmqntlanri4jri6QuXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEuZXJyb3IgfHwgYOuwseyXlOuTnCDshJzrsoQg7Jik66WYOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsb2NhdGlvbnMgPSBkYXRhOyAvLyDshLHqs7Ug7IucLCDsoIDsnqXrkJwg642w7J207YSw66W8IOyCrOyaqe2VqeuLiOuLpC5cbiAgICAgICAgY29uc29sZS5sb2coXCLrsLHqt7jrnbzsmrTrk5w6IOyEnOuyhOuhnOu2gO2EsCDsnqXshowg642w7J207YSwIOyImOyLoCDsmYTro4xcIiwgbG9jYXRpb25zKTtcblxuICAgICAgICAvLyA2LiBSZWFjdCDsm7kg7JWx7J2EIOyXtOqzoCwg67Cb7J2AIEpTT04g642w7J207YSw66W8IFVSTCDtjIzrnbzrr7jthLDroZwg7KCE64us7ZWp64uI64ukLlxuICAgICAgICBjb25zdCBsb2NhdGlvbnNEYXRhID0gSlNPTi5zdHJpbmdpZnkobG9jYXRpb25zKTtcbiAgICAgICAgY29uc3QgZmluYWxVcmwgPSBgJHtXRUJfTUFQX0JBU0VfVVJMfT9sb2NhdGlvbnM9JHtlbmNvZGVVUklDb21wb25lbnQobG9jYXRpb25zRGF0YSl9YDtcblxuICAgICAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IGZpbmFsVXJsIH0pO1xuXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwi67Cx6re465287Jq065OcIOyymOumrCDspJEg7Jik66WYIOuwnOyDnTpcIiwgZXJyb3IpO1xuICAgICAgICAgLy8g7IKs7Jqp7J6Q7JeQ6rKMIOyYpOulmOulvCDslYzrpqzripQg642w7Iqk7YGs7YaxIOyVjOumvOydhCDtkZzsi5ztlanri4jri6QuXG4gICAgICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNyZWF0ZSh7XG4gICAgICAgICAgdHlwZTogXCJiYXNpY1wiLFxuICAgICAgICAgIGljb25Vcmw6IFwiYXNzZXRzL2ljb24tMTI4LnBuZ1wiLCAvLyAxMjh4MTI4IOyVhOydtOy9mCDqsr3roZxcbiAgICAgICAgICB0aXRsZTogXCJQaW5kIOyymOumrCDsmKTrpZhcIixcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwi7J6l7IaMIOy2lOy2nCDspJEg7JWMIOyImCDsl4bripQg7Jik66WY6rCAIOuwnOyDne2WiOyKteuLiOuLpC5cIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIFxuICAgIC8vIOu5hOuPmeq4sOyggeycvOuhnCDsnZHri7XtlaAg6rKD7J6E7J2EIENocm9tZeyXkCDslYzrpr3ri4jri6QuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSBcIm9wZW5Qb3B1cFwiKSB7XG4gICAgY29uc29sZS5sb2coXCLrsLHqt7jrnbzsmrTrk5w6IO2MneyXhSDsl7TquLAg7JqU7LKtIOyImOyLoC5cIik7XG4gICAgY2hyb21lLmFjdGlvbi5vcGVuUG9wdXAoKTsgLy8g7ZmV7J6lIO2UhOuhnOq3uOueqCDtjJ3sl4Ug7Je06riwXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwidmVyc2lvbiI6MywiZmlsZSI6ImluZGV4LmpzLm1hcCJ9
 globalThis.define=__define;  })(globalThis.define);