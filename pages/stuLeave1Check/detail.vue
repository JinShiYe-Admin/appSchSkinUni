<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="navRightText"
			:textClick="textClick">
		</mynavBar>
		<uni-card isShadow style="margin: 10px;">
			<view style="font-size: 16px;font-weight: 900;">申请详情</view>
			<view class="select-line"></view>
			<uni-row style="margin-top: 10px;">
				<uni-col :span="6">
					<view class="rowStyle">班级：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.cls_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">学生：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.stu_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">请假类别：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.type_code=='absenceLeave'?'事假':'病假'}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">开始时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.start_time}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">结束时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.end_time}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">请假时长：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">
						{{parseInt(vacation_app.vacation_day / 24)}}天{{(vacation_app.vacation_day % 24).toFixed(1)}}小时
					</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">请假事由：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.explanation}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">申请时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.create_time}}</view>
				</uni-col>
				<uni-col v-if="imgList.length>0" :span="6">
					<view class="rowStyle">材料：</view>
				</uni-col>
				<uni-col v-if="imgList.length>0" :span="18">
					<g-upload ref='gUpload' :mode="imgList" :control='false' :deleteBtn='false'
						columnNum="3"></g-upload>
				</uni-col>
			</uni-row>
		</uni-card>
		<view v-if="vacation_app.vacation_type==0" style="">
			<uni-card v-if="paretsList.length>0" isShadow style="margin: 10px;">
				<view style="font-size: 16px;font-weight: 900;">家长联系方式</view>
				<view class="select-line"></view>
				<uni-row style="margin-top: 10px;text-align: center;" v-for="(item,index) in paretsList" :key="index">
					<uni-col :span="7">
						<view class="rowStyle">{{item.relationship}}</view>
					</uni-col>
					<uni-col :span="10">
						<view class="rowStyle">{{item.phone}}</view>
					</uni-col>
					<uni-col :span="7">
						<uni-icons type="phone" color='#007ce4' size="30" @click="clickPhone(item.phone)"></uni-icons>
					</uni-col>
				</uni-row>
			</uni-card>
			<uni-card isShadow style="margin: 10px;">
				<view style="font-size: 16px;font-weight: 900;">请审批</view>
				<view class="select-line"></view>
				<view class="typeCss" style="margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
						size="10"></uni-icons>我的审批意见：</view>
				<view class="uni-flex uni-row">
					<view class="flex-item" @click="clickPass(true)"
						:style="{color:isPass==true?'white':'',background:isPass==true?'#2c96bd':''}">同意</view>
					<view class="flex-item" @click="clickPass(false)"
						:style="{color:isPass==false?'white':'',background:isPass==false?'#2c96bd':''}">不同意</view>
				</view>
				<view v-if="isPass==true">
					<view class="typeCss" style="margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
							size="10"></uni-icons>准许出入权限：</view>
					<view class="uni-flex uni-row">
						<view class="flex-item" @click="clickInOut('outSchool')"
							:style="{color:in_out=='outSchool'?'white':'',background:in_out=='outSchool'?'#2c96bd':''}">可出入校园</view>
						<view class="flex-item" @click="clickInOut('backDorm')"
							:style="{color:in_out=='backDorm'?'white':'',background:in_out=='backDorm'?'#2c96bd':''}">可回宿舍</view>
					</view>
				</view>
				<view class="typeCss" style="margin-top: 20px;">说明：</view>
				<textarea style="margin-top: 10px;" maxlength="200" v-model="content" class="rightView" placeholder="请输入"></textarea>
			</uni-card>
		</view>
		<view v-else>
			<uni-card isShadow style="margin: 10px;">
				<view style="font-size: 16px;font-weight: 900;">审批情况</view>
				<view class="select-line"></view>
				<uni-row style="margin-top: 10px;">
					<uni-col :span="6">
						<view class="rowStyle">审批意见：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyle">{{vacation_app.vacation_type==1?'同意':'不同意'}}</view>
					</uni-col>
					<uni-col v-if="vacation_app.vacation_type==1" :span="6">
						<view class="rowStyle">出入权限：</view>
					</uni-col>
					<uni-col v-if="vacation_app.vacation_type==1" :span="18">
						<view class="rowStyle">{{vacation_app.in_out_permission_code=='outSchool'?'可出入校园':'可回宿舍'}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyle">说明：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyle">{{vacation_app.judge_explannation?vacation_app.judge_explannation:'无'}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyle">审批人：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyle">{{vacation_app.checker_name}}</view>
					</uni-col>
				</uni-row>
			</uni-card>
		</view>
		<view style="height: 10px;background: #f2f2f2;"></view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				navRightText: '',
				imgList: [], //材料
				vacation_app: {}, //详情
				examine_list: [], //审批情况
				isPass:true,//是否通过
				in_out:'outSchool',
				content:'',
				paretsList:[],
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.text = '学生请假详情';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '学生请假详情'
			});
			this.getData();
			//#ifdef H5
			document.title = "";
			//#endif
			//
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			clickPhone(phone){
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			clickPass(flag) {
				this.isPass = flag;
			},
			clickInOut(str) {
				this.in_out = str;
			},
			textClick() {
				let comData = {
					vacation_id: this.navItem.id,
					judge_explanation:this.content,
					examine_pass:this.isPass,
					in_out_permission_code:this.in_out,
					index_code: this.navItem.index_code,
				}
				// 6.4.审批请假申请
				this.post(this.globaData.INTERFACE_KHFW + 'stuVacation/checkApp', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showToast(data.msg);
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshstuLeave1Check');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getData() {
				let comData = {
					id: this.navItem.id,
					index_code: this.navItem.index_code,
				}
				// 6.3.学生请假详情
				this.post(this.globaData.INTERFACE_KHFW + 'stuVacation/getById', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (data.data.vacation_app.vacation_type == 0) {
							// 获取权限
							this.getPermissionByPosition('add', this.navItem.index_code, result => {
								if (result[0]) {
									this.navRightText = '确定';
								}
							})
							this.getParent();
						}
						let tempM = data.data.vacation_app;
						tempM.start_time = tempM.start_time.slice(0, 16);
						tempM.end_time = tempM.end_time.slice(0, 16);
						tempM.create_time = tempM.create_time.slice(0, 16);
						this.vacation_app = tempM;
						for (var i = 0; i < data.data.resource_list.length; i++) {
							var tempD = data.data.resource_list[i];
							this.imgList.push(tempD.image_url)
						}
						this.examine_list = data.data.examine_list; //审批情况
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getParent(){
				let comData = {
					stu_codes: this.navItem.stu_code,
					index_code: this.navItem.index_code,
				}
				// 6.3.学生请假详情
				this.post(this.globaData.INTERFACE_HR_SUB + 'parent', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.paretsList = [].concat(data.data.list);
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.card-line {
		text-align: center;
		font-size: 25px;
		color: red;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 1px solid green;
		width: 100px;
		margin-left: calc((100% - 100px)/2);
	}

	.select-line {
		height: 3px;
		background-color: #aaaaaa;
		/* margin: 0 -15px; */
	}

	.rowStyle {
		font-size: 14px;
		min-height: 30px;
		/* overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap; */
		margin-top: 5px;
		word-break: break-all;
	}

	::v-deep .uni-grid-item--border {
		border-bottom: 0px !important;
		border-right: 0px !important;
	}

	::v-deep .uni-grid-item--border-top {
		border-top: 0px !important;
	}

	::v-deep .uni-grid--border {
		border-left: 0px !important;
	}
	
	.flex-item {
		width: 100px;
		height: 26px;
		text-align: center;
		background: #d7d7d7;
		font-size: 14px;
		color: #555;
		margin: 10px 0 0 20px;
		border-radius: 5px;
		padding-top: 6px;
		margin-left: calc((100% - 200px)/3);
	}
	
	.rightView {
		border: 1px solid gainsboro;
		font-size: 14px;
		padding-left: 5px;
		height: 80px;
		padding-top: 5px;
		margin: 0 15px 0 15px;
		width: auto;
	}
</style>