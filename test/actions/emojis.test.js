// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import fs from 'fs';
import assert from 'assert';

import * as Actions from 'actions/emojis';
import {Client, Client4} from 'client';

import {RequestStatus} from 'constants';
import TestHelper from 'test/test_helper';
import configureStore from 'test/test_store';

describe('Actions.Emojis', () => {
    let store;
    before(async () => {
        await TestHelper.initBasic(Client, Client4);
    });

    beforeEach(async () => {
        store = await configureStore();
    });

    after(async () => {
        await TestHelper.basicClient.logout();
        await TestHelper.basicClient4.logout();
    });

    it('createCustomEmoji', async () => {
        const testImageData = fs.createReadStream('test/assets/images/test.png');
        const created = await Actions.createCustomEmoji(
            {
                name: TestHelper.generateId(),
                creator_id: TestHelper.basicUser.id
            },
            testImageData
        )(store.dispatch, store.getState);

        const state = store.getState();
        const request = state.requests.emojis.createCustomEmoji;
        if (request.status === RequestStatus.FAILURE) {
            throw new Error('createCustomEmoji request failed');
        }

        const emojis = state.entities.emojis.customEmoji;
        assert.ok(emojis);
        assert.ok(emojis[created.id]);
    });

    it('getCustomEmojis', async () => {
        const testImageData = fs.createReadStream('test/assets/images/test.png');
        const created = await Actions.createCustomEmoji(
            {
                name: TestHelper.generateId(),
                creator_id: TestHelper.basicUser.id
            },
            testImageData
        )(store.dispatch, store.getState);

        await Actions.getCustomEmojis(TestHelper.basicChannel.id)(store.dispatch, store.getState);

        const state = store.getState();
        const request = state.requests.emojis.getCustomEmojis;
        if (request.status === RequestStatus.FAILURE) {
            throw new Error('getCustomEmojis request failed');
        }

        const emojis = state.entities.emojis.customEmoji;
        assert.ok(emojis);
        assert.ok(emojis[created.id]);
    });

    it('deleteCustomEmoji', async () => {
        const testImageData = fs.createReadStream('test/assets/images/test.png');
        const created = await Actions.createCustomEmoji(
            {
                name: TestHelper.generateId(),
                creator_id: TestHelper.basicUser.id
            },
            testImageData
        )(store.dispatch, store.getState);

        await Actions.deleteCustomEmoji(created.id)(store.dispatch, store.getState);

        const state = store.getState();
        const request = state.requests.emojis.deleteCustomEmoji;
        if (request.status === RequestStatus.FAILURE) {
            throw new Error('removeCustomEmoji request failed');
        }

        const emojis = state.entities.emojis.customEmoji;
        assert.ok(!emojis[created.id]);
    });
});
