<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<uni-list v-if="pageData.length>0" style="margin-top: 0px;">
			<uni-list-item v-for="(model,index1) in pageData" :key='index1' direction='column'>
				<view slot="body">
					<view style="float: left;height: 40px;">
						<image class="peopleImg" :src="model.user_img?model.user_img:'http://www.108800.com/user.jpg'">
						</image>
					</view>
					<view class="rightView">
						<view style="font-size: 16px;font-weight: 700;">{{model.user_name}}<span v-if="model.is_master==1" class="backCss">班</span><span v-if="model.sub_name" class="backCss">{{model.sub_name}}</span></view>
						<view style="font-size: 14px;color: #7f7f7f;">{{model.phone}}</view>
						<view style="float: right;margin-top: -35px;">
							<uni-icons @click="clickPhone(model)" style="margin-right: 10px;"
								type="phone" size="30"></uni-icons>
							<!-- #ifdef APP-PLUS -->
							<uni-icons @click="clickMsg(model)" type="chat" size="30"></uni-icons>
							<!-- #endif -->
						</view>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<view v-else style="text-align: center;margin-top: 20px;font-size: 16px;color: gray;">暂无</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				pageData: []
			}
		},
		components: {
			mynavBar
		},
		onLoad: function() {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = {
				text: '教师通讯录',
				name: '教师通讯录',
				index: 100
			};
			uni.setNavigationBarTitle({
				title: this.navItem.name
			});
			this.getClsTec();
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			clickMsg(model) {
				var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
				msg.to = [model.phone];
				msg.body = '';
				plus.messaging.sendMessage(msg);
			},
			clickPhone(model) {
				uni.makePhoneCall({
					phoneNumber: model.phone
				});
			},
			getClsTec() {
				var comData = {
					index_code: 'index', //
					cls_codes: this.personInfo.cls_code,
				}
				this.showLoading();
				// 8.1.班级任教列表
				this.post(this.globaData.INTERFACE_HR_SUB + 'clsTec', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM0 = data.data.list[i];
							if (tempM0.phone && tempM0.phone.length == 11&&tempM0.phone.indexOf('*')==-1) {
								this.pageData.push(tempM0);
							}
						}
						this.pageData = util.sortTable(this.pageData,'user_name');
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.peopleImg {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100% - 50px);
	}
	
	.backCss{
		background: #cead7b;
		padding: 2px 4px;
		border-radius: 5px;
		font-size: 12px;
		color: white;
		margin-left: 5px;
	}
</style>