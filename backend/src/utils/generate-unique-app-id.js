import ApplicationDAO from "../dao/application.dao.js";

function generateId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const datePart = year + month + day;

    const randomNum = Math.floor(Math.random() * 1000000);
    const randomPart = String(randomNum).padStart(6, "0");
    return datePart + randomPart;
}

async function checkAppIdExists(appId) {
    const result = await ApplicationDAO.findById(appId);
    return !!result;
}

export default async function generateUniqueAppId() {
    let idExists = true;
    let uniqueId = undefined;
    while (idExists) {
        uniqueId = generateId();
        idExists = await checkAppIdExists(uniqueId);
    }

    return uniqueId;
}
