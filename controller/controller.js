const request = require("request");
const cheerio = require("cheerio");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let get_my_result = (req) => {
    return new Promise((resolve, reject) => {
        let my_num = req.query.num;
        let url = "http://m.dhlottery.co.kr/qr.do?method=winQr&v=" + my_num;

        var options = {
            method: 'GET',
            url: url,
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log("body#################################################")
            const dom = new JSDOM(body);
            let select_total = "#container > div > div.winner_number > div.bx_notice.winner > div:nth-child(1) > strong > span";
            let select_list_each = [
                "#container > div > div.list_my_number > div > table > tbody > tr:nth-child(1)",
                "#container > div > div.list_my_number > div > table > tbody > tr:nth-child(2)",
                "#container > div > div.list_my_number > div > table > tbody > tr:nth-child(3)",
                "#container > div > div.list_my_number > div > table > tbody > tr:nth-child(4)",
                "#container > div > div.list_my_number > div > table > tbody > tr:nth-child(5)",
            ];
            
            // let total_amt = dom.window.document.querySelector(select_total).textContent.replace(/(\s*)/g,""); 
            let total_amt = dom.window.document.querySelector(select_total).textContent.match(/[0-9]/g); 
            let total_amt_str = "";
            if(total_amt){
                for( let i=0; i<total_amt.length; i++){
                    total_amt_str += total_amt[i];
                }
            }

            let each_result = [];

            for( let i=0; i<select_list_each.length; i++ ){
                let rows = dom.window.document.querySelector(select_list_each[i]).textContent.replace(/(\s*)/g,",");
                each = {
                    rows: rows.split(",,")[1],
                    result: (rows.split(",,")[2].substring(0,1).match(/[0-9]/g) ? rows.split(",,")[2].substring(0,1).substring(0,1)+"등" : "낙점"),
                    num: [
                        rows.split(",,")[3].replace(",",""),
                        rows.split(",,")[4].replace(",",""),
                        rows.split(",,")[5].replace(",",""),
                        rows.split(",,")[6].replace(",",""),
                        rows.split(",,")[7].replace(",",""),
                        rows.split(",,")[8].replace(",",""),
                    ]
                }
                each_result.push(each);
                // console.log(each_result)
            }

            resolve(JSON.stringify({
                result: "success", 
                result_code: 200, 
                data: {
                    total_amt: total_amt_str,
                    each_result: each_result,
                    first: "1st"
                    // [
                    //     {row: "A", result: "당첨", num: "1 3 7 29 41"}
                    // ]
                }
            }));
        });

    });
}

module.exports = {
    get_my_result
}