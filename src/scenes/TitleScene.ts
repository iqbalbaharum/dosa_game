import Phaser from 'phaser'

import { SceneKeys } from '../consts/SceneKeys'

import Web3Modal from 'web3modal'
import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider';

export default class TitleScene extends Phaser.Scene {
	preload() {
		this.cameras.main.setBackgroundColor('rgba(32,44,64,1)')
	}

	async create() {
		await this.displayWeb3Modal()
		this.scene.start(SceneKeys.Preload)
	}

	private initWeb3(provider: any) {
		const web3: any = new Web3(provider);

		web3.eth.extend({
			methods: [
				{
					name: 'chainId',
					call: 'eth_chainId',
					outputFormatter: web3.utils.hexToNumber,
				},
			],
		});

		return web3;
	}

	private async displayWeb3Modal(): Promise<number> {
		return new Promise(async (resolve, reject) => {
			const providerOptions = {
				walletconnect: {
					package: WalletConnectProvider,
					options: {
						rpc: {
							56: 'https://bsc-dataseed.binance.org',
						},
						network: 'binance',
					},
				},
			};

			const web3Modal = new Web3Modal({
				providerOptions: providerOptions,
			});

			try {
				const provider = await web3Modal.connect();

				const web3const = this.initWeb3(provider);

				window.web3 = web3const;
				const accs = await web3const.eth.getAccounts();
				resolve(accs[0]);
			} catch (err) {
				this.displayWeb3Modal()

			}

		});
	}
}
