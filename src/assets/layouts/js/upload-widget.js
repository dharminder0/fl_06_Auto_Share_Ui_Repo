! function (e) {
    "use strict";
    "function" == typeof define && define.amd ? define([], e) : e()
  }(function () {
    "use strict";
    var e, t, i, n = 0,
      o = "149",
      a = window.location.search.indexOf("debug=true") > -1,
      d = window.location.search.indexOf("dev=true") > -1;
    window.jQuery ? i = window.jQuery : window.$ && window.$.fn && window.$.fn.jquery && (i = window.$);
    var r = function (e) {
        if (null == e || "object" != typeof e || e.tagName) return e;
        var t = e.constructor();
        for (var i in e) t[i] = r(e[i]);
        return t
      },
      l = function (e, t) {
        return t = r(t), t.kind = e, JSON.stringify(t)
      },
      c = function (e) {
        return JSON.parse(e)
      },
      u = function () {
        try {
          var e = document.createElement("style");
          e.type = "text/css", e.innerHTML = ".cloudinary-thumbnails { list-style: none; margin: 10px 0; padding: 0 } .cloudinary-thumbnails:after { clear: both; display: block; content: '' } .cloudinary-thumbnail { float: left; padding: 0; margin: 0 15px 5px 0; display: none } .cloudinary-thumbnail.active { display: block } .cloudinary-thumbnail img { border: 1px solid #01304d; border-radius: 2px; -moz-border-radius: 2px; -webkit-border-radius: 2px } .cloudinary-thumbnail span { font-size: 11px; font-family: Arial, sans-serif; line-height: 14px; border: 1px solid #aaa; max-width: 150px; word-wrap: break-word; word-break: break-all; display: inline-block; padding: 3px; max-height: 60px; overflow: hidden; color: #999; } .cloudinary-delete { vertical-align: top; font-size: 13px; text-decoration: none; padding-left: 2px; line-height: 8px; font-family: Arial, sans-serif; color: #01304d }.cloudinary-button { color: #fefeff; text-decoration: none; font-size: 18px; line-height: 28px; height: 28x; border-radius: 6px; -moz-border-radius: 6px; -webkit-border-radius: 6px; font-weight: normal; text-decoration: none;   display: inline-block; padding: 4px 30px 4px 30px; background: #0284cf; font-family: Helvetica, Arial, sans-serif;   background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAyODRjZiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMjU5OGIiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);   background: -moz-linear-gradient(top,  #0284cf 0%, #02598b 100%);   background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#0284cf), color-stop(100%,#02598b));   background: -webkit-linear-gradient(top,  #0284cf 0%,#02598b 100%);   background: -o-linear-gradient(top,  #0284cf 0%,#02598b 100%);   background: -ms-linear-gradient(top,  #0284cf 0%,#02598b 100%);   background: linear-gradient(to bottom,  #0284cf 0%,#02598b 100%);   filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0284cf', endColorstr='#02598b',GradientType=0 ); }.cloudinary-button:hover { background: #02598b;   background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAyNTk4YiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMjg0Y2YiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);   background: -moz-linear-gradient(top,  #02598b 0%, #0284cf 100%);   background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#02598b), color-stop(100%,#0284cf));   background: -webkit-linear-gradient(top,  #02598b 0%,#0284cf 100%);   background: -o-linear-gradient(top,  #02598b 0%,#0284cf 100%);   background: -ms-linear-gradient(top,  #02598b 0%,#0284cf 100%);   background: linear-gradient(to bottom,  #02598b 0%,#0284cf 100%);   filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#02598b', endColorstr='#0284cf',GradientType=0 ); ";
          var t = document.getElementsByTagName("head")[0];
          t && t.appendChild(e)
        } catch (e) {
          console && console.log && console.log("Cannot initialize stylesheet: " + e)
        }
      };
    u();
    var s = function (u, s) {
      var g, p, f, b = n++,
        m = r(u),
        y = m.element,
        w = !!m.inline_container,
        h = !1,
        I = !1;
      delete m.element, m.widget_id = b;
      var v = function () {
          m.cloud_name || (m.cloud_name = e), !m.api_key && t && (m.api_key = t), m.secure = m.secure || "https:" === document.location.protocol, m.requireSignature = !!m.upload_signature;
          (function () {
            for (var e = !!m.upload_signature, t = e ? ["api_key", "cloud_name"] : ["cloud_name", "upload_preset"], i = 0; i < t.length; i++)
              if (!m[t[i]]) throw "Missing required option: " + t[i]
          })();
          g = window.document.createElement("iframe");
          var i = m.secure ? "https:" : "http:",
            n = [];
          a && n.push("debug=true"), d && n.push("dev=true"), w && n.push("inline=true"), m.cloud_name && n.push("cloud_name=" + m.cloud_name), f = m.widgetHost || i + "//widget.cloudinary.com/n/" + m.cloud_name + "/" + o + "/index.html", g.setAttribute("src", f + "?" + n.join("&")), g.setAttribute("width", "100%"), g.setAttribute("height", "100%"), g.setAttribute("frameborder", "no"), g.setAttribute("allow", "camera"), g.style.display = "none", g.style.width = "100%", g.style.border = "none", w ? g.style.height = "520px" : (g.style.position = "fixed", g.style.top = "0px", g.style.left = "0px", g.style.height = "100%", g.style.background = "transparent", g.style.zIndex = "1000000"), x(g, "load", function () {
            A("init", m), I = !0, h && (g.style.display = "block", g.focus(), A("open", {}))
          }), x(window, "message", _);
          var r = function () {
              if (!w) return document.body;
              if ("string" == typeof m.inline_container) {
                var e = document.querySelector(m.inline_container);
                if (e) return e;
                throw "Element Not Found (" + m.inline_container + ")"
              }
              return m.inline_container
            },
            l = r();
          l.appendChild(g), w || x(window.document, "keyup", function (e) {
            27 == e.keyCode && S()
          }), y && k()
        },
        k = function () {
          y.style.display = "none";
          var e = window.document.createElement("a");
          e.setAttribute("class", m.button_class || "cloudinary-button"), e.setAttribute("href", "#"), e.innerHTML = m.button_caption || "Upload image", y.parentNode.insertBefore(e, y.previousSibling), x(e, "click", function (e) {
            return C(), e && e.preventDefault && e.preventDefault(), e && e.stopPropagation && e.stopPropagation(), !1
          }), !m.field_name && y.getAttribute("name") && "" != y.getAttribute("name") && (m.field_name = y.getAttribute("name"))
        },
        x = function (e, t, i) {
          e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent("on" + t, i)
        },
        C = function (e) {
          h = !0, p = window.document.body.style.overflow, w || (window.document.body.style.overflow = "hidden"), I && (g.style.display = "block", g.focus(), A("open", e || {}))
        },
        _ = function (e) {
          if (e.origin.match(/cloudinary\.com/)) {
            var t;
            try {
              t = c(e.data)
            } catch (e) {
              return
            }
            if (t.widget_id == b) switch (t.kind) {
              case "fileuploadsuccess":
                i && i(y || m.form || document).trigger("cloudinarywidgetfileuploadsuccess", [t.result]);
                break;
              case "success":
                m.keep_widget_open || w || S(), M(t.result), s && s(null, t.result), i && i(y || m.form || document).trigger("cloudinarywidgetsuccess", [t.result]);
                break;
              case "fileuploadfail":
                w && s && s(t), i && i(y || m.form || document).trigger("cloudinarywidgetfileuploadfail", [t.result]);
                break;
              case "error":
                m.keep_widget_open || w || S(), s && s(t), i && i(y || m.form || document).trigger("cloudinarywidgeterror", t);
                break;
              case "closed":
                S();
                var n = {
                  message: "User closed widget"
                };
                s && s(n), i && i(y || m.form || document).trigger("cloudinarywidgetclosed", n);
                break;
              case "get-signature":
                var o = m.upload_signature;
                if ("string" == typeof o) A("signature", {
                  signature: o
                });
                else if ("function" == typeof o) {
                  var a = r(t);
                  delete a.widget_id, delete a.kind, delete a.file, o(function (e) {
                    A("signature", {
                      signature: e
                    })
                  }, a)
                }
            }
          }
        },
        A = function (e, t) {
          g.contentWindow.postMessage(l(e, t), f)
        },
        S = function () {
          g.style.display = "none", window.document.body.style.overflow = p, h = !1
        },
        M = function (e) {
          if (i) {
            var t = m.form;
            !t && t !== !1 && y && (t = i(y).closest("form"));
            var n = m.field_name || "image";
            if (t && t.length && (i(t).find('input[name="' + n + '"]').remove(), i.each(e, function (e, o) {
                var a = [o.resource_type, o.type, o.path].join("/") + "#" + o.signature;
                i("<input />").addClass("cloudinary-hidden-field").attr({
                  type: "hidden",
                  name: n,
                  "data-cloudinary-public-id": o.public_id
                }).val(a).data("cloudinary", o).appendTo(t)
              })), m.thumbnails !== !1 && (m.thumbnails || y)) {
              var o = i("<ul></ul>").addClass("cloudinary-thumbnails");
              i.each(e, function (e, t) {
                var n = i("<li></li>").addClass("cloudinary-thumbnail").data("cloudinary", t);
                t.thumbnail_url ? n.append(i("<img />").attr("src", t.thumbnail_url)) : n.append(i("<span></span>").text(t.public_id)), t.delete_token && n.append(i("<a></a>").addClass("cloudinary-delete").attr("href", "#").text("Ã—")), n.find("img").on("load", function () {
                  n.addClass("active")
                }), o.append(n)
              }), o.find("li").length > 0 && (m.thumbnails ? i(m.thumbnails).append(o) : i(y).after(o)), o.find(".cloudinary-delete").click(function (e) {
                e.preventDefault();
                var o = i(this).parents(".cloudinary-thumbnail").data("cloudinary"),
                  a = Z(o.delete_token);
                if (a && a.always(function (e) {
                    200 == e.status && i(y || m.form || document).trigger("cloudinarywidgetdeleted", o)
                  }), i(this).parents(".cloudinary-thumbnail").hide("slow"), t) {
                  var d = i(t).find('input[name="' + n + '"][data-cloudinary-public-id="' + o.public_id + '"].cloudinary-hidden-field');
                  i(t).find('input[name="' + n + '"].cloudinary-hidden-field').length > 1 ? i(d).remove() : i(d).attr("data-cloudinary-public-id", "").val("").data("cloudinary", null)
                }
              })
            }
          }
        },
        Z = function (e, t) {
          if (i) {
            t = t || {};
            var n = t.url;
            n || (n = "https://api.cloudinary.com/v1_1/" + m.cloud_name + "/delete_by_token");
            var o = i.support.xhrFileUpload ? "json" : "iframe json";
            return i.ajax({
              url: n,
              method: "POST",
              data: {
                token: e
              },
              headers: {
                "X-Requested-With": "XMLHttpRequest"
              },
              dataType: o
            })
          }
        };
      return v(), {
        open: function (e) {
          return C(e), this
        },
        close: S
      }
    };
    window.cloudinary = window.cloudinary || {}, window.cloudinary.openUploadWidget = function (e, t) {
      return s(e, t).open()
    }, window.cloudinary.createUploadWidget = function (e, t) {
      return s(e, t)
    }, window.cloudinary.applyUploadWidget = function (e, t, i) {
      var n = r(t);
      return n.element = e, s(n, i)
    }, window.cloudinary.setCloudName = function (t) {
      e = t
    }, window.cloudinary.setAPIKey = function (e) {
      t = e
    }, i && (i.fn.cloudinary_upload_widget = function (e, t) {
      window.cloudinary.applyUploadWidget(i(this)[0], e, t)
    })
  });
  