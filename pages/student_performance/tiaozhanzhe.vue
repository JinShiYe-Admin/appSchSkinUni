<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo'></mynavBar>
		<uni-list>
			<uni-list-item :border="false" v-for="(item,index) in tiaozhanzhe" :key='index' direction='column'>
				<view slot="body">
					<uni-row style="">
						<uni-col style="" :span="2">
							<view style="padding-top:7px;text-align: center;">{{++index}}</view>
						</uni-col>
						<uni-col style="" :span="6">
							<view style="padding-top:7px;text-align: center;">{{item.cls_name}}</view>
						</uni-col>
						<uni-col style="" :span="6">
							<view style="padding-top:7px;text-align: center;">{{item.user_name}}</view>
						</uni-col>
						<uni-col v-if="item.status == 0" style="" :span="6">
							<button style="background: #43CF7C;border: #43CF7C;color: #FFFFFF; border-radius: 13px;" class="mini-btn" @click="pkOrNo(item,1)" size="mini">接受挑战</button>
						</uni-col>
						<uni-col v-if="item.status == 0" style="" :span="4">
							<button style="background: #FF8D1A;border: #FF8D1A;color: #FFFFFF; border-radius: 13px;" class="mini-btn" @click="pkOrNo(item,2)" size="mini">免战</button>
						</uni-col>
					</uni-row>
				</view>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				pkFlag:0,
				tiaozhanzhe: [],
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.text = '挑战者';
			this.itemData.index = 100;
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			this.tiaozhanzhe = [].concat(this.itemData.list);
			uni.$on('clickLeft',(data) =>{
				if(this.pkFlag>0){
					let eventChannel = this.getOpenerEventChannel();
					eventChannel.emit('getFullSubPK', {});
				}
			})
		},
		components: {
			mynavBar
		},
		methods: {
			pkOrNo(model, flag) {
				let comData = {
					id: model.id,
					index_code: this.itemData.access,
					status: flag, //1接受，2免战
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'fullSub/updatePkStatus', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pkFlag++;
						model.status = flag;
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	::v-deep uni-button {
    padding: 0px 15px;
}
</style>
