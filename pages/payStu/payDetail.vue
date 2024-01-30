<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<uni-card isShadow>
			<view class='title-text' style="display: block;text-align: center;">{{pageData.title}}</view>
			<view style="font-size: 14px;margin-top: 10px;text-align: center;">{{personInfo.grd_name}}
				{{personInfo.cls_name}} {{personInfo.stu_name}}</view>
		</uni-card>
		<uni-card isShadow>
			<view class='title-text'>应缴费用明细</view>
			<view class="card-line"></view>
			<uni-row v-for="(model,index) in pageData.project_list" :key="index">
				<uni-col :span="24">
					<view class="title-text" style="margin-top: 10px;">费用{{++index}}:</view>
				</uni-col>
				<uni-col :span="8">
					<view class="title-text" style="color: #7f7f7f;margin-top: 5px;">缴费项目</view>
				</uni-col>
				<uni-col :span="16">
					<view class="title-text" style="margin-top: 5px;">{{model.project_name}}</view>
				</uni-col>
				<uni-col :span="8">
					<view class="title-text" style="color: #7f7f7f;margin-top: 5px;">缴费金额(元)</view>
				</uni-col>
				<uni-col :span="16">
					<view class="title-text" style="margin-top: 5px;margin-bottom: 10px;">{{model.price}}</view>
				</uni-col>
			</uni-row>
			<uni-row v-if="pageData.deduct_money != 0">
				<uni-col :span="24">
					<view class="title-text" style="margin-top: 10px;">费用减免:</view>
				</uni-col>
				<uni-col :span="8">
					<view class="title-text" style="color: #7f7f7f;margin-top: 5px;">减免金额(元)</view>
				</uni-col>
				<uni-col :span="16">
					<view class="title-text" style="margin-top: 5px;">{{pageData.deduct_money}}</view>
				</uni-col>
			</uni-row>
			<view class="title-text" style="margin-top: 20px;">合计:</view>
			<view style="font-size: 12px;color: #333333;margin-top: 5px;text-align: center;">应缴金额（元）</view>
			<view style="font-size: 36px;color: #333333;margin-top: 5px;text-align: center;">
				{{pageData.pay_price}}
			</view>
			<view v-if="pageData.pay_price==0" class="noMoney">免缴</view>
		</uni-card>
		<view v-if="pageData.pay_user_code&&pageData.pay_user_code==personInfo.user_code">
			<view v-if="pageData.status == 1&&pageData.pay_status == 0 &&pageData.pay_price>0" class="wxPay"
				@click="getPayDetailAdd()">
				微信支付
			</view>
			<view v-if="pageData.status == 1&&pageData.pay_status == 1 &&pageData.pay_price>0"
				style="margin: 10px;font-size: 20px;color: red;font-weight: 700;text-align: center;">上次有缴费未完成，是否继续？
			</view>
			<view v-if="pageData.status == 1&&pageData.pay_status == 1 &&pageData.pay_price>0" class="wxPay"
				@click="getPayDetailAdd()">
				继续微信支付
			</view>
			<view v-if="pageData.status == 1&&pageData.pay_status == 1 &&pageData.pay_price>0" class="wxPay"
				style="margin-top: 15px;background: #d7d7d7;color: #555555;" @click="getPayDelete()">
				取消支付
			</view>
		</view>
		<view v-else-if="pageData.status == 1&&pageData.pay_status != 2&&pageData.pay_price>0" class="wxPay" @click="getPayDetailAdd()">
			微信支付
		</view>
		<view style="height: 30px;"></view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				PayDetailModel: {},
				payModelGu: {}, //顾工接口返回的支付信息
				pageData: [],
				phoneMsg: {},
			}
		},
		components: {
			mynavBar
		},
		methods: {
			getPageData() {
				let comData = {
					task_id: this.navItem.task_id,
					index_code: this.index_code,
				}
				if (this.personInfo.type_code == 'YHLX0005') { //学生
					comData.stu_code = this.personInfo.stu_code; //学生代码
					comData.grd_code = this.personInfo.grd_code; //学生年级代码
					comData.cls_code = this.personInfo.cls_code; //学生班级代码
				} else {
					comData.par_code = this.personInfo.user_code; //家长代码
				}
				this.showLoading();
				// 2.2.缴费任务详情 
				this.post(this.globaData.INTERFACE_ONLINEPAY + 'payDetail/stuPayDetail', comData, (data0, data) => {
					this.hideLoading();
					this.pageData = data.data;
				});
			},
			// 2.3. 生成订单
			getPayDetailAdd() {
				let comData = {
					task_id: this.navItem.task_id,
					pay_price: this.navItem.total_price, //支付金额
					stu_code: this.personInfo.stu_code, //学生代码
					grd_code: this.personInfo.grd_code, //学生年级代码
					cls_code: this.personInfo.cls_code, //学生班级代码
					phone_model: this.phoneMsg.brand + ',' + this.phoneMsg.model, //手机型号
					phone_system: this.phoneMsg.appVersionCode + ',' + this.phoneMsg.osVersion + ',' + this.phoneMsg
						.platform + ',' + this.phoneMsg.romName + ',' + this.phoneMsg.romVersion, //手机系统
					index_code: this.index_code,
				}
				this.showLoading();
				// 2.3. 生成订单
				this.post(this.globaData.INTERFACE_ONLINEPAY + 'payDetail/add', comData, (data0, data) => {
					this.hideLoading();
					console.log('data:'+JSON.stringify(data));
					if (data.code == 0) {
						this.PayDetailModel = data.data;
						this.getPayMsg();
					}else{
						this.getPageData();
					}
				});
			},
			// 向顾工接口获取支付订单号等，包含调起支付的参数
			getPayMsg() {
				var data0 = {
					appid: this.APPID, //微信开发平台应用APPID
					body: this.pageData.title, //商品名称
					attach: '', //附加描述,最好填写,以区分
					uid: this.personInfo.user_code, //订购的注册账户
					total_fee: this.pageData.pay_price * 100, //人民币商品总价,以分为单位
					goods_tag: '', //商品标签,商品分类标签,根据实际情况填写
					product_id: this.navItem.task_id.toString(), //商品代码,根据实际情况填写:如套餐填写套餐编码
					frmtype: "APP" //订购客户端,发起订购的设备:如PC,APP等
				}
				this.showLoading();
				uni.request({
					url: this.WXPAYSERVER,
					method: 'POST',
					header: {
						'content-type': 'application/json; charset=UTF-8'
					},
					data: data0,
					success: res0 => { //接口调用成功的回调函数
						_this.hideLoading();
						if (res0.statusCode === 200) {
							// console.log('res0:'+JSON.stringify(res0.data));
							_this.payModelGu = res0.data;
							_this.getPayDetailNo();
						}
					}
				});
			},
			// 2.4. 更新订单号
			getPayDetailNo() {
				let comData = {
					detail_id: this.PayDetailModel.id, //订单id
					trade_no: this.payModelGu.out_trade_no, //订单号
					time_start: this.payModelGu.time_start, //交易开始时间
					time_expire: this.payModelGu.time_expire, //交易过期时间
					index_code: this.index_code,
				}
				this.showLoading();
				// 2.4. 更新订单号
				this.post(this.globaData.INTERFACE_ONLINEPAY + 'payDetail/updateTradeNo', comData, (data0, data) => {
					this.hideLoading();
					this.requestPayment();
				});
			},
			// 2.5. 支付成功
			getPayDetailSuccess() {
				let comData = {
					detail_id: this.PayDetailModel.id, //订单id
					index_code: this.index_code,
				}
				this.showLoading();
				// 2.5. 支付成功
				this.post(this.globaData.INTERFACE_ONLINEPAY + 'payDetail/paySuccess', comData, (data0, data) => {
					this.hideLoading();
					const eventChannel = _this.getOpenerEventChannel()
					eventChannel.emit('refreshPayStuIndex');
					uni.navigateBack();
				});
			},
			// 2.6. 取消支付
			getPayDelete() {
				let comData = {
					index_code: this.index_code,
				}
				if (this.pageData.detail_id) {
					comData.detail_id = this.pageData.detail_id; //订单id
				} else {
					comData.detail_id = this.PayDetailModel.id; //订单id
				}
				this.showLoading();
				// 2.6. 取消支付
				this.post(this.globaData.INTERFACE_ONLINEPAY + 'payDetail/delete', comData, (data0, data) => {
					this.hideLoading();
					this.getPageData();
				});
			},
			// 调起微信支付
			requestPayment() {
				uni.requestPayment({
					provider: "wxpay",
					orderInfo: this.payModelGu,
					success(res) {
						_this.hideLoading();
						_this.showToast('支付成功');
						_this.getPayDetailSuccess();
					},
					fail(e) {
						// console.log('failfail:'+JSON.stringify(e));
						_this.getPayDelete();
						_this.showToast('支付失败');
					}
				})
			},
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			this.navItem.text = '在线缴费';
			this.index_code = this.personInfo.personalCenter5Access;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.getSystemInfo({
				success(res) {
					_this.phoneMsg = res;
					console.log('_this.phoneMsg:' + JSON.stringify(_this.phoneMsg));
				}
			})
			this.getPageData();
			//#ifdef H5
			document.title = ""
			//#endif
		}
	}
</script>

<style>
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}

	.card-line {
		height: 1px;
		background-color: #aaaaaa;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.cardPCls {
		width: 40px !important;
		height: 18px;
		background: #04D0BE;
		color: white;
		font-size: 12px;
		text-align: center;
		padding-top: 0px;
		margin-top: 3px;
		float: left;
	}

	.cardConent {
		font-size: 13px;
		word-break: break-all;
		/* overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap; */
		color: #787878;
	}

	.otherIndex {
		text-align: center;
		border: 1px solid #f59a23;
		color: #f59a23;
		border-radius: 5px;
		width: 70px;
		padding: 2px 5px;
		font-size: 13px;
	}

	.otherIndex1 {
		border: 1px solid #d7d7d7;
		color: #d7d7d7;
	}

	.title-text {
		display: flex;
		align-items: center;
		/* width: 80vw; */
		font-weight: 900;
		font-size: 16px;
		/* overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap; */
	}

	.leaveType {
		font-size: 12px;
		width: auto;
		color: #EFAD44;
		padding: 0px 3px;
		border-radius: 4px;
		margin-right: 3px;
		border: 1px solid #EFAD44;
	}

	.noMoney {
		border-radius: 50%;
		height: 70px;
		width: 70px;
		text-align: center;
		background: #f7f5f5;
		color: #d9001b;
		font-size: 20px;
		line-height: 70px;
		border-style: dashed dotted;
		border-color: #d9001b;
		border-width: 2px;
		float: right;
		margin-top: -80px;
	}

	.wxPay {
		width: 90%;
		height: 50px;
		background: #05c160;
		color: white;
		font-size: 14px;
		text-align: center;
		line-height: 50px;
		border-radius: 5px;
		margin-left: 5%;
	}
</style>