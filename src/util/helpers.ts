const faker=require("faker");

export function getExpiryDate(ttl:number){
    return new Date(Date.now()+ttl*1000);
}

export function getRandomData() {
    return faker.lorem.word()
}