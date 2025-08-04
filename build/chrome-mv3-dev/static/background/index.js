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
})({"hB12E":[function(require,module,exports) {
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
    "entryFilePath": "C:\\sum\\pind_0804\\pind_plasmo\\.plasmo\\static\\background\\index.ts",
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
const API_BASE_URL = "http://localhost:8000";
// \uac1c\ubc1c \uc911\uc778 pind-web-map\uc758 \uc8fc\uc18c
const WEB_MAP_BASE_URL = "http://localhost:5173";
async function processAndShowMap(youtubeUrl, jwtToken, tokenType) {
    console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: processAndShowMap \ud568\uc218 \uc2e4\ud589. URL:", youtubeUrl, "JWT:", jwtToken ? "\uc788\uc74c" : "\uc5c6\uc74c");
    try {
        let apiUrl = `${API_BASE_URL}/api/v1/youtube/process`;
        const headers = {
            "Content-Type": "application/json"
        };
        if (jwtToken && tokenType) {
            // \ub85c\uadf8\uc778 \uc0ac\uc6a9\uc790
            headers["Authorization"] = `${tokenType} ${jwtToken}`;
            console.log(`\ubc31\uadf8\ub77c\uc6b4\ub4dc: \ub85c\uadf8\uc778 \uc0ac\uc6a9\uc790\uc6a9 FastAPI \uc11c\ubc84(${apiUrl})\uc5d0 \uc7a5\uc18c \ucd94\ucd9c \uc694\uccad...`);
            console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \uc694\uccad \ud5e4\ub354 (\ub85c\uadf8\uc778):");
            console.log(headers);
        } else {
            // \ube44\ub85c\uadf8\uc778 \uc0ac\uc6a9\uc790
            apiUrl = `${API_BASE_URL}/api/v1/youtube/without-login/process`;
            console.log(`\ubc31\uadf8\ub77c\uc6b4\ub4dc: \ube44\ub85c\uadf8\uc778 \uc0ac\uc6a9\uc790\uc6a9 FastAPI \uc11c\ubc84(${apiUrl})\uc5d0 \uc7a5\uc18c \ucd94\ucd9c \uc694\uccad...`);
            console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \uc694\uccad \ud5e4\ub354 (\ube44\ub85c\uadf8\uc778):");
            console.log(headers);
        }
        console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \uc11c\ubc84\ub85c fetch \uc694\uccad \uc2dc\uc791...");
        console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \uc694\uccad URL:", apiUrl);
        console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \uc694\uccad \ud5e4\ub354:", headers);
        console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \uc694\uccad \ubcf8\ubb38:", JSON.stringify({
            url: youtubeUrl
        }));
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                url: youtubeUrl
            })
        });
        console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: fetch \uc751\ub2f5 \uc218\uc2e0. \uc0c1\ud0dc:", response.status, response.statusText);
        // 4. \uc751\ub2f5 \ubcf8\ubb38\uc744 \ud55c \ubc88\ub9cc \uc77d\uc5b4\uc11c \ubcc0\uc218\uc5d0 \uc800\uc7a5\ud569\ub2c8\ub2e4.
        const data = await response.json();
        console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \uc751\ub2f5 \ub370\uc774\ud130:", data);
        if (!response.ok) // \uc2e4\ud328 \uc2dc, \uc774\ubbf8 \uc77d\uc740 \ub370\uc774\ud130\uc5d0\uc11c \uc5d0\ub7ec \uba54\uc2dc\uc9c0\ub97c \uc0ac\uc6a9\ud569\ub2c8\ub2e4.
        throw new Error(data.detail || `\ubc31\uc5d4\ub4dc \uc11c\ubc84 \uc624\ub958: ${response.statusText}`);
        const locations = data; // \uc131\uacf5 \uc2dc, \uc800\uc7a5\ub41c \ub370\uc774\ud130\ub97c \uc0ac\uc6a9\ud569\ub2c8\ub2e4.
        console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \uc11c\ubc84\ub85c\ubd80\ud130 \uc7a5\uc18c \ub370\uc774\ud130 \uc218\uc2e0 \uc644\ub8cc", locations);
        // 6. React \uc6f9 \uc571\uc744 \uc5f4\uace0, \ubc1b\uc740 JSON \ub370\uc774\ud130\ub97c URL \ud30c\ub77c\ubbf8\ud130\ub85c \uc804\ub2ec\ud569\ub2c8\ub2e4.
        const locationsData = JSON.stringify(locations);
        const finalUrl = `${WEB_MAP_BASE_URL}?locations=${encodeURIComponent(locationsData)}`;
        console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \ucd5c\uc885 \uc6f9\ub9f5 URL:", finalUrl);
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
}
// content.tsx \ub610\ub294 popup.tsx\ub85c\ubd80\ud130 \uba54\uc2dc\uc9c0\ub97c \ubc1b\uae30 \uc704\ud55c \ub9ac\uc2a4\ub108
chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if (message.type === "handleIconClick") {
        console.log(`\ubc31\uadf8\ub77c\uc6b4\ub4dc: ${message.type} \uc774\ubca4\ud2b8 \uc218\uc2e0.`);
        (async ()=>{
            const localResult = await chrome.storage.local.get([
                "jwtToken",
                "tokenType"
            ]);
            const sessionResult = await chrome.storage.session.get("hasSkippedLogin");
            if (localResult.jwtToken || sessionResult.hasSkippedLogin) {
                // \ub85c\uadf8\uc778\uc774 \ub418\uc5b4 \uc788\uac70\ub098, \ube44\ud68c\uc6d0 \ub85c\uadf8\uc778\uc744 \uc120\ud0dd\ud55c \uacbd\uc6b0
                console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \ub85c\uadf8\uc778 \ub610\ub294 \ube44\ud68c\uc6d0 \ub85c\uadf8\uc778 \uc0c1\ud0dc \ud655\uc778. \uc9c0\ub3c4 \ud45c\uc2dc \ub85c\uc9c1 \uc2e4\ud589...");
                processAndShowMap(message.url, localResult.jwtToken, localResult.tokenType);
            } else {
                // \ub85c\uadf8\uc778\ub3c4, \ube44\ud68c\uc6d0 \ub85c\uadf8\uc778\ub3c4 \uc544\ub2cc \uacbd\uc6b0 \ud31d\uc5c5\uc744 \ub744\uc6c1\ub2c8\ub2e4.
                console.log("\ubc31\uadf8\ub77c\uc6b4\ub4dc: \ub85c\uadf8\uc778 \uc815\ubcf4 \uc5c6\uc74c. chrome.action.openPopup() \ud638\ucd9c...");
                chrome.action.openPopup();
            }
        })();
        return true; // \ube44\ub3d9\uae30 \ucc98\ub9ac\ub97c \uc704\ud574 true \ubc18\ud658
    } else if (message.type === "showMap") {
        // \ud31d\uc5c5\uc5d0\uc11c "\uc9c0\ub3c4 \ubcf4\uae30" \ubc84\ud2bc\uc744 \ud074\ub9ad\ud588\uc744 \ub54c (\ub85c\uadf8\uc778 \ub610\ub294 \ube44\ud68c\uc6d0)
        console.log(`\ubc31\uadf8\ub77c\uc6b4\ub4dc: ${message.type} \uc774\ubca4\ud2b8 \uc218\uc2e0. \uc9c0\ub3c4 \ud45c\uc2dc \ub85c\uc9c1 \uc2e4\ud589...`);
        processAndShowMap(message.url, message.jwtToken, message.tokenType);
        return true;
    }
});

},{}]},["hB12E","8oeFb"], "8oeFb", "parcelRequiredb23")

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0lBQ1Q7QUFDRiIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzLy5wbnBtL0BwbGFzbW9ocStwYXJjZWwtcnVudGltZUAwLjI1LjIvbm9kZV9tb2R1bGVzL0BwbGFzbW9ocS9wYXJjZWwtcnVudGltZS9kaXN0L3J1bnRpbWUtN2E4MWNkY2E3MDliOTY5NC5qcyIsIi5wbGFzbW8vc3RhdGljL2JhY2tncm91bmQvaW5kZXgudHMiLCJiYWNrZ3JvdW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciB1PWdsb2JhbFRoaXMucHJvY2Vzcz8uYXJndnx8W107dmFyIGg9KCk9Pmdsb2JhbFRoaXMucHJvY2Vzcz8uZW52fHx7fTt2YXIgQj1uZXcgU2V0KHUpLF89ZT0+Qi5oYXMoZSksRz11LmZpbHRlcihlPT5lLnN0YXJ0c1dpdGgoXCItLVwiKSYmZS5pbmNsdWRlcyhcIj1cIikpLm1hcChlPT5lLnNwbGl0KFwiPVwiKSkucmVkdWNlKChlLFt0LG9dKT0+KGVbdF09byxlKSx7fSk7dmFyIFU9XyhcIi0tZHJ5LXJ1blwiKSxnPSgpPT5fKFwiLS12ZXJib3NlXCIpfHxoKCkuVkVSQk9TRT09PVwidHJ1ZVwiLE49ZygpO3ZhciBtPShlPVwiXCIsLi4udCk9PmNvbnNvbGUubG9nKGUucGFkRW5kKDkpLFwifFwiLC4uLnQpO3ZhciB5PSguLi5lKT0+Y29uc29sZS5lcnJvcihcIlxcdXsxRjUzNH0gRVJST1JcIi5wYWRFbmQoOSksXCJ8XCIsLi4uZSksdj0oLi4uZSk9Pm0oXCJcXHV7MUY1MzV9IElORk9cIiwuLi5lKSxmPSguLi5lKT0+bShcIlxcdXsxRjdFMH0gV0FSTlwiLC4uLmUpLE09MCxpPSguLi5lKT0+ZygpJiZtKGBcXHV7MUY3RTF9ICR7TSsrfWAsLi4uZSk7dmFyIGI9KCk9PntsZXQgZT1nbG9iYWxUaGlzLmJyb3dzZXI/LnJ1bnRpbWV8fGdsb2JhbFRoaXMuY2hyb21lPy5ydW50aW1lLHQ9KCk9PnNldEludGVydmFsKGUuZ2V0UGxhdGZvcm1JbmZvLDI0ZTMpO2Uub25TdGFydHVwLmFkZExpc3RlbmVyKHQpLHQoKX07dmFyIG49e1wiaXNDb250ZW50U2NyaXB0XCI6ZmFsc2UsXCJpc0JhY2tncm91bmRcIjp0cnVlLFwiaXNSZWFjdFwiOmZhbHNlLFwicnVudGltZXNcIjpbXCJiYWNrZ3JvdW5kLXNlcnZpY2UtcnVudGltZVwiXSxcImhvc3RcIjpcImxvY2FsaG9zdFwiLFwicG9ydFwiOjE4MTUsXCJlbnRyeUZpbGVQYXRoXCI6XCJDOlxcXFxzdW1cXFxccGluZF8wODA0XFxcXHBpbmRfcGxhc21vXFxcXC5wbGFzbW9cXFxcc3RhdGljXFxcXGJhY2tncm91bmRcXFxcaW5kZXgudHNcIixcImJ1bmRsZUlkXCI6XCJjMzM4OTA4ZTcwNGM5MWYxXCIsXCJlbnZIYXNoXCI6XCJkOTlhNWZmYTU3YWNkNjM4XCIsXCJ2ZXJib3NlXCI6XCJmYWxzZVwiLFwic2VjdXJlXCI6ZmFsc2UsXCJzZXJ2ZXJQb3J0XCI6MTAxMn07bW9kdWxlLmJ1bmRsZS5ITVJfQlVORExFX0lEPW4uYnVuZGxlSWQ7Z2xvYmFsVGhpcy5wcm9jZXNzPXthcmd2OltdLGVudjp7VkVSQk9TRTpuLnZlcmJvc2V9fTt2YXIgRD1tb2R1bGUuYnVuZGxlLk1vZHVsZTtmdW5jdGlvbiBIKGUpe0QuY2FsbCh0aGlzLGUpLHRoaXMuaG90PXtkYXRhOm1vZHVsZS5idW5kbGUuaG90RGF0YVtlXSxfYWNjZXB0Q2FsbGJhY2tzOltdLF9kaXNwb3NlQ2FsbGJhY2tzOltdLGFjY2VwdDpmdW5jdGlvbih0KXt0aGlzLl9hY2NlcHRDYWxsYmFja3MucHVzaCh0fHxmdW5jdGlvbigpe30pfSxkaXNwb3NlOmZ1bmN0aW9uKHQpe3RoaXMuX2Rpc3Bvc2VDYWxsYmFja3MucHVzaCh0KX19LG1vZHVsZS5idW5kbGUuaG90RGF0YVtlXT12b2lkIDB9bW9kdWxlLmJ1bmRsZS5Nb2R1bGU9SDttb2R1bGUuYnVuZGxlLmhvdERhdGE9e307dmFyIGM9Z2xvYmFsVGhpcy5icm93c2VyfHxnbG9iYWxUaGlzLmNocm9tZXx8bnVsbDtmdW5jdGlvbiBSKCl7cmV0dXJuIW4uaG9zdHx8bi5ob3N0PT09XCIwLjAuMC4wXCI/bG9jYXRpb24ucHJvdG9jb2wuaW5kZXhPZihcImh0dHBcIik9PT0wP2xvY2F0aW9uLmhvc3RuYW1lOlwibG9jYWxob3N0XCI6bi5ob3N0fWZ1bmN0aW9uIHgoKXtyZXR1cm4hbi5ob3N0fHxuLmhvc3Q9PT1cIjAuMC4wLjBcIj9cImxvY2FsaG9zdFwiOm4uaG9zdH1mdW5jdGlvbiBkKCl7cmV0dXJuIG4ucG9ydHx8bG9jYXRpb24ucG9ydH12YXIgUD1cIl9fcGxhc21vX3J1bnRpbWVfcGFnZV9cIixTPVwiX19wbGFzbW9fcnVudGltZV9zY3JpcHRfXCI7dmFyIE89YCR7bi5zZWN1cmU/XCJodHRwc1wiOlwiaHR0cFwifTovLyR7UigpfToke2QoKX0vYDthc3luYyBmdW5jdGlvbiBrKGU9MTQ3MCl7Zm9yKDs7KXRyeXthd2FpdCBmZXRjaChPKTticmVha31jYXRjaHthd2FpdCBuZXcgUHJvbWlzZShvPT5zZXRUaW1lb3V0KG8sZSkpfX1pZihjLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS5tYW5pZmVzdF92ZXJzaW9uPT09Myl7bGV0IGU9Yy5ydW50aW1lLmdldFVSTChcIi9fX3BsYXNtb19obXJfcHJveHlfXz91cmw9XCIpO2dsb2JhbFRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImZldGNoXCIsZnVuY3Rpb24odCl7bGV0IG89dC5yZXF1ZXN0LnVybDtpZihvLnN0YXJ0c1dpdGgoZSkpe2xldCBzPW5ldyBVUkwoZGVjb2RlVVJJQ29tcG9uZW50KG8uc2xpY2UoZS5sZW5ndGgpKSk7cy5ob3N0bmFtZT09PW4uaG9zdCYmcy5wb3J0PT09YCR7bi5wb3J0fWA/KHMuc2VhcmNoUGFyYW1zLnNldChcInRcIixEYXRlLm5vdygpLnRvU3RyaW5nKCkpLHQucmVzcG9uZFdpdGgoZmV0Y2gocykudGhlbihyPT5uZXcgUmVzcG9uc2Uoci5ib2R5LHtoZWFkZXJzOntcIkNvbnRlbnQtVHlwZVwiOnIuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIik/P1widGV4dC9qYXZhc2NyaXB0XCJ9fSkpKSk6dC5yZXNwb25kV2l0aChuZXcgUmVzcG9uc2UoXCJQbGFzbW8gSE1SXCIse3N0YXR1czoyMDAsc3RhdHVzVGV4dDpcIlRlc3RpbmdcIn0pKX19KX1mdW5jdGlvbiBFKGUsdCl7bGV0e21vZHVsZXM6b309ZTtyZXR1cm4gbz8hIW9bdF06ITF9ZnVuY3Rpb24gQyhlPWQoKSl7bGV0IHQ9eCgpO3JldHVybmAke24uc2VjdXJlfHxsb2NhdGlvbi5wcm90b2NvbD09PVwiaHR0cHM6XCImJiEvbG9jYWxob3N0fDEyNy4wLjAuMXwwLjAuMC4wLy50ZXN0KHQpP1wid3NzXCI6XCJ3c1wifTovLyR7dH06JHtlfS9gfWZ1bmN0aW9uIEwoZSl7dHlwZW9mIGUubWVzc2FnZT09XCJzdHJpbmdcIiYmeShcIltwbGFzbW8vcGFyY2VsLXJ1bnRpbWVdOiBcIitlLm1lc3NhZ2UpfWZ1bmN0aW9uIFQoZSl7aWYodHlwZW9mIGdsb2JhbFRoaXMuV2ViU29ja2V0PlwidVwiKXJldHVybjtsZXQgdD1uZXcgV2ViU29ja2V0KEMoTnVtYmVyKGQoKSkrMSkpO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsYXN5bmMgZnVuY3Rpb24obyl7bGV0IHM9SlNPTi5wYXJzZShvLmRhdGEpO2F3YWl0IGUocyl9KSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLEwpLHR9ZnVuY3Rpb24gQShlKXtpZih0eXBlb2YgZ2xvYmFsVGhpcy5XZWJTb2NrZXQ+XCJ1XCIpcmV0dXJuO2xldCB0PW5ldyBXZWJTb2NrZXQoQygpKTtyZXR1cm4gdC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLGFzeW5jIGZ1bmN0aW9uKG8pe2xldCBzPUpTT04ucGFyc2Uoby5kYXRhKTtpZihzLnR5cGU9PT1cInVwZGF0ZVwiJiZhd2FpdCBlKHMuYXNzZXRzKSxzLnR5cGU9PT1cImVycm9yXCIpZm9yKGxldCByIG9mIHMuZGlhZ25vc3RpY3MuYW5zaSl7bGV0IGw9ci5jb2RlZnJhbWV8fHIuc3RhY2s7ZihcIltwbGFzbW8vcGFyY2VsLXJ1bnRpbWVdOiBcIityLm1lc3NhZ2UrYFxuYCtsK2BcblxuYCtyLmhpbnRzLmpvaW4oYFxuYCkpfX0pLHQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsTCksdC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCgpPT57dihgW3BsYXNtby9wYXJjZWwtcnVudGltZV06IENvbm5lY3RlZCB0byBITVIgc2VydmVyIGZvciAke24uZW50cnlGaWxlUGF0aH1gKX0pLHQuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsKCk9PntmKGBbcGxhc21vL3BhcmNlbC1ydW50aW1lXTogQ29ubmVjdGlvbiB0byB0aGUgSE1SIHNlcnZlciBpcyBjbG9zZWQgZm9yICR7bi5lbnRyeUZpbGVQYXRofWApfSksdH12YXIgdz1tb2R1bGUuYnVuZGxlLnBhcmVudCxhPXtidWlsZFJlYWR5OiExLGJnQ2hhbmdlZDohMSxjc0NoYW5nZWQ6ITEscGFnZUNoYW5nZWQ6ITEsc2NyaXB0UG9ydHM6bmV3IFNldCxwYWdlUG9ydHM6bmV3IFNldH07YXN5bmMgZnVuY3Rpb24gcChlPSExKXtpZihlfHxhLmJ1aWxkUmVhZHkmJmEucGFnZUNoYW5nZWQpe2koXCJCR1NXIFJ1bnRpbWUgLSByZWxvYWRpbmcgUGFnZVwiKTtmb3IobGV0IHQgb2YgYS5wYWdlUG9ydHMpdC5wb3N0TWVzc2FnZShudWxsKX1pZihlfHxhLmJ1aWxkUmVhZHkmJihhLmJnQ2hhbmdlZHx8YS5jc0NoYW5nZWQpKXtpKFwiQkdTVyBSdW50aW1lIC0gcmVsb2FkaW5nIENTXCIpO2xldCB0PWF3YWl0IGM/LnRhYnMucXVlcnkoe2FjdGl2ZTohMH0pO2ZvcihsZXQgbyBvZiBhLnNjcmlwdFBvcnRzKXtsZXQgcz10LnNvbWUocj0+ci5pZD09PW8uc2VuZGVyLnRhYj8uaWQpO28ucG9zdE1lc3NhZ2Uoe19fcGxhc21vX2NzX2FjdGl2ZV90YWJfXzpzfSl9Yy5ydW50aW1lLnJlbG9hZCgpfX1pZighd3x8IXcuaXNQYXJjZWxSZXF1aXJlKXtiKCk7bGV0IGU9QShhc3luYyB0PT57aShcIkJHU1cgUnVudGltZSAtIE9uIEhNUiBVcGRhdGVcIiksYS5iZ0NoYW5nZWR8fD10LmZpbHRlcihzPT5zLmVudkhhc2g9PT1uLmVudkhhc2gpLnNvbWUocz0+RShtb2R1bGUuYnVuZGxlLHMuaWQpKTtsZXQgbz10LmZpbmQocz0+cy50eXBlPT09XCJqc29uXCIpO2lmKG8pe2xldCBzPW5ldyBTZXQodC5tYXAobD0+bC5pZCkpLHI9T2JqZWN0LnZhbHVlcyhvLmRlcHNCeUJ1bmRsZSkubWFwKGw9Pk9iamVjdC52YWx1ZXMobCkpLmZsYXQoKTthLmJnQ2hhbmdlZHx8PXIuZXZlcnkobD0+cy5oYXMobCkpfXAoKX0pO2UuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwoKT0+e2xldCB0PXNldEludGVydmFsKCgpPT5lLnNlbmQoXCJwaW5nXCIpLDI0ZTMpO2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsKCk9PmNsZWFySW50ZXJ2YWwodCkpfSksZS5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIixhc3luYygpPT57YXdhaXQgaygpLHAoITApfSl9VChhc3luYyBlPT57c3dpdGNoKGkoXCJCR1NXIFJ1bnRpbWUgLSBPbiBCdWlsZCBSZXBhY2thZ2VkXCIpLGUudHlwZSl7Y2FzZVwiYnVpbGRfcmVhZHlcIjp7YS5idWlsZFJlYWR5fHw9ITAscCgpO2JyZWFrfWNhc2VcImNzX2NoYW5nZWRcIjp7YS5jc0NoYW5nZWR8fD0hMCxwKCk7YnJlYWt9fX0pO2MucnVudGltZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoZnVuY3Rpb24oZSl7bGV0IHQ9ZS5uYW1lLnN0YXJ0c1dpdGgoUCksbz1lLm5hbWUuc3RhcnRzV2l0aChTKTtpZih0fHxvKXtsZXQgcz10P2EucGFnZVBvcnRzOmEuc2NyaXB0UG9ydHM7cy5hZGQoZSksZS5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoKCk9PntzLmRlbGV0ZShlKX0pLGUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uKHIpe2koXCJCR1NXIFJ1bnRpbWUgLSBPbiBzb3VyY2UgY2hhbmdlZFwiLHIpLHIuX19wbGFzbW9fY3NfY2hhbmdlZF9fJiYoYS5jc0NoYW5nZWR8fD0hMCksci5fX3BsYXNtb19wYWdlX2NoYW5nZWRfXyYmKGEucGFnZUNoYW5nZWR8fD0hMCkscCgpfSl9fSk7Yy5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbih0KXtyZXR1cm4gdC5fX3BsYXNtb19mdWxsX3JlbG9hZF9fJiYoaShcIkJHU1cgUnVudGltZSAtIE9uIHRvcC1sZXZlbCBjb2RlIGNoYW5nZWRcIikscCgpKSwhMH0pO1xuIiwiaW1wb3J0IFwiLi4vLi4vLi4vYmFja2dyb3VuZFwiIiwiLy8gYmFja2dyb3VuZC50c1xuXG4vLyBodHRwczovLzE5Mi4xNjguMTguMTI0OjkwMDAvICwgaHR0cHM6Ly8xNzIuMjAuMTAuNDo5MDAwL2V4dHJhY3QteWxvY2F0aW9uc1xuY29uc3QgQVBJX0JBU0VfVVJMID0gXCJodHRwOi8vbG9jYWxob3N0OjgwMDBcIjtcbi8vIOqwnOuwnCDspJHsnbggcGluZC13ZWItbWFw7J2YIOyjvOyGjFxuY29uc3QgV0VCX01BUF9CQVNFX1VSTCA9IFwiaHR0cDovL2xvY2FsaG9zdDo1MTczXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NBbmRTaG93TWFwKHlvdXR1YmVVcmw6IHN0cmluZywgand0VG9rZW4/OiBzdHJpbmcsIHRva2VuVHlwZT86IHN0cmluZykge1xuICBjb25zb2xlLmxvZyhcIuuwseq3uOudvOyatOuTnDogcHJvY2Vzc0FuZFNob3dNYXAg7ZWo7IiYIOyLpO2WiS4gVVJMOlwiLCB5b3V0dWJlVXJsLCBcIkpXVDpcIiwgand0VG9rZW4gPyBcIuyeiOydjFwiIDogXCLsl4bsnYxcIik7XG4gIHRyeSB7XG4gICAgbGV0IGFwaVVybCA9IGAke0FQSV9CQVNFX1VSTH0vYXBpL3YxL3lvdXR1YmUvcHJvY2Vzc2A7XG4gICAgY29uc3QgaGVhZGVyczogSGVhZGVyc0luaXQgPSB7XG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICB9O1xuXG4gICAgaWYgKGp3dFRva2VuICYmIHRva2VuVHlwZSkge1xuICAgICAgLy8g66Gc6re47J24IOyCrOyaqeyekFxuICAgICAgaGVhZGVyc1tcIkF1dGhvcml6YXRpb25cIl0gPSBgJHt0b2tlblR5cGV9ICR7and0VG9rZW59YDtcbiAgICAgIGNvbnNvbGUubG9nKGDrsLHqt7jrnbzsmrTrk5w6IOuhnOq3uOyduCDsgqzsmqnsnpDsmqkgRmFzdEFQSSDshJzrsoQoJHthcGlVcmx9KeyXkCDsnqXshowg7LaU7LacIOyalOyyrS4uLmApO1xuICAgICAgY29uc29sZS5sb2coXCLrsLHqt7jrnbzsmrTrk5w6IOyalOyyrSDtl6TrjZQgKOuhnOq3uOyduCk6XCIpO1xuICAgICAgY29uc29sZS5sb2coaGVhZGVycyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOu5hOuhnOq3uOyduCDsgqzsmqnsnpBcbiAgICAgIGFwaVVybCA9IGAke0FQSV9CQVNFX1VSTH0vYXBpL3YxL3lvdXR1YmUvd2l0aG91dC1sb2dpbi9wcm9jZXNzYDtcbiAgICAgIGNvbnNvbGUubG9nKGDrsLHqt7jrnbzsmrTrk5w6IOu5hOuhnOq3uOyduCDsgqzsmqnsnpDsmqkgRmFzdEFQSSDshJzrsoQoJHthcGlVcmx9KeyXkCDsnqXshowg7LaU7LacIOyalOyyrS4uLmApO1xuICAgICAgY29uc29sZS5sb2coXCLrsLHqt7jrnbzsmrTrk5w6IOyalOyyrSDtl6TrjZQgKOu5hOuhnOq3uOyduCk6XCIpO1xuICAgICAgY29uc29sZS5sb2coaGVhZGVycyk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCLrsLHqt7jrnbzsmrTrk5w6IOyEnOuyhOuhnCBmZXRjaCDsmpTssq0g7Iuc7J6RLi4uXCIpO1xuICAgIGNvbnNvbGUubG9nKFwi67Cx6re465287Jq065OcOiDsmpTssq0gVVJMOlwiLCBhcGlVcmwpO1xuICAgIGNvbnNvbGUubG9nKFwi67Cx6re465287Jq065OcOiDsmpTssq0g7Zek642UOlwiLCBoZWFkZXJzKTtcbiAgICBjb25zb2xlLmxvZyhcIuuwseq3uOudvOyatOuTnDog7JqU7LKtIOuzuOusuDpcIiwgSlNPTi5zdHJpbmdpZnkoeyB1cmw6IHlvdXR1YmVVcmwgfSkpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYXBpVXJsLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXJsOiB5b3V0dWJlVXJsIH0pLFxuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKFwi67Cx6re465287Jq065OcOiBmZXRjaCDsnZHri7Ug7IiY7IugLiDsg4Htg5w6XCIsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG5cbiAgICAvLyA0LiDsnZHri7Ug67O466y47J2EIO2VnCDrsojrp4wg7J297Ja07IScIOuzgOyImOyXkCDsoIDsnqXtlanri4jri6QuXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBjb25zb2xlLmxvZyhcIuuwseq3uOudvOyatOuTnDog7J2R64u1IOuNsOydtO2EsDpcIiwgZGF0YSk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAvLyDsi6TtjKgg7IucLCDsnbTrr7gg7J297J2AIOuNsOydtO2EsOyXkOyEnCDsl5Drn6wg66mU7Iuc7KeA66W8IOyCrOyaqe2VqeuLiOuLpC5cbiAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLmRldGFpbCB8fCBg67Cx7JeU65OcIOyEnOuyhCDsmKTrpZg6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBsb2NhdGlvbnMgPSBkYXRhOyAvLyDshLHqs7Ug7IucLCDsoIDsnqXrkJwg642w7J207YSw66W8IOyCrOyaqe2VqeuLiOuLpC5cbiAgICBjb25zb2xlLmxvZyhcIuuwseq3uOudvOyatOuTnDog7ISc67KE66Gc67aA7YSwIOyepeyGjCDrjbDsnbTthLAg7IiY7IugIOyZhOujjFwiLCBsb2NhdGlvbnMpO1xuXG4gICAgLy8gNi4gUmVhY3Qg7Ju5IOyVseydhCDsl7Tqs6AsIOuwm+ydgCBKU09OIOuNsOydtO2EsOulvCBVUkwg7YyM652866+47YSw66GcIOyghOuLrO2VqeuLiOuLpC5cbiAgICBjb25zdCBsb2NhdGlvbnNEYXRhID0gSlNPTi5zdHJpbmdpZnkobG9jYXRpb25zKTtcbiAgICBjb25zdCBmaW5hbFVybCA9IGAke1dFQl9NQVBfQkFTRV9VUkx9P2xvY2F0aW9ucz0ke2VuY29kZVVSSUNvbXBvbmVudChsb2NhdGlvbnNEYXRhKX1gO1xuICAgIGNvbnNvbGUubG9nKFwi67Cx6re465287Jq065OcOiDstZzsooUg7Ju566e1IFVSTDpcIiwgZmluYWxVcmwpO1xuXG4gICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBmaW5hbFVybCB9KTtcblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCLrsLHqt7jrnbzsmrTrk5wg7LKY66asIOykkSDsmKTrpZgg67Cc7IOdOlwiLCBlcnJvcik7XG4gICAgIC8vIOyCrOyaqeyekOyXkOqyjCDsmKTrpZjrpbwg7JWM66as64qUIOuNsOyKpO2BrO2GsSDslYzrprzsnYQg7ZGc7Iuc7ZWp64uI64ukLlxuICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNyZWF0ZSh7XG4gICAgICB0eXBlOiBcImJhc2ljXCIsXG4gICAgICBpY29uVXJsOiBcImFzc2V0cy9pY29uLTEyOC5wbmdcIiwgLy8gMTI4eDEyOCDslYTsnbTsvZgg6rK966GcXG4gICAgICB0aXRsZTogXCJQaW5kIOyymOumrCDsmKTrpZhcIixcbiAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCLsnqXshowg7LaU7LacIOykkSDslYwg7IiYIOyXhuuKlCDsmKTrpZjqsIAg67Cc7IOd7ZaI7Iq164uI64ukLlwiXG4gICAgfSk7XG4gIH1cbn1cblxuLy8gY29udGVudC50c3gg65iQ64qUIHBvcHVwLnRzeOuhnOu2gO2EsCDrqZTsi5zsp4Drpbwg67Cb6riwIOychO2VnCDrpqzsiqTrhIhcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gXCJoYW5kbGVJY29uQ2xpY2tcIikge1xuICAgIGNvbnNvbGUubG9nKGDrsLHqt7jrnbzsmrTrk5w6ICR7bWVzc2FnZS50eXBlfSDsnbTrsqTtirgg7IiY7IugLmApO1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBsb2NhbFJlc3VsdCA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ2p3dFRva2VuJywgJ3Rva2VuVHlwZSddKTtcbiAgICAgIGNvbnN0IHNlc3Npb25SZXN1bHQgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLmdldCgnaGFzU2tpcHBlZExvZ2luJyk7XG5cbiAgICAgIGlmIChsb2NhbFJlc3VsdC5qd3RUb2tlbiB8fCBzZXNzaW9uUmVzdWx0Lmhhc1NraXBwZWRMb2dpbikge1xuICAgICAgICAvLyDroZzqt7jsnbjsnbQg65CY7Ja0IOyeiOqxsOuCmCwg67mE7ZqM7JuQIOuhnOq3uOyduOydhCDshKDtg53tlZwg6rK97JqwXG4gICAgICAgIGNvbnNvbGUubG9nKFwi67Cx6re465287Jq065OcOiDroZzqt7jsnbgg65iQ64qUIOu5hO2ajOybkCDroZzqt7jsnbgg7IOB7YOcIO2ZleyduC4g7KeA64+EIO2RnOyLnCDroZzsp4Eg7Iuk7ZaJLi4uXCIpO1xuICAgICAgICBwcm9jZXNzQW5kU2hvd01hcChtZXNzYWdlLnVybCwgbG9jYWxSZXN1bHQuand0VG9rZW4sIGxvY2FsUmVzdWx0LnRva2VuVHlwZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyDroZzqt7jsnbjrj4QsIOu5hO2ajOybkCDroZzqt7jsnbjrj4Qg7JWE64uMIOqyveyasCDtjJ3sl4XsnYQg652E7JuB64uI64ukLlxuICAgICAgICBjb25zb2xlLmxvZyhcIuuwseq3uOudvOyatOuTnDog66Gc6re47J24IOygleuztCDsl4bsnYwuIGNocm9tZS5hY3Rpb24ub3BlblBvcHVwKCkg7Zi47LacLi4uXCIpO1xuICAgICAgICBjaHJvbWUuYWN0aW9uLm9wZW5Qb3B1cCgpO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7IC8vIOu5hOuPmeq4sCDsspjrpqzrpbwg7JyE7ZW0IHRydWUg67CY7ZmYXG4gIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSBcInNob3dNYXBcIikge1xuICAgIC8vIO2MneyXheyXkOyEnCBcIuyngOuPhCDrs7TquLBcIiDrsoTtirzsnYQg7YG066at7ZaI7J2EIOuVjCAo66Gc6re47J24IOuYkOuKlCDruYTtmozsm5ApXG4gICAgY29uc29sZS5sb2coYOuwseq3uOudvOyatOuTnDogJHttZXNzYWdlLnR5cGV9IOydtOuypO2KuCDsiJjsi6AuIOyngOuPhCDtkZzsi5wg66Gc7KeBIOyLpO2WiS4uLmApO1xuICAgIHByb2Nlc3NBbmRTaG93TWFwKG1lc3NhZ2UudXJsLCBtZXNzYWdlLmp3dFRva2VuLCBtZXNzYWdlLnRva2VuVHlwZSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pOyJdLCJuYW1lcyI6W10sInZlcnNpb24iOjMsImZpbGUiOiJpbmRleC5qcy5tYXAifQ==
 globalThis.define=__define;  })(globalThis.define);