import { MeiliSearch } from "meilisearch"
import fs from "fs"

const dataDir = "./dist"
const client = new MeiliSearch({ host: "http://10.29.4.1:7700/", apiKey: process.env.MEILI_KEY })

const main = async () => {
    const index = await client.getIndex(process.env.MEILI_INDEX || "Diem-thi-tuyen-sinh-10-NGHEAN")
    let i = 0
    let students = []
    for (const file of fs.readdirSync(dataDir)) {
        if (file.endsWith(".json")) {
            const data = JSON.parse(fs.readFileSync(`${dataDir}/${file}`, "utf8"))
            for (const student of data.data) {
                students.push(student)
                console.log(`ADDED success student ${student.SBD} - ${student.HO_TEN}`)
            }


        }
        if (i % 200 === 0) {
            await index.addDocuments(students)
            students = []
            console.log(`ADDED ${i} students to meili`)
        }
        i++
    }
    if (students.length > 0) {
        await index.addDocuments(students)
    }
    console.log(`ADDED ${i} students to meili`)
}

main().then(() => console.log("DONE")).catch(err => console.log(err))