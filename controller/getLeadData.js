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

import fb from 'fb';
import axios from 'axios';

const getLead = async (req, res, next) => {
    try {
        const accessToken = process.env.ACCESS_TOKEN_FB;

        // const userData = await fb.api('me', { access_token: accessToken });
        const userData = await fb.api('me', { fields: ['id', 'name', 'adaccounts{account_id,business_name,account_status,created_time,disable_reason,insights}'], access_token: accessToken });


        if (!userData || userData.error) {
            throw new Error(userData.error ? userData.error : 'Error occurred while fetching user data');
        }

        // for leads not tested yet 🫤😊

        const pageId = process.env.PAGE_ID;
        const endpoint = `https://graph.facebook.com/v18.0/${pageId}/leads`;
        // const endpoint = `https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving`;

        let leads
        axios.get(`${endpoint}?access_token=${accessToken}`)
            .then(response => {
                leads = response?.data?.data;
                console.log('leads: ', leads);
                const totalLeads = leads?.length;
                console.log(`Total leads: ${totalLeads}`);
            })
            .catch(error => {
                console.error('Error retrieving leads:', error);
            });

        return res.status(200).json({
            status: true,
            code: 200,
            message: "fetched data successfully!!",
            data: { userData, leads },
        });

    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default getLead;
