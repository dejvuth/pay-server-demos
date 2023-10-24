/*
 * Copyright 2023 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fetch = require('node-fetch');

module.exports = (config, order) => {
  // See PSP's docs for full API details:
  // https://docs.aciworldwide.com/reference/parameters#googlepay

  let ok;

  const params = new URLSearchParams();
  params.append('entityId', config.entityId);
  params.append('amount', order.totalFixed);
  params.append('currency', order.currency);
  params.append('googlePay.paymentToken', JSON.stringify(order.paymentToken));
  params.append('googlePay.source', 'web');
  params.append('paymentBrand', 'GOOGLEPAY');
  params.append('paymentType', config.paymentType);
  params.append('shopperResultUrl', config.shopperResultUrl);

  return fetch(config.host, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + config.bearer,
    },
    body: params,
  })
    .then(response => {
      ok = response.ok;
      return response.json();
    })
    .then(response => {
      if (ok) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    });
};
