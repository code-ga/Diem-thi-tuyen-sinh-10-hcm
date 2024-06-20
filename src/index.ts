
import fs from "fs"
import path from "path"
import { Worker } from "worker_threads"


const resultDir = "./dist"

if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir)
}

const NUMBER_OF_THREADS = 6

const unCrawledList = JSON.parse(fs.readFileSync("./unCrawled.json", "utf8")) as number[]
const studentPerThread = Math.ceil(unCrawledList.length / NUMBER_OF_THREADS)

function runWorker({ unCrawledList, id }: { unCrawledList: number[], id: number }) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, "./worker.js"), {
            workerData: { unCrawled: unCrawledList, resultDir, id }
        });
        worker.on('message', console.log);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
            console.log(`Worker stopped with exit code ${code}`);
            resolve(code);
        });
    })
}

const main = async () => {
    // slice unCrawledList into chunks
    for (let i = 0; i < NUMBER_OF_THREADS; i++) {
        const chunk = unCrawledList.slice(i * studentPerThread, (i + 1) * studentPerThread)
        runWorker({ unCrawledList: chunk, id: i })
    }
}

main().then(() => console.log("DONE")).catch(err => console.log(err))

