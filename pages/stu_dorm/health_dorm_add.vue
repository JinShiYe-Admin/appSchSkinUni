<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
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
			<input class="uni-input form-right"  v-model="dormNameList.join(',')" placeholder="请选择" disabled @click="selectDorm"/>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">卫生</view>
			<picker style="width:100% !important;" mode="selector" @change="healthSelect" :value="healthIndex" :range="healthList" range-key="text">
				<input class="uni-input form-right"  :value="healthIndex>=0?healthList[healthIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">日期</view>
			<dy-Date class="uni-input form-right" style="display: flex;align-items: center;padding-right: 0;" :childValue='formData.time'  timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left form-left-textarea">说明</view>
			<textarea placeholder="请输入" v-model="formData.comment" maxlength="100" ></textarea>
		</view>
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
				
				canSub:true,
				formData: {
					time:'',//发生日期
					comment:'',//说明
				}, //表单内容
				buildIndex:-1,
				floorIndex:-1,
				healthIndex:-1,
				
				build_floor_list: [], //楼房和楼层总数组
				buildList: [], 
				floorList: [], 
				dormList:[],
				dormNameList: [],
				dormIdList: [], 
				healthList: [], 
				
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD'),
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='新建宿舍卫生'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				this.showLoading();
				this.getBuildingList();
				this.getDict();
			},100)
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
			getDict(){//获取考勤常量
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dormHealth/getDict',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.healthList=response.item_array
				})
			},
			textClick(){//发送请假信息
				if(this.buildIndex==-1){
					this.showToast('请选择楼房')
				}else if(this.floorIndex==-1){
					this.showToast('请选择楼层')
				}else if(this.dormIdList.length===0){
					this.showToast('请选择房间')
				}else if(this.healthIndex==-1){
					this.showToast('请选择卫生细项')
				}else if(this.formData.time==''){
					this.showToast('请选择日期')
				}else{
					if(this.canSub){
						this.canSub=false
						this.submitData();
					}
				}
			},
			submitData(){
				this.showLoading()
				let comData={
					health_date:this.formData.time,
					dorm_name:this.buildList[this.buildIndex].value,
					floor_num:''+this.floorList[this.floorIndex].value,
					item_name:this.healthList[this.healthIndex].value,
					remark:this.formData.comment,
					room_names:this.dormIdList.join(","),
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dormHealth/add',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
				     if (response.code == 0) {
						 this.hideLoading()
						 this.showToast(response.msg);
				     	 const eventChannel = this.getOpenerEventChannel()
				     	 eventChannel.emit('refreshByAdd', {data: 1});
				     	 uni.navigateBack();
				     } else {
				     	this.canSub=true
				     	this.hideLoading()
				     	this.showToast(response.msg);
				     }
				},()=>{
						this.canSub=true
				})
			},
			buildSelect(e){
				if(this.buildList.length>0){
					if(this.buildIndex!==e.detail.value){
						 this.buildIndex=e.detail.value
						 this.floorIndex=-1
						 this.dormList=[]
						 this.dormNameList=[]
						 this.dormIdList= [] 
						 this.getFloorList(this.buildList[e.detail.value].value)
					}
				}
			},
			floorSelect(e){
				if(this.floorList.length>0){
					if(this.floorIndex!==e.detail.value){
						 this.floorIndex=e.detail.value
						this.dormList=[]
						this.dormNameList=[]
						this.dormIdList= [] 
						this.getDormList(this.buildList[this.buildIndex].value,this.floorList[e.detail.value].value)
					}
				}
			},
			selectDorm(e){
				if(this.dormList.length==0){
					this.showToast('当前楼层暂无房间')
				}else{
					this.dormList.map(item=>{
						item.checked=false
						this.dormIdList.map(items=>{
							if(items==item.value){
								item.checked=true
							}
						})
					})
					let that =this 
					util.openwithData('/pages/stu_dorm/bedSelect',{bedList:this.dormList},{
						refreshSetPeople(data){//子页面调用父页面需要的方法
						console.log("data: " + JSON.stringify(data));
							 let dormNameList= []
							 let dormIdList= []
							 data.data.map(item=>{
								 if(item.checked){
									 dormNameList.push(item.text)
									 dormIdList.push(item.value)
								 }
							 })
							 that.dormNameList=dormNameList
							 that.dormIdList=dormIdList
						}
					})
				}
			},
			healthSelect(e){
				if(this.healthList.length>0){
					if(this.healthIndex!==e.detail.value){
						this.healthIndex=e.detail.value
					}
				}
			},
			timePicker(){
				this.$refs.timePicker.show()
			},
			timeSelect(e){
				this.formData.time=e
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
</style>
