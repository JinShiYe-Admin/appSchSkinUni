<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="保存" :textClick="textClick"></mynavBar>
		<uni-notice-bar :single="true" text="第三步:请完善学生考勤情况并保存！" />
		<view style="padding:0 15px;">
			<view class="title-text">{{navItem.grd.text}}{{navItem.cls.text}}&ensp;{{navItem.parseTime}}&ensp;{{getWeek()}}&ensp;{{navItem.jc.text}}{{navItem.km?navItem.km.text:''}}&ensp;课堂考勤</view>
			<view class="title-total">
				<view class="detail-text-total">班级人数：<view><text style="font-size: 15px;font-weight: 600;">{{bjrs}}</text>人</view></view>
				<view class="detail-text-total">已到：<view><text style="font-size: 15px;font-weight: 600;">{{yd}}</text>人</view></view>
				<view class="detail-text-total">课堂缺勤：<view><text style="font-size: 15px;font-weight: 600;">{{ktqq}}</text>人</view></view>
				<view class="detail-text-total">迟到：<view><text style="font-size: 15px;font-weight: 600;">{{cd}}</text>人</view></view>
				<view class="detail-text-total">早退：<view><text style="font-size: 15px;font-weight: 600;">{{zt}}</text>人</view></view>
				<view class="detail-text-total">事假：<view><text style="font-size: 15px;font-weight: 600;">{{sj}}</text>人</view></view>
				<view class="detail-text-total">病假：<view><text style="font-size: 15px;font-weight: 600;">{{bj}}</text>人</view></view>
			</view>
		</view>
		<view class="line"></view>
		<view style="position: sticky;top: 44px;z-index: 2;background: #EAEAEA;margin:-6px 0 0;">
			<view style="display: flex;">
				<button type="primary" style="font-size: 14px;background-color: #4cd964;border-color: #4cd964;" @click="yidao">"请选择"默认为已到</button>
				<button type="primary" style="font-size: 14px;background-color: #f0ad4e;border-color: #f0ad4e;" @click='queqin'>"请选择"默认为缺勤</button>
			</view>
		</view>
		<uni-list>
			<uni-list-item v-for="(item,index) in navItem.stuList" :key="index" :ellipsis="1" :title="item.name" :note="item.sno?item.sno:'无学号'" >
				<template v-slot:footer>
					<view class="uni-flex uni-row form-view">
						<template v-if="item.interface">
							<template v-if="item.disabled">
								<!-- <input class="uni-input form-right"  :value="item.item_txt"  disabled @click="showWarn"/> -->
								<view class="uni-input form-right" @click="showWarn">{{item.item_txt.length>0?item.item_txt:'请选择'}}</view>
							</template>
							<template v-else>
								<picker style="width:120px;" mode="selector" @change="rightSelect2(item,$event)" :value="item.rightIndex" :range="rightList2" range-key="text">
									<!-- <input class="uni-input form-right"  :value="item.rightIndex>=0?rightList2[item.rightIndex].text:''"  placeholder="请选择" disabled/> -->
									<view class="uni-input form-right">{{item.rightIndex>=0?rightList2[item.rightIndex].text:'请选择'}}</view>
								</picker>
							</template>
							<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
						</template>
						<template v-else>
							<picker style="width:120px;" mode="selector" @change="rightSelect(item,$event)" :range="rightList" :value="item.rightIndex" range-key="text" >
								<!-- <input class="uni-input form-right"  :value="item.rightIndex>=0?rightList[item.rightIndex].text:''"  placeholder="请选择" disabled/> -->
								<view class="uni-input form-right">{{item.rightIndex>=0?rightList[item.rightIndex].text:'请选择'}}</view>
							</picker>
							<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
						</template>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="已存在考勤记录,保存将覆盖原有记录！" closeText='取消' confirmText="继续" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="alertDialog2" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="当前班级所有学生均已正常到勤，无需记录！" closeText='取消' confirmText="返回" @confirm="dialogConfirm2"></uni-popup-dialog>
		</uni-popup>
	</view>
</template> 

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	 
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				navItem: {},
				rightList:[],
				rightList2:[],
				stuList:[],
				bjrs:0,yd:0,ktqq:0,cd:0,zt:0,sj:0,bj:0,
				canSub:true,
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			let parseTime=this.moment(itemData.time).format('YYYY年MM月DD日')
			itemData.parseTime=parseTime
			itemData.index=100
			itemData.text='课堂点名登记'
			this.navItem = itemData;
			this.index_code=itemData.index_code 
			// console.log("this.navItem: " + JSON.stringify(this.navItem));
			let rightList = [{text:'已到',value:'*'}].concat(this.navItem.attendanceDict)
			let rightList2 = [{text:'检测识别',value:'**'}].concat(rightList)
			this.rightList=rightList
			this.rightList2=rightList2
			let stuList=itemData.stuList
			stuList.map(stuItem=>{
				stuItem.rightIndex=-1
				stuItem.status='default'//没有默认值
				stuItem.interface=false//接口赋值 设备识别的数据
				stuItem.disabled=false//是否禁选状态， 如果数据是从学生请假那边的数据，则不能选
				if(stuItem.item_code=='**'){
					stuItem.rightIndex=0
					stuItem.status='interfaceData'//接口操作赋值
					stuItem.interface=true//设备识别的数据
				}
				if(stuItem.item_code=='sickLeave' || stuItem.item_code=='absenceLeave'){
					stuItem.rightIndex=0
					stuItem.status='leaveData'//请假记录赋值
					stuItem.disabled=true	
					stuItem.interface=true
				}
			}) 
			// console.log("stuList: " + JSON.stringify(stuList));
			this.stuList=stuList
			this.setTotal();
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){
			//#ifdef H5
				document.title=""
			//#endif
		},
		methods: {
			showWarn(){
				this.showToast('该学生已请假，无法修改考勤情况')
			},
			dialogConfirm(e){
				this.$refs.alertDialog.close()
				this.showLoading();
				this.deleteData()
			},
			dialogConfirm2(e){
				this.$refs.alertDialog2.close()
				var pages = getCurrentPages();
				let pageIndex=1
				pages.map((item,index)=>{
					 if(item.route.indexOf('pages/schapp_work/ketangIndex')!==-1){
						 pageIndex=(pages.length-1)-index
					 }
				})
				uni.$emit('refreshKetangList', {data: 1});
				uni.navigateBack({delta:pageIndex});
			},
			dialogClose(){
				this.canSub=true
			},
			textClick(){
				let canSubmit=true
				_this.stuList.map(stuItem=>{
					if(stuItem.rightIndex==-1){
						 canSubmit=false
					}
				})
				if(canSubmit){
					let stuList=_this.getStuList()
					if(stuList.length>0){
						if(_this.navItem.historyData){
							_this.$refs.alertDialog.open()
							_this.canSub=false
						}else{
							if(_this.canSub){
								_this.canSub=false
								_this.showLoading()
								_this.submitData()
							}
						}
					}else{
						_this.$refs.alertDialog2.open()
					}
				}else{
					_this.showToast('请将考勤情况填写完整再保存！')
				}
			},
			//删除之前的考勤记录 112
			deleteData(){
				let comData={
					grd_code:this.navItem.grd.value,
					cls_code:this.navItem.cls.value,
					class_node:this.navItem.jc.value,
					begintime: this.navItem.time,
					endtime: this.navItem.time,
					index_code: this.index_code,
				}
				// console.log("comData: " + JSON.stringify(comData));
				this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/deleteList',comData,(response0,response)=>{
				    // console.log("StudentAttendance/deleteList: " + JSON.stringify(response));
					if(response.state=='ok'){
						this.submitData()
					}else{
						this.hideLoading()
						this.showToast('历史考勤记录删除失败,请联系管理员')
					}
				})
			},
			submitData(){
				let comData={
					grd_code:this.navItem.grd.value,
					grd_name:this.navItem.grd.text,
					cls_code:this.navItem.cls.value,
					cls_name:this.navItem.cls.text,
					attendance_time:this.navItem.time,
					class_node:this.navItem.jc.value,
					sub_code:this.navItem.km?this.navItem.km.value:'',
					sub_name:this.navItem.km?this.navItem.km.text:'',
					comment:'',
					list:this.getStuList(),
					index_code:this.index_code,
				}
				// console.log("comData: " + JSON.stringify(comData));
				//113.课堂考勤-按班级新增
				this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/saveList',comData,(response0,response)=>{
					// console.log("responseaaaa: " + JSON.stringify(response));
					if (response.code == 0) {
						 this.hideLoading()
						 this.showToast(response.msg);
						 var pages = getCurrentPages();
						 let pageIndex=1
						 pages.map((item,index)=>{
							 if(item.route.indexOf('pages/schapp_work/ketangIndex')!==-1){
								 pageIndex=(pages.length-1)-index
							 }
						 })
						 uni.$emit('refreshKetangList', {data: 1});
						 uni.navigateBack({delta:pageIndex});
					} else {
						this.canSub=true
						this.hideLoading()
						this.showToast(response.msg);
					}
				},()=>{
						this.canSub=true
				})
			},
			getStuList(){
				let stuList=[]
				this.stuList.map(stuItem=>{
					//已到、检测识别、事假、病假不提交，需要排除
					if(stuItem.item_code=='*' || stuItem.item_code=='**' || stuItem.item_code=='absenceLeave' || stuItem.item_code=='sickLeave'){}else{
						let obj={
							stu_code:stuItem.value,
							stu_name:stuItem.name,
							item_code:stuItem.item_code,
						}
						stuList.push(obj)
					}
				})
				return stuList;
			},
			yidao(){
				let stuList=this.stuList
				stuList.map(stuItem=>{
					if(stuItem.status=='default'){
						stuItem.equType='用户点击默认为已到'
						stuItem.item_txt='已到'
						stuItem.item_code='*'
						stuItem.rightIndex=0
					}
				})
				this.stuList=stuList
				this.setTotal()
				this.$forceUpdate();
			},
			queqin(){
				let stuList=this.stuList
				stuList.map(stuItem=>{
					if(stuItem.status=='default'){
						stuItem.equType='用户点击默认为缺勤'
						this.rightList.map((rightItem,index)=>{
							if(rightItem.value=='classAbsence'){
								stuItem.item_txt=rightItem.text
								stuItem.item_code=rightItem.value
								stuItem.rightIndex=index
							}
						})
					}
				})
				this.stuList=stuList
				this.setTotal()
				this.$forceUpdate();
			},
			rightSelect(item,e){
				if(this.rightList.length>0){
					if(item.rightIndex!==e.detail.value){
						 item.equType='用户操作赋值'
						 item.rightIndex=e.detail.value
						 item.item_txt=this.rightList[e.detail.value].text
						 item.item_code=this.rightList[e.detail.value].value
						 item.status='initData'//用户操作赋值
					}
				}
				this.setTotal()
				this.$forceUpdate();
			},
			rightSelect2(item,e){
				if(this.rightList2.length>0){
					if(item.rightIndex!==e.detail.value){
						 item.equType='用户操作赋值'
						 item.rightIndex=e.detail.value
						 item.item_txt=this.rightList2[e.detail.value].text
						 item.item_code=this.rightList2[e.detail.value].value
						 item.status='initData'//用户操作赋值
					}
				}
				this.setTotal()
				this.$forceUpdate();
			},
			//获取星期几
			getWeek(){
				let week=this.moment(this.navItem.time).day()
				let weekName=''
				switch (week){
					case 1:
						weekName='星期一'
						break;
					case 2:
						weekName='星期二'
						break;
					case 3:
						weekName='星期三'
						break;
					case 4:
						weekName='星期四'
						break;
					case 5:
						weekName='星期五'
						break;
					case 6:
						weekName='星期六'
						break;
					case 0:
						weekName='星期日'
						break;
				}
				return weekName;
			},
			setTotal(){
				let bjrs=[],yd=[],ktqq=[],cd=[],zt=[],sj=[],bj=[]
				this.stuList.map(stuItem=>{
					if(stuItem.item_code&&(stuItem.item_code=='*' || stuItem.item_code=='**')){
						yd.push(stuItem)
					}
					if(stuItem.item_code&&stuItem.item_code=='classAbsence'){
						ktqq.push(stuItem)
					}
					if(stuItem.item_code&&stuItem.item_code=='classLate'){
						cd.push(stuItem)
					}
					if(stuItem.item_code&&stuItem.item_code=='classEarly'){
						zt.push(stuItem)
					}
					if(stuItem.item_code&&stuItem.item_code=='absenceLeave'){
						sj.push(stuItem)
					}
					if(stuItem.item_code&&stuItem.item_code=='sickLeave'){
						bj.push(stuItem)
					}
				})
				this.bjrs=this.stuList.length
				this.yd=yd.length
				this.ktqq=ktqq.length
				this.cd=cd.length
				this.zt=zt.length
				this.sj=sj.length
				this.bj=bj.length
			}
		},
	}
</script>

<style>
	::v-deep .uni-section{
		margin-top: 0;
	}
	::v-deep .form-view{
		padding: 0 !important;
	}
	.line{
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.line-green{
		background-color: #00CFBD;
		margin-bottom: 0.3125rem;
		height: 1px;
	}
	.double-line{
		height: 5px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.form-view{
		padding: 0px 15px;
	}
	.form-left{
		font-size: 14px;
		width: 200rpx;
		color: #3F3F3F;
	}
	.form-left-textarea{
		margin-top: 5px;
		align-self: flex-start;
	}
	.form-right{
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
		text-align: right;
	}
	::v-deep .form-right .placeholder{
		color: grey;
		font-size: 14px;
		padding-right: 10px;
	}
	.uni-flex{
		align-items: center;
	}
	
	textarea{
		font-size: 13px;
		height: 80px;
		padding: 5px;
	}
	
	.form-left-approve{
		margin: 5px 0;
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
	}
	
	.title-text{
		text-align: center;
		word-break: break-all;
		display: flex;
		align-items: center;
		font-size: 17px;
		font-weight: 600;
	}
	
	.title-total{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 15px;
	}
	
	.detail-text{
		color: #6C6C6C;
		font-size: 13px;
		margin: 3px 0;
		display: flex;
		align-items: center;
	}
	@media screen and (max-width:375px){
		.detail-text-total{
			color: #6C6C6C;
			font-size: 13px;
			margin: 3px 0;
			width: calc(49% - 5px);
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
		}
	}
	@media screen and (min-width:375px){
		.detail-text-total{
			color: #6C6C6C;
			font-size: 13px;
			margin: 3px 0;
			width: calc(32% - 5px);
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
		}
	}
	
	::v-deep .uni-list-item__content{
		justify-content: center;
	}
</style>
