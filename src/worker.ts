import axios from "axios"
import { workerData } from "worker_threads"
import fs from "fs"

const main = async () => {
    const unCrawled = workerData.unCrawled
    const resultDir = workerData.resultDir
    const id = workerData.id
    while (true) {
        const i = unCrawled.shift()
        if (!i) break
        try {
            const result = await axios.get(`https://s6.tuoitre.vn/api/diem-thi-lop-10.htm?keywords=${i}&year=2024&sitename=tuoitre.vn`, {
                headers: {
                    "Origin": "https://tuoitre.vn"
                }
            })
            fs.writeFileSync(`${resultDir}/${i}.json`, JSON.stringify(result.data, null, 2))
            const student = result.data.data[0]
            console.log(`[id: ${id}] Fetched success student ${i} - ${student.HO_TEN} - Total score: ${student.TONGDIEM} - ${student.NGAY_SINH}`)
        } catch (error) {
            fs.writeFileSync(`${resultDir}/${i}.json`, JSON.stringify(error, null, 2))
            console.log(`[id: ${id}] Fetched failed student ${i} - ${error}`)
        }
    }
}

main().then(() => console.log("DONE")).catch(err => console.log(err))
