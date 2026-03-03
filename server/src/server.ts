import app from "./app.js"
import {prisma} from "./infra/client.js"
const PORT = 3000
async function main() {

    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    });
}

main()
    .catch(e=>{
        console.error(e.message);
    })
    .finally(async()=>{
        await prisma.$disconnect();
    })