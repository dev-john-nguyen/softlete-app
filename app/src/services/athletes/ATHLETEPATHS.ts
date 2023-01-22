export default {
    search: (username: string) => `api/athletes/search?username=${username}`,
    get: (username: string, userUid?: string) => `api/athletes/get?username=${username}&userUid=${userUid}`,
    getBulk: (userUids: string[]) => {
        let strArr = ``;
        userUids.forEach(id => {
            strArr += `userUids=${id}&`
        })
        return `api/athletes/get/bulk?${strArr}`
    }
}