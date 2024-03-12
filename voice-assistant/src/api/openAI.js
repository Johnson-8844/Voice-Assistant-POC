import axios from 'axios';
const {apiKey} = require("../constants");

const client = axios.create({
    headers: {
        "Authorization": "Bearer "+apiKey,
        "Content-Type": "application/json"
    }
});

const chatGPTEndpoint = "https://api.openai.com/v1/chat/completions";
const dallEndpoint = "https://api.openai.com/v1/images/generations";

export const apiCall = async (prompt, messages) => {
    try {
        // const res = await client.post(chatGPTEndpoint, {
        //     model: "gpt-3.5-turbo",
        //     messages: [{
        //         role: "user",
        //         content: `Does this message want to generate an AI picture, image, art or anything similar to a picture? ${prompt}. Simply answer with a yes or no.`
        //     }]
        // })
        if (prompt.toLowerCase().includes('hey send')) {
            return await sqlDatabaseApiCall(prompt, messages);
        } else if (prompt.toLowerCase().includes('hey explain')) {
            return await documentApiCall(prompt, messages);
        } else if (prompt.toLowerCase().includes('what is the current')) {
            return await btcApiCall(prompt, messages);
        } else {
            return await chatgptApiCall(prompt, messages);
        }
        // console.log(res.data.choices[0].message.content)
        // Explain the investors exhibition
        // Send 500 BTC from John to Ram
        // What is the current rate of 1 BTC
        // let isArt = res.data?.choices[0]?.message?.content;
        // if (isArt.toLowerCase().includes('yes')){
        //     console.log('dalle api call');
        //     return dalleApiCall(prompt, messages || []);
        // }else {
        //     console.log("Chat GPT api call");
        //     return chatgptApiCall(prompt, messages || [])
        // }
    } catch (error) {
        console.log("Error : ", error);
        return Promise.resolve({success: false, msg: error.message})
    }
}

const chatgptApiCall = async (prompt, messages) => {
    try {
        const res = await client.post(chatGPTEndpoint, {
            model: "gpt-3.5-turbo",
            messages
        });
        let answer = res.data.choices[0].message.content;
        return Promise.resolve({success: true, data: answer})
    } catch (error) {
        console.log("Error : ", error);
        return Promise.resolve({success: false, msg: error.message})
    }
}

const documentApiCall = async (prompt, messages) => {
    console.log("Document Api call")
    try {
        const url = "http://10.0.2.2:5000/document";
        const res = await axios({
            method: 'post',
            url: url,
            data: {
              prompt: prompt
            }
          });
        console.log("Response : ", res.data.answer)
        return Promise.resolve({success: true, data: res.data.answer})
    } catch (error) {
        console.log("Error : ", error);
        return Promise.resolve({success: false, msg: error.message})
    }
}

const sqlDatabaseApiCall = async (prompt, messages) => {
    console.log("SQL Api call")
    try {
        const url = "http://10.0.2.2:5000/sqldb";
        const res = await axios({
            method: 'post',
            url: url,
            data: {
                question: prompt
            }
          });
        console.log("Response : ", res.data.answer)
        return Promise.resolve({success: true, data: res.data.answer})
    } catch (error) {
        console.log("Error : ", error);
        return Promise.resolve({success: false, msg: error.message})
    }
}

const btcApiCall = async (prompt, messages) => {
    console.log("BTC Api call")
    try {
        const url = "http://10.0.2.2:5000/btc";
        const res = await axios({
            method: 'post',
            url: url,
            data: {
                question: prompt
            }
          });
        console.log("Response : ", res.data.answer)
        return Promise.resolve({success: true, data: res.data.answer})
    } catch (error) {
        console.log("Error : ", error);
        return Promise.resolve({success: false, msg: error.message})
    }
}

// const dalleApiCall = async (prompt, messages) => {
//     try {
//         const res = await client.post(dallEndpoint, {
//             //model: "dall-e-2",
//             prompt,
//             n: 1,
//             size: "512x512"
//         });
        
//         let url = res?.data?.data[0]?.url;
//         console.log("URL Link :",url);
//         messages.push({role: "assistant", content: url})
//         return Promise.resolve({success: true, data: url})
//     } catch (error) {
//         console.log("Error : ", error);
//         return Promise.resolve({success: false, msg: error.message})
//     }
// }