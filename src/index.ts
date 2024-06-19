import axios from "axios"
import fs from "fs"
let i = Number(process.env.START || 100000)

const resultDir = "./dist"

if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir)
}

const main = async () => {
    while (true) {
        const result = await axios.get(`https://s6.tuoitre.vn/api/diem-thi-lop-10.htm?keywords=${i}&year=2024&sitename=tuoitre.vn`, {
            headers: {
                "Origin": "https://tuoitre.vn"
            }
        })
        fs.writeFileSync(`${resultDir}/${i}.json`, JSON.stringify(result.data, null, 2))
        const student = result.data.data[0]
        console.log(`Fetched success student ${i} - ${student.HO_TEN} - Total score: ${student.TONGDIEM} - ${student.NGAY_SINH}`)
        i += 1
        if (i > 200000) break
        // await sleep(2)
    }
}

main().then(() => console.log("DONE")).catch(err => console.log(err))

function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}