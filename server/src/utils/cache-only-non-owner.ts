const cacheOnlyNonOwner = (req: any, res: any) => {
    const { uid } = req.headers;
    const { userUid } = req.query;
    const { userUid: paramUserUid } = req.params;
    return ((uid !== userUid && uid !== paramUserUid) && res.statusCode === 200)
}

export default cacheOnlyNonOwner;