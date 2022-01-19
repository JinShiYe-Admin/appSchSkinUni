<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="保存" :textClick="textClick"></mynavBar>
		<uni-notice-bar :single="true" text="第三步:请完善学生考勤情况并保存！" />
		<view style="padding:0 15px;">
			<view class="title-text">{{tabBarItem.parseTime}}&ensp;{{getWeek()}}&ensp;{{tabBarItem.qa.text}}{{tabBarItem.floor.sut_sex}}宿舍楼{{tabBarItem.build.text}}{{tabBarItem.floor.text}}{{tabBarItem.dorm.text}}&ensp;宿舍点名</view>
			<view class="detail-text-time">检测时间段：{{tabBarItem.beginTime}} ~ {{tabBarItem.endTime}}</view>
			<view class="title-total">
				<view class="detail-text-total">住宿人数：<view><text style="font-size: 15px;font-weight: 600;">{{zsrs}}</text>人</view></view>
				<view class="detail-text-total">已到：<view><text style="font-size: 15px;font-weight: 600;">{{yd}}</text>人</view></view>
				<view class="detail-text-total">缺勤：<view><text style="font-size: 15px;font-weight: 600;">{{qq}}</text>人</view></view>
				<view class="detail-text-total">事假：<view><text style="font-size: 15px;font-weight: 600;">{{sj}}</text>人</view></view>
				<view class="detail-text-total">病假：<view><text style="font-size: 15px;font-weight: 600;">{{bj}}</text>人</view></view>
			</view>
		</view>
		
		<view class="line"></view>
		<view style="position: sticky;top: 44px;z-index: 2;background: #EAEAEA;margin:-6px 0 0;">
			<view style="display: flex;">
				<button type="primary" style="font-size: 14px;background-color: #4cd964;border-color: #4cd964;" @click="yidao">"请选择"默认为已到</button>
				<button type="primary" style="font-size: 14px;background-color: #f0ad4e;border-color: #f0ad4e;" @click='queqin'>"请选择"默认为{{tabBarItem.qa.keyText}}</button>
			</view>
		</view>
		<uni-list>
			<uni-list-item v-for="(item,index) in tabBarItem.stuList" :key="index" :ellipsis="1" :title="item.stu_name" :note="item.card_id" >
				<template v-slot:footer>
					<view class="uni-flex uni-row form-view">
						<template v-if="item.interface">
							<template v-if="item.disabled">
								<input class="uni-input form-right"  :value="item.item_txt"  disabled @click="showWarn"/>
							</template>
							<template v-else>
								<picker style="width:120px;" mode="selector" @change="rightSelect2(item,$event)" :value="item.rightIndex" :range="rightList2" range-key="text">
									<input class="uni-input form-right"  :value="item.rightIndex>=0?rightList2[item.rightIndex].text:''"  placeholder="请选择" disabled/>
								</picker>
							</template>
							<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
						</template>
						<template v-else>
							<picker style="width:120px;" mode="selector" @change="rightSelect(item,$event)" :range="rightList" :value="item.rightIndex" range-key="text" >
								<input class="uni-input form-right"  :value="item.rightIndex>=0?rightList[item.rightIndex].text:''"  placeholder="请选择" disabled/>
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
			<uni-popup-dialog type="warn" title="提醒" content="当前宿舍所有学生均已正常到勤，无需记录！" closeText='取消' confirmText="返回" @confirm="dialogConfirm2"></uni-popup-dialog>
		</uni-popup>
	</view>
</template> 

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	 
	 
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				rightList:[],
				rightList2:[],
				stuList:[],
				zsrs:0,yd:0,qq:0,sj:0,bj:0,
				canSub:true,
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			let parseTime=this.moment(itemData.time).format('YYYY年MM月DD日')
			itemData.parseTime=parseTime
			itemData.index=100
			itemData.text='宿舍点名登记'
			if(itemData.qa.value=='noon'){
				itemData.qa.keyText='午休缺勤'
			}else if(itemData.qa.value=='night'){
				itemData.qa.keyText='晚休缺勤'
			}
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code 
			console.log("this.tabBarItem: " + JSON.stringify(this.tabBarItem));
			let rightList = [{text:'已到',value:'*'}].concat(this.tabBarItem.attendanceList)
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
					stuItem.interface=true
				}
				if(stuItem.item_code=='sickLeave' || stuItem.item_code=='absenceLeave'){
					stuItem.rightIndex=0
					stuItem.status='leaveData'//请假记录赋值
					stuItem.disabled=true
					stuItem.interface=true
				}
			}) 
			console.log("stuList: " + JSON.stringify(stuList));
			this.stuList=stuList
			this.setTotal();
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){
			//#ifndef APP-PLUS
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
				this.stuList.map(stuItem=>{
					if(stuItem.rightIndex==-1){
						 canSubmit=false
					}
				})
				if(canSubmit){
					let stuList=this.getStuList()
					if(stuList.length>0){
						if(this.tabBarItem.historyData){
							this.$refs.alertDialog.open()
							this.canSub=false
						}else{
							if(this.canSub){
								this.canSub=false
								this.showLoading()
								this.submitData()
							}
						}
					}else{
						this.$refs.alertDialog2.open()
					}
				}else{
					this.showToast('请将考勤情况填写完整再保存！')
				}
			},
			//删除之前的考勤记录 112
			deleteData(){
				let comData={
					begintime: this.tabBarItem.time,
					endtime: this.tabBarItem.time,
					dorm_name:this.tabBarItem.build.value,
					floor_num:this.tabBarItem.floor.value,
					room_name:this.tabBarItem.dorm.value,
					rest_code:this.tabBarItem.qa.value,
					index_code: this.index_code,
				}
				console.log("comData: " + JSON.stringify(comData));
				this.post(this.globaData.INTERFACE_DORM.substring(0,this.globaData.INTERFACE_DORM.length-4)+'dormAttendance/deleteList',comData,(response0,response)=>{
				    console.log("dormAttendance/deleteList::::" + JSON.stringify(response));
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
					attendance_date:this.tabBarItem.time,
					dorm_name:this.tabBarItem.build.value,
					floor_num:this.tabBarItem.floor.value,
					room_name:this.tabBarItem.dorm.value,
					register_type:'room',
					rest_code:this.tabBarItem.qa.value,
					list:this.getStuList(),
					index_code:this.index_code,
				}
				console.log("comData: " + JSON.stringify(comData));
				//109.查寝及点名登记-批量新增
				this.post(this.globaData.INTERFACE_DORM.substring(0,this.globaData.INTERFACE_DORM.length-4)+'dormAttendance/addList',comData,(response0,response)=>{
					console.log("responseaaaa: " + JSON.stringify(response));
					if (response.code == 0) {
						 this.hideLoading()
						 this.showToast(response.msg);
						 var pages = getCurrentPages();
						 let pageIndex=1
						 pages.map((item,index)=>{
							 if(item.route.indexOf('pages/stu_dorm/attendance_dorm_index')!==-1){
								 pageIndex=(pages.length-1)-index
							 }
						 })
						 uni.$emit('refreshDromList', {data: 1});
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
							stu_code:stuItem.stu_code,
							stu_name:stuItem.stu_name,
							item_name:stuItem.item_txt,
							cls_code:stuItem.cls_code,
							cls_name:stuItem.cls_name,
							grd_code:stuItem.grd_code,
							grd_name:stuItem.grd_name,
							bed_num:stuItem.bed_num,
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
							console.log("this.tabBarItem.qa.keyText: ",this.tabBarItem.qa.keyText);
							if(rightItem.value==this.tabBarItem.qa.keyText){
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
				let week=this.moment(this.tabBarItem.time).day()
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
				let zsrs=[],yd=[],qq=[],sj=[],bj=[]
				this.stuList.map(stuItem=>{
					if(stuItem.item_code&&(stuItem.item_code=='*' || stuItem.item_code=='**')){
						yd.push(stuItem)
					}
					if(stuItem.item_code&&stuItem.item_code.indexOf('缺勤')!=-1){
						qq.push(stuItem)
					}
					if(stuItem.item_code&&stuItem.item_code=='absenceLeave'){
						sj.push(stuItem)
					}
					if(stuItem.item_code&&stuItem.item_code=='sickLeave'){
						bj.push(stuItem)
					}
				})
				this.zsrs=this.stuList.length
				this.yd=yd.length
				this.qq=qq.length
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
	
	.detail-text{
		color: #6C6C6C;
		font-size: 13px;
		margin: 3px 0;
		display: flex;
		align-items: center;
	}
	@media screen and (max-width:375px){
		.title-total{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: 15px;
		}
		
		.detail-text-total{
			color: #6C6C6C;
			font-size: 13px;
			margin: 3px 8px 3px 0;
			width: calc(49% - 10px);
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
		}
	}
	@media screen and (min-width:375px){
		.title-total{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			margin-top: 15px;
		}
		
		.detail-text-total{
			color: #6C6C6C;
			font-size: 13px;
			margin: 3px 15px 3px 0;
			width: calc(32% - 15px);
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
		}
	}
	
	.detail-text-time{
		color: #6C6C6C;
		font-size: 13px;
		margin:8px 5px;
		text-align: center;
	}
	
	::v-deep .uni-list-item__content{
		justify-content: center !important;
	}
	
</style>
