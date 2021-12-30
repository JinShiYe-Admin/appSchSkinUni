<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<template v-if="addType==1">
			<view class="uni-flex uni-row form-view">
				<view class="form-left">楼房</view>
				<picker style="width:100% !important;" mode="selector" @change="buildSelect" :value="buildIndex" :range="buildList" range-key="text">
					<input class="uni-input form-right"  :value="buildIndex>=0?buildList[buildIndex].text:''"  placeholder="请选择" disabled/>
				</picker>
				<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">楼层</view>
				<picker style="width:100% !important;" mode="selector" @change="floorSelect" :value="floorIndex" :range="floorList" range-key="text">
					<input class="uni-input form-right"  :value="floorIndex>=0?floorList[floorIndex].text:''" placeholder="请选择" disabled/>
				</picker>
				<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">房间</view>
				<picker style="width:100% !important;" mode="selector" @change="dormSelect" :value="dormIndex" :range="dormList" range-key="text">
					<input class="uni-input form-right"  :value="dormIndex>=0?dormList[dormIndex].text:''"  placeholder="请选择" disabled/>
				</picker>
				<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">日期</view>
				<dy-Date class="uni-input form-right" style="display: flex;align-items: center;padding-right: 0;" :childValue='time'  timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
				<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">午/晚休</view>
				<picker style="width:100% !important;" mode="selector" @change="qaSelect" :value="qaIndex" :range="qaArray" range-key="text">
					<input class="uni-input form-right"  :value="qaIndex>=0?qaArray[qaIndex].text:''" placeholder="请选择" disabled/>
				</picker>
				<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
			</view>
			<view class="line"></view>
		</template>
		<template v-if="addType==2">
			6666
			<view class="line"></view>
		</template>
		<view v-if="showNextButton">
			<button type="primary"  class="button-next" @click="nextStep">下一步</button>
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="已存在考勤记录,是否继续" closeText='继续' confirmText="取消" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="alertDialogReg" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="请选择宿舍点名登记方式" closeText='按宿舍登记' confirmText='按班级登记' @confirm="classReg" @close="roomReg"></uni-popup-dialog>
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
				
				addType:0,//1:按宿舍登记  2:按班级登记
				
				time:'',//发生日期
				buildIndex:-1,
				floorIndex:-1,
				dormIndex:-1,
				qaIndex:-1,
				build_floor_list: [], //楼房和楼层总数组
				buildList: [], 
				floorList: [], 
				dormList: [], 
				qaArray:[],//午晚休数组
				attendanceList:[],//考勤项目数组
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD'),
				showNextButton:false,
				historyData:false,//是否存在历史考勤数据
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='宿舍点名登记'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			let that =this
			setTimeout(function() {
				that.$refs.alertDialogReg.open();
			}, 100);
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			classReg(){//班级登记
				this.addType=2
				this.showNextButton=true
			},
			roomReg(){//宿舍登记
				this.addType=1
				this.showLoading();
				this.getBuildingList();
				this.getDict();
				this.getDictFromAttendance();
			},
			getBuildingList(){//获取宿舍楼号和楼层数组
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dorm/queryDorm',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let list =response.list
					if(list.length>0){
						 this.build_floor_list=list
						 let buildingList=[]
						 list.map(function(item){
							 let obj={}
							 obj.text=item.text,
							 obj.value=item.value,
							 buildingList.push(obj)
						 })
						 this.buildList=buildingList;
					}else{
						 this.showToast('无法获取楼号数据');
					}
				})
			},
			getFloorList(building){//根据宿舍楼号获取楼层
				let list=this.build_floor_list
				let floorList=[]
				list.map(function(item){
				  if(building==item.value){
					  let array=item.floor_array
					  array.map(function(item){
						  if((item.text+'').indexOf('层')==-1){
							  item.text=item.text+'层'
						  }
					  })
					  floorList=array
				  }
				})
				this.floorList=floorList
				this.hideLoading()
			},
			getDormList(building,floor){//根据宿舍楼号、楼层获取宿舍
				let comData={
					dorm_name:building,
					floor_num:floor,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dorm/queryRoom',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.dormList=response.list
				})
			},
			getDict(){//获取考勤项目常量
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dormAttendance/getDict',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.attendanceList=response.item_array
					let rest_array=response.rest_array
					let rest=[]
					rest_array.map(function(item){
						 let obj={}
						 obj.text=item.label
						 obj.value=item.v
						 rest.push(obj)
					})
					this.qaArray=rest;
				})
			},
			getDictFromAttendance(){//从考勤接口获取 午晚休 考勤时间常量
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/getDict',comData,response=>{
					console.log("StudentAttendance/getDict: " + JSON.stringify(response));
					// this.attendanceDict=response.qaArray
					// this.jcList=response.timeArray
				})
			},
			buildSelect(e){
				if(this.buildList.length>0){
					if(this.buildIndex!==e.detail.value){
						 this.buildIndex=e.detail.value
						 this.floorIndex=-1
						 this.dormIndex=-1
						 this.dormList=[]
						this.getFloorList(this.buildList[e.detail.value].value)
						this.showNext();
					}
				}
			},
			floorSelect(e){
				if(this.floorList.length>0){
					if(this.floorIndex!==e.detail.value){
						 this.floorIndex=e.detail.value
						 this.dormIndex=-1
						 this.dormList=[]
						this.getDormList(this.buildList[this.buildIndex].value,this.floorList[e.detail.value].value)
						this.showNext();
					}
				}
			},
			dormSelect(e){
				if(this.dormList.length>0){
					if(this.dormIndex!==e.detail.value){
						 this.dormIndex=e.detail.value
						 this.showNext();
					}
				}
			},
			qaSelect(e){
				if(this.qaArray.length>0){
					if(this.qaIndex!==e.detail.value){
						this.qaIndex=e.detail.value
						this.showNext();
					}
				}
			},
			timePicker(){
				this.$refs.timePicker.show()
			},
			timeSelect(e){
				this.time=e
				this.showNext();
			},
			showNext(){
				let show =true
				if(this.buildIndex==-1){
					show=false
				}
				if(this.floorIndex==-1){
					show=false
				}
				if(this.dormIndex==-1){
					show=false
				}
				if(this.qaIndex==-1){
					show=false
				}
				this.showNextButton=show
			},
			/**
			    如果日期不是当前日期：查询是否存在考勤记录 (只要数据>0 证明存在考勤记录，需要做提示)
			  									—→获取床位对应的学生
			  									—→获取选择日期对应的学生请假数据
			  									—→跳转到第三步，直接填写考勤信息
				如果日期是当前日期：  查询是否存在考勤记录
												—→获取床位对应的学生
												—→获取选择日期对应的学生请假数据
												—→获取定位型设备列表
												—→获取定位型设备的识别数据
												—→跳转到第三步，填写考勤信息
			 */
			async nextStep(){
				// this.showLoading('正在加载数据...')
				let stuList=await this.getStuList()
			},
			
			//获取床位对应的学生
			getStuList(){
				return new Promise((res,rej)=>{
					let comData={
						mach_type:8,
						index_code: this.index_code,
					} 
					this.post(this.globaData.INTERFACE_WORK+'LocationAttendance/list',comData,response=>{
						// console.log("获取定位型设备列表: " + JSON.stringify(response));
						
						res(response.list)
					})
				})
			},
		},
	}
</script>

<style>
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
	
	.button-next{
		background-color: #00CFBD !important;
		width: 35%;
		font-size: 14px;
		margin-top: 40px;
		animation: 1s opacity2 0s;
		-webkit-animation: 1s opacity2 0s;
		-moz-animation: 1s opacity2 0s;
	}
	
	@keyframes opacity2{
		0%{opacity:0}
		50%{opacity:.8;}
		100%{opacity:1;}
	}
	@-webkit-keyframes opacity2{
		0%{opacity:0}
		50%{opacity:.8;}
		100%{opacity:1;}
	}
	@-moz-keyframes opacity2{
		0%{opacity:0}
		50%{opacity:.8;}
		100%{opacity:1;}
	}
</style>
