<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="height: 170px;background: ghostwhite;">
			<view style="text-align: center;">
				<image class="peopleImg" :src="navItem.img_url?navItem.img_url:'http://www.108800.com/user.jpg'"></image>
			</view>
			<view style="font-size: 16px;text-align: center;margin-top: 15px;">{{navItem.grd_name}} {{navItem.cls_name}} {{navItem.stu_name}}</view>
		</view>
		<uni-list>
			<uni-list-item v-for="(model,index) in pageData" :key='index' direction='column'>
				<view slot="body" style="margin-top: 10px;text-align: center">
					<view style="font-size: 14px;color: #7f7f7f;float: left;width: 50px;">{{model.relationship}}</view>
					<view style="font-size: 16px;float: left;width: 100px;word-break: break-all;">{{model.par_name}}</view>
					<view style="font-size: 14px;color: #7f7f7f;float: left;width: 100px;">{{model.phone}}</view>
					<view style="float: right;margin-top: -5px;">
						<uni-icons @click="clickPhone(model)" class="listIcon" style="margin-right: 10px;"
							type="phone" size="30"></uni-icons>
						<!-- #ifdef APP-PLUS -->
						<uni-icons @click="clickMsg(model)" class="listIcon" type="chat" size="30"></uni-icons>
						<!-- #endif -->
					</view>
				</view>
			</uni-list-item>
		</uni-list>
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
				pageData: [],
			}
		},
		components: {
			mynavBar
		},
		onLoad: function(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.text = '家长通讯录';
			this.navItem.name = '家长通讯录';
			this.navItem.index = 100;
			uni.setNavigationBarTitle({
				title: this.navItem.name
			});
			if (this.navItem.phone) {
				this.pageData.push({
					relationship:'本人',
					phone:this.navItem.phone,
					par_name:this.navItem.stu_name
				})
			}
			this.getList0();
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
			getList0() {
				var comData = {
					index_code: 'index', //
					stu_codes: this.navItem.stu_code
				};
				this.showLoading();
				// 17.1.家长列表
				this.post(this.globaData.INTERFACE_HR_SUB + 'parent', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						// var tempDpt = [];
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM = data.data.list[i];
							if (tempM.phone&&tempM.phone.indexOf('*')==-1) {
								this.pageData.push(tempM);
							}
						}
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
		width: 90px;
		height: 90px;
		border-radius: 50%;
		margin-top: 20px;
	}
</style>