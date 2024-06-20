import fs from "fs"
const unCrawled = []
const fromIndex = 100000
const toIndex = 199000
const resultDir = "./dist"

if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir)
    for (let i = fromIndex; i < toIndex; i++) {
        unCrawled.push(i)
    }
} else {
    for (let i = fromIndex; i < toIndex; i++) {
        if (!fs.existsSync(`${resultDir}/${i}.json`)) {
            console.log(i)
            unCrawled.push(i)
        }
    }
}
fs.writeFileSync(`unCrawled.json`, JSON.stringify(unCrawled, null, 2))