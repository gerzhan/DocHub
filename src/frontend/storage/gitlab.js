import config from '@front/config';
import cookie from 'vue-cookie';
// import GitHelper from '../helpers/gitlab';
import storageManager from '@front/manifest/manager';
import Vue from 'vue';
import requests from '@front/helpers/requests';
import gateway from '@idea/gateway';
import consts from '@front/consts';
import rules from '@front/helpers/rules';
import crc16 from '@global/helpers/crc16';
import entities from '@front/helpers/entities';
import env, { Plugins } from '@front/helpers/env';
import plugins from './plugins';

import GitLab  from '@front/helpers/gitlab';

const axios = require('axios');

export default {
	modules: {
		plugins
	},
	state: {
		// Признак загрузки данных
		isReloading: true,
		// Признак рендеринга в версии для печати
		isPrintVersion: false,
		// Идет процесс авторизации в gitlab
		isOAuthProcess: null,
		// Токен досутпа в GitLab
		access_token: null,
		// Токен бновления access_token досутпа в GitLab
		refresh_token: null,
		// Обобщенный манифест
		manifest: {},
		// Выявленные Проблемы
		problems: [],
		// Источники данных манифеста
		sources: [],
		// Доступные проекты GitLab
		available_projects: {},
		// Проекты
		projects: {},
		diff_format: 'line-by-line',
		// Последние изменения
		last_changes: {},
		// Движок для рендеринга
		renderCore: 'graphviz',
		// Признак инциализации проекта в плагине
		notInited: null,
		// Признак критической проблемы
		criticalError: null
	},

	mutations: {
		clean(state) {
			state.manifest = {};
			state.problems = [];
			state.sources = {};
			state.available_projects = {};
			state.projects = {};
			state.last_changes = {};
			state.criticalError = null;
		},
		setManifest(state, value) {
			state.manifest = value;
		},
		setSources(state, value) {
			state.sources = value;
		},
		setIsOAuthProcess(state, value) {
			state.isOAuthProcess = value;
		},
		setIsReloading(state, value) {
			state.isReloading = value;
		},
		setAccessToken(state, value) {
			state.access_token = value;
		},
		setRefreshToken(state, value) {
			state.refresh_token = value;
		},
		setDiffFormat(state, value) {
			state.diff_format = value;
			cookie.set('diff_format', value, 1);
		},
		appendLastChanges(state, value) {
			Vue.set(state.last_changes, value.id, value.payload);
		},
		appendProblems(state, value) {
			state.problems = state.problems.concat([value]);
		},
		setRenderCore(state, value) {
			state.renderCore = value;
		},
		setNoInited(state, value) {
			state.notInited = value;
		},
		setCriticalError(state, value) {
			state.criticalError = value;
		},
		setPrintVersion(state, value) {
			state.isPrintVersion = value;
		}
	},

	actions: {
		// Action for init store
		init(context) {
			context.dispatch('plugins/init');

			const errors = {
				syntax: null,
				net: null
			};

			context.commit('setRenderCore',
				env.isPlugin(Plugins.idea) ? 'smetana' : 'graphviz'
			);

			let diff_format = cookie.get('diff_format');
			context.commit('setDiffFormat', diff_format ? diff_format : context.state.diff_format);

      storageManager.onReloaded = (parser) => {
				// Очищяем прошлую загрузку
				context.commit('clean');
				// Регистрируем обнаруженные ошибки
				errors.syntax && context.commit('appendProblems', errors.syntax);
				errors.net && context.commit('appendProblems', errors.net);

				const manifest = Object.freeze(parser.manifest);
				// Обновляем манифест и фризим объекты
				context.commit('setManifest', manifest);
				context.commit('setSources', Object.freeze(parser.mergeMap));
				context.commit('setIsReloading', false);
				if (!Object.keys(context.state.manifest || {}).length) {
					context.commit('setCriticalError', true);
				}

				entities(manifest);
				rules(manifest,
					(problems) => context.commit('appendProblems', problems),
					(error) => {
						// eslint-disable-next-line no-console
						console.error(error);
						context.commit('appendProblems', error);
					});
			};
      storageManager.onStartReload = () => {
				errors.syntax = null;
				errors.net = null;
				context.commit('setNoInited', null);
				context.commit('setIsReloading', true);
			};
      storageManager.onError = (action, data) => {
				const error = data.error || {};
				const url = (data.error.config || { url: data.uri }).url;
				const uid = '$' + crc16(url);
				if (action === 'syntax') {
					if (!errors.syntax) {
						errors.syntax = {
							id: '$error.syntax',
							title: 'Ошибка синтаксиса',
							items: []
						};
					}
					const source = error.source || {};
					const range = source.range || {};
					if (!errors.syntax.items.find((item) => item.uid === uid)) {
						errors.syntax.items.push({
							uid,
							title: url,
							correction: 'Исправьте ошибку в файле',
							description: 'Допущена синтаксиеческая ошибка при описании манифеста:\n\n'
								+ `${error.toString()}\n`
								+ `Код: ${source.toString()}`
								+ `Диапазон: ${range.start || '--'}..${range.end || '--'}`,
							location: url
						});
					}
				} else if (data.uri === consts.plugin.ROOT_MANIFEST) {
					context.commit('setNoInited', true);
				} else {
					if (!errors.net) {
						errors.net = {
							id: '$error.net',
							title: 'Сетевые ошибки',
							items: []
						};
					}
					errors.net.items.push({
						uid,
						title: url,
						correction: 'Устраните сетевую ошибку',
						description: 'Возникла сетевая ошибка:\n\n'
							+ `${error.toString()}\n`,
						location: url
					});
					context.commit('setIsReloading', false);
				}
			};

			context.dispatch('reloadAll');

			let changes = {};
			let refreshTimer = null;

			function reloadSourceAll(data) {
				if (data) {
					changes = Object.assign(changes, data);
					if (refreshTimer) clearTimeout(refreshTimer);
					refreshTimer = setTimeout(() => {
						for (const source in changes) {
							if (
								(source === consts.plugin.ROOT_MANIFEST)
								|| requests.isUsedURL(source)
							) {
								// eslint-disable-next-line no-console
								console.info('>>>>>> GO RELOAD <<<<<<<<<<');
								changes = {};
								context.dispatch('reloadAll', Object.keys(data));
								break;
							}
						}
					}, 350);
				}
			}

			gateway.appendListener('source/changed', reloadSourceAll);
		},

		// Вызывается при необходимости получить access_token
		refreshAccessToken(context, OAuthCode) {
			const params = OAuthCode ? {
				grant_type: 'authorization_code',
				code: OAuthCode
			} : {
				grant_type: 'refresh_token',
				refresh_token: context.state.refresh_token
			};

			if (OAuthCode) context.commit('setIsOAuthProcess', true);

			const OAuthURL = (new URL('/oauth/token', config.gitlab_server)).toString();

			axios({
				method: 'post',
				url: OAuthURL,
				params: Object.assign({
					client_id: config.oauth.APP_ID,
					redirect_uri: (new URL(consts.pages.OAUTH_CALLBACK_PAGE, window.location)).toString()
				}, params)
			})
				.then((response) => {
					context.commit('setAccessToken', response.data.access_token);
					context.commit('setRefreshToken', response.data.refresh_token);
					setTimeout(() => context.dispatch('refreshAccessToken'), (response.data.expires_in - 10) * 1000);
					if (OAuthCode) context.dispatch('reloadAll');
				}).catch((e) => {
					context.commit('appendProblems', [{
						problem: 'Сетевые ошибки',
						route: OAuthURL,
						target: '_blank',
						title: `Ошибка авторизации GitLab OAuth [${e.toString()}]`
					}]);
					// eslint-disable-next-line no-console
					console.error('Ошибка авторизации GitLab OAuth ', e);
				}).finally(() => context.commit('setIsOAuthProcess', false));
		},

		// Need to call when gitlab takes callback's rout with oauth code
		onReceivedOAuthCode(context, OAuthCode) {
			context.dispatch('refreshAccessToken', OAuthCode);
		},

		// Reload root manifest
		reloadAll(context, payload) {
			context.dispatch('reloadRootManifest', payload);
		},

		// Reload root manifest
		updateLastChanges(context) {
			let request = new function() {
				this.terminate = false;
				this.projects_tasks = {};

				this.loadLastChange = (doc) => {
					axios({
						method: 'get',
						url: GitLab.commitsListURI(doc.project_id, doc.branch, 1, doc.source, 1),
						headers: { 'Authorization': `Bearer ${context.state.access_token}` }
					})
						.then((response) => {
							if (!this.terminate) {
								context.commit('appendLastChanges', {
									id: doc.id,
									payload: response.data
								});
							}
						});
				};

				this.stop = () => {
					this.terminate = true;
				};
			};

			for (let id in context.state.docs) {
				let doc = context.state.docs[id];
				if ((doc.transport || '').toLowerCase() === 'gitlab') {
					request.loadLastChange(doc);
				}
			}
		},

		// Reload root manifest
		async reloadRootManifest(_context, payload) {
			// Если работаем в режиме backend, берем все оттуда
			if (env.isBackendMode()) {
        storageManager.onStartReload();
        storageManager.onReloaded({
					manifest: Object.freeze({}),
					mergeMap: Object.freeze({})
				});

				/*
				axios({ url: (new URL('core/manifest/state', env.backendURL())).toString() })
					.then((response) => {
						parser.onReloaded({
							manifest: Object.freeze(response.data.manifest),
							mergeMap: Object.freeze(response.data.mergeMap)
						});
					})
					.catch((error) => {
						parser.onError('net', { uri, error: error });
					});
				*/
			} else {
				await storageManager.reloadManifest(payload);
			}
		},

		// Регистрация проблемы
		registerProblem(context, problem) {
			context.commit('appendProblem', problem);
		}
	}
};