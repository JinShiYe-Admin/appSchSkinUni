<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="保存" :textClick="textClick"></mynavBar>
		<uni-notice-bar :single="true" text="第三步:请完善学生考勤情况并保存!" />
		<view style="padding:0 15px;">
			<view class="title-text">{{tabBarItem.grd.text}}{{tabBarItem.cls.text}}&ensp;{{tabBarItem.parseTime}}&ensp;{{getWeek()}}&ensp;{{tabBarItem.jc.text}}{{getJcTime()}}{{tabBarItem.km.text}}&ensp;课堂考勤</view>
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
			<uni-list-item v-for="(item,index) in tabBarItem.stuList" :key="index" :ellipsis="1" :title="item.name" :note="item.value" rightText="右侧文字" >
				<template v-slot:footer>
					<view class="uni-flex uni-row form-view">
						<picker v-if="item.status=='interfaceData'" style="width:120px;" mode="selector" @change="rightSelect(item,$event)" :value="item.rightIndex" :range="rightList2" range-key="text">
							<input class="uni-input form-right"  :value="item.rightIndex>=0?rightList2[item.rightIndex].text:''"  placeholder="请选择" disabled/>
						</picker>
						<picker v-else style="width:120px;" mode="selector" @change="rightSelect(item,$event)" :range="rightList" :value="item.rightIndex" range-key="text">
							<input class="uni-input form-right"  :value="item.rightIndex>=0?rightList[item.rightIndex].text:''"  placeholder="请选择" disabled/>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="已存在考勤记录,保存将覆盖原有记录!" closeText='继续' confirmText="取消" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="alertDialog2" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="当前班级无考勤异常学生，无需保存，是否返回！!" closeText='返回' confirmText="取消" @confirm="dialogConfirm2"></uni-popup-dialog>
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
				bjrs:0,yd:0,ktqq:0,cd:0,zt:0,sj:0,bj:0,
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
			itemData.text='点名添加'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code 
			console.log("this.tabBarItem: " + JSON.stringify(this.tabBarItem));
			// let rightList = [{text:'已到',value:'*'}].concat(this.tabBarItem.leaveDict).concat(this.tabBarItem.attendanceDict)
			let rightList = [{text:'已到',value:'*'}].concat(this.tabBarItem.attendanceDict)
			let rightList2 = [{text:'检测识别',value:'**'}].concat(rightList)
			this.rightList=rightList
			this.rightList2=rightList2
			let stuList=itemData.stuList
			stuList.map(stuItem=>{
				stuItem.rightIndex=-1
				stuItem.status='default'//没有默认值
				rightList2.map((rightItem,index)=>{
					if(stuItem.item_code==rightItem.value){
						stuItem.equType='接口操作赋值'
						stuItem.rightIndex=index
						stuItem.status='interfaceData'//接口操作赋值
					}
				})
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
					let stuList=[]
					this.stuList.map(stuItem=>{
						if(stuItem.item_code=='*' || stuItem.item_code=='**'){}else{
							let obj={
								stu_code:stuItem.value,
								stu_name:stuItem.name,
								item_code:stuItem.item_code,
							}
							stuList.push(obj)
						}
					})
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
					grd_code:this.tabBarItem.grd.value,
					cls_code:this.tabBarItem.cls.value,
					class_node:this.tabBarItem.jc.value,
					begintime: this.tabBarItem.time,
					endtime: this.tabBarItem.time,
					index_code: this.index_code,
				}
				console.log("comData: " + JSON.stringify(comData));
				this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/deleteList',comData,(response0,response)=>{
				    console.log("StudentAttendance/deleteList: " + JSON.stringify(response));
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
					grd_code:this.tabBarItem.grd.value,
					grd_name:this.tabBarItem.grd.text,
					cls_code:this.tabBarItem.cls.value,
					cls_name:this.tabBarItem.cls.text,
					attendance_time:this.tabBarItem.time,
					class_node:this.tabBarItem.jc.value,
					sub_code:this.tabBarItem.km.value,
					sub_name:this.tabBarItem.km.text,
					comment:'',
					list:stuList,
					index_code:this.index_code,
				}
				console.log("comData: " + JSON.stringify(comData));
				//113.课堂考勤-按班级新增
				this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/saveList',comData,(response0,response)=>{
					console.log("responseaaaa: " + JSON.stringify(response));
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
			//获取节次对应的时间
			getJcTime(){
				let classDict=this.tabBarItem.classDict
				let jcValue=this.tabBarItem.jc.value
				let time=''
				classDict.map(classItem=>{
					if(classItem.class_node==jcValue){
						let beginTime=classItem.class_begintime
						let endTime=classItem.class_endtime
						if(beginTime){
							beginTime=beginTime.split(":")[0]+':'+beginTime.split(":")[1]
						}
						if(endTime){
							endTime=endTime.split(":")[0]+':'+endTime.split(":")[1]
						}
						time='（'+beginTime+'-'+endTime+'）'
					}
				})
				return time
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
				let bjrs=[],yd=[],ktqq=[],cd=[],zt=[],sj=[],bj=[]
				this.stuList.map(stuItem=>{
					if(stuItem.item_code&&stuItem.item_code=='*'){
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
	
</style>
