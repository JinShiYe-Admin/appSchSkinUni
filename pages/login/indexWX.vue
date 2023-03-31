<template>
	<view>
		<view v-show="showFlag >0">
			<view
				style="background-color: #F2F2F2;height: 30px;padding-left: 15px;padding-top: 5px;color: brown;font-size: 13px;">
				注意：已在学校登记相关信息的人员才能注册。</view>
			<view class="uni-list">
				<view class="uni-list-cell" style="height: 50px;">
					<view class="uni-list-cell-left">
						您的身份
					</view>
					<view v-if="utypeArray.length>0" class="uni-list-cell-db" style="margin-left: 10px;">
						<picker @change="changeSelectType" :disabled="disabledFlag==0?false:true" :value="utype_index"
							:range="utypeArray" range-key="type_name">
							<view class="uni-input">{{utypeArray[utype_index].type_name}}
								<uni-icons type="arrowdown" size="20" style="font-size: 15px;margin-left: 30px;">
								</uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left" style="width: 80px;">
						{{typeStr0}}姓名
					</view>
					<view class="uni-list-cell-db">
						<input :disabled="disabledFlag==0?false:true" v-model="userName" style="height: 50px;"
							maxlength="10" type="text" placeholder="请输入姓名" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left" style="width: 80px;">
						{{typeStr1}}电话
					</view>
					<view class="uni-list-cell-db">
						<input :disabled="disabledFlag==0?false:true" v-model="userPhone" style="height: 50px;"
							type="number" maxlength="11" placeholder="请输入电话" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left" style="width: 80px;">
						短信验证码
					</view>
					<view class="uni-list-cell-db">
						<input :disabled="disabledFlag==2?true:false" v-model="yanzm"
							style="height: 50px;float: left;width: 120px;" type="number" maxlength="6"
							placeholder="请输入验证码" />
						<button v-if="yanZMTime==60" :disabled="disabledFlag==2?true:false" @click="getYanzm"
							style="float: left;height: 36px;font-size: 15px;margin-top: 7px;"
							:class="disabledFlag==2?'btnDis1':'btnDis0'" class="mini-btn">获取验证码</button>
						<button v-if="yanZMTime<60" :disabled="yanZMTime<60?true:false"
							style="float: left;height: 36px;font-size: 15px;margin-top: 7px;"
							class="mini-btn">{{yanZMTime}}秒后重新获取</button>
					</view>
				</view>
			</view>
			<view class="button-sp-area" style="text-align: center;margin-top: 20px;">
				<button v-if="disabledFlag==1" :disabled="disabledFlag==1?false:true" @click="searchInfo"
					class="btnDis0" size="mini">查询</button>
				<button v-if="disabledFlag!=1" :disabled="disabledFlag==1?false:true" @click="searchInfo"
					size="mini">查询</button>
				<button @click="clearInput" style="background: #00CFBD;margin-left: 20px;color: white;" class="mini-btn"
					size="mini">清空</button>
			</view>
			<view style="margin-top: 10px;" class="uni-list">
				<view class="uni-list-cell" v-for="(item, index) in userList" :key="item.id">
					<view class="uni-list-cell-pd" style="width: 55%;">
						{{item.user_info}}{{item.status==1?'(账号:'+item.login_name+')':''}}
					</view>
					<view class="uni-list-cell-db" style="width: 45%;">
						<button v-if="item.status==0||item.status==1" @click="tapItem(item)"
							style="background: #00CFBD;margin-left: 20px;color: white;margin-right: 10px;" class="mini-btn"
							size="mini">{{item.status==0?'绑定并注册':'绑定'}}</button>
						<!-- <button v-if="item.status==1" @click="tapItem(item)"
						style="background: #00CFBD;margin-left: 20px;color: white;" class="mini-btn"
						size="mini">注册</button> -->
						<p v-if="item.status==2" class="mui-pull-right" style="color: red;margin-top: 5px;">账号已停用</p>
						<p v-if="item.status==3" class="mui-pull-right" style="color: red;margin-top: 5px;">账号已屏蔽</p>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog title="确定解绑?" content="当前用户账号信息不正常，是否进行解绑？" :duration="2000" :before-close="true"
				@close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popupTishi" type="dialog">
			<uni-popup-dialog title="提示" content="账号未授权，请联系管理员！" @close="closeTishi" @confirm="confirmTishi"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popup0" type="center" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;margin-bottom: 20px;font-weight: 900;width: 320px;">请输入注册账号及密码</view>
			<view class="uni-list">
				<view class="uni-list-cell" style="height: 40px;">
					<view class="uni-list-cell-left" style="width: 90px;">
						用户账号
					</view>
					<view class="uni-list-cell-db">
						<input v-model="login_name" maxlength="20" style="height: 40px;" type="text"
							placeholder="请输入账号" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left" style="width: 90px;">
						请输入密码
					</view>
					<view class="uni-list-cell-db">
						<input v-model="pswd1" password style="height: 40px;" maxlength="18" type="text" placeholder="请输入密码" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left" style="width: 90px;">
						请确认密码
					</view>
					<view class="uni-list-cell-db">
						<input v-model="pswd2" password style="height: 40px;" maxlength="18" type="text" placeholder="请确认密码" />
					</view>
				</view>
				<view style="width: 100px;margin: 15px 0 15px 125px;">
					<button id='idenCodebtn' @click="submit" type="button" class="mui-btn mui-btn-block mui-btn-primary"
						style="background: #00CFBD;border: 0;height: 36px;font-size: 15px;color: white;">确 定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	import RSAKey from '../../commom/encrypt/rsa.js'
	import md5 from '../../commom/encrypt/md5.js';
	let _this;
	export default {
		data() {
			return {
				openid: '',
				pageArray: util.getPageArray(),
				utypeArray: [],
				utype_index: 0,
				userName: '',
				userPhone: '',
				disabledFlag: 0, //
				yanzm: '', //
				yanZMTime: 60, //
				msg_token: '',
				clearFlag: 0,
				userList: [],
				yanzmStart: '',
				typeStr0: '',
				typeStr1: '',
				showFlag: 0,
				login_name:'',
				pswd1:'',
				pswd2:'',
				tapModel:{},
			}
		},
		onLoad(option) {
			_this = this;
			// history.pushState(null, null, document.URL); //禁止网页返回上一页
			// window.addEventListener('popstate', function() {
			// 	history.pushState(null, null, document.URL);
			// });
			this.openid = this.getUrlParam('openid');
			console.log('openid111111:' + this.openid);
			// console.log('页面url:' + window.location.href);
			// this.openid = this.getUrlParam('openid');
			// let tempM = util.getPageData(option);
			// console.log('tempM:' + JSON.stringify(tempM));
			// this.openid = util.getPageData(option).openid;
			// console.log('openid111111:' + this.openid);
			if (this.openid) {
				//第三方账号注册状态查询
				this.getThuserstat();
			} else {
				this.showToast('没有获取到用户信息');
			}
			uni.setNavigationBarTitle({
				title: ''
			});
			//#ifdef H5
			document.title = "";
			//#endif
		},
		methods: {
			setTypeStr() {
				if (this.utypeArray[this.utype_index].type_code == 'YHLX0003') {
					this.typeStr0 = '老师';
					this.typeStr1 = '老师';
				} else if (this.utypeArray[this.utype_index].type_code == 'YHLX0004') {
					this.typeStr0 = '学生';
					this.typeStr1 = '家长';
				} else if (this.utypeArray[this.utype_index].type_code == 'YHLX0005') {
					this.typeStr0 = '学生';
					this.typeStr1 = '家长';
				}
			},
			clearInput: function() {
				this.utype_index = 0;
				this.userName = '';
				this.userPhone = '';
				this.yanzm = '';
				this.disabledFlag = 0; //
				this.yanzm = ''; //
				this.yanZMTime = 60; //
				this.msg_token = '';
				this.clearFlag = 1;
				this.userList = [];
				this.yanzmStart = '';
			},
			searchInfo: function() {
				console.log('searchInfo');
				if (this.yanzm.length != 6) {
					this.showToast('请输入正确的验证码');
				} else {
					var comData0 = {
						platform_code: this.globaData.PLATFORMCODE, //平台代码
						app_code: this.globaData.APPCODE, //应用系统代码
						user_type: this.utypeArray[this.utype_index].type_code, //用户类型
						user_name: this.userName, //姓名，注册老师的时候输入老师的姓名，注册学生和家长时输入学生姓名
						phone: this.userPhone, //电话，注册老师的时候输入老师的姓名，注册学生和家长时输入家长电话
						msg_token: this.msg_token, //短信验证授权码
						msg: this.yanzm, //短信验证码
					}
					this.showLoading()
					//发送网络请求，data为网络返回值
					this.post(this.globaData.INTERFACE_HR_SKIN + 'register/userInfo', comData0, (data0, data) => {
						console.log('register/userInfo:' + JSON.stringify(data));
						this.hideLoading();
						if (data.code == 0) {
							this.yanZMTime = 60;
							this.disabledFlag = 2;
							this.clearFlag = 1;
							this.userList = data.data.list;
						} else {
							this.disabledFlag = 1;
							this.showToast(data.msg);
						}
					});
				}
			},
			getYanzm: function() {
				console.log('getYanzm');
				if (this.userName == '') {
					this.showToast('请输入用户姓名');
				} else if (this.userPhone == '') {
					this.showToast('请输入用户电话');
				} else if (!isPhone(this.userPhone)) {
					this.showToast('请输入正确的用户电话');
				} else {
					var comData0 = {
						platform_code: this.globaData.PLATFORMCODE, //平台代码
						app_code: this.globaData.APPCODE, //应用系统代码
						user_type: this.utypeArray[this.utype_index].type_code, //
						user_name: this.userName, //姓名，注册老师的时候输入老师的姓名，注册学生和家长时输入学生姓名
						phone: this.userPhone //电话，注册老师的时候输入老师的姓名，注册学生和家长时输入家长电话
					};
					this.showLoading()
					//发送网络请求，data为网络返回值
					this.post(this.globaData.INTERFACE_HR_SKIN + 'register/sendMsg', comData0, (data0, data) => {
						console.log('register/sendMsg:' + JSON.stringify(data));
						this.hideLoading();
						if (data.code == 0) {
							this.msg_token = data.data.msg_token;
							this.disabledFlag = 1;
							this.clearFlag = 0;
							this.yanzmStart = Date.parse(new Date());
							this.countDown();
						} else {
							this.disabledFlag = 0;
							this.showToast(data.msg);
						}
					});
				}
			},
			countDown() {
				if (this.clearFlag == 0) {
					if (this.yanZMTime <= 1) {
						this.yanZMTime = 60;
					} else {
						this.yanZMTime = this.yanZMTime - 1;
						setTimeout(function() {
							_this.countDown();
						}, 1000);
					}
				}
			},
			tapItem: function(item) {
				if (item.status == 0) {
					this.login_name = '';
					this.pswd1 = '';
					this.pswd2 = '';
					this.$refs.popup0.open();
					this.tapModel = item;
				} else{
					//2.3.用户注册/第三方账号绑定
					this.getThuserreg(item);
				}
			},
			submit: function() { //提交数据
				if (this.login_name == '') {
					this.showToast('请输入用户账号');
				} else if (escape(this.login_name).indexOf("%u") >= 0) {
					this.showToast('用户账号不能输入汉字');
				} else if (this.login_name.length > 20 || this.login_name.length < 4) {
					this.showToast('账号需为4到20个字符');
				} else if (this.pswd1 == '') {
					this.showToast('请输入用户密码');
				} else if (this.pswd2 == '') {
					this.showToast('请确认密码');
				} else if (!(this.pswd1 === this.pswd2)) {
					this.showToast('两次输入的密码不一致');
				} else if (!this.checkPass(this.pswd2)) {
					this.showToast('密码需为6到18位数字和字母的组合');
				} else if (this.pswd2.length > 18 || this.pswd2.length < 6) {
					this.showToast('密码需为6到18位数字和字母的组合');
				} else {
					//2.3.用户注册/第三方账号绑定
					this.getThuserreg(this.tapModel);
					// var comData0 = {
					// 	platform_code: this.globaData.PLATFORMCODE, //平台代码
					// 	app_code: this.globaData.APPCODE, //应用系统代码
					// 	index_code: 'index', //页面权限符
					// 	user_code: this.tapModel.user_code, //用户代码
					// 	unit_code: this.tapModel.unit_code, //学校代码
					// 	user_name: this.tapModel.user_name, //姓名
					// 	login_name: this.login_name, //登录名
					// 	user_type: this.tapModel.user_type, //
					// 	phone: this.tapModel.phone, //电话
					// 	password: this.pswd1.length>0?md5.hex_md5(this.PWD_ENCRYPTION + this.pswd1):'', //密码,秘钥+密码再MD5加密
					// 	msg_token: this.msg_token,
					// 	msg: this.yanzm,
					// 	// thuser_code: this.openid, //第三方用户代码或账号
					// 	// thuser_fromcode: this.globaData.THIRD_FORMCODE, //第三方平台,微信:WX;支付宝:ZFB
					// 	access_token: '',
					// }
					// console.log('register:'+JSON.stringify(comData0));
					// this.showLoading();
					//发送网络请求，data为网络返回值
					// this.post(this.globaData.INTERFACE_HR_SKIN + 'register', comData0, (data0, data) => {
					// 	this.hideLoading();
					// 	if (data.code == '0000') {
					// 		//2.3.用户注册/第三方账号绑定
					// 		this.getThuserreg(this.tapModel);
					// 	} else {
					// 		this.showToast(data.msg);
					// 	}
					// });
				}
			},
			//判断字符串是否为数字和字母组合
			checkPass(password) {
				var re = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/g;
				if (!re.test(password)) {
					return false;
				} else {
					return true;
				}
			},
			changeSelectType: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value);
				this.utype_index = e.target.value;
				this.setTypeStr();
			},
			getUrlParam(name) {
				var search = window.location.href;
				var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
				var matcher = pattern.exec(search);
				var items = null;
				if (null != matcher) {
					try {
						items = decodeURIComponent(decodeURIComponent(matcher[1]));
					} catch (e) {
						try {
							items = decodeURIComponent(matcher[1]);
						} catch (e) {
							items = matcher[1];
						}
					}
				}
				return items;
			},
			getThuserstat() {
				this.showFlag = 0;
				// uni.setNavigationBarTitle({
				// 	title: ''
				// });
				// document.title = "";
				var comData0 = {
					platform_code: this.globaData.PLATFORMCODE, //平台代码
					app_code: this.globaData.APPCODE, //应用系统代码
					index_code: 'index',
					unit_code: this.globaData.UNITCODE, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
					thuser_code: this.openid, //第三方用户代码或账号
					thuser_fromcode: this.globaData.THIRD_FORMCODE, //第三方平台,微信:WX;支付宝:ZFB
					access_token: '',
				};
				this.showLoading();
				//发送网络请求，data为网络返回值
				this.post(this.globaData.INTERFACE_SSO_SKIN + 'user/thuserstat', comData0, (data0, data) => {
					this.hideLoading();
					console.log('getThuserstat:' + JSON.stringify(data));
					if (data.code == '0000') {
						if (data.data == '-1') {
							this.showFlag = 1;
							// uni.setNavigationBarTitle({
							// 	title: '注册'
							// });
							// document.title = "注册";
							//用户注册获取可选用户类型列表
							this.getUserType();
						} else if (data.data == '-2') {
							this.$refs.popup.open();
						} else {
							this.getEncryptKeyLogin(data.data);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			closeTishi(){
				this.$refs.popupTishi.close();
			},
			confirmTishi(){
				this.$refs.popupTishi.close();
			},
			close() {
				this.$refs.popup.close();
			},
			confirm() {
				this.$refs.popup.close();
				// 走游客登录，然后解绑
				//不需要加密的数据 
				var comData1 = {
					uuid: util.getDeviceId(), //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
					webid: util.getBroswerId(), //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本）
					shaketype: '1', //
					login_name: '00000000000', //登录名
					password: '', //
					device_type: '3', //登录设备类型，0：WEB、1：APP、2：客户端、3：第三方登录
					platform_code: this.globaData.PLATFORMCODE, //平台代码
					app_code: this.globaData.APPCODE, //应用系统代码
					unit_code: this.globaData.UNITCODE, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
					verify_code: ''
				};
				//登录
				this.post(this.globaData.INTERFACE_SSO_SKIN + 'login', comData1, (data0, data1) => {
					if (data1.code == 0) {
						//不需要加密的数据 
						var comData2 = {
							platform_code: this.globaData.PLATFORMCODE, //平台代码
							app_code: this.globaData.APPCODE, //应用系统代码
							index_code: 'index',
							unit_code: data1.data.user.unit_code, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
							access_token: data1.data.access_token,
							op_user_code: this.openid, //用户代码
							thuser_code: this.openid, //第三方用户代码或账号
							thuser_fromcode: this.globaData.THIRD_FORMCODE, //第三方平台,微信:WX;支付宝:ZFB
						};
						this.showLoading();
						//2.8.第三方账号解绑
						this.post(this.globaData.INTERFACE_HR_SKIN + 'unregister/thuserunreg', comData2, (data0,
							data2) => {
							this.hideLoading();
							if (data2.code == 0) {
								// utils.mOpenWithData("../../html/login/index.html", {});
								// util.openwithData('/pages/login/index');
								uni.redirectTo({
									url: '/pages/login/index'
								});
							} else {
								this.showToast(data2.msg);
							}
						});
					}
				});
			},
			getEncryptKeyLogin(userCode) {
				//不需要加密的数据
				var comData0 = {
					platform_code: this.globaData.PLATFORMCODE, //平台代码
					app_code: this.globaData.APPCODE, //应用系统代码
					unit_code: this.globaData.UNITCODE, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
					uuid: util.getDeviceId(), //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
					webid: util.getBroswerId(), //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本））
					shaketype: '1', //
				};
				this.showLoading();
				//发送网络请求，data为网络返回值
				this.post(this.globaData.INTERFACE_SSO_SKIN + 'login/getEncryptKey', comData0, (response0, response) => {
					console.log('response:' + JSON.stringify(response));
					this.hideLoading();
					if (response.code == '0000') {
						let data = response.data;
						let ConsultPublicKey = {
							n: String(data.Modulus),
							e: String(data.Exponent)
						}
						this.loginPro(userCode, ConsultPublicKey);
					} else {
						this.showToast(response.msg);
					}
				});
			},
			loginPro(userCode, ConsultPublicKey) {
				let rsaPublicKey = new RSAKey();
				rsaPublicKey.setPublicString(JSON.stringify(ConsultPublicKey));
				//不需要加密的数据 
				var comData1 = {
					uuid: util.getDeviceId(), //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
					webid: util.getBroswerId(), //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本）
					shaketype: '1', //
					login_name: rsaPublicKey.encrypt(userCode), //登录名
					password: '', //
					device_type: '3', //登录设备类型，0：WEB、1：APP、2：客户端、3：第三方登录
					platform_code: this.globaData.PLATFORMCODE, //平台代码
					app_code: this.globaData.APPCODE, //应用系统代码
					unit_code: this.globaData.UNITCODE, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
					verify_code: ''
				};
				this.showLoading("正在登录...");
				//登录
				this.post(this.globaData.INTERFACE_SSO_SKIN + 'login', comData1, (data0, data1) => {
					this.hideLoading();
					if (data1.code == 0) {
						var tempData = data1.data;
						util.setPersonal(tempData);
						var tempFlag = 0;
						//登录用户岗位信息
						//不需要加密的数据
						var comData3 = {
							platform_code: data1.data.user.platform_code, //平台代码
							app_code: data1.data.user.app_code, //应用系统代码
							index_code: 'index', //页面权限符,必传,从登录皮肤处获得
							unit_code: data1.data.user.unit_code, //学校代码,必传
							user_code: data1.data.user.user_code, //用户代码,必传
							access_token: data1.data.access_token //用户令牌
						};
						//登录用户岗位信息
						this.post(this.globaData.INTERFACE_HR_SUB + 'user/getUserImg', comData3, (data0,
							data3) => {
							if (data3.code == 0) {
								var tempPerInfo = util.getPersonal();
								tempPerInfo.hrImg_url = data3.data.user_img;
								util.setPersonal(tempPerInfo);
								tempFlag++;
								console.log('tempFlag01:' + tempFlag);
								if (tempFlag == 3) {
									//跳转界面
									this.gotoPage();
									this.hideLoading();
								}
							} else {
								this.showToast(data3.msg);
							}
						});

						//1.4获取菜单
						//不需要加密的数据
						var comData4 = {
							platform_code: this.globaData.PLATFORMCODE, //平台代码
							app_code: this.globaData.APPCODE, //应用系统代码
							unit_code: data1.data.user.unit_code,
							index_code: 'index',
							access_token: data1.data.access_token //用户令牌
						};
						//登录用户岗位信息
						this.post(this.globaData.INTERFACE_SSO_SKIN + 'acl/menu', comData4, (data0, data4) => {
							if (data4.code == '0000') {
								if (data4.data.list.length > 0) {
									var tempA = [];
									for (var i = 0; i < data4.data.list[0].childList
										.length; i++) { //一级菜单循环
										var web_first_item = data4.data.list[0].childList[i];
										for (var a = 0; a < this.pageArray.length; a++) {
											var local_first_item = this.pageArray[a];
											if (local_first_item.url == web_first_item.url) {
												local_first_item.text = web_first_item.name;
												local_first_item.access = web_first_item.access;
												local_first_item.redspot_url = web_first_item.redspot_url;
												let childList = []
												for (var b = 0; b < web_first_item.childList
													.length; b++) { //二级菜单循环
													var web_second_item = web_first_item.childList[b];
													for (var c = 0; c < local_first_item.childList
														.length; c++) {
														var local_second_item = local_first_item.childList[
															c];
														if (local_second_item.url == web_second_item.url) {
															local_second_item.access = web_second_item
																.access;
															local_second_item.redspot_url = web_second_item
																.redspot_url;
															local_second_item.childList = web_second_item
																.childList;
															local_second_item.text = web_second_item.name;
															childList.push(local_second_item)
														}
													}
												}
												local_first_item.childList = childList
												tempA.push(local_first_item);
											}
										}
									}
									for (var i = 0; i < tempA.length; i++) {
										let tempM = tempA[i];
										tempM.index = i;
									}
									console.log('tempA:' + JSON.stringify(tempA));
									if (tempA.length > 5) {
										var tempArrayM = tempA.slice(4);
										util.setMenuMore(tempArrayM);
										tempA = tempA.slice(0, 4);
										tempA.push({
											text: "更多",
											index: 4,
											count: 0,
											isDot: false,
											customIcon: false,
											pagePath: "/pages/more/index",
											iconPath: '../../static/tabbar/more.png',
											selectedIconPath: '../../static/tabbar/more_select.png',
											img_href: "../../img/schapp_work/kaoqin_tab.png",
											url: 'schappUni_CoursePractice',
											childList: []
										});
									} else {
										util.setMenuMore([]);
									}
									console.log('tempA:' + JSON.stringify(tempA));
									this.showArray = [].concat(tempA);
									util.setMenu(this.showArray);
									if (this.showArray.length > 0) {
										util.setTabbarMenu(this.showArray[0]);
									}
									//跳转界面
									tempFlag++;
									console.log('tempFlag02:' + tempFlag);
									if (tempFlag == 3) {
										this.gotoPage();
									}
								} else {
									this.showToast('应用系统无权限，请联系管理员');
									this.unRegister(data1);
								}
							} else {
								this.showToast(data4.msg);
								this.unRegister(data1);
							}
						});

						//1.42.根据用户类型及代码查询教师/学生信息
						var comData5 = {
							platform_code: this.globaData.PLATFORMCODE, //平台代码
							app_code: this.globaData.APPCODE, //应用系统代码
							unit_code: data1.data.user.unit_code,
							user_type_code: data1.data.user.type_code,
							user_code: data1.data.user.user_code,
							index_code: 'index',
							access_token: data1.data.access_token //用户令牌
						};
						//1.42.根据用户类型及代码查询教师/学生信息
						this.post(this.globaData.INTERFACE_HR_SUB + 'user/getUserInfoByTypeAndCode', comData5, (
							data0, data5) => {
							if (data5.code == '0000') {
								if (data5.data) {
									var tempPerInfo = util.getPersonal();
									if (data1.data.user.type_code == 'YHLX0003') {
										tempPerInfo.tec_name = data5.data.tec_name;
										tempPerInfo.sch_name = data5.data.sch_name;
										tempPerInfo.sch_code = data5.data.sch_code;
										tempPerInfo.tec_code = data5.data.tec_code;
										tempPerInfo.dpt_name = data5.data.dpt_name;
										tempPerInfo.dpt_code = data5.data.dpt_code;
									} else {
										tempPerInfo.cls_name = data5.data.cls_name;
										tempPerInfo.sch_name = data5.data.sch_name;
										tempPerInfo.sch_code = data5.data.sch_code;
										tempPerInfo.cls_code = data5.data.cls_code;
										tempPerInfo.grd_name = data5.data.grd_name;
										tempPerInfo.grd_code = data5.data.grd_code;
										tempPerInfo.stu_name = data5.data.stu_name;
										tempPerInfo.stu_code = data5.data.stu_code;
									}
									util.setPersonal(tempPerInfo);
									tempFlag++;
									console.log('tempFlag02:' + tempFlag);
									if (tempFlag == 3) {
										//跳转界面
										this.gotoPage();
										this.hideLoading();
									}
								} else {
									this.showToast('应用系统无权限，请联系管理员');
									this.unRegister(data1);
								}
							} else {
								this.showToast(data5.msg);
								this.unRegister(data1);
							}
						});
					} else {
						this.$refs.popup.open();
					}
				});
			},
			gotoPage() {
				console.log('gotoPagegotoPagegotoPage');
				var tempData = util.getPersonal();
				//将personal 中的key更改为指定的值
				tempData.user_name = tempData.user.user_name;
				tempData.sex = tempData.user.sex;
				tempData.pid = tempData.user.pid;
				tempData.unit_name = tempData.user.unit_name;
				tempData.login_name = tempData.user.login_name;
				tempData.platform_code = tempData.user.platform_code;
				tempData.user_code = tempData.user.user_code;
				tempData.img_url = tempData.user.img_url;
				tempData.platform_name = tempData.user.platform_name;
				tempData.unit_code = tempData.user.unit_code;
				tempData.id = tempData.user.id;
				tempData.type_code = tempData.user.type_code;
				tempData.app_code = tempData.user.app_code;
				tempData.backFlag = this.APPORWECHAT;
				tempData.openid = this.openid;
				delete tempData['user'];
				// store.set(this.globaData.PERSONALINFO, tempData);
				util.setPersonal(tempData);
				// var tempArray = util.getMenu();
				// uni.switchTab({
				// 	url: tempArray[0].pagePath
				// });

				var tempArray = util.getMenu();
				console.log('tempArray:' + JSON.stringify(tempArray));
				util.getPushCut();
				if (tempArray.length > 0) {
					var tempStr = JSON.stringify(tempArray[0]);
					var tempVal = tempStr.indexOf('stuHealthMsg') == -1 ? false : true;
					if (tempArray.length == 1 && tempVal) {
						util.openwithData(tempArray[0].pagePath1, tempArray[0]);
					} else {
						uni.switchTab({
							url: tempArray[0].pagePath
						});
					}
				} else {
					this.$refs.popupTishi.open();
					// this.showToast('账号未授权，请联系管理员！');
				}
			},
			unRegister(data1) {
				//不需要加密的数据 
				var comData2 = {
					platform_code: this.globaData.PLATFORMCODE, //平台代码
					app_code: this.globaData.APPCODE, //应用系统代码
					index_code: 'index',
					unit_code: data1.data.user.unit_code, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
					access_token: data1.data.access_token,
					op_user_code: data1.data.user.user_code, //用户代码
					thuser_code: this.openid, //第三方用户代码或账号
					thuser_fromcode: this.globaData.THIRD_FORMCODE, //第三方平台,微信:WX;支付宝:ZFB
				};
				this.showLoading();
				//2.8.第三方账号解绑
				this.post(this.globaData.INTERFACE_HR_SKIN + 'unregister/thuserunreg', comData2, (data0, data2) => {
					this.hideLoading();
					if (data2.code == 0) {
						// util.openwithData('/pages/login/index');
						uni.redirectTo({
							url: '/pages/login/index'
						});
					} else {
						this.showToast(data2.msg);
					}
				});
			},
			getUserType() {
				var comData0 = {
					platform_code: this.globaData.PLATFORMCODE, //平台代码
					app_code: this.globaData.APPCODE, //应用系统代码
					unit_code: this.globaData.UNITCODE
				};
				this.showLoading();
				//发送网络请求，data为网络返回值
				this.post(this.globaData.INTERFACE_SUP_HR + 'login/getPlatformUserTypeList', comData0, (data0, data) => {
					this.hideLoading();
					console.log('getPlatformUserTypeList:' + JSON.stringify(data));
					if (data.code == 0) {
						this.utypeArray = [].concat(data.data);
						this.utype_index = 0;
						this.setTypeStr();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getThuserreg(userModel) {
				//不需要加密的数据
				var comData0 = {
					platform_code: this.globaData.PLATFORMCODE, //平台代码
					app_code: this.globaData.APPCODE, //应用系统代码
					index_code: 'index', //页面权限符
					user_code: userModel.user_code, //用户代码
					unit_code: userModel.unit_code, //学校代码
					user_name: userModel.user_name, //姓名
					login_name: this.login_name, //登录名
					user_type: userModel.user_type, //
					phone: userModel.phone, //电话
					password: this.pswd1.length>0?md5.hex_md5(this.PWD_ENCRYPTION + this.pswd1):'', //密码,秘钥+密码再MD5加密
					msg_token: this.msg_token,
					msg: this.yanzm,
					thuser_code: this.openid, //第三方用户代码或账号
					thuser_fromcode: this.globaData.THIRD_FORMCODE, //第三方平台,微信:WX;支付宝:ZFB
					access_token: '',
				}
				console.log('register:'+JSON.stringify(comData0));
				this.showLoading();
				//发送网络请求，data为网络返回值
				this.post(this.globaData.INTERFACE_HR_SKIN + 'register', comData0, (data0, data) => {
					this.hideLoading();
					if (data.code == '0000') {
						//第三方账号注册状态查询
						this.getThuserstat();
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
	var isPhone = function(phone) {
		var phoneReg = /^1[3|4|5|6|7|8|9]\d{9}$/;
		if (phoneReg.test(phone)) {
			return true;
		} else {
			return false;
		}
	}
</script>

<style>
	.btnDis0 {
		background: #00CFBD;
		color: white;
	}

	.btnDis1 {
		/* background: #00CFBD; */
		color: black;
	}
</style>
