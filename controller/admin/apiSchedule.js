import cron from 'node-cron'
import axios from 'axios';
import leadModel from '../../models/leadData.js';
import formModel from '../../models/forms.js';
import randomstring from 'randomstring';
import sendNotification from '../../utils/firebase.js';

const getLead = async () => {
    const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;
    const access_token = process.env.ACCESS_TOKEN_FB;
    const pageId = process.env.PAGE_ID;
    let url = `https://graph.facebook.com/v19.0/${pageId}/leadgen_forms`;

    const allLeads = [];

    let response = await axios.get(url, { params: { fields: 'id,name,leads_count,created_time,status', access_token: pageAccessToken } });

    if (!response.status === 200 || !response.data || response.data.error) {
        throw new Error(`Failed to fetch : ${response.data.error?.message || 'Unknown error'}`);
    }

    const totalForm = response?.data;

    totalForm?.data?.map(async (item) => {
        const findForm = await formModel.findOne({ formId: item?.id });

        let url = `https://graph.facebook.com/v19.0/${item?.id}/leads`;
        let response = await axios.get(url, { params: { fields: 'field_data', access_token: access_token } });

        const fieldData = response?.data;
        const fields = fieldData?.data[0];

        const date = new Date();
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+0000`;

        // console.log("formattedDate", formattedDate);

        if (findForm) {
            await formModel.updateMany({ formId: item?.id }, { $set: { leads_count: item?.leads_count, extractionDate: formattedDate } })
        } else {

            // if (!findForm) {
            const newForm = new formModel({
                formId: item?.id,
                formName: item?.name,
                created_time: item?.created_time,
                leads_count: item?.leads_count,
                status: item?.status,
                extractionDate: formattedDate,
                fields: fields?.field_data?.map(field => ({
                    fieldName: field?.name,
                    fieldId: randomstring.generate(6)
                }))
            });
            await newForm.save();
        }
    });

    await Promise.all(totalForm?.data?.map(async (item) => {

        const findForm = await formModel.findOne({ formId: item?.id });
        const extractionDate = findForm?.extractionDate
        let url = `https://graph.facebook.com/v19.0/${item?.id}/leads`;
        const response = await axios.get(url, { params: { fields: "leads, form_id, field_data, created_time,campaign_id,campaign_name, id", access_token: access_token } });

        const fieldData = response?.data;
        let LeadData = fieldData?.data

        const filteredLeads = LeadData.filter(lead => lead.created_time >= extractionDate);

        if (LeadData?.length > 0) {
            allLeads.push(filteredLeads)
        }

        let next = fieldData?.paging?.next;
        while (next) {
            const response = await axios.get(next);
            const fieldData = response?.data;
            LeadData = fieldData?.data
            const filteredLeads = LeadData.filter(lead => lead.created_time >= extractionDate);
            if (LeadData?.length > 0) {
                allLeads.push(filteredLeads)
            }
            next = fieldData?.paging?.next;
        }
    }));


    async function processLeads(allLeads) {
        await Promise.all(allLeads.map(async leads => {
            await Promise.all(leads.map(async leadData => {
                try {
                    const formDetails = await formModel.findOne({ formId: +leadData?.form_id });
                    if (!formDetails) {
                        console.error(`Form details not found for form ID: ${leadData.form_id}`);
                        return;
                    }
                    // await formModel.updateMany({ formId: leadData?.form_id }, { $set: { leads_count: item?.leads_count, extractionDate: formattedDate } })
                    const findLead = await leadModel.findOne({ leadId: leadData?.id });

                    if (!findLead) {

                        const fieldsWithIds = leadData?.field_data?.map(field => {
                            const fieldInForm = formDetails?.fields?.find(f => f.fieldName === field?.name);
                            return {
                                fieldName: field?.name,
                                fieldId: fieldInForm ? fieldInForm?.fieldId : '',
                                fieldValue: field?.values[0]
                            };
                        });

                        const leadObject = {
                            formId: leadData?.form_id,
                            leadId: +leadData?.id,
                            campaignName: leadData?.campaign_name,
                            campaignId: +leadData?.campaign_id,
                            created_time: leadData?.created_time,
                            data: fieldsWithIds?.map(field => ({
                                fieldName: field?.fieldName,
                                fieldId: field?.fieldId,
                                fieldValue: field?.fieldValue || ''
                            })),
                            leadOrigin: "Lead Ads",
                            leadSource: "FB Lead Ads",
                            leadStatus: "New Lead",
                            leadOwner: "789254",
                        };

                        const newLead = new leadModel(leadObject);
                        await newLead.save();
                        console.log('Lead saved successfully:', newLead);
                    }
                } catch (error) {
                    console.error('Error processing lead:', error);
                }
            }));
        }));
    }
    processLeads(allLeads);
}


cron.schedule('*/15 * * * *', async () => {
    try {
        console.log('Running scheduled job...');
        // await getLead();
        // console.log('Scheduled job completed.');
    } catch (error) {
        console.error('Error in scheduled job:', error);
    }
});

// scheduled job for every 2 hours

// cron.schedule('0 */2 * * *', async () => {
//     try {
//         console.log('Running scheduled job...');
//         await getLead();
//         console.log('Scheduled job completed.');
//     } catch (error) {
//         console.error('Error in scheduled job:', error);
//     }
// });