<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<uni-row>
				<uni-col :span="8">
					<picker class="flex-box" @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
						<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
							:value="grdArray[grdIndex].text"></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
						<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
							:value="clsArray[clsIndex].text"></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="stuClick" :value="stuIndex" :range="stuArray" range-key="text">
						<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
							:value="stuArray[stuIndex].text"></uni-easyinput-select>
					</picker>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<view v-for="item in listArray">
				<view v-if="item.mod_code == '1002'">
					<uni-card isShadow>
						<uni-row>
							<uni-col :span='8'>
								<view style='text-align: center;'>
									<image style='width: 70px;height: 70px;margin-top: 10px;'
										:src='item.mod_data.img_url'></image>
								</view>
							</uni-col>
							<uni-col :span='16'>
								<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_data.stu_name}}</view>
								<view class='detail-text'>{{item.mod_data.grd_name}}</view>
								<view class='detail-text'>{{item.mod_data.cls_name}}</view>
								<view class='detail-text'>{{item.mod_data.sno}}</view>
							</uni-col>
						</uni-row>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1007'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1008'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1009'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1010'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.hobbies.length==0" class='detail-text' style="text-align: center;">暂无</view>
						<view v-if="item.mod_data.hobbies.length>0" class='detail-text'>{{item.mod_data.hobbies}}</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1011'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.award.length==0" class='detail-text' style="text-align: center;">暂无</view>
						<view v-if="item.mod_data.award.length>0" class='detail-text'>{{item.mod_data.award}}</view>
					</uni-card>
				</view>
				
			</view>
		</view>
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
				pagedata: [],
				//顶部筛选框相关内容
				grdIndex: 0,
				clsIndex: 0,
				stuIndex: 0,
				grdArray: [{
					text: '',
					value: ''
				}],
				clsArray: [{
					text: '',
					value: ''
				}],
				stuArray: [{
					text: '',
					value: ''
				}],
				listArray: '',
			}
		},
		components: {
			mynavBar
		},
		methods: {
			grdClick: function(e) {
				if (this.grdIndex !== e.detail.value) {
					this.grdIndex = e.detail.value
					this.clsIndex = 0
					this.stuIndex = 0
					this.showLoading()
					this.getCls();
				}
			},
			clsClick: function(e) {
				if (this.clsIndex !== e.detail.value) {
					this.clsIndex = e.detail.value
					this.stuIndex = 0
					this.showLoading()
					this.getStu();
				}
			},
			stuClick: function(e) {
				if (this.stuIndex !== e.detail.value) {
					this.stuIndex = e.detail.value
					this.showLoading()
					this.getList0();
				}
			},
			getGrd() { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let grds = response.grd_list;
					let grdArray = [];
					grds.map(function(currentValue) {
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部年级';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						grdArray.push(obj)
					})
					if (grdArray.length > 0) {
						this.grdArray = grdArray;
						this.getCls();
					} else {
						this.grdArray = [];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls() { //获取班级
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					get_cls: true,
					all_cls: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let clss = response.cls_list;
					let clsArray = [];
					clss.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部班级';
						obj.value = currentValue.value;
						obj.text = name;
						clsArray.push(obj)
					})
					if (clsArray.length > 0) {
						this.clsArray = clsArray;
						this.getStu();
					} else {
						this.clsArray = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getStu() { //获取学生
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					get_stu: true,
					all_stu: false,
					index_code: this.navItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading();
					let stu = response.stu_list;
					let stuArray = [];
					stu.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部学生';
						obj.value = currentValue.value;
						obj.text = name;
						stuArray.push(obj)
					})
					if (stuArray.length > 0) {
						this.stuArray = stuArray;
						this.getList0();
					} else {
						this.stuArray = [];
						this.showToast('无数据授权 无法获取学生');
					}
				})
			},
			getList0() { //获取页面数据
				let comData = {
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					stu_code: this.stuArray[this.stuIndex].value,
					index_code: this.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZHSZ + 'stu/diagram', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.mod_list.length; i++) {
							var tempM = data.data.mod_list[i];
							if (tempM.mod_code == '1002') {
								if (tempM.mod_data.img_url == null) {
									tempM.mod_data.img_url = 'https://www.108800.com/user.jpg';
								}
							}
						}
						this.listArray = data.data.mod_list;
					} else {
						this.showToast(data.msg);
					}
				})
			}
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index = 100
			this.navItem = itemData;
			this.index_code = itemData.access.split("#")[1];
			this.getGrd();
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
	}
</script>

<style>
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.content {
		margin: 2px 0;
	}

	.slot-text {
		flex: 1;
		font-size: 14px;
		margin-right: 10px;
	}

	.line {
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}

	.title-text {
		display: flex;
		align-items: center;
		width: 80vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.detail-text {
		color: #939393;
		font-size: 12px;
		margin: 3px 0;
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

	.uni-input-input {
		font-size: 13px;
	}
</style>
