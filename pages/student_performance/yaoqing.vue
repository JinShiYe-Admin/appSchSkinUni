<template>
	<view>
		<view style="margin-top: 10px;padding-bottom: 50px !important;">
			<view v-for="(item,index) in stuList" :key='index'>
				<view
					style="height: 22px;width: 4px;background: #55ffff;float: left;margin-right: 5px;margin-left: 10px;">
				</view>
				<view>{{item.cls_name}}</view>
				<view style="height: 3px;background: #B5E9E5;margin-top: 8px;margin-left: 10px;margin-right: 10px;">
				</view>
				<view style="padding: 10px;">
					<uni-grid :column="4" :showBorder="false" :square="false" :highlight="false">
						<uni-grid-item v-for="(stuItem,indexStu) in item.stu_list" :key="indexStu">
							<view class="grid-item-box" style="height: 40px;" @click="clickMe(item.cls_code,stuItem)">
								<text class="text">
									<p style="text-align: center;font-size: 13px;padding-top: 5px;padding-bottom: 5px;"
										:style="{
										'background':stuItem.isCheck?'#43CF7C':'',
										'border-radius':stuItem.isCheck?'15px':'0',
										'color':stuItem.isCheck?'#FFFFFF':''
										}">{{stuItem.stu_name}}</p>
								</text>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</view>
		</view>
		<view
			style="position: fixed;bottom: 0px;padding: 10px;text-align: center;width: 100%;background-color: #FFFFFF;border-top: 1px solid rgba(234, 234, 234, 0.5)">
			<button type="button"
				style="background: #43CF7C;border: #43CF7C;color: #FFFFFF; border-radius: 13px;margin-right: 10px;width: 80px;"
				class="mui-btn" @click="pk()" size="mini">邀请</button>
			<button type="button"
				style="background: #999999;border: #999999;color: #FFFFFF; border-radius: 13px;;margin-left: 10px;width: 80px;"
				class="mui-btn" @click="cancel()" size="mini">取消</button>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				checkModel: 1, //选择模式 1单选 2多选
				stuList: []
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.text = 'PK邀请';
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			// 1.12.全科获取pk学生列表
			this.getFullSubPK();
		},
		methods: {
			pk: function() {
				let student = []
				this.stuList.map(clsItem => {
					let cls = {}
					let checkedStu = []
					clsItem.stu_list.map(stuItem => {
						if (stuItem.isCheck) {
							checkedStu.push(stuItem)
						}
					})
					cls.cls_code = clsItem.cls_code
					cls.cls_name = clsItem.cls_name
					cls.stu = [].concat(checkedStu)
					if (checkedStu.length > 0) {
						student.push(cls)
					}
				})
				console.log("student: " + JSON.stringify(student));
				if (student.length > 0) {
					// 1.13.添加PK记录
					this.getAddPK(student);
				} else {
					this.showToast("你没有选择任何学生")
				}
			},
			cancel: function() {
				uni.navigateBack();
			},
			clickMe: function(cls_code, item) {
				console.log('cls_code:' + cls_code);
				console.log("item: " + JSON.stringify(item));
				let isCheck = item.isCheck
				this.stuList.map(clsItem => {
					clsItem.stu_list.map(stuItem => {
						if (this.checkModel == 1) {
							stuItem.isCheck = false
						}
						if (clsItem.cls_code == cls_code && stuItem.stu_code == item.stu_code) {
							if (isCheck) {
								stuItem.isCheck = false
							} else {
								stuItem.isCheck = true
							}
						}
					})
				})
			},
			getFullSubPK() {
				let comData = {
					id: this.itemData.id,
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'fullSub/pkStuList', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var a = 0; a < data.data.list.length; a++) {
							var tempM0 = data.data.list[a];
							var tempArr = [];
							for (var b = 0; b < tempM0.stu_list.length; b++) {
								var tempM1 = tempM0.stu_list[b];
								if (tempM1.stu_code != this.personInfo.user_code) {
									tempM1.isCheck = false;
									tempArr.push(tempM1);
								}
							}
							tempM0.stu_list = [].concat(tempArr);
						}
						this.stuList = [].concat(data.data.list);
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 1.13.添加PK记录
			getAddPK(sutArray) {
				let comData = {
					index_code: this.itemData.access,
					paper_id: this.itemData.id, //试卷id
					cls_code: sutArray[0].cls_code, //当前用户班级
					cls_name: sutArray[0].cls_name, //当前用户班级
					user_code: this.personInfo.user_code, //当前用户代码
					user_name: this.personInfo.user_name, //当前用户名称
					pk_user_code: sutArray[0].stu[0].stu_code, //对手用户代码
					pk_user_name: sutArray[0].stu[0].stu_name, //对手用户名称
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'fullSub/addPk', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showToast(data.msg);
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('getFullSubPK');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>

</style>
