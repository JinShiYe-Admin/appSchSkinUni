! function(t, e) {
	"object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define &&
		define.amd ? define([], e) : "object" == typeof exports ? exports.PED = e() : t.PED = e()
}(window, function() {
	return function(t) {
		var e = {};

		function o(n) {
			if (e[n]) return e[n].exports;
			var i = e[n] = {
				i: n,
				l: !1,
				exports: {}
			};
			return t[n].call(i.exports, i, i.exports, o), i.l = !0, i.exports
		}
		return o.m = t, o.c = e, o.d = function(t, e, n) {
			o.o(t, e) || Object.defineProperty(t, e, {
				enumerable: !0,
				get: n
			})
		}, o.r = function(t) {
			"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol
				.toStringTag, {
					value: "Module"
				}), Object.defineProperty(t, "__esModule", {
				value: !0
			})
		}, o.t = function(t, e) {
			if (1 & e && (t = o(t)), 8 & e) return t;
			if (4 & e && "object" == typeof t && t && t.__esModule) return t;
			var n = Object.create(null);
			if (o.r(n), Object.defineProperty(n, "default", {
					enumerable: !0,
					value: t
				}), 2 & e && "string" != typeof t)
				for (var i in t) o.d(n, i, function(e) {
					return t[e]
				}.bind(null, i));
			return n
		}, o.n = function(t) {
			var e = t && t.__esModule ? function() {
				return t.default
			} : function() {
				return t
			};
			return o.d(e, "a", e), e
		}, o.o = function(t, e) {
			return Object.prototype.hasOwnProperty.call(t, e)
		}, o.p = "", o(o.s = 0)
	}([function(t, e, o) {
		"use strict";
		o.r(e);
		var n = {
			img: {
				_width: 0,
				_height: 0,
				_WH: 0,
				_HW: 0
			},
			device: {
				_width: 0,
				_height: 0
			},
			boxSize: {
				_width: 0,
				_height: 0
			},
			operateType: 0,
			imgInstance: null,
			canvas: {},
			textBox: {},
			textInput: {},
			textOperateIndex: 0,
			textIndex: 0,
			inputArray: [],
			inputDomArray: [],
			canvasParentDom: null,
			canvasGrandDom: null,
			pictureEditBox: null,
			canvasContext: {},
			paintingArray: []
		};

		function i(t) {
			return function(t) {
				if (Array.isArray(t)) {
					for (var e = 0, o = new Array(t.length); e < t.length; e++) o[e] = t[e];
					return o
				}
			}(t) || function(t) {
				if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype
					.toString.call(t)) return Array.from(t)
			}(t) || function() {
				throw new TypeError("Invalid attempt to spread non-iterable instance")
			}()
		}
		var a = 0;

		function r(t, e) {
			var o = t,
				n = document.createElement(e || "div");
			return n.innerHTML = o, n.firstChild
		}

		function s(t) {
			var e = {
					x: 0,
					y: 0
				},
				o = null,
				i = 1;
			a = (t.width / parseFloat(t.style.width)).toFixed(4);
			var r = n.canvasContext,
				s = n.canvasParentDom.offsetTop,
				l = n.canvasParentDom.offsetLeft;
			t.addEventListener("touchstart", function(t) {
				console.log('touchstart111')
				if (2 === t.touches.length) o = t.touches;
				else if (1 === t.touches.length && 1 == n.operateType) {
					p(e, t), r.beginPath(), r.lineWidth = 5;
					var i = (t.touches[0].pageX - l - document.body.scrollLeft + n
							.canvasGrandDom.scrollLeft) * a,
						c = (t.touches[0].pageY - s - document.body.scrollTop + n.canvasGrandDom
							.scrollTop) * a;
					r.moveTo(i, c), n.paintingArray.push({
						start: {
							x: i,
							y: c
						},
						moves: []
					})
				}
			}, !1), t.addEventListener("touchmove", function(d) {
				console.log('touchmove111')
				if (2 === d.touches.length) {
					console.log('touchmove22222')
					d.preventDefault(), c(), n.operateType = 0, b = o, w = d.touches, _ = u(b[
						0], b[1]), i = (u(w[0], w[1]) / _).toFixed(4), o = d.touches;
					var h = parseFloat(t.style.width),
						f = parseFloat(t.style.height),
						g = (h * i).toFixed(4),
						y = parseFloat((h * n.img._WH).toFixed(4));
					t.style.width = g + "px", t.style.height = y + "px", a = (t.width /
							parseFloat(g)).toFixed(4), s = n.canvasParentDom.offsetTop, l = n
						.canvasParentDom.offsetLeft,
						function() {
							var t = n.boxSize._height - parseFloat(n.canvas.style.height),
								e = n.boxSize._width - parseFloat(n.canvas.style.width);
							t > 0 ? n.canvasGrandDom.style.paddingTop = (t / 2).toFixed(4) +
								"px" : "0px" !== n.canvasGrandDom.style.paddingTop && (n
									.canvasGrandDom.style.paddingTop = "0px");
							e > 0 ? n.canvasGrandDom.style.paddingLeft = (e / 2).toFixed(4) +
								"px" : "0px" !== n.canvasGrandDom.style.paddingLeft && (n
									.canvasGrandDom.style.paddingLeft = "0px")
						}(), n.inputDomArray.length > 0 && n.inputDomArray.forEach(function(t) {
							t.style.fontSize = (parseFloat(t.style.fontSize) * i).toFixed(
								4) + "px", t.style.top = (parseFloat(t.style.top) / f * y)
								.toFixed(4) + "px", t.style.left = (parseFloat(t.style
									.left) / h * g).toFixed(4) + "px"
						})
				} else if (1 === d.touches.length && 1 == n.operateType) {
					console.log('touchmove33333333')
					d.preventDefault();
					var v = parseFloat((d.touches[0].pageX - l - document.body.scrollLeft + n
							.canvasGrandDom.scrollLeft) * a),
						m = parseFloat((d.touches[0].pageY - s - document.body.scrollTop + n
							.canvasGrandDom.scrollTop) * a);
					r.lineTo(v, m), r.strokeStyle='red',r.stroke(), p(e, d);
					var x = n.paintingArray.length - 1;
					n.paintingArray[x].moves.push({
						x: v,
						y: m
					})
				}
				// else if (1 === d.touches.length && 0 == n.operateType) {
				// 	console.log('touchmove444444')
				// 	d.preventDefault();
				// }
				var b, w, _
			}, {
				passive: !1
			})
		}

		function l() {
			n.textInput.addEventListener("blur", function() {
				var t = n.textInput.innerText.split(/[\n\r]+/);
				n.textBox.style.display = "none";
				if (t.length > 0) {
					if (n.inputArray.push(t), 0 == n.textOperateIndex) {
						for (var e = '<div style="position: absolute;font-size: '.concat("15px",
								';background-color: white;padding: 3px 5px;border-radius: 5px;white-space: nowrap">'
								), o = 0; o < t.length; o++) e = e + t[o] + "".concat(o == t
							.length - 1 ? "" : "</br>");
						var i = r(e += "</div>");
						n.canvasParentDom.appendChild(i);
						var a = i.offsetWidth,
							s = i.offsetHeight;
						i.style.top = (n.boxSize._height - s) / 2 + n.canvasGrandDom.scrollTop -
							parseFloat(n.canvasGrandDom.style.paddingTop || 0) + "px", i.style
							.left = (n.boxSize._width - a) / 2 + n.canvasGrandDom.scrollLeft -
							parseFloat(n.canvasGrandDom.style.paddingLeft || 0) + "px", n
							.inputDomArray.push(i),
							function(t) {
								var e = {
										x: 0,
										y: 0
									},
									o = {
										top: 0,
										left: 0
									};
								t.addEventListener("touchstart", function(n) {
									console.log('touchstart');
									n.preventDefault(), e.x = n.touches[0].pageX -
										document.body.scrollLeft, e.y = n.touches[0]
										.pageY - document.body.scrollTop, o.top =
										parseFloat(t.style.top), o.left = parseFloat(t
											.style.left)
								}, !1), t.addEventListener("touchmove", function(n) {
									console.log('touchmove');
									if (n.preventDefault(), 1 == n.touches.length) {
										var i = n.touches[0].pageX - document.body
											.scrollLeft - e.x,
											a = n.touches[0].pageY - document.body
											.scrollTop - e.y;
										e.x = n.touches[0].pageX - document.body
											.scrollLeft, e.y = n.touches[0].pageY -
											document.body.scrollTop;
										var r = o.left + i,
											s = o.top + a;
										o.top = s, o.left = r, t.style.left = r.toFixed(
												4) + "px", t.style.top = s.toFixed(4) +
											"px"
									} else n.touches.length
								}, !1)
							}(i)
					}
					n.textIndex++
				}
				n.textInput.innerText = "", n.textBox.style.display = "none", n.textInput.style
					.display = "none"
			})
		}

		function c() {
			var t = i(document.querySelectorAll(".picture-operate"))[0];
			console.log(t.style.color), "rgb(69, 148, 248)" == t.style.color && (t.firstChild.src =
				"../../img/markingPapers/painting.png", t.style.color = "white")
		}

		function d() {
			i(document.querySelectorAll(".picture-operate")).forEach(function(t) {
				t.addEventListener("click", function(t) {
					var e = t.currentTarget.getAttribute("operate");
					if (function(t) {
						if(t==1&&n.operateType==1){
							n.operateType = 0;
						}else{
							n.operateType = t;
						}
						}(e), 1 == e) {
							console.log('n.operateType:'+n.operateType)
						var o = t.currentTarget;
						if(n.operateType==0){
							c();
						}else{
							o.firstChild.src = "../../img/markingPapers/painting1.png", o.style
								.color = "#4594f8"
						}
					} else if (4 == e) h(), f(), n.paintingArray = [], c();
					else if (2 == e) n.textBox.style.display = "block", n.textInput
						.style.display = "inline-block", n.textInput.focus(), c();
					else if (3 == e) {
						if (n.paintingArray.length > 0) {
							h();
							var i = n.canvasContext;
							n.paintingArray.pop(), i.beginPath(), n.paintingArray
								.forEach(function(t) {
									i.moveTo(t.start.x, t.start.y), t.moves.forEach(
										function(t) {
											i.strokeStyle='red',
											i.lineTo(t.x, t.y)
										})
								}), i.stroke()
						}
						c()
					}
				}, !1)
			})
		}

		function p(t, e) {
			t.x = e.touches[0].pageX - document.body.scrollLeft, t.y = e.touches[0].pageY - document
				.body.scrollTop
		}

		function u(t, e) {
			var o = e.pageX - t.pageX,
				n = e.pageY - t.pageY;
			return Math.sqrt(o * o + n * n)
		}

		function h() {
			n.canvasContext.clearRect(0, 0, n.img._width, n.img._height), n.canvasContext.drawImage(n
				.imgInstance, 0, 0, n.img._width, n.img._height)
		}

		function f() {
			n.inputDomArray.forEach(function(t) {
				t.remove()
			}), n.inputDomArray = [], n.inputArray = []
		}

		function g(t, e) {
			for (var o = 0; o < e.length; o++) {
				var n = e[o];
				n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !
					0), Object.defineProperty(t, n.key, n)
			}
		}
		var y = function() {
			function t(e, o) {
				! function(t, e) {
					if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
				}(this, t), this.getImgInfo(e), this.getDeviceInfo(), this.saveFn = o
			}
			var e, o, i;
			return e = t, (o = [{
				key: "getImgInfo",
				value: function(t) {
					var e = new Image;
					e.crossOrigin = "anonymous";
					var o = this;
					e.onload = function() {
						var t = n.img;
						t._width = this.width, t._height = this.height, t._HW =
							(this.width / this.height).toFixed(4), t._WH = (this
								.height / this.width).toFixed(4), n
							.imgInstance = this, o.showImg()
					}, e.src = t
				}
			}, {
				key: "getDeviceInfo",
				value: function() {
					n.device._width = document.documentElement.clientWidth, n.device
						._height = document.documentElement.clientHeight
				}
			}, {
				key: "showImg",
				value: function() {
					document.getElementById("picture_edit_cancel") && n
						.pictureEditBox.remove();
					var t =
						"style=\"flex: 1;padding-top: 1rem\" class='picture-operate'",
						e = r(
							'<div style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;overflow: hidden;z-index: 997;background-color: white"><div id="picture_edit_cancel" style="position: absolute;left: 15px;top: 15px;padding: 5px 13px;background-color: #00CFBD;color: white;z-index: 2;border-radius: 3px">返回</div><div id="picture_edit_save" style="position: absolute;right: 15px;top: 15px;padding: 5px 13px;background-color: #00CFBD;color: white;z-index: 2;border-radius: 3px">保存</div><div style="width: 100%;height:calc(100% - 4rem);overflow: scroll;-webkit-overflow-scrolling: touch;overflow-scrolling: touch;box-sizing: border-box"><div style="position: relative">' +
							'<canvas id="picture_edit_canvas" width="'.concat(n.img
								._width, '" height="').concat(n.img._height,
								'" style="width: ').concat(n.device._width + "px",
								";height: ").concat(Math.floor(n.device._width * n
								.img._WH) + "px", '"></canvas>') +
							'</div></div><div style="position: absolute;bottom: 0;left: 0;right: 0;height: 4rem;background-color: black;display: flex;text-align: center;color: white">' +
							"<div ".concat(t, ' operate="1">') +
							'<img src="../../img/markingPapers/painting.png" style="width: 1.3rem;display: block;margin: auto;">批注</div>' +
							"<div ".concat(t, ' operate="3">') +
							'<img src="../../img/markingPapers/withdraw.png" style="width: 1.3rem;display: block;margin: auto"> 撤回</div>' +
							"<div ".concat(t, ' operate="4">') +
							'<img src="../../img/markingPapers/empty.png" style="width: 1.3rem;display: block;margin: auto"> 清空当前</div></div><div id="picture_edit_text" style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;overflow: hidden;z-index: 2;display: none;background-color: white;opacity: 0.93"></div><div id="picture_edit_input" contenteditable="true" tabindex="1" style="min-height:15%;border-radius: 5px;border: 2px solid #63eca1;outline: none;width: 96%;box-sizing: border-box;position: absolute;top: 8%;left: 2%;right: 2%;display: none;z-index: 2;padding: 3px 5px"></div></div>'
							);
					document.body.appendChild(e);
					var o = document.getElementById("picture_edit_canvas");
					! function(t, e, o) {
						n.canvas = t, n.canvasParentDom = t.parentElement, n
							.canvasGrandDom = t.parentElement.parentElement, n
							.canvasContext = t.getContext("2d"), n.textBox = e, n
							.pictureEditBox = e.parentElement, n.textInput = o, n
							.boxSize._height = n.canvasGrandDom.offsetHeight, n
							.boxSize._width = n.canvasGrandDom.offsetWidth
					}(o, document.getElementById("picture_edit_text"), document
						.getElementById("picture_edit_input"));
					var i = (n.boxSize._height - parseFloat(o.style.height))
						.toFixed(4);
					i > 0 && (n.canvasGrandDom.style.paddingTop = i / 2 + "px"), n
						.canvasContext.drawImage(n.imgInstance, 0, 0, o.width, o
							.height), s(o), l(), d(),
						function(t, e, o) {
							t.addEventListener("click", function() {
								var t, i, r, s, l, c, d, p, u = n
								.inputArray;
								if (u.length > 0) {
									for (var h = 0; h < u.length; h++) {
										var g = n.inputDomArray[h],
											y = parseFloat(g.style.left),
											v = parseFloat(g.style.top) /
											parseFloat(n.canvas.style
												.height) * n.img._height,
											m = parseFloat(g.style
											.fontSize) / parseFloat(n.canvas
												.style.height) * n.img
											._height;
										t = e, i = y * a, r = v, s =
											parseFloat(g.offsetWidth) * a,
											l = parseFloat(g.offsetHeight) *
											a, c = 5 * a, d = !0, p = !1, t
											.save(), t.beginPath(),t.strokeStyle='red', t
											.moveTo(i + c, r), t.arcTo(i +
												s, r, i + s, r + c, c), t
											.arcTo(i + s, r + l, i + s - c,
												r + l, c), t.arcTo(i, r + l,
												i, r + l - c, c), t.arcTo(i,
												r, i + c, r, c), d && t
											.fill(), p && t.stroke(), t
											.restore(), console.log(
												"scaleStyle===", a), e
											.fillStyle = "white", e.fill();
										for (var x = 0; x < u[h]
											.length; x++) e.fillStyle =
											"black", e.font = "".concat(m,
												"px helvetica"), e.fillText(
												u[h][x], (y + 5) * a, v + (
													x + 1) * (1.4 *
													parseFloat(g.style
														.fontSize)) * a)
									}
									f()
								}
								var b = n.canvas.toDataURL();
								o(b), n.pictureEditBox.style.display =
									"none", f(), n.paintingArray = [], n
									.operateType = 0
							}, !1)
						}(document.getElementById("picture_edit_save"), n
							.canvasContext, this.saveFn),
						function(t) {
							t.addEventListener("click", function() {
								n.pictureEditBox.style.display = "none",
								f(), n.paintingArray = [], n.operateType = 0
							}, !1)
						}(document.getElementById("picture_edit_cancel"))
				}
			}, {
				key: "showPED",
				value: function() {
					n.pictureEditBox.style.display = "block"
				}
			}]) && g(e.prototype, o), i && g(e, i), t
		}();
		o.d(e, "imageInfo", function() {
			return y
		}), o.d(e, "PED_GlOBAL", function() {
			return n
		})
	}])
});
