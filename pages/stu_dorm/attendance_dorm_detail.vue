<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick" :text='text' @textClickRight="textClickRight"></mynavBar>
		<view v-if="editStatus===0">
			<view class="uni-flex uni-row form-view">
				<view class="form-left">年级</view>
				<view class="form-right">{{navItem.grd_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">班级</view>
				<view class="form-right">{{navItem.cls_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">学生</view>
				<view class="form-right">{{navItem.stu_name}}{{navItem.sno&&navItem.sno.length>0?'('+navItem.sno+')':''}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">楼房</view>
				<view class="form-right">{{navItem.dorm_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">楼层</view>
				<view class="form-right">{{navItem.floor_num}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">房间号</view>
				<view class="form-right">{{navItem.room_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">床位号</view>
				<view class="form-right">{{navItem.bed_num}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">宿舍考勤</view>
				<view class="form-right">{{navItem.item_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">午/晚休</view>
				<view class="form-right">{{navItem.rest_code_text}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">说明</view>
				<view class="form-right">{{navItem.remark?navItem.remark:'暂无'}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">记录人</view>
				<view class="form-right">{{navItem.create_user_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">时间</view>
				<view class="form-right">{{navItem.attendance_date}}</view>
			</view>
		</view>
		<view v-else-if="editStatus===1">
			<view class="tabs-fixed">
				<uni-segmented-control :current="current" :values="items" style-type="button" active-color="#00cfbd" @clickItem="onClickItem" />
			</view>
			<view class="content">
				<view v-if="current === 0">
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">楼房</view>
						<picker style="width:100% !important;" mode="selector" @change="buildSelect" :value="formByDorm.buildIndex" :range="formByDorm.buildList" range-key="text">
							<!-- <input class="uni-input form-right"  :value="formByDorm.buildIndex>=0?formByDorm.buildList[formByDorm.buildIndex].text:''"  placeholder="请选择" disabled/> -->
							<view class="uni-input form-right">{{formByDorm.buildIndex>=0?formByDorm.buildList[formByDorm.buildIndex].text:'请选择'}}</view>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">楼层</view>
						<picker style="width:100% !important;" mode="selector" @change="floorSelect" :value="formByDorm.floorIndex" :range="formByDorm.floorList" range-key="text">
							<!-- <input class="uni-input form-right"  :value="formByDorm.floorIndex>=0?formByDorm.floorList[formByDorm.floorIndex].text:''" placeholder="请选择" disabled/> -->
							<view class="uni-input form-right">{{formByDorm.floorIndex>=0?formByDorm.floorList[formByDorm.floorIndex].text:'请选择'}}</view>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">房间</view>
						<picker style="width:100% !important;" mode="selector" @change="dormSelect" :value="formByDorm.dormIndex" :range="formByDorm.dormList" range-key="text">
							<!-- <input class="uni-input form-right"  :value="formByDorm.dormIndex>=0?formByDorm.dormList[formByDorm.dormIndex].text:''"  placeholder="请选择" disabled/> -->
							<view class="uni-input form-right">{{formByDorm.dormIndex>=0?formByDorm.dormList[formByDorm.dormIndex].text:'请选择'}}</view>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">床位号</view>
						<picker style="width:100% !important;" mode="selector" @change="bedSelect" :value="formByDorm.bedIndex" :range="formByDorm.bedList" range-key="text">
							<!-- <input class="uni-input form-right"  :value="formByDorm.bedIndex>=0?formByDorm.bedList[formByDorm.bedIndex].text:''"  placeholder="请选择" disabled/> -->
							<view class="uni-input form-right">{{formByDorm.bedIndex>=0?formByDorm.bedList[formByDorm.bedIndex].text:'请选择'}}</view>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">宿舍考勤</view>
						<picker style="width:100% !important;" mode="selector" @change="attendanceSelect($event,current)" :value="formByDorm.attendanceIndex" :range="attendanceList" range-key="text">
							<!-- <input class="uni-input form-right"  :value="formByDorm.attendanceIndex>=0?attendanceList[formByDorm.attendanceIndex].text:''" placeholder="请选择" disabled/> -->
							<view class="uni-input form-right">{{formByDorm.attendanceIndex>=0?attendanceList[formByDorm.attendanceIndex].text:'请选择'}}</view>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">日期</view>
						<dy-Date class="uni-input form-right" style="display: flex;align-items: center;padding-right: 0;" :childValue='formByDorm.time'  timeType="day" v-on:getData='timeSelect($event,current)' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">午/晚休</view>
						<picker style="width:100% !important;" mode="selector" @change="qaSelect($event,current)" :value="formByDorm.qaIndex" :range="qaList" range-key="text">
							<!-- <input class="uni-input form-right"  :value="formByDorm.qaIndex>=0?qaList[formByDorm.qaIndex].text:''" placeholder="请选择" disabled/> -->
							<view class="uni-input form-right">{{formByDorm.qaIndex>=0?qaList[formByDorm.qaIndex].text:'请选择'}}</view>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left form-left-textarea">说明</view>
						<textarea placeholder="请输入" v-model="formByDorm.comment" maxlength="100" ></textarea>
					</view>
				</view>
				<view v-if="current === 1">
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">年级</view>
						<picker style="width:100% !important;" mode="selector" @change="grdSelect" :value="formByClass.grdIndex" :range="formByClass.grdList" range-key="text">
							<!-- <input class="uni-input form-right"  :value="formByClass.grdIndex>=0?formByClass.grdList[formByClass.grdIndex].text:''"  placeholder="请选择" disabled/> -->
							<view class="uni-input form-right">{{formByClass.grdIndex>=0?formByClass.grdList[formByClass.grdIndex].text:'请选择'}}</view>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">班级</view>
						<picker style="width:100% !important;" mode="selector" @change="clsSelect" :value="formByClass.clsIndex" :range="formByClass.clsList" range-key="text">
							<!-- <input class="uni-input form-right"  :value="formByClass.clsIndex>=0?formByClass.clsList[formByClass.clsIndex].text:''" placeholder="请选择" disabled/> -->
							<view class="uni-input form-right">{{formByClass.clsIndex>=0?formByClass.clsList[formByClass.clsIndex].text:'请选择'}}</view>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">姓名</view>
						<picker style="width:100% !important;" mode="selector" @change="stuSelect" :value="formByClass.stuIndex" :range="formByClass.stuList" range-key="showText">
							<!-- <input class="uni-input form-right"  :value="formByClass.stuIndex>=0?formByClass.stuList[formByClass.stuIndex].text:''" placeholder="请选择" disabled/> -->
							<view class="uni-input form-right">{{formByClass.stuIndex>=0?formByClass.stuList[formByClass.stuIndex].showText:'请选择'}}</view>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">宿舍考勤</view>
						<picker style="width:100% !important;" mode="selector" @change="attendanceSelect($event,current)" :value="formByClass.attendanceIndex" :range="attendanceList" range-key="text">
							<!-- <input class="uni-input form-right"  :value="formByClass.attendanceIndex>=0?attendanceList[formByClass.attendanceIndex].text:''" placeholder="请选择" disabled/> -->
							<view class="uni-input form-right">{{formByClass.attendanceIndex>=0?attendanceList[formByClass.attendanceIndex].text:'请选择'}}</view>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">日期</view>
						<dy-Date class="uni-input form-right" style="display: flex;align-items: center;padding-right: 0;" :childValue='formByClass.time'  timeType="day" v-on:getData='timeSelect($event,current)' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left">午/晚休</view>
						<picker style="width:100% !important;" mode="selector" @change="qaSelect($event,current)" :value="formByClass.qaIndex" :range="qaList" range-key="text">
							<!-- <input class="uni-input form-right"  :value="formByClass.qaIndex>=0?qaList[formByClass.qaIndex].text:''" placeholder="请选择" disabled/> -->
							<view class="uni-input form-right">{{formByClass.qaIndex>=0?qaList[formByClass.qaIndex].text:'请选择'}}</view>
						</picker>
						<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
					</view>
					<view class="line"></view>
					<view class="uni-flex uni-row form-view-edit">
						<view class="form-left form-left-textarea">说明</view>
						<textarea placeholder="请输入" v-model="formByClass.comment" maxlength="100" ></textarea>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 30px;">
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="确定要删除该条记录吗？" @confirm="dialogConfirm"></uni-popup-dialog>
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
				items: ['按宿舍登记', '按班级登记'],
				current: 0,
				
				index_code:'',
				personInfo: {},
				navItem: {},
				
				icon:'',
				text:'',
				// textClick:_this.textClickEvent,
				editStatus:0,//0 展示  1编辑
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD'),
				attendanceList: [], //考勤项目数组
				qaList:[],//午晚休数组
				formByDorm:{
					buildIndex:-1,
					floorIndex:-1,
					dormIndex:-1,
					bedIndex:-1,
					attendanceIndex:-1,
					qaIndex:-1,
					build_floor_list: [], //楼房和楼层总数组
					buildList: [], //楼房数组
					floorList: [], //楼层数组
					dormList: [], //房间数组
					bedList:[],//床位数组
					time:'',//表单内容
					comment:'',//表单内容
				},
				formByClass:{
					grdIndex:-1,
					clsIndex:-1,
					stuIndex:-1,
					attendanceIndex:-1,
					qaIndex:-1,
					grdList: [], //年级数组
					clsList: [], //班级数组
					stuList:[],
					time:'',//表单内容
					comment:'',//表单内容
				},
				canSub:true,
				datas:true,//是否需要获取年级班级学生宿舍楼层房间床位等信息我就不打标点
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='宿舍考勤详情'
			this.navItem = itemData;
			this.index_code=itemData.index_code
			
			if(itemData.delete==1){
				this.icon='trash'
			}
			
			if(itemData.edit==1){
				this.text=['编辑']
			}
			//console.log("itemData: " + JSON.stringify(itemData));
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			 
			//#ifdef H5
				document.title=""
			//#endif
		},
		methods: {
			async onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
				if(this.current===1){
					  if(this.formByClass.grdList.length===0){
					  	await this.getGrd();
						await this.setDefaultData()
					  }
				}
			},
			async textClickRight(data) {
				//console.log('textClickRight')
				if (_this.text.length==1) {
					_this.editStatus=1
					_this.icon=''
					_this.text=['取消','保存'];
					// _this.textClick=[_this.cancel,_this.save]
					if(_this.formByDorm.build_floor_list.length===0){
						await _this.getBuildingList();
					}
					if(_this.qaList.length===0 || _this.attendanceList.length===0){
						await _this.getDict();
					}
					await _this.setDefaultData()
				} else{
					if (data == 0) {
						await _this.cancel();
					} else if (data == 1) {
						await _this.save();
					}
				}
			},
			// async textClickEvent(){
			// 	_this.editStatus=1
			// 	_this.icon=''
			// 	_this.text=['取消','保存'],
			// 	_this.textClick=[_this.cancel,_this.save]
			// 	if(_this.formByDorm.build_floor_list.length===0){
			// 		await _this.getBuildingList();
			// 	}
			// 	if(_this.qaList.length===0 || _this.attendanceList.length===0){
			// 		await _this.getDict();
			// 	}
			// 	await _this.setDefaultData()
			// },
			setDefaultData(){
				return new Promise(async (resolve,reject)=>{
					if(this.current===0){
						await this.getFloorList(this.navItem.dorm_name);
						await this.getDormList(this.navItem.dorm_name,this.navItem.floor_num);
						this.formByDorm.buildList.map((bItem,index)=>{
							if(this.navItem.dorm_name==bItem.value){
								this.formByDorm.buildIndex=index
							}
						})
						this.formByDorm.floorList.map((fItem,index)=>{
							if(this.navItem.floor_num==fItem.value){
								this.formByDorm.floorIndex=index
							}
						})
						this.formByDorm.dormList.map((dItem,index)=>{
							if(this.navItem.room_name==dItem.value){
								this.formByDorm.dormIndex=index
							}
						})
						if(this.formByDorm.dormList.length>0){
							await this.getBedList();
						}
						this.formByDorm.bedList.map((bItem,index)=>{
							if(this.navItem.bed_num==bItem.value){
								this.formByDorm.bedIndex=index
							}
						})
						this.attendanceList.map((aItem,index)=>{
							if(this.navItem.item_name==aItem.value){
								this.formByDorm.attendanceIndex=index
							}
						}) 
						this.qaList.map((qItem,index)=>{
							if(this.navItem.rest_code==qItem.value){
								this.formByDorm.qaIndex=index
							}
						}) 
						this.formByDorm.time=this.navItem.attendance_date
						this.formByDorm.comment=this.navItem.remark
						resolve()
					}else if(this.current===1){
						await this.getCls(this.navItem.grd_code);
						await this.getStu(this.navItem.grd_code,this.navItem.cls_code);
						this.formByClass.grdList.map((item,index)=>{
							if(this.navItem.grd_code==item.value){
								this.formByClass.grdIndex=index
							}
						})
						this.formByClass.clsList.map((item,index)=>{
							if(this.navItem.cls_code==item.value){
								this.formByClass.clsIndex=index
							}
						})
						this.formByClass.stuList.map((item,index)=>{
							if(this.navItem.stu_code==item.value){
								this.formByClass.stuIndex=index
							}
						})
						this.attendanceList.map((aItem,index)=>{
							if(this.navItem.item_name==aItem.value){
								this.formByClass.attendanceIndex=index
							}
						}) 
						this.qaList.map((qItem,index)=>{
							if(this.navItem.rest_code==qItem.value){
								this.formByClass.qaIndex=index
							}
						}) 
						this.formByClass.time=this.navItem.attendance_date
						this.formByClass.comment=this.navItem.remark
						resolve()
					}
					
				})
			},
			save(){
				if(this.canSub){
					this.canSub=false
					this.showLoading()
					let comData={}
					if(this.current==0){
						if(this.formByDorm.buildIndex==-1){
							this.showToast('请选择楼房')
						}else if(this.formByDorm.floorIndex==-1){
							this.showToast('请选择楼层')
						}else if(this.formByDorm.dormIndex==-1){
							this.showToast('请选择房间')
						}else if(this.formByDorm.bedIndex==-1){
							this.showToast('请选择床位')
						}else if(this.formByDorm.attendanceIndex==-1){
							this.showToast('请选择考勤项目')
						}else if(this.formByDorm.time==''){
							this.showToast('请选择考勤日期')
						}else if(this.formByDorm.qaIndex==-1){
							this.showToast('请选择午/晚休')
						}else{
							comData={
								stu_codes:this.navItem.stu_code,
								cls_code:this.navItem.cls_code,
								grd_code:this.navItem.grd_code,
								attendance_date:this.formByDorm.time,
								dorm_name:this.formByDorm.buildList[this.formByDorm.buildIndex].value,
								floor_num:this.formByDorm.floorList[this.formByDorm.floorIndex].value,
								room_name:this.formByDorm.dormList[this.formByDorm.dormIndex].value,
								bed_nums:this.formByDorm.bedList[this.formByDorm.bedIndex].value,
								item_name:this.attendanceList[this.formByDorm.attendanceIndex].value,
								register_type:'room',
								remark:this.formByDorm.comment,
								rest_code:this.qaList[this.formByDorm.qaIndex].value,
								id:this.navItem.id,
								index_code:this.index_code
							}
							this.postData(comData)
						}
					}else if(this.current==1){
						if(this.formByClass.grdIndex==-1){
							this.showToast('请选择年级')
						}else if(this.formByClass.clsIndex==-1){
							this.showToast('请选择班级')
						}else if(this.formByClass.stuIndex==-1){
							this.showToast('请选择学生')
						}else if(this.formByClass.attendanceIndex==-1){
							this.showToast('请选择考勤项目')
						}else if(this.formByClass.time==''){
							this.showToast('请选择考勤日期')
						}else if(this.formByClass.qaIndex==-1){
							this.showToast('请选择午/晚休')
						}else{
							comData={
								dorm_name:this.navItem.dorm_name,
								floor_num:this.navItem.floor_num,
								room_name:this.navItem.room_name,
								bed_nums:this.navItem.bed_num,
								grd_code:this.formByClass.grdList[this.formByClass.grdIndex].value,
								cls_code:this.formByClass.clsList[this.formByClass.clsIndex].value,
								stu_codes:this.formByClass.stuList[this.formByClass.stuIndex].value,
								attendance_date:this.formByClass.time,
								item_name:this.attendanceList[this.formByClass.attendanceIndex].value,
								register_type:'room',
								remark:this.formByClass.comment,
								rest_code:this.qaList[this.formByClass.qaIndex].value,
								id:this.navItem.id,
								index_code:this.index_code
							}
							this.postData(comData)
						}
					}
				}
			},
			postData(comData){
				this.post(this.globaData.INTERFACE_DORM.substring(0,this.globaData.INTERFACE_DORM.length-4)+'dormAttendance/edit',comData,(response0,response)=>{
					if (response.code == 0) {
						 this.showToast(response.msg);
						 const eventChannel = this.getOpenerEventChannel()
						 eventChannel.emit('refreshList', {data: 1});
						 uni.navigateBack();
					} else {
						this.canSub=true
						this.showToast(response.msg);
					}
				},()=>{
					this.canSub=true
				})
			},
			cancel(){
				this.text=['编辑']
				this.icon='trash'
				// this.textClick=this.textClickEvent
				this.editStatus=0
				this.current=0
				this.reserFormData();
			},
			reserFormData(){
				this.formByDorm={
					buildIndex:-1,
					floorIndex:-1,
					dormIndex:-1,
					bedIndex:-1,
					attendanceIndex:-1,
					qaIndex:-1,
					build_floor_list: [], //楼房和楼层总数组
					buildList: [], //楼房数组
					floorList: [], //楼层数组
					dormList: [], //房间数组
					bedList:[],//床位数组
					time:'',//表单内容
					comment:'',//表单内容
				}
				this.formByClass={
					grdIndex:-1,
					clsIndex:-1,
					stuIndex:-1,
					attendanceIndex:-1,
					qaIndex:-1,
					grdList: [], //年级数组
					clsList: [], //班级数组
					stuList:[],
					time:'',//表单内容
					comment:'',//表单内容
				}
			},
			iconClick(){
				_this.$refs.alertDialog.open()
			},
			dialogConfirm(){
				this.showLoading()
				let url=this.globaData.INTERFACE_DORM + 'dormAttendance/delete'
				let comData={
					id: this.navItem.id,
					index_code:this.index_code,
				}
				this.post(url,comData,response=>{
				    //console.log("responseaaa: " + JSON.stringify(response));
					this.showToast('操作成功')
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('refreshList', {data: 1});
					uni.navigateBack();
					this.hideLoading()
				})
			},
			getGrd(){
				return new Promise((resolve, reject)=>{
					let comData={
						op_code:'add',
						get_grd:true,
						index_code:this.index_code,
					}
					this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
					    // //console.log("responseaaa: " + JSON.stringify(response));
						let grds = response.grd_list;
						let grdList=[];
						grds.map(function(currentValue) {
							let obj = {};
							obj.value = currentValue.value;
							obj.text = currentValue.name;
							grdList.push(obj)
						})
						if(grdList.length>0 ){
							this.formByClass.grdList=grdList;
							resolve()
						}else{
							this.showToast('获取年级为空');
						}
					})
				})
			},
			getCls(grd_id){
				return new Promise((resolve, reject)=>{
					let comData={
						op_code:'add',
						grd_code:grd_id,
						get_cls:true,
						index_code:this.index_code,
					}
					// //console.log("comDataaaaaaaaaaa: " + JSON.stringify(comData));
					this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
						// //console.log("responseaaa: " + JSON.stringify(response));
						let clss = response.cls_list;
						let clssList=[];
						clss.map(function(currentValue) {
							let obj = {};
							obj.value = currentValue.value;
							obj.text = currentValue.name;
							clssList.push(obj)
						})
						if(clssList.length>0 ){
							this.formByClass.clsList=clssList;
							resolve()
						}else{
							this.showToast('获取班级为空');
						}
					})
				});
			},
			getStu(grd_id,cls_id){
				return new Promise((resolve, reject)=>{
					let comData={
						op_code:'add',
						grd_code: grd_id,
						cls_code: cls_id,
						get_stu:true,
						index_code:this.index_code,
					}
					this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
						// //console.log("responseaaa: " + JSON.stringify(response));
						let stu = response.stu_list;
						let stuList=[];
						stu.map(function(currentValue) {
							let obj = {};
							obj.value = currentValue.value;
							obj.text = currentValue.name;
							obj.showText = currentValue.sno!=null&&currentValue.sno.length>0?currentValue.name+'（'+currentValue.sno+'）':currentValue.name;
							stuList.push(obj)
						})
						if(stuList.length>0 ){
							this.formByClass.stuList=stuList;
							resolve()
						}else{
							this.showToast('获取学生为空');
						}
					})
				})
			},
			getBuildingList(){//获取宿舍楼号和楼层数组
				return new Promise((resolve, reject)=>{
					let comData={
						index_code:this.index_code,
					}
					this.post(this.globaData.INTERFACE_DORM+'dorm/queryDorm',comData,response=>{
						// //console.log("responseaaa: " + JSON.stringify(response));
						let list =response.list
						if(list.length>0){
							 this.formByDorm.build_floor_list=list
							 let buildingList=[]
							 list.map(function(item){
								 let obj={}
								 obj.text=item.text,
								 obj.value=item.value,
								 buildingList.push(obj)
							 })
							 this.formByDorm.buildList=buildingList;
							 resolve()
						}else{
							 this.showToast('无法获取楼号数据');
						}
					})
				})
			},
			getFloorList(building){//根据宿舍楼号获取楼层
				return new Promise((resolve, reject)=>{
					let list=this.formByDorm.build_floor_list
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
					this.formByDorm.floorList=floorList
					resolve()
				})
			},
			getDormList(building,floor){//根据宿舍楼号、楼层获取宿舍
				return new Promise((resolve, reject)=>{
					let comData={
						dorm_name:building,
						floor_num:floor,
						index_code:this.index_code,
					}
					this.post(this.globaData.INTERFACE_DORM+'dorm/queryRoom',comData,response=>{
						// //console.log("responseaaa: " + JSON.stringify(response));
						this.formByDorm.dormList=response.list
						resolve()
					})
				})
			},
			getBedList(building,floor){//获取床位
				return new Promise((resolve, reject)=>{
					this.formByDorm.bedList=this.formByDorm.dormList[this.formByDorm.dormIndex].bed_array
					resolve()
				})
			},
			getDict(){//获取考勤项目常量
				return new Promise((resolve, reject)=>{
					let comData={
						index_code:this.index_code,
					}
					this.post(this.globaData.INTERFACE_DORM+'dormAttendance/getDict',comData,response=>{
						// //console.log("responseaaa: " + JSON.stringify(response));
						this.hideLoading()
						this.attendanceList=response.item_array
						// this.attendanceList=[{text:'晚休缺勤',value:'晚休缺勤'}]
						if(response.item_array.length==0){
							this.showToast('考勤项目不存在，无法编辑')
							this.cancel()
						}
						let rest_array=response.rest_array
						let rest=[]
						rest_array.map(function(item){
							 let obj={}
							 obj.text=item.label
							 obj.value=item.v
							 rest.push(obj)
						})
						this.qaList=rest;
						resolve()
					})
				})
			},
			buildSelect(e){
				if(this.formByDorm.buildList.length>0){
					if(this.formByDorm.buildIndex!==e.detail.value){
						 this.formByDorm.buildIndex=e.detail.value
						 this.formByDorm.floorIndex=-1
						 this.formByDorm.dormIndex=-1
						 this.formByDorm.bedIndex=-1
						 this.formByDorm.floorList=[]
						 this.formByDorm.dormList=[]
						 this.formByDorm.bedList=[]
						 this.getFloorList(this.formByDorm.buildList[e.detail.value].value)
					}
				}
			},
			floorSelect(e){
				if(this.formByDorm.floorList.length>0){
					if(this.formByDorm.floorIndex!==e.detail.value){
						this.formByDorm.floorIndex=e.detail.value
						this.formByDorm.dormIndex=-1
						this.formByDorm.bedIndex=-1
						this.formByDorm.dormList=[]
						this.formByDorm.bedList=[]
						this.getDormList(this.formByDorm.buildList[this.formByDorm.buildIndex].value,this.formByDorm.floorList[e.detail.value].value)
					}
				}
			},
			dormSelect(e){
				if(this.formByDorm.dormList.length>0){
					if(this.formByDorm.dormIndex!==e.detail.value){
						this.formByDorm.dormIndex=e.detail.value
						this.formByDorm.bedIndex=-1
						this.formByDorm.bedList=this.formByDorm.dormList[e.detail.value].bed_array
					}
				}
			},
			bedSelect(e){
				if(this.formByDorm.bedList.length>0){
					if(this.formByDorm.bedIndex!==e.detail.value){
						this.formByDorm.bedIndex=e.detail.value
					}
				}
			},
			grdSelect(e){
				if(this.formByClass.grdList.length>0){
					if(this.formByClass.grdIndex!==e.detail.value){
						 this.formByClass.grdIndex=e.detail.value
						 this.formByClass.clsIndex=-1
						 this.formByClass.stuIndex=-1
						 this.formByClass.clsList=[]
						 this.formByClass.stuList=[]
						 this.getCls(this.formByClass.grdList[e.detail.value].value)
					}
				}
			},
			clsSelect(e){
				if(this.formByClass.clsList.length>0){
					if(this.formByClass.clsIndex!==e.detail.value){
						 this.formByClass.clsIndex=e.detail.value
						 this.formByClass.stuIndex=-1
						 this.formByClass.stuList=[]
						 this.getStu(this.formByClass.grdList[this.formByClass.grdIndex].value,this.formByClass.clsList[e.detail.value].value)
					}
				}
			},
			stuSelect(e){
				if(this.formByClass.stuList.length>0){
					if(this.formByClass.stuIndex!==e.detail.value){
						 this.formByClass.stuIndex=e.detail.value
					}
				}
			},
			attendanceSelect(e,type){
				if(this.attendanceList.length>0){
					if(this.attendanceIndex!==e.detail.value){
						if(type==0){
							this.formByDorm.attendanceIndex=e.detail.value
						}else if(type==1){
							this.formByClass.attendanceIndex=e.detail.value
						}
					}
				}
			},
			qaSelect(e,type){
				if(this.qaList.length>0){
					if(this.qaIndex!==e.detail.value){
						if(type==0){
							this.formByDorm.qaIndex=e.detail.value
						}else if(type==1){
							this.formByClass.qaIndex=e.detail.value
						}
					}
				}
			},
			timeSelect(e,type){
				if(type==0){
					this.formByDorm.time=e
				}else if(type==1){
					this.formByClass.time=e
				}
			},
		}
	}
</script>

<style>
	.line{
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.double-line{
		height: 5px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.form-view{
		padding: 8px 15px;
	}
	.form-view-edit{
		padding: 0px 15px;
	}
	.form-left{
		font-size: 14px;
		width: 200rpx;
	}
	.form-right{
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
		text-align: left;
	}
	
	.title-text{
		font-size: 14px;
	}
	
	textarea{
		-webkit-flex: 1;
		flex: 1;
		font-size: 13px;
		border: 1px solid rgba(0,207,189,0.3);
		min-height: 80px;
		padding: 5px;
	}
	
	.content{
		/* #ifdef H5 */
		margin: 44px 0 2px;
		/* #endif */
		/* #ifndef H5 */
		margin: 50px 0 2px;
		/* #endif */
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
	.tabs-fixed {
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		/* #ifndef H5 */
		top: 70px;
		/* #endif */
	}
</style>
