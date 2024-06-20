import fs from "fs"
const resultDir = "./dist"

if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir)
    console.log("DONE")
}

const invalid = []
for (const file of fs.readdirSync(resultDir)) {
    if (file.endsWith(".json")) {
        const data = JSON.parse(fs.readFileSync(`${resultDir}/${file}`, "utf8"))
        if (!data.data || data.data.length === 0) {
            fs.unlinkSync(`${resultDir}/${file}`)
            console.log(`${file} - ${data.data ? data.data.length : 0} is invalid`)
            invalid.push(file)
            continue;
        }
        console.log(`${file} - ${data.data.length} is valid`)
    }
}

console.log(invalid)

fs.writeFileSync(`invalid.json`, JSON.stringify(invalid, null, 2))