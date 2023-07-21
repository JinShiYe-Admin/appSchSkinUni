<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<uni-search-bar placeholder="搜索联系人" maxlength="10" @confirm="search" clearButton='none' cancelButton='none' />
		<view v-if="searchStr.length>0&&searchData.length>0">
			<view style="margin: 5px 15px 10px;font-size: 14px;">找到{{searchData.length}}个联系人</view>
			<uni-list>
				<view v-for="(model,index0) in searchData" :key="index0">
					<uni-list-item direction='column'>
						<view slot="body">
							<view style="float: left;height: 40px;">
								<image class="peopleImg"
									:src="model.user_img?model.user_img:'http://www.108800.com/user.jpg'"></image>
							</view>
							<view class="rightView">
								<view style="font-size: 16px;font-weight: 700;">{{model.user_name}}</view>
								<view style="font-size: 14px;color: #7f7f7f;">{{model.phone}}</view>
								<view style="float: right;margin-top: -35px;">
									<uni-icons @click="clickPhone(model)" style="margin-right: 10px;" type="phone"
										size="30"></uni-icons>
									<!-- #ifdef APP-PLUS -->
									<uni-icons @click="clickMsg(model)" type="chat" size="30"></uni-icons>
									<!-- #endif -->
								</view>
							</view>
						</view>
					</uni-list-item>
					<view style="height: 1px;background: #f2f2f2;"></view>
				</view>
			</uni-list>
		</view>
		<view v-else-if="searchStr.length>0&&searchData.length==0" style="text-align: center;margin-top: 20px;font-size: 16px;color: gray;">没有搜索到联系人</view>
		<uni-list v-if="searchStr.length==0&&pageData.length>0">
			<view v-for="(item,index0) in pageData" :key="index0">
				<view style="margin: 20px;">{{item.dpt_name}}</view>
				<uni-list-item v-for="(model,index1) in item.child" :key='index1' direction='column'>
					<view slot="body">
						<view style="float: left;height: 40px;">
							<image class="peopleImg"
								:src="model.user_img?model.user_img:'http://www.108800.com/user.jpg'"></image>
						</view>
						<view class="rightView">
							<view style="font-size: 16px;font-weight: 700;">{{model.user_name}}</view>
							<view style="font-size: 14px;color: #7f7f7f;">{{model.phone}}</view>
							<view style="float: right;margin-top: -35px;">
								<uni-icons @click="clickPhone(model)" style="margin-right: 10px;" type="phone"
									size="30"></uni-icons>
								<!-- #ifdef APP-PLUS -->
								<uni-icons @click="clickMsg(model)" type="chat" size="30"></uni-icons>
								<!-- #endif -->
							</view>
						</view>
					</view>
				</uni-list-item>
				<view style="height: 1px;background: #f2f2f2;"></view>
			</view>
		</uni-list>
		<view v-else-if="searchStr.length==0&&pageData.length==0" style="text-align: center;margin-top: 20px;font-size: 16px;color: gray;">暂无</view>
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
				dptList:'',
				pageData: [],
				searchStr:'',//搜索词
				searchData:[],//搜索数据
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
			this.getDpt();
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
			search(res) {
				this.pageData = [];
				this.searchData = [];
				this.searchStr = res.value;
				if (this.searchStr.length==0) {
					this.getDpt();
				} else{
					this.getDptUser();
				}
				
			},
			// clear(res) {
			// 	uni.showToast({
			// 		title: 'clear事件，清除值为：' + res.value,
			// 		icon: 'none'
			// 	})
			// },
			// cancel(res) {
			// 	uni.showToast({
			// 		title: '点击取消，输入值为：' + res.value,
			// 		icon: 'none'
			// 	})
			// },
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
			getDpt() {
				var comData = {
					index_code: 'index', //
					sch_code: this.personInfo.sch_code
				};
				this.showLoading();
				// 13.1.部门列表
				this.post(this.globaData.INTERFACE_HR_SUB + 'dpt', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempDpt = [];
						for (var i = 0; i < data.data.list.length; i++) {
							data.data.list[i].child = [];
							tempDpt.push(data.data.list[i].dpt_code);
						}
						// data.data.list = util.sortTable(data.data.list,'dpt_name');
						data.data.list.sort(util.compare('sort', 1));
						this.pageData = data.data.list;
						this.dptList = tempDpt.join(',');
						this.getDptUser();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getDptUser() {
				var comData = {
					index_code: 'index', //
					dpt_codes: this.dptList,
					page_number: -1,
					tec_name:this.searchStr,
					// uid_stat:1,
					// user_stat:1,
				}
				this.showLoading();
				// 14.1.部门用户列表
				this.post(this.globaData.INTERFACE_HR_SUB + 'dptUser', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						console.log('this.searchStr:'+this.searchStr);
						console.log('this.searchStr.le:'+this.searchStr.length);
						if (this.searchStr.length==0) {
							for (var i = 0; i < data.data.list.length; i++) {
								var tempM0 = data.data.list[i];
								if (tempM0.phone && tempM0.phone.length == 11 && tempM0.phone.indexOf('*') == -1) {
									for (var a = 0; a < this.pageData.length; a++) {
										var tempM1 = this.pageData[a];
										if (tempM1.dpt_code == tempM0.dpt_code) {
											tempM1.child.push(tempM0);
										}
									}
								}
							}
							var tempList = [];
							for (var i = 0; i < this.pageData.length; i++) {
								var tempM0 = this.pageData[i];
								if (tempM0.child.length > 0) {
									tempList.push(tempM0);
								}
								tempM0.child = util.sortTable(tempM0.child, 'user_name');
							}
							this.pageData = tempList;
							// console.log('this.pageData:'+JSON.stringify(this.pageData))
						} else{
							data.data.list = util.sortTable(data.data.list, 'user_name');
							this.searchData = data.data.list;
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
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100% - 50px);
	}
</style>