<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<uni-list>
			<uni-list-item :border="false" v-for="(item,index) in tiaozhanzhe" :key='index' direction='column'>
				<view slot="body">
					<view style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
						<view style="display: flex;flex-direction: row;">
							<view style="text-align: center;width: 30px;">{{index+1}}</view>
							<view style="text-align: center;width: 65px;">{{item.cls_name}}</view>
							<view style="text-align: center;width: 75px;">{{item.user_name}}</view>
						</view>
						<view v-if="item.status == 0" style="display: flex;flex-direction: row;">
							<button
								style="background: #43CF7C;border: #43CF7C;color: #FFFFFF; border-radius: 13px;margin-right: 5px;padding: 0 8px;"
								class="mini-btn" @click="pkOrNo(item,1)" size="mini">接受挑战</button>
							<button
								style="background: #FF8D1A;border: #FF8D1A;color: #FFFFFF; border-radius: 13px;padding: 0 8px;"
								class="mini-btn" @click="pkOrNo(item,2)" size="mini">免战</button>
						</view>
					</view>
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
				navItem: {},
				pkFlag: 0,
				tiaozhanzhe: [],
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.text = '挑战者';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			//#ifdef H5
			document.title = ""
			//#endif
			this.tiaozhanzhe = [].concat(this.navItem.list);
			uni.$on('clickLeft', (data) => {
				if (this.pkFlag > 0) {
					let eventChannel = this.getOpenerEventChannel();
					eventChannel.emit('getFullSubPK', {});
				}
			})
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		components: {
			mynavBar
		},
		methods: {
			pkOrNo(model, flag) {
				let comData = {
					id: model.id,
					index_code: this.navItem.access,
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
