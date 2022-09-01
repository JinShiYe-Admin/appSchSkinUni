<template>
	<view>
		<!-- <mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' icon="plusempty" :iconClick="iconClick" @clickLeft='clickLeft()'>
		</mynavBar> -->
		<uniNavBar :title='navItem.name' style="font-size: 10px;" left-icon="back" backgroundColor='#00CFBD' fixed='true' statusBar='true' color='white' @clickLeft='clickLeft()' rightIcon='plusempty' @clickRight="clickRight"></uniNavBar>
		<view v-if="otherList.length ==0" style="text-align: center;margin-top: 10px;font-size: 14px;color: chocolate;">
			暂无同住人</view>
		<view v-for="(item,index) in otherList" :key="index">
			<view class="viewBackground" @click="editOther(item,index)">
				<view style="margin: 5px 0 0 8px;font-size: 14px;padding-top: 5px;">同住人{{index+1}}</view>
				<uni-row style='margin-top: 8px;margin-bottom: 5px;'>
					<uni-col class="" style='font-size: 18px;padding-left: 8px;font-weight: 900;' :span="14">
						{{item.name}}
					</uni-col>
					<uni-col class="" style='font-size: 16px;color: #505050;margin-bottom: 8px;' :span="10">
						{{item.relation}}
					</uni-col>
				</uni-row>
			</view>
		</view>
		<uni-popup ref="popupSelect" type="center" style="background-color: white;">
			<view
				style="background-color: white;padding: 10px;border-radius: 5px 5px 0px 0px;width: 300px;height: 350px;">
				<!-- <view style="text-align: center;margin-top: 20px;font-size: 17px;">添加同住人</view> -->
				<view style="text-align: center;padding-top: 10px;" v-if="editModel.id">编辑添加同住人{{editIndex}}</view>
				<view style="text-align: center;padding-top: 10px;" v-else>添加同住人{{otherList.length+1}}</view>
				<uni-row style="margin-bottom: 5px;">
					<uni-col class="addEditLeft" :span="5">
						姓名：
					</uni-col>
					<uni-col :span="18">
						<input maxlength="10" type="text" v-model="editModel.otherName" class="rightView" style="margin-top: 15px;"
							placeholder="请输入姓名" />
					</uni-col>
					<uni-col class="addEditLeft" :span="5">
						关系：
					</uni-col>
					<uni-col :span="18">
						<picker style="margin-top: 10px;" v-if="relationList.length>0" @change="clickRelationEdit"
							:value="editModel.relationIndex" :range="relationList" range-key='text'>
							<view class="uni-input pickBorder">{{relationList[editModel.relationIndex].text}}
								<uni-icons style="float: right;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
							</view>
						</picker>
					</uni-col>
				</uni-row>
				<view v-if="editModel.id" class="uploadView" @click="popSure(2)">删除同住人</view>
			</view>
			<view style="background-color: white;height: 50px;border-radius: 0px 0px 5px 5px;">
				<button class="mini-btn" type="default" size="mini" @click="popSure(0)">取消</button>
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #00cfbd;border-color: #00cfbd;color: white;"
					@click="popSure(1)">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	// import mynavBar from '@/components/my-navBar/m-navBar';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				index_code: '',
				otherList: [], //同住人列表
				editModel:{
					otherName:'',
					relationIndex:0,
				},
				editIndex:1,
				roomyFlag:0,//是否修改
				relationList: [{
					text: '父亲',
					value: 0
				}, {
					text: '母亲',
					value: 1
				}, {
					text: '爷爷',
					value: 2
				}, {
					text: '奶奶',
					value: 3
				}, {
					text: '亲戚',
					value: 4
				}, {
					text: '朋友',
					value: 5
				}],
			}
		},
		components: {
			// mynavBar
			uniNavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.navItem.text = '同住人管理';
			this.navItem.index = 100;
			this.index_code = this.navItem.access.split("#")[1]
			//#ifdef H5
			document.title = "";
			this.wxTips = ',微信端不支持多选'; //如果是H5，需要提示该内容
			//#endif
			// 2.16.学生同住人列表
			this.getRoomyList();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			clickLeft(){
				if (this.roomyFlag == 1) {
					const eventChannel = _this.getOpenerEventChannel()
					eventChannel.emit('refreshOtherList', {data: _this.otherList});
				}
				uni.navigateBack();
			},
			clickRelationEdit: function(e) {
				if (this.editModel.relationIndex !== e.target.value) {
					this.editModel.relationIndex = e.target.value;
				}
			},
			clickRight() {
				var tempM = {
					otherName:'',
					relationIndex:0
				}
				this.editModel = tempM;
				console.log('iconClick');
				this.$refs.popupSelect.open();
			},
			editOther(model,index){
				console.log('editOther:'+JSON.stringify(model))
				this.editIndex = index+1;
				var tempM = {
					otherName:model.name,
					id:model.id
				}
				for (var i = 0; i < this.relationList.length; i++) {
					var tempR = this.relationList[i];
					if (tempR.text == model.relation) {
						tempM.relationIndex = i;
					}
				}
				this.editModel = tempM;
				this.$refs.popupSelect.open();
			},
			popSure(flag) {
				if (flag == 0) {

				} else if (flag == 1){
					if (this.editModel.otherName.length==0||this.editModel.otherName.length<2||this.editModel.otherName.length>10) {
						this.showToast('请输入正确的同住人姓名');
						return;
					} else{
						var comData = {
							index_code: _this.index_code,
							stu_code: this.personInfo.stu_code, //
							name:this.editModel.otherName,
							relation:this.relationList[this.editModel.relationIndex].text
						}
						// 2.13.添加
						var tempUrl = 'roomy/add';
						if (this.editModel.id) {
							comData.id = this.editModel.id;
							//2.14.编辑
							tempUrl = 'roomy/edit';
						}
						this.showLoading();
						this.post(this.globaData.INTERFACE_HEALTH_DATA + tempUrl, comData, (data0,
							data) => {
							this.hideLoading();
							if (data.code == 0) {
								this.roomyFlag = 1;
								// 2.16.学生同住人列表
								this.getRoomyList();
							} else {
								this.showToast(data.msg);
								return;
							}
						});
					}
				}else if(flag == 2){
					var comData = {
						index_code: _this.index_code,
						id : this.editModel.id
					}
					this.showLoading();
					// 2.15.删除
					this.post(this.globaData.INTERFACE_HEALTH_DATA + 'roomy/delete', comData, (data0,
						data) => {
						this.hideLoading();
						if (data.code == 0) {
							this.roomyFlag = 1;
							// 2.16.学生同住人列表
							this.getRoomyList();
						} else {
							this.showToast(data.msg);
							return;
						}
					});
				}
				this.$refs.popupSelect.close();
			},
			// 2.16.学生同住人列表
			getRoomyList() {
				var comData = {
					index_code: _this.index_code,
					stu_code: this.personInfo.stu_code //
				}
				this.showLoading();
				// 2.16.学生同住人列表
				this.post(this.globaData.INTERFACE_HEALTH_DATA + 'roomy/list', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.otherList = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				});
			},
		}
	}
</script>

<style>
	.titleTemp {
		color: black;
		margin-left: 10px;
		margin-top: 25px;
		float: left;
		width: 40px;
	}

	.rightView {
		float: left;
		border: 1px solid gainsboro;
		/* margin: 5px 0 0 0px; */
		font-size: 14px;
		width: calc(100% - 45px);
		height: 35px;
		padding-left: 5px;
	}

	.addEditLeft {
		text-align: right;
		margin-top: 20px;
		font-size: 12px;
		color: #505050;
	}

	.addEditRight {
		text-align: left;
		margin-top: 20px;
		font-size: 12px;
		color: #E6A23C;
	}

	.pickBorder {
		border: 1px solid #e5e5e5;
		width: 160px;
		border-radius: 5px;
	}

	::v-deep .mini-date .uni-input {
		text-align: left !important;
		margin-left: 10px;
		font-size: 14px !important;
		color: #000000 !important;
	}

	.mini-btn {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		margin-left: 40px;
	}
	.viewBackground{
		background: #ceeedb;margin: 8px 15px;border-radius: 5px;
	}
	.tempVVV{
		font-size: 17px;
		color: red;
	}
	
	.uploadView {
		width: 100px;
		background: #d43030;
		color: white;
		/* height: 40px; */
		padding: 10px;
		text-align: center;
		margin-top: 130px;
		margin-bottom: 30px;
		margin-left: calc((100% - 100px)/2);
		border-radius: 5px;
	}
</style>
