// import fb from 'fb';

// const getLead = async (req, res, next) => {
//     try {
//         // const { id, name } = req.query
//         // fb.options({
//         //     appId: process.env.APP_ID_FB,
//         //     appSecret: process.env.APP_SECRET_FB,
//         // });

//         const accessToken = process.env.ACCESS_TOKEN_FB ;fields=id,name,adaccounts{account_id,business_name,account_status}

//         const userData = await fb.api('me', { fields: ['id', 'name','adaccounts'], access_token: accessToken });

//         if (!userData || userData.error) {
//             throw new Error(userData.error ? userData.error : 'Error occurred while fetching user data');
//         }

//         res.status(200).json(userData);
//     } catch (error) {
//         console.error('Error occurred:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export default getLead;

// import fb from 'fb';
// import axios from 'axios';
// import leadModel from '../models/leadData.js';

// const getLead = async (req, res, next) => {
//     try {
//         const accessToken = process.env.ACCESS_TOKEN_FB;
//         const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;
//         const pageId = process.env.PAGE_ID;


//         const endpoint = `https://graph.facebook.com/v19.0/${pageId}/leadgen_forms`;
//         const fields = 'id,name,leads_count,leads,created_time,status';
//         const url = `${endpoint}?fields=${fields}&access_token=${pageAccessToken}`;

//         const response = await fetch(url);
//         const data = await response.json();
//         console.log('data: ', data);

//         if (!response.ok) {
//             throw new Error(`HTTP error ${response.status}: ${data.error.message}`);
//         }

//         const today = new Date();
//         const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
//         const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

//         // const todayLeads = data?.data?.flatMap(form => {
//         //     const formLeads = form?.leads?.data || [];
//         //     return formLeads.filter(lead => {
//         //         const leadCreatedTime = new Date(lead.created_time);
//         //         return leadCreatedTime > todayStart && leadCreatedTime <= todayEnd;
//         //     });
//         // }) || [];

//         // console.log('Today\'s leads: ', todayLeads);

//         // data?.data?.flatMap(({ field_data, ...rest }) => {
//         //     field_data.forEach((field, index) => {
//         //         console.log(`Field ${index + 1}:`, field);
//         //     });
//         // });

//         const promises = data?.data?.map(async (item) => {
//             console.log('item: ', item);
//             item?.leads?.data?.forEach(async (leadData) => {
//                 let fullName = leadData?.field_data?.find(data => data?.name === 'full_name')?.values[0] || '';
//                 let city = leadData?.field_data?.find(data => data?.name === 'city')?.values[0] || '';
//                 let rooms = leadData?.field_data?.find(data => data?.name === 'number_of_rooms_in_your_hotel?')?.values[0] || '';
//                 rooms = leadData?.field_data?.find(data => data?.name === 'total_rooms_in_hotel')?.values[0] || '';
//                 let phoneNumber = leadData?.field_data?.find(data => data?.name === 'phone_number')?.values[0] || '';
//                 let email = leadData?.field_data?.find(data => data?.name === 'email')?.values[0] || '';
//                 let hotelName = leadData?.field_data?.find(data => data?.name === "your_hotel's_name")?.values[0] || '';
//                 hotelName = leadData?.field_data?.find(data => data?.name === "your_hotel_name")?.values[0] || '';
//                 let channel_manager = leadData?.field_data?.find(data => data?.name === 'using_channel_manager_?')?.values[0] || '';
//                 let companyName = leadData?.field_data?.find(data => data?.name === 'company_name')?.values[0] || '';

//                 const newLead = new leadModel({
//                     formId: item?.id,
//                     formName: item?.name,
//                     leadId: leadData?.id,
//                     created_time: leadData?.created_time,
//                     leadCount: item?.leads_count,
//                     fullName: fullName,
//                     city: city,
//                     rooms: rooms,
//                     phoneNumber: phoneNumber,
//                     email: email,
//                     hotelName: hotelName,
//                     channel_manager: channel_manager,
//                     companyName: companyName,
//                     leadOrigin: "Facebook",
//                 });
//                 console.log('newLead: ', newLead);
//                 return newLead.save();
//             });
//         });

//         try {
//             await Promise.all(promises.flat());
//             console.log('Lead saved successfully:');
//         } catch (error) {
//             console.error('Error saving lead:', error);
//         }


//         return res.status(200).json({
//             status: true,
//             code: 200,
//             message: "fetched data successfully!!",
//             data: data,
//         });

//     } catch (error) {
//         console.error('Error occurred:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export default getLead;

// import fb from 'fb';
// import axios from 'axios';
// import leadModel from '../../models/leadData.js';

// const getLead = async (req, res, next) => {
//     try {
//         const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;
//         const pageId = process.env.PAGE_ID;
//         let url = `https://graph.facebook.com/v19.0/${pageId}/leadgen_forms`;

//         const allLeads = [];

//         const response = await axios.get(url, { params: { fields: 'id,name,leads_count,leads,created_time,status', access_token: pageAccessToken } });

//         if (!response.status === 200 || !response.data || response.data.error) {
//             throw new Error(`Failed to fetch leads: ${response.data.error.message}`);
//         }

//         const data = response?.data?.data?.map(async (item) => {
//             console.log('item: ', item);
//             const nextUrl = item?.leads?.paging?.next
//             console.log('nextUrl: ', nextUrl);
//             const response = await fetch(nextUrl);
//             console.log('response: ', response);
//             allLeads.push(item);
//         });

//         // const after = response?.data?.paging?.cursors?.after;
//         // console.log('after: ', after);
//         // newToken = `${pageAccessToken}&after=${after}`;
//         // console.log('newToken: ', newToken);
//         // const formId = response.data.data

//         // url = `https://graph.facebook.com/v19.0/${formId}/leads`;
//         // if (after) {
//         //     url = `${url}?after=${after}`;
//         // } else {
//         //     newToken = null;
//         // }

//         const promises = allLeads.flatMap(item => {
//             return item?.leads?.data?.map(async leadData => {
//                 let fullName = leadData?.field_data?.find(data => data?.name === 'full_name')?.values[0] || '';
//                 let city = leadData?.field_data?.find(data => data?.name === 'city')?.values[0] || '';
//                 let rooms = leadData?.field_data?.find(data => data?.name === 'number_of_rooms_in_your_hotel?')?.values[0] || '';
//                 rooms = leadData?.field_data?.find(data => data?.name === 'total_rooms_in_hotel')?.values[0] || '';
//                 let phoneNumber = leadData?.field_data?.find(data => data?.name === 'phone_number')?.values[0] || '';
//                 let email = leadData?.field_data?.find(data => data?.name === 'email')?.values[0] || '';
//                 let hotelName = leadData?.field_data?.find(data => data?.name === "your_hotel's_name")?.values[0] || '';
//                 hotelName = leadData?.field_data?.find(data => data?.name === "your_hotel_name")?.values[0] || '';
//                 let channel_manager = leadData?.field_data?.find(data => data?.name === 'using_channel_manager_?')?.values[0] || '';
//                 let companyName = leadData?.field_data?.find(data => data?.name === 'company_name')?.values[0] || '';

//                 const newLead = new leadModel({
//                     formId: item?.id,
//                     formName: item?.name,
//                     leadId: leadData?.id,
//                     created_time: leadData?.created_time,
//                     leadCount: item?.leads_count,
//                     fullName: fullName,
//                     city: city,
//                     rooms: rooms,
//                     phoneNumber: phoneNumber,
//                     email: email,
//                     hotelName: hotelName,
//                     channel_manager: channel_manager,
//                     companyName: companyName,
//                     leadOrigin: "Lead Ads",
//                     leadSource: "FB Lead Ads",
//                 });
//                 return newLead.save();
//             });
//         });

//         await Promise.all(promises);

//         return res.status(200).json({
//             status: true,
//             code: 200,
//             message: "Fetched data successfully!!",
//             data: allLeads,
//         });

//     } catch (error) {
//         console.error('Error occurred:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export default getLead;


import axios from 'axios';
import leadModel from '../../models/leadData.js';
import ErrorHandler from '../../middleware/errorHandler.js';

const getLead = async (req, res, next) => {
    try {
        const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;
        const pageId = process.env.PAGE_ID;
        let url = `https://graph.facebook.com/v19.0/${pageId}/leadgen_forms`;

        const allLeads = [];
        const leadIdSet = new Set();

        let response = await axios.get(url, { params: { fields: 'id,name,leads_count,leads,created_time,status', access_token: pageAccessToken } });

        if (!response.status === 200 || !response.data || response.data.error) {
            throw new Error(`Failed to fetch leads: ${response.data.error?.message || 'Unknown error'}`);
        }

        const data = await Promise.all(response.data.data.map(async (item) => {
            let nextUrl = item?.leads?.paging?.next;
            while (nextUrl) {
                const response = await axios.get(nextUrl);
                if (response.data.data) {
                    response.data.data.forEach(leadData => {
                        console.log('leadData: ', leadData);
                        if (!leadIdSet.has(leadData.id)) {
                            leadIdSet.add(leadData.id);
                            allLeads.push(leadData);
                        }
                    });
                }
                nextUrl = response.data.paging?.next;
            }
            if (!leadIdSet.has(item.id)) {
                leadIdSet.add(item.id);
                allLeads.push(item);
            }
            return item;
        }));

        const batchSize = 100;
        const batches = [];

        for (let i = 0; i < allLeads.length; i += batchSize) {
            const batch = allLeads.slice(i, i + batchSize);
            batches.push(Promise.all(batch.flatMap(async (item) => {
                if (item?.leads?.data) {
                    return Promise.all(item.leads.data.map(async (leadData) => {
                        const {
                            full_name = '',
                            city = '',
                            number_of_rooms_in_your_hotel = '',
                            total_rooms_in_hotel = '',
                            phone_number = '',
                            email = '',
                            using_channel_manager = '',
                            company_name = '',
                        } = Object.fromEntries(
                            leadData?.field_data?.map(({ name, values }) => [name, values[0] || '']) || []
                        );

                        const your_hotel_name = leadData?.field_data?.find(data => data?.name === "your_hotel_name")?.values[0] || '';
                        const your_hotel_name_alt = leadData?.field_data?.find(data => data?.name === "your_hotel's_name")?.values[0] || '';
                        const hotelName = your_hotel_name || your_hotel_name_alt;

                        const rooms = number_of_rooms_in_your_hotel || total_rooms_in_hotel;

                        const leadDataToSave = new leadModel({
                            formId: item?.id,
                            formName: item?.name,
                            leadId: leadData?.id,
                            created_time: leadData?.created_time,
                            leadCount: item?.leads_count,
                            fullName: full_name,
                            city,
                            rooms,
                            phoneNumber: phone_number,
                            email,
                            hotelName,
                            channel_manager: using_channel_manager,
                            companyName: company_name,
                            leadOrigin: "Lead Ads",
                            leadSource: "FB Lead Ads",
                        });

                        return leadDataToSave.save();
                    }));
                }
                return [];
            })));
        }

        await Promise.all(batches);

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Fetched data successfully!!",
            data: allLeads,
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
};

export default getLead;