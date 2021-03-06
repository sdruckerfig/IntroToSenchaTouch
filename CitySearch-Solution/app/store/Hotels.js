/*
 * File: app/store/Hotels.js
 *
 * This file was generated by Sencha Architect version 3.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.3.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.3.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('CitySearch.store.Hotels', {
    extend: 'Ext.data.Store',

    requires: [
        'CitySearch.model.Business',
        'Ext.data.proxy.JsonP',
        'Ext.data.reader.Json'
    ],

    config: {
        autoLoad: true,
        model: 'CitySearch.model.Business',
        storeId: 'Hotels',
        proxy: {
            type: 'jsonp',
            url: 'http://api.yelp.com/business_review_search?ywsid=k1Wfd6Rrfj9a8BNRUaG61Q&term=hotels&location=Washington DC',
            reader: {
                type: 'json',
                rootProperty: 'businesses'
            }
        }
    }
});